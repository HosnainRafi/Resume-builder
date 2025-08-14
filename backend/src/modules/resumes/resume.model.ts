import { Schema, model } from 'mongoose';
import { IResume } from './resume.interface';
import { basePlugin } from '../../utils/mongoose.plugins';

// --- Sub-document Schemas ---
const experienceSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    // FIX: Changed from Date to String to match frontend data
    startDate: { type: String },
    endDate: { type: String },
    // FIX: Changed from an array of strings to a single string
    description: { type: String },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    location: { type: String },
    // FIX: Changed from Date to String
    graduationDate: { type: String },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    technologies: { type: String },
    link: { type: String },
  },
  { _id: false }
);

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
  // FIX: Changed from [skillSchema] to a simple array of strings
  skills: [String],
  projects: [projectSchema],
});

// Apply the base plugin for timestamps and virtuals
resumeSchema.plugin(basePlugin);

export const ResumeModel = model<IResume>('Resume', resumeSchema);
