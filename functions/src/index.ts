/**
 * Cloud Functions for Connection Lifecycle System
 * 
 * Setup:
 * 1. Create a new Firebase project or use existing one
 * 2. Install Firebase CLI: npm install -g firebase-tools
 * 3. Initialize functions: firebase init functions
 * 4. Deploy: firebase deploy --only functions
 * 
 * Environment: Node.js 18+
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// ============================================================================
// SCHEDULED FUNCTIONS (Cloud Scheduler)
// ============================================================================

/**
 * Send confirmation reminders every day at 2 AM
 * Triggers for connections awaiting confirmation after X days
 */
export const sendConfirmationReminders = functions.pubsub
  .schedule('0 2 * * *') // Every day at 2 AM
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      console.log('Starting confirmation reminders batch...');
      
      const configSnap = await db.collection('settings').doc('reminderConfig').get();
      const config = configSnap.data() || { confirmationReminderDays: 3, maxReminders: 3 };
      
      const cutoffTime = Date.now() - config.confirmationReminderDays * 24 * 60 * 60 * 1000;

      const connectionsSnap = await db
        .collection('connections')
        .where('status', '==', 'initiated')
        .where('initiatedAt', '<=', cutoffTime)
        .get();

      let remindersCount = 0;

      for (const connDoc of connectionsSnap.docs) {
        const connection = connDoc.data();

        if (connection.reminderCount >= config.maxReminders) {
          console.log(`Max reminders reached for connection ${connDoc.id}`);
          continue;
        }

        // Only remind tutor if not confirmed
        if (connection.confirmation.tutorConfirmed === 'pending') {
          await createReminder(
            connDoc.id,
            connection.tutorId,
            'confirmation',
            `A student is waiting for your confirmation on their tutoring request from ${new Date(connection.initiatedAt).toLocaleDateString()}.`
          );
          remindersCount++;
        }
      }

      console.log(`Confirmation reminders sent: ${remindersCount}`);
      return { success: true, count: remindersCount };
    } catch (error) {
      console.error('Error sending confirmation reminders:', error);
      return { success: false, error: String(error) };
    }
  });

/**
 * Send reminders for inactive agreed connections
 * Triggers for connections that agreed but haven't started after X days
 */
export const sendInactiveReminders = functions.pubsub
  .schedule('0 10 * * *') // Every day at 10 AM
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      console.log('Starting inactive connection reminders batch...');
      
      const configSnap = await db.collection('settings').doc('reminderConfig').get();
      const config = configSnap.data() || { inactiveReminderDays: 7, maxReminders: 3 };
      
      const cutoffTime = Date.now() - config.inactiveReminderDays * 24 * 60 * 60 * 1000;

      const connectionsSnap = await db
        .collection('connections')
        .where('status', '==', 'agreed')
        .where('lastActivityAt', '<=', cutoffTime)
        .get();

      let remindersCount = 0;

      for (const connDoc of connectionsSnap.docs) {
        const connection = connDoc.data();

        if (connection.reminderCount >= config.maxReminders) {
          continue;
        }

        // Send reminder to both parties
        await createReminder(
          connDoc.id,
          connection.studentId,
          'follow_up',
          `You agreed to start tutoring. Please schedule your first lesson or update your connection status.`
        );
        
        await createReminder(
          connDoc.id,
          connection.tutorId,
          'follow_up',
          `You agreed to tutor this student. Please schedule your first lesson or update your connection status.`
        );

        remindersCount += 2;
      }

      console.log(`Inactive connection reminders sent: ${remindersCount}`);
      return { success: true, count: remindersCount };
    } catch (error) {
      console.error('Error sending inactive reminders:', error);
      return { success: false, error: String(error) };
    }
  });

/**
 * Send feedback reminders for completed connections
 * Triggers for connections completed after X days without feedback
 */
