"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && userData) {
      router.push("/dashboard")
    }
  }, [user, userData, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (user && userData) {
    return null
  }

  return <LandingPage />
}
