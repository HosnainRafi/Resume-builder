// src/modules/resumes/resume.service.ts

import { ResumeModel } from './resume.model';
import { CustomError } from '../../middleware/error-handler';
import { z } from 'zod'; // Assuming Zod is used elsewhere in this service
import { CreateResumeSchema, UpdateResumeSchema } from './resume.validation'; // Assuming Zod schemas are here
import { IResume } from './resume.interface'; // Assuming interface is defined

// Type Definitions for Service Inputs - (Assuming they are already defined or can be inferred)
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
export const findResumesByUser = async (uid: string): Promise<IResume[]> => {
  // START: Diagnostic Logging - you can remove this in production
  console.log('--- [START] Executing findResumesByUser Service ---');
  console.log(
    `Step 1: Received request to find resumes for Firebase UID: "${uid}"`
  );
  // Step 2: Executing the database query
  console.log(
    `Step 2: Querying the 'resumes' collection for documents where user === "${uid}"`
  );
  const resumes = await ResumeModel.find({ user: uid }).sort({
    updatedAt: -1,
  });
  // Step 3: Logging the results of the query
  console.log(
    `Step 3: Database query finished. Found ${resumes.length} document(s).`
  );
  if (resumes.length > 0) {
    const titles = resumes.map((r) => r.title);
    console.log(` - Resume titles found: [${titles.join(', ')}]`);
  } else {
    console.log(
      ' - IMPORTANT: This means no resume documents in your database have a "user" field that matches the provided Firebase UID.'
    );
  }
  console.log('--- [END] Finished findResumesByUser Service ---');
  // END: Diagnostic Logging
  return resumes;
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
): Promise<IResume | null> => {
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

// Set of strong action verbs for scoring
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

/**
 * Calculates a resume score based on several rules, estimating ATS-friendliness and completeness.
 * This is similar to Rezi.ai's scoring, based on common resume best practices.
 * @param resume The resume object to score (can be plain object from .toObject()).
 * @returns An object containing the score (0-100) and an array of feedback messages.
 */
export const calculateScore = (resume: any) => {
  let score = 0;
  const feedback: string[] = [];

  // Rule 1: Header completeness (+10 points)
  if (resume.header?.name && resume.header?.email) {
    score += 10;
  } else {
    feedback.push('Add your name and email to the header.');
  }

  // Rule 2: Professional Summary (presence and length) (+15 points)
  if (
    resume.summary &&
    resume.summary.length >= 50 &&
    resume.summary.length <= 400
  ) {
    // Approx 2-4 sentences
    score += 15;
  } else if (resume.summary && resume.summary.length > 0) {
    feedback.push(
      'Ensure your professional summary is concise (2-4 sentences) and impactful.'
    );
    score += 5; // Partial points for presence
  } else {
    feedback.push(
      'A strong professional summary is missing. It should highlight your key qualifications and career goals.'
    );
  }

  // Rule 3: Experience section (+20 points base)
  if (resume.experience && resume.experience.length > 0) {
    score += 20;

    // Rule 3a: Quantifiable achievements (+10 points) - checks for numbers in descriptions
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

    // Rule 3b: Action Verbs (+10 points) - checks if descriptions start with strong verbs
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

  // Rule 4: Education section (+10 points)
  if (resume.education && resume.education.length > 0) {
    score += 10;
  } else {
    feedback.push('Add at least one entry to your education section.');
  }

  // Rule 5: Skills section (+10 points)
  if (resume.skills && resume.skills.length >= 5) {
    score += 10;
  } else if (resume.skills && resume.skills.length > 0) {
    score += 5;
    feedback.push(
      'Aim for at least 5-10 key skills in your skills section for better ATS matching.'
    );
  } else {
    feedback.push(
      'The skills section is empty. Add your most relevant technical and soft skills.'
    );
  }

  // Rule 6: Projects section (optional bonus +5 points)
  if (resume.projects && resume.projects.length > 0) {
    score += 5;
  } else {
    feedback.push(
      'Consider adding a projects section to showcase practical experience.'
    );
  }

  // Rule 7: Conciseness (bonus +5 points) - simple length check
  const resumeTextLength = JSON.stringify(resume).length;
  if (resumeTextLength < 8000) {
    // A rough estimation, adjust as needed. Max 1-2 pages of text.
    score += 5;
  } else {
    feedback.push(
      'Your resume seems quite long. Aim for conciseness and clarity, typically 1-2 pages.'
    );
  }

  // Final keyword analysis integration (from analyzeResumeKeywords service)
  // This rule would typically require a job description, so it's often a separate feature.
  // For a holistic score like Rezi, you might prompt user for target job description.
  // For now, it's covered by the "KeywordAnalyzer" component on frontend.

  // Ensure the score does not exceed 100
  score = Math.min(score, 100);
  return { score, feedback };
};

/**
 * Analyzes resume keywords against a job description.
 * This is kept separate from `calculateScore` as it requires an external input (jobDescription).
 * @param resumeId The ID of the resume to analyze.
 * @param jobDescription The job description text to match against.
 * @returns Object with required, present, and missing keywords.
 */
export const analyzeResumeKeywords = async (
  resumeId: string,
  jobDescription: string
) => {
  const resume = await ResumeModel.findById(resumeId);
  if (!resume) {
    throw new CustomError('Resume not found.', 'NOT_FOUND', 404);
  }

  const extractKeywords = (text: string) => {
    // A more sophisticated extraction would involve NLP, but this is a good start
    return text.toLowerCase().match(/\b(\w{3,})\b/g) || [];
  };

  const jobKeywords = new Set(extractKeywords(jobDescription));
  const resumeText = JSON.stringify(resume.toObject()); // Convert Mongoose doc to plain object for keywords
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const missingKeywords = [...jobKeywords].filter(
    (k) => !resumeKeywords.has(k)
  );
  const presentKeywords = [...jobKeywords].filter((k) => resumeKeywords.has(k));

  return {
    requiredKeywords: [...jobKeywords], // All keywords from job description
    presentKeywords, // Keywords found in resume
    missingKeywords, // Keywords missing from resume
  };
};
