"use client"

import Link from "next/link"
import { MapPin, Calendar, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import {
  useAllMissions,
  useWorkerProfile,
  useSaveWorkerProfile,
} from "@/lib/firebase-hooks"

// Category emojis for simple mode
const CAT_EMOJIS: Record<string, string> = {
  "BTP & Construction": "🔨",
  "construction": "🔨",
  "Nettoyage & Ménage": "🧹",
  "cleaning": "🧹",
  "Jardinage & Espaces verts": "🌿",
  "Jardinage": "🌿",
  "gardening": "🌿",
  "Demenagement": "📦",
  "moving": "📦",
  "Evenementiel": "🎉",
  "events": "🎉",
  default: "⚙️",
}

export function WorkerSimpleDashboard() {
  const { user, userData } = useAuth()
  const { tasks: missions = [], loading: missionsLoading } = useAllMissions()
  const { profile, refreshProfile } = useWorkerProfile()
  const { saveWorker } = useSaveWorkerProfile()

  const name = userData?.name || user?.displayName || "Utilisateur"
  const firstName = name.split(" ")[0]
  const isAvailable = profile?.available !== false

  const handleToggleAvailable = async (checked: boolean) => {
    try {
      await saveWorker({ available: checked })
      await refreshProfile()
      toast.success(checked ? "Vous etes maintenant disponible" : "Vous etes maintenant indisponible")
    } catch {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const getCategoryEmoji = (cat: string): string => {
    return CAT_EMOJIS[cat] || CAT_EMOJIS.default
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      {/* Welcome Header - Simple and large */}
      <div className="mb-8">
        <p className="text-2xl font-bold text-navy mb-2" dir="rtl">
          مرحبا، {firstName}!
        </p>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace travailleur
        </p>
      </div>

      {/* Large Availability Toggle */}
      <Card className={`mb-8 ${isAvailable ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAvailable ? "bg-success" : "bg-destructive"}`}>
                <div className={`w-4 h-4 rounded-full bg-white ${isAvailable ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-navy">
                  {isAvailable ? "Disponible" : "Indisponible"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "Vous recevez des offres" : "Vous ne recevez pas d'offres"}
                </p>
              </div>
            </div>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={handleToggleAvailable}
              className="scale-150"
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Missions - Simple cards with large touch targets */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-navy">
            Missions disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {missionsLoading ? (
            <div className="py-8 text-center text-muted-foreground">Chargement...</div>
          ) : missions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xl font-bold text-navy mb-2">Aucune mission</p>
              <p className="text-muted-foreground">De nouvelles missions arrivent bientot</p>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.slice(0, 6).map((m) => (
                <SimpleMissionCard
                  key={m.id}
                  id={m.id}
                  title={m.title || "Mission"}
                  category={m.cat || ""}
                  emoji={getCategoryEmoji(m.cat || "")}
                  location={m.addr || "Non specifie"}
                  date={m.date || "Flexible"}
                  budget={m.budget || "A discuter"}
                  urgent={m.urgent}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface SimpleMissionCardProps {
  id: string
  title: string
  category: string
  emoji: string
  location: string
  date: string
  budget: string
  urgent?: boolean
}

function SimpleMissionCard({ id, title, category, emoji, location, date, budget, urgent }: SimpleMissionCardProps) {
  return (
    <Link href={`/tasks/${id}`} className="block">
      <div className="min-h-[100px] bg-cream rounded-xl p-4 hover:bg-cream-dark transition-colors active:scale-[0.99]">
        <div className="flex items-start gap-4">
          {/* Emoji */}
          <div className="text-4xl flex-shrink-0">
            {emoji}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and urgent badge */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-lg font-bold text-navy leading-tight">
                {title}
              </h3>
              {urgent && (
                <span className="flex-shrink-0 bg-destructive text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Urgent
                </span>
              )}
            </div>
            
            {/* Location and date */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
            </div>
            
            {/* Price and Apply button */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange">
                {budget}
              </span>
              <Button className="bg-navy hover:bg-orange h-12 px-6 text-base font-bold">
                Postuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
