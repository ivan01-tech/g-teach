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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";
import type { Tutor, Review } from "@/lib/types";

export async function toggleFavorite(userId: string, tutorId: string): Promise<boolean> {
    const userRef = doc(db, firebaseCollections.users, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error("User not found");
    }

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

    return querySnapshot.docs.map((doc) => doc.data() as Tutor);
}

export async function getCommentedProfiles(userId: string): Promise<Tutor[]> {
    const reviewsRef = collection(db, firebaseCollections.reviews);
    const q = query(reviewsRef, where("studentId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const tutorIds = [...new Set(querySnapshot.docs.map((doc) => (doc.data() as Review).tutorId))];
    if (tutorIds.length === 0) return [];

    const tutorsRef = collection(db, firebaseCollections.tutors);
    const qTutors = query(tutorsRef, where("uid", "in", tutorIds));
    const querySnapshotTutors = await getDocs(qTutors);

    return querySnapshotTutors.docs.map((doc) => doc.data() as Tutor);
}
