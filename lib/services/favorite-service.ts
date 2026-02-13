import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
} from "firebase/firestore";
import { toSerializable } from "../serializable-utils";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";
import type { Tutor, Review } from "@/lib/types";

export async function toggleFavorite(userId: string, tutorId: string): Promise<boolean> {
    const userRef = doc(db, firebaseCollections.users, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User not found");
    }
    // TODO vient ici 
    const userData = userSnap.data();
    const favorites = userData.favorites || [];
    const isFavorite = favorites.includes(tutorId);

    if (isFavorite) {
        await updateDoc(userRef, {
            favorites: arrayRemove(tutorId),
        });
        return false;
    } else {
        await updateDoc(userRef, {
            favorites: arrayUnion(tutorId),
        });
        return true;
    }
}

export async function getFavorites(userId: string): Promise<Tutor[]> {
    const userRef = doc(db, firebaseCollections.users, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const favorites = userSnap.data().favorites || [];
    if (favorites.length === 0) return [];

    // Fetch tutor details for each favorite
    const tutorsRef = collection(db, firebaseCollections.tutors);
    // Firestore "in" query limits to 10-30 items depending on version, but for a start it's fine.
    // If it's more, we'd need to batch or fetch individually.
    const q = query(tutorsRef, where("uid", "in", favorites));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => toSerializable(doc.data()) as Tutor);
}

export async function getCommentedProfiles(userId: string): Promise<{ tutor: Tutor, review: Review }[]> {
    const reviewsRef = collection(db, firebaseCollections.reviews);
    const q = query(reviewsRef, where("studentId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

    const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...toSerializable(doc.data())
    } as Review));

    const tutorIds = [...new Set(reviews.map(r => r.tutorId))];
    if (tutorIds.length === 0) return [];

    const tutorsRef = collection(db, firebaseCollections.tutors);
    // Fetch tutors in batches if necessary, but 10 is usually the limit for 'in' query
    const results: { tutor: Tutor, review: Review }[] = [];

    // Simple implementation for now (up to 10 tutors)
    const qTutors = query(tutorsRef, where("uid", "in", tutorIds.slice(0, 10)));
    const querySnapshotTutors = await getDocs(qTutors);
    const tutorsMap = new Map(querySnapshotTutors.docs.map(doc => [doc.id, toSerializable(doc.data()) as Tutor]));

    reviews.forEach(review => {
        const tutor = tutorsMap.get(review.tutorId);
        if (tutor) {
            results.push({ tutor, review });
        }
    });

    return results;
}
