// src/middleware/firebase-auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase-admin';
import { CustomError } from './error-handler';

// This global type declaration is still useful for autocompletion.
declare global {
  namespace Express {
    export interface Request {
      user?: {
        uid: string;
        email?: string;
        name: string; // <-- The fix is here
      };
    }
  }
}

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new CustomError('Unauthorized: No token provided.', 'UNAUTHORIZED', 401)
    );
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // FIX: Provide a fallback to an empty string if email is undefined.
    // This ensures the assigned value is always a string.
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name, // <-- The fix is here
    };

    next();
  } catch (error) {
    return next(
      new CustomError('Unauthorized: Invalid token.', 'UNAUTHORIZED', 401)
    );
  }
};
