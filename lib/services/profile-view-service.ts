import {
    doc,
    collection,
    addDoc,
    updateDoc,
    increment,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    limit,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { firebaseCollections } from "../collections"
import type { ProfileView } from "../types"
import { toSerializable } from "../serializable-utils"

/**
 * Records a new profile view for a tutor.
 * Increments the tutor's profileViews counter and logs the individual view.
 */
export async function recordProfileView(
    tutorId: string,
    viewerId?: string,
    metadata?: { device?: string; browser?: string }
): Promise<void> {
    try {
        const tutorRef = doc(db, firebaseCollections.tutors, tutorId)
        const viewRef = collection(db, firebaseCollections.profileViews)

        // 1. Increment the counter on the tutor document
        await updateDoc(tutorRef, {
            profileViews: increment(1)
        })

        // 2. Log the detailed view event
        await addDoc(viewRef, {
            tutorId,
            viewerId: viewerId || null,
            viewedAt: serverTimestamp(),
            device: metadata?.device || "unknown",
            browser: metadata?.browser || "unknown",
        })
    } catch (error) {
        console.error("Error recording profile view:", error)
        // We don't throw here to avoid breaking the UI for a non-critical analytics task
    }
}

/**
 * Fetches recent profile views for a specific tutor.
 */
export async function getTutorProfileViews(tutorId: string, maxResults: number = 100): Promise<ProfileView[]> {
    const viewRef = collection(db, firebaseCollections.profileViews)
    const q = query(
        viewRef,
        where("tutorId", "==", tutorId),
        orderBy("viewedAt", "desc"),
        limit(maxResults)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return toSerializable({
            id: doc.id,
            ...data,
        }) as ProfileView
    })
}
