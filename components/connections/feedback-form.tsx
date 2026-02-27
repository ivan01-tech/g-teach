/**
 * Feedback Form Component
 * For collecting ratings and reviews after connection completion
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { FeedbackService } from '@/lib/services/feedback.service';
import { useToast } from '@/hooks/use-toast';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  communication: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  knowledgeability: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
  reliability: z.number().min(1).max(5).optional(),
  review: z.string().min(10).max(500),
  wouldRecommend: z.boolean(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  connectionId: string;
  recipientName: string;
  recipientType: 'tutor' | 'student';
  onSubmitSuccess?: () => void;
}

export function FeedbackForm({
  connectionId,
  recipientName,
  recipientType,
  onSubmitSuccess,
}: FeedbackFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      wouldRecommend: true,
      review: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      setLoading(true);

      const feedback = await FeedbackService.submitFeedback(connectionId, '', {
        rating: data.rating,
        ratingCategories: {
          communication: data.communication,
          professionalism: data.professionalism,
          knowledgeability: data.knowledgeability,
          punctuality: data.punctuality,
          reliability: data.reliability,
        },
        review: data.review,
        wouldRecommend: data.wouldRecommend,
      });

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback. It helps improve the platform.',
      });

      onSubmitSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with {recipientName}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Overall Rating: {field.value} / 5 stars
                  </FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Ratings */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-sm">Rate specific aspects (optional):</p>

              {[
                { name: 'communication', label: 'Communication' },
                { name: 'professionalism', label: 'Professionalism' },
                { name: recipientType === 'tutor' ? 'knowledgeability' : 'reliability', 
                  label: recipientType === 'tutor' ? 'Knowledge & Teaching Ability' : 'Reliability' },
                { name: 'punctuality', label: 'Punctuality' },
                { name: 'reliability', label: 'Reliability' },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm">{label}</FormLabel>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= (field.value || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Written Review */}
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Share your experience learning from ${recipientName}. What did they do well? Any suggestions for improvement?`}
                      className="min-h-30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0} / 500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recommendation */}
            <FormField
              control={form.control}
              name="wouldRecommend"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0 p-4 border rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="font-medium cursor-pointer">
                      I would recommend {recipientName} to other students
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              All feedback is moderated before being published to protect community members.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
