"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, ListTodo, PlusCircle, Users, MessageSquare, User, 
  Search, Menu, Bell, Settings, LogOut, Inbox, Wallet
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Mobile navigation items for employers
const employerMobileNav = [
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Taches", href: "/dashboard/missions", icon: ListTodo },
  { label: "Poster", href: "/dashboard/post", icon: PlusCircle, highlight: true },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 3 },
  { label: "Profil", href: "/dashboard/profile", icon: User },
]

// Mobile navigation items for workers
const workerMobileNav = [
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Taches", href: "/dashboard/available", icon: Search },
  { label: "Candidatures", href: "/dashboard/applications", icon: Inbox },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 2 },
  { label: "Profil", href: "/dashboard/profile", icon: User },
]

// Sidebar items for mobile sheet
const employerSidebarNav = [
  { section: "Principal" },
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Mes taches", href: "/dashboard/missions", icon: ListTodo },
  { label: "Publier une tache", href: "/dashboard/post", icon: PlusCircle },
  { section: "Communication" },
  { label: "Travailleurs", href: "/dashboard/workers", icon: Users },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { section: "Compte" },
  { label: "Mon profil", href: "/dashboard/profile", icon: User },
  { label: "Parametres", href: "/dashboard/settings", icon: Settings },
]

const workerSidebarNav = [
  { section: "Principal" },
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Trouver des taches", href: "/dashboard/available", icon: Search },
  { label: "Mes candidatures", href: "/dashboard/applications", icon: Inbox },
  { section: "Finances" },
  { label: "Mes revenus", href: "/dashboard/revenue", icon: Wallet },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { section: "Compte" },
  { label: "Mon profil", href: "/dashboard/profile", icon: User },
  { label: "Parametres", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isWorker = userData?.role === "worker"
  const mobileNav = isWorker ? workerMobileNav : employerMobileNav
  const sidebarNav = isWorker ? workerSidebarNav : employerSidebarNav
  const name = userData?.name || user?.displayName || "Utilisateur"
  const initial = name.charAt(0).toUpperCase()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await signOut()
    toast.info("Deconnecte")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-navy text-white">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-light rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
              </svg>
            </div>
            <span className="font-serif text-base font-bold">
              Moyawim<span className="text-orange">.ma</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange rounded-full" />
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 bg-navy border-white/10">
                <SheetHeader className="p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-orange">
                      <AvatarFallback className="bg-gradient-to-br from-orange to-orange-hover text-white font-bold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-white font-semibold text-left">{name}</SheetTitle>
                      <p className="text-xs text-white/50">{isWorker ? "Travailleur" : "Employeur"}</p>
                    </div>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="py-3">
                    {sidebarNav.map((item, i) => {
                      if ("section" in item) {
                        return (
                          <div
                            key={i}
                            className="px-5 pt-4 pb-2 text-[10px] font-bold text-white/25 uppercase tracking-widest"
                          >
                            {item.section}
                          </div>
                        )
                      }

                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                            isActive
                              ? "bg-orange/15 text-orange"
                              : "text-white/50 hover:bg-white/[0.06] hover:text-white/85"
                          )}
                        >
                          <Icon className="w-[18px] h-[18px]" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-navy">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-white/40 text-sm w-full px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Deconnexion
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="flex items-center justify-around py-2">
            {mobileNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center -mt-5"
                  >
                    <div className="w-14 h-14 bg-orange rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] text-orange font-medium mt-1">{item.label}</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center py-2 px-3"
                >
                  <div className="relative">
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-orange" : "text-muted-foreground"
                    )} />
                    {item.badge && item.badge > 0 && (
                      <Badge className="absolute -top-1.5 -right-1.5 w-4 h-4 p-0 flex items-center justify-center bg-orange text-white text-[8px]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 transition-colors",
                    isActive ? "text-orange font-medium" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
