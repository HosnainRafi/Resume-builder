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
import resumeRoutes from './modules/resumes/resume.routes';
import aiRoutes from './modules/ai/ai.routes'; // ✅ Correct import

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());

// --- CORS Configuration ---
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
  })
);

app.use(compression());

// Body Parsers must come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// --- Debugging Middleware ---
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming Request: ${req.method} ${req.originalUrl}`);
  console.log('[DEBUG] Request Headers:', req.headers);
  console.log('[DEBUG] Request Body:', req.body);
  next();
});

// --- API Routes ---
console.log('📋 Registering all application routes...');

app.use('/health', healthRoutes);
console.log('✅ /health routes registered.');

app.use('/api/auth', authRoutes);
console.log('✅ /api/auth routes registered.');

app.use('/api/ai', aiRoutes);

app.use('/api/resumes', resumeRoutes);
console.log('✅ /api/resumes routes registered.');

// --- Catch-all route for 404 errors ---
app.use((req, res) => {
  console.log(`❌ 404 - Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
