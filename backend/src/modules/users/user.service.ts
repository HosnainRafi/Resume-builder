import * as argon2 from 'argon2';
import { UserModel } from './user.model';
import logger from '../../utils/logger';
import { IUser } from './user.interface';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    logger.error({ error }, 'Failed to hash password');
    throw new Error('Password hashing failed');
  }
};

export const verifyPassword = async (
  hash: string,
  plain: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plain);
  } catch (error) {
    logger.error({ error }, 'Failed to verify password');
    return false;
  }
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email: email.toLowerCase() });
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  // Ensure email is lowercased before saving
  if (userData.email) {
    userData.email = userData.email.toLowerCase();
  }
  const user = new UserModel(userData);
  await user.save();
  return user;
};
