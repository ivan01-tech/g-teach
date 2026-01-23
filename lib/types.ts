import { UserRole } from "./roles"

export type VerificationStatus = "pending" | "verified" | "rejected"

export interface TutorDocument {
  id: string
  type: "certificate" | "diploma" | "cv" | "other"
  name: string
  url: string
  uploadedAt: Date
  status: VerificationStatus
}

export interface Tutor {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  specializations: string[]
  teachingLevels: string[]
  examTypes: string[]
  languages: string[]
  hourlyRate: number
  currency: string
  availability: AvailabilitySlot[]
  rating: number
  reviewCount: number
  totalStudents: number
  totalLessons: number
  verificationStatus: VerificationStatus
  verificationMessage?: string
  documents: TutorDocument[]
  isOnline: boolean
  createdAt: Date
  country?: string
  timezone?: string
  // Kept for backwards compatibility
  isVerified?: boolean
}

export interface AvailabilitySlot {
  day: string
  startTime: string
  endTime: string
}

export interface Review {
  id: string
  tutorId: string
  studentId: string
  studentName: string
  studentPhoto?: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Booking {
  id: string
  tutorId: string
  studentId: string
  tutorName: string
  studentName: string
  date: Date
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  price: number
  currency: string
  notes?: string
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderPhoto?: string
  text: string
  createdAt: Date
  read: boolean
}

export interface Conversation {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  participantPhotos: Record<string, string>
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: Record<string, number>
}

export const GERMAN_LEVELS = [
  { value: "a1", label: "A1 - Beginner" },
  { value: "a2", label: "A2 - Elementary" },
  { value: "b1", label: "B1 - Intermediate" },
  { value: "b2", label: "B2 - Upper Intermediate" },
  { value: "c1", label: "C1 - Advanced" },
  { value: "c2", label: "C2 - Proficiency" },
]

export const EXAM_TYPES = [
  { value: "goethe", label: "Goethe-Zertifikat" },
  { value: "telc", label: "TELC" },
  { value: "testdaf", label: "TestDaF" },
  { value: "dsh", label: "DSH" },
  { value: "osd", label: "ÖSD" },
]

export const SPECIALIZATIONS = [
  { value: "exam-prep", label: "Exam Preparation" },
  { value: "conversation", label: "Conversation Practice" },
  { value: "business", label: "Business German" },
  { value: "grammar", label: "Grammar Focus" },
  { value: "pronunciation", label: "Pronunciation" },
  { value: "writing", label: "Writing Skills" },
  { value: "reading", label: "Reading Comprehension" },
  { value: "listening", label: "Listening Skills" },
]


export type User = {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  role: UserRole
  createdAt: number
}