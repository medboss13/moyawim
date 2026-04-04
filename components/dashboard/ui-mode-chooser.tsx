"use client"

import { useState } from "react"
import { Smartphone, Layout, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import type { UIMode } from "@/lib/types"

export function UIModeChooser() {
  const { setUIMode, userData } = useAuth()
  const [selected, setSelected] = useState<UIMode | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelect = async (mode: UIMode) => {
    setSelected(mode)
    setIsTransitioning(true)
    await setUIMode(mode)
    // Small delay for visual feedback before transitioning
    setTimeout(() => {
      window.location.reload()
    }, 400)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <path
                d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z"
                fill="#f47920"
              />
              <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
              <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-navy mb-3">
            مرحبا بك، {userData?.name?.split(" ")[0] || ""}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Bienvenue sur Moyawim. Choisissez votre mode d&apos;affichage:
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Simple Mode */}
          <Card
            onClick={() => !isTransitioning && handleSelect("simple")}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selected === "simple"
                ? "ring-4 ring-orange border-orange shadow-xl"
                : "border-border hover:border-orange/50"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            <CardContent className="p-8 text-center">
              {/* Icon */}
              <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-orange/5 rounded-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-20 h-28 bg-card rounded-xl shadow-lg border-2 border-border flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-8 bg-orange rounded-lg" />
                    <div className="w-8 h-8 bg-navy rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Title in Darija */}
              <h2 className="font-serif text-2xl font-bold text-navy mb-2" dir="rtl">
                واجهة المستخدم البسيطة
              </h2>
              
              {/* Subtitle in French */}
              <p className="text-orange font-semibold mb-3">Interface simplifiee</p>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Grands boutons, icones claires, navigation facile. Ideal pour une utilisation rapide.
              </p>

              {/* Selected indicator */}
              {selected === "simple" && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Standard Mode */}
          <Card
            onClick={() => !isTransitioning && handleSelect("standard")}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selected === "standard"
                ? "ring-4 ring-navy border-navy shadow-xl"
                : "border-border hover:border-navy/50"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            <CardContent className="p-8 text-center">
              {/* Icon */}
              <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-navy/5 rounded-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-20 h-28 bg-card rounded-xl shadow-lg border-2 border-border flex flex-col p-2 gap-1.5">
                    <div className="flex gap-1">
                      <div className="w-4 h-3 bg-navy/20 rounded" />
                      <div className="w-4 h-3 bg-navy/20 rounded" />
                      <div className="w-4 h-3 bg-navy/20 rounded" />
                    </div>
                    <div className="flex-1 bg-cream rounded" />
                    <div className="flex gap-1">
                      <div className="flex-1 h-4 bg-orange/30 rounded" />
                      <div className="flex-1 h-4 bg-navy/30 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title in Darija */}
              <h2 className="font-serif text-2xl font-bold text-navy mb-2" dir="rtl">
                واجهة كاملة
              </h2>
              
              {/* Subtitle in French */}
              <p className="text-navy font-semibold mb-3">Interface complete</p>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Toutes les fonctionnalites, formulaires detailles, statistiques avancees.
              </p>

              {/* Selected indicator */}
              {selected === "standard" && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Vous pouvez changer ce parametre a tout moment dans les reglages de votre profil.
        </p>
      </div>
    </div>
  )
}
