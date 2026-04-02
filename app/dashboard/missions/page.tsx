"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMyMissions } from "@/lib/firebase-hooks"

const CAT_ICONS: Record<string, string> = {
  "BTP & Construction": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop",
  "Nettoyage & Ménage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop",
  "Jardinage & Espaces verts": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop",
  default: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=80&h=80&fit=crop",
}

export default function MissionsPage() {
  const { missions, loading } = useMyMissions()

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl lg:text-[26px] font-extrabold text-navy">
            Mes missions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toutes vos missions publiées en temps réel
          </p>
        </div>
        <Link href="/dashboard/post">
          <Button className="bg-navy hover:bg-orange gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle mission
          </Button>
        </Link>
      </div>

      {/* Missions List */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b">
          <CardTitle className="font-serif text-base font-bold text-navy">
            Toutes les missions
          </CardTitle>
          <span className="text-sm text-muted-foreground">{missions.length} mission(s)</span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chargement...</div>
          ) : missions.length === 0 ? (
            <div className="p-12 text-center">
              <ListTodo className="w-10 h-10 mx-auto text-muted-foreground/25 mb-4" />
              <p className="text-sm text-muted-foreground">Aucune mission publiée.</p>
              <Link href="/dashboard/post">
                <Button className="mt-4 bg-navy hover:bg-orange">Publier ma première mission</Button>
              </Link>
            </div>
          ) : (
            missions.map((m) => (
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
                    {m.cat || "—"} · {m.addr || "—"} · {m.applicants?.length || 0} candidat(s)
                  </div>
                </div>
                <Badge
                  variant={m.status === "active" ? "default" : m.status === "done" ? "secondary" : "outline"}
                  className={
                    m.status === "active"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      : m.status === "done"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {m.status === "active" ? "Active" : m.status === "done" ? "Terminée" : "En attente"}
                </Badge>
                <span className="font-serif text-sm font-extrabold text-navy min-w-[80px] text-right">
                  {m.budget || "—"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
