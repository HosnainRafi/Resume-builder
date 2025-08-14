import { z } from 'zod';

export const EnhanceTextSchema = z.object({
  text: z
    .string()
    .trim()
    // FIX: Lower the minimum length to allow for short phrases.
    .min(3, 'Text must be at least 3 characters long.')
    .max(500, 'Text cannot exceed 500 characters.'),
  context: z
    .enum(['bullet_point', 'summary', 'job_title'])
    .default('bullet_point'),
});
