"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ReviewFormProps {
    tutorId: string;
    onSuccess: (reviewData: { rating: number; comment: string; tutorId: string; studentId: string; studentName: string }) => Promise<{ success: boolean; error?: string }>;
}

export function ReviewForm({ tutorId, onSuccess }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Please log in to leave a review.");
            return;
        }
        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }
        if (comment.length < 10) {
            setError("Review must be at least 10 characters long.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const result = await onSuccess({
            tutorId,
            studentId: user.uid,
            studentName: user.displayName || "Anonymous Student",
            rating,
            comment,
        });

        if (result.success) {
            setRating(0);
            setComment("");
            setError(null);
        } else {
            setError(result.error || "Something went wrong.");
        }
        setSubmitting(false);
    };

    if (!user) {
        return (
            <div className="bg-muted/50 p-6 rounded-lg text-center">
                <p className="text-muted-foreground">Log in as a student to leave a review.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border-b border-border pb-8 mb-8">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Leave a Review</h3>
                <p className="text-sm text-muted-foreground">Share your experience with this tutor to help other students.</p>
            </div>

            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            className={`h-8 w-8 ${star <= (hover || rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="How was your lesson? What did you focus on?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
                disabled={submitting}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Review"}
            </Button>
        </form>
    );
}
