// src/modules/resumes/resume.validation.ts

import { z } from 'zod';

// --- FIX 1: Create a reusable schema for URLs that can also be empty strings ---
const OptionalUrlSchema = z
  .union([z.string().url(), z.literal('')])
  .optional()
  .default('');

const HeaderSchema = z.object({
  name: z.string().optional().default(''),
  email: z.string().email().optional().default(''),
  phone: z.string().optional().default(''),
  linkedin: OptionalUrlSchema,
  github: OptionalUrlSchema,
  website: OptionalUrlSchema,
  location: z.string().optional().default(''),
});

const ExperienceSchema = z.object({
  company: z.string().optional().default(''),
  jobTitle: z.string().optional().default(''), // Change from 'role' to 'jobTitle'
  location: z.string().optional().default(''), // Add location field
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  description: z.string().optional().default(''),
  industry: z.string().optional().default(''), // Add industry field for AI
  aiGenerated: z.boolean().optional().default(false), // Add AI flag
});
const EducationSchema = z.object({
  institution: z.string().optional().default(''),
  degree: z.string().optional().default(''),
  fieldOfStudy: z.string().optional().default(''),
  graduationYear: z.string().optional().default(''),
});

const ProjectSchema = z.object({
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
  url: OptionalUrlSchema, // Use the new flexible URL schema
});

// Main schema for creating a new resume
export const CreateResumeSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  header: HeaderSchema.optional(),
  summary: z.string().optional().default(''),
  experience: z.array(ExperienceSchema).optional().default([]),
  education: z.array(EducationSchema).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  template: z.string().optional().default('default'),
});

// Update schema uses .partial() to make all fields optional for updates
export const UpdateResumeSchema = CreateResumeSchema.partial();
