"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type User,
} from "./firebase"
import type { UserData, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, role: UserRole, phone: string) => Promise<void>
  signInWithGoogle: () => Promise<"ok" | "new">
  completeGoogleSignUp: (role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingGoogleUser, setPendingGoogleUser] = useState<User | null>(null)
  const [skipAuthChange, setSkipAuthChange] = useState(false)

  const loadUserData = async (uid: string): Promise<UserData | null> => {
    for (let i = 0; i < 4; i++) {
      try {
        const d = await getDoc(doc(db, "users", uid))
        if (d.exists()) return d.data() as UserData
      } catch {
        // Retry
      }
      await new Promise((r) => setTimeout(r, 600))
    }
    return null
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (skipAuthChange) return
      
      setUser(firebaseUser)
      if (firebaseUser) {
        const data = await loadUserData(firebaseUser.uid)
        setUserData(data)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [skipAuthChange])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string, role: UserRole, phone: string) => {
    setSkipAuthChange(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const data: UserData = {
        name,
        email,
        role,
        phone: phone || "",
        createdAt: serverTimestamp() as UserData["createdAt"],
        verified: false,
        rating: 0,
        missionsCount: 0,
      }
      await setDoc(doc(db, "users", cred.user.uid), data)
      if (role === "worker") {
        await setDoc(doc(db, "workers", cred.user.uid), {
          ...data,
          job: "",
          price: 0,
          city: "",
          desc: "",
          available: true,
          exp: 0,
        })
      }
      setUser(cred.user)
      setUserData(data)
    } finally {
      setSkipAuthChange(false)
    }
  }

  const signInWithGoogle = async (): Promise<"ok" | "new"> => {
    setSkipAuthChange(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      const existingData = await loadUserData(result.user.uid)
      if (!existingData) {
        setPendingGoogleUser(result.user)
        return "new"
      }
      setUserData(existingData)
      setSkipAuthChange(false)
      return "ok"
    } catch (error) {
      setSkipAuthChange(false)
      throw error
    }
  }

  const completeGoogleSignUp = async (role: UserRole) => {
    const u = pendingGoogleUser
    if (!u) throw new Error("Session expirée, réessayez")
    
    const data: UserData = {
      name: u.displayName || u.email?.split("@")[0] || "Utilisateur",
      email: u.email || "",
      role,
      phone: "",
      createdAt: serverTimestamp() as UserData["createdAt"],
      verified: false,
      rating: 0,
      missionsCount: 0,
    }
    await setDoc(doc(db, "users", u.uid), data)
    if (role === "worker") {
      await setDoc(doc(db, "workers", u.uid), {
        ...data,
        job: "",
        price: 0,
        city: "",
        desc: "",
        available: true,
        exp: 0,
      })
    }
    setUser(u)
    setUserData(data)
    setPendingGoogleUser(null)
    setSkipAuthChange(false)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setUserData(null)
  }

  const refreshUserData = async () => {
    if (user) {
      const data = await loadUserData(user.uid)
      setUserData(data)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        completeGoogleSignUp,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
