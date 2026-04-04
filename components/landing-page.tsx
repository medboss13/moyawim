"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Users, Briefcase, Shield, Star, ArrowRight, CheckCircle2, 
  MapPin, Clock, Zap, MessageSquare, CreditCard, Search,
  HardHat, Sparkles, Flower2, Truck, Package, Laptop, PartyPopper, Heart, Car,
  ChevronRight, Play, Quote, Menu, X, Phone, Mail, BadgeCheck, Award, Lock,
  Headphones, Globe, Timer, Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AuthModal } from "@/components/auth-modal"
import { CATEGORIES } from "@/lib/types"

const stats = [
  { num: "50K+", label: "Missions completees", icon: CheckCircle2 },
  { num: "12K+", label: "Travailleurs verifies", icon: Users },
  { num: "20+", label: "Villes couvertes", icon: MapPin },
  { num: "4.8/5", label: "Note moyenne", icon: Star },
]

const trustBadges = [
  { icon: BadgeCheck, label: "Verification CNIE", desc: "Identite verifiee" },
  { icon: Lock, label: "Paiement securise", desc: "Protection acheteur" },
  { icon: Headphones, label: "Support 24/7", desc: "Assistance client" },
  { icon: Award, label: "Garantie qualite", desc: "Satisfaction garantie" },
]

const faqItems = [
  {
    q: "Comment fonctionne la verification des travailleurs ?",
    a: "Chaque travailleur doit soumettre sa Carte d'Identite Nationale (CNIE) qui est verifiee par notre equipe. Nous verifions egalement leur numero de telephone et leur adresse email."
  },
  {
    q: "Le paiement est-il securise ?",
    a: "Oui, nous utilisons un systeme de paiement en sequestre. Votre argent est retenu en securite jusqu'a ce que vous confirmez la completion de la mission."
  },
  {
    q: "Que faire si je ne suis pas satisfait du travail ?",
    a: "Vous pouvez ouvrir un litige dans les 48h suivant la completion. Notre equipe mediation interviendra pour trouver une solution."
  },
  {
    q: "Combien coute l'utilisation de Moyawim ?",
    a: "L'inscription et la publication de missions sont gratuites. Nous prelevons une commission de 10% sur les transactions completees."
  },
  {
    q: "Comment devenir travailleur sur la plateforme ?",
    a: "Inscrivez-vous en tant que travailleur, completez votre profil avec vos competences, verifiez votre identite et commencez a postuler aux missions."
  },
]

const steps = [
  {
    num: 1,
    title: "Publiez votre mission",
    desc: "Decrivez ce dont vous avez besoin, fixez votre budget et choisissez votre lieu. C'est gratuit et prend moins de 2 minutes.",
    icon: Search,
    color: "#f47920",
  },
  {
    num: 2,
    title: "Recevez des offres",
    desc: "Les travailleurs qualifies pres de chez vous vous envoient leurs propositions. Comparez les profils, avis et prix.",
    icon: MessageSquare,
    color: "#0d1f3c",
  },
  {
    num: 3,
    title: "Choisissez le meilleur",
    desc: "Selectionnez le travailleur qui vous convient. Discutez des details et confirmez la mission.",
    icon: CheckCircle2,
    color: "#16a34a",
  },
  {
    num: 4,
    title: "Paiement securise",
    desc: "Payez en toute securite une fois la mission terminee. Votre argent est protege jusqu'a validation.",
    icon: CreditCard,
    color: "#2563eb",
  },
]

const workers = [
  {
    name: "Khalid Mansouri",
    job: "Macon - Plombier",
    city: "Casablanca",
    price: "140 DH/j",
    rating: 4.9,
    reviews: 127,
    tasks: 89,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Fatima Zahra",
    job: "Menage - Repassage",
    city: "Rabat",
    price: "120 DH/j",
    rating: 4.8,
    reviews: 203,
    tasks: 156,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Youssef Bennani",
    job: "Jardinage - Espaces verts",
    city: "Marrakech",
    price: "200 DH/j",
    rating: 4.7,
    reviews: 84,
    tasks: 62,
    available: false,
    verified: true,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Hassan Alaoui",
    job: "Electricien - Peinture",
    city: "Tanger",
    price: "150 DH/j",
    rating: 5.0,
    reviews: 56,
    tasks: 43,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
  },
]

