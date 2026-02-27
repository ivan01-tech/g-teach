'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useConnection } from '@/hooks/use-connection';
import { FeedbackForm } from '@/components/connections/feedback-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ConnectionService } from '@/lib/services/connection.service';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const connectionId = params.connectionId as string;

  const { loading: connLoading } = useConnection({
    userId: user?.uid||"",
  });

  const [connection, setConnection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        // Import the service and fetch
        const conn = await ConnectionService.getConnection(connectionId);
        setConnection(conn);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch connection:', err);
        setLoading(false);
      }
    };

    if (connectionId) {
      fetchConnection();
    }
  }, [connectionId]);

  if (loading || connLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Could not find the connection. Please go back and try again.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/student/connections">Back to Connections</Link>
        </Button>
      </div>
    );
  }

  if (connection.status !== 'completed') {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            You can only leave feedback after the tutoring session is completed.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/student/connections">Back to Connections</Link>
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-12 pb-8 flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Thank you!</h2>
            <p className="text-green-800 mb-6">
              Your feedback has been submitted. This helps other students find great tutors.
            </p>
            <Button asChild>
              <Link href="/student/connections">Back to My Tutors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Share Your Experience</h1>
        <p className="text-muted-foreground mt-2">
          Your feedback helps us maintain quality tutoring and helps other students find great tutors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutoring Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tutor</p>
              <p className="font-medium">{connection.tutorName || 'Your Tutor'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium">{connection.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Started</p>
              <p className="font-medium">
                {new Date(connection.agreedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-medium">
                {new Date(connection.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FeedbackForm
        connectionId={connectionId}
        recipientName={connection.tutorName || 'Your Tutor'}
        recipientType="tutor"
        onSubmitSuccess={() => setSubmitted(true)}
      />

      <Button variant="outline" asChild className="w-full">
        <Link href="/student/connections">Skip for Now</Link>
      </Button>
    </div>
  );
}
