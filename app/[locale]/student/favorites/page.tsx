"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import { TutorCard } from "@/components/tutors/tutor-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Edit2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { updateReviewAction, fetchCommentedProfiles } from "@/lib/store/favorites-slice"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function FavoritesPage() {
  const {
    favoriteTutors,
    commentedTutors,
    loading,
    refreshFavoritesDashboard
  } = useFavorites()
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  const [editingReview, setEditingReview] = useState<{
    id: string;
    tutorId: string;
    rating: number;
    comment: string;
    tutorName: string;
  } | null>(null)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    refreshFavoritesDashboard()
  }, [refreshFavoritesDashboard])

  const handleEditClick = (item: any) => {
    setEditingReview({
      id: item.review.id,
      tutorId: item.tutor.uid,
      rating: item.review.rating,
      comment: item.review.comment,
      tutorName: item.tutor.displayName
    })
    setNewRating(item.review.rating)
    setNewComment(item.review.comment)
  }

  const handleUpdateReview = async () => {
    if (!editingReview || !user) return

    setIsUpdating(true)
    try {
      await dispatch(updateReviewAction({
        reviewId: editingReview.id,
        tutorId: editingReview.tutorId,
        oldRating: editingReview.rating,
        newRating,
        comment: newComment
      })).unwrap()

      toast.success("Avis mis à jour avec succès")
      setEditingReview(null)
      // Optionally refetch but slice update should handle it
    } catch (error: any) {
      toast.error(error || "Erreur lors de la mise à jour")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes Favoris & Interactions</h1>
        <p className="text-muted-foreground">Gérez vos tuteurs préférés et retrouvez ceux que vous avez commentés.</p>
      </div>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favoris
          </TabsTrigger>
          <TabsTrigger value="commented" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Profils commentés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : favoriteTutors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Sans favoris pour le moment</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Enregistrez vos tuteurs préférés pour les retrouver rapidement plus tard.
                  Cliquez sur l'icône de cœur sur n'importe quel profil de tuteur.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/tutors">Parcourir les tuteurs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteTutors.map((tutor) => (
                <TutorCard key={tutor.uid} tutor={tutor} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="commented" className="mt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : commentedTutors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Pas de commentaires</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Les tuteurs sur lesquels vous avez laissé un avis apparaîtront ici.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/tutors">Parcourir les tuteurs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {commentedTutors.map((item) => (
                <Card key={item.review.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col h-full">
                      {/* Tutor Header Info */}
                      <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={item.tutor.photoURL} alt={item.tutor.displayName} />
                          <AvatarFallback>{item.tutor.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/tutors/${item.tutor.uid}`}
                            className="font-semibold hover:text-primary truncate block"
                          >
                            {item.tutor.displayName}
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {item.tutor.specializations?.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= item.review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-xs font-medium ml-1">
                            {item.review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-foreground italic flex-1 line-clamp-4">
                          "{item.review.comment}"
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 h-8 px-2"
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                            Modifier mon avis
                          </Button>
                          <Link
                            href={`/tutors/${item.tutor.uid}`}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            Voir profil
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Review Dialog */}
      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier votre avis pour {editingReview?.tutorName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= newRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Commentaire</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Votre expérience avec ce tuteur..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setEditingReview(null)} disabled={isUpdating}>
              Annuler
            </Button>
            <Button onClick={handleUpdateReview} disabled={isUpdating || !newComment.trim()}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