const testimonials = [
  {
    name: "Samira Benkirane",
    role: "Proprietaire, Casablanca",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    content: "J'ai trouve un plombier excellent en moins d'une heure. Le travail a ete impeccable et le prix tres raisonnable. Je recommande vivement Moyawim!",
    rating: 5,
    task: "Reparation plomberie",
  },
  {
    name: "Omar Tazi",
    role: "Entrepreneur, Rabat",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "En tant qu'entrepreneur, j'ai besoin de travailleurs fiables rapidement. Moyawim m'a permis de trouver une equipe complete pour mes chantiers.",
    rating: 5,
    task: "Equipe BTP",
  },
  {
    name: "Amina Fassi",
    role: "Mere de famille, Fes",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Service de menage regulier impeccable. Fatima est devenue notre aide menagere de confiance grace a Moyawim. Merci!",
    rating: 5,
    task: "Menage hebdomadaire",
  },
]

const popularTasks = [
  { title: "Menage appartement", price: "150 DH", icon: Sparkles, count: "2.3K+" },
  { title: "Reparation plomberie", price: "200 DH", icon: HardHat, count: "1.8K+" },
  { title: "Peinture maison", price: "300 DH", icon: HardHat, count: "1.5K+" },
  { title: "Demenagement", price: "400 DH", icon: Truck, count: "1.2K+" },
  { title: "Jardinage", price: "180 DH", icon: Flower2, count: "980+" },
  { title: "Electricite", price: "250 DH", icon: Zap, count: "850+" },
]

