import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";
import type { Matching } from "../types";

/**
 * Statistiques globales de matching pour la plateforme
 */
export interface PlatformMatchingStats {
    totalMatchings: number;
    successfulMatches: number; // confirmed
    refusedMatches: number;
    pendingMatches: number;
    averageTimeToConfirm: number; // En jours
    successRate: number; // Pourcentage
}

/**
 * Récupère les statistiques globales de matching
 */
export async function getPlatformMatchingStats(): Promise<PlatformMatchingStats> {
    const matchingRef = collection(db, firebaseCollections.matchings);
    const snapshot = await getDocs(matchingRef);

    const allMatchings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as any));

    const totalMatchings = allMatchings.length;
    const successfulMatches = allMatchings.filter(
        m => m.status === "confirmed"
    ).length;
    const refusedMatches = allMatchings.filter(
        m => m.status === "refused"
    ).length;
    const pendingMatches = allMatchings.filter(
        m => m.status === "open" || m.status === "continued"
    ).length;

    // Calcule le temps moyen pour confirmer
    const confirmedMatches = allMatchings.filter(m => m.status === "confirmed");
    const avgTime = confirmedMatches.reduce((acc, m) => {
        const contactDate = m.contactDate?.toDate?.() || new Date(m.contactDate);
        const closedDate = m.closedAt?.toDate?.() || new Date(m.closedAt);
        const days = (closedDate.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24);
        return acc + days;
    }, 0);

    const averageTimeToConfirm = confirmedMatches.length > 0
        ? Math.round(avgTime / confirmedMatches.length)
        : 0;

    const successRate = totalMatchings > 0
        ? Math.round((successfulMatches / totalMatchings) * 100)
        : 0;

    return {
        totalMatchings,
        successfulMatches,
        refusedMatches,
        pendingMatches,
        averageTimeToConfirm,
        successRate,
    };
}

/**
 * Récupère les statistiques par tuteur
 */
export async function getTutorStatsReport(tutorId: string): Promise<{
    tutorId: string;
    tutorName: string;
    totalMatches: number;
    confirmedMatches: number;
    successRate: number;
    totalStudents: number;
    rating: number;
    earnings?: number;
}> {
    const tutorRef = doc(db, firebaseCollections.tutors, tutorId);
    const tutorDoc = await getDoc(tutorRef);

    if (!tutorDoc.exists()) {
        throw new Error("Tutor not found");
    }

    const tutorData = tutorDoc.data();

    // Récupère les matchings du tuteur
    const matchingRef = collection(db, firebaseCollections.matchings);
    const q = query(matchingRef, where("tutorId", "==", tutorId));
    const snapshot = await getDocs(q);

    const allMatches = snapshot.docs.map(doc => doc.data() as any);
    const confirmedMatches = allMatches.filter(m => m.status === "confirmed").length;
    const totalMatches = allMatches.length;

    const successRate = totalMatches > 0
        ? Math.round((confirmedMatches / totalMatches) * 100)
        : 0;

    return {
        tutorId,
        tutorName: tutorData.displayName || "Unknown",
        totalMatches,
        confirmedMatches,
        successRate,
        totalStudents: tutorData.totalStudents || 0,
        rating: tutorData.rating || 0,
    };
}

/**
 * Récupère les meilleures correspondances (tuteurs avec plus de succès)
 */
export async function getTopTutors(limit: number = 10): Promise<Array<{
    tutorId: string;
    tutorName: string;
    successRate: number;
    confirmedMatches: number;
    rating: number;
}>> {
    const tutorsRef = collection(db, firebaseCollections.tutors);
    const snapshot = await getDocs(tutorsRef);

    const tutors = await Promise.all(
        snapshot.docs.slice(0, limit * 2).map(async (tutorDoc) => {
            const tutorData = tutorDoc.data();

            const matchingRef = collection(db, firebaseCollections.matchings);
            const q = query(matchingRef, where("tutorId", "==", tutorDoc.id));
            const matchingSnapshot = await getDocs(q);

            const allMatches = matchingSnapshot.docs.map(doc => doc.data() as any);
            const confirmedMatches = allMatches.filter(
                m => m.status === "confirmed"
            ).length;
            const totalMatches = allMatches.length;

            const successRate = totalMatches > 0
                ? Math.round((confirmedMatches / totalMatches) * 100)
                : 0;

            return {
                tutorId: tutorDoc.id,
                tutorName: tutorData.displayName || "Unknown",
                successRate,
                confirmedMatches,
                rating: tutorData.rating || 0,
            };
        })
    );

    // Trie par taux de succès et confirme les matchings
    return tutors
        .sort((a, b) => {
            if (b.successRate !== a.successRate) {
                return b.successRate - a.successRate;
            }
            return b.confirmedMatches - a.confirmedMatches;
        })
        .slice(0, limit);
}

/**
 * Génère un rapport de matching par période (semaine, mois, année)
 */
export async function generateMatchingReport(period: "week" | "month" | "year"): Promise<{
    period: string;
    startDate: Date;
    endDate: Date;
    newMatchings: number;
    confirmedMatches: number;
    successRate: number;
    totalEarnings?: number;
}> {
    const now = new Date();
    const startDate = new Date();

    if (period === "week") {
        startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
        startDate.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
        startDate.setFullYear(now.getFullYear() - 1);
    }

    const matchingRef = collection(db, firebaseCollections.matchings);
    const snapshot = await getDocs(matchingRef);

    const matchingsInPeriod = snapshot.docs
        .map(doc => ({
            id: doc.id,
            ...doc.data()
        } as any))
        .filter(m => {
            const contactDate = m.contactDate?.toDate?.() || new Date(m.contactDate);
            return contactDate >= startDate && contactDate <= now;
        });

    const newMatchings = matchingsInPeriod.length;
    const confirmedMatches = matchingsInPeriod.filter(
        m => m.status === "confirmed"
    ).length;
    const successRate = newMatchings > 0
        ? Math.round((confirmedMatches / newMatchings) * 100)
        : 0;

    return {
        period: `${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`,
        startDate,
        endDate: now,
        newMatchings,
        confirmedMatches,
        successRate,
    };
}
