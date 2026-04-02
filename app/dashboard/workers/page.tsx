"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Users, MessageSquare, X, Shield, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWorkers } from "@/lib/firebase-hooks"
import type { WorkerData } from "@/lib/types"
import Link from "next/link"

const W_PHOTOS = [
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=200&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=top",
]

export default function WorkersPage() {
  const { workers, loading } = useWorkers()
  const [search, setSearch] = useState("")
  const [selectedWorker, setSelectedWorker] = useState<(WorkerData & { id: string; photoIndex: number }) | null>(null)

  const filteredWorkers = search
    ? workers.filter(
        (w) =>
          w.name?.toLowerCase().includes(search.toLowerCase()) ||
          w.job?.toLowerCase().includes(search.toLowerCase()) ||
          w.city?.toLowerCase().includes(search.toLowerCase())
      )
    : workers

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl lg:text-[26px] font-extrabold text-navy">
            Travailleurs disponibles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tous vérifiés CNIE, notés par la communauté
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

      {/* Workers Grid */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Chargement...</div>
      ) : filteredWorkers.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="w-10 h-10 mx-auto text-muted-foreground/25 mb-4" />
          <p className="text-sm text-muted-foreground">
            {search ? "Aucun travailleur trouvé." : "Aucun travailleur inscrit."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((w, i) => (
            <div
              key={w.id}
              onClick={() => setSelectedWorker({ ...w, photoIndex: i })}
              className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <Image
                src={W_PHOTOS[i % W_PHOTOS.length]}
                alt={w.name}
                width={300}
                height={140}
                className="w-full h-[140px] object-cover object-top"
              />
              <div className="p-3.5">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-serif text-sm font-bold text-navy">{w.name || "—"}</span>
                  <Badge
                    variant={w.available !== false ? "default" : "secondary"}
                    className={
                      w.available !== false
                        ? "bg-green-100 text-green-700 hover:bg-green-100 text-[10px]"
                        : "bg-red-100 text-red-700 hover:bg-red-100 text-[10px]"
                    }
                  >
                    {w.available !== false ? "Dispo" : "Occupé"}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground mb-2.5">
                  {w.job || "—"} · {w.city || "Maroc"}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-serif text-base font-extrabold text-navy">
                    {w.price ? `${w.price} DH/j` : "—"}
                  </span>
                  <Link
                    href={`/dashboard/messages?to=${w.id}&name=${encodeURIComponent(w.name || "")}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" className="bg-navy hover:bg-orange h-8 text-xs">
                      Contacter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Worker Detail Modal */}
      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          {selectedWorker && (
            <>
              <Image
                src={W_PHOTOS[selectedWorker.photoIndex % W_PHOTOS.length]}
                alt={selectedWorker.name}
                width={500}
                height={220}
                className="w-full h-[220px] object-cover object-top"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-serif text-xl font-extrabold text-navy mb-0.5">
                      {selectedWorker.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedWorker.job || "—"}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl font-extrabold text-navy">
                      {selectedWorker.price || 0} DH
                    </div>
                    <div className="text-[11px] text-muted-foreground">par jour</div>
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {selectedWorker.desc ||
                    `Professionnel qualifié disponible sur ${selectedWorker.city || "le Maroc"} et environs. Profil vérifié CNIE.`}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                    <Shield className="w-3 h-3" />
                    Vérifié CNIE
                  </Badge>
                  {selectedWorker.city && (
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedWorker.city}
                    </Badge>
                  )}
                  {selectedWorker.exp > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedWorker.exp} an(s) d&apos;expérience
                    </Badge>
                  )}
                </div>

                <Link
                  href={`/dashboard/messages?to=${selectedWorker.id}&name=${encodeURIComponent(selectedWorker.name || "")}`}
                >
                  <Button className="w-full bg-navy hover:bg-orange gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contacter ce travailleur
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
