import { ResumeModel } from './resume.model';
import { CustomError } from '../../middleware/error-handler';
import { z } from 'zod';
import { CreateResumeSchema, UpdateResumeSchema } from './resume.validation';
import { IResume } from './resume.interface';

// --- Type Definitions for Service Inputs ---
// Use z.infer to create TypeScript types directly from our Zod schemas.
// This ensures the service layer expects the exact shape of the validated data.
type ResumeCreateData = z.infer<typeof CreateResumeSchema>;
type ResumeUpdateData = z.infer<typeof UpdateResumeSchema>;

/**
 * Creates a new resume for a user.
 * @param userId The ID of the user creating the resume.
 * @param resumeData The validated, plain object data for the new resume.
 * @returns The newly created resume document.
 */
export const createResume = async (
  userId: string,
  resumeData: ResumeCreateData
): Promise<IResume> => {
  const newResume = new ResumeModel({
    ...resumeData,
    user: userId, // Ensure the resume is linked to the user
  });
  await newResume.save();
  return newResume;
};

/**
 * Finds a single resume by its ID, ensuring it belongs to the specified user.
 * @param userId The ID of the user requesting the resume.
 * @param resumeId The ID of the resume to find.
 * @returns The resume document or null if not found or not owned by the user.
 */
export const findResumeById = async (
  userId: string,
  resumeId: string
): Promise<IResume | null> => {
  const resume = await ResumeModel.findOne({ _id: resumeId, user: userId });
  return resume;
};

/**
 * Finds all resumes belonging to a specific user.
 * @param userId The ID of the user whose resumes to find.
 * @returns An array of resume documents.
 */
export const findResumesByUser = async (userId: string): Promise<IResume[]> => {
  return ResumeModel.find({ user: userId }).sort({ updatedAt: -1 });
};

/**
 * Updates a resume.
 * @param userId The ID of the owner user.
 * @param resumeId The ID of the resume to update.
 * @param updateData The validated, plain object data for the update.
 * @returns The updated resume document.
 */
export const updateResume = async (
  userId: string,
  resumeId: string,
  updateData: ResumeUpdateData
): Promise<IResume> => {
  const resume = await ResumeModel.findOneAndUpdate(
    { _id: resumeId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!resume) {
    throw new CustomError(
      'Resume not found or user not authorized.',
      'NOT_FOUND',
      404
    );
  }
  return resume;
};

/**
 * Deletes a resume.
 * @param userId The ID of the owner user.
 * @param resumeId The ID of the resume to delete.
 */
export const deleteResume = async (
  userId: string,
  resumeId: string
): Promise<void> => {
  const result = await ResumeModel.deleteOne({ _id: resumeId, user: userId });

  if (result.deletedCount === 0) {
    throw new CustomError(
      'Resume not found or user not authorized.',
      'NOT_FOUND',
      404
    );
  }
};
