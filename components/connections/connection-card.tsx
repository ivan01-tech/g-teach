/**
 * Connection Card Component
 * Displays a single connection with status, actions, and timeline
 */

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Clock, MessageSquare, Star } from 'lucide-react';
import { Connection, ConnectionStatus } from '@/lib/types';
import { ConnectionService } from '@/lib/services/connection.service';
import { useToast } from '@/hooks/use-toast';

interface ConnectionCardProps {
  connection: Connection;
  currentUserId: string;
  tutorName?: string;
  studentName?: string;
  role?: 'tutor' | 'student';
  onStatusChange?: (connection: Connection) => void;
  onConfirm?: () => Promise<void>;
  onDecline?: () => Promise<void>;
  onStartTutoring?: () => Promise<void>;
  onMarkComplete?: () => Promise<void>;
}

export function ConnectionCard({
  connection,
  currentUserId,
  tutorName = 'Tutor',
  studentName = 'Student',
  role,
  onStatusChange,
  onConfirm,
  onDecline,
  onStartTutoring,
  onMarkComplete,
}: ConnectionCardProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isStudent = connection.studentId === currentUserId;
  const isTutor = connection.tutorId === currentUserId;
  const otherPartyName = isStudent ? tutorName : studentName;

  const getStatusBadge = (status: ConnectionStatus) => {
    const statusConfig: Record<ConnectionStatus, { color: string; icon: any }> = {
      initiated: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_discussion: { color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
      agreed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      collaboration_started: { color: 'bg-purple-100 text-purple-800', icon: Star },
      completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge className={config.color} variant="outline">
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleConfirm = async (confirm: boolean) => {
    try {
      setLoading(true);
      if (confirm && onConfirm) {
        await onConfirm();
      } else if (!confirm && onDecline) {
        await onDecline();
      } else {
        await ConnectionService.confirmConnection(connection.id, currentUserId, confirm);
      }
      toast({
        title: confirm ? 'Confirmed' : 'Declined',
        description: confirm
          ? 'You confirmed the tutoring agreement'
          : 'You declined the tutoring request',
      });
      onStatusChange?.(connection);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update connection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ConnectionStatus) => {
    try {
      setLoading(true);
      if (newStatus === 'collaboration_started' && onStartTutoring) {
        await onStartTutoring();
      } else if (newStatus === 'completed' && onMarkComplete) {
        await onMarkComplete();
      } else {
        await ConnectionService.updateConnectionStatus(connection.id, newStatus);
      }
      toast({
        title: 'Status Updated',
        description: `Connection status updated to ${newStatus.replace(/_/g, ' ')}`,
      });
      onStatusChange?.(connection);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = () => {
    // Navigate to chat/message view
    window.location.href = `/chat/${connection.id}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{otherPartyName}</CardTitle>
            <CardDescription>
              Connected {format(new Date(connection.initiatedAt), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          {getStatusBadge(connection.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Details */}
        {connection.subject && (
          <div className="text-sm">
            <span className="font-medium">Subject:</span> {connection.subject}
          </div>
        )}

        {connection.proposedLessonType && (
          <div className="text-sm">
            <span className="font-medium">Lesson Type:</span> {connection.proposedLessonType}
          </div>
        )}

        {connection.notes && (
          <div className="text-sm border-l-2 border-gray-300 pl-3">
            <span className="font-medium block mb-1">Initial Message:</span>
            <p className="text-gray-600">{connection.notes}</p>
          </div>
        )}

        {/* Confirmation Status */}
        {connection.status === 'initiated' && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <div className="text-sm font-medium mb-2">Confirmations</div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">Student:</span>
                <Badge variant={connection.confirmation.studentConfirmed === 'confirmed' ? 'default' : 'secondary'}>
                  {connection.confirmation.studentConfirmed}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Tutor:</span>
                <Badge variant={connection.confirmation.tutorConfirmed === 'confirmed' ? 'default' : 'secondary'}>
                  {connection.confirmation.tutorConfirmed}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Activity Stats */}
        <div className="pt-2 border-t">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">{connection.messageCount}</span> messages
            </div>
            <div>
              Last activity: {format(new Date(connection.lastActivityAt), 'MMM d')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {/* Message Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleMessageClick}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>

          {/* Confirmation Actions (for initiated status) */}
          {connection.status === 'initiated' && !isStudent && connection.confirmation.tutorConfirmed === 'pending' && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleConfirm(true)}
                disabled={loading}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Decline Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to decline this tutoring request? This action cannot be undone.
                  </AlertDialogDescription>
                  <div className="flex gap-3">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleConfirm(false)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Decline
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {/* Status Updates */}
          {connection.status === 'agreed' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusUpdate('collaboration_started')}
              disabled={loading}
              className="flex-1"
            >
              Start Tutoring
            </Button>
          )}

          {connection.status === 'collaboration_started' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusUpdate('completed')}
              disabled={loading}
              className="flex-1"
            >
              Mark Complete
            </Button>
          )}

          {/* Cancel Button */}
          {['initiated', 'in_discussion', 'agreed'].includes(connection.status) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Cancel Connection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this connection? This action cannot be undone.
                </AlertDialogDescription>
                <div className="flex gap-3">
                  <AlertDialogCancel>Keep Connection</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Cancel Connection
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
