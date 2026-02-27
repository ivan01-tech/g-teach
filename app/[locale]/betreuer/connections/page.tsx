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
import { AlertCircle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function TutorConnectionsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('pending');

  const {
    connections,
    pendingCount,
    activeCount,
    loading,
    error,
  } = useConnection({
    userId: user?.uid || '',
    role: 'tutor',
    autoRefresh: true,
    refreshInterval: 30000,
  });

  const { reminders, unreadCount, markAsRead } = useReminders(user?.uid||"");

  // Filter connections by status
  const pendingConnections = connections.filter((c) => c.status === 'initiated');
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
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground">Manage your student connections and collaborations</p>
      </div>

      {/* Reminders Alert */}
      {unreadCount > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <p className="font-medium">You have {unreadCount} unread reminders</p>
            <p className="text-sm mt-1">Check your connection updates and take action where needed.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Reminders List */}
      {reminders.length > 0 && selectedTab === 'pending' && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Reminders ({unreadCount} unread)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-start justify-between p-2 rounded bg-white/50 border border-blue-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reminder.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(reminder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(reminder.id)}
                    className="ml-2"
                  >
                    Done
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Pending
              </Badge>
              <p className="text-3xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
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
              <p className="text-sm text-muted-foreground">In progress</p>
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
              <p className="text-sm text-muted-foreground">Total collaborations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Active</span>
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        {/* Pending Connections */}
        <TabsContent value="pending" className="space-y-4">
          {pendingConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No pending connection requests</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Students will send you requests when they want to work together
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid || ''}
                role="tutor"
              />
            ))
          )}
        </TabsContent>

        {/* Active Connections */}
        <TabsContent value="active" className="space-y-4">
          {activeConnections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">No active collaborations</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Accept pending requests to start tutoring
                </p>
              </CardContent>
            </Card>
          ) : (
            activeConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid || ''}
                role="tutor"
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
                <p className="text-center text-muted-foreground">No completed collaborations yet</p>
              </CardContent>
            </Card>
          ) : (
            completedConnections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                currentUserId={user?.uid || ''}
                role="tutor"
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">How connections work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Pending:</strong> Students have sent you connection requests. Review their profiles and
            confirm if you want to collaborate.
          </p>
          <p>
            <strong>2. Active:</strong> You and the student have agreed to work together. Start tutoring and
            communicate through the chat.
          </p>
          <p>
            <strong>3. Completed:</strong> The collaboration is finished. Students will leave feedback about
            their experience working with you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
