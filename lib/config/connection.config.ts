/**
 * Connection System Configuration
 * Initialize these settings in Firestore under settings/reminderConfig
 */

export const DEFAULT_REMINDER_CONFIG = {
  // Days to wait before first reminder
  confirmationReminderDays: 3,
  inactiveReminderDays: 7,
  feedbackReminderDays: 14,
  
  // Maximum number of reminders per connection
  maxReminders: 3,
};

// Firestore initialization script
// Run this once to set up the system:
//
// const db = getFirestore();
// const configRef = doc(db, 'settings', 'reminderConfig');
// await setDoc(configRef, DEFAULT_REMINDER_CONFIG);

export const CONNECTION_STATUS_LABELS = {
  initiated: {
    label: 'Request Sent',
    description: 'Waiting for tutor confirmation',
    color: 'yellow',
    icon: 'Clock',
  },
  in_discussion: {
    label: 'In Discussion',
    description: 'Active conversation between student and tutor',
    color: 'blue',
    icon: 'MessageSquare',
  },
  agreed: {
    label: 'Confirmed',
    description: 'Both parties have agreed to work together',
    color: 'green',
    icon: 'CheckCircle',
  },
  collaboration_started: {
    label: 'Active Tutoring',
    description: 'Lessons and tutoring in progress',
    color: 'purple',
    icon: 'Star',
  },
  completed: {
    label: 'Completed',
    description: 'Tutoring partnership has ended',
    color: 'gray',
    icon: 'CheckCircle',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Connection was cancelled',
    color: 'red',
    icon: 'XCircle',
  },
};

export const REMINDER_TYPES = {
  confirmation: {
    label: 'Confirmation Reminder',
    description: 'Tutor needs to confirm the tutoring request',
    frequency: 'once every 3 days',
  },
  follow_up: {
    label: 'Follow-up Reminder',
    description: 'Partners are confirmed but no progress on scheduling',
    frequency: 'once every 7 days',
  },
  feedback: {
    label: 'Feedback Reminder',
    description: 'After tutoring completion, request feedback',
    frequency: 'once every 14 days',
  },
  inactive: {
    label: 'Activity Reminder',
    description: 'Reactivate inactive connections',
    frequency: 'custom',
  },
};

export const RATING_CATEGORIES = [
  {
    id: 'communication',
    label: 'Communication',
    description: 'Clarity of explanations and responsiveness',
    icon: 'MessageSquare',
  },
  {
    id: 'professionalism',
    label: 'Professionalism',
    description: 'Punctuality and conduct',
    icon: 'Briefcase',
  },
  {
    id: 'knowledgeability',
    label: 'Knowledgeability',
    description: 'Teaching ability and expertise (for tutors)',
    icon: 'BookOpen',
  },
  {
    id: 'punctuality',
    label: 'Punctuality',
    description: 'Timeliness and reliability',
    icon: 'Clock',
  },
  {
    id: 'reliability',
    label: 'Reliability',
    description: 'Consistent and dependable',
    icon: 'CheckCircle',
  },
];

/**
 * Calculate tutor reliability score
 * Used for ranking and recommendations
 */
export function calculateReliabilityScore(metrics: any): number {
  const components = {
    // Success rate: 40% weight
    successRate:
      metrics.totalConnections > 0
        ? (metrics.successfulConnections / metrics.totalConnections) * 100
        : 0,

    // Rating: 35% weight
    ratingScore: (metrics.averageRating / 5) * 100,

    // Punctuality: 15% weight
    punctualityScore: Math.min(100, (100 / metrics.responseTimeHours) * 2),

    // Reliability: 10% weight
    reliabilityScore: (1 - metrics.cancellationRate) * 100,
  };

  const score =
    components.successRate * 0.4 +
    components.ratingScore * 0.35 +
    components.punctualityScore * 0.15 +
    components.reliabilityScore * 0.1;

  return Math.round(score);
}

/**
 * Get tutor badge based on performance
 */
export function getTutorBadge(
  metrics: any
): 'elite' | 'excellent' | 'trusted' | 'new' | null {
  const score = calculateReliabilityScore(metrics);
  const reviews = metrics.totalReviews || 0;

  if (score >= 95 && reviews >= 20) {
    return 'elite'; // Top 5% of tutors
  } else if (score >= 90 && reviews >= 10) {
    return 'excellent'; // Highly rated with good feedback volume
  } else if (score >= 80 && reviews >= 5) {
    return 'trusted'; // Consistent performer
  } else if (metrics.totalConnections === 0) {
    return 'new'; // Brand new tutor
  }

  return null;
}

