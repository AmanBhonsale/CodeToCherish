import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/login', { // Assuming backend runs on the same domain or proxy is set up
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      // Assuming responseData contains { token: string, user: User }
      login(responseData.user, responseData.token);
      navigate(from, { replace: true });

    } catch (error: any) {
      setApiError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy Google Login Handler
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setApiError(null);
    // In a real app, this would initiate OAuth flow and then send token to backend
    console.log("Attempting dummy Google Login...");
    try {
      const dummyEmail = `user${Date.now()}@example.com`; // Generate a unique dummy email
      const dummyGoogleToken = "dummyGoogleToken123"; // This would be a real token from Google

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleToken: dummyGoogleToken,
          email: dummyEmail,
          fullName: "Dummy Google User"
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Dummy Google login failed");
      }
      login(responseData.user, responseData.token);
      navigate(from, { replace: true });

    } catch (error: any) {
      setApiError(error.message || "An unexpected error occurred during Google login.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Or continue with
        </div>
        <Button variant="outline" className="w-full mt-2" onClick={handleGoogleLogin} disabled={isLoading}>
          <LogIn className="mr-2 h-4 w-4" /> {/* Using LogIn as a generic icon */}
          Google (Dummy)
        </Button>
      </CardContent>
      <CardFooter className="text-sm">
        Don&apos;t have an account?{' '}
        <Button variant="link" asChild className="p-0 pl-1">
          <Link to="/signup">Sign up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
