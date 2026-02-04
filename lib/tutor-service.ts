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
  arrayUnion,
} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Tutor, TutorDocument, VerificationStatus } from "@/lib/types"
import { firebaseCollections } from "./collections"

export async function createTutorProfile(
  uid: string,
  data: Partial<Tutor>
): Promise<void> {
  const tutorRef = doc(db, "tutors", uid)
  
  const tutorData: Partial<Tutor> = {
    uid,
    displayName: data.displayName || "",
    email: data.email || "",
    photoURL: data.photoURL,
    bio: data.bio || "",
    specializations: data.specializations || [],
    teachingLevels: data.teachingLevels || [],
    examTypes: data.examTypes || [],
    languages: data.languages || ["German"],
    hourlyRate: data.hourlyRate || 0,
    currency: data.currency || "EUR",
    availability: data.availability || [],
    rating: 0,
    reviewCount: 0,
    totalStudents: 0,
    totalLessons: 0,
    verificationStatus: "pending",
    documents: [],
    isOnline: false,
    createdAt: new Date(),
    country: data.country,
    timezone: data.timezone,
  }

  await setDoc(tutorRef, {
    ...tutorData,
    createdAt: serverTimestamp(),
  })
}

export async function getTutorProfile(uid: string): Promise<Tutor | null> {
  const tutorRef = doc(db, "tutors", uid)
  const tutorSnap = await getDoc(tutorRef)
  
  if (tutorSnap.exists()) {
    return tutorSnap.data() as Tutor
  }
  return null
}

export async function updateTutorProfile(
  uid: string,
  data: Partial<Tutor>
): Promise<void> {
  const tutorRef = doc(db, firebaseCollections.userProfiles, uid)
  await updateDoc(tutorRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function uploadTutorDocument(
  uid: string,
  file: File,
  documentType: TutorDocument["type"]
): Promise<TutorDocument> {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const storageRef = ref(storage, `tutors/${uid}/documents/${fileName}`)
  
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  
  const document: TutorDocument = {
    id: `${timestamp}`,
    type: documentType,
    name: file.name,
    url: downloadURL,
    uploadedAt: new Date(),
    status: "pending",
  }
  
  const tutorRef = doc(db, "tutors", uid)
  await updateDoc(tutorRef, {
    documents: arrayUnion(document),
  })
  
  return document
}

export async function deleteTutorDocument(
  uid: string,
  documentId: string,
  documentUrl: string
): Promise<void> {
  // Delete from storage
  try {
    const storageRef = ref(storage, documentUrl)
    await deleteObject(storageRef)
  } catch {
    // File might not exist, continue
  }
  
  // Update Firestore
  const tutorRef = doc(db, "tutors", uid)
  const tutorSnap = await getDoc(tutorRef)
  
  if (tutorSnap.exists()) {
    const tutor = tutorSnap.data() as Tutor
    const updatedDocuments = tutor.documents.filter((d) => d.id !== documentId)
    await updateDoc(tutorRef, { documents: updatedDocuments })
  }
}

export async function uploadTutorPhoto(uid: string, file: File): Promise<string> {
  const storageRef = ref(storage, `tutors/${uid}/profile.jpg`)
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  
  await updateTutorProfile(uid, { photoURL: downloadURL })
  
  return downloadURL
}

export async function getTutorsByStatus(
  status: VerificationStatus
): Promise<Tutor[]> {
  const tutorsRef = collection(db, "tutors")
  const q = query(tutorsRef, where("verificationStatus", "==", status))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map((doc) => doc.data() as Tutor)
}

export async function getStudentRequests(tutorId: string) {
  const conversationsRef = collection(db, "conversations")
  const q = query(
    conversationsRef,
    where("participants", "array-contains", tutorId)
  )
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
