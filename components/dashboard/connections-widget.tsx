'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConnection, useReminders } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Clock, MessageSquare, AlertCircle, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ConnectionsWidgetProps {
  role?: 'tutor' | 'student';
}

export function ConnectionsWidget({ role = 'tutor' }: ConnectionsWidgetProps) {
  const { user } = useAuth();
  const { connections, activeCount, pendingCount, loading } = useConnection({
    userId: user?.uid||"",
    role: role,
    autoRefresh: true,
    refreshInterval: 60000,
  });
  const { reminders, unreadCount } = useReminders(user?.uid||"");

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          {/* Recent Pending Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingConnections = connections.filter((c) => c.status === 'initiated');
  const activeConnections = connections.filter(
    (c) => c.status === 'agreed' || c.status === 'collaboration_started'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connections</CardTitle>
            <CardDescription>
              {role === 'tutor' ? 'Student requests & collaborations' : 'Tutors & collaborations'}
            </CardDescription>
          </div>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reminders Alert */}
        {unreadCount > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">{unreadCount} pending reminders</p>
              <p className="text-xs opacity-80">Check your connection updates</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-xs text-muted-foreground mb-1">Pending</div>
            <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
            {pendingConnections.length > 0 && (
              <p className="text-xs text-blue-600/80 mt-1">
                {role === 'tutor' ? 'awaiting your confirmation' : 'awaiting response'}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-xs text-muted-foreground mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            {activeConnections.length > 0 && (
              <p className="text-xs text-green-600/80 mt-1">in progress</p>
            )}
          </div>
        </div>

        {/* Quick View */}
        {pendingConnections.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">RECENT PENDING</p>
            {pendingConnections.slice(0, 2).map((conn) => (
              <div key={conn.id} className="flex items-center justify-between rounded border border-border p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {role === 'tutor' ? conn.studentId : conn.tutorId || 'Tutor'}
                  </p>
                  <p className="text-xs text-muted-foreground">{conn.subject}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* No Connections */}
        {connections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="rounded-full bg-muted p-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No connections yet</p>
          </div>
        )}

        {/* View All Button */}
        <Button asChild className="w-full" variant="outline">
          <Link href={`/${role === 'tutor' ? 'betreuer' : 'student'}/connections`}>
            View All Connections
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