const categoryIcons: Record<string, React.ElementType> = {
  construction: HardHat,
  cleaning: Sparkles,
  gardening: Flower2,
  moving: Truck,
  delivery: Package,
  tech: Laptop,
  events: PartyPopper,
  care: Heart,
  auto: Car,
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-[5%] h-[72px] flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-card/95 backdrop-blur-xl shadow-sm border-b border-border" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[40px] h-[40px] bg-navy rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path
                d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z"
                fill="#f47920"
              />
              <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
              <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
            </svg>
          </div>
          <span className="font-serif text-xl font-extrabold text-navy">
            Moyawim<span className="text-orange">.ma</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link href="/browse" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Parcourir les missions
          </Link>
          <Link href="/categories" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Categories
          </Link>
          <a href="#how" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Comment ca marche
          </a>
          <a href="#workers" className="text-sm font-medium text-foreground hover:text-orange transition-colors">
            Travailleurs
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => setAuthOpen(true)} className="hidden sm:flex">
            Connexion
          </Button>
          <Button onClick={() => setAuthOpen(true)} className="bg-orange hover:bg-orange-hover hidden sm:flex">
            Publier une mission
          </Button>
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="p-5 border-b">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                      <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                      <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
                    </svg>
                  </div>
                  <span className="font-serif text-lg font-extrabold text-navy">
                    Moyawim<span className="text-orange">.ma</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="p-5 space-y-1">
                <Link 
                  href="/browse" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Parcourir les missions</span>
                </Link>
                <Link 
                  href="/categories" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Categories</span>
                </Link>
                <a 
                  href="#how" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Comment ca marche</span>
                </a>
                <a 
                  href="#workers" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Travailleurs</span>
                </a>
                <a 
                  href="#faq" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">FAQ</span>
                </a>
              </nav>
              <div className="p-5 border-t space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => { setMobileMenuOpen(false); setAuthOpen(true) }}
                >
                  Connexion
                </Button>
                <Button 
                  className="w-full bg-orange hover:bg-orange-hover"
                  onClick={() => { setMobileMenuOpen(false); setAuthOpen(true) }}
                >
                  Publier une mission
                </Button>
              </div>
              <div className="p-5 border-t">
                <p className="text-xs text-muted-foreground mb-3">Contact</p>
                <a href="tel:+212600000000" className="flex items-center gap-2 text-sm text-navy hover:text-orange mb-2">
                  <Phone className="w-4 h-4" />
                  +212 600 000 000
                </a>
                <a href="mailto:contact@moyawim.ma" className="flex items-center gap-2 text-sm text-navy hover:text-orange">
                  <Mail className="w-4 h-4" />
                  contact@moyawim.ma
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-[5%] pt-24 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-orange/5" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium text-foreground mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
              <span className="text-navy font-semibold">247</span> travailleurs disponibles maintenant
            </div>
            
            <p className="text-xl text-orange font-bold mb-3" dir="rtl">
              بكليك، لقى لي يخدم ليك
            </p>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-navy leading-[1.05] tracking-tight mb-6">
              Trouvez le bon
              <br />
              <span className="text-orange">travailleur</span>
              <br />
              en 2 minutes.
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-[500px]">
              La premiere plateforme marocaine qui connecte les travailleurs journaliers qualifies aux particuliers et
              entreprises. Simple, securise, immediat.
            </p>

            {/* Search Box */}
            <div className="bg-card rounded-2xl p-2 shadow-xl border border-border max-w-[520px] mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="De quoi avez-vous besoin ? Ex: Plombier, Menage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setAuthOpen(true)}
                  className="h-14 px-8 bg-orange hover:bg-orange-hover text-base font-semibold"
                >
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Populaire:</span>
              {["Menage", "Plomberie", "Demenagement", "Peinture"].map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-orange/10 hover:text-orange transition-colors"
                  onClick={() => setAuthOpen(true)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Main image */}
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"
                alt="Travailleurs marocains"
                width={800}
                height={600}
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                priority
              />
              
              {/* Floating card - Task posted */}
              <div className="absolute -left-8 top-20 bg-card rounded-xl p-4 shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">Mission publiee!</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 min</p>
                  </div>
                </div>
              </div>
              
              {/* Floating card - Worker */}
              <div className="absolute -right-4 bottom-24 bg-card rounded-xl p-4 shadow-xl border border-border animate-float-delayed">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face"
                    alt="Worker"
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy">Khalid M.</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-orange text-orange" />
                      <span className="text-xs font-medium">4.9</span>
                      <span className="text-xs text-muted-foreground">(127 avis)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats badge */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-navy text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-6">
                <div className="text-center">
                  <p className="font-serif text-xl font-bold text-orange">50K+</p>
                  <p className="text-[10px] text-white/60">Missions</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="font-serif text-xl font-bold text-orange">12K+</p>
                  <p className="text-[10px] text-white/60">Travailleurs</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="font-serif text-xl font-bold text-orange">4.8</p>
                  <p className="text-[10px] text-white/60">Note</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-navy">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className={`py-10 px-6 text-center ${i < 3 ? "border-r border-white/[0.08]" : ""}`}
              >
                <Icon className="w-6 h-6 text-orange mx-auto mb-3" />
                <span className="font-serif text-3xl lg:text-4xl font-extrabold text-white block mb-1">{stat.num}</span>
                <span className="text-sm text-white/50">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-[5%] bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">Categories</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-3">
              Tous les services dont vous avez besoin
            </h2>
            <p className="text-base text-muted-foreground max-w-[600px] mx-auto">
              Des milliers de travailleurs qualifies dans plus de 10 categories pour repondre a tous vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.slice(0, 10).map((cat) => {
              const Icon = categoryIcons[cat.id] || HardHat
              return (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.id}`}
                  className="group bg-cream hover:bg-orange/5 border border-cream-dark hover:border-orange/30 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-orange transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{cat.nameAr}</p>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                Voir toutes les categories <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-[5%] bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">Processus</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-3">
              Comment ca marche ?
            </h2>
            <p className="text-base text-muted-foreground max-w-[600px] mx-auto">
              4 etapes simples pour trouver le professionnel qu&apos;il vous faut et accomplir votre mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.num}
                  className="relative bg-card rounded-2xl p-6 shadow-sm border border-border group hover:-translate-y-1 transition-all hover:shadow-lg"
                >
                  {/* Step number */}
                  <div 
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-white text-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>
                  
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${step.color}10` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  
                  {/* Connector line */}
                  {step.num < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-border" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => setAuthOpen(true)} className="bg-navy hover:bg-orange">
              Publier ma premiere mission <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Tasks */}
      <section className="py-20 px-[5%] bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">Tendances</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-2">
                Missions populaires
              </h2>
              <p className="text-base text-muted-foreground">
                Les services les plus demandes par notre communaute.
              </p>
            </div>
            <Link href="/browse">
              <Button variant="outline">
                Voir toutes les missions <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTasks.map((task, i) => {
              const Icon = task.icon
              return (
                <div
                  key={i}
                  onClick={() => setAuthOpen(true)}
                  className="group flex items-center gap-4 bg-cream hover:bg-orange/5 border border-cream-dark hover:border-orange/30 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center group-hover:bg-orange/20 transition-colors">
                    <Icon className="w-6 h-6 text-orange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-navy group-hover:text-orange transition-colors">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">A partir de {task.price}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">{task.count}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Workers Section */}
      <section id="workers" className="py-20 px-[5%] bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">Travailleurs</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-2">
                Les mieux notes pres de vous
              </h2>
              <p className="text-base text-muted-foreground">
                Tous verifies CNIE, notes par la communaute avec plus de 90% de satisfaction.
              </p>
            </div>
            <Link href="/browse">
              <Button variant="outline">
                Voir tous les travailleurs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workers.map((worker, i) => (
              <div
                key={i}
                onClick={() => setAuthOpen(true)}
                className="group bg-card rounded-2xl overflow-hidden border border-border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative">
                  <Image
                    src={worker.image}
                    alt={worker.name}
                    width={400}
                    height={200}
                    className="w-full h-44 object-cover object-top"
                  />
                  {/* Availability badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    worker.available 
                      ? "bg-success text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {worker.available ? "Disponible" : "Occupe"}
                  </div>
                  {/* Verified badge */}
                  {worker.verified && (
                    <div className="absolute top-3 left-3 w-7 h-7 bg-navy rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif font-bold text-navy group-hover:text-orange transition-colors">
                        {worker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{worker.job}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{worker.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-orange text-orange" />
                      <span className="font-semibold text-navy">{worker.rating}</span>
                      <span className="text-sm text-muted-foreground">({worker.reviews})</span>
                    </div>
                    <span className="font-serif font-extrabold text-navy">{worker.price}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {worker.tasks} missions completees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-[5%] bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange/20 text-orange hover:bg-orange/20 mb-4">Temoignages</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-base text-white/60 max-w-[600px] mx-auto">
              Des milliers de marocains font confiance a Moyawim pour leurs missions quotidiennes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-orange/20" />
                
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange text-orange" />
                  ))}
                </div>
                
                <p className="text-white/80 leading-relaxed mb-6">
                  &quot;{testimonial.content}&quot;
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/50">{testimonial.role}</p>
                  </div>
                </div>
                
                <Badge className="mt-4 bg-orange/10 text-orange hover:bg-orange/10">
                  {testimonial.task}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-[5%] bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="bg-success/10 text-success hover:bg-success/10 mb-4">Securite</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-3">
              Pourquoi nous faire confiance ?
            </h2>
            <p className="text-base text-muted-foreground max-w-[600px] mx-auto">
              Votre securite et satisfaction sont nos priorites absolues.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon
              return (
                <div key={i} className="bg-card rounded-2xl p-6 text-center border border-border hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-navy" />
                  </div>
                  <h3 className="font-serif font-bold text-navy mb-1">{badge.label}</h3>
                  <p className="text-sm text-muted-foreground">{badge.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-[5%] bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange/10 text-orange hover:bg-orange/10 mb-4">FAQ</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-3">
              Questions frequentes
            </h2>
            <p className="text-base text-muted-foreground">
              Tout ce que vous devez savoir sur Moyawim.ma
            </p>
          </div>
          
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div 
                key={i} 
                className="bg-cream rounded-xl overflow-hidden border border-border"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-navy pr-4">{item.q}</span>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center p-6 bg-navy/5 rounded-2xl">
            <p className="text-navy font-medium mb-2">Vous avez d&apos;autres questions ?</p>
            <p className="text-sm text-muted-foreground mb-4">Notre equipe est la pour vous aider</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:contact@moyawim.ma" className="inline-flex items-center gap-2 text-sm text-orange hover:underline">
                <Mail className="w-4 h-4" />
                contact@moyawim.ma
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a href="tel:+212600000000" className="inline-flex items-center gap-2 text-sm text-orange hover:underline">
                <Phone className="w-4 h-4" />
                +212 600 000 000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-[5%] bg-gradient-to-br from-navy to-navy-light relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-white rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Pret a commencer ?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-[600px] mx-auto">
            Rejoignez des milliers de marocains qui utilisent Moyawim pour accomplir leurs missions ou gagner de l&apos;argent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setAuthOpen(true)}
              className="bg-orange hover:bg-orange-hover text-base px-8"
            >
              Publier une mission gratuitement
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setAuthOpen(true)}
              className="text-base px-8 border-white/30 text-white hover:bg-white/10"
            >
              Devenir travailleur
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Inscription gratuite
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Sans engagement
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Paiement securise
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] pt-16 pb-6 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                    <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                    <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                    <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
                  </svg>
                </div>
                <span className="font-serif text-xl font-extrabold text-white">
                  Moyawim<span className="text-orange">.ma</span>
                </span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-[280px] mb-4">
                La premiere plateforme marocaine de mise en relation entre travailleurs journaliers et employeurs. Simple, securise, immediat.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-orange rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-orange rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/5 hover:bg-orange rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Plateforme</h4>
              <a href="#how" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Comment ca marche
              </a>
              <Link href="/browse" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Parcourir les missions
              </Link>
              <Link href="/categories" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Categories
              </Link>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors">
                Tarifs
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Entreprise</h4>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                A propos
              </a>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                ENCG Meknes
              </a>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Blog
              </a>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors">
                Contact
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Conditions generales
              </a>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors mb-2.5">
                Politique de confidentialite
              </a>
              <a href="#" className="block text-sm text-white/40 hover:text-orange transition-colors">
                CNDP
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row justify-between gap-3">
            <p className="text-sm text-white/30">
              © 2025 Moyawim.ma - ENCG Meknes - Tous droits reserves
            </p>
            <p className="text-sm text-white/30">
              Fait avec amour au Maroc
            </p>
          </div>
        </div>
      </footer>

      {/* Floating animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}
