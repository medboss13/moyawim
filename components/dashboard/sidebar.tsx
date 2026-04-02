"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Home,
  ListTodo,
  PlusCircle,
  Users,
  MessageSquare,
  User,
  LogOut,
  Search,
  Inbox,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  Zap,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

const employerNav = [
  { section: "Principal" },
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Mes taches", href: "/dashboard/missions", icon: ListTodo },
  { label: "Publier une tache", href: "/dashboard/post", icon: PlusCircle },
  { section: "Communication" },
  { label: "Travailleurs", href: "/dashboard/workers", icon: Users },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 3 },
  { section: "Compte" },
  { label: "Mon profil", href: "/dashboard/profile", icon: User },
  { label: "Parametres", href: "/dashboard/settings", icon: Settings },
]

const workerNav = [
  { section: "Principal" },
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Trouver des taches", href: "/dashboard/available", icon: Search },
  { label: "Mes candidatures", href: "/dashboard/applications", icon: Inbox },
  { section: "Finances" },
  { label: "Mes revenus", href: "/dashboard/revenue", icon: Wallet },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 2 },
  { section: "Compte" },
  { label: "Mon profil", href: "/dashboard/profile", icon: User },
  { label: "Parametres", href: "/dashboard/settings", icon: Settings },
]

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "offer",
    title: "Nouvelle offre recue",
    body: "Khalid M. a fait une offre de 250 DH pour votre tache 'Reparation plomberie'",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
  },
  {
    id: "2",
    type: "message",
    title: "Nouveau message",
    body: "Fatima Z. vous a envoye un message",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: "3",
    type: "review",
    title: "Nouvel avis",
    body: "Vous avez recu un avis 5 etoiles de Ahmed B.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "4",
    type: "task_update",
    title: "Tache terminee",
    body: "La tache 'Menage appartement' a ete marquee comme terminee",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "offer":
      return <Zap className="w-4 h-4 text-orange" />
    case "message":
      return <MessageSquare className="w-4 h-4 text-navy" />
    case "review":
      return <Star className="w-4 h-4 text-orange" />
    case "task_update":
      return <CheckCircle2 className="w-4 h-4 text-success" />
    default:
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "A l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return "Hier"
  return `Il y a ${diffDays} jours`
}

export function DashboardSidebar() {
  const { user, userData, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notifOpen, setNotifOpen] = useState(false)

  const name = userData?.name || user?.displayName || user?.email?.split("@")[0] || "Utilisateur"
  const initial = name.charAt(0).toUpperCase()
  const isWorker = userData?.role === "worker"
  const nav = isWorker ? workerNav : employerNav
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = async () => {
    await signOut()
    toast.info("Deconnecte")
    router.push("/")
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <aside className="hidden md:flex w-[260px] flex-col bg-navy flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-navy-light rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path
                d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z"
                fill="#f47920"
              />
              <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
              <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
            </svg>
          </div>
          <span className="font-serif text-xl font-extrabold text-white">
            Moyawim<span className="text-orange">.ma</span>
          </span>
        </Link>
      </div>

      {/* User Card */}
      <div className="px-4 py-4 border-b border-white/[0.07]">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center font-serif text-lg font-extrabold text-white flex-shrink-0 ring-2 ring-white/10">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">{name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isWorker ? "bg-success" : "bg-orange"}`} />
              <span className="text-[11px] text-white/40">
                {isWorker ? "Travailleur" : "Employeur"}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </Link>

        {/* Notifications button */}
        <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
          <SheetTrigger asChild>
            <button className="w-full mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
              <div className="relative">
                <Bell className="w-5 h-5 text-white/60" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-sm text-white/60">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="ml-auto bg-orange/20 text-orange hover:bg-orange/20 text-[10px]">
                  {unreadCount} new
                </Badge>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[360px] bg-navy border-white/10 p-0">
            <SheetHeader className="px-5 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-white font-serif">Notifications</SheetTitle>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs text-white/50 hover:text-white hover:bg-white/10"
                  >
                    Tout marquer lu
                  </Button>
                )}
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-3">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl transition-colors",
                          notif.read 
                            ? "bg-white/[0.02] hover:bg-white/[0.05]" 
                            : "bg-orange/10 hover:bg-orange/15"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                            notif.read ? "bg-white/10" : "bg-orange/20"
                          )}>
                            <NotificationIcon type={notif.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn(
                                "text-sm font-medium truncate",
                                notif.read ? "text-white/60" : "text-white"
                              )}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-2 h-2 bg-orange rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-white/40 line-clamp-2 mt-0.5">
                              {notif.body}
                            </p>
                            <p className="text-[10px] text-white/30 mt-1.5">
                              {formatTimeAgo(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map((item, i) => {
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
              className={cn(
                "flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                isActive
                  ? "bg-orange/15 text-orange"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/85"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "opacity-100" : "opacity-70")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge className="bg-orange text-white text-[10px] px-1.5 min-w-[20px] h-5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.07] space-y-2">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 text-[13px] hover:bg-white/[0.04] hover:text-white/60 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          Aide & Support
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-white/40 text-[13px] px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  )
}
