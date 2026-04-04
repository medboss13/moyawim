"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, MapPin, Clock, Calendar, DollarSign, Star, 
  MessageSquare, Eye, Share2, Heart, Flag, CheckCircle2,
  User, Shield, Zap, Send, ChevronRight, AlertTriangle, 
  Phone, Timer, Award, TrendingUp, Copy, Check, X
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTask, useTaskOffers, useMakeOffer, incrementTaskViews, acceptOffer, useBrowseTasks, withdrawOffer } from "@/lib/firebase-hooks"
import { useAuth } from "@/lib/auth-context"
import { CATEGORIES, type Offer } from "@/lib/types"
import { formatDistanceToNow, formatCurrency, getInitials } from "@/lib/utils"

function OfferCard({ 
  offer, 
  isOwner, 
  isMyOffer,
  taskId,
  onAccept,
  onWithdraw
}: { 
  offer: Offer
  isOwner: boolean
  isMyOffer: boolean
  taskId: string
  onAccept: () => void
  onWithdraw: () => void
}) {
  const router = useRouter()
  const [accepting, setAccepting] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  
  const handleAccept = async () => {
    setAccepting(true)
    try {
      await acceptOffer(offer.id, taskId, offer.workerId, offer.workerName)
      toast.success("Offre acceptee ! Contactez le travailleur pour commencer.")
      onAccept()
    } catch (error) {
      toast.error("Erreur lors de l'acceptation")
    } finally {
      setAccepting(false)
    }
  }

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await withdrawOffer(offer.id, taskId)
      toast.success("Offre retiree")
      onWithdraw()
    } catch (error) {
      toast.error("Erreur lors du retrait")
    } finally {
      setWithdrawing(false)
    }
  }
  
  return (
    <Card className={`transition-all ${
      offer.status === "accepted" ? "ring-2 ring-success bg-success/5" : 
      offer.status === "rejected" ? "opacity-60" :
      isMyOffer ? "ring-2 ring-orange/30 bg-orange/5" : ""
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Link href={`/profile/${offer.workerId}`} className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-cream-dark">
              <AvatarImage src={offer.workerAvatar} />
              <AvatarFallback className="bg-orange/10 text-orange font-bold">
                {getInitials(offer.workerName)}
              </AvatarFallback>
            </Avatar>
            {isMyOffer && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/profile/${offer.workerId}`}
                    className="font-serif font-bold text-navy hover:text-orange transition-colors"
                  >
                    {offer.workerName}
                  </Link>
                  {isMyOffer && (
                    <Badge className="bg-orange/10 text-orange hover:bg-orange/10 text-[10px]">
                      Votre offre
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-orange text-orange" />
                    <span className="text-sm font-medium">{offer.workerRating?.toFixed(1) || "N/A"}</span>
                    <span className="text-muted-foreground text-xs">
                      ({offer.workerReviewsCount || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    {offer.workerCompletionRate || 100}% reussite
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-serif text-xl font-extrabold text-navy">
                  {formatCurrency(offer.amount)}
                </div>
                {offer.estimatedDuration && (
                  <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                    <Timer className="w-3 h-3" />
                    {offer.estimatedDuration}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {offer.message}
            </p>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <span className="text-xs text-muted-foreground">
                {offer.createdAt ? formatDistanceToNow(offer.createdAt.toDate()) : "Recemment"}
              </span>
              
              {offer.status === "accepted" ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/10 text-success hover:bg-success/10">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Acceptee
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-success hover:bg-success/90"
                    onClick={() => router.push(`/dashboard/messages?to=${offer.workerId}`)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Contacter
                  </Button>
                </div>
              ) : offer.status === "rejected" ? (
                <Badge variant="secondary" className="text-muted-foreground">
                  Refusee
                </Badge>
              ) : offer.status === "withdrawn" ? (
                <Badge variant="secondary" className="text-muted-foreground">
                  Retiree
                </Badge>
              ) : isOwner ? (
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/dashboard/messages?to=${offer.workerId}`)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Message
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        Accepter
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accepter cette offre ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          En acceptant cette offre de {formatCurrency(offer.amount)}, vous vous engagez a travailler avec {offer.workerName}. Les autres offres seront automatiquement refusees.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleAccept}
                          disabled={accepting}
                          className="bg-success hover:bg-success/90"
                        >
                          {accepting ? "Acceptation..." : "Confirmer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : isMyOffer && offer.status === "pending" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Retirer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Retirer votre offre ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Etes-vous sur de vouloir retirer votre offre ? Cette action est irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {withdrawing ? "Retrait..." : "Retirer l'offre"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MakeOfferDialog({ taskId, taskTitle, suggestedBudget, onSuccess }: { taskId: string, taskTitle: string, suggestedBudget: number, onSuccess?: () => void }) {
  const { makeOffer } = useMakeOffer()
  const { userData } = useAuth()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(suggestedBudget.toString())
  const [message, setMessage] = useState("")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)

  const amountNum = parseInt(amount) || 0
  const platformFee = Math.round(amountNum * 0.1)
  const youReceive = amountNum - platformFee
  
  const handleSubmit = async () => {
    if (!amount || !message) {
      toast.error("Remplissez tous les champs")
      return
    }
    if (message.length < 20) {
      toast.error("Votre message doit faire au moins 20 caracteres")
      return
    }
    
    setLoading(true)
    try {
      await makeOffer(taskId, taskTitle, parseInt(amount), message, duration || undefined)
      toast.success("Offre envoyee avec succes !")
      setOpen(false)
      setMessage("")
      onSuccess?.()
    } catch (error: unknown) {
      const msg = (error as { message?: string })?.message || "Erreur"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-orange hover:bg-orange-hover">
          <Send className="w-4 h-4 mr-2" />
          Faire une offre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <div className="bg-navy p-6">
          <DialogTitle className="font-serif text-xl font-bold text-white">Faire une offre</DialogTitle>
          <DialogDescription className="text-white/60 mt-1">
            Proposez votre prix et expliquez pourquoi vous etes le bon candidat
          </DialogDescription>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Quick profile summary */}
          <div className="flex items-center gap-3 p-3 bg-cream rounded-xl">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-orange/10 text-orange font-bold">
                {getInitials(userData?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-navy text-sm">{userData?.name || "Vous"}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-orange text-orange" />
                <span>{userData?.rating?.toFixed(1) || "N/A"}</span>
                <span>-</span>
                <span>{userData?.tasksCompleted || 0} missions completees</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-navy">Votre offre (DH)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 200"
                className="text-xl font-bold h-14"
                min={50}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-navy">Duree estimee</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 2-3 heures"
                className="h-14"
              />
            </div>
          </div>

          {amountNum > 0 && (
            <div className="p-3 bg-cream/50 rounded-lg space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Budget suggere</span>
                <span>{formatCurrency(suggestedBudget)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Commission plateforme (10%)</span>
                <span>-{formatCurrency(platformFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-navy">
                <span>Vous recevrez</span>
                <span className="text-success">{formatCurrency(youReceive)}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-navy">Message</Label>
              <span className="text-xs text-muted-foreground">{message.length}/500</span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Presentez-vous, expliquez votre experience et pourquoi vous etes qualifie pour cette mission..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Conseil: Mentionnez votre experience pertinente et soyez specifique sur comment vous allez realiser la mission.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0">
          <Button onClick={handleSubmit} disabled={loading || amountNum < 50 || message.length < 20} className="w-full h-12 bg-navy hover:bg-orange text-base">
            {loading ? "Envoi en cours..." : "Envoyer l'offre"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const { user, userData } = useAuth()
  
  const { task, loading: taskLoading } = useTask(taskId)
  const { offers, loading: offersLoading } = useTaskOffers(taskId)
  
  const isOwner = user?.uid === task?.userId
  const isWorker = userData?.role === "worker"
  const hasAlreadyOffered = offers.some(o => o.workerId === user?.uid)
  const category = task ? CATEGORIES.find(c => c.id === task.category) : null
  
  // Increment views
  useEffect(() => {
    if (taskId && !taskLoading && task) {
      incrementTaskViews(taskId)
    }
  }, [taskId, taskLoading, task])
  
  if (taskLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-navy text-white px-[5%] py-4">
          <Skeleton className="h-8 w-48 bg-white/10" />
        </header>
        <div className="px-[5%] py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="font-serif text-xl font-bold text-navy mb-2">Mission introuvable</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Cette mission n&apos;existe pas ou a ete supprimee.
          </p>
          <Button onClick={() => router.push("/browse")} className="bg-navy hover:bg-orange">
            Voir les missions disponibles
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
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-[5%] py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
                    className="hover:bg-current"
                  >
                    {category?.name || task.category}
                  </Badge>
                  {task.urgent && (
                    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">
                      <Zap className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {task.status !== "open" && (
                    <Badge variant="secondary">
                      {task.status === "assigned" ? "Assignee" : 
                       task.status === "in_progress" ? "En cours" : 
                       task.status === "completed" ? "Terminee" : "Annulee"}
                    </Badge>
                  )}
                </div>
                
                <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-navy mb-4">
                  {task.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {task.location?.city || "Non specifie"}
                    {task.location?.remote && " (Remote OK)"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {task.dates?.flexible ? "Dates flexibles" : task.dates?.startDate || "A discuter"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {task.viewsCount || 0} vues
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    {task.offersCount || 0} offres
                  </span>
                </div>
              </div>
              
              <Separator />
              
              {/* Description */}
              <div>
                <h2 className="font-serif font-bold text-navy mb-3">Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {task.description || "Pas de description fournie."}
                  </p>
                </div>
              </div>
              
              {/* Requirements */}
              {task.requirements && task.requirements.length > 0 && (
                <div>
                  <h2 className="font-serif font-bold text-navy mb-3">Exigences</h2>
                  <ul className="space-y-2">
                    {task.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Location details */}
              {task.location?.address && (
                <div>
                  <h2 className="font-serif font-bold text-navy mb-3">Lieu</h2>
                  <p className="text-sm text-muted-foreground">
                    {task.location.address}, {task.location.city}
                  </p>
                </div>
              )}
              
              <Separator />
              
              {/* Offers section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif font-bold text-navy">
                    Offres ({offers.length})
                  </h2>
                </div>
                
                {offersLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-full mb-4" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : offers.length === 0 ? (
                  <Card className="p-8 text-center bg-cream/30">
                    <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Aucune offre pour le moment. Soyez le premier !
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Sort offers: accepted first, then pending, then others */}
                    {[...offers]
                      .sort((a, b) => {
                        const statusOrder = { accepted: 0, pending: 1, rejected: 2, withdrawn: 3 }
                        return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
                      })
                      .map(offer => (
                        <OfferCard 
                          key={offer.id} 
                          offer={offer} 
                          isOwner={isOwner}
                          isMyOffer={offer.workerId === user?.uid}
                          taskId={taskId}
                          onAccept={() => {}}
                          onWithdraw={() => {}}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Budget card */}
                <Card>
                  <CardContent className="p-5">
                    <div className="text-center mb-4">
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <div className="font-serif text-3xl font-extrabold text-navy">
                        {formatCurrency(task.budget?.amount || 0)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {task.budget?.type === "hourly" ? "par heure" : 
                         task.budget?.type === "daily" ? "par jour" : "fixe"}
                        {task.budget?.negotiable && " (negociable)"}
                      </span>
                    </div>
                    
                    {task.status === "open" && !isOwner && isWorker && !hasAlreadyOffered && (
                      <MakeOfferDialog 
                        taskId={taskId} 
                        taskTitle={task.title}
                        suggestedBudget={task.budget?.amount || 150}
                      />
                    )}
                    
                    {hasAlreadyOffered && (
                      <Button disabled className="w-full">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Offre envoyee
                      </Button>
                    )}
                    
                    {isOwner && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push(`/dashboard/tasks/${taskId}/edit`)}
                      >
                        Modifier la mission
                      </Button>
                    )}
                    
                    {!user && (
                      <Button 
                        className="w-full bg-orange hover:bg-orange-hover"
                        onClick={() => router.push("/?auth=true")}
                      >
                        Connectez-vous pour faire une offre
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Posted by */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Publie par</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link 
                      href={`/profile/${task.userId}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={task.userAvatar} />
                        <AvatarFallback className="bg-navy/10 text-navy font-bold">
                          {getInitials(task.userName || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-navy group-hover:text-orange transition-colors">
                          {task.userName || "Anonyme"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Publie {task.createdAt ? formatDistanceToNow(task.createdAt.toDate()) : "recemment"}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </Link>
                  </CardContent>
                </Card>
                
                {/* Safety tips */}
                <Card className="bg-cream/50 border-cream-dark">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-navy text-sm mb-1">Conseils de securite</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>Ne payez jamais avant que le travail soit termine</li>
                          <li>Verifiez les avis et notes du travailleur</li>
                          <li>Communiquez via la plateforme</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Report */}
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive">
                  <Flag className="w-4 h-4 mr-2" />
                  Signaler cette annonce
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
