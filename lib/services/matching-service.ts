import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    addDoc,
    Timestamp,
    increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";
import type { Matching, MatchingStatus } from "../types";

const MATCHING_TIMEOUT_DAYS = 7;
const REMINDER_INTERVAL_DAYS = 3;
const MAX_REMINDERS = 2;

/**
 * Initie une mise en relation entre un apprenant et un tuteur
 * Crée un nouvel enregistrement de matching et une conversation
 */
export async function initiateMatching(
    learnerId: string,
    tutorId: string,
    learnerName: string,
    tutorName: string
): Promise<string> {
    const matchingRef = collection(db, firebaseCollections.matchings);
    const newMatching = {
        learnerId,
        tutorId,
        learnerName,
        tutorName,
        contactDate: serverTimestamp(),
        status: "open" as MatchingStatus,
        learnerConfirmed: false,
        tutorConfirmed: false,
        reminderCount: 0,
        isMonetized: false,
    };

    // Check if a matching already exists between them in the last 30 days
    const existingQuery = query(
        matchingRef,
        where("learnerId", "==", learnerId),
        where("tutorId", "==", tutorId)
    );

    const existingSnapshot = await getDocs(existingQuery);
    
    // Si une mise en relation existe déjà en "open" ou "continued", ne pas créer de doublon
    const activeMatching = existingSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.status === "open" || data.status === "continued";
    });

    if (activeMatching) {
        return activeMatching.id;
    }

    const docRef = await addDoc(matchingRef, newMatching);
    return docRef.id;
}

/**
 * Récupère les matchings en attente de confirmation (après X jours)
 */
export async function getPendingMatchingsForUser(
    userId: string,
    role: 'student' | 'tutor'
): Promise<Matching[]> {
    const matchingRef = collection(db, firebaseCollections.matchings);
    const field = role === 'student' ? 'learnerId' : 'tutorId';

    // Récupère les matchings "open" ou "continued" datant de plus de 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - MATCHING_TIMEOUT_DAYS);

    const q = query(
        matchingRef,
        where(field, "==", userId),
        where("status", "in", ["open", "continued"]),
    );

    const querySnapshot = await getDocs(q);
    
    // Filtre les matchings qui sont expirés (plus de 7 jours)
    const matchings = querySnapshot.docs
        .map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Matching))
        .filter(m => {
            const contactDate = m.contactDate?.toDate?.() || new Date(m.contactDate);
            return contactDate <= sevenDaysAgo;
        });

    return matchings;
}

/**
 * Met à jour le statut d'une mise en relation avec confirmation utilisateur
 */
export async function updateMatchingStatus(
    matchingId: string,
    status: MatchingStatus,
    feedback?: string,
    role?: 'student' | 'tutor'
): Promise<void> {
    const matchingRef = doc(db, firebaseCollections.matchings, matchingId);
    const matchingDoc = await getDoc(matchingRef);

    if (!matchingDoc.exists()) {
        throw new Error("Matching not found");
    }

    const currentData = matchingDoc.data() as Matching;
    const updateData: any = {
        status,
        closedAt: serverTimestamp(),
    };

    // Enregistre la confirmation mutuelle
    if (role === 'student') {
        updateData.learnerConfirmed = status === "confirmed";
        updateData.learnerConfirmedAt = status === "confirmed" ? serverTimestamp() : null;
        if (feedback) updateData.learnerFeedback = feedback;
    } else if (role === 'tutor') {
        updateData.tutorConfirmed = status === "confirmed";
        updateData.tutorConfirmedAt = status === "confirmed" ? serverTimestamp() : null;
        if (feedback) updateData.tutorFeedback = feedback;
    }

    await updateDoc(matchingRef, updateData);

    // Si c'est confirmé des deux côtés, met à jour les statistiques
    if (
        (role === 'student' && currentData.tutorConfirmed && status === "confirmed") ||
        (role === 'tutor' && currentData.learnerConfirmed && status === "confirmed")
    ) {
        await recordCollaborationStats(currentData.learnerId, currentData.tutorId);
    }

    // Si "continued", réouvre le matching
    if (status === "continued") {
        await updateDoc(matchingRef, {
            status: "open",
            contactDate: serverTimestamp(),
            reminderCount: 0,
            reminderSentAt: null,
        });
    }
}

/**
 * Enregistre les statistiques quand une collaboration est confirmée
 */
export async function recordCollaborationStats(
    learnerId: string,
    tutorId: string
): Promise<void> {
    const tutorRef = doc(db, firebaseCollections.tutors, tutorId);

    // Incrémente les statistiques du tuteur
    await updateDoc(tutorRef, {
        totalStudents: increment(1),
        totalLessons: increment(1), // Peut être mis à jour plus tard
    });

    // Optionnel: Ajouter un document de transaction/monétisation
    const transactionRef = collection(db, "collaborationStats");
    await addDoc(transactionRef, {
        learnerId,
        tutorId,
        startedAt: serverTimestamp(),
        status: "active",
    });
}

/**
 * Envoie un rappel automatique pour les matchings expirés
 * Appeler cette fonction via un Cloud Function ou un Job
 */
export async function sendReminderForExpiredMatchings(): Promise<void> {
    const matchingRef = collection(db, firebaseCollections.matchings);

    // Trouve les matchings "open" ou "continued" datant de + de X jours
    // sans rappel ou avec rappel depuis + de 3 jours
    const xDaysAgo = new Date();
    xDaysAgo.setDate(xDaysAgo.getDate() - MATCHING_TIMEOUT_DAYS);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - REMINDER_INTERVAL_DAYS);

    const q = query(
        matchingRef,
        where("status", "in", ["open", "continued"]),
    );

    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
        const matching = docSnap.data() as Matching;
        const contactDate = matching.contactDate?.toDate?.() || new Date(matching.contactDate);
        const reminderSentAt = matching.reminderSentAt?.toDate?.() || null;

        // Vérifie si c'est plus de 7 jours et pas trop de rappels
        const isExpired = contactDate <= xDaysAgo;
        const shouldSendReminder =
            !reminderSentAt ||
            (reminderSentAt <= threeDaysAgo && matching.reminderCount! < MAX_REMINDERS);

        if (isExpired && shouldSendReminder) {
            // Met à jour le document avec les infos du rappel
            await updateDoc(doc(db, firebaseCollections.matchings, docSnap.id), {
                reminderSentAt: serverTimestamp(),
                reminderCount: increment(1),
            });

            // TODO: Appeler un service d'email ou de notification
            console.log(`Reminder sent for matching ${docSnap.id}`);
        }
    }
}

/**
 * Obtient les statistiques de matching pour un tuteur
 */
export async function getTutorMatchingStats(tutorId: string): Promise<{
    totalMatched: number;
    confirmed: number;
    refused: number;
    pending: number;
}> {
    const matchingRef = collection(db, firebaseCollections.matchings);
    const q = query(matchingRef, where("tutorId", "==", tutorId));

    const querySnapshot = await getDocs(q);
    const allMatchings = querySnapshot.docs.map(doc => doc.data() as Matching);

    return {
        totalMatched: allMatchings.length,
        confirmed: allMatchings.filter(m => m.status === "confirmed").length,
        refused: allMatchings.filter(m => m.status === "refused").length,
        pending: allMatchings.filter(m => m.status === "open" || m.status === "continued").length,
    };
}
