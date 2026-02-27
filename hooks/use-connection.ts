/**
 * useConnection Hook
 * Provides easy access to connection lifecycle operations
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Connection, ConnectionMetrics } from '@/lib/types';
import { ConnectionService } from '@/lib/services/connection.service';
import { FeedbackService } from '@/lib/services/feedback.service';
import { ReminderService } from '@/lib/services/reminder.service';

interface UseConnectionOptions {
  userId: string;
  role?: 'student' | 'tutor' | 'both';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useConnection({
  userId,
  role = 'both',
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseConnectionOptions) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's connections
  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ConnectionService.getUserConnections(userId, role);
      setConnections(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  // Auto-refresh connections
  useEffect(() => {
    fetchConnections();

    if (autoRefresh) {
      const interval = setInterval(fetchConnections, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchConnections, autoRefresh, refreshInterval]);

// 
  useEffect(() => {
    const unsubscribe = ConnectionService.observeUserConnections(userId, (connections) => {
      setConnections(connections);
    });
    return unsubscribe;
  }, [userId]);

  // Initiate new connection
  const initiateConnection = useCallback(
    async (tutorId: string, options?: { subject?: string; notes?: string; proposedLessonType?: string }) => {
      try {
        const conn = await ConnectionService.initiateConnection(userId, tutorId, options);
        setConnections((prev) => [conn, ...prev]);
        return conn;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to initiate connection');
      }
    },
    [userId]
  );

  // Confirm/decline connection
  const confirmConnection = useCallback(
    async (connectionId: string, confirmed: boolean) => {
      try {
        await ConnectionService.confirmConnection(connectionId, userId, confirmed);
        await fetchConnections();
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to confirm connection');
      }
    },
    [userId, fetchConnections]
  );

  // Update connection status
  const updateStatus = useCallback(
    async (connectionId: string, newStatus: Connection['status']) => {
      try {
        await ConnectionService.updateConnectionStatus(connectionId, newStatus);
        await fetchConnections();
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to update status');
      }
    },
    [fetchConnections]
  );

  // Get single connection
  const getConnection = useCallback(async (connectionId: string) => {
    try {
      return await ConnectionService.getConnection(connectionId);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch connection');
    }
  }, []);

  // Get active connections
  const getActiveConnections = useCallback(
    () => connections.filter((c) => ['agreed', 'collaboration_started'].includes(c.status)),
    [connections]
  );

  // Get pending connections (awaiting confirmation)
  const getPendingConnections = useCallback(
    () => connections.filter((c) => c.status === 'initiated'),
    [connections]
  );

  return {
    // State
    connections,
    loading,
    error,

    // Methods
    fetchConnections,
    initiateConnection,
    confirmConnection,
    updateStatus,
    getConnection,

    // Helpers
    getActiveConnections,
    getPendingConnections,
    connectionCount: connections.length,
    activeCount: getActiveConnections().length,
    pendingCount: getPendingConnections().length,
  };
}

/**
 * useTutorMetrics Hook
 * Get performance metrics for a tutor
 */
export function useTutorMetrics(tutorId: string) {
  const [metrics, setMetrics] = useState<ConnectionMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ConnectionService.getTutorMetrics(tutorId);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const calculateScores = useCallback(() => {
    if (!metrics) return null;

    const successRate = metrics.totalConnections > 0
      ? Math.round((metrics.successfulConnections / metrics.totalConnections) * 100)
      : 0;

    const reliabilityScore = Math.round((1 - metrics.cancellationRate) * 100);

    return {
      overallScore: Math.round((successRate + (metrics.averageRating / 5) * 100 + reliabilityScore) / 3),
      successRate,
      reliabilityScore,
      ratingScore: Math.round((metrics.averageRating / 5) * 100),
    };
  }, [metrics]);

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
    scores: calculateScores(),
  };
}

/**
 * useFeedback Hook
 * Manage feedback operations
 */
export function useFeedback(userId: string) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FeedbackService.getUserFeedbacks(userId, 'asTutor');
      setFeedbacks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedbacks'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const submitFeedback = useCallback(
    async (connectionId: string, feedbackData: any) => {
      try {
        const feedback = await FeedbackService.submitFeedback(
          connectionId,
          userId,
          feedbackData
        );
        // Refresh feedbacks
        await fetchFeedbacks();
        return feedback;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to submit feedback');
      }
    },
    [userId, fetchFeedbacks]
  );

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return {
    feedbacks,
    loading,
    error,
    submitFeedback,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: feedbacks.length,
  };
}

/**
 * useReminders Hook
 * Manage reminders for a user
 */
export function useReminders(userId: string) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReminderService.getUserReminders(userId);
      setReminders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reminders'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (reminderId: string) => {
    try {
      await ReminderService.markReminderAsRead(reminderId);
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, status: 'read' } : r))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark reminder as read');
    }
  }, []);

  const dismiss = useCallback(async (reminderId: string) => {
    try {
      await ReminderService.dismissReminder(reminderId);
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, status: 'dismissed' } : r))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to dismiss reminder');
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const unreadCount = reminders.filter((r) => r.status === 'sent').length;

  return {
    reminders,
    loading,
    error,
    unreadCount,
    fetchReminders,
    markAsRead,
    dismiss,
  };
}
