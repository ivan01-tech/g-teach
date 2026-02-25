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
    deleteDoc,
    onSnapshot,
    limit,
    orderBy,
    startAfter,
    DocumentSnapshot,
    QueryConstraint,
    Unsubscribe,
    QuerySnapshot,
} from "firebase/firestore"
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { School, VerificationStatus } from "@/lib/types"
import { firebaseCollections } from "../collections"
import { toSerializable } from "../serializable-utils"

/**
 * Create a new school record for a tutor
 */
export async function createSchool(
    tutorId: string,
    data: Omit<School, "id" | "createdAt" | "updatedAt">
): Promise<School> {
    const schoolRef = doc(collection(db, firebaseCollections.schools))
    const schoolId = schoolRef.id

    const schoolData: School = {
        id: schoolId,
        tutorId,
        name: data.name,
        logo: data.logo,
        location: data.location,
        exams: data.exams || [],
        levels: data.levels || [],
        verificationStatus: "pending",
        rating: 0,
        reviewCount: 0,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website,
        socialMedia: data.socialMedia,
        profileViews: 0,
        totalStudents: 0,
        totalLessons: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    await setDoc(schoolRef, schoolData)
    return schoolData
}

/**
 * Get a school by ID
 */
export async function getSchool(schoolId: string): Promise<School | null> {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)
    const snapshot = await getDoc(schoolRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()
    return {
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
    } as School
}

/**
 * Get all schools for a specific tutor
 */
export async function getTutorSchools(tutorId: string): Promise<School[]> {
    const schoolsRef = collection(db, firebaseCollections.schools)
    const q = query(schoolsRef, where("tutorId", "==", tutorId))

    const snapshot = await getDocs(q)
    const schools: School[] = []

    snapshot.forEach((doc) => {
        const data = doc.data()
        schools.push({
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
        } as School)
    })

    return schools.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Update a school
 */
export async function updateSchool(
    schoolId: string,
    data: Partial<Omit<School, "id" | "tutorId" | "createdAt" | "updatedAt">>
): Promise<void> {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)

    await updateDoc(schoolRef, {
        ...data,
        updatedAt: serverTimestamp(),
    })
}

/**
 * Delete a school
 */
export async function deleteSchool(schoolId: string): Promise<void> {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)
    await deleteDoc(schoolRef)
}

/**
 * Upload school logo
 */
export async function uploadSchoolLogo(
    schoolId: string,
    file: File
): Promise<string> {
    const fileRef = ref(storage, `schools/${schoolId}/logo`)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
}

/**
 * Delete school logo
 */
export async function deleteSchoolLogo(schoolId: string): Promise<void> {
    const fileRef = ref(storage, `schools/${schoolId}/logo`)
    try {
        await deleteObject(fileRef)
    } catch (error) {
        // File doesn't exist, ignore
    }
}

/**
 * Submit school for verification
 */
export async function submitSchoolForVerification(
    schoolId: string
): Promise<void> {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)

    await updateDoc(schoolRef, {
        verificationStatus: "pending",
        updatedAt: serverTimestamp(),
    })
}

export interface SchoolsRealtimeOptions {
    country?: string;
    city?: string;
    examType?: string;
    level?: string;
    searchQuery?: string;
    pageSize?: number;           // ex: 15–20
    orderByField?: 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'asc' | 'desc';
    onUpdate: (schools: School[], hasMore: boolean, lastVisible: DocumentSnapshot | null) => void;
    onError?: (error: Error) => void;
}

/**
 * Écoute en temps réel les écoles publiques avec filtres
 * → Appelle onUpdate à chaque changement (ajout, modif, suppression)
 */
