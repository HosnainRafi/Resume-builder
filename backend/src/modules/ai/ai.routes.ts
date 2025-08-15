import { Router } from 'express';
import { enhanceText, generateExperience } from './ai.controller';
import { firebaseAuthMiddleware } from 'backend/src/middleware/firebase-auth.middleware';

const router = Router();

// Protect this route to ensure only logged-in users can use the AI features.
// This is where you can later check planLimits if you add them.
router.post('/enhance', firebaseAuthMiddleware, enhanceText);
router.post('/generate-experience', generateExperience);

export default router;
