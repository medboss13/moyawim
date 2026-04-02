"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAllMissions, useApplyToMission } from "@/lib/firebase-hooks"

const CAT_ICONS: Record<string, string> = {
  "BTP & Construction": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop",
  "Nettoyage & Ménage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop",
  "Jardinage & Espaces verts": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop",
  default: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=80&h=80&fit=crop",
}

export default function AvailableMissionsPage() {
  const { missions, loading } = useAllMissions()
  const { apply } = useApplyToMission()
  const [search, setSearch] = useState("")
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  const filteredMissions = search
    ? missions.filter(
        (m) =>
          m.title?.toLowerCase().includes(search.toLowerCase()) ||
          m.cat?.toLowerCase().includes(search.toLowerCase()) ||
          m.addr?.toLowerCase().includes(search.toLowerCase())
      )
    : missions

  const handleApply = async (missionId: string) => {
    setApplyingId(missionId)
    try {
      await apply(missionId)
      setAppliedIds((prev) => new Set(prev).add(missionId))
      toast.success("Candidature envoyée !")
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(message)
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl lg:text-[26px] font-extrabold text-navy">
            Missions disponibles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toutes les missions actives — postulez en un clic
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-[220px]"
          />
        </div>
      </div>

      {/* Missions List */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chargement...</div>
          ) : filteredMissions.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-10 h-10 mx-auto text-muted-foreground/25 mb-4" />
              <p className="text-sm text-muted-foreground">
                {search ? "Aucune mission trouvée." : "Aucune mission disponible."}
              </p>
            </div>
          ) : (
            filteredMissions.map((m) => {
              const isApplied = appliedIds.has(m.id)
              const isApplying = applyingId === m.id

              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3.5 px-5 py-3.5 border-b last:border-0 hover:bg-cream transition-colors"
                >
                  <Image
                    src={CAT_ICONS[m.cat] || CAT_ICONS.default}
                    alt=""
                    width={42}
                    height={42}
                    className="w-[42px] h-[42px] rounded-[10px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy truncate">
                      {m.title || "Sans titre"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {m.cat || "—"} · {m.addr || "—"} · {m.date || "Dès que possible"}
                    </div>
                  </div>
                  <Badge className="bg-orange/10 text-orange hover:bg-orange/10">Nouveau</Badge>
                  <span className="font-serif text-sm font-extrabold text-navy min-w-[80px] text-right">
                    {m.budget || "—"}
                  </span>
                  <Button
                    size="sm"
                    disabled={isApplied || isApplying}
                    onClick={() => handleApply(m.id)}
                    className={
                      isApplied
                        ? "bg-muted text-success hover:bg-muted"
                        : "bg-navy hover:bg-orange"
                    }
                  >
                    {isApplying ? "..." : isApplied ? "Postulé" : "Postuler"}
                  </Button>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
