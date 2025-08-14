import { Request, Response, NextFunction } from 'express';
import * as resumeService from './resume.service';
import { CreateResumeSchema, UpdateResumeSchema } from './resume.validation';
import { CustomError } from '../../middleware/error-handler';
import { z, ZodSchema } from 'zod';
import mongoose from 'mongoose';
import { ResumeModel } from './resume.model';
import sharelinkModel from './sharelink.model';
import { randomBytes } from 'crypto'; // <-- FIX: Correctly import randomBytes

// Generic validation utility
const validate = <T extends ZodSchema>(schema: T, data: any): z.infer<T> => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new CustomError(
      'Validation failed',
      'VALIDATION_FAILED',
      400,
      parsed.error.flatten()
    );
  }
  return parsed.data;
};

// Create a new resume
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const resumeData = validate(CreateResumeSchema, req.body);
    const newResume = await resumeService.createResume(userId, resumeData);
    res.status(201).json({ data: newResume });
  } catch (error) {
    next(error);
  }
};

// Get a single resume by ID
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { id: resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new CustomError('Invalid resume ID format.', 'BAD_REQUEST', 400);
    }

    const resume = await resumeService.findResumeById(userId, resumeId);
    if (!resume) {
      throw new CustomError('Resume not found.', 'NOT_FOUND', 404);
    }
    res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
};

// Get all resumes for the logged-in user
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const resumes = await resumeService.findResumesByUser(userId);
    res.status(200).json({ data: resumes });
  } catch (error) {
    next(error);
  }
};

// Update a resume
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { id: resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new CustomError('Invalid resume ID format.', 'BAD_REQUEST', 400);
    }

    const updateData = validate(UpdateResumeSchema, req.body);
    const updatedResume = await resumeService.updateResume(
      userId,
      resumeId,
      updateData
    );
    res.status(200).json({ data: updatedResume });
  } catch (error) {
    next(error);
  }
};

// Delete a resume
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const resumeId = req.params.id;
    await resumeService.deleteResume(userId, resumeId);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    next(error);
  }
};

// Analyze resume keywords against a job description
export const analyzeKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription } = req.body;

    if (!jobDescription) {
      throw new CustomError(
        'Job description is required.',
        'VALIDATION_ERROR',
        400
      );
    }

    // This part can also be moved to the service layer later
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) {
      throw new CustomError('Resume not found.', 'NOT_FOUND', 404);
    }

    const extractKeywords = (text: string) => {
      return text.toLowerCase().match(/\b(\w{3,})\b/g) || [];
    };

    const jobKeywords = new Set(extractKeywords(jobDescription));
    const resumeText = JSON.stringify(resume.toObject());
    const resumeKeywords = new Set(extractKeywords(resumeText));
    const missingKeywords = [...jobKeywords].filter(
      (k) => !resumeKeywords.has(k)
    );
    const presentKeywords = [...jobKeywords].filter((k) =>
      resumeKeywords.has(k)
    );

    res.status(200).json({
      success: true,
      data: {
        requiredKeywords: [...jobKeywords],
        presentKeywords,
        missingKeywords,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Score a resume based on completeness and other metrics
export const scoreResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeId } = req.params;
    const resume = await ResumeModel.findById(resumeId);
    if (!resume) {
      throw new CustomError('Resume not found.', 'NOT_FOUND', 404);
    }
    const { score, feedback } = resumeService.calculateScore(resume.toObject());
    res.status(200).json({ success: true, data: { score, feedback } });
  } catch (error) {
    next(error);
  }
};

// =======================================================
// Hardened Share Link Functions
// =======================================================

export const createShareLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeId, template } = req.body;
    const userId = req.user!.userId;

    // 1. Validate environment variable
    if (!process.env.APP_URL) {
      console.error('FATAL ERROR: APP_URL environment variable is not set.');
      throw new CustomError('Server configuration error.', 'SERVER_ERROR', 500);
    }

    // 2. Use service to find resume and check ownership
    const resume = await resumeService.findResumeById(userId, resumeId);
    if (!resume) {
      throw new CustomError(
        'Resume not found or you do not have permission.',
        'NOT_FOUND',
        404
      );
    }

    // 3. Generate token and create link
    const token = randomBytes(16).toString('hex');
    await sharelinkModel.create({
      token,
      resumeData: resume.toObject(),
      template,
    });

    res.status(201).json({
      success: true,
      link: `${process.env.APP_URL}/share/${token}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const share = await sharelinkModel.findOne({ token });

    if (!share) {
      throw new CustomError(
        'Share link not found or has expired.',
        'NOT_FOUND',
        404
      );
    }

    res.status(200).json({
      resumeData: share.resumeData,
      template: share.template,
    });
  } catch (error) {
    next(error);
  }
};
