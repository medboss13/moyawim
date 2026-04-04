"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, MapPin, Filter, Clock, DollarSign, ChevronRight, 
  Star, Eye, MessageSquare, Zap, X, SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useBrowseTasks } from "@/lib/firebase-hooks"
import { CATEGORIES, MOROCCAN_CITIES, type Task } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/utils"

function TaskCard({ task }: { task: Task }) {
  const category = CATEGORIES.find(c => c.id === task.category)
  
  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-5">
            {/* Header with category and badges */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: category?.color || "#6b7280" }}
                >
                  {(category?.name || task.category || "?").charAt(0)}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">{category?.name || task.category}</span>
                  {task.subcategory && (
                    <span className="text-xs text-muted-foreground"> / {task.subcategory}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {task.urgent && (
                  <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 text-[10px] px-1.5">
                    <Zap className="w-3 h-3 mr-0.5" />
                    Urgent
                  </Badge>
                )}
                {task.featured && (
                  <Badge className="bg-orange/10 text-orange hover:bg-orange/10 text-[10px] px-1.5">
                    <Star className="w-3 h-3 mr-0.5" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Title */}
            <h3 className="font-serif text-base font-bold text-navy group-hover:text-orange transition-colors line-clamp-2 mb-2">
              {task.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {task.description || "Pas de description"}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {task.location?.city || "Non specifie"}
                {task.location?.remote && " (Remote OK)"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.dates?.flexible ? "Flexible" : task.dates?.startDate || "A discuter"}
              </span>
            </div>
            
            {/* Footer with budget and stats */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div>
                <span className="font-serif text-xl font-extrabold text-navy">
                  {task.budget?.amount || 0} DH
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {task.budget?.type === "hourly" ? "/h" : task.budget?.type === "daily" ? "/jour" : ""}
                </span>
                {task.budget?.negotiable && (
                  <span className="text-[10px] text-muted-foreground ml-1">(nego.)</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {task.offersCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {task.viewsCount || 0}
                </span>
              </div>
            </div>
          </div>
          
          {/* Posted by */}
          <div className="px-5 py-3 bg-cream/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center text-[10px] font-bold text-orange">
                {(task.userName || "?").charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-muted-foreground">
                {task.userName || "Anonyme"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {task.createdAt ? formatDistanceToNow(task.createdAt.toDate()) : "Recemment"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TaskCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-3 mb-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex justify-between pt-3 border-t">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="px-5 py-3 bg-cream/50 flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function BrowseTasksPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [budgetRange, setBudgetRange] = useState([0, 5000])
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "budget_high" | "budget_low" | "popular">("recent")
  
  const { tasks, loading } = useBrowseTasks({
    category: category || undefined,
    city: city || undefined,
    minBudget: budgetRange[0] > 0 ? budgetRange[0] : undefined,
    maxBudget: budgetRange[1] < 5000 ? budgetRange[1] : undefined,
    remote: remoteOnly || undefined,
  })
  
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(t => 
        t.title?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.location?.city?.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort
    switch (sortBy) {
      case "budget_high":
        result = [...result].sort((a, b) => (b.budget?.amount || 0) - (a.budget?.amount || 0))
        break
      case "budget_low":
        result = [...result].sort((a, b) => (a.budget?.amount || 0) - (b.budget?.amount || 0))
        break
      case "popular":
        result = [...result].sort((a, b) => (b.offersCount || 0) - (a.offersCount || 0))
        break
      default:
        // Already sorted by recent from hook
        break
    }
    
    return result
  }, [tasks, search, sortBy])
  
  const activeFiltersCount = [
    category,
    city,
    budgetRange[0] > 0 || budgetRange[1] < 5000,
    remoteOnly,
  ].filter(Boolean).length

  const clearFilters = () => {
    setCategory("")
    setCity("")
    setBudgetRange([0, 5000])
    setRemoteOnly(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white">
        <div className="px-[5%] py-4">
          <div className="flex items-center justify-between gap-4">
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
            
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Rechercher une mission..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/50 focus:bg-white/20"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/dashboard")}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Dashboard
              </Button>
              <Button 
                onClick={() => router.push("/dashboard/post")}
                className="bg-orange hover:bg-orange-hover"
              >
                Poster une mission
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-[5%] py-6">
        {/* Mobile search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif font-bold text-navy">Filtres</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-auto p-1">
                      Effacer ({activeFiltersCount})
                    </Button>
                  )}
                </div>
                
                {/* Category */}
                <div className="mb-5">
                  <Label className="text-xs font-bold text-navy uppercase tracking-wider mb-2 block">
                    Categorie
                  </Label>
                  <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les categories</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* City */}
                <div className="mb-5">
                  <Label className="text-xs font-bold text-navy uppercase tracking-wider mb-2 block">
                    Ville
                  </Label>
                  <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {MOROCCAN_CITIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Budget */}
                <div className="mb-5">
                  <Label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 block">
                    Budget: {budgetRange[0]} - {budgetRange[1]} DH
                  </Label>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    min={0}
                    max={5000}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0 DH</span>
                    <span>5000 DH</span>
                  </div>
                </div>
                
                {/* Remote */}
                <div className="flex items-center justify-between py-3 border-t">
                  <Label className="text-sm">Travail a distance uniquement</Label>
                  <Switch checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                {/* Mobile filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-orange text-white">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                      {/* Same filters as desktop */}
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider mb-2 block">Categorie</Label>
                        <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                          <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider mb-2 block">Ville</Label>
                        <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v)}>
                          <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {MOROCCAN_CITIES.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider mb-3 block">
                          Budget: {budgetRange[0]} - {budgetRange[1]} DH
                        </Label>
                        <Slider value={budgetRange} onValueChange={setBudgetRange} min={0} max={5000} step={50} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Remote uniquement</Label>
                        <Switch checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredAndSortedTasks.length}</span> missions disponibles
                </p>
              </div>
              
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus recentes</SelectItem>
                  <SelectItem value="budget_high">Budget: Eleve a bas</SelectItem>
                  <SelectItem value="budget_low">Budget: Bas a eleve</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filters badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {category && (
                  <Badge variant="secondary" className="gap-1">
                    {CATEGORIES.find(c => c.id === category)?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory("")} />
                  </Badge>
                )}
                {city && (
                  <Badge variant="secondary" className="gap-1">
                    {city}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setCity("")} />
                  </Badge>
                )}
                {(budgetRange[0] > 0 || budgetRange[1] < 5000) && (
                  <Badge variant="secondary" className="gap-1">
                    {budgetRange[0]}-{budgetRange[1]} DH
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setBudgetRange([0, 5000])} />
                  </Badge>
                )}
                {remoteOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Remote
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setRemoteOnly(false)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Tasks Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/25 mb-4" />
                <h3 className="font-serif text-lg font-bold text-navy mb-2">Aucune mission trouvee</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Essayez de modifier vos filtres ou{" "}
                  <button onClick={clearFilters} className="text-orange hover:underline">
                    effacez tous les filtres
                  </button>
                </p>
                <Button onClick={() => router.push("/dashboard/post")} className="bg-navy hover:bg-orange">
                  Poster une mission
                </Button>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAndSortedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
