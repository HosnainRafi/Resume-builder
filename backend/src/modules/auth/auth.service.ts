// src/modules/auth/auth.service.ts

import { UserModel } from '../users/user.model';
import { IUser } from '../users/user.interface';
import { CustomError } from '../../middleware/error-handler';
import logger from 'backend/src/utils/logger';

/**
 * Ensures a user profile exists in the local MongoDB database.
 * If the user doesn't exist, it creates a new one. This is typically called
 * after a user has been successfully created or verified by Firebase.
 *
 * @param uid - The user's unique ID from Firebase.
 * @param email - The user's email from Firebase.
 * @param name - The user's display name (optional).
 * @returns The user document from the local database.
 */
export const findOrCreateUser = async (
  uid: string,
  email?: string,
  name?: string
): Promise<IUser> => {
  // Find the user by their Firebase UID
  let user = await UserModel.findOne({ firebaseUid: uid });

  if (user) {
    // If user exists, just return them
    logger.info(`User found in local DB: ${email}`);
    return user;
  }

  // If user does not exist, create a new profile in our database
  logger.info(`User not found in local DB. Creating new profile for: ${email}`);

  // You might want to handle the case where email is undefined,
  // though it's rare for new signups.
  if (!email) {
    throw new CustomError(
      'Email is required to create a new user profile.',
      'VALIDATION_ERROR',
      400
    );
  }

  user = await UserModel.create({
    firebaseUid: uid, // Use a dedicated field for the Firebase ID
    email,
    name: name || 'New User', // Provide a default name if needed
    plan: 'free', // Assign a default plan
  });

  return user;
};
