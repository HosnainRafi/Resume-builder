import jwt from 'jsonwebtoken';
import env from '../config';
import logger from './logger';

// Payload for the JWT access token
export interface AccessTokenPayload {
  userId: string;
  email: string;
  plan: string;
}

// Payload for the JWT refresh token
export interface RefreshTokenPayload {
  userId: string;
  rotationCounter: number;
}

/**
 * Signs a new access token.
 * @param payload The data to embed in the token.
 * @returns The signed JWT string.
 */
export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' }); // Short-lived
};

/**
 * Signs a new refresh token.
 * @param payload The data to embed in the token.
 * @returns The signed JWT string.
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Long-lived
};

/**
 * Verifies an access token.
 * @param token The JWT string to verify.
 * @returns Decoded payload or null if verification fails.
 */
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch (error) {
    logger.warn({ error }, 'Access token verification failed.');
    return null;
  }
};

/**
 * Verifies a refresh token.
 * @param token The JWT string to verify.
 * @returns Decoded payload or null if verification fails.
 */
export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    logger.warn({ error }, 'Refresh token verification failed.');
    return null;
  }
};
