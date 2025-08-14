import { z } from 'zod';

const experienceSchema = z.object({
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  company: z.string().trim().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
  description: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required'),
  degree: z.string().trim().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  gpa: z.number().optional(),
});

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
});

const projectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.array(z.string()).optional(),
  url: z.string().url('Must be a valid URL').optional(),
});

export const CreateResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .default('Untitled Resume'),
  header: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
  }),
  summary: z.string().optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

export const UpdateResumeSchema = CreateResumeSchema.partial(); // All fields are optional for updates
