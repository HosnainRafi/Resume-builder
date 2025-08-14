import { z } from 'zod';

export const UserSchema = z.object({
  // Ensure 'export' keyword is present
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character'
    ),
  name: z.string().trim().min(1, 'Name is required').max(255).optional(),
});

export const LoginSchema = z.object({
  // Ensure 'export' keyword is present
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required'), // Don't expose password rules here
});
