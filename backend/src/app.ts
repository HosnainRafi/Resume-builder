import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser'; // <-- NEW IMPORT
import env from './config';
import logger from './utils/logger';
import errorHandler from './middleware/error-handler';
import healthRoutes from './routes/health.routes';
import authRoutes from './modules/auth/auth.routes'; // <-- NEW IMPORT
import aiRoutes from './modules/ai/ai.routes'; // <-- NEW IMPORT
import resumeRoutes from './modules/resumes/resume.routes'; // <-- NEW IMPORT

const app = express();

// Use Pino for HTTP request logging
app.use(pinoHttp({ logger }));

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: env.APP_URL, // Allow requests only from your frontend URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
};
app.use(cors(corsOptions));

// Compression Middleware
app.use(compression());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message:
        'Too many requests from this IP, please try again after 15 minutes.',
    },
  },
});
app.use(apiLimiter); // Apply to all requests for now, can be specific later

// Body Parsers
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(cookieParser()); // <-- NEW: Parse cookies from incoming requests

// Routes
app.use('/health', healthRoutes); // Health check routes
app.use('/api/auth', authRoutes); // <-- NEW: Auth routes
app.use('/api/ai', aiRoutes);
app.use('/api/resumes', resumeRoutes);

// Global Error Handler (MUST be the last middleware)
app.use(errorHandler);

export default app;
