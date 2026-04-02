"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUserReviews, useAddReview } from "@/lib/firebase-hooks"
import type { Review } from "@/lib/types"
import { formatDistanceToNow, getInitials, cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  }
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              (hoverRating || rating) >= star
                ? "fill-orange text-orange"
                : "fill-muted text-muted"
            )}
          />
        </button>
      ))}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.fromAvatar} />
          <AvatarFallback className="bg-orange/10 text-orange text-sm font-bold">
            {getInitials(review.fromName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-navy">{review.fromName}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-xs text-muted-foreground">
                  {review.createdAt ? formatDistanceToNow(review.createdAt.toDate()) : "Recemment"}
                </span>
              </div>
            </div>
          </div>
          
          {review.taskTitle && (
            <div className="text-xs text-muted-foreground mt-1">
              Pour: {review.taskTitle}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {review.comment}
          </p>
          
          {review.aspects && Object.keys(review.aspects).length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {review.aspects.communication && (
                <span className="text-xs bg-cream px-2 py-1 rounded">
                  Communication: {review.aspects.communication}/5
                </span>
              )}
              {review.aspects.quality && (
                <span className="text-xs bg-cream px-2 py-1 rounded">
                  Qualite: {review.aspects.quality}/5
                </span>
              )}
              {review.aspects.punctuality && (
                <span className="text-xs bg-cream px-2 py-1 rounded">
                  Ponctualite: {review.aspects.punctuality}/5
                </span>
              )}
              {review.aspects.professionalism && (
                <span className="text-xs bg-cream px-2 py-1 rounded">
                  Professionnalisme: {review.aspects.professionalism}/5
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ReviewsListProps {
  userId: string
  userName: string
  rating: number
  reviewsCount: number
}

export function ReviewsList({ userId, userName, rating, reviewsCount }: ReviewsListProps) {
  const { reviews, loading } = useUserReviews(userId)
  const [showAll, setShowAll] = useState(false)
  
  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100 
      : 0
  }))
  
  const displayedReviews = showAll ? reviews : reviews.slice(0, 5)
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Avis ({reviewsCount})</span>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} readonly size="sm" />
            <span className="text-lg font-bold">{rating.toFixed(1)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rating distribution */}
        <div className="mb-6 pb-6 border-b">
          <div className="space-y-2">
            {distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-12">{star} etoile{star > 1 ? "s" : ""}</span>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {userName} n&apos;a pas encore d&apos;avis
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {displayedReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            
            {reviews.length > 5 && !showAll && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => setShowAll(true)}
              >
                Voir tous les avis ({reviews.length})
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface AddReviewDialogProps {
  taskId: string
  taskTitle: string
  toId: string
  toName: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AddReviewDialog({ 
  taskId, 
  taskTitle, 
  toId, 
  toName, 
  trigger,
  onSuccess 
}: AddReviewDialogProps) {
  const { addReview } = useAddReview()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [communication, setCommunication] = useState(0)
  const [quality, setQuality] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [professionalism, setProfessionalism] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Veuillez donner une note")
      return
    }
    if (!comment.trim()) {
      toast.error("Veuillez ecrire un commentaire")
      return
    }
    
    setLoading(true)
    try {
      await addReview({
        taskId,
        taskTitle,
        toId,
        toName,
        rating,
        comment: comment.trim(),
        aspects: {
          ...(communication > 0 && { communication }),
          ...(quality > 0 && { quality }),
          ...(punctuality > 0 && { punctuality }),
          ...(professionalism > 0 && { professionalism }),
        }
      })
      toast.success("Avis publie avec succes !")
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error("Erreur lors de la publication")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Star className="w-4 h-4 mr-2" />
            Laisser un avis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Evaluer {toName}</DialogTitle>
          <DialogDescription>
            Partagez votre experience pour aider les autres utilisateurs
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Main rating */}
          <div className="text-center">
            <Label className="text-sm font-medium mb-3 block">Note globale</Label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 0 && "Cliquez pour noter"}
              {rating === 1 && "Tres insatisfait"}
              {rating === 2 && "Insatisfait"}
              {rating === 3 && "Correct"}
              {rating === 4 && "Satisfait"}
              {rating === 5 && "Excellent !"}
            </p>
          </div>
          
          {/* Detailed ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Communication</Label>
              <StarRating rating={communication} onChange={setCommunication} size="sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Qualite du travail</Label>
              <StarRating rating={quality} onChange={setQuality} size="sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Ponctualite</Label>
              <StarRating rating={punctuality} onChange={setPunctuality} size="sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Professionnalisme</Label>
              <StarRating rating={professionalism} onChange={setProfessionalism} size="sm" />
            </div>
          </div>
          
          {/* Comment */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Votre commentaire</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Decrivez votre experience..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/500</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={loading || rating === 0 || !comment.trim()}
          className="w-full bg-navy hover:bg-orange"
        >
          {loading ? "Publication..." : "Publier l'avis"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
