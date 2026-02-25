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

/**
 * Get schools for browsing (publicly)
 */
export async function getPublicSchools(filters?: {
  country?: string
  city?: string
  examType?: string
  level?: string
  searchQuery?: string
}): Promise<School[]> {
  const schoolsRef = collection(db, firebaseCollections.schools)
  let q = query(
    schoolsRef,
    where("verificationStatus", "==", "verified")
  )

  const snapshot = await getDocs(q)
  let schools: School[] = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    schools.push({
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
    } as School)
  })

  // Apply filters
  if (filters?.country) {
    schools = schools.filter(
      (s) => s.location.country.toLowerCase() === filters.country?.toLowerCase()
    )
  }

  if (filters?.city) {
    schools = schools.filter(
      (s) => s.location.city.toLowerCase() === filters.city?.toLowerCase()
    )
  }

  if (filters?.examType) {
    schools = schools.filter((s) => s.exams.includes(filters.examType!))
  }

  if (filters?.level) {
    schools = schools.filter((s) => s.levels.includes(filters.level!))
  }

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    schools = schools.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query)
    )
  }

  return schools
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
