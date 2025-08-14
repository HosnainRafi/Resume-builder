import { Request, Response } from 'express';
import {
  hashPassword,
  verifyPassword,
  findUserByEmail,
  createUser,
} from '../users/user.service';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../utils/jwt.utils';
import { setCookie, clearCookie } from '../../utils/cookie.utils';
import logger from '../../utils/logger';
import { UserModel } from '../users/user.model';
// FIX 1: Import CustomError as a named export from the error-handler file.
import { CustomError } from '../../middleware/error-handler';
import { IUser } from '../users/user.interface';

// Extend Request type to include user if authenticated
declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Function to handle token issuance
const issueTokens = (res: Response, user: IUser): AuthTokens => {
  const accessTokenPayload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    plan: user.plan,
  };
  const refreshTokenPayload: RefreshTokenPayload = {
    userId: user.id,
    // Note: Mongoose's .get() is needed for fields not explicitly in the interface
    rotationCounter: user.get('refreshTokenRotationCounter') || 0,
  };

  const accessToken = signAccessToken(accessTokenPayload);
  const refreshToken = signRefreshToken(refreshTokenPayload);

  // Set HttpOnly cookies
  setCookie(res, 'accessToken', accessToken, { maxAge: 15 * 60 * 1000 }); // 15 minutes
  setCookie(res, 'refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }); // 7 days

  return { accessToken, refreshToken };
};

export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    // FIX 2: Now that the import is correct, `new CustomError` works as expected.
    throw new CustomError(
      'User with this email already exists.',
      'USER_EXISTS',
      409
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash, name });

  logger.info(`User registered: ${user.email}`);
  return user;
};

// FIX 3: Prefix the unused 'req' parameter with an underscore.
export const loginUser = async (
  _req: Request,
  res: Response,
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw new CustomError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  user.lastActiveAt = new Date();
  await user.save();

  const tokens = issueTokens(res, user);
  logger.info(`User logged in: ${user.email}`);
  return { user, tokens };
};

// FIX 4: Prefix the unused 'req' parameter with an underscore.
export const refreshAuthTokens = async (
  _req: Request,
  res: Response,
  incomingRefreshToken: string
) => {
  const decoded = verifyRefreshToken(incomingRefreshToken);
  if (!decoded) {
    throw new CustomError(
      'Invalid or expired refresh token',
      'INVALID_TOKEN',
      401
    );
  }

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new CustomError('User not found', 'USER_NOT_FOUND', 404);
  }

  if (user.get('refreshTokenRotationCounter') !== decoded.rotationCounter) {
    logger.warn(
      `Refresh token reuse detected for user ${user.id}. Invalidating all tokens.`
    );
    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');
    throw new CustomError(
      'Refresh token reused or revoked. Please log in again.',
      'TOKEN_REUSED',
      403
    );
  }

  user.set(
    'refreshTokenRotationCounter',
    (user.get('refreshTokenRotationCounter') || 0) + 1
  );
  await user.save();

  const tokens = issueTokens(res, user);
  logger.info(`Tokens refreshed for user: ${user.email}`);
  return { user, tokens };
};

export const logoutUser = (res: Response) => {
  clearCookie(res, 'accessToken');
  clearCookie(res, 'refreshToken');
  logger.info('User logged out (tokens cleared).');
};
