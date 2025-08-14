import { Document } from 'mongoose';
import { IUser } from '../users/user.interface';

// --- Sub-document Interfaces ---

export interface IExperience extends Document {
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description: string[]; // Array of bullet points
}

export interface IEducation extends Document {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  gpa?: number;
}

export interface ISkill extends Document {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface IProject extends Document {
  name: string;
  description: string[];
  url?: string;
}

// --- Main Resume Interface ---

export interface IResume extends Document {
  title: string;
  user: IUser['_id']; // Reference to the user who owns the resume
  templateId?: string; // Optional reference to a Template
  header: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    location?: string;
  };
  summary?: string;
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  projects: IProject[];
  createdAt: Date;
  updatedAt: Date;
}
