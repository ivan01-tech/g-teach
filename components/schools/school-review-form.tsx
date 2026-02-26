"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { Star, Loader2 } from "lucide-react"
import { addSchoolReview } from "@/lib/services/school-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface SchoolReviewFormProps {
    schoolId: string
    onReviewAdded?: () => void
}

export function SchoolReviewForm({ schoolId, onReviewAdded }: SchoolReviewFormProps) {
    const t = useTranslations()
    const { user } = useAuth()
    const { toast } = useToast()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast({
                title: t("Error"),
                description: t("You must be logged in to leave a review"),
                variant: "destructive",
            })
            return
        }

        if (rating === 0) {
            toast({
                title: t("Error"),
                description: t("Please select a rating"),
                variant: "destructive",
            })
            return
        }

        if (!comment.trim()) {
            toast({
                title: t("Error"),
                description: t("Please write a comment"),
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)
            await addSchoolReview(
                schoolId,
                user.uid,
                user.displayName || "Anonymous",
                rating,
                comment,
                user.photoURL || undefined
            )

            setRating(0)
            setComment("")

            toast({
                title: t("Success"),
                description: t("Your review has been posted"),
            })

            onReviewAdded?.()
        } catch (error) {
            console.error("Error adding review:", error)
            toast({
                title: t("Error"),
                description: t("Failed to add review"),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <div>
                <label className="block text-sm font-medium mb-3">{t("Your Rating")}</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-6 w-6 ${
                                    star <= (hoveredRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">{t("Your Comment")}</label>
                <Textarea
                    placeholder={t("shareYourExperience")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    disabled={loading}
                />
            </div>

            <Button type="submit" disabled={loading || !user} className="w-full">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("Post Review")}
            </Button>

            {!user && (
                <p className="text-sm text-muted-foreground text-center">
                    {t("Sign in to leave a review")}
                </p>
            )}
        </form>
    )
}
