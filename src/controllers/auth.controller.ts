import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prismaClient';
import { hashPassword, comparePassword } from '../services/password.service';
import { generateToken } from '../services/jwt.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    // Exclude passwordHash from the returned user object
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() }
    });

    const token = generateToken({ userId: user.id, email: user.email });

    // Exclude passwordHash from the returned user object
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const googleLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  // This is a dummy implementation as per the plan
  // In a real scenario, you would verify a Google ID token or auth code
  const { googleToken, fullName, email } = req.body;

  if (!googleToken || !email) {
    return res.status(400).json({ message: 'Google token and email are required for dummy Google login' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User exists, potentially link Google ID if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId: `dummy_google_id_for_${email}`, lastLogin: new Date() }, // Using email to make it somewhat unique for dummy
        });
      } else {
         user = await prisma.user.update({
            where: { email },
            data: { lastLogin: new Date() }
        });
      }
    } else {
      // New user via Google
      // For a dummy setup, we might not have a password.
      // In a real setup, passwordHash might be null or a very random unguessable string.
      user = await prisma.user.create({
        data: {
          email,
          fullName: fullName || email.split('@')[0], // Default fullName if not provided
          googleId: `dummy_google_id_for_${email}`,
          passwordHash: await hashPassword(`dummyPasswordFor_${email}`), // Create a dummy hash
          lastLogin: new Date(),
        },
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Dummy Google login successful',
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  // For JWT, logout is typically handled client-side by deleting the token.
  // If using a token blacklist or server-side sessions, implement invalidation here.
  // For now, just a success message.
  try {
    // Example: If you had a TokenBlacklist model with Prisma:
    // const token = req.headers.authorization?.split(' ')[1];
    // if (token) {
    //   await prisma.tokenBlacklist.create({ data: { token }});
    // }
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
