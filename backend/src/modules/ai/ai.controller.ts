import { Request, Response, NextFunction } from 'express';
import { enhanceTextWithAI } from './ai.service';
import { EnhanceTextSchema } from './ai.validation';
import { CustomError } from '../../middleware/error-handler';

export const enhanceText = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const validationResult = EnhanceTextSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new CustomError(
        'Invalid input.',
        'VALIDATION_ERROR',
        400,
        validationResult.error.flatten().fieldErrors
      );
    }

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
