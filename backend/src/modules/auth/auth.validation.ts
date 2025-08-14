import { z } from 'zod';
// Import the base schemas from the user module
import { UserSchema, LoginSchema } from '../users/user.validation';

// The schema for registration is the same as the base UserSchema.
// We use .extend({}) here for clarity and in case we want to add fields later.
export const RegisterSchema = UserSchema.extend({
  // No additional fields are needed for registration for now.
});

// Schema for the refresh token endpoint.
// In our implementation, the token is read from a cookie, so this schema might not be used
// in the controller, but it's good practice to define it.
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Re-export the LoginSchema so the auth controller can import all its validation
// schemas from this single file for consistency.
export { LoginSchema };
