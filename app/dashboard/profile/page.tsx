"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { 
  Camera, MapPin, Star, CheckCircle2, Plus, X, Briefcase, 
  Clock, Award, Shield, Edit3, Save, Upload, Trash2, Eye,
  Phone, Mail, Calendar, Globe, Languages
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import {
  useSaveEmployerProfile,
  useSaveWorkerProfile,
  useWorkerProfile,
} from "@/lib/firebase-hooks"
import { CATEGORIES, MOROCCAN_CITIES } from "@/lib/types"

// Mock portfolio images
const mockPortfolio = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
]

// Skills suggestions per category
const skillsSuggestions: Record<string, string[]> = {
  construction: ["Maconnerie", "Plomberie", "Electricite", "Peinture", "Carrelage", "Menuiserie", "Soudure", "Renovation"],
  cleaning: ["Menage maison", "Nettoyage bureaux", "Lavage vitres", "Repassage", "Desinfection"],
  gardening: ["Taille haies", "Tonte pelouse", "Arrosage", "Amenagement", "Entretien"],
  moving: ["Demenagement", "Montage meubles", "Emballage", "Transport"],
  tech: ["Reparation PC", "Installation logiciel", "Reseau", "Support technique"],
}

export default function ProfilePage() {
  const { user, userData, refreshUserData } = useAuth()
  const { saveEmployer } = useSaveEmployerProfile()
  const { saveWorker } = useSaveWorkerProfile()
  const { profile: workerProfile, loading: profileLoading } = useWorkerProfile()

  const isWorker = userData?.role === "worker"
  const name = userData?.name || user?.displayName || ""
  const email = user?.email || ""

  // Employer fields
  const [empName, setEmpName] = useState(name)
  const [empPhone, setEmpPhone] = useState(userData?.phone || "")
  const [empCity, setEmpCity] = useState(userData?.city || "")
  const [empCompany, setEmpCompany] = useState("")

  // Worker fields
  const [wName, setWName] = useState(name)
  const [wPhone, setWPhone] = useState(userData?.phone || "")
  const [wJob, setWJob] = useState("")
  const [wPrice, setWPrice] = useState(0)
  const [wHourlyRate, setWHourlyRate] = useState(0)
  const [wCity, setWCity] = useState("")
  const [wDesc, setWDesc] = useState("")
  const [wExp, setWExp] = useState(0)
  const [wAvailable, setWAvailable] = useState(true)
  const [wCategory, setWCategory] = useState("")
  const [wSkills, setWSkills] = useState<string[]>([])
  const [wNewSkill, setWNewSkill] = useState("")
  const [wLanguages, setWLanguages] = useState<string[]>(["Arabe", "Francais"])
  const [wRadius, setWRadius] = useState(20)
  const [wPortfolio, setWPortfolio] = useState<string[]>(mockPortfolio)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // Profile completion score
  const calculateCompletion = () => {
    let score = 0
    if (wName) score += 10
    if (wPhone) score += 10
    if (wJob) score += 15
    if (wPrice) score += 10
    if (wCity) score += 10
    if (wDesc && wDesc.length > 50) score += 15
    if (wExp) score += 5
    if (wSkills.length > 0) score += 10
    if (wCategory) score += 5
    if (wPortfolio.length > 0) score += 10
    return Math.min(score, 100)
  }

  const completionScore = calculateCompletion()

  // Load worker profile data
  useEffect(() => {
    if (workerProfile) {
      setWJob(workerProfile.job || "")
      setWPrice(workerProfile.price || 0)
      setWHourlyRate(workerProfile.hourlyRate || 0)
      setWCity(workerProfile.city || "")
      setWDesc(workerProfile.desc || "")
      setWExp(workerProfile.exp || 0)
      setWAvailable(workerProfile.available !== false)
      setWCategory(workerProfile.category || "")
      setWSkills(workerProfile.skills || [])
      setWRadius(workerProfile.radius || 20)
    }
  }, [workerProfile])

  const addSkill = () => {
    if (wNewSkill.trim() && !wSkills.includes(wNewSkill.trim()) && wSkills.length < 10) {
      setWSkills([...wSkills, wNewSkill.trim()])
      setWNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setWSkills(wSkills.filter(s => s !== skill))
  }

  const handleSaveEmployer = async () => {
    if (!empName.trim()) {
      toast.error("Entrez votre nom")
      return
    }
    setLoading(true)
    try {
      await saveEmployer(empName.trim(), empPhone.trim())
      await refreshUserData()
      toast.success("Profil mis a jour !")
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(`Erreur: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWorker = async () => {
    if (!wJob.trim()) {
      toast.error("Entrez votre metier")
      return
    }
    setLoading(true)
    try {
      await saveWorker({
        name: wName.trim(),
        phone: wPhone.trim(),
        job: wJob.trim(),
        price: wPrice,
        hourlyRate: wHourlyRate,
        city: wCity.trim(),
        desc: wDesc.trim(),
        exp: wExp,
        available: wAvailable,
        category: wCategory,
        skills: wSkills,
        radius: wRadius,
      })
      await refreshUserData()
      toast.success("Profil mis a jour !")
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(`Erreur: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  if (isWorker) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-2">
                Mon profil travailleur
              </h1>
              <p className="text-muted-foreground">
                Completez votre profil pour attirer plus de clients et recevoir des offres pertinentes.
              </p>
            </div>
            
            <Button 
              onClick={handleSaveWorker} 
              className="bg-orange hover:bg-orange-hover gap-2"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              {loading ? "Enregistrement..." : "Sauvegarder"}
            </Button>
          </div>

          {/* Profile Card Header */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-navy to-navy-light h-24" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row gap-4 -mt-12">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center font-serif text-3xl font-extrabold text-white ring-4 ring-card">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white hover:bg-orange transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 pt-2 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-navy">{name || "Votre nom"}</h2>
                      <p className="text-muted-foreground">{wJob || "Votre metier"}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {wCity || "Votre ville"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-orange text-orange" />
                          {userData?.rating || 4.5} ({userData?.reviewsCount || 0} avis)
                        </span>
                      </div>
                    </div>
                    
                    {/* Availability toggle */}
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${wAvailable ? "bg-success/10" : "bg-muted"}`}>
                      <Switch checked={wAvailable} onCheckedChange={setWAvailable} />
                      <span className={`text-sm font-medium ${wAvailable ? "text-success" : "text-muted-foreground"}`}>
                        {wAvailable ? "Disponible" : "Indisponible"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile completion */}
              <div className="mt-6 p-4 bg-cream rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-navy">Profil complete a</span>
                  <span className="text-sm font-bold text-orange">{completionScore}%</span>
                </div>
                <Progress value={completionScore} className="h-2" />
                {completionScore < 100 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Completez votre profil pour apparaitre en haut des resultats de recherche
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-card border mb-6">
              <TabsTrigger value="info" className="gap-2">
                <Edit3 className="w-4 h-4" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Award className="w-4 h-4" />
                Competences
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-2">
                <Camera className="w-4 h-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Shield className="w-4 h-4" />
                Parametres
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations personnelles</CardTitle>
                    <CardDescription>Vos coordonnees et informations de contact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input 
                        value={wName} 
                        onChange={(e) => setWName(e.target.value)}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telephone</Label>
                      <Input 
                        value={wPhone} 
                        onChange={(e) => setWPhone(e.target.value)}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={email} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Select value={wCity} onValueChange={setWCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionnez votre ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOROCCAN_CITIES.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations professionnelles</CardTitle>
                    <CardDescription>Votre metier et tarifs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Categorie</Label>
                      <Select value={wCategory} onValueChange={setWCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionnez une categorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Metier / Titre professionnel</Label>
                      <Input 
                        value={wJob} 
                        onChange={(e) => setWJob(e.target.value)}
                        placeholder="Ex: Plombier, Electricien, Femme de menage..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tarif journalier (DH)</Label>
                        <Input 
                          type="number"
                          value={wPrice || ""} 
                          onChange={(e) => setWPrice(Number(e.target.value))}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tarif horaire (DH)</Label>
                        <Input 
                          type="number"
                          value={wHourlyRate || ""} 
                          onChange={(e) => setWHourlyRate(Number(e.target.value))}
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Annees d&apos;experience</Label>
                      <Input 
                        type="number"
                        value={wExp || ""} 
                        onChange={(e) => setWExp(Number(e.target.value))}
                        placeholder="5"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Description</CardTitle>
                    <CardDescription>Decrivez votre experience et vos specialites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={wDesc}
                      onChange={(e) => setWDesc(e.target.value)}
                      placeholder="Decrivez vos competences, votre experience, vos specialites, ce qui vous differencie..."
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {wDesc.length}/500 caracteres - Une bonne description augmente vos chances d&apos;etre contacte
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vos competences</CardTitle>
                  <CardDescription>
                    Ajoutez vos competences pour apparaitre dans les recherches pertinentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add skill */}
                  <div className="flex gap-2">
                    <Input
                      value={wNewSkill}
                      onChange={(e) => setWNewSkill(e.target.value)}
                      placeholder="Ajouter une competence..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {/* Current skills */}
                  {wSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {wSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="px-3 py-1.5 gap-2"
                        >
                          {skill}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {wCategory && skillsSuggestions[wCategory] && (
                    <div>
                      <p className="text-sm font-medium text-navy mb-3">Suggestions pour {CATEGORIES.find(c => c.id === wCategory)?.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {skillsSuggestions[wCategory]
                          .filter(s => !wSkills.includes(s))
                          .map((skill) => (
                            <Badge 
                              key={skill} 
                              variant="outline"
                              className="cursor-pointer hover:bg-orange/10 hover:text-orange hover:border-orange"
                              onClick={() => setWSkills([...wSkills, skill])}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-navy mb-3 flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Langues parlees
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Arabe", "Francais", "Anglais", "Espagnol", "Darija"].map((lang) => (
                        <Badge 
                          key={lang}
                          variant={wLanguages.includes(lang) ? "default" : "outline"}
                          className={`cursor-pointer ${wLanguages.includes(lang) ? "bg-navy" : "hover:bg-navy/10"}`}
                          onClick={() => {
                            if (wLanguages.includes(lang)) {
                              setWLanguages(wLanguages.filter(l => l !== lang))
                            } else {
                              setWLanguages([...wLanguages, lang])
                            }
                          }}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Portfolio</CardTitle>
                      <CardDescription>
                        Ajoutez des photos de vos travaux pour montrer votre savoir-faire
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-orange hover:bg-orange-hover gap-2">
                          <Upload className="w-4 h-4" />
                          Ajouter une photo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter une photo</DialogTitle>
                          <DialogDescription>
                            Telechargez une photo de vos travaux realises
                          </DialogDescription>
                        </DialogHeader>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Glissez une image ici ou cliquez pour selectionner
                          </p>
                          <Button variant="outline" size="sm">
                            Parcourir
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {wPortfolio.length === 0 ? (
                    <div className="text-center py-12">
                      <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-medium text-navy mb-1">Aucune photo</p>
                      <p className="text-xs text-muted-foreground">
                        Ajoutez des photos de vos travaux pour attirer plus de clients
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {wPortfolio.map((img, i) => (
                        <div key={i} className="relative group aspect-[4/3] rounded-xl overflow-hidden">
                          <Image
                            src={img}
                            alt={`Portfolio ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-navy hover:bg-cream transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center text-white hover:bg-destructive/90 transition-colors"
                              onClick={() => setWPortfolio(wPortfolio.filter((_, idx) => idx !== i))}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Zone de travail</CardTitle>
                    <CardDescription>Definissez votre zone de deplacement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Rayon de deplacement</Label>
                        <span className="text-sm font-medium text-orange">{wRadius} km</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        value={wRadius}
                        onChange={(e) => setWRadius(Number(e.target.value))}
                        className="w-full accent-orange"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5 km</span>
                        <span>100 km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Verification du compte</CardTitle>
                    <CardDescription>Verifiez votre identite pour gagner la confiance des clients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy">Email verifie</p>
                          <p className="text-xs text-muted-foreground">{email}</p>
                        </div>
                      </div>
                      <Badge className="bg-success/10 text-success hover:bg-success/10">Verifie</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-orange" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy">Verification CNIE</p>
                          <p className="text-xs text-muted-foreground">Augmentez votre credibilite</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Verifier</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-navy" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy">Telephone verifie</p>
                          <p className="text-xs text-muted-foreground">{wPhone || "Non renseigne"}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Verifier</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Employer profile
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-2">
            Mon profil
          </h1>
          <p className="text-muted-foreground">
            Gerez vos informations personnelles
          </p>
        </div>

        <Card>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-navy to-navy-light p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center font-serif text-2xl font-extrabold text-white ring-4 ring-white/20">
                  {name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg flex items-center justify-center text-navy hover:bg-cream transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white">{name}</h2>
                <p className="text-white/60">{email}</p>
                <Badge className="mt-2 bg-orange/20 text-orange hover:bg-orange/20">EMPLOYEUR</Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={empName} onChange={(e) => setEmpName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input 
                  value={empPhone} 
                  onChange={(e) => setEmpPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={empCity} onValueChange={setEmpCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez votre ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Entreprise (optionnel)</Label>
                <Input 
                  value={empCompany} 
                  onChange={(e) => setEmpCompany(e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled className="bg-muted" />
            </div>

            <Button
              onClick={handleSaveEmployer}
              className="w-full bg-navy hover:bg-orange"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
