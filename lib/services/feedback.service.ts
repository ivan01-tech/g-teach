/**
 * Feedback Service
 * Manages rating and review collection for connections
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  increment,
  average,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Feedback } from '@/lib/types';
import { ConnectionService } from './connection.service';

const FEEDBACK_COLLECTION = 'connectionFeedback';

export class FeedbackService {
  /**
   * Submit feedback for a connection
   */
  static async submitFeedback(
    connectionId: string,
    giverId: string,
    feedback: {
      rating: number; // 1-5
      ratingCategories?: {
        communication?: number;
        professionalism?: number;
        knowledgeability?: number;
        punctuality?: number;
        reliability?: number;
      };
      review: string;
      wouldRecommend: boolean;
    }
  ): Promise<Feedback> {
    try {
      // Validate rating
      if (feedback.rating < 1 || feedback.rating > 5 || !Number.isInteger(feedback.rating)) {
        throw new Error('Rating must be an integer between 1 and 5');
      }

      if (feedback.review.length > 500) {
        throw new Error('Review must be 500 characters or less');
      }

      // Get connection to determine roles
      const connection = await ConnectionService.getConnection(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      const isStudent = connection.studentId === giverId;
      const isTutor = connection.tutorId === giverId;
      const recipientId = isStudent ? connection.tutorId : connection.studentId;

      if (!isStudent && !isTutor) {
        throw new Error('User is not part of this connection');
      }

      const feedbackRef = collection(db, FEEDBACK_COLLECTION);
      const feedbackId = doc(feedbackRef).id;
      const now = Date.now();

      const newFeedback: Feedback = {
        id: feedbackId,
        connectionId,
        giverId,
        recipientId,
        giverType: isStudent ? 'student' : 'tutor',
        rating: feedback.rating,
        ratingCategories: feedback.ratingCategories,
        review: feedback.review,
        wouldRecommend: feedback.wouldRecommend,
        createdAt: now,
        moderationStatus: 'pending', // Reviews need moderation
      };

      const docRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
      await setDoc(docRef, newFeedback);

      // Update connection with feedback reference
      const feedbackKey = isStudent ? 'studentFeedbackId' : 'tutorFeedbackId';
      const connRef = doc(db, 'connections', connectionId);
      await updateDoc(connRef, {
        [feedbackKey]: feedbackId,
        lastActivityAt: now,
      });

      // Update tutor's metrics
      if (isTutor) {
        await this.updateRecipientMetrics(recipientId, 'asTutor', {
          rating: feedback.rating,
        });
      } else {
        await this.updateRecipientMetrics(recipientId, 'asTutor', {
          rating: feedback.rating,
        });
      }

      return newFeedback;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Get feedback for a user
   */
  static async getUserFeedbacks(
    userId: string,
    role: 'asTutor' | 'asStudent'
  ): Promise<Feedback[]> {
    try {
      const q = query(
        collection(db, FEEDBACK_COLLECTION),
        where('recipientId', '==', userId),
        where('moderationStatus', '==', 'approved')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Feedback);
    } catch (error) {
      console.error('Error fetching user feedbacks:', error);
      throw error;
    }
  }

  /**
   * Get specific feedback
   */
  static async getFeedback(feedbackId: string): Promise<Feedback | null> {
    try {
      const docRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as Feedback) : null;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  /**
   * Calculate average rating for user
   */
  static async getUserAverageRating(userId: string): Promise<number> {
    try {
      const feedbacks = await this.getUserFeedbacks(userId, 'asTutor');
      if (feedbacks.length === 0) return 0;

      const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
      return Math.round((totalRating / feedbacks.length) * 10) / 10; // Round to 1 decimal
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

  /**
   * Update metrics when feedback is received
   */
  private static async updateRecipientMetrics(
    userId: string,
    role: 'asTutor' | 'asStudent',
    feedbackData: { rating: number }
  ): Promise<void> {
    try {
      // Get existing metrics
      const metricsId = `${userId}_${role}`;
      const metricsRef = doc(db, 'connectionMetrics', metricsId);
      const metricsDoc = await getDoc(metricsRef);

      if (metricsDoc.exists()) {
        const metrics = metricsDoc.data();
        const currentAvg = metrics.averageRating || 0;
        const currentCount = metrics.totalReviews || 0;

        // Calculate new average
        const newAvg =
          (currentAvg * currentCount + feedbackData.rating) / (currentCount + 1);

        await updateDoc(metricsRef, {
          averageRating: Math.round(newAvg * 10) / 10,
          totalReviews: increment(1),
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error updating recipient metrics:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Flag feedback as inappropriate (for moderation)
   */
  static async flagFeedback(feedbackId: string, reason: string): Promise<void> {
    try {
      const feedbackRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);

      if (!feedbackDoc.exists()) {
        throw new Error('Feedback not found');
      }

      await updateDoc(feedbackRef, {
        flaggedAsInappropriate: true,
        moderationStatus: 'pending',
        updatedAt: Date.now(),
      });

      // In production, this should trigger a moderation queue
      console.log(`Feedback ${feedbackId} flagged for review: ${reason}`);
    } catch (error) {
      console.error('Error flagging feedback:', error);
      throw error;
    }
  }

  /**
   * Approve feedback (admin function)
   */
  static async approveFeedback(feedbackId: string): Promise<void> {
    try {
      const feedbackRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
      await updateDoc(feedbackRef, {
        moderationStatus: 'approved',
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error approving feedback:', error);
      throw error;
    }
  }

  /**
   * Reject feedback (admin function)
   */
  static async rejectFeedback(feedbackId: string): Promise<void> {
    try {
      const feedbackRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
      await updateDoc(feedbackRef, {
        moderationStatus: 'rejected',
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error rejecting feedback:', error);
      throw error;
    }
  }
}
