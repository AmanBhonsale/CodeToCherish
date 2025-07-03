import { Router } from 'express';
import { createReview, getUserReviews, getReviewDetails } from '../controllers/review.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = Router();

// All review routes should be protected
router.use(protectRoute);

router.post('/', createReview); // Create a new review
router.get('/', getUserReviews); // Get reviews for the authenticated user
router.get('/:reviewId/details', getReviewDetails); // Get specific review details

export default router;
