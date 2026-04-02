"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, Search, HardHat, Sparkles, Flower2, Truck, 
  Package, Laptop, PartyPopper, Heart, Car, MoreHorizontal,
  MapPin, Star, Users, CheckCircle2, ChevronRight, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, MOROCCAN_CITIES } from "@/lib/types"

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
  other: MoreHorizontal,
}

const categoryImages: Record<string, string> = {
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
  gardening: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
  moving: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop",
  delivery: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop",
  tech: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop",
  events: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
  care: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=400&fit=crop",
  auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
  other: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=600&h=400&fit=crop",
}

const categoryStats: Record<string, { tasks: string; workers: string; avgPrice: string }> = {
  construction: { tasks: "8.2K+", workers: "2.4K+", avgPrice: "250 DH" },
  cleaning: { tasks: "12.5K+", workers: "3.8K+", avgPrice: "150 DH" },
  gardening: { tasks: "3.1K+", workers: "890+", avgPrice: "180 DH" },
  moving: { tasks: "4.7K+", workers: "1.2K+", avgPrice: "400 DH" },
  delivery: { tasks: "6.3K+", workers: "1.5K+", avgPrice: "50 DH" },
  tech: { tasks: "2.8K+", workers: "620+", avgPrice: "300 DH" },
  events: { tasks: "1.9K+", workers: "450+", avgPrice: "500 DH" },
  care: { tasks: "3.4K+", workers: "980+", avgPrice: "200 DH" },
  auto: { tasks: "2.1K+", workers: "540+", avgPrice: "350 DH" },
  other: { tasks: "5.6K+", workers: "1.1K+", avgPrice: "200 DH" },
}

const popularCities = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tanger", "Agadir"]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.nameAr.includes(searchQuery) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="px-[5%] py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-navy-light rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                  <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                  <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
                </svg>
              </div>
              <span className="font-serif text-lg font-bold">Moyawim<span className="text-orange">.ma</span></span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="/browse">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  Parcourir les taches
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-orange hover:bg-orange-hover">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-navy text-white px-[5%] pt-12 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-orange/20 text-orange hover:bg-orange/20 mb-4">
            10+ Categories
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold mb-4">
            Trouvez le service dont vous avez besoin
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Des milliers de travailleurs qualifies prets a vous aider dans toutes les categories de services.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une categorie ou un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-white text-foreground"
              />
            </div>
          </div>

          {/* City filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-sm text-white/50">Villes populaires:</span>
            {popularCities.map((city) => (
              <Badge 
                key={city}
                variant={selectedCity === city ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedCity === city 
                    ? "bg-orange text-white hover:bg-orange" 
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
                onClick={() => setSelectedCity(selectedCity === city ? null : city)}
              >
                {city}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-cream border-cream-dark">
              <CardContent className="p-5 text-center">
                <TrendingUp className="w-6 h-6 text-orange mx-auto mb-2" />
                <p className="font-serif text-2xl font-bold text-navy">50K+</p>
                <p className="text-sm text-muted-foreground">Taches completees</p>
              </CardContent>
            </Card>
            <Card className="bg-cream border-cream-dark">
              <CardContent className="p-5 text-center">
                <Users className="w-6 h-6 text-orange mx-auto mb-2" />
                <p className="font-serif text-2xl font-bold text-navy">12K+</p>
                <p className="text-sm text-muted-foreground">Travailleurs verifies</p>
              </CardContent>
            </Card>
            <Card className="bg-cream border-cream-dark">
              <CardContent className="p-5 text-center">
                <MapPin className="w-6 h-6 text-orange mx-auto mb-2" />
                <p className="font-serif text-2xl font-bold text-navy">20+</p>
                <p className="text-sm text-muted-foreground">Villes couvertes</p>
              </CardContent>
            </Card>
            <Card className="bg-cream border-cream-dark">
              <CardContent className="p-5 text-center">
                <Star className="w-6 h-6 text-orange mx-auto mb-2" />
                <p className="font-serif text-2xl font-bold text-navy">4.8/5</p>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="font-serif text-2xl font-bold text-navy mb-8">
            Toutes les categories ({filteredCategories.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredCategories.map((cat) => {
              const Icon = categoryIcons[cat.id] || MoreHorizontal
              const stats = categoryStats[cat.id] || { tasks: "1K+", workers: "200+", avgPrice: "200 DH" }
              const image = categoryImages[cat.id]
              
              return (
                <Card 
                  key={cat.id} 
                  className="group overflow-hidden border-border hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                      <div 
                        className="absolute bottom-4 left-4 md:bottom-auto md:top-4 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <CardContent className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-navy group-hover:text-orange transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{cat.nameAr}</p>
                        </div>
                        <Link href={`/browse?category=${cat.id}`}>
                          <Button size="sm" className="bg-navy hover:bg-orange">
                            Voir <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-muted-foreground">{stats.tasks} taches</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-orange" />
                          <span className="text-muted-foreground">{stats.workers} pros</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Moy:</span>
                          <span className="font-semibold text-navy">{stats.avgPrice}</span>
                        </div>
                      </div>
                      
                      {/* Subcategories */}
                      <div className="flex flex-wrap gap-2">
                        {cat.subcategories.slice(0, 5).map((sub) => (
                          <Link 
                            key={sub} 
                            href={`/browse?category=${cat.id}&subcategory=${encodeURIComponent(sub)}`}
                          >
                            <Badge 
                              variant="secondary" 
                              className="cursor-pointer hover:bg-orange/10 hover:text-orange transition-colors"
                            >
                              {sub}
                            </Badge>
                          </Link>
                        ))}
                        {cat.subcategories.length > 5 && (
                          <Badge variant="outline" className="text-muted-foreground">
                            +{cat.subcategories.length - 5}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-navy mb-2">
                Aucune categorie trouvee
              </h3>
              <p className="text-muted-foreground mb-4">
                Essayez avec d&apos;autres termes de recherche
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Voir toutes les categories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cream px-[5%] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-extrabold text-navy mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Publiez votre tache gratuitement et laissez les travailleurs vous contacter avec leurs offres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/post">
              <Button size="lg" className="bg-orange hover:bg-orange-hover">
                Publier une tache <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Parcourir toutes les taches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white px-[5%] py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-light rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M5 14c0-1 .7-2 2-2h3l2 2 2-2h3c1.3 0 2 1 2 2v1c0 1.3-.7 2-2 2H7c-1.3 0-2-.7-2-2v-1z" fill="#f47920" />
                <circle cx="8" cy="7" r="2.5" fill="white" opacity=".85" />
                <circle cx="16" cy="7" r="2.5" fill="white" opacity=".85" />
              </svg>
            </div>
            <span className="font-serif font-bold">Moyawim<span className="text-orange">.ma</span></span>
          </div>
          <p className="text-sm text-white/40">
            © 2025 Moyawim.ma - Tous droits reserves
          </p>
        </div>
      </footer>
    </div>
  )
}
