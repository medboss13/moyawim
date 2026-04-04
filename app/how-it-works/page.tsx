"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search, MessageSquare, CheckCircle2, CreditCard, Shield, Star,
  ArrowRight, Play, Users, Clock, Zap, Award, ChevronDown,
  HardHat, Sparkles, Flower2, MapPin, BadgeCheck, Lock, Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"

const stepsEmployer = [
  {
    num: 1,
    title: "Decrivez votre mission",
    desc: "Expliquez ce dont vous avez besoin en quelques mots. Plus vous etes precis, meilleures seront les offres que vous recevrez.",
    details: [
      "Choisissez une categorie (menage, plomberie, jardinage...)",
      "Decrivez la mission en detail",
      "Indiquez votre budget ou laissez les travailleurs proposer",
      "Precisez la date et le lieu",
    ],
    icon: Search,
    color: "#f47920",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
  },
  {
    num: 2,
    title: "Recevez des offres",
    desc: "Les travailleurs qualifies pres de chez vous vous envoient leurs propositions. Comparez les profils, avis et tarifs en toute transparence.",
    details: [
      "Recevez des offres en quelques minutes",
      "Consultez les profils detailles des travailleurs",
      "Lisez les avis des autres utilisateurs",
      "Discutez directement via la messagerie",
    ],
    icon: MessageSquare,
    color: "#0d1f3c",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  },
  {
    num: 3,
    title: "Choisissez et confirmez",
    desc: "Selectionnez le travailleur qui vous convient le mieux. Confirmez les details et le prix avant de commencer.",
    details: [
      "Comparez les offres cote a cote",
      "Negociez si necessaire",
      "Confirmez la reservation",
      "Recevez une confirmation par SMS et email",
    ],
    icon: CheckCircle2,
    color: "#16a34a",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
  },
  {
    num: 4,
    title: "Payez en securite",
    desc: "Payez uniquement quand la mission est terminee a votre satisfaction. Votre argent est protege jusqu'a validation.",
    details: [
      "Paiement bloque jusqu'a validation",
      "Plusieurs moyens de paiement (CB, virement, cash)",
      "Facture automatique",
      "Remboursement garanti en cas de probleme",
    ],
    icon: CreditCard,
    color: "#2563eb",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
]

const stepsWorker = [
  {
    num: 1,
    title: "Creez votre profil",
    desc: "Inscrivez-vous gratuitement et completez votre profil pour montrer vos competences et votre experience.",
    details: [
      "Inscription gratuite en 2 minutes",
      "Ajoutez vos competences et certifications",
      "Definissez vos zones d'intervention",
      "Fixez vos tarifs",
    ],
    icon: Users,
    color: "#f47920",
  },
  {
    num: 2,
    title: "Parcourez les missions",
    desc: "Decouvrez les missions disponibles pres de chez vous. Filtrez par categorie, budget et localisation.",
    details: [
      "Missions geolocalisees pres de vous",
      "Alertes pour les nouvelles missions",
      "Filtres avances",
      "Voir le budget propose",
    ],
    icon: Search,
    color: "#0d1f3c",
  },
  {
    num: 3,
    title: "Faites des offres",
    desc: "Proposez vos services aux employeurs. Expliquez pourquoi vous etes le meilleur choix pour leur mission.",
    details: [
      "Proposez votre prix",
      "Decrivez votre approche",
      "Montrez vos travaux precedents",
      "Repondez aux questions",
    ],
    icon: MessageSquare,
    color: "#16a34a",
  },
  {
    num: 4,
    title: "Gagnez de l'argent",
    desc: "Completez les missions et recevez votre paiement rapidement. Construisez votre reputation avec les avis.",
    details: [
      "Paiement rapide apres validation",
      "Virement sur votre compte",
      "Collectez des avis positifs",
      "Augmentez vos revenus",
    ],
    icon: Award,
    color: "#2563eb",
  },
]

const benefits = [
  {
    title: "Gratuit pour publier",
    desc: "Publier une mission est 100% gratuit. Vous ne payez que lorsque vous acceptez une offre.",
    icon: Zap,
  },
  {
    title: "Travailleurs verifies",
    desc: "Tous les travailleurs sont verifies avec leur CNIE. Votre securite est notre priorite.",
    icon: BadgeCheck,
  },
  {
    title: "Paiement securise",
    desc: "L'argent est bloque jusqu'a ce que vous validiez la mission. Protection garantie.",
    icon: Lock,
  },
  {
    title: "Support 24/7",
    desc: "Notre equipe est disponible pour vous aider a tout moment en cas de besoin.",
    icon: Headphones,
  },
]

const faqs = [
  {
    q: "Comment ca coute ?",
    a: "Publier une mission est gratuit. Moyawim prend une commission de 10% sur le montant de la mission uniquement si elle est completee avec succes. Les travailleurs recoivent 90% du prix.",
  },
  {
    q: "Comment les travailleurs sont-ils verifies ?",
    a: "Tous les travailleurs doivent fournir une copie de leur CNIE pour verification. Nous verifions egalement leur numero de telephone et leur adresse email.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait ?",
    a: "Votre paiement est bloque jusqu'a ce que vous validiez la mission. Si vous n'etes pas satisfait, contactez notre support et nous trouverons une solution (remboursement, mediation, etc.).",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Vous payez en ligne lors de l'acceptation d'une offre. L'argent est garde en securite par Moyawim et transfere au travailleur uniquement apres votre validation finale.",
  },
  {
    q: "Puis-je annuler une mission ?",
    a: "Oui, vous pouvez annuler gratuitement tant qu'aucune offre n'a ete acceptee. Apres acceptation, des frais peuvent s'appliquer selon le delai d'annulation.",
  },
  {
    q: "Dans quelles villes Moyawim est-il disponible ?",
    a: "Moyawim est actuellement disponible dans plus de 20 villes marocaines dont Casablanca, Rabat, Marrakech, Fes, Tanger, Agadir, Meknes et plus encore.",
  },
]

const stats = [
  { value: "50K+", label: "Missions completees" },
  { value: "12K+", label: "Travailleurs actifs" },
  { value: "4.8/5", label: "Note moyenne" },
  { value: "2min", label: "Temps de reponse moyen" },
]

export default function HowItWorksPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"employer" | "worker">("employer")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const steps = activeTab === "employer" ? stepsEmployer : stepsWorker

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-[5%] h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
              <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
              <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
            </svg>
          </div>
          <span className="font-serif text-xl font-extrabold text-navy">
            Moyawim<span className="text-orange">.ma</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Parcourir les missions
          </Link>
          <Link href="/categories" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Categories
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-orange">
            Comment ca marche
          </Link>
        </div>

        <div className="flex gap-2.5">
          <Button variant="outline" onClick={() => setAuthOpen(true)} className="hidden sm:flex">
            Connexion
          </Button>
          <Button onClick={() => setAuthOpen(true)} className="bg-orange hover:bg-orange-hover">
            Commencer
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-[5%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-orange/5" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-6">
            Simple, rapide, securise
          </Badge>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-tight mb-6">
            Comment fonctionne
            <br />
            <span className="text-orange">Moyawim</span> ?
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Que vous cherchiez a accomplir une mission ou a gagner de l&apos;argent en offrant vos services, 
            Moyawim rend tout simple et transparent.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-card rounded-full p-1.5 shadow-lg border border-border">
            <button
              onClick={() => setActiveTab("employer")}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "employer"
                  ? "bg-navy text-white shadow-md"
                  : "text-muted-foreground hover:text-navy"
              }`}
            >
              Je cherche un travailleur
            </button>
            <button
              onClick={() => setActiveTab("worker")}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "worker"
                  ? "bg-orange text-white shadow-md"
                  : "text-muted-foreground hover:text-orange"
              }`}
            >
              Je veux travailler
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-[5%]">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 1
              
              return (
                <div
                  key={step.num}
                  className={`flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
                >
                  {/* Image/Visual */}
                  {step.image ? (
                    <div className="flex-1 relative">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={400}
                          className="w-full h-[300px] lg:h-[350px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                        
                        {/* Step number badge */}
                        <div 
                          className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center font-serif text-xl font-bold text-white shadow-lg"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.num}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div 
                        className="relative rounded-3xl p-8 lg:p-12"
                        style={{ backgroundColor: `${step.color}10` }}
                      >
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                          style={{ backgroundColor: `${step.color}20` }}
                        >
                          <Icon className="w-10 h-10" style={{ color: step.color }} />
                        </div>
                        
                        {/* Step number */}
                        <div 
                          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold text-white"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.num}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                      <span 
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: step.color }}
                      >
                        Etape {step.num}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {step.desc}
                    </p>
                    
                    <ul className="space-y-3">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-[5%] bg-navy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange/20 text-orange hover:bg-orange/20 mb-4">
              Pourquoi Moyawim
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white mb-4">
              Les avantages Moyawim
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Une plateforme concue pour simplifier votre quotidien et securiser vos transactions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-white/60">{benefit.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-[5%] bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6">
                <p className="font-serif text-4xl lg:text-5xl font-extrabold text-orange mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-[5%]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">
              FAQ
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy mb-4">
              Questions frequentes
            </h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir pour commencer avec Moyawim.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
                >
                  <span className="font-semibold text-navy pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      expandedFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-[5%] bg-gradient-to-br from-navy to-navy-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white mb-4">
            Pret a commencer ?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de marocains qui utilisent Moyawim pour accomplir leurs missions ou gagner de l&apos;argent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setAuthOpen(true)}
              className="bg-orange hover:bg-orange-hover text-base px-8"
            >
              Publier une mission
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setAuthOpen(true)}
              className="border-white/20 text-white hover:bg-white/10 text-base px-8"
            >
              Devenir travailleur
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-8 px-[5%]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © 2025 Moyawim.ma - ENCG Meknes - Tous droits reserves
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-white/30 hover:text-orange transition-colors">
              Accueil
            </Link>
            <Link href="/categories" className="text-sm text-white/30 hover:text-orange transition-colors">
              Categories
            </Link>
            <Link href="/browse" className="text-sm text-white/30 hover:text-orange transition-colors">
              Parcourir
            </Link>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}
