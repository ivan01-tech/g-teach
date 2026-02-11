import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { firebaseCollections } from "../collections";

/**
 * Interface pour les transactions de monétisation
 */
export interface MonetizationTransaction {
    id?: string;
    tutorId: string;
    learnerId: string;
    matchingId: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "refunded";
    type: "lesson" | "platform_fee" | "bonus";
    description?: string;
    createdAt?: any; // Timestamp
    completedAt?: any; // Timestamp
}

/**
 * Interface pour les statistiques de réputation
 */
export interface ReputationStats {
    tutorId: string;
    totalEarnings: number;
    totalLessonsCompleted: number;
    averageRating: number; // 0-5
    responseTime: number; // En minutes
    verificationLevel: "bronze" | "silver" | "gold" | "platinum"; // Basé sur les stats
    totalStudents: number;
    cancelationRate: number; // Pourcentage
    commitmentScore: number; // 0-100, basé sur l'historique
    lastUpdated?: any; // Timestamp
}

/**
 * Enregistre une transaction de monétisation
 */
export async function recordTransaction(
    transaction: MonetizationTransaction
): Promise<string> {
    const transactionRef = collection(db, "monetizationTransactions");
    
    const docRef = await addDoc(transactionRef, {
        ...transaction,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

/**
 * Met à jour le statut d'une transaction
 */
export async function updateTransactionStatus(
    transactionId: string,
    status: "pending" | "completed" | "failed" | "refunded"
): Promise<void> {
    const transactionRef = doc(db, "monetizationTransactions", transactionId);
    
    await updateDoc(transactionRef, {
        status,
        completedAt: status === "completed" ? serverTimestamp() : null,
    });
}

/**
 * Calcule et met à jour la statistique de réputation d'un tuteur
 */
export async function updateReputationStats(tutorId: string): Promise<void> {
    // Récupère les transactions complétées du tuteur
    const transactionsRef = collection(db, "monetizationTransactions");
    const q = query(
        transactionsRef,
        where("tutorId", "==", tutorId),
        where("status", "==", "completed")
    );

    const snapshot = await getDocs(q);
    const completedTransactions = snapshot.docs.map(doc => doc.data());

    // Calcule les statistiques
    const totalEarnings = completedTransactions
        .filter(t => t.type === "lesson")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalLessonsCompleted = completedTransactions.filter(
        t => t.type === "lesson"
    ).length;

    // Récupère le tuteur et ses stats
    const tutorRef = doc(db, firebaseCollections.tutors, tutorId);
    const tutorDoc = await getDoc(tutorRef);

    if (!tutorDoc.exists()) {
        throw new Error("Tutor not found");
    }

    const tutorData = tutorDoc.data();
    const averageRating = tutorData.rating || 0;
    const totalStudents = tutorData.totalStudents || 0;

    // Détermine le niveau de vérification basé sur les statistiques
    const verificationLevel = determineVerificationLevel({
        totalEarnings,
        totalLessonsCompleted,
        averageRating,
        totalStudents,
    });

    // Met à jour les statistiques
    await updateDoc(tutorRef, {
        reputationStats: {
            totalEarnings,
            totalLessonsCompleted,
            averageRating,
            verificationLevel,
            totalStudents,
            lastUpdated: serverTimestamp(),
        },
    });
}

/**
 * Détermine le niveau de vérification basé sur les statistiques
 */
function determineVerificationLevel(stats: {
    totalEarnings: number;
    totalLessonsCompleted: number;
    averageRating: number;
    totalStudents: number;
}): "bronze" | "silver" | "gold" | "platinum" {
    const score = calculateTrustScore(stats);

    if (score >= 90) return "platinum";
    if (score >= 75) return "gold";
    if (score >= 60) return "silver";
    return "bronze";
}

/**
 * Calcule un score de confiance (0-100)
 */
export function calculateTrustScore(stats: {
    totalEarnings: number;
    totalLessonsCompleted: number;
    averageRating: number;
    totalStudents: number;
}): number {
    let score = 0;

    // Basé sur le nombre de leçons (max 30 points)
    score += Math.min(30, (stats.totalLessonsCompleted / 50) * 30);

    // Basé sur la note (max 40 points)
    score += (stats.averageRating / 5) * 40;

    // Basé sur le nombre d'étudiants (max 20 points)
    score += Math.min(20, (stats.totalStudents / 20) * 20);

    // Basé sur les revenus (max 10 points)
    score += Math.min(10, (stats.totalEarnings / 5000) * 10);

    return Math.round(score);
}

/**
 * Récupère les transactions d'un tuteur pour un récap financier
 */
export async function getTutorTransactions(
    tutorId: string,
    status?: "pending" | "completed" | "failed"
): Promise<MonetizationTransaction[]> {
    const transactionRef = collection(db, "monetizationTransactions");
    
    let q;
    if (status) {
        q = query(
            transactionRef,
            where("tutorId", "==", tutorId),
            where("status", "==", status)
        );
    } else {
        q = query(transactionRef, where("tutorId", "==", tutorId));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as MonetizationTransaction));
}

/**
 * Génère un récap financier pour un tuteur
 */
export async function generateTutorFinancialSummary(tutorId: string): Promise<{
    totalEarnings: number;
    pendingPayments: number;
    completedTransactions: number;
    lastPayoutDate?: Date;
    nextPayoutDate?: Date;
}> {
    const allTransactions = await getTutorTransactions(tutorId);

    const completedTransactions = allTransactions.filter(
        t => t.status === "completed"
    );
    const pendingTransactions = allTransactions.filter(
        t => t.status === "pending"
    );

    const totalEarnings = completedTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
    );
    const pendingPayments = pendingTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
    );

    return {
        totalEarnings,
        pendingPayments,
        completedTransactions: completedTransactions.length,
        // Ces dates seraient à gérer selon votre politique de payout
        lastPayoutDate: undefined,
        nextPayoutDate: undefined,
    };
}
