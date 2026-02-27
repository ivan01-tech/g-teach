'use client';

import { useTutorMetrics } from '@/hooks/use-connection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, TrendingUp, Users, Clock } from 'lucide-react';

interface TutorProfileMetricsProps {
  tutorId: string;
  compact?: boolean;
}

export function TutorProfileMetrics({ tutorId, compact = false }: TutorProfileMetricsProps) {
  const { metrics, scores, loading } = useTutorMetrics(tutorId);

  if (loading) {
    return (
      <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className={`h-24 ${compact ? '' : ''}`} />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  // Determine badge based on score
  const getBadge = () => {
    const score = scores?.overallScore || 0;
    const reviews = metrics.totalReviews || 0;

    if (score >= 95 && reviews >= 20) return { text: 'Elite', color: 'bg-purple-100 text-purple-800' };
    if (score >= 90 && reviews >= 10) return { text: 'Excellent', color: 'bg-blue-100 text-blue-800' };
    if (score >= 80 && reviews >= 5) return { text: 'Trusted', color: 'bg-green-100 text-green-800' };
    return { text: 'New', color: 'bg-gray-100 text-gray-800' };
  };

  const badge = getBadge();

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Score Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold">{scores?.overallScore || 0}</p>
                <p className="text-xs text-muted-foreground">tutor score</p>
              </div>
              <Badge className={badge.color}>{badge.text}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">{scores?.successRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {metrics.averageRating.toFixed(1)} ({metrics.totalReviews})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tutor Badge & Overall Score */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-8 -mt-8" />
        <CardHeader className="pb-2 relative">
          <div className="flex items-start justify-between mb-2">
            <div>
              <CardTitle className="text-lg">Performance Score</CardTitle>
              <CardDescription>Based on your teaching history</CardDescription>
            </div>
            <Badge className={badge.color}>{badge.text}</Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-5xl font-bold">{scores?.overallScore || 0}</div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${scores?.successRate || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{scores?.successRate || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Rating */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalReviews} {metrics.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{metrics.activeConnections || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">active students</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Connections */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{metrics.totalConnections || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">total connections</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">&lt;{metrics.responseTimeHours}h</span>
              </div>
              <p className="text-xs text-muted-foreground">avg response</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Success Rate (40%)</span>
              <span className="font-medium">{(scores?.successRate || 0).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${scores?.successRate || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rating Score (35%)</span>
              <span className="font-medium">{(scores?.ratingScore || 0).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${scores?.ratingScore || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reliability Score (25%)</span>
              <span className="font-medium">{(scores?.reliabilityScore || 0).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${scores?.reliabilityScore || 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
