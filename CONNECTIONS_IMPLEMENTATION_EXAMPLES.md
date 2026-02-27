/**
 * Connection System - Example Implementation & Integration Guide
 * Shows how to use the connection lifecycle system in your pages and components
 */

// ============================================================================
// EXAMPLE 1: Initiate Connection from Tutor Profile
// ============================================================================

// components/tutor/tutor-contact-card.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useConnection } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';

export function TutorContactCard({ tutorId, tutorName }) {
  const { user } = useAuth();
  const { initiateConnection, loading, error } = useConnection({ userId: user?.uid });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleContact = async () => {
    try {
      await initiateConnection(tutorId, {
        notes: message,
        subject: 'German Language Lessons',
      });
      setOpen(false);
      // Show success toast
    } catch (err) {
      // Show error toast
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Contact Tutor</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {tutorName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Tell the tutor about your goals and experience level..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleContact} disabled={loading || !message}>
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================================
// EXAMPLE 2: View Pending Connections (for Tutor)
// ============================================================================

// app/[locale]/tutor/connections/page.tsx
'use client';

import { useConnection, useReminders } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import { ConnectionCard } from '@/components/connections/connection-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TutorConnectionsPage() {
  const { user } = useAuth();
  const { connections, pendingCount, getActiveConnections, getActive Connections } = useConnection({
    userId: user?.uid,
    role: 'tutor',
    autoRefresh: true,
  });
  const { reminders, unreadCount, markAsRead } = useReminders(user?.uid);

  const pendingConnections = connections.filter((c) => c.status === 'initiated');
  const activeConnections = getActiveConnections();
  const completedConnections = connections.filter(
    (c) => c.status === 'completed' || c.status === 'cancelled'
  );

  return (
    <div className="container py-8">
      {/* Reminders Section */}
      {reminders.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium mb-2">
            You have {unreadCount} unread reminders
          </h3>
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex gap-2 items-start">
                <p className="text-sm flex-1">{reminder.message}</p>
                <button
                  onClick={() => markAsRead(reminder.id)}
                  className="text-xs underline whitespace-nowrap"
                >
                  Mark read
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="pending">
        {/* Pending Connections */}
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeConnections.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completedConnections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingConnections.length === 0 ? (
            <p className="text-muted-foreground">No pending requests</p>
          ) : (
            pendingConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid}
                studentName="Student"
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeConnections.length === 0 ? (
            <p className="text-muted-foreground">No active collaborations</p>
          ) : (
            activeConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid}
                studentName="Student"
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {completedConnections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              currentUserId={user?.uid}
              studentName="Student"
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Display Tutor Metrics on Profile
// ============================================================================

// components/tutor/tutor-profile-metrics.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useTutorMetrics } from '@/hooks/use-connection';

export function TutorProfileMetrics({ tutorId }) {
  const { metrics, scores, loading } = useTutorMetrics(tutorId);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      {scores && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tutor Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{scores.overallScore}</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Success Rate: {scores.successRate}%</p>
                <p>Reliability: {scores.reliabilityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rating */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalReviews} reviews
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Connections */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="default">Active</Badge>
              <p className="text-2xl font-bold">{metrics.activeConnections}</p>
              <p className="text-xs text-muted-foreground">students</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Connections */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{metrics.totalConnections}</p>
              <p className="text-xs text-muted-foreground">connections</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Response</p>
              <p className="text-2xl font-bold">&lt;{metrics.responseTimeHours}h</p>
              <p className="text-xs text-muted-foreground">average</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Feedback After Completion
// ============================================================================

// app/[locale]/student/connections/[connectionId]/feedback/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FeedbackForm } from '@/components/connections/feedback-form';
import { ConnectionService } from '@/lib/services/connection.service';
import { useAuth } from '@/hooks/use-auth';

export default function FeedbackPage() {
  const params = useParams();
  const { user } = useAuth();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnection = async () => {
      const conn = await ConnectionService.getConnection(params.connectionId as string);
      setConnection(conn);
      setLoading(false);
    };
    fetchConnection();
  }, [params.connectionId]);

  if (loading) return <div>Loading...</div>;
  if (!connection) return <div>Connection not found</div>;

  return (
    <div className="container max-w-2xl py-8">
      <FeedbackForm
        connectionId={connection.id}
        recipientName="Your Tutor"
        recipientType="tutor"
        onSubmitSuccess={() => {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Integration with Chat
// ============================================================================

// components/chat/chat-window-enhanced.tsx
import { useEffect } from 'react';
import { useConnection } from '@/hooks/use-connection';

export function ChatWindowEnhanced({ connectionId, currentUserId }) {
  const { getConnection } = useConnection({ userId: currentUserId });

  const handleSendMessage = async (message) => {
    // Send message to Firebase realtime DB / Firestore
    // ...
    
    // Update connection metrics
    const conn = await getConnection(connectionId);
    if (conn?.status === 'initiated') {
      // Auto-transition to in_discussion
      await ConnectionService.updateConnectionStatus(connectionId, 'in_discussion');
    }
  };

  return (
    // ... chat UI ...
  );
}

// ============================================================================
// EXAMPLE 6: Dashboard Widget - Active Connections Summary
// ============================================================================

// components/dashboard/active-connections-widget.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useConnection } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export function ActiveConnectionsWidget() {
  const { user } = useAuth();
  const { connections, activeCount, pendingCount } = useConnection({
    userId: user?.uid,
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href="/connections">View All Connections</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NOTES ON IMPLEMENTATION
// ============================================================================

/**
 * Key Integration Points:
 * 
 * 1. Chat Integration:
 *    - When message sent, increment connection.messageCount
 *    - When first message received, transition to 'in_discussion'
 *    - Update lastActivityAt timestamp
 * 
 * 2. Tutor Profile:
 *    - Display TutorProfileMetrics component
 *    - Show average rating, total reviews, success rate
 *    - Add "Contact Tutor" button that triggers initiateConnection
 * 
 * 3. Dashboard:
 *    - Add ActiveConnectionsWidget to show overview
 *    - Show reminder notifications
 *    - Link to full connections page
 * 
 * 4. Lesson Booking/Scheduling:
 *    - Once agreed, allow scheduling of lessons
 *    - Update connection status to 'collaboration_started' when first lesson booked
 * 
 * 5. Post-Tutoring:
 *    - Show FeedbackForm when connection is 'completed'
 *    - Block feedback submission if still in progress
 * 
 * 6. Notifications:
 *    - Use useReminders hook to show pending reminders
 *    - Mark as read when user views them
 *    - Show badge with unread count
 */
