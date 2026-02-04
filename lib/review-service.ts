import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    doc,
    runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "./collections";
import type { Review } from "@/lib/types";

export async function addReview(reviewData: Omit<Review, "id" | "createdAt" | "studentPhoto">) {
    const reviewsRef = collection(db, firebaseCollections.reviews);
    const tutorRef = doc(db, firebaseCollections.tutors, reviewData.tutorId);

    try {
        const result = await runTransaction(db, async (transaction) => {
            // 1. Get current tutor data
            const tutorSnap = await transaction.get(tutorRef);
            if (!tutorSnap.exists()) {
                throw new Error("Tutor not found");
            }

            const tutorData = tutorSnap.data();
            const currentRating = tutorData.rating || 0;
            const currentReviewCount = tutorData.reviewCount || 0;

            // 2. Calculate new rating
            const newReviewCount = currentReviewCount + 1;
            const newRating = Number(((currentRating * currentReviewCount + reviewData.rating) / newReviewCount).toFixed(1));

            // 3. Add the review
            const newReviewRef = doc(collection(db, firebaseCollections.reviews));
            transaction.set(newReviewRef, {
                ...reviewData,
                createdAt: serverTimestamp(),
            });

            // 4. Update tutor stats
            transaction.update(tutorRef, {
                rating: newRating,
                reviewCount: newReviewCount,
            });

            return { id: newReviewRef.id, newRating, newReviewCount };
        });

        return result;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}

export async function getTutorReviews(tutorId: string): Promise<Review[]> {
    const reviewsRef = collection(db, firebaseCollections.reviews);
    const q = query(
        reviewsRef,
        where("tutorId", "==", tutorId),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
        } as Review;
    });
}
