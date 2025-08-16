// src/modules/resumes/resume.interface.ts

import { Document } from 'mongoose';

// Define the structure of the nested objects for better type safety
interface IHeader {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

interface IExperience {
  company?: string;
  jobTitle?: string; // Change from 'role' to 'jobTitle'
  location?: string; // Add location
  startDate?: string;
  endDate?: string;
  description?: string;
  industry?: string; // Add industry
  aiGenerated?: boolean; // Add AI flag
}

interface IEducation {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
}

interface IProject {
  name?: string;
  description?: string;
  url?: string;
}

// Main Resume Interface
export interface IResume extends Document {
  user: string;
  title: string;
  header?: IHeader;
  summary?: string;
  experience?: IExperience[];
  education?: IEducation[];
  skills?: string[];
  projects?: IProject[];

  // --- FIX: Add the optional template property to match the schema ---
  template?: string;
}
