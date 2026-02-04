"use client";

import { useState, useEffect, useCallback } from "react";
import { getTutorReviews, addReview as submitReviewAction } from "@/lib/review-service";
import type { Review } from "@/lib/types";

export function useReviews(tutorId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!tutorId) return;
        try {
            setLoading(true);
            const data = await getTutorReviews(tutorId);
            setReviews(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews.");
        } finally {
            setLoading(false);
        }
    }, [tutorId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const addReview = async (reviewData: Omit<Review, "id" | "createdAt" | "studentPhoto">) => {
        try {
            setSubmitting(true);
            await submitReviewAction(reviewData);
            await fetchReviews(); // Refresh list
            return { success: true };
        } catch (err) {
            console.error("Error adding review:", err);
            return { success: false, error: "Failed to submit review. Please try again." };
        } finally {
            setSubmitting(false);
        }
    };

    return {
        reviews,
        loading,
        error,
        submitting,
        addReview,
        refreshReviews: fetchReviews
    };
}
