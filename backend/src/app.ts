// src/app.ts

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import errorHandler from './middleware/error-handler';

// --- Route Imports ---
import healthRoutes from './routes/health.routes';
import authRoutes from './modules/auth/auth.routes';
import aiRoutes from './modules/ai/ai.routes';
import resumeRoutes from './modules/resumes/resume.routes';

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());

// --- FIX: Updated CORS Configuration to Allow All Origins ---
// This will allow requests from any domain.
// Note: When using a wildcard ('*'), credentials (like cookies) are generally not allowed by browsers.
// Since we are now using Firebase Bearer tokens, this is acceptable.
app.use(cors({ origin: '*' }));

app.use(compression());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message:
        'Too many requests from this IP, please try again after 15 minutes.',
    },
  },
});

app.use(apiLimiter);

// Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Still useful for any other potential cookie needs

// --- API Routes ---
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resumes', resumeRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
