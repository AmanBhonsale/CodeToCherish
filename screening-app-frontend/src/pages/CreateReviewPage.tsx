import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For area of research if it's longer
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const reviewSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  reviewType: z.string().min(1, { message: 'Please select a review type' }),
  questionType: z.string().min(1, { message: 'Please select a question type' }),
  areaOfResearch: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

// Placeholder options as per prompt A4
const reviewTypeOptions = ['Systematic Review', 'Scoping Review', 'Meta-analysis', 'Rapid Review', 'Other'];
const questionTypeOptions = ['Intervention', 'Diagnosis', 'Prognosis', 'Qualitative', 'Other'];

const CreateReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      reviewType: '',
      questionType: '',
      areaOfResearch: '',
    }
  });

  const onSubmit: SubmitHandler<ReviewFormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setIsSuccess(false);

    if (!token) {
      setApiError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create review');
      }

      setIsSuccess(true);
      // Navigate to the new review's overview page
      setTimeout(() => {
        navigate(`/reviews/${responseData.id}/overview`);
      }, 2000);

    } catch (error: any) {
      setApiError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Systematic Review</CardTitle>
          <CardDescription>
            Fill in the details below to start your new review project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Creating Review</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          {isSuccess && (
            <Alert variant="default" className="mb-4 bg-green-100 border-green-300 text-green-700">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Review created successfully. Redirecting you to the review overview...
              </AlertDescription>
            </Alert>
          )}
          {!isSuccess && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Review Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="e.g., Efficacy of Drug X for Condition Y"
                  {...register('title')}
                  disabled={isLoading}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewType">Review Type <span className="text-destructive">*</span></Label>
                <Select
                  onValueChange={(value) => control._fields.reviewType?._f.onChange(value)} // For react-hook-form with shadcn Select
                  defaultValue=""
                  disabled={isLoading}
                >
                  <SelectTrigger id="reviewType" className={errors.reviewType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a review type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewTypeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input for react-hook-form registration with Select */}
                <input type="hidden" {...register('reviewType')} />
                {errors.reviewType && <p className="text-sm text-destructive">{errors.reviewType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionType">Question Type <span className="text-destructive">*</span></Label>
                 <Select
                  onValueChange={(value) => control._fields.questionType?._f.onChange(value)}
                  defaultValue=""
                  disabled={isLoading}
                >
                  <SelectTrigger id="questionType" className={errors.questionType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('questionType')} />
                {errors.questionType && <p className="text-sm text-destructive">{errors.questionType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaOfResearch">Area of Research (Optional)</Label>
                <Textarea
                  id="areaOfResearch"
                  placeholder="e.g., Cardiology, Health Policy, Child Psychology"
                  {...register('areaOfResearch')}
                  disabled={isLoading}
                />
                {errors.areaOfResearch && <p className="text-sm text-destructive">{errors.areaOfResearch.message}</p>}
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Creating Review...' : 'Create Review'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateReviewPage;
