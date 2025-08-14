import { Response } from 'express';
import env from '../config';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  domain?: string;
  maxAge?: number; // in milliseconds
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE, // Should be true in production (HTTPS)
  sameSite: 'lax', // CSRF protection, but still allows some cross-site use
  domain: env.COOKIE_DOMAIN === 'localhost' ? undefined : env.COOKIE_DOMAIN, // Exclude domain for localhost
};

/**
 * Sets an HttpOnly, secure cookie on the response.
 * @param res Express Response object.
 * @param name Name of the cookie.
 * @param value Value of the cookie.
 * @param options Additional cookie options.
 */
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: Partial<CookieOptions>
) => {
  res.cookie(name, value, { ...defaultCookieOptions, ...options });
};

/**
 * Clears a cookie from the response.
 * @param res Express Response object.
 * @param name Name of the cookie to clear.
 */
export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, { ...defaultCookieOptions, maxAge: 0 }); // maxAge 0 to expire immediately
};
