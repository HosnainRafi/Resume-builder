import { Router, Request, Response } from 'express';
import env from '../config';

const router = Router();

// Health check endpoint
// FIX: Prefixed unused 'req' parameter with an underscore
router.get('/health', (_req: Request, res: Response) => {
  res
    .status(200)
    .json({
      status: 'UP',
      service: env.APP_NAME,
      timestamp: new Date().toISOString(),
    });
});

// Readiness check endpoint (e.g., for Kubernetes)
// FIX: Prefixed unused 'req' parameter with an underscore
router.get('/ready', (_req: Request, res: Response) => {
  // In a real app, you would check database connection, external services, etc.
  const isReady = true; // Placeholder for now

  if (isReady) {
    res
      .status(200)
      .json({
        status: 'READY',
        service: env.APP_NAME,
        timestamp: new Date().toISOString(),
      });
  } else {
    res
      .status(503)
      .json({
        status: 'NOT_READY',
        service: env.APP_NAME,
        reason: 'Dependencies not met',
      });
  }
});

export default router;
