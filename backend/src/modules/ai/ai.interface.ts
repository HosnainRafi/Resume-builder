// src/modules/ai/ai.interface.ts

// Existing summary request interface
export interface ISummaryRequest {
  jobTitle: string;
  yearsExperience: string;
  experienceLevel: 'entry-level' | 'mid-level' | 'senior' | 'executive';
  keySkills?: string;
  careerHighlights?: string;
  targetJobDescription?: string;
  achievements?: string;
}

// New interface for experience generation request
export interface IExperienceRequest {
  jobTitle: string;
  company: string;
  industry?: string;
  yearsExperience?: string;
  previousResponsibilities?: string;
  targetSkills?: string;
}
