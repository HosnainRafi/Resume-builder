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

const actionVerbs = new Set([
  'achieved',
  'created',
  'developed',
  'designed',
  'implemented',
  'launched',
  'led',
  'managed',
  'optimized',
  'pioneered',
  'reduced',
  'increased',
]);

// This function calculates a score based on a set of rules.
export const calculateScore = (resume: any) => {
  let score = 0;
  const feedback: string[] = [];

  // Rule 1: Header completeness (+10)
  if (resume.header?.name && resume.header?.email) {
    score += 10;
  } else {
    feedback.push('Add your name and email to the header.');
  }

  // Rule 2: Experience section (+20 points base)
  if (resume.experience && resume.experience.length > 0) {
    score += 20;

    // Rule 2a: Quantifiable achievements (+10) - checks for numbers in descriptions
    const hasNumbers = resume.experience.some((exp: any) =>
      /\d/.test(exp.description || '')
    );
    if (hasNumbers) {
      score += 10;
    } else {
      feedback.push(
        "Add measurable results to your experience (e.g., 'increased sales by 15%')."
      );
    }

    // Rule 2b: Action Verbs (+10) - checks if descriptions start with strong verbs
    const startsWithActionVerb = resume.experience.some((exp: any) => {
      const firstWord = exp.description
        ?.split(' ')[0]
        ?.toLowerCase()
        .replace(/[^a-z]/g, '');
      return firstWord && actionVerbs.has(firstWord);
    });
    if (startsWithActionVerb) {
      score += 10;
    } else {
      feedback.push(
        "Start your experience bullet points with strong action verbs (e.g., 'Developed', 'Managed')."
      );
    }
  } else {
    feedback.push(
      'Your resume is missing a work experience section. This is critical.'
    );
  }

  // Rule 3: Education section (+15)
  if (resume.education && resume.education.length > 0) {
    score += 15;
  } else {
    feedback.push('Add at least one entry to your education section.');
  }

  // Rule 4: Skills section (+15)
  if (resume.skills && resume.skills.length >= 5) {
    score += 15;
  } else if (resume.skills && resume.skills.length > 0) {
    score += 5;
    feedback.push(
      'Aim for at least 5 key skills in your skills section for a better score.'
    );
  } else {
    feedback.push(
      'The skills section is empty. Add your most relevant skills.'
    );
  }

  // Rule 5: Projects section (bonus +5)
  if (resume.projects && resume.projects.length > 0) {
    score += 5;
  }

  // Rule 6: Conciseness (bonus +5)
  const resumeText = JSON.stringify(resume);
  if (resumeText.length < 4000) {
    // Simple length check
    score += 5;
  } else {
    feedback.push(
      'Your resume seems a bit long. Aim for conciseness and clarity.'
    );
  }

  // Ensure the score does not exceed 100
  score = Math.min(score, 100);

  return { score, feedback };
};
