"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  Search, Inbox, CheckCircle, TrendingUp, Wallet, Star, 
  Clock, MapPin, MessageSquare, ArrowUpRight, Zap, ChevronRight,
  Eye, Calendar, Target, Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import {
  useAllMissions,
  useMyApplications,
  useWorkerProfile,
  useSaveWorkerProfile,
} from "@/lib/firebase-hooks"
import { toast } from "sonner"

const CAT_ICONS: Record<string, string> = {
  "BTP & Construction": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop",
  "Nettoyage & Ménage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop",
  "Jardinage & Espaces verts": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop",
  default: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=80&h=80&fit=crop",
}

export function WorkerDashboard() {
  const { user, userData } = useAuth()
const { tasks: missions = [], loading: missionsLoading } = useAllMissions()
const { offers: applications = [], loading: appsLoading } = useMyApplications() 
  const { profile, refreshProfile } = useWorkerProfile()
  const { saveWorker } = useSaveWorkerProfile()

  const name = userData?.name || user?.displayName || "Utilisateur"
  const firstName = name.split(" ")[0]
  const acceptedApps = applications.filter((a) => a.status === "accepted").length
  const pendingApps = applications.filter((a) => a.status === "pending").length
  const rejectedApps = applications.filter((a) => a.status === "rejected").length
  const isAvailable = profile?.available !== false
  const totalEarned = userData?.totalEarned || acceptedApps * (profile?.price || 150)
  const rating = userData?.rating || profile?.rating || 4.5
  const reviewsCount = userData?.reviewsCount || 0
  const completionRate = userData?.completionRate || 95

  // Get current hour for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon apres-midi" : "Bonsoir"

  const handleToggleAvailable = async (checked: boolean) => {
    try {
      await saveWorker({ available: checked })
      await refreshProfile()
      toast.success(checked ? "Vous etes maintenant disponible" : "Vous etes maintenant indisponible")
    } catch {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
          <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-2">
            {firstName}
          </h1>
          <p className="text-muted-foreground">
            Votre espace travailleur - Trouvez des missions et gerez vos candidatures.
          </p>
        </div>
        
        {/* Availability Toggle Card */}
        <Card className={`${isAvailable ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAvailable ? "bg-success" : "bg-destructive"}`}>
              <div className={`w-3 h-3 rounded-full bg-white ${isAvailable ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-navy">Statut de disponibilite</p>
              <p className={`text-xs ${isAvailable ? "text-success" : "text-destructive"}`}>
                {isAvailable ? "Vous recevez des offres" : "Vous ne recevez pas d'offres"}
              </p>
            </div>
            <Switch checked={isAvailable} onCheckedChange={handleToggleAvailable} />
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Revenus totaux</p>
                <p className="font-serif text-2xl font-extrabold text-navy">{totalEarned} <span className="text-sm">DH</span></p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Ce mois
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Note moyenne</p>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-2xl font-extrabold text-navy">{rating.toFixed(1)}</p>
                  <Star className="w-5 h-5 fill-orange text-orange" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">{reviewsCount} avis</p>
              </div>
              <div className="w-10 h-10 bg-orange/10 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Taches acceptees</p>
                <p className="font-serif text-2xl font-extrabold text-navy">{acceptedApps}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-[10px] bg-orange/10 text-orange">
                    {pendingApps} en attente
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-navy" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Taux de reussite</p>
                <p className="font-serif text-2xl font-extrabold text-navy">{completionRate}%</p>
                <div className="mt-2">
                  <Progress value={completionRate} className="h-1.5 w-20" />
                </div>
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Performance</CardTitle>
            <CardDescription>Votre progression ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Candidatures envoyees</span>
                  <span className="font-medium">{applications.length}</span>
                </div>
                <Progress value={Math.min(applications.length * 5, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taux d&apos;acceptation</span>
                  <span className="font-medium">
                    {applications.length > 0 ? Math.round((acceptedApps / applications.length) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={applications.length > 0 ? (acceptedApps / applications.length) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Temps de reponse moyen</span>
                  <span className="font-medium">2h</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/available" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange/5 hover:bg-orange/10 transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-orange rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Chercher des taches</p>
                  <p className="text-xs text-muted-foreground">{missions.length} disponibles</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/dashboard/applications" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-navy/5 hover:bg-navy/10 transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
                  <Inbox className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Mes candidatures</p>
                  <p className="text-xs text-muted-foreground">{pendingApps} en attente</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/dashboard/profile" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cream hover:bg-cream-dark transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-success rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">Mon profil</p>
                  <p className="text-xs text-muted-foreground">Ameliorez votre visibilite</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Missions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Taches recommandees</CardTitle>
              <CardDescription>Basees sur vos competences</CardDescription>
            </div>
            <Link href="/dashboard/available">
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
                  <Search className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-navy mb-1">Aucune tache disponible</p>
                <p className="text-xs text-muted-foreground">De nouvelles taches arrivent bientot</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missions.slice(0, 4).map((m) => (
                  <Link
                    key={m.id}
                    href={`/tasks/${m.id}`}
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
                        {m.urgent && (
                          <Badge className="bg-destructive/10 text-destructive text-[10px]">
                            <Zap className="w-3 h-3 mr-0.5" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {m.addr || "Non specifie"}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {m.date || "Flexible"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm font-bold text-navy block">
                        {m.budget || "—"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] mt-1 bg-orange/10 text-orange">
                        Nouveau
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Mes candidatures</CardTitle>
              <CardDescription>{applications.length} candidatures au total</CardDescription>
            </div>
            <Link href="/dashboard/applications">
              <Button variant="outline" size="sm">
                Voir toutes
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Chargement...</div>
            ) : applications.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-navy mb-1">Aucune candidature</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Parcourez les taches et postulez
                </p>
                <Link href="/dashboard/available">
                  <Button size="sm" className="bg-orange hover:bg-orange-hover">
                    <Search className="w-4 h-4 mr-1" />
                    Trouver des taches
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      a.status === "accepted" 
                        ? "bg-success/5 border border-success/20" 
                        : a.status === "rejected"
                        ? "bg-destructive/5 border border-destructive/20"
                        : "bg-cream/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      a.status === "accepted" 
                        ? "bg-success/10" 
                        : a.status === "rejected"
                        ? "bg-destructive/10"
                        : "bg-orange/10"
                    }`}>
                      {a.status === "accepted" ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : a.status === "rejected" ? (
                        <Clock className="w-5 h-5 text-destructive" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {a.missionTitle || `Mission #${(a.missionId || "").slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.appliedAt?.toDate
                          ? `Postule le ${a.appliedAt.toDate().toLocaleDateString("fr-FR")}`
                          : "Postule recemment"}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        a.status === "accepted"
                          ? "bg-success/10 text-success"
                          : a.status === "rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-orange/10 text-orange"
                      }`}
                    >
                      {a.status === "accepted"
                        ? "Acceptee"
                        : a.status === "rejected"
                        ? "Refusee"
                        : "En attente"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