/**
 * Get recommendation message based on feedback
 */
export function getRecommendationMessage(
  rating: number,
  wouldRecommend: boolean
): string {
  if (rating >= 5 && wouldRecommend) {
    return '⭐ Highly would recommend';
  } else if (rating >= 4 && wouldRecommend) {
    return '✓ Would recommend';
  } else if (rating >= 3 && !wouldRecommend) {
    return '~ Neutral experience';
  } else if (rating < 3) {
    return '✗ Would not recommend';
  }
  return '';
}

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  connection: {
    subject: {
      maxLength: 100,
      required: false,
      pattern: /^[a-zA-Z0-9\s\-.,äöüß]*$/,
    },
    notes: {
      maxLength: 500,
      required: false,
      minLength: 10,
    },
    proposedLessonType: {
      maxLength: 50,
      required: false,
    },
  },
  feedback: {
    rating: {
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      minLength: 10,
      maxLength: 500,
      required: true,
    },
    reviewCategories: {
      min: 1,
      max: 5,
      required: false,
    },
  },
};

/**
 * Message templates for reminders
 */
export const REMINDER_TEMPLATES = {
  confirmation: {
    subject: 'Student waiting for your confirmation',
    body: (studentName: string, days: number) =>
      `A student submitted a tutoring request ${days} days ago and is waiting for your confirmation. 
      Please review their profile and respond to confirm or decline.`,
  },
  inactive: {
    subject: 'Time to schedule your first lesson',
    body: (partnerName: string, days: number) =>
      `You and ${partnerName} agreed to tutor ${days} days ago. 
      It's time to schedule your first lesson and get started!`,
  },
  feedback: {
    subject: 'Share your feedback',
    body: (partnerName: string) =>
      `Your tutoring with ${partnerName} is complete. 
      Please share your feedback to help improve the community.`,
  },
};

/**
 * Email notification templates
 */
export const EMAIL_TEMPLATES = {
  connectionInitiated: {
    subject: 'New tutoring request from {studentName}',
    preview: 'A student wants to learn from you',
  },
  connectionConfirmed: {
    subject: '{tutorName} confirmed your tutoring request',
    preview: 'Time to start planning your lessons!',
  },
  reminderConfirmation: {
    subject: 'Reminder: Student waiting for your response',
    preview: 'Please confirm or decline the tutoring request',
  },
  reminderInactive: {
    subject: 'Time to schedule your first lesson',
    preview: 'You confirmed but haven\'t started yet',
  },
  reminderFeedback: {
    subject: 'Share your tutoring experience',
    preview: 'Your feedback helps improve the platform',
  },
};

/**
 * Analytics events to track
 */
export const ANALYTICS_EVENTS = {
  CONNECTION_INITIATED: 'connection_initiated',
  CONNECTION_CONFIRMED: 'connection_confirmed',
  CONNECTION_DECLINED: 'connection_declined',
  CONNECTION_CANCELLED: 'connection_cancelled',
  COLLABORATION_STARTED: 'collaboration_started',
  COLLABORATION_COMPLETED: 'collaboration_completed',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  REMINDER_SENT: 'reminder_sent',
  REMINDER_CLICKED: 'reminder_clicked',
  TUTOR_PROFILE_VIEWED: 'tutor_profile_viewed',
  CONNECTION_RATING_GIVEN: 'connection_rating_given',
};

/**
 * Export configuration for Cloud Functions
 */
export const FUNCTIONS_CONFIG = {
  // Time zone for scheduled functions
  timezone: 'UTC',

  // Scheduled triggers
  triggers: {
    confirmationReminders: { schedule: '0 2 * * *' }, // Daily 2 AM
    inactiveReminders: { schedule: '0 10 * * *' }, // Daily 10 AM
    feedbackReminders: { schedule: '0 18 * * *' }, // Daily 6 PM
  },

  // Error handling
  errorHandling: {
    maxRetries: 3,
    retryDelayMs: 1000,
    logErrors: true,
  },

  // Rate limiting
  rateLimits: {
    connectionCreationPerUser: 10, // Per day
    feedbackSubmissionPerUser: 1, // Per connection
    reminderMaxPerConnection: 3, // Total
  },
};

/**
 * Firebase deployment configuration
 * Add to firebase.json
 */
export const FIREBASE_CONFIG_ADDITIONS = {
  functions: [
    {
      source: 'functions',
      codebase: 'default',
      ignore: ['node_modules', '.git'],
    },
  ],
  firestore: {
    rules: 'firestore.rules',
    indexes: 'firestore.indexes.json',
  },
  hosting: {
    public: '.next',
    ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
  },
};
