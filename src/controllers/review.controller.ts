import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware'; // Import our custom request type
import prisma from '../config/prismaClient';
import { Role } from '@prisma/client'; // Import Role enum

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, reviewType, questionType, areaOfResearch } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      // This should ideally be caught by protectRoute middleware, but as a safeguard:
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Review title is required' });
    }

    const newReview = await prisma.review.create({
      data: {
        title,
        reviewType,
        questionType,
        areaOfResearch,
        ownerId: userId,
        members: {
          create: [
            {
              userId: userId,
              role: Role.OWNER, // Assign the creator as OWNER
            },
          ],
        },
      },
      include: {
        owner: {
          select: { id: true, fullName: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const reviews = await prisma.review.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        owner: {
          select: { id: true, fullName: true, email: true },
        },
        _count: { // To get article count later, for now, just basic structure
          select: { members: true } // Placeholder, will be articles
        }
        // TODO: Add include for article count when Article model is linked
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map reviews to include a placeholder articleCount and owner name
    const formattedReviews = reviews.map(review => ({
        id: review.id,
        title: review.title,
        // articleCount: review._count.articles, // This will be used when articles relation is added
        articleCount: review._count.members, // Placeholder: using member count for now
        owner: review.owner.fullName || review.owner.email, // Show fullName or email
        createdAt: review.createdAt,
        reviewType: review.reviewType,
        questionType: review.questionType,
        areaOfResearch: review.areaOfResearch
    }));


    res.status(200).json(formattedReviews);
  } catch (error) {
    next(error);
  }
};

export const getReviewDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        owner: {
          select: { id: true, fullName: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true, role: true }, // Include role here from ReviewMember
            },
          },
        },
        // TODO: Include other details like articles, progress, etc. later
      },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or access denied' });
    }

    // Manually map member roles from the join table if not directly on user
    const formattedReview = {
        ...review,
        members: review.members.map(member => ({
            userId: member.user.id,
            fullName: member.user.fullName,
            email: member.user.email,
            role: member.role, // Role from ReviewMember table
            addedAt: member.addedAt
        }))
    };


    res.status(200).json(formattedReview);
  } catch (error) {
    next(error);
  }
};
