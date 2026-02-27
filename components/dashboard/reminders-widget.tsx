'use client';

import { useReminders } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface RemindersWidgetProps {
  maxReminders?: number;
}

export function RemindersWidget({ maxReminders = 5 }: RemindersWidgetProps) {
  const { user } = useAuth();
  const { reminders, unreadCount, loading, markAsRead, dismiss } = useReminders(
    user?.uid||""
  );

  const displayReminders = reminders.slice(0, maxReminders);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>Stay updated with your connections</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-blue-100 text-blue-800">{unreadCount} New</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-2 mb-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          displayReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                reminder.status === 'sent'
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="mt-1">
                {reminder.status === 'sent' ? (
                  <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{reminder.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(reminder.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                {reminder.status === 'sent' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(reminder.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Done
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismiss(reminder.id)}
                  className="h-6 px-2 text-xs hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}

        {reminders.length > maxReminders && (
          <Button variant="outline" className="w-full text-xs" size="sm">
            View all {reminders.length} notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
