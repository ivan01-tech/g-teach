/**
 * Reminder Service
 * Manages automatic reminders for connections
 * This service is designed to be called from Cloud Functions
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reminder, Connection, ReminderConfig } from '@/lib/types';
import { ConnectionService } from './connection.service';

const REMINDERS_COLLECTION = 'connectionReminders';
const REMINDER_CONFIG_DOC = 'reminderConfig';

// Default reminder configuration
const DEFAULT_CONFIG: ReminderConfig = {
  confirmationReminderDays: 3,
  inactiveReminderDays: 7,
  feedbackReminderDays: 14,
  maxReminders: 3,
};

export class ReminderService {
  /**
   * Initialize or get reminder configuration
   */
  static async getReminderConfig(): Promise<ReminderConfig> {
    try {
      const configRef = doc(
        db,
        'settings',
        REMINDER_CONFIG_DOC
      );
      const configDoc = await getDoc(configRef);

      if (!configDoc.exists()) {
        // Create default config
        await setDoc(configRef, DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
      }

      return { ...DEFAULT_CONFIG, ...configDoc.data() } as ReminderConfig;
    } catch (error) {
      console.error('Error getting reminder config:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Send reminder for unconfirmed connections
   * Called by Cloud Function periodically
   */
  static async sendConfirmationReminders(): Promise<number> {
    try {
      const config = await this.getReminderConfig();
      const cutoffTime = Date.now() - config.confirmationReminderDays * 24 * 60 * 60 * 1000;

      // Find connections awaiting confirmation
      const q = query(
        collection(db, 'connections'),
        where('status', '==', 'initiated'),
        where('initiatedAt', '<=', cutoffTime)
      );

      const snapshot = await getDocs(q);
      let remindersCount = 0;

      for (const docSnap of snapshot.docs) {
        const connection = docSnap.data() as Connection;

        // Check if we haven't exceeded max reminders
        if (connection.reminderCount >= config.maxReminders) {
          continue;
        }

        // Send reminder to tutor if not confirmed
        if (connection.confirmation.tutorConfirmed === 'pending') {
          await this.createReminder(
            connection.id,
            connection.tutorId,
            'confirmation',
            `Student is waiting for your confirmation on their tutoring request. Please review and respond.`
          );
          remindersCount++;
        }
      }

      return remindersCount;
    } catch (error) {
      console.error('Error sending confirmation reminders:', error);
      return 0;
    }
  }

  /**
   * Send reminders for inactive connections
   * Called by Cloud Function periodically
   */
  static async sendInactiveReminders(): Promise<number> {
    try {
      const config = await this.getReminderConfig();
      const cutoffTime = Date.now() - config.inactiveReminderDays * 24 * 60 * 60 * 1000;

      // Find inactive agreed connections
      const q = query(
        collection(db, 'connections'),
        where('status', '==', 'agreed'),
        where('lastActivityAt', '<=', cutoffTime)
      );

      const snapshot = await getDocs(q);
      let remindersCount = 0;

      for (const docSnap of snapshot.docs) {
        const connection = docSnap.data() as Connection;

        if (connection.reminderCount >= config.maxReminders) {
          continue;
        }

        // Send reminder to both parties to plan next steps
        await this.createReminder(
          connection.id,
          connection.studentId,
          'follow_up',
          `You agreed to start tutoring. Please schedule your first lesson or update the connection status.`
        );
        await this.createReminder(
          connection.id,
          connection.tutorId,
          'follow_up',
          `You agreed to tutor this student. Please schedule your first lesson or update the connection status.`
        );

        remindersCount += 2;
      }

      return remindersCount;
    } catch (error) {
      console.error('Error sending inactive reminders:', error);
      return 0;
    }
  }

  /**
   * Send feedback reminders for completed connections
   * Called by Cloud Function periodically
   */
  static async sendFeedbackReminders(): Promise<number> {
    try {
      const config = await this.getReminderConfig();
      const cutoffTime = Date.now() - config.feedbackReminderDays * 24 * 60 * 60 * 1000;

      // Find completed connections without feedback
      const q = query(
        collection(db, 'connections'),
        where('status', '==', 'completed'),
        where('completedAt', '<=', cutoffTime)
      );

      const snapshot = await getDocs(q);
      let remindersCount = 0;

      for (const docSnap of snapshot.docs) {
        const connection = docSnap.data() as Connection;

        // Send feedback reminder if no feedback yet
        if (!connection.studentFeedbackId) {
          await this.createReminder(
            connection.id,
            connection.studentId,
            'feedback',
            `Please share your feedback about your tutoring experience. This helps other students find great tutors.`
          );
          remindersCount++;
        }

        if (!connection.tutorFeedbackId) {
          await this.createReminder(
            connection.id,
            connection.tutorId,
            'feedback',
            `Please share your feedback about this student. Your insights help us improve the platform.`
          );
          remindersCount++;
        }
      }

      return remindersCount;
    } catch (error) {
      console.error('Error sending feedback reminders:', error);
      return 0;
    }
  }

  /**
   * Create a reminder record
   */
  static async createReminder(
    connectionId: string,
    reminderId: string,
    reminderType: 'confirmation' | 'follow_up' | 'feedback' | 'inactive',
    message: string
  ): Promise<Reminder> {
    try {
      const remindersRef = collection(db, REMINDERS_COLLECTION);
      const reminderDoc = doc(remindersRef);
      const now = Date.now();

      // Get connection for reference
      const connection = await ConnectionService.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const reminder: Reminder = {
        id: reminderDoc.id,
        connectionId,
        reminderId,
        reminderType,
        status: 'sent',
        sentAt: now,
        message,
      };

      await setDoc(reminderDoc, reminder);

      // Increment reminder count in connection
      const connRef = doc(db, 'connections', connectionId);
      await updateDoc(connRef, {
        reminderCount: connection.reminderCount + 1,
        lastReminderSentAt: now,
      });

      // In production, send actual notification
      // (Firebase Cloud Messaging, email, etc.)
      await this.sendNotification(reminderId, reminderType, message);

      return reminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  /**
   * Mark reminder as read
   */
  static async markReminderAsRead(reminderId: string): Promise<void> {
    try {
      const reminderRef = doc(db, REMINDERS_COLLECTION, reminderId);
      await updateDoc(reminderRef, {
        status: 'read',
        readAt: Date.now(),
      });
    } catch (error) {
      console.error('Error marking reminder as read:', error);
      throw error;
    }
  }

  /**
   * Mark reminder as dismissed
   */
  static async dismissReminder(reminderId: string): Promise<void> {
    try {
      const reminderRef = doc(db, REMINDERS_COLLECTION, reminderId);
      await updateDoc(reminderRef, {
        status: 'dismissed',
      });
    } catch (error) {
      console.error('Error dismissing reminder:', error);
      throw error;
    }
  }

  /**
   * Get unread reminders for a user
   */
  static async getUserReminders(userId: string): Promise<Reminder[]> {
    try {
      const q = query(
        collection(db, REMINDERS_COLLECTION),
        where('reminderId', '==', userId),
        where('status', 'in', ['sent', 'read']),
        orderBy('sentAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Reminder);
    } catch (error) {
      console.error('Error fetching user reminders:', error);
      throw error;
    }
  }

  /**
   * Send notification to user
   * This is a placeholder - implement with Firebase Cloud Messaging
   */
  private static async sendNotification(
    userId: string,
    reminderType: string,
    message: string
  ): Promise<void> {
    try {
      // TODO: Implement Firebase Cloud Messaging
      // Send push notification, email, or in-app notification
      console.log(`Reminder sent to ${userId}: ${message}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't throw - reminder is already created in Firestore
    }
  }
}
