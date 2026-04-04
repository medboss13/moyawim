"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Search, MessageSquare, Phone, Mail, 
  HelpCircle, ChevronRight, FileText, Shield, CreditCard,
  User, Briefcase, Clock, Star, AlertTriangle, CheckCircle2,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const helpCategories = [
  {
    id: "getting-started",
    title: "Premiers pas",
    icon: HelpCircle,
    color: "#f47920",
    articles: [
      "Comment creer un compte ?",
      "Comment publier ma premiere mission ?",
      "Comment devenir travailleur ?",
      "Comment fonctionne la verification ?",
    ]
  },
  {
    id: "tasks",
    title: "Gestion des missions",
    icon: Briefcase,
    color: "#0d1f3c",
    articles: [
      "Comment publier une mission ?",
      "Comment modifier ou supprimer une mission ?",
      "Comment choisir le bon travailleur ?",
      "Comment marquer une mission comme terminee ?",
    ]
  },
  {
    id: "payments",
    title: "Paiements",
    icon: CreditCard,
    color: "#16a34a",
    articles: [
      "Comment fonctionne le paiement securise ?",
      "Quand suis-je paye pour mes missions ?",
      "Quels sont les frais de la plateforme ?",
      "Comment obtenir un remboursement ?",
    ]
  },
  {
    id: "security",
    title: "Securite & confiance",
    icon: Shield,
    color: "#2563eb",
    articles: [
      "Comment verifier mon identite ?",
      "Comment signaler un probleme ?",
      "Que faire en cas de litige ?",
      "Comment proteger mon compte ?",
    ]
  },
  {
    id: "profile",
    title: "Mon profil",
    icon: User,
    color: "#8b5cf6",
    articles: [
      "Comment completer mon profil ?",
      "Comment ameliorer ma visibilite ?",
      "Comment gerer mes avis ?",
      "Comment modifier mes informations ?",
    ]
  },
  {
    id: "legal",
    title: "Legal & confidentialite",
    icon: FileText,
    color: "#64748b",
    articles: [
      "Conditions generales d'utilisation",
      "Politique de confidentialite",
      "Protection des donnees (CNDP)",
      "Droit de retractation",
    ]
  },
]

const popularQuestions = [
  {
    q: "Comment puis-je commencer a utiliser Moyawim ?",
    a: "Creez un compte gratuitement, choisissez votre role (employeur ou travailleur), et completez votre profil. Vous pouvez ensuite publier des missions ou postuler."
  },
  {
    q: "Est-ce que l'inscription est gratuite ?",
    a: "Oui, l'inscription et la publication de missions sont entierement gratuites. Nous prelevons uniquement une commission de 10% sur les transactions completees."
  },
  {
    q: "Comment fonctionne le paiement securise ?",
    a: "Lorsqu'une offre est acceptee, le paiement est place en securite (escrow). L'argent est libere au travailleur uniquement une fois que vous confirmez la bonne execution de la mission."
  },
  {
    q: "Comment contacter un travailleur ?",
    a: "Vous pouvez envoyer un message a tout travailleur via notre systeme de messagerie integre. Cliquez sur 'Message' sur son profil ou sur son offre."
  },
  {
    q: "Que faire si je ne suis pas satisfait du travail ?",
    a: "Vous pouvez ouvrir un litige dans les 48h suivant la completion. Notre equipe de mediation examinera le cas et trouvera une solution equitable."
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const filteredCategories = searchQuery
    ? helpCategories.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.articles.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : helpCategories

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="px-[5%] py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-navy-light rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                    <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                    <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-bold">
                  Moyawim<span className="text-orange">.ma</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="px-[5%] py-12 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Recherchez dans notre centre d&apos;aide ou parcourez les categories ci-dessous.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-white border-0 text-foreground"
            />
          </div>
        </div>
      </header>

      <div className="px-[5%] py-12">
        <div className="max-w-5xl mx-auto">
          {/* Categories */}
          <section className="mb-16">
            <h2 className="font-serif text-xl font-bold text-navy mb-6">
              Parcourir par categorie
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Card 
                    key={cat.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5"
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy mb-1">{cat.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {cat.articles.length} articles
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedCategory === cat.id ? "rotate-90" : ""}`} />
                      </div>
                      
                      {selectedCategory === cat.id && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                          {cat.articles.map((article, i) => (
                            <button
                              key={i}
                              className="w-full text-left text-sm text-muted-foreground hover:text-orange transition-colors py-1.5 flex items-center gap-2"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {article}
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Popular Questions */}
          <section className="mb-16">
            <h2 className="font-serif text-xl font-bold text-navy mb-6">
              Questions frequentes
            </h2>
            <div className="space-y-3">
              {popularQuestions.map((item, i) => (
                <Card key={i} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between"
                  >
                    <span className="font-medium text-navy pr-4">{item.q}</span>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${expandedFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <Card className="bg-navy text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-bold mb-2">
                    Vous n&apos;avez pas trouve votre reponse ?
                  </h2>
                  <p className="text-white/60">
                    Notre equipe est la pour vous aider 7j/7
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="font-semibold mb-1">Chat en direct</h3>
                    <p className="text-xs text-white/50 mb-3">Reponse en moins de 5 min</p>
                    <Button size="sm" variant="secondary">
                      Demarrer le chat
                    </Button>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-xs text-white/50 mb-3">Reponse sous 24h</p>
                    <a href="mailto:support@moyawim.ma">
                      <Button size="sm" variant="secondary">
                        support@moyawim.ma
                      </Button>
                    </a>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="font-semibold mb-1">Telephone</h3>
                    <p className="text-xs text-white/50 mb-3">Lun-Sam, 9h-18h</p>
                    <a href="tel:+212600000000">
                      <Button size="sm" variant="secondary">
                        +212 600 000 000
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-6 px-[5%]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Moyawim.ma - Tous droits reserves
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-orange">
              Conditions generales
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-orange">
              Confidentialite
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
