import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layouts/RootLayout';
import AuthLayout from './components/layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Import Actual Page Components
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateReviewPage from './pages/CreateReviewPage'; // Import actual CreateReviewPage

// Placeholder components for pages not yet implemented
const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4 border rounded-lg shadow-sm bg-card">
    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
    <p>This is a placeholder for the {title} page.</p>
    <p>Content for this page will be implemented in a future step.</p>
  </div>
);

const ReviewOverviewPage = () => <PlaceholderComponent title="Review Overview Page" />;
const SettingsPage = () => <PlaceholderComponent title="Settings Page" />;
const NotFoundPage = () => <PlaceholderComponent title="404 Not Found" />;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes for unauthenticated users or general public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="/" element={<IntroPage />} />

        {/* Protected Routes - only accessible after login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reviews/new" element={<CreateReviewPage />} /> {/* Use actual component */}
            <Route path="/reviews/:reviewId/overview" element={<ReviewOverviewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Add other protected routes here */}
          </Route>
        </Route>

        {/* Fallback for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
