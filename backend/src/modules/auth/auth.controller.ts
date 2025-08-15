// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { CustomError } from '../../middleware/error-handler';

/**
 * Controller to get the current user's profile.
 * It expects the firebaseAuthMiddleware to have already run and attached
 * the user object (with uid and email) to the request.
 * It then finds or creates a user profile in the local MongoDB.
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if the user object was attached by the middleware
    if (!req.user || !req.user.uid) {
      throw new CustomError(
        'User information not found in request. Authentication middleware might have failed.',
        'UNAUTHENTICATED',
        401
      );
    }

    const { uid, email, name } = req.user;

    // 2. Find or create the user in our local database
    const localUser = await authService.findOrCreateUser(uid, email, name);

    // 3. Respond with the local user profile data
    // We don't send back passwords or sensitive info, just the public profile
    res.status(200).json({
      success: true,
      data: {
        id: localUser._id, // The MongoDB ID
        firebaseUid: localUser.firebaseUid,
        email: localUser.email,
        name: localUser.name,
        plan: localUser.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};
