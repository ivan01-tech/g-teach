# Connection Lifecycle System - Quick Reference & Summary

## What Was Built

A **lightweight, Firebase-based connection tracking system** for G-Teach that:

✅ Tracks connections between students and tutors  
✅ Manages dual confirmation (both parties must agree)  
✅ Sends automatic reminders based on connection state  
✅ Collects structured feedback with ratings & reviews  
✅ Calculates tutor performance metrics  
✅ Scales without payment processing  

## File Structure

```
lib/
├── types/
│   └── connection.ts                    # Type definitions for entire system
├── services/
│   ├── connection.service.ts            # Core connection lifecycle logic
│   ├── feedback.service.ts              # Feedback & review management
│   └── reminder.service.ts              # Reminder scheduling & tracking

hooks/
└── use-connection.ts                    # React hooks for components
    ├── useConnection()                  # Main connection lifecycle
    ├── useTutorMetrics()               # Fetch tutor metrics
    ├── useFeedback()                   # Manage feedback
    └── useReminders()                  # Manage reminders

components/connections/
├── connection-card.tsx                  # Display single connection with actions
└── feedback-form.tsx                    # Collect ratings & reviews

functions/src/
└── index.ts                             # Cloud Functions for automation
    ├── sendConfirmationReminders()      # Scheduled: 2 AM daily
    ├── sendInactiveReminders()          # Scheduled: 10 AM daily
    ├── sendFeedbackReminders()          # Scheduled: 6 PM daily
    ├── onConnectionAgreed()             # Trigger: update metrics on agreement
    ├── onFeedbackSubmitted()            # Trigger: update ratings when feedback received
    └── triggerReminders()               # HTTP: manual reminder trigger

Documentation/
├── CONNECTIONS_SYSTEM.md                # Complete system documentation
└── CONNECTIONS_IMPLEMENTATION_EXAMPLES.md # Code examples & integration guide
```

## Core Workflows

### 1. **Initiate Connection**
```typescript
// Student contacts tutor
const connection = await ConnectionService.initiateConnection(
  studentId,
  tutorId,
  { subject: 'Goethe B2', notes: 'Looking for help...' }
);
// Status: initiated
// Student confirmed: ✓, Tutor confirmed: ⏳
```

### 2. **Confirm Agreement**
```typescript
// Tutor confirms
await ConnectionService.confirmConnection(connectionId, tutorId, true);
// Status: agreed (if both confirmed)
// Tutor confirmed: ✓
```

### 3. **Start Collaboration**
```typescript
// Tutor updates when lessons begin
await ConnectionService.updateConnectionStatus(connectionId, 'collaboration_started');
```

### 4. **Complete & Feedback**
```typescript
// Mark connection complete
await ConnectionService.updateConnectionStatus(connectionId, 'completed');

// Submit feedback
await FeedbackService.submitFeedback(connectionId, studentId, {
  rating: 5,
  review: 'Great tutor!',
  wouldRecommend: true
});
```

## Key Features

### ✅ Dual Confirmation System
- Student confirms on initiation
- Tutor must explicitly confirm
- Either party can decline (cancels connection)
- Automatic transition to "agreed" when both confirm

### ✅ Automatic Reminders
| Reminder | Trigger | When | Max |
|----------|---------|------|-----|
| Confirmation | Tutor not confirmed | Day 3 | 3 |
| Inactive | Agreed but no collaboration | Day 7 | 3 |
| Feedback | Connection completed | Day 14 | 3 |

Cloud Functions run on schedule:
- 2 AM UTC: Confirmation reminders
- 10 AM UTC: Inactive reminders  
- 6 PM UTC: Feedback reminders

### ✅ Performance Metrics
Track per tutor:
- Average rating (1-5 stars)
- Total reviews received
- Success rate (connections → agreements)
- Active students
- Response time
- Cancellation rate

### ✅ Feedback System
Collected after completion:
- Overall rating (1-5 stars)
- Category ratings (communication, professionalism, etc.)
- Written review (max 500 chars)
- Would you recommend? (yes/no)
- Moderation workflow (pending → approved/rejected)

## Connection Statuses

```
initiated ──→ (confirm) ───→ agreed ──→ (start) ──→ collaboration_started ──→ completed
     │                           │                           │
     └─ (decline) ───────────────┴─ (cancel) ───────────────┴─ (natural end)
             ↓                    ↓                               ↓
         CANCELLED           CANCELLED                        COMPLETED
```

## Integration Points

### 1. **Chat System**
When message sent:
```typescript
await updateDoc(doc(db, 'connections', connectionId), {
  messageCount: increment(1),
  lastActivityAt: Date.now(),
  status: 'in_discussion' // if initiated, move to discussion
});
```

### 2. **Tutor Profile**
Display metrics widget:
```tsx
<TutorProfileMetrics tutorId={tutorId} />
// Shows: rating, review count, success rate, active students
```

### 3. **Dashboard**
Show active connections summary:
```tsx
<ActiveConnectionsWidget />
// Shows: pending count, active count, quick access
```

### 4. **Feedback Collection**
After completion:
```tsx
<FeedbackForm
  connectionId={connectionId}
  recipientName={tutorName}
  recipientType="tutor"
/>
```

## Database Collections

