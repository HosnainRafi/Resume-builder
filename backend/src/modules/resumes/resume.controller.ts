// src/modules/resumes/resume.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as resumeService from './resume.service'; // Contains calculateScore
import { CreateResumeSchema, UpdateResumeSchema } from './resume.validation';
import { CustomError } from '../../middleware/error-handler';
import { z, ZodError, ZodSchema } from 'zod';
import mongoose from 'mongoose';
import { ResumeModel } from './resume.model';
import sharelinkModel from './sharelink.model';
import { randomBytes } from 'crypto';

// Generic validation utility (assuming it's used elsewhere in this controller)
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
    const uid = req.user!.uid;
    const resumeData = CreateResumeSchema.parse(req.body);
    const newResume = await resumeService.createResume(uid, resumeData);
    res.status(201).json({ data: newResume });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        'Zod Validation Error:',
        JSON.stringify(error.flatten(), null, 2)
      );
      return next(
        new CustomError(
          'Validation failed. Please check the provided data.',
          'VALIDATION_FAILED',
          400,
          error.flatten()
        )
      );
    }
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
    const uid = req.user!.uid;
    const { id: resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new CustomError('Invalid resume ID format.', 'BAD_REQUEST', 400);
    }
    const resume = await resumeService.findResumeById(uid, resumeId);
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
    const uid = req.user!.uid;
    const resumes = await resumeService.findResumesByUser(uid);
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
    const uid = req.user!.uid;
    const { id: resumeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new CustomError('Invalid resume ID format.', 'BAD_REQUEST', 400);
    }
    const updateData = validate(UpdateResumeSchema, req.body);
    const updatedResume = await resumeService.updateResume(
      uid,
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
    const uid = req.user!.uid;
    const resumeId = req.params.id;
    await resumeService.deleteResume(uid, resumeId);
    res.status(204).send();
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

    // Ensure resume is found before attempting analysis (logic moved to service)
    const analysisResult = await resumeService.analyzeResumeKeywords(
      resumeId,
      jobDescription
    );

    res.status(200).json({
      success: true,
      data: analysisResult, // Directly return the result from service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to score a resume based on completeness, best practices, and ATS-friendliness.
 * This function utilizes the `calculateScore` from resumeService.
 */
export const scoreResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeId } = req.params;
    const resume = await ResumeModel.findById(resumeId); // Fetch the resume document

    if (!resume) {
      throw new CustomError('Resume not found.', 'NOT_FOUND', 404);
    }

    // Call the calculateScore function from your resume service
    const { score, feedback } = resumeService.calculateScore(resume.toObject()); // Pass plain object

    res.status(200).json({
      success: true,
      data: {
        score,
        feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create Share Link
export const createShareLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeId, template } = req.body;
    const uid = req.user!.uid; // Use .uid from Firebase user object
    if (!process.env.APP_URL) {
      console.error('FATAL ERROR: APP_URL environment variable is not set.');
      throw new CustomError('Server configuration error.', 'SERVER_ERROR', 500);
    }

    const resume = await resumeService.findResumeById(uid, resumeId);
    if (!resume) {
      throw new CustomError(
        'Resume not found or you do not have permission.',
        'NOT_FOUND',
        404
      );
    }

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

// Get Shared Resume
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
