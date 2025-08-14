import { Request, Response, NextFunction } from 'express';
import { enhanceTextWithAI, generateBulletPoints } from './ai.service';
import { EnhanceTextSchema } from './ai.validation';
import { CustomError } from '../../middleware/error-handler';

export const enhanceText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = EnhanceTextSchema.safeParse(req.body);

    if (!validationResult.success) {
      // This block now ONLY handles the error case.
      throw new CustomError(
        'Invalid input.',
        'VALIDATION_ERROR',
        400,
        validationResult.error.flatten().fieldErrors
      );
    } // <-- FIX: The closing brace is moved here.

    // This code now correctly runs only on successful validation.
    const { text, context } = validationResult.data;
    const enhancedText = await enhanceTextWithAI(text, context);

    res.status(200).json({
      data: {
        originalText: text,
        enhancedText: enhancedText,
      },
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

export const generateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobTitle, company } = req.body;
    if (!jobTitle || !company) {
      throw new CustomError(
        'Job title and company are required.',
        'VALIDATION_ERROR',
        400
      );
    }

    const bulletPoints = await generateBulletPoints(jobTitle, company);

    res.status(200).json({
      success: true,
      message: 'Bullet points generated successfully.',
      data: { bulletPoints },
    });
  } catch (error) {
    next(error);
  }
};
