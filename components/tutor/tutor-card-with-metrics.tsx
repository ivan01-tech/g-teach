'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TutorContactCard } from '@/components/tutor/tutor-contact-card';
import { useTutorMetrics } from '@/hooks/use-connection';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Users, Clock, TrendingUp } from 'lucide-react';

interface TutorCardWithMetricsProps {
  tutorId: string;
  tutorName: string;
  photoURL?: string;
  bio?: string;
  specializations?: string[];
  hourlyRate?: number;
  onContactSuccess?: () => void;
}

export function TutorCardWithMetrics({
  tutorId,
  tutorName,
  photoURL,
  bio,
  specializations = [],
  hourlyRate,
  onContactSuccess,
}: TutorCardWithMetricsProps) {
  const { metrics, scores, loading } = useTutorMetrics(tutorId);

  // Get badge based on score
  const getBadge = () => {
    if (!scores) return null;
    const score = scores.overallScore;
    const reviews = metrics?.totalReviews || 0;

    if (score >= 95 && reviews >= 20) return { text: 'Elite', color: 'bg-purple-500' };
    if (score >= 90 && reviews >= 10) return { text: 'Excellent', color: 'bg-blue-500' };
    if (score >= 80 && reviews >= 5) return { text: 'Trusted', color: 'bg-green-500' };
    return null;
  };

  const badge = getBadge();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={photoURL} alt={tutorName} />
              <AvatarFallback>{tutorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{tutorName}</CardTitle>
                {badge && (
                  <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>
                )}
              </div>
              {hourlyRate && (
                <CardDescription>${hourlyRate}/hour</CardDescription>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {bio && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
          </div>
        )}

        {/* Specializations */}
        {specializations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1">
              {specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{specializations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Metrics Loading or Display */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            {/* Rating */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{metrics.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{metrics.totalReviews} reviews</p>
            </div>

            {/* Students */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{metrics.activeConnections || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">active students</p>
            </div>

            {/* Success Rate */}
            {scores && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{scores.successRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">success rate</p>
                </div>

                {/* Response Time */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">&lt;{metrics.responseTimeHours}h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">avg response</p>
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Contact Button */}
        <div className="pt-3 border-t">
          <TutorContactCard
            tutorId={tutorId}
            tutorName={tutorName}
            onSuccess={onContactSuccess}
          />
        </div>
      </CardContent>
    </Card>
  );
}
