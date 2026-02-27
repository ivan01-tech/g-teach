'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConnection } from '@/hooks/use-connection';
import { useAuth } from '@/hooks/use-auth';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface TutorContactCardProps {
  tutorId: string;
  tutorName: string;
  subject?: string;
  onSuccess?: () => void;
}

export function TutorContactCard({
  tutorId,
  tutorName,
  subject = 'German Language Lessons',
  onSuccess,
}: TutorContactCardProps) {
  const { user } = useAuth();
  const { initiateConnection, loading, error } = useConnection({ userId: user?.uid||"" });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContact = async () => {
    try {
      await initiateConnection(tutorId, {
        notes: message,
        subject: subject,
      });
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setMessage('');
        setSubmitted(false);
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error('Failed to send connection request:', err);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Contact Tutor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {tutorName}</DialogTitle>
            <DialogDescription>
              Tell the tutor about your learning goals, current level, and what you're hoping to
              achieve.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3 mb-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-medium text-center">Request sent!</p>
              <p className="text-xs text-muted-foreground text-center">
                {tutorName} will review your request and respond soon.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error instanceof Error ? error.message : 'Failed to send request. Try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Hi! I'm interested in learning German. I'm a beginner with some experience in other languages and would love to improve my conversational skills..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length} characters
                  </p>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700 text-sm">
                    Be specific about your goals, current level, and availability. This helps the tutor
                    decide if they're a good fit for you.
                  </AlertDescription>
                </Alert>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleContact}
                  disabled={loading || !message.trim() || message.length < 20}
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
