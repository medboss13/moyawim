"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, MapPin, Star, MessageSquare, Calendar, Phone,
  Shield, CheckCircle2, Clock, Award, Briefcase, Globe,
  ThumbsUp, TrendingUp, BadgeCheck, Mail, Share2, Flag
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useWorkerProfile, useUserReviews, useBrowseTasks } from "@/lib/firebase-hooks"
import { CATEGORIES, type Review } from "@/lib/types"
import { formatDistanceToNow, getInitials } from "@/lib/utils"
import { db, doc, getDoc } from "@/lib/firebase"

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-4 bg-cream/50 rounded-xl">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.fromAvatar} />
          <AvatarFallback className="bg-navy/10 text-navy text-sm font-bold">
            {getInitials(review.fromName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-navy text-sm">{review.fromName}</p>
              <p className="text-xs text-muted-foreground">{review.taskTitle}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < review.rating ? "fill-orange text-orange" : "text-muted-foreground/30"}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {review.comment}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {review.createdAt ? formatDistanceToNow(review.createdAt.toDate()) : "Recemment"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { user } = useAuth()
  
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { profile: workerProfile, loading: workerLoading } = useWorkerProfile(userId)
  const { reviews, loading: reviewsLoading } = useUserReviews(userId)
  const { tasks } = useBrowseTasks({ /* filter by user if needed */ })
  
  const isOwnProfile = user?.uid === userId
  const isWorker = userData?.role === "worker"
  
  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return
      try {
        const userDoc = await getDoc(doc(db, "users", userId))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [userId])
  
  const name = (userData?.name as string) || "Utilisateur"
  const city = (userData?.city as string) || workerProfile?.city || ""
  const rating = (userData?.rating as number) || workerProfile?.rating || 0
  const reviewsCount = (userData?.reviewsCount as number) || 0
  const tasksCompleted = (userData?.tasksCompleted as number) || 0
  const verified = (userData?.verified as boolean) || false
  const memberSince = userData?.createdAt as { toDate: () => Date } | undefined
  const category = workerProfile?.category ? CATEGORIES.find(c => c.id === workerProfile.category) : null
  
  if (loading || workerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-navy text-white px-[5%] py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
          </div>
        </header>
        <div className="px-[5%] py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-6 mb-8">
              <Skeleton className="w-32 h-32 rounded-2xl" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="font-serif text-xl font-bold text-navy mb-2">Profil introuvable</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Cet utilisateur n&apos;existe pas ou a ete supprime.
          </p>
          <Button onClick={() => router.push("/browse")} className="bg-navy hover:bg-orange">
            Retour aux missions
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-white sticky top-0 z-40">
        <div className="px-[5%] py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Share2 className="w-5 h-5" />
              </Button>
              {!isOwnProfile && (
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Flag className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-[5%] py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-navy to-navy-light h-28" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row gap-5 -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center font-serif text-4xl font-extrabold text-white ring-4 ring-card">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  {verified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-xl flex items-center justify-center ring-4 ring-card">
                      <BadgeCheck className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pt-2 sm:pt-10">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-serif text-2xl font-bold text-navy">{name}</h1>
                        {verified && (
                          <Badge className="bg-success/10 text-success hover:bg-success/10">
                            <Shield className="w-3 h-3 mr-1" />
                            Verifie
                          </Badge>
                        )}
                      </div>
                      {isWorker && workerProfile?.job && (
                        <p className="text-muted-foreground mt-1">{workerProfile.job}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {city}
                          </span>
                        )}
                        {memberSince && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Membre depuis {memberSince.toDate().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    {!isOwnProfile && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/dashboard/messages?to=${userId}`)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        {isWorker && (
                          <Button className="bg-orange hover:bg-orange-hover">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Proposer une tache
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isOwnProfile && (
                      <Button 
                        variant="outline"
                        onClick={() => router.push("/dashboard/profile")}
                      >
                        Modifier le profil
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 fill-orange text-orange" />
                  <span className="font-serif text-2xl font-extrabold text-navy">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Note moyenne</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="font-serif text-2xl font-extrabold text-navy mb-1">
                  {reviewsCount}
                </div>
                <p className="text-xs text-muted-foreground">Avis recus</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="font-serif text-2xl font-extrabold text-navy mb-1">
                  {tasksCompleted}
                </div>
                <p className="text-xs text-muted-foreground">Taches completees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="font-serif text-2xl font-extrabold text-success mb-1">
                  {workerProfile?.completionRate || 100}%
                </div>
                <p className="text-xs text-muted-foreground">Taux de reussite</p>
              </CardContent>
            </Card>
          </div>

          {/* Worker specific content */}
          {isWorker && workerProfile && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="about">
                  <TabsList className="w-full justify-start bg-card border mb-6">
                    <TabsTrigger value="about">A propos</TabsTrigger>
                    <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about">
                    <div className="space-y-6">
                      {/* Description */}
                      {workerProfile.desc && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Description</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {workerProfile.desc}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Skills */}
                      {workerProfile.skills && workerProfile.skills.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Competences</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {workerProfile.skills.map((skill: string) => (
                                <Badge 
                                  key={skill} 
                                  variant="secondary"
                                  className="px-3 py-1.5"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Experience */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange" />
                              </div>
                              <div>
                                <p className="font-semibold text-navy">{workerProfile.exp || 0}+ ans</p>
                                <p className="text-xs text-muted-foreground">Experience</p>
                              </div>
                            </div>
                            {category && (
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${category.color}15` }}
                                >
                                  <Briefcase className="w-5 h-5" style={{ color: category.color }} />
                                </div>
                                <div>
                                  <p className="font-semibold text-navy">{category.name}</p>
                                  <p className="text-xs text-muted-foreground">Categorie</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <div className="flex gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-4 w-32 mb-2" />
                                  <Skeleton className="h-3 w-full mb-2" />
                                  <Skeleton className="h-3 w-2/3" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : reviews.length === 0 ? (
                      <Card className="p-8 text-center">
                        <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">Aucun avis pour le moment</p>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {/* Rating summary */}
                        <Card>
                          <CardContent className="p-5">
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="font-serif text-4xl font-extrabold text-navy">
                                  {rating.toFixed(1)}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < Math.round(rating) ? "fill-orange text-orange" : "text-muted-foreground/30"}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {reviewsCount} avis
                                </p>
                              </div>
                              <div className="flex-1 space-y-2">
                                {[5, 4, 3, 2, 1].map(star => {
                                  const count = reviews.filter(r => r.rating === star).length
                                  const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0
                                  return (
                                    <div key={star} className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground w-3">{star}</span>
                                      <Star className="w-3 h-3 fill-orange text-orange" />
                                      <Progress value={percentage} className="h-2 flex-1" />
                                      <span className="text-xs text-muted-foreground w-6">{count}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Reviews list */}
                        {reviews.map(review => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="portfolio">
                    {workerProfile.portfolio && workerProfile.portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {workerProfile.portfolio.map((img: string, i: number) => (
                          <div key={i} className="aspect-video rounded-xl overflow-hidden bg-cream">
                            <Image
                              src={img}
                              alt={`Portfolio ${i + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">Aucune photo de portfolio</p>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tarifs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {workerProfile.dailyRate && (
                      <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                        <span className="text-sm text-muted-foreground">Tarif journalier</span>
                        <span className="font-serif font-bold text-navy">{workerProfile.dailyRate} DH</span>
                      </div>
                    )}
                    {workerProfile.hourlyRate && (
                      <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                        <span className="text-sm text-muted-foreground">Tarif horaire</span>
                        <span className="font-serif font-bold text-navy">{workerProfile.hourlyRate} DH</span>
                      </div>
                    )}
                    {workerProfile.price && !workerProfile.dailyRate && (
                      <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                        <span className="text-sm text-muted-foreground">A partir de</span>
                        <span className="font-serif font-bold text-navy">{workerProfile.price} DH</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card className={workerProfile.available ? "border-success/30 bg-success/5" : ""}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${workerProfile.available ? "bg-success" : "bg-muted"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white ${workerProfile.available ? "animate-pulse" : ""}`} />
                    </div>
                    <div>
                      <p className="font-medium text-navy">
                        {workerProfile.available ? "Disponible" : "Indisponible"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workerProfile.available ? "Pret a travailler" : "Actuellement occupe"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                {workerProfile.languages && workerProfile.languages.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Langues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {workerProfile.languages.map((lang: string) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact button */}
                {!isOwnProfile && (
                  <Button 
                    className="w-full bg-orange hover:bg-orange-hover"
                    onClick={() => router.push(`/dashboard/messages?to=${userId}`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Envoyer un message
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Employer content */}
          {!isWorker && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">A propos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {userData.bio as string || "Cet utilisateur n'a pas encore ajoute de description."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Camera icon for portfolio
function Camera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
