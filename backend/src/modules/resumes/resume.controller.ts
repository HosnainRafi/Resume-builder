import { Request, Response, NextFunction } from 'express';
import * as resumeService from './resume.service';
import { CreateResumeSchema, UpdateResumeSchema } from './resume.validation';
import { CustomError } from '../../middleware/error-handler';
import { z, ZodSchema } from 'zod';
import mongoose from 'mongoose';

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
    const { id: resumeId } = req.params; // <-- Destructure and rename

    // --- FIX: VALIDATE THE ID ---
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
    const { id: resumeId } = req.params; // <-- Destructure and rename

    // --- FIX: VALIDATE THE ID ---
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
