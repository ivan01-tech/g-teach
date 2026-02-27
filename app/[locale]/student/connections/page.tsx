'use client';

import { useState } from 'react';
import { useConnection, useReminders } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import { ConnectionCard } from '@/components/connections/connection-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';

export default function StudentConnectionsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('pending');

  const {
    connections,
    pendingCount,
    activeCount,
    loading,
    error,
  } = useConnection({
    userId: user?.uid||"",
    role: 'student',
    autoRefresh: true,
    refreshInterval: 30000,
  });

  const { reminders, unreadCount, markAsRead } = useReminders(user?.uid||"");

  // Filter connections by status
  const pendingConnections = connections.filter((c) => c.status === 'initiated');
  const awaitingTutorConnections = connections.filter(
    (c) => c.status === 'in_discussion' && c.confirmation.tutorConfirmed === 'pending'
  );
  const activeConnections = connections.filter(
    (c) => c.status === 'agreed' || c.status === 'collaboration_started'
  );
  const completedConnections = connections.filter(
    (c) => c.status === 'completed' || c.status === 'cancelled'
  );

  if (loading && connections.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Tutors</h1>
        <p className="text-muted-foreground">Manage your tutor connections and learning journey</p>
      </div>

      {/* Reminders Alert */}
      {unreadCount > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <p className="font-medium">You have {unreadCount} notifications</p>
            <p className="text-sm mt-1">
              Tutors may have responded to your requests or there are important updates
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Pending
              </Badge>
              <p className="text-3xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Awaiting tutor response</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Active
              </Badge>
              <p className="text-3xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Learning now</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Completed
              </Badge>
              <p className="text-3xl font-bold">{completedConnections.length}</p>
              <p className="text-sm text-muted-foreground">Total tutoring sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action for New Connection */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="font-medium">Looking for a tutor?</p>
            <p className="text-sm text-muted-foreground">Browse available tutors and send connection requests</p>
          </div>
          <Button asChild>
            <Link href="/tutors" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Find Tutor
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            <Clock className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Pending</span>
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="waiting" className="text-xs sm:text-sm">
            <AlertCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Waiting</span>
            {awaitingTutorConnections.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {awaitingTutorConnections.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            <MessageSquare className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Active</span>
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">
            <CheckCircle2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        {/* Pending - You initiated, awaiting confirmation */}
        <TabsContent value="pending" className="space-y-4">
          {pendingConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No pending connection requests</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/tutors">Find a tutor to get started</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            pendingConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid || ''}
                role="student"
              />
            ))
          )}
        </TabsContent>

        {/* Waiting - Tutor hasn't confirmed yet */}
        <TabsContent value="waiting" className="space-y-4">
          {awaitingTutorConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No tutors waiting for confirmation</p>
              </CardContent>
            </Card>
          ) : (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                These tutors are reviewing your request. You'll be notified once they respond.
              </AlertDescription>
            </Alert>
          )}
          {awaitingTutorConnections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              currentUserId={user?.uid || ''}
              role="student"
            />
          ))}
        </TabsContent>

        {/* Active Connections */}
        <TabsContent value="active" className="space-y-4">
          {activeConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No active tutoring sessions</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Once a tutor confirms, you can start tutoring together
                </p>
              </CardContent>
            </Card>
          ) : (
            activeConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid || ''}
                role="student"
              />
            ))
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          {completedConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No completed tutoring sessions yet</p>
              </CardContent>
            </Card>
          ) : (
            completedConnections.map((conn) => (
              <div key={conn.id} className="space-y-2">
                <ConnectionCard
                  connection={conn}
                  currentUserId={user?.uid || ''}
                  role="student"
                />
                {conn.status === 'completed' && !conn.studentFeedbackId && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      <div className="flex items-center justify-between">
                        <p>Share your experience with this tutor</p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-amber-200 hover:bg-amber-100"
                        >
                          <Link href={`/student/connections/${conn.id}/feedback`}>
                            Leave Feedback
                          </Link>
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">How tutoring connections work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. Find & Connect</p>
            <p>Browse tutors and send a connection request with your learning goals.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. Tutor Responds</p>
            <p>The tutor reviews your request and confirms if they want to work with you.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. Start Learning</p>
            <p>Once confirmed, you can chat, schedule lessons, and start learning together.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. Share Feedback</p>
            <p>After completing your tutoring, share your experience to help other students.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
