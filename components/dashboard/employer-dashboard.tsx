"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  Plus, ListTodo, Users, CheckCircle, FileText, TrendingUp, 
  Clock, Star, ArrowUpRight, ArrowDownRight, Eye, MessageSquare,
  Calendar, MapPin, Zap, ChevronRight, BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useMyMissions, useWorkers } from "@/lib/firebase-hooks"

const CAT_ICONS: Record<string, string> = {
  "BTP & Construction": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop",
  "Nettoyage & Ménage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop",
  "Jardinage & Espaces verts": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop",
  default: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=80&h=80&fit=crop",
}

const W_PHOTOS = [
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=200&fit=crop&crop=top",
]

// Quick actions for employers
const quickActions = [
  { label: "Publier une tache", href: "/dashboard/post", icon: Plus, color: "bg-orange" },
  { label: "Voir les offres", href: "/dashboard/missions", icon: MessageSquare, color: "bg-navy" },
  { label: "Trouver un pro", href: "/dashboard/workers", icon: Users, color: "bg-success" },
]

export function EmployerDashboard() {
  const { user, userData } = useAuth()
  const { missions, loading: missionsLoading } = useMyMissions()
  const { workers, loading: workersLoading } = useWorkers()

  const name = userData?.name || user?.displayName || "Utilisateur"
  const firstName = name.split(" ")[0]
  const activeMissions = missions.filter((m) => m.status === "active").length
  const doneMissions = missions.filter((m) => m.status === "done").length
  const pendingMissions = missions.filter((m) => m.status === "pending").length
  const totalApplicants = missions.reduce((a, m) => a + (m.applicants?.length || 0), 0)
  const totalSpent = userData?.totalSpent || 0
  const avgRating = userData?.rating || 4.8

  // Get current hour for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon apres-midi" : "Bonsoir"

  return (
    <div className="p-6 lg:p-8">
      {/* Header with welcome */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
          <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-2">
            {firstName}
          </h1>
          <p className="text-muted-foreground">
            Voici un apercu de votre activite et de vos taches en cours.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="gap-2 hover:border-orange hover:text-orange">
                  <Icon className="w-4 h-4" />
                  {action.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Taches actives</p>
                <p className="font-serif text-3xl font-extrabold text-navy">{activeMissions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px] bg-orange/10 text-orange">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    En cours
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Terminees</p>
                <p className="font-serif text-3xl font-extrabold text-success">{doneMissions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completees
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Offres recues</p>
                <p className="font-serif text-3xl font-extrabold text-navy">{totalApplicants}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    A evaluer
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-navy" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Total depense</p>
                <p className="font-serif text-3xl font-extrabold text-navy">{totalSpent} <span className="text-lg">DH</span></p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-orange text-orange" />
                    <span className="text-xs font-medium">{avgRating}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">note employeur</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Apercu de l&apos;activite</CardTitle>
            <CardDescription>Progression de vos taches ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taches publiees</span>
                  <span className="font-medium">{missions.length}</span>
                </div>
                <Progress value={Math.min(missions.length * 10, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taux de completion</span>
                  <span className="font-medium">
                    {missions.length > 0 ? Math.round((doneMissions / missions.length) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={missions.length > 0 ? (doneMissions / missions.length) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Offres par tache (moy)</span>
                  <span className="font-medium">
                    {activeMissions > 0 ? Math.round(totalApplicants / activeMissions) : 0}
                  </span>
                </div>
                <Progress 
                  value={Math.min((totalApplicants / Math.max(activeMissions, 1)) * 20, 100)} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/post" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange/5 hover:bg-orange/10 transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-orange rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Nouvelle tache</p>
                  <p className="text-xs text-muted-foreground">Publiez en 2 min</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/browse" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-navy/5 hover:bg-navy/10 transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Trouver un pro</p>
                  <p className="text-xs text-muted-foreground">{workers.length}+ disponibles</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/dashboard/messages" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cream hover:bg-cream-dark transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-success rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Messages</p>
                  <p className="text-xs text-muted-foreground">Voir les conversations</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Missions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Mes taches recentes</CardTitle>
              <CardDescription>{missions.length} taches au total</CardDescription>
            </div>
            <Link href="/dashboard/missions">
              <Button variant="outline" size="sm">
                Voir toutes
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {missionsLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Chargement...</div>
            ) : missions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
                  <ListTodo className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-navy mb-1">Aucune tache publiee</p>
                <p className="text-xs text-muted-foreground mb-4">Publiez votre premiere tache pour recevoir des offres</p>
                <Link href="/dashboard/post">
                  <Button size="sm" className="bg-orange hover:bg-orange-hover">
                    <Plus className="w-4 h-4 mr-1" />
                    Publier une tache
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {missions.slice(0, 5).map((m) => (
                  <Link
                    key={m.id}
                    href={`/dashboard/missions?id=${m.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-cream/50 hover:bg-cream transition-colors"
                  >
                    <Image
                      src={CAT_ICONS[m.cat] || CAT_ICONS.default}
                      alt=""
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy truncate">
                          {m.title || "Sans titre"}
                        </span>
                        {m.status === "active" && (
                          <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {m.addr || "Non specifie"}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {m.applicants?.length || 0} offres
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm font-bold text-navy block">
                        {m.budget || "—"}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] mt-1 ${
                          m.status === "active"
                            ? "bg-orange/10 text-orange"
                            : m.status === "done"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.status === "active" ? "Active" : m.status === "done" ? "Terminee" : "En attente"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Travailleurs recommandes</CardTitle>
              <CardDescription>Professionnels disponibles pres de chez vous</CardDescription>
            </div>
            <Link href="/dashboard/workers">
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {workersLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Chargement...</div>
            ) : workers.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-navy mb-1">Aucun travailleur disponible</p>
                <p className="text-xs text-muted-foreground">Les travailleurs apparaitront ici bientot</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {workers.slice(0, 4).map((w, i) => (
                  <Link
                    key={w.id}
                    href={`/dashboard/workers?id=${w.id}`}
                    className="group relative bg-cream rounded-xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <Image
                      src={W_PHOTOS[i % W_PHOTOS.length]}
                      alt={w.name}
                      width={300}
                      height={100}
                      className="w-full h-24 object-cover object-top group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="font-semibold text-white text-sm truncate">
                        {w.name || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/80">
                        <span className="truncate">{w.job || "—"}</span>
                        {w.rating && (
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-orange text-orange" />
                            {w.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    {w.available !== false && (
                      <div className="absolute top-2 right-2">
                        <span className="w-2.5 h-2.5 bg-success rounded-full block ring-2 ring-white" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
