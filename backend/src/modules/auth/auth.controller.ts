import { Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from './auth.validation';
import {
  registerUser,
  loginUser,
  refreshAuthTokens,
  logoutUser,
} from './auth.service';
import { CustomError } from '../../middleware/error-handler';
import { findUserByEmail } from '../users/user.service';
import { z, ZodSchema } from 'zod';

// Utility for validation
const validate = <T extends ZodSchema>(schema: T, data: any): z.infer<T> => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    // FIX: Combine both form-level and field-level errors for a complete error message.
    const errorDetails = {
      formErrors: parsed.error.flatten().formErrors,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

    throw new CustomError(
      'Validation failed',
      'VALIDATION_FAILED',
      400,
      errorDetails // Pass the complete details object
    );
  }
  return parsed.data;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = validate(RegisterSchema, req.body);
    const user = await registerUser(email, password, name);
    res
      .status(201)
      .json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
        },
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = validate(LoginSchema, req.body);
    const { user, tokens } = await loginUser(req, res, email, password);
    res
      .status(200)
      .json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
          accessToken: tokens.accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new CustomError('Refresh token not found', 'NO_REFRESH_TOKEN', 401);
    }

    const { user, tokens } = await refreshAuthTokens(
      req,
      res,
      incomingRefreshToken
    );
    res
      .status(200)
      .json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
          accessToken: tokens.accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    logoutUser(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new CustomError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      throw new CustomError('User not found', 'USER_NOT_FOUND', 404);
    }
    res
      .status(200)
      .json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
        },
      });
  } catch (error) {
    next(error);
  }
};
