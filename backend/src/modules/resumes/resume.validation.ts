import { z } from 'zod';

// Schema for a single experience entry
const ExperienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Schema for a single education entry
const EducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
});

// Schema for a single project entry
const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.string().optional(),
  link: z.string().optional(),
});

// Main schema for creating a new resume
export const CreateResumeSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  header: z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional(),
    website: z
      .string()
      .url({ message: 'Invalid URL format' })
      .optional()
      .or(z.literal('')),
  }),
});

// Schema for updating an existing resume. Most fields are optional.
export const UpdateResumeSchema = z.object({
  title: z.string().optional(),
  header: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(ProjectSchema).optional(),
});

// Infer TypeScript types from the schemas
export type CreateResumeDto = z.infer<typeof CreateResumeSchema>;
export type UpdateResumeDto = z.infer<typeof UpdateResumeSchema>;
