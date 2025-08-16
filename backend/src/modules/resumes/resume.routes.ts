// src/modules/resumes/resume.routes.ts

import { Router } from 'express';
import { firebaseAuthMiddleware } from '../../middleware/firebase-auth.middleware';
import * as ctrl from './resume.controller'; // Import all controllers

const router = Router();

// Apply the Firebase auth middleware to all resume routes for protection
router.use(firebaseAuthMiddleware);

// Resume CRUD operations
router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// Resume analysis and scoring features
router.post('/:resumeId/analyze', ctrl.analyzeKeywords); // For keyword analysis
router.get('/:resumeId/score', ctrl.scoreResume); // New endpoint for resume scoring

// Share link features
router.post('/:resumeId/share', ctrl.createShareLink);
router.get('/share/:token', ctrl.getSharedResume);

export default router;
