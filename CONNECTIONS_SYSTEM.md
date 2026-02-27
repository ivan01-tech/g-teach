# Connection Lifecycle System - Implementation Guide

## Overview

The Connection Lifecycle System is a lightweight tracking mechanism for connections between students and tutors on the G-Teach platform. It enables status tracking, dual confirmation, automatic reminders, and feedback collection without handling payments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Web Application (Next.js)                  │
├─────────────────────────────────────────────────────────────┤
│  Components                 │  Hooks                         │
│  - ConnectionCard           │  - useConnection               │
│  - FeedbackForm             │  - useFeedback                 │
│  - ConnectionsList          │  - useReminders                │
│  - TutorMetrics             │                                │
└─────────────────────────────────────────────────────────────┘
           │                          │
           └──────────────┬───────────┘
                          │
┌─────────────────────────────────────────────────────────────┐
│              Firebase Firestore (Database)                   │
├─────────────────────────────────────────────────────────────┤
│ Collections:                                                  │
│ ├── connections/          (Main connection records)          │
│ ├── connectionFeedback/    (Ratings & reviews)              │
│ ├── connectionReminders/   (Reminder tracking)              │
│ ├── connectionMetrics/     (Tutor/student performance)      │
│ └── settings/              (System configuration)            │
└─────────────────────────────────────────────────────────────┘
           │                          │
           └──────────────┬───────────┘
                          │
