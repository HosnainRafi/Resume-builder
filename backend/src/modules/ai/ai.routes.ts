// src/modules/ai/ai.routes.ts
import { Router } from 'express';
import {
  generateSummaryController,
  generateExperienceController,
} from './ai.controller'; // Import new controller
import logger from '../../utils/logger';

const router = Router();

logger.info('AI routes module is being loaded.');

/**
 * @route POST /api/ai/generate-summary
 * @description Generates a professional resume summary based on user input.
 * @access Public (or authenticated if you want to restrict this)
 */
router.post('/generate-summary', generateSummaryController);
logger.info('✅ Route POST /api/ai/generate-summary has been defined.');

/**
 * @route POST /api/ai/generate-experience
 * @description Generates professional experience bullet points based on job title and company.
 * @access Public (or authenticated)
 */
router.post('/generate-experience', generateExperienceController); // New route
logger.info('✅ Route POST /api/ai/generate-experience has been defined.');

export default router;
