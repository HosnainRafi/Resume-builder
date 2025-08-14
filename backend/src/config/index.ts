import dotenv from 'dotenv';
// FIX: Import ZodIssue along with z
import { z, ZodIssue } from 'zod';
import logger from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8000),
  APP_URL: z.string().url().default('http://localhost:5173'), // Frontend URL for CORS
  APP_NAME: z.string().default('AI Resume Builder'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  COOKIE_DOMAIN: z.string().min(1, 'COOKIE_DOMAIN is required'),
  COOKIE_SECURE: z.coerce.boolean().default(false), // Should be true in production
  OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API Key is required'),
  OPENROUTER_MODEL: z.string().default('anthropic/claude-3-haiku:latest'),
  SENTRY_DSN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
  logger.info('Environment variables loaded and validated successfully.');
} catch (error) {
  logger.error('Failed to load or validate environment variables:');
  if (error instanceof z.ZodError) {
    // FIX: Iterate over error.issues and explicitly type the 'issue' parameter
    error.issues.forEach((issue: ZodIssue) => {
      logger.error(`- ${issue.path.join('.')}: ${issue.message}`);
    });
  } else {
    logger.error(error);
  }
  process.exit(1); // Exit if env is invalid
}

export default env;