export function listenToPublicSchools(
    options: SchoolsRealtimeOptions
): Unsubscribe {
    const {
        country,
        city,
        examType,
        level,
        searchQuery = '',
        pageSize = 20,
        orderByField = 'name',
        orderDirection = 'asc',
        onUpdate,
        onError,
    } = options;

    const constraints: QueryConstraint[] = [];

    // Filtres serveur (les plus performants)
    // if (country) {
    //     constraints.push(where('location.country', '==', country));
    // }
    // if (city) {
    //     constraints.push(where('location.city', '==', city));
    // }
    // if (examType) {
    //     constraints.push(where('exams', 'array-contains', examType));
    // }
    // if (level) {
    //     constraints.push(where('levels', 'array-contains', level));
    // }

    // Tri obligatoire pour la cohérence + pagination
    // constraints.push(orderBy(orderByField, orderDirection));

    // Limite le nombre de documents écoutés (important pour le coût !)
    // constraints.push(limit(pageSize));

    // Note : startAfter n'est PAS utilisé ici pour le listener initial
    // → Pour charger la page suivante → il faudra appeler une nouvelle fonction getNextPage()

    const schoolsRef = collection(db, firebaseCollections.schools);
    const q = query(schoolsRef, ...constraints);

    // ── Listener temps réel ───────────────────────────────────────
    const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
            const schools: School[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
                    updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
                } as School;
            });

            // Filtre texte côté client (dernier recours)
            let filtered = schools;
            if (searchQuery.trim()) {
                const qLower = searchQuery.toLowerCase().trim();
                filtered = schools.filter(
                    (s) =>
                        s.name.toLowerCase().includes(qLower) ||
                        (s.description && s.description.toLowerCase().includes(qLower))
                );
            }

            const hasMore = snapshot.docs.length === pageSize;
            const lastVisible = snapshot.docs[snapshot.docs.length - 1] ?? null;

            onUpdate(filtered, hasMore, lastVisible);
        },
        (error) => {
            console.error('Erreur onSnapshot écoles:', error);
            onError?.(error);
        }
    );

    return unsubscribe;
}

/**
 * Listen to school changes in real-time
 */
export function onSchoolChanged(
    schoolId: string,
    callback: (school: School | null) => void
): () => void {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)

    return onSnapshot(schoolRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(null)
            return
        }

        const data = snapshot.data()
        const school: School = {
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
        } as School

        callback(school)
    })
}

/**
 * Increment profile views for a school
 */
export async function incrementSchoolProfileViews(schoolId: string): Promise<void> {
    const schoolRef = doc(db, firebaseCollections.schools, schoolId)

    await updateDoc(schoolRef, {
        profileViews: (await getSchool(schoolId))?.profileViews ?
            ((await getSchool(schoolId))!.profileViews! + 1) : 1,
    })
}

/**
 * Add a review to a school
 */
export async function addSchoolReview(
    schoolId: string,
    studentId: string,
    studentName: string,
    rating: number,
    comment: string,
    studentPhoto?: string
): Promise<string> {
    const reviewsRef = collection(
        db,
        firebaseCollections.schools,
        schoolId,
        "reviews"
    )
    
    const reviewRef = doc(reviewsRef)
    const reviewId = reviewRef.id

    await setDoc(reviewRef, {
        id: reviewId,
        schoolId,
        studentId,
        studentName,
        studentPhoto: studentPhoto || null,
        rating,
        comment,
        createdAt: serverTimestamp(),
    })

    // Update school rating
    await updateSchoolRating(schoolId)

    return reviewId
}

/**
 * Get all reviews for a school
 */
export async function getSchoolReviews(schoolId: string): Promise<any[]> {
    const reviewsRef = collection(
        db,
        firebaseCollections.schools,
        schoolId,
        "reviews"
    )
    
    const q = query(reviewsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    
    const reviews: any[] = []
    snapshot.forEach((doc) => {
        const data = doc.data()
        reviews.push({
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        })
    })

    return reviews
}

/**
 * Update school rating based on all reviews
 */
export async function updateSchoolRating(schoolId: string): Promise<void> {
    const reviews = await getSchoolReviews(schoolId)
    
    if (reviews.length === 0) {
        await updateDoc(doc(db, firebaseCollections.schools, schoolId), {
            rating: 0,
            reviewCount: 0,
        })
        return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await updateDoc(doc(db, firebaseCollections.schools, schoolId), {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
    })
}

/**
 * Listen to school reviews in real-time
 */
export function onSchoolReviewsChanged(
    schoolId: string,
    callback: (reviews: any[]) => void
): Unsubscribe {
    const reviewsRef = collection(
        db,
        firebaseCollections.schools,
        schoolId,
        "reviews"
    )
    
    const q = query(reviewsRef, orderBy("createdAt", "desc"))

    return onSnapshot(q, (snapshot) => {
        const reviews: any[] = []
        snapshot.forEach((doc) => {
            const data = doc.data()
            reviews.push({
                ...data,
                createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            })
        })
        callback(reviews)
    })
}
