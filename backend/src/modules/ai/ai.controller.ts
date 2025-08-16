// src/modules/ai/ai.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  GenerateSummarySchema,
  GenerateExperienceSchema,
} from './ai.validation'; // Import new schema
import {
  generateAISummary,
  generateAIExperienceBulletPoints,
} from './ai.service'; // Import new service function
import logger from '../../utils/logger';

/**
 * Controller for generating a resume summary.
 * Handles validation, calls the service, and responds to the client.
 */
export const generateSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = GenerateSummarySchema.parse(req.body);
    logger.info('Summary generation request passed validation.');

    const summary = await generateAISummary(validatedData);

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully.',
      data: { summary },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error in generateSummaryController');
    next(error);
  }
};

/**
 * Controller for generating experience bullet points.
 * Handles validation, calls the service, and responds to the client.
 */
export const generateExperienceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = GenerateExperienceSchema.parse(req.body);
    logger.info('Experience generation request passed validation.');

    const bulletPoints = await generateAIExperienceBulletPoints(validatedData);

    res.status(200).json({
      success: true,
      message: 'Experience bullet points generated successfully.',
      data: { bulletPoints },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error in generateExperienceController');
    next(error);
  }
};
