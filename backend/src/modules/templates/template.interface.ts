import { Document } from 'mongoose';

export interface ITemplate extends Document {
  id: string;
  name: string;
  layout: Record<string, any>; // JSON defining the template structure
  cssTokens: Record<string, string>; // CSS variables/tokens
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
