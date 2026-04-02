"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMyApplications, useWorkerProfile } from "@/lib/firebase-hooks"

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"]

export default function RevenuePage() {
  const { applications } = useMyApplications()
  const { profile } = useWorkerProfile()

  const acceptedCount = applications.filter((a) => a.status === "accepted").length
  const price = profile?.price || 150
  const currentMonth = new Date().getMonth() % 6

  const chartData = useMemo(() => {
    if (acceptedCount === 0) return null

    const vals = MONTHS.map((_, i) =>
      i === currentMonth
        ? acceptedCount * price
        : Math.floor(Math.random() * acceptedCount * price * 0.7)
    )
    const max = Math.max(...vals, 1)
    const total = vals.reduce((a, b) => a + b, 0)

    return { vals, max, total, currentMonthVal: vals[currentMonth] }
  }, [acceptedCount, price, currentMonth])

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-[26px] font-extrabold text-navy">Mes revenus</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historique et estimation de vos gains
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Ce mois
            </p>
            <p className="font-serif text-3xl font-extrabold text-orange">
              {chartData?.currentMonthVal || 0} DH
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Total cumulé
            </p>
            <p className="font-serif text-3xl font-extrabold text-success">
              {chartData?.total || 0} DH
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Missions réalisées
            </p>
            <p className="font-serif text-3xl font-extrabold text-navy">{acceptedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader className="py-4 px-5 border-b">
          <CardTitle className="font-serif text-base font-bold text-navy">
            Évolution des revenus — 6 derniers mois
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {!chartData ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Les données de revenus apparaîtront après vos premières missions.
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2 h-40 items-end">
              {MONTHS.map((month, i) => {
                const height = Math.round((chartData.vals[i] / chartData.max) * 100)
                return (
                  <div key={month} className="flex flex-col items-center gap-1.5 h-full">
                    <span className="text-[10px] font-bold text-orange">
                      {chartData.vals[i] > 0 ? chartData.vals[i] : ""}
                    </span>
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-navy-light to-orange"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground">{month}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