┌─────────────────────────────────────────────────────────────┐
│         Firebase Cloud Functions (Backend Logic)             │
├─────────────────────────────────────────────────────────────┤
│ Scheduled Functions (Cloud Scheduler):                       │
│ ├── sendConfirmationReminders     (Daily @ 2 AM)            │
│ ├── sendInactiveReminders         (Daily @ 10 AM)           │
│ ├── sendFeedbackReminders         (Daily @ 6 PM)            │
│                                                               │
│ Firestore Triggers:                                          │
│ ├── onConnectionAgreed            (Status changes)           │
│ ├── onFeedbackSubmitted           (Update metrics)           │
│                                                               │
│ HTTP Functions:                                              │
│ ├── triggerReminders              (Manual testing)           │
└─────────────────────────────────────────────────────────────┘
```

## Firestore Schema

### Collections Structure

```
connections/
├── {connectionId}
    ├── id: string                        # Unique identifier
    ├── studentId: string                 # Reference to student user
    ├── tutorId: string                   # Reference to tutor user
    ├── status: enum                      # Connection status
    ├── confirmation: {
    │   ├── studentConfirmed: enum        # "pending"|"confirmed"|"declined"
    │   ├── tutorConfirmed: enum
    │   ├── studentConfirmedAt?: number   # Timestamp
    │   └── tutorConfirmedAt?: number
    ├── initiatedAt: number               # When connection started
    ├── discussionStartedAt?: number
    ├── agreedAt?: number
    ├── collaborationStartedAt?: number
    ├── completedAt?: number
    ├── cancelledAt?: number
    ├── subject?: string                  # e.g., "Goethe B2 Exam Prep"
    ├── proposedLessonType?: string
    ├── notes?: string                    # Initial contact message
    ├── lastReminderSentAt?: number
    ├── reminderCount: number             # Total reminders sent
    ├── studentFeedbackId?: string        # Reference to feedback
    ├── tutorFeedbackId?: string
    ├── lastActivityAt: number
    └── messageCount: number              # Auto-updated from chat

connectionFeedback/
├── {feedbackId}
    ├── id: string
    ├── connectionId: string              # Reference to connection
    ├── giverId: string                   # Who gave the feedback
    ├── recipientId: string               # Who received it
    ├── giverType: enum                   # "student"|"tutor"
    ├── rating: number                    # 1-5 stars
    ├── ratingCategories?: {
    │   ├── communication: number
    │   ├── professionalism: number
    │   ├── knowledgeability: number
    │   ├── punctuality: number
    │   └── reliability: number
    ├── review: string                    # Max 500 chars
    ├── wouldRecommend: boolean
    ├── createdAt: number
    ├── updatedAt?: number
    ├── flaggedAsInappropriate?: boolean
    └── moderationStatus: enum            # "pending"|"approved"|"rejected"

connectionReminders/
├── {reminderId}
    ├── id: string
    ├── connectionId: string
    ├── reminderId: string                # User to remind
    ├── reminderType: enum                # "confirmation"|"follow_up"|"feedback"|"inactive"
    ├── status: enum                      # "sent"|"read"|"dismissed"
    ├── sentAt: number
    ├── readAt?: number
    ├── message: string
    └── actionUrl?: string

connectionMetrics/
├── {userId}_asTutor
    ├── userId: string
    ├── role: string
    ├── totalConnections: number
    ├── activeConnections: number
    ├── successfulConnections: number
    ├── averageRating: number
    ├── totalReviews: number
    ├── responseTimeHours: number
    ├── cancellationRate: number
    └── updatedAt: number

settings/
├── reminderConfig
    ├── confirmationReminderDays: number  # Default: 3
    ├── inactiveReminderDays: number      # Default: 7
    ├── feedbackReminderDays: number      # Default: 14
    └── maxReminders: number              # Default: 3
```

## Connection Statuses

| Status | Description | Transitions To |
|--------|-------------|-----------------|
| **initiated** | Student just contacted tutor | in_discussion, agreed, cancelled |
| **in_discussion** | Active chat exchange ongoing | agreed, cancelled |
| **agreed** | Both parties confirmed working together | collaboration_started, cancelled |
| **collaboration_started** | Tutoring/lessons have begun | completed, cancelled |
| **completed** | Partnership ended naturally | (final) |
| **cancelled** | One party cancelled | (final) |

## Confirmation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Student Initiates Connection                                │
├─────────────────────────────────────────────────────────────┤
│ Status: "initiated"                                          │
│ Student: confirmed ✓                                         │
│ Tutor: pending ⏳                                            │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   Tutor Accepts    Tutor Declines    After 3 days
        │               │               │
   ┌────▼─────┐    ┌────▼─────┐    ┌───▼──────┐
   │ AGREED    │    │ CANCELLED │    │ REMINDER │
   │ Status    │    │           │    │ Sent     │
   │ Both: ✓   │    │ declined  │    │          │
   └────┬─────┘    └───────────┘    └──────────┘
        │
        │
   ┌────▼──────────────────────────────────┐
   │ Ready for Collaboration Planning       │
   │ Both parties can schedule lessons      │
   └────────────────────────────────────────┘
```

## Key Features & Implementation

### 1. Initiate Connection

```typescript
// In chat-sending or tutor profile page
const connection = await ConnectionService.initiateConnection(
  currentUserId,
  tutorId,
  {
    subject: 'Goethe B2 Exam',
    proposedLessonType: 'Weekly 1-on-1',
    notes: 'I need help preparing for my Goethe exam in 2 months'
  }
);
```

### 2. Confirm Agreement

```typescript
// Tutor confirms they agree to work with student
await ConnectionService.confirmConnection(
  connectionId,
  tutorId,
  true // or false to decline
);
```

### 3. Update Status

```typescript
// Tutor marks when collaboration starts
await ConnectionService.updateConnectionStatus(
  connectionId,
  'collaboration_started'
);

// After tutoring is complete
await ConnectionService.updateConnectionStatus(
  connectionId,
  'completed'
);
```

### 4. Submit Feedback

```typescript
// Student rates their tutor experience
const feedback = await FeedbackService.submitFeedback(
  connectionId,
  studentId,
  {
    rating: 5,
    ratingCategories: {
      communication: 5,
      professionalism: 5,
      knowledgeability: 5,
      punctuality: 5,
      reliability: 4
    },
    review: 'Excellent tutor! Clear explanations and patient teaching style.',
    wouldRecommend: true
  }
);
```

### 5. Automatic Reminders

Reminders are sent automatically by Cloud Functions:

- **Confirmation Reminder** (Day 3): If tutor hasn't confirmed
- **Inactive Reminder** (Day 7): If agreed but no collaboration started
- **Feedback Reminder** (Day 14): After completion, request feedback
- **Max 3 reminders** per connection to avoid spam

## Integration Points

### 1. Chat Integration

Update message count in connection:

```typescript
// lib/services/chat.service.ts or similar
async sendMessage(connectionId: string, message: ChatMessage) {
  // ... send message ...
  
  // Update connection last activity
  await updateDoc(doc(db, 'connections', connectionId), {
    messageCount: increment(1),
    lastActivityAt: Date.now(),
    status: 'in_discussion' // Auto-update status if in initiated
  });
}
```

### 2. User Profile Enhancement

Add metrics display to tutor profiles:

```typescript
// components/tutor/tutor-profile.tsx
const metrics = await ConnectionService.getTutorMetrics(tutorId);

// Display:
// - Average rating: 4.8/5
// - Total reviews: 24
// - Success rate: 92%
// - Active students: 3
```

### 3. Dashboard Widget

Show user's active connections:

```typescript
// components/dashboard/connections-widget.tsx
const myConnections = await ConnectionService.getUserConnections(
  userId,
  'both', // 'student', 'tutor', or 'both'
  ['agreed', 'collaboration_started'] // Show active only
);
```

## Setup Instructions

### Step 1: Create Firestore Collections

1. Go to Firebase Console
2. Create collections:
   - `connections`
   - `connectionFeedback`
   - `connectionReminders`
   - `connectionMetrics`
   - `settings` (add `reminderConfig` document)

### Step 2: Deploy Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize functions in your project
firebase init functions

# Copy functions/src/index.ts to your functions directory

# Deploy
firebase deploy --only functions
```

### Step 3: Set Up Cloud Scheduler

1. Go to Google Cloud Console
2. Enable Cloud Scheduler API
3. Create 3 scheduled jobs:

**Job 1: Confirmation Reminders**
- Frequency: `0 2 * * *` (Daily 2 AM)
- URL: `https://region-project.cloudfunctions.net/sendConfirmationReminders`

**Job 2: Inactive Reminders**
- Frequency: `0 10 * * *` (Daily 10 AM)
- URL: `https://region-project.cloudfunctions.net/sendInactiveReminders`

**Job 3: Feedback Reminders**
- Frequency: `0 18 * * *` (Daily 6 PM)
- URL: `https://region-project.cloudfunctions.net/sendFeedbackReminders`

### Step 4: Add Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Connections - users can read/write their own
    match /connections/{connectionId} {
      allow read: if request.auth.uid in resource.data.studentId 
                  || request.auth.uid in resource.data.tutorId;
      allow create: if request.auth.uid == request.resource.data.studentId;
      allow update: if request.auth.uid in [resource.data.studentId, resource.data.tutorId];
    }
    
    // Feedback - visible to connection parties
    match /connectionFeedback/{feedbackId} {
      allow read: if request.auth.uid in [resource.data.giverId, resource.data.recipientId];
      allow create: if request.auth.uid == request.resource.data.giverId;
    }
    
    // Reminders - users can only see/modify their own
    match /connectionReminders/{reminderId} {
      allow read, update: if request.auth.uid == resource.data.reminderId;
    }
    
    // Metrics - read-only for public profiles
    match /connectionMetrics/{metricsId} {
      allow read: if true;
    }
    
    // Settings - admin only
    match /settings/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

## Performance Metrics

The system tracks:

### Tutor Metrics
- Total connections initiated
- Successful connections (moved to agreed/collaboration)
- Average rating (1-5 stars)
- Number of reviews
- Response time (hours)
- Cancellation rate (%)

### Student Metrics
- Connection history count
- Average grade given to tutors
- Cancellations initiated count
- Reliability score (0-100)

### Platform Metrics
- Total connections
- Success rate
- Average feedback rating
- Tutor engagement rate

## Notification Strategy

While the system sends reminders via Firestore, for production you should implement:

1. **Firebase Cloud Messaging (FCM)** for push notifications
2. **Email notifications** via SendGrid/Mailgun for non-app alerts
3. **In-app notifications** via Next.js notifications component

## Safety & Moderation

- All feedback submitted is marked as `pending` and requires admin approval
- Inappropriate feedback can be flagged and removed
- Connection data is immutable after cancellation
- Reminders have a maximum count to prevent spam

## Future Enhancements

1. **Payment Integration**: Add payment processing when platform monetizes
2. **Dispute Resolution**: System for handling disagreements
3. **Document Exchange**: Share lesson plans, exercise files
4. **Scheduling Integration**: Calendar sync with lesson bookings
5. **Analytics Dashboard**: Admin view of platform health
6. **Email Templates**: Customizable reminder emails
7. **Notification Preferences**: User-configurable reminder frequency
8. **Bulk Operations**: Export connection data, analytics reports
