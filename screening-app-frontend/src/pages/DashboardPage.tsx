import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FilePlus2, Loader2, Inbox } from 'lucide-react';

// Define the structure of a review object based on backend response (B2 getUserReviews)
interface Review {
  id: string;
  title: string;
  articleCount: number; // Placeholder, actually member count for now from backend
  owner: string; // Owner's name or email
  createdAt: string; // ISO date string
  // Add other fields like reviewType, questionType if available directly here
}

const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) {
        setIsLoading(false);
        // This case should ideally be handled by ProtectedRoute, but as a safeguard
        setApiError("Authentication token not found. Please login again.");
        return;
      }

      setIsLoading(true);
      setApiError(null);
      try {
        const response = await fetch('/api/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch reviews');
        }

        const data: Review[] = await response.json();
        setReviews(data);
      } catch (error: any) {
        setApiError(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Systematic Reviews</h1>
        <Button asChild>
          <Link to="/reviews/new">
            <FilePlus2 className="mr-2 h-4 w-4" /> Create New Review
          </Link>
        </Button>
      </div>

      {apiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 && !apiError ? (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created or joined any reviews. Get started by creating one!
          </p>
          <Button asChild>
            <Link to="/reviews/new">Create Your First Review</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate hover:text-primary">
                    <Link to={`/reviews/${review.id}/overview`}>{review.title}</Link>
                </CardTitle>
                <CardDescription>
                  Owner: {review.owner}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Using placeholder for article count as per backend's current state */}
                <p className="text-sm text-muted-foreground">
                  {review.articleCount} item(s) (Note: current count reflects members, not articles)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created: {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/reviews/${review.id}/overview`}>View Review</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
