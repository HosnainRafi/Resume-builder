import { z } from 'zod';

export const EnhanceTextSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, 'Text must be at least 10 characters long.')
    .max(500, 'Text cannot exceed 500 characters.'),
  context: z
    .enum(['bullet_point', 'summary', 'job_title'])
    .default('bullet_point'),
});
