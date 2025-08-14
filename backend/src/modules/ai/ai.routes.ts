import { Router } from 'express';
import { enhanceText } from './ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Protect this route to ensure only logged-in users can use the AI features.
// This is where you can later check planLimits if you add them.
router.post('/enhance', authMiddleware, enhanceText);

export default router;
