/**
 * Connection Service
 * Handles the lifecycle management of connections between students and tutors
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
  limit,
  getDocs,
  onSnapshot,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Connection, 
  ConnectionStatus, 
  ConfirmationStatus,
  ConnectionMetrics 
} from '@/lib/types';
import { firebaseCollections } from '../collections';

const CONNECTIONS_COLLECTION = 'connections';
const METRICS_COLLECTION = 'connectionMetrics';

export class ConnectionService {
  /**
   * Create a new connection when student contacts tutor
   */
  static async initiateConnection(
    studentId: string,
    tutorId: string,
    options?: {
      subject?: string;
      proposedLessonType?: string;
      notes?: string;
    }
  ): Promise<Connection> {
    try {
      const connectionsRef = collection(db, CONNECTIONS_COLLECTION);
      const now = Date.now();

      const newConnection: Connection = {
        id: doc(connectionsRef).id,
        studentId,
        tutorId,
        status: 'initiated',
        confirmation: {
          studentConfirmed: 'confirmed', // Initiator is confirmed
          tutorConfirmed: 'pending',
        },
        studentConfirmedAt: now,
        initiatedAt: now,
        lastActivityAt: now,
        reminderCount: 0,
        messageCount: 0,
        subject: options?.subject,
        proposedLessonType: options?.proposedLessonType,
        notes: options?.notes,
      };

      const docRef = doc(db, CONNECTIONS_COLLECTION, newConnection.id);
      await setDoc(docRef, newConnection);

      // Update both users' recent connections
      await this.addConnectionToUser(studentId, newConnection.id);
      await this.addConnectionToUser(tutorId, newConnection.id);

      // Trigger metrics update
      await this.updateConnectionMetrics(tutorId, 'asTutor', {
        totalConnections: increment(1),
      });

      return newConnection;
    } catch (error) {
      console.error('Error initiating connection:', error);
      throw error;
    }
  }

  /**
   * Update connection confirmation status
   */
  static async confirmConnection(
    connectionId: string,
    userId: string,
    confirmed: boolean
  ): Promise<void> {
    try {
      const connRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const connDoc = await getDoc(connRef);

      if (!connDoc.exists()) {
        throw new Error('Connection not found');
      }

      const connection = connDoc.data() as Connection;
      const isStudent = connection.studentId === userId;
      const isTutor = connection.tutorId === userId;

      if (!isStudent && !isTutor) {
        throw new Error('User is not part of this connection');
      }

      const now = Date.now();
      const updateData: any = {};

      if (isStudent) {
        updateData['confirmation.studentConfirmed'] = confirmed ? 'confirmed' : 'declined';
        if (confirmed) updateData['studentConfirmedAt'] = now;
      } else {
        updateData['confirmation.tutorConfirmed'] = confirmed ? 'confirmed' : 'declined';
        if (confirmed) updateData['tutorConfirmedAt'] = now;
      }

      updateData['lastActivityAt'] = now;

      // If one party declines, mark as cancelled
      if (!confirmed) {
        updateData['status'] = 'cancelled';
        updateData['cancelledAt'] = now;
        await this.updateConnectionMetrics(connection.tutorId, 'asTutor', {
          totalConnections: increment(-1),
        });
      }
      // If both confirmed, update to agreed
      else if (
        (isStudent && connection.confirmation.tutorConfirmed === 'confirmed') ||
        (isTutor && connection.confirmation.studentConfirmed === 'confirmed')
      ) {
        updateData['status'] = 'agreed';
        updateData['agreedAt'] = now;
        await this.updateConnectionMetrics(connection.tutorId, 'asTutor', {
          successfulConnections: increment(1),
          activeConnections: increment(1),
        });
      }

      await updateDoc(connRef, updateData);
    } catch (error) {
      console.error('Error confirming connection:', error);
      throw error;
    }
  }

  /**
   * Transition connection to next status
   */
  static async updateConnectionStatus(
    connectionId: string,
    newStatus: ConnectionStatus
  ): Promise<void> {
    try {
      const connRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const now = Date.now();
      const updateData: any = {
        status: newStatus,
        lastActivityAt: now,
      };

      // Add timestamp for status transitions
      if (newStatus === 'in_discussion') {
        updateData['discussionStartedAt'] = now;
      } else if (newStatus === 'collaboration_started') {
        updateData['collaborationStartedAt'] = now;
      } else if (newStatus === 'completed') {
        updateData['completedAt'] = now;
      } else if (newStatus === 'cancelled') {
        updateData['cancelledAt'] = now;
      }

      await updateDoc(connRef, updateData);
    } catch (error) {
      console.error('Error updating connection status:', error);
      throw error;
    }
  }

  /**
   * Get user's connections with filters
   */
  /**
   * Get user's connections with filters (one-time fetch)
   */
  static async getUserConnections(
    userId: string,
    role: 'student' | 'tutor' | 'both' = 'both',
    statusFilter?: ConnectionStatus | ConnectionStatus[]
  ): Promise<Connection[]> {
    try {
      let q: any;

      if (role === 'student') {
        q = query(
          collection(db, CONNECTIONS_COLLECTION),
          where('studentId', '==', userId),
          // orderBy('lastActivityAt', 'desc')
        );
      } else if (role === 'tutor') {
        q = query(
          collection(db, CONNECTIONS_COLLECTION),
          where('tutorId', '==', userId),
          // orderBy('lastActivityAt', 'desc')
        );
      } else {
        // Get connections where user is either student or tutor
        // Note: Firestore limitations require two separate queries
        const asStudent = await getDocs(
          query(
            collection(db, CONNECTIONS_COLLECTION),
            where('studentId', '==', userId),
            orderBy('lastActivityAt', 'desc')
          )
        );
        const asTutor = await getDocs(
          query(
            collection(db, CONNECTIONS_COLLECTION),
            where('tutorId', '==', userId),
            orderBy('lastActivityAt', 'desc')
          )
        );
        const combined = [
          ...asStudent.docs.map(doc => doc.data() as Connection),
          ...asTutor.docs.map(doc => doc.data() as Connection),
        ];
        return this.filterByStatus(combined, statusFilter);
      }

      const snapshot = await getDocs(q);
      const connections = snapshot.docs.map(doc => doc.data() as Connection);

      return this.filterByStatus(connections, statusFilter);
    } catch (error) {
      console.error('Error fetching user connections:', error);
      throw error;
    }
  }

  /**
   * Listen for realtime updates to a user's connections.
   * Returns an unsubscribe function.
   */
  static observeUserConnections(
    userId: string,
    callback: (connections: Connection[]) => void,
    role: 'student' | 'tutor' | 'both' = 'both',
    statusFilter?: ConnectionStatus | ConnectionStatus[]
  ): () => void {
    // build the listener(s) similarly to above but using onSnapshot
    const unsubscribeFns: (() => void)[] = [];

    const processSnapshot = (snapshot: any) => {
      const conns = snapshot.docs.map((doc: any) => doc.data() as Connection);
      callback(this.filterByStatus(conns, statusFilter));
    };

    if (role === 'student' || role === 'both') {
      const q = query(
        collection(db, CONNECTIONS_COLLECTION),
        where('studentId', '==', userId),
        // orderBy('lastActivityAt', 'desc')
      );
      const unsub = onSnapshot(q, processSnapshot, (err) => {
        console.error('Realtime error fetching student connections', err);
      });
      unsubscribeFns.push(unsub);
    }

    if (role === 'tutor' || role === 'both') {
      const q = query(
        collection(db, CONNECTIONS_COLLECTION),
        where('tutorId', '==', userId),
        // orderBy('lastActivityAt', 'desc')
      );
      const unsub = onSnapshot(q, processSnapshot, (err) => {
        console.error('Realtime error fetching tutor connections', err);
      });
      unsubscribeFns.push(unsub);
    }

    return () => {
      unsubscribeFns.forEach((u) => u());
    };
  }

  /**
   * Get specific connection
   */
  static async getConnection(connectionId: string): Promise<Connection | null> {
    try {
      const docRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as Connection) : null;
    } catch (error) {
      console.error('Error fetching connection:', error);
      throw error;
    }
  }

  /**
   * Get tutor's connection metrics
   */
  static async getTutorMetrics(tutorId: string): Promise<ConnectionMetrics | null> {
    try {
      const metricsRef = doc(db, METRICS_COLLECTION, tutorId);
      const metricsSnap = await getDoc(metricsRef);
      return metricsSnap.exists() ? (metricsSnap.data() as ConnectionMetrics) : null;
    } catch (error) {
      console.error('Error fetching tutor metrics:', error);
      throw error;
    }
  }

  /**
   * Update connection metrics
   */
  static async updateConnectionMetrics(
    userId: string,
    role: 'asTutor' | 'asStudent',
    updates: any
  ): Promise<void> {
    try {
      const metricsRef = doc(db, METRICS_COLLECTION, `${userId}_${role}`);
      const metricsDoc = await getDoc(metricsRef);

      if (!metricsDoc.exists()) {
        // Create new metrics document
        await setDoc(metricsRef, {
          ...Object.keys(updates).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {} as any),
          ...updates,
          userId,
          role,
          updatedAt: Date.now(),
        });
      } else {
        await updateDoc(metricsRef, {
          ...updates,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate tutor reliability score
   */
  static async calculateTutorScore(tutorId: string): Promise<number> {
    try {
      const metrics = await this.getTutorMetrics(tutorId);
      if (!metrics) return 0;

      // Score based on: success rate, rating, reliability
      const successRate =
        metrics.totalConnections > 0
          ? (metrics.successfulConnections / metrics.totalConnections) * 100
          : 0;
      const ratingScore = (metrics.averageRating / 5) * 100;
      const reliabilityScore = (1 - metrics.cancellationRate) * 100;

      return Math.round((successRate + ratingScore + reliabilityScore) / 3);
    } catch (error) {
      console.error('Error calculating tutor score:', error);
      return 0;
    }
  }

  /**
   * Helper: Filter connections by status
   */
  private static filterByStatus(
    connections: Connection[],
    statusFilter?: ConnectionStatus | ConnectionStatus[]
  ): Connection[] {
    if (!statusFilter) return connections;

    const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
    return connections.filter(conn => statuses.includes(conn.status));
  }

  /**
   * Helper: Add connection to user's recent connections
   */
  private static async addConnectionToUser(
    userId: string,
    connectionId: string
  ): Promise<void> {
    try {
      const userRef = doc(db,firebaseCollections.users, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentConnections = userDoc.data()?.recentConnections || [];
        const updated = [
          connectionId,
          ...currentConnections.filter((id: string) => id !== connectionId),
        ].slice(0, 5); // Keep only last 5

        await updateDoc(userRef, {
          recentConnections: updated,
          lastActivityAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error updating user connections:', error);
      // Don't throw - this is not critical
    }
  }
}
