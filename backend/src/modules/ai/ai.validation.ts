// src/modules/ai/ai.validation.ts
import { z } from 'zod';

const experienceLevels = [
  'entry-level',
  'mid-level',
  'senior',
  'executive',
] as const;

export const GenerateSummarySchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(1, { message: 'Job title is required and cannot be empty.' }),
  yearsExperience: z.string().trim().min(1, {
    message: 'Years of experience are required and cannot be empty.',
  }),
  experienceLevel: z.enum(experienceLevels),
  keySkills: z.string().optional(),
  careerHighlights: z.string().optional(),
  targetJobDescription: z.string().optional(),
  achievements: z.string().optional(),
});

// New schema for generating experience bullet points
export const GenerateExperienceSchema = z.object({
  jobTitle: z.string().trim().min(1, 'Job Title is required.'),
  company: z.string().trim().min(1, 'Company name is required.'),
  // Optional: add context for more tailored bullet points
  industry: z.string().optional(),
  yearsExperience: z.string().optional(),
  previousResponsibilities: z.string().optional(), // Existing bullet points or context
  targetSkills: z.string().optional(),
});

export const GenerateJobDescriptionSchema = z.object({
  jobTitle: z.string().trim().min(1, { message: 'Job Title is required.' }),
  company: z.string().trim().min(1, { message: 'Company name is required.' }),
  industry: z.string().optional(),
  yearsExperience: z.string().optional(),
  responsibilities: z.string().optional(),
  targetSkills: z.string().optional(),
});
