"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  ArrowLeft, ArrowRight, Check, MapPin, Calendar, 
  DollarSign, FileText, Zap, Image as ImageIcon, Plus, X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { usePostTask } from "@/lib/firebase-hooks"
import { CATEGORIES, MOROCCAN_CITIES } from "@/lib/types"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, title: "Categorie", icon: FileText },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "Lieu & Date", icon: MapPin },
  { id: 4, title: "Budget", icon: DollarSign },
  { id: 5, title: "Confirmation", icon: Check },
]

export default function PostTaskPage() {
  const router = useRouter()
  const { postTask } = usePostTask()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Form data
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [remote, setRemote] = useState(false)
  const [flexible, setFlexible] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly" | "daily">("fixed")
  const [budgetAmount, setBudgetAmount] = useState(200)
  const [negotiable, setNegotiable] = useState(true)
  const [urgent, setUrgent] = useState(false)

  const selectedCategory = CATEGORIES.find(c => c.id === category)

  const addRequirement = () => {
    if (newRequirement.trim() && requirements.length < 5) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!category
      case 2: return title.trim().length >= 10 && description.trim().length >= 20
      case 3: return !!city
      case 4: return budgetAmount >= 50
      default: return true
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setLoading(true)
    try {
      const docRef = await postTask({
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory: subcategory || undefined,
        location: {
          city,
          address: address.trim(),
          remote,
        },
        budget: {
          type: budgetType,
          amount: budgetAmount,
          negotiable,
        },
        dates: {
          flexible,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        images: [],
        requirements: requirements.length > 0 ? requirements : undefined,
        urgent,
      })
      
      toast.success("Tache publiee avec succes !")
      router.push(`/tasks/${docRef.id}`)
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(`Erreur: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream/50">
      {/* Progress header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <span className="text-sm text-muted-foreground">Etape {step} sur {STEPS.length}</span>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {STEPS.map((s) => (
              <div 
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s.id <= step ? "bg-orange" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Step 1: Category */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy mb-2">
                  Quelle categorie correspond a votre tache ?
                </h1>
                <p className="text-muted-foreground">
                  Selectionnez la categorie qui decrit le mieux ce que vous recherchez
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id)
                      setSubcategory("")
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:border-orange/50",
                      category === cat.id 
                        ? "border-orange bg-orange/5" 
                        : "border-border bg-card hover:bg-cream/50"
                    )}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-navy">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">{cat.nameAr}</div>
                    </div>
                    {category === cat.id && (
                      <Check className="w-5 h-5 text-orange ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Subcategory */}
              {selectedCategory && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Sous-categorie (optionnel)</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.subcategories.map((sub) => (
                      <Badge
                        key={sub}
                        variant={subcategory === sub ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          subcategory === sub 
                            ? "bg-orange hover:bg-orange" 
                            : "hover:bg-orange/10 hover:border-orange"
                        )}
                        onClick={() => setSubcategory(subcategory === sub ? "" : sub)}
                      >
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy mb-2">
                  Decrivez votre tache
                </h1>
                <p className="text-muted-foreground">
                  Plus votre description est detaillee, plus vous recevrez d&apos;offres pertinentes
                </p>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Titre de la tache <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: Reparation fuite d'eau salle de bain"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Description detaillee <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="Decrivez precisement ce que vous attendez : le probleme, les conditions, le materiel fourni ou non, les horaires preferes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Exigences specifiques (optionnel)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Experience en plomberie requise"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addRequirement}
                      disabled={!newRequirement.trim() || requirements.length >= 5}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {requirements.map((req, i) => (
                        <Badge key={i} variant="secondary" className="gap-1.5 py-1.5">
                          {req}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeRequirement(i)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Date */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy mb-2">
                  Ou et quand ?
                </h1>
                <p className="text-muted-foreground">
                  Indiquez le lieu et la periode souhaitee pour la realisation
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Ville <span className="text-destructive">*</span></Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionnez une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOROCCAN_CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Adresse ou quartier (optionnel)</Label>
                    <Input
                      placeholder="Ex: Quartier Maarif, pres du Twin Center"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Tache realisable a distance</Label>
                      <p className="text-xs text-muted-foreground">Cette tache peut etre faite en ligne</p>
                    </div>
                    <Switch checked={remote} onCheckedChange={setRemote} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Dates flexibles</Label>
                      <p className="text-xs text-muted-foreground">Je suis flexible sur les dates</p>
                    </div>
                    <Switch checked={flexible} onCheckedChange={setFlexible} />
                  </div>
                  
                  {!flexible && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date de debut</Label>
                        <Input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date de fin (optionnel)</Label>
                        <Input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy mb-2">
                  Quel est votre budget ?
                </h1>
                <p className="text-muted-foreground">
                  Definissez un budget realiste pour attirer les meilleurs travailleurs
                </p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Type de tarification</Label>
                      <RadioGroup 
                        value={budgetType} 
                        onValueChange={(v) => setBudgetType(v as typeof budgetType)}
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          { value: "fixed", label: "Forfait", desc: "Prix fixe" },
                          { value: "hourly", label: "Horaire", desc: "Par heure" },
                          { value: "daily", label: "Journalier", desc: "Par jour" },
                        ].map((type) => (
                          <label
                            key={type.value}
                            className={cn(
                              "flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                              budgetType === type.value 
                                ? "border-orange bg-orange/5" 
                                : "border-border hover:border-orange/50"
                            )}
                          >
                            <RadioGroupItem value={type.value} className="sr-only" />
                            <span className="font-medium text-navy">{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.desc}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <span className="font-serif text-5xl font-extrabold text-navy">
                          {budgetAmount} DH
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {budgetType === "hourly" ? "/ heure" : budgetType === "daily" ? "/ jour" : ""}
                        </span>
                      </div>
                      <Slider
                        value={[budgetAmount]}
                        onValueChange={([v]) => setBudgetAmount(v)}
                        min={50}
                        max={budgetType === "hourly" ? 500 : budgetType === "daily" ? 1000 : 5000}
                        step={budgetType === "hourly" ? 10 : 50}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50 DH</span>
                        <span>{budgetType === "hourly" ? 500 : budgetType === "daily" ? 1000 : 5000} DH</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-t">
                      <div>
                        <Label>Budget negociable</Label>
                        <p className="text-xs text-muted-foreground">Les travailleurs peuvent proposer un autre prix</p>
                      </div>
                      <Switch checked={negotiable} onCheckedChange={setNegotiable} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-orange/30 bg-orange/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-orange flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Label>Marquer comme urgent</Label>
                        <Switch checked={urgent} onCheckedChange={setUrgent} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Les taches urgentes sont mises en avant et attirent plus d&apos;offres rapidement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy mb-2">
                  Verifiez votre annonce
                </h1>
                <p className="text-muted-foreground">
                  Assurez-vous que toutes les informations sont correctes avant de publier
                </p>
              </div>
              
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: selectedCategory?.color || "#6b7280" }}
                    >
                      {selectedCategory?.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        {selectedCategory?.name}{subcategory && ` / ${subcategory}`}
                      </Badge>
                      <h2 className="font-serif text-xl font-bold text-navy">{title}</h2>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
                  
                  {requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-navy mb-2">Exigences</h4>
                      <div className="flex flex-wrap gap-2">
                        {requirements.map((req, i) => (
                          <Badge key={i} variant="outline">{req}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{city}{address && `, ${address}`}</span>
                      {remote && <Badge variant="secondary" className="text-xs">Remote OK</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{flexible ? "Dates flexibles" : startDate || "A definir"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <div className="font-serif text-2xl font-extrabold text-navy">
                        {budgetAmount} DH
                        <span className="text-base font-normal text-muted-foreground ml-1">
                          {budgetType === "hourly" ? "/h" : budgetType === "daily" ? "/jour" : ""}
                        </span>
                      </div>
                      {negotiable && <span className="text-xs text-muted-foreground">Negociable</span>}
                    </div>
                    {urgent && (
                      <Badge className="bg-destructive/10 text-destructive">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Precedent
              </Button>
            ) : (
              <div />
            )}
            
            {step < STEPS.length ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-navy hover:bg-orange"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="bg-orange hover:bg-orange-hover"
              >
                {loading ? "Publication..." : "Publier la tache"}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