export const sendFeedbackReminders = functions.pubsub
  .schedule('0 18 * * *') // Every day at 6 PM
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      console.log('Starting feedback reminders batch...');
      
      const configSnap = await db.collection('settings').doc('reminderConfig').get();
      const config = configSnap.data() || { feedbackReminderDays: 14, maxReminders: 3 };
      
      const cutoffTime = Date.now() - config.feedbackReminderDays * 24 * 60 * 60 * 1000;

      const connectionsSnap = await db
        .collection('connections')
        .where('status', '==', 'completed')
        .where('completedAt', '<=', cutoffTime)
        .get();

      let remindersCount = 0;

      for (const connDoc of connectionsSnap.docs) {
        const connection = connDoc.data();

        // Send feedback reminder if no feedback yet
        if (!connection.studentFeedbackId && connection.reminderCount < config.maxReminders) {
          await createReminder(
            connDoc.id,
            connection.studentId,
            'feedback',
            `Please share your feedback about your tutoring experience. This helps other students find great tutors.`
          );
          remindersCount++;
        }

        if (!connection.tutorFeedbackId && connection.reminderCount < config.maxReminders) {
          await createReminder(
            connDoc.id,
            connection.tutorId,
            'feedback',
            `Please share your feedback about this student. Your insights help us improve the platform.`
          );
          remindersCount++;
        }
      }

      console.log(`Feedback reminders sent: ${remindersCount}`);
      return { success: true, count: remindersCount };
    } catch (error) {
      console.error('Error sending feedback reminders:', error);
      return { success: false, error: String(error) };
    }
  });

// ============================================================================
// FIRESTORE TRIGGERS
// ============================================================================

/**
 * When connection status changes to 'agreed', update metrics
 */
