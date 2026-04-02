"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X, Briefcase, Wrench } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Email déjà utilisé",
  "auth/weak-password": "Mot de passe trop court (min 6)",
  "auth/invalid-email": "Email invalide",
  "auth/user-not-found": "Aucun compte avec cet email",
  "auth/wrong-password": "Mot de passe incorrect",
  "auth/invalid-credential": "Email ou mot de passe incorrect",
}

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, completeGoogleSignUp } = useAuth()
  
  const [tab, setTab] = useState<"login" | "register">("login")
  const [role, setRole] = useState<UserRole>("employer")
  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register form
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error("Remplissez tous les champs")
      return
    }
    
    setLoading(true)
    try {
      await signIn(loginEmail, loginPassword)
      toast.success("Bon retour !")
      onOpenChange(false)
      router.push("/dashboard")
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || ""
      toast.error(ERROR_MESSAGES[code] || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) {
      toast.error("Remplissez tous les champs obligatoires")
      return
    }
    
    setLoading(true)
    try {
      await signUp(regEmail, regPassword, regName, role, regPhone)
      toast.success(`Compte créé ! Bienvenue ${regName}`)
      onOpenChange(false)
      router.push("/dashboard")
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || ""
      toast.error(ERROR_MESSAGES[code] || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      if (result === "new") {
        setShowRoleSelect(true)
      } else {
        toast.success("Connecté avec Google !")
        onOpenChange(false)
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur Google"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteGoogleSignUp = async (selectedRole: UserRole) => {
    setLoading(true)
    try {
      await completeGoogleSignUp(selectedRole)
      toast.success("Bienvenue !")
      setShowRoleSelect(false)
      onOpenChange(false)
      router.push("/dashboard")
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (showRoleSelect) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          <DialogHeader className="bg-navy p-8 pb-6 rounded-t-lg">
            <DialogTitle className="font-serif text-xl font-extrabold text-white text-center">
              Vous êtes... ?
            </DialogTitle>
            <DialogDescription className="text-white/45 text-sm text-center">
              Choisissez votre rôle pour personnaliser votre expérience
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCompleteGoogleSignUp("employer")}
                disabled={loading}
                className="border-2 border-border rounded-xl p-5 text-center hover:border-orange hover:bg-orange/5 transition-all disabled:opacity-50"
              >
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-navy" />
                <p className="font-bold text-navy text-sm">Employeur</p>
                <span className="text-xs text-muted-foreground">Je cherche des travailleurs</span>
              </button>
              <button
                onClick={() => handleCompleteGoogleSignUp("worker")}
                disabled={loading}
                className="border-2 border-border rounded-xl p-5 text-center hover:border-orange hover:bg-orange/5 transition-all disabled:opacity-50"
              >
                <Wrench className="w-8 h-8 mx-auto mb-2 text-navy" />
                <p className="font-bold text-navy text-sm">Travailleur</p>
                <span className="text-xs text-muted-foreground">Je propose mes services</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
        <DialogHeader className="bg-navy p-8 pb-6 rounded-t-lg relative">
          <DialogTitle className="font-serif text-xl font-extrabold text-white">
            {tab === "login" ? "Bon retour !" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription className="text-white/45 text-sm">
            {tab === "login"
              ? "Connectez-vous à votre compte Moyawim.ma"
              : "Rejoignez Moyawim.ma gratuitement"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-5 bg-cream-dark">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="l-email" className="text-xs font-bold text-navy uppercase tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="l-email"
                    type="email"
                    placeholder="email@exemple.ma"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border-cream-darker focus:border-orange focus:ring-orange/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-password" className="text-xs font-bold text-navy uppercase tracking-wider">
                    Mot de passe
                  </Label>
                  <Input
                    id="l-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border-cream-darker focus:border-orange focus:ring-orange/10"
                  />
                </div>
                <Button type="submit" className="w-full bg-navy hover:bg-orange" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream-darker" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground">
                  <span className="bg-card px-2">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuer avec Google
              </Button>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role selection */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`border-2 rounded-xl p-4 text-center transition-all ${
                      role === "employer"
                        ? "border-orange bg-orange/5"
                        : "border-border hover:border-orange/50"
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-1.5 text-navy" />
                    <p className="font-bold text-navy text-sm">Employeur</p>
                    <span className="text-[11px] text-muted-foreground">Je cherche</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`border-2 rounded-xl p-4 text-center transition-all ${
                      role === "worker"
                        ? "border-orange bg-orange/5"
                        : "border-border hover:border-orange/50"
                    }`}
                  >
                    <Wrench className="w-6 h-6 mx-auto mb-1.5 text-navy" />
                    <p className="font-bold text-navy text-sm">Travailleur</p>
                    <span className="text-[11px] text-muted-foreground">Je propose</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-name" className="text-xs font-bold text-navy uppercase tracking-wider">
                    Nom complet
                  </Label>
                  <Input
                    id="r-name"
                    placeholder="Votre nom complet"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="border-cream-darker focus:border-orange focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="r-email" className="text-xs font-bold text-navy uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="r-email"
                      type="email"
                      placeholder="email@exemple.ma"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="border-cream-darker focus:border-orange focus:ring-orange/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="r-phone" className="text-xs font-bold text-navy uppercase tracking-wider">
                      Téléphone
                    </Label>
                    <Input
                      id="r-phone"
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="border-cream-darker focus:border-orange focus:ring-orange/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-password" className="text-xs font-bold text-navy uppercase tracking-wider">
                    Mot de passe
                  </Label>
                  <Input
                    id="r-password"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="border-cream-darker focus:border-orange focus:ring-orange/10"
                  />
                </div>

                <Button type="submit" className="w-full bg-navy hover:bg-orange" disabled={loading}>
                  {loading ? "Création..." : "Créer mon compte"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream-darker" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground">
                  <span className="bg-card px-2">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuer avec Google
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
