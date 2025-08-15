// src/modules/resumes/resume.model.ts

import { Schema, model } from 'mongoose';
import { IResume } from './resume.interface';

const resumeSchema = new Schema<IResume>(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    header: {
      name: String,
      email: String,
      phone: String,
      linkedin: String,
      github: String,
      website: String,
      location: String,
    },
    summary: String,
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: String,
      },
    ],
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        url: String,
      },
    ],
    template: {
      type: String,
      default: 'default',
    },
  },
  {
    timestamps: true,
  }
);

// --- FIX: Use a named export for the model ---
export const ResumeModel = model<IResume>('Resume', resumeSchema);