export const onConnectionAgreed = functions.firestore
  .document('connections/{connectionId}')
  .onUpdate(async (change) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // Transition to agreed
      if (before.status !== 'agreed' && after.status === 'agreed') {
        await updateTutorMetrics(after.tutorId, {
          activeConnections: admin.firestore.FieldValue.increment(1),
          successfulConnections: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Connection ${change.after.id} status updated to agreed`);
      }

      // Transition to collaboration_started
      if (before.status !== 'collaboration_started' && after.status === 'collaboration_started') {
        const connRef = db.collection('connections').doc(change.after.id);
        await connRef.update({
          collaborationStartedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Connection ${change.after.id} collaboration started`);
      }

      // Transition to cancelled
      if (before.status !== 'cancelled' && after.status === 'cancelled') {
        await updateTutorMetrics(after.tutorId, {
          totalConnections: admin.firestore.FieldValue.increment(-1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Connection ${change.after.id} cancelled`);
      }
    } catch (error) {
      console.error('Error in onConnectionAgreed:', error);
    }
  });

/**
 * When feedback is submitted, update tutor rating
 */
export const onFeedbackSubmitted = functions.firestore
  .document('connectionFeedback/{feedbackId}')
  .onCreate(async (snap) => {
    try {
      const feedback = snap.data();

      // Only update metrics for approved feedback
      if (feedback.moderationStatus !== 'approved') {
        return;
      }

      const connexionSnap = await db.collection('connections').doc(feedback.connectionId).get();
      if (!connexionSnap.exists()) return;

      const connection = connexionSnap.data();
      const tutorId = connection.tutorId;

      // Get all feedbacks for tutor
      const feedbacksSnap = await db
        .collection('connectionFeedback')
        .where('recipientId', '==', tutorId)
        .where('moderationStatus', '==', 'approved')
        .get();

      const ratings = feedbacksSnap.docs.map(doc => doc.data().rating);
      const avgRating = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;

      await updateTutorMetrics(tutorId, {
        averageRating: avgRating,
        totalReviews: ratings.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Updated tutor ${tutorId} metrics after feedback`);
    } catch (error) {
      console.error('Error in onFeedbackSubmitted:', error);
    }
  });

// ============================================================================
// HTTP FUNCTIONS (For manual triggers)
// ============================================================================

/**
 * Manually trigger reminder checks
 * Requires authentication
 */
export const triggerReminders = functions.https.onRequest(
  { cors: true },
  async (req, res) => {
    try {
      // Verify token (implement auth check)
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const type = req.query.type || 'all';
      const results: any = {};

      if (type === 'all' || type === 'confirmation') {
        // Send confirmation reminders
        results.confirmation = await sendConfirmationRemindersLogic();
      }

      if (type === 'all' || type === 'inactive') {
        // Send inactive reminders
        results.inactive = await sendInactiveRemindersLogic();
      }

      if (type === 'all' || type === 'feedback') {
        // Send feedback reminders
        results.feedback = await sendFeedbackRemindersLogic();
      }

      res.json({ success: true, results });
    } catch (error) {
      console.error('Error in triggerReminders:', error);
      res.status(500).json({ error: String(error) });
    }
  }
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function createReminder(
  connectionId: string,
  userId: string,
  type: string,
  message: string
): Promise<void> {
  const remindersRef = db.collection('connectionReminders');
  
  await remindersRef.add({
    connectionId,
    reminderId: userId,
    reminderType: type,
    status: 'sent',
    sentAt: admin.firestore.FieldValue.serverTimestamp(),
    message,
  });

  // Increment reminder count in connection
  const connRef = db.collection('connections').doc(connectionId);
  await connRef.update({
    reminderCount: admin.firestore.FieldValue.increment(1),
    lastReminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function updateTutorMetrics(
  tutorId: string,
  updates: any
): Promise<void> {
  const metricsRef = db.collection('connectionMetrics').doc(`${tutorId}_asTutor`);
  
  const metricsDoc = await metricsRef.get();
  if (!metricsDoc.exists()) {
    await metricsRef.set({
      userId: tutorId,
      role: 'asTutor',
      totalConnections: 0,
      activeConnections: 0,
      successfulConnections: 0,
      averageRating: 0,
      totalReviews: 0,
      cancellationRate: 0,
      ...updates,
    });
  } else {
    await metricsRef.update(updates);
  }
}

async function sendConfirmationRemindersLogic(): Promise<number> {
  const configSnap = await db.collection('settings').doc('reminderConfig').get();
  const config = configSnap.data() || { confirmationReminderDays: 3, maxReminders: 3 };
  
  const cutoffTime = Date.now() - config.confirmationReminderDays * 24 * 60 * 60 * 1000;
  const snapshot = await db
    .collection('connections')
    .where('status', '==', 'initiated')
    .where('initiatedAt', '<=', cutoffTime)
    .get();

  let count = 0;
  for (const doc of snapshot.docs) {
    const conn = doc.data();
    if (conn.reminderCount < config.maxReminders && conn.confirmation.tutorConfirmed === 'pending') {
      await createReminder(doc.id, conn.tutorId, 'confirmation', 'Please confirm this tutoring request.');
      count++;
    }
  }
  return count;
}

async function sendInactiveRemindersLogic(): Promise<number> {
  const configSnap = await db.collection('settings').doc('reminderConfig').get();
  const config = configSnap.data() || { inactiveReminderDays: 7, maxReminders: 3 };
  
  const cutoffTime = Date.now() - config.inactiveReminderDays * 24 * 60 * 60 * 1000;
  const snapshot = await db
    .collection('connections')
    .where('status', '==', 'agreed')
    .where('lastActivityAt', '<=', cutoffTime)
    .get();

  let count = 0;
  for (const doc of snapshot.docs) {
    const conn = doc.data();
    if (conn.reminderCount < config.maxReminders) {
      await createReminder(doc.id, conn.studentId, 'follow_up', 'Please schedule your first lesson.');
      await createReminder(doc.id, conn.tutorId, 'follow_up', 'Please schedule the first lesson.');
      count += 2;
    }
  }
  return count;
}

async function sendFeedbackRemindersLogic(): Promise<number> {
  const configSnap = await db.collection('settings').doc('reminderConfig').get();
  const config = configSnap.data() || { feedbackReminderDays: 14, maxReminders: 3 };
  
  const cutoffTime = Date.now() - config.feedbackReminderDays * 24 * 60 * 60 * 1000;
  const snapshot = await db
    .collection('connections')
    .where('status', '==', 'completed')
    .where('completedAt', '<=', cutoffTime)
    .get();

  let count = 0;
  for (const doc of snapshot.docs) {
    const conn = doc.data();
    if (conn.reminderCount < config.maxReminders) {
      if (!conn.studentFeedbackId) {
        await createReminder(doc.id, conn.studentId, 'feedback', 'Please share your feedback.');
        count++;
      }
      if (!conn.tutorFeedbackId) {
        await createReminder(doc.id, conn.tutorId, 'feedback', 'Please share your feedback.');
        count++;
      }
    }
  }
  return count;
}
