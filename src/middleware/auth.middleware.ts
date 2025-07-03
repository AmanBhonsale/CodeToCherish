import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt.service';
import prisma from '../config/prismaClient';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    // Add other user properties if needed from token/DB lookup
  };
}

export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token format invalid' });
  }

  const decodedPayload = verifyToken(token);
  if (!decodedPayload) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  try {
    // Optionally, fetch user from DB to ensure they still exist/are active
    const user = await prisma.user.findUnique({
      where: { id: decodedPayload.userId },
      select: { id: true, email: true /* select other needed non-sensitive fields */ }
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error("Error in auth middleware DB lookup:", error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};
