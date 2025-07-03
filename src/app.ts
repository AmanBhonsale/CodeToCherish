import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import authRoutes from './routes/auth.routes';
import reviewRoutes from './routes/review.routes'; // Import review routes

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for all routes and origins
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Basic Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// Mount your routes here
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes); // Mount review routes
// ... other routes

// Global Error Handler (basic example)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
