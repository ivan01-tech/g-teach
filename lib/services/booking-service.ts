import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";
import type { Booking } from "@/lib/types";

export function subscribeToBookings(
    userId: string,
    role: 'student' | 'tutor',
    callback: (bookings: Booking[]) => void
) {
    const bookingsRef = collection(db, firebaseCollections.bookings);
    const field = role === 'student' ? 'studentId' : 'tutorId';

    const q = query(
        bookingsRef,
        where(field, "==", userId),
        orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const bookings = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            } as Booking;
        });
        callback(bookings);
    });
}

export async function updateBookingStatus(
    bookingId: string,
    status: Booking["status"]
): Promise<void> {
    const bookingRef = doc(db, firebaseCollections.bookings, bookingId);
    await updateDoc(bookingRef, {
        status,
        updatedAt: serverTimestamp(),
    });
}
