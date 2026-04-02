"use client"

import { Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMyApplications } from "@/lib/firebase-hooks"

export default function ApplicationsPage() {
  const { applications, loading } = useMyApplications()

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-[26px] font-extrabold text-navy">
          Mes candidatures
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez l&apos;état de chaque candidature en temps réel
        </p>
      </div>

      {/* Applications List */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b">
          <CardTitle className="font-serif text-base font-bold text-navy">
            Toutes les candidatures
          </CardTitle>
          <span className="text-sm text-muted-foreground">{applications.length} candidature(s)</span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chargement...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-10 h-10 mx-auto text-muted-foreground/25 mb-4" />
              <p className="text-sm text-muted-foreground">
                Vous n&apos;avez pas encore postulé.
              </p>
            </div>
          ) : (
            applications.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3.5 px-5 py-3.5 border-b last:border-0 hover:bg-cream transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy">
                    Mission #{(a.missionId || "").slice(0, 8) || "—"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Postulé le{" "}
                    {a.appliedAt?.toDate
                      ? a.appliedAt.toDate().toLocaleDateString("fr-FR")
                      : "récemment"}
                  </div>
                </div>
                <Badge
                  variant={
                    a.status === "accepted"
                      ? "default"
                      : a.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className={
                    a.status === "accepted"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : a.status === "rejected"
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  }
                >
                  {a.status === "accepted"
                    ? "Accepté"
                    : a.status === "rejected"
                    ? "Refusé"
                    : "En attente"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
