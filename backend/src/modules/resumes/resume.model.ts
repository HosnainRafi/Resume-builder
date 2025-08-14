import { Schema, model } from 'mongoose';
import {
  IResume,
  IExperience,
  IEducation,
  ISkill,
  IProject,
} from './resume.interface';
import { basePlugin } from '../../utils/mongoose.plugins';

// --- Sub-document Schemas ---

const experienceSchema = new Schema<IExperience>({
  jobTitle: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: [{ type: String, trim: true }],
});

const educationSchema = new Schema<IEducation>({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  gpa: { type: Number },
});

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true, trim: true },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
});

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  description: [{ type: String, trim: true }],
  url: { type: String, trim: true },
});

// --- Main Resume Schema ---

const resumeSchema = new Schema<IResume>({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Resume',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  templateId: { type: String, trim: true },
  header: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    location: { type: String },
  },
  summary: { type: String, trim: true },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
});

// Apply the base plugin for timestamps and virtuals
resumeSchema.plugin(basePlugin);

export const ResumeModel = model<IResume>('Resume', resumeSchema);