### connections/
- Primary tracking for all student-tutor interactions
- Immutable timeline of status changes
- Auto-updated metadata (message count, last activity)

### connectionFeedback/
- Ratings and reviews
- Linked to connections by ID
- Moderation status tracking

### connectionReminders/
- Reminder delivery tracking
- Read/dismissed status
- Audit trail of communications

### connectionMetrics/
- Aggregated performance data
- Updated on feedback approval
- Used for tutor ranking/search

## Deployment Steps

### 1. **Firestore Setup**
- Create 5 collections (already defined in schema)
- Set security rules (provided in docs)
- Add reminder config document

### 2. **Cloud Functions**
```bash
firebase deploy --only functions
```
Deploys:
- 3 scheduled functions (via Cloud Scheduler)
- 2 Firestore triggers
- 1 HTTP function (manual trigger)

### 3. **Cloud Scheduler**
Create 3 jobs in Google Cloud Console with URLs in Firebase:
- `sendConfirmationReminders` @ 2 AM UTC
- `sendInactiveReminders` @ 10 AM UTC
- `sendFeedbackReminders` @ 6 PM UTC

### 4. **Frontend Integration**
- Import hooks: `useConnection`, `useTutorMetrics`, `useFeedback`, `useReminders`
- Add components: `ConnectionCard`, `FeedbackForm`
- Integrate into existing pages

## React Hooks Reference

### `useConnection(options)`
```typescript
const {
  connections,           // Array of connections
  loading,              // Loading state
  error,                // Error object
  fetchConnections,     // Manual refresh
  initiateConnection,   // Create new connection
  confirmConnection,    // Confirm/decline
  updateStatus,         // Change status
  getConnection,        // Fetch single
  activeCount,          // Active count
  pendingCount,         // Pending count
} = useConnection({ userId: currentUserId, role: 'tutor' });
```

### `useTutorMetrics(tutorId)`
```typescript
const {
  metrics,      // Full metrics object
  loading,
  error,
  scores,       // { overallScore, successRate, reliabilityScore }
} = useTutorMetrics(tutorId);
```

### `useFeedback(userId)`
```typescript
const {
  feedbacks,          // Array of feedback received
  submitFeedback,     // Submit new feedback
  averageRating,      // Calculated average
  totalReviews,
} = useFeedback(userId);
```

### `useReminders(userId)`
```typescript
const {
  reminders,       // Array of reminders
  unreadCount,     // Count of unread
  markAsRead,      // Mark as read
  dismiss,         // Dismiss reminder
} = useReminders(userId);
```

## Security

### Firestore Rules
- Users can only see/manage their own connections
- Feedback is visible to connection parties
- Reminders are private to recipient
- Metrics are public read-only
- Settings require admin authentication

### Best Practices
- Validate all user inputs
- Use Cloud Functions for sensitive operations
- Enable audit logging for feedback moderation
- Implement rate limiting on connection creation
- Sanitize user reviews before display

## Performance Optimization

### Indexes Needed
```
connections:
- studentId + lastActivityAt (DESC)
- tutorId + status + lastActivityAt (DESC)

connectionFeedback:
- recipientId + moderationStatus + createdAt (DESC)

connectionReminders:
- reminderId + status + sentAt (DESC)
```

### Caching Strategy
- Cache tutor metrics (TTL: 1 hour)
- Cache user connections (TTL: 5 minutes)
- Use `autoRefresh` prop for real-time features

## Monitoring & Maintenance

### Metrics to Monitor
- Connection success rate (target: >80%)
- Average feedback rating (target: >4.0)
- Reminder delivery success
- Feedback moderation queue size

### Admin Dashboard Needed
- Connection analytics
- Feedback moderation queue
- Tutor performance rankings
- System health (functions, scheduler)

## Future Enhancements

### Phase 2
- [ ] Payment integration (when monetizing)
- [ ] Dispute resolution system
- [ ] Document sharing (lesson plans, PDFs)
- [ ] Lesson scheduling & calendar sync

### Phase 3
- [ ] Batch operations (export data, bulk actions)
- [ ] Advanced analytics dashboard
- [ ] Email notification templates
- [ ] SMS reminders option
- [ ] Push notifications (PWA)

### Phase 4
- [ ] AI-powered tutor matching
- [ ] Automated quality scoring
- [ ] Predictive churn detection
- [ ] Recommendation engine

## Common Issues & Solutions

### Reminders not sending
- Check Cloud Scheduler jobs are enabled
- Verify Cloud Functions deployed successfully
- Check Firebase logs for errors
- Ensure Firestore rules allow function writes

### Metrics not updating
- Feedback must have `moderationStatus: 'approved'"`
- Verify feedback collection exists
- Check connection reference is valid
- Monitor Cloud Function `onFeedbackSubmitted`

### Dual confirmation not working
- Verify status only changes when BOTH confirm
- Check `confirmation` field structure matches schema
- Test decision flow in development

## Support & Resources

- **Full Documentation**: `CONNECTIONS_SYSTEM.md`
- **Implementation Examples**: `CONNECTIONS_IMPLEMENTATION_EXAMPLES.md`
- **Types**: `lib/types/connection.ts`
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**System Status**: ✅ Complete & Ready for Integration  
**Last Updated**: February 26, 2026  
**Version**: 1.0
