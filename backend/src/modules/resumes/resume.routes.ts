// src/modules/resumes/resume.routes.ts
import { Router } from 'express';
// FIX: Import and use the new Firebase auth middleware
import { firebaseAuthMiddleware } from '../../middleware/firebase-auth.middleware';
import * as ctrl from './resume.controller';

const router = Router();

// Apply the Firebase auth middleware to all resume routes
router.use(firebaseAuthMiddleware);

// All routes are now protected by Firebase
router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
// ... (rest of the routes are the same)
router.get('/:id', ctrl.getById);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:resumeId/analyze', ctrl.analyzeKeywords);

export default router;
