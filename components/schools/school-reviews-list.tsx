"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Star, User, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { onSchoolReviewsChanged } from "@/lib/services/school-service"

interface SchoolReviewsListProps {
    schoolId: string
}

interface Review {
    id: string
    schoolId: string
    studentId: string
    studentName: string
    studentPhoto?: string
    rating: number
    comment: string
    createdAt: Date
}

export function SchoolReviewsList({ schoolId }: SchoolReviewsListProps) {
    const t = useTranslations()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = onSchoolReviewsChanged(schoolId, (newReviews) => {
            setReviews(newReviews)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [schoolId])

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p>{t("No reviews yet. Be the first to review!")}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.studentPhoto || undefined} alt={review.studentName} />
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{review.studentName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                        star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-foreground">{review.comment}</p>
                </div>
            ))}
        </div>
    )
}
