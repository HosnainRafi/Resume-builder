import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessTokenPayload } from '../utils/jwt.utils';
import { CustomError } from './error-handler';
import logger from '../utils/logger';

// Extend the Request interface to include a 'user' property
declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // FIX: Prefixed 'res' with '_'
  try {
    // Check for access token in HttpOnly cookie
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new CustomError(
        'Authentication required: No access token',
        'NO_ACCESS_TOKEN',
        401
      );
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      throw new CustomError(
        'Authentication required: Invalid or expired access token',
        'INVALID_ACCESS_TOKEN',
        401
      );
    }

    req.user = decoded; // Attach decoded user payload to the request
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error); // Pass custom errors directly
    } else {
      logger.error({ error }, 'Unexpected error in authMiddleware');
      next(
        new CustomError('Authentication failed', 'AUTHENTICATION_FAILED', 401)
      );
    }
  }
};
