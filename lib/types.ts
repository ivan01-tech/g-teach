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
  city?: string
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
  profileViews?: number
  // Kept for backwards compatibility
  isVerified?: boolean
}

export interface ProfileView {
  id: string
  tutorId: string
  viewerId?: string // Optional, if the viewer is logged in
  viewedAt: any // Timestamp
  device?: string
  browser?: string
}

export interface City {
  id: string
  name: string
  country?: string
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

export interface SchoolReview {
  id: string
  schoolId: string
  studentId: string
  studentName: string
  studentPhoto?: string
  rating: number
  comment: string
  createdAt: Date
}

export interface SchoolProfileView {
  id: string
  schoolId: string
  viewerId?: string
  viewedAt: any
  device?: string
  browser?: string
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
  { value: "ecl", label: "ECL" },
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
  photoURL: string | null
  role?: UserRole  // Optional - fetched from Firestore on auth state change
  favorites?: string[]
  createdAt: number
}

export type MatchingStatus = "requested" | "open" | "confirmed" | "refused" | "continued"

export interface Matching {
  id: string
  learnerId: string
  tutorId: string
  learnerName?: string
  tutorName?: string
  contactDate: any // Timestamp
  status: MatchingStatus
  // Confirmations mutuelles
  learnerConfirmed?: boolean
  learnerConfirmedAt?: any // Timestamp
  tutorConfirmed?: boolean
  tutorConfirmedAt?: any // Timestamp
  // Feedback & Raisons
  learnerFeedback?: string
  tutorFeedback?: string
  // Gestion des rappels
  reminderSentAt?: any // Timestamp
  followupAt?: any // Timestamp pour relance courte (e.g. 5 minutes)
  reminderCount?: number // Nombre de rappels envoyés
  closedAt?: any // Timestamp
  // Monétisation
  isMonetized?: boolean // Est-ce une collaboration payante
  transactionId?: string // Référence à une transaction
}

export interface ContactInquiry {
  id: string
  firstName: string
  lastName: string
  email: string
  reason: string
  subject: string
  message: string
  status: "pending" | "resolved" | "archived"
  createdAt: any // Timestamp
}

export interface School {
  id: string
  tutorId: string
  name: string
  logo?: string | null
  location: {
    city: string
    country: string
    address?: string | null
    latitude: number | null
    longitude: number | null
  }
  exams: string[]
  levels: string[]
  verificationStatus: VerificationStatus
  rating: number
  reviewCount: number
  description?: string | null
  about?: string | null // About the language school
  phone?: string | null
  email?: string | null
  website?: string | null
  googleMapsUrl?: string | null // Link for directions
  socialMedia?: {
    facebook?: string | null
    twitter?: string | null
    instagram?: string | null
    linkedin?: string | null
  }
  profileViews?: number | null
  totalStudents?: number | null
  totalLessons?: number | null
  verificationMessage?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SchoolFilterState {
  searchQuery: string
  country: string
  city: string
  examType: string
  level: string
}


// ==================


/**
 * Connection Lifecycle System Types
 * Manages the relationship tracking between students and tutors
 */

export type ConnectionStatus =
  | 'initiated'           // Student just contacted tutor
  | 'in_discussion'       // Active chat exchange
  | 'agreed'              // Both parties confirmed agreement
  | 'collaboration_started' // Tutoring/lessons have begun
  | 'completed'           // Partnership ended naturally
  | 'cancelled';          // One party cancelled

export type ConfirmationStatus = 'pending' | 'confirmed' | 'declined';

export interface ConnectionConfirmation {
  studentConfirmed: ConfirmationStatus;
  tutorConfirmed: ConfirmationStatus;
  studentConfirmedAt?: number; // timestamp
  tutorConfirmedAt?: number;   // timestamp
}

export interface Connection {
  id: string;
  studentId: string;
  tutorId: string;
  status: ConnectionStatus;
  confirmation: ConnectionConfirmation;
studentConfirmedAt: number; // timestamp
  // Timeline tracking
  initiatedAt: number;
  discussionStartedAt?: number;
  agreedAt?: number;
  collaborationStartedAt?: number;
  completedAt?: number;
  cancelledAt?: number;

  // Metadata
  subject?: string; // German language, Goethe exam prep, etc.
  proposedLessonType?: string; // 1-on-1, group, etc.
  notes?: string; // Initial contact message

  // Reminder tracking
  lastReminderSentAt?: number;
  reminderCount: number;

  // Feedback references
  studentFeedbackId?: string;
  tutorFeedbackId?: string;

  // Activity tracking
  lastActivityAt: number;
  messageCount: number; // Auto-updated via chat
}

export interface Feedback {
  id: string;
  connectionId: string;
  giverId: string;    // Student or Tutor ID
  recipientId: string;
  giverType: 'student' | 'tutor';

  // Rating
  rating: number; // 1-5 stars
  ratingCategories?: {
    communication?: number;
    professionalism?: number;
    knowledgeability?: number;
    punctuality?: number;
    reliability?: number;
  };

  // Review
  review: string; // Max 500 characters
  wouldRecommend: boolean;

  // Metadata
  createdAt: number;
  updatedAt?: number;

  // Flags
  flaggedAsInappropriate?: boolean;
  moderationStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Reminder {
  id: string;
  connectionId: string;
  reminderId: string;      // Student or Tutor ID
  reminderType: 'confirmation' | 'follow_up' | 'feedback' | 'inactive';

  status: 'sent' | 'read' | 'dismissed';
  sentAt: number;
  readAt?: number;

  message: string;
  actionUrl?: string;
}

export interface ConnectionMetrics {
  // Tutor metrics
  totalConnections: number;
  activeConnections: number;
  successfulConnections: number; // Agreements that moved to collaboration
  averageRating: number;
  totalReviews: number;
  responseTimeHours: number;
  cancellationRate: number; // % of initiated connections that were cancelled

  // Student reliability
  reliabilityScore: number; // 0-100
  connectionHistoryCount: number;
  averageGradeGiven: number;
  cancelledByStudentCount: number;

  updatedAt: number;
}

export interface ReminderConfig {
  // Days to wait before sending reminders
  confirmationReminderDays: number; // Default: 3
  inactiveReminderDays: number;     // Default: 7
  feedbackReminderDays: number;     // Default: 14 after completion
  maxReminders: number;              // Default: 3
}

// Database schema structure
export interface UserProfile {
  connectionMetrics?: {
    asStudent?: ConnectionMetrics;
    asTutor?: ConnectionMetrics;
  };
  recentConnections?: string[]; // Last 5 connection IDs
  lastActivityAt?: number;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string; // Serialized date for Redux
  learningLevel?: string;
  targetExam?: string;
  specializations?: string[];
  hourlyRate?: number;
  bio?: string;
  isVerified?: boolean;
}
