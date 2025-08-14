import { Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  plan: 'free' | 'premium';
  planLimits: {
    aiGenerations: number;
    // other limits can go here
  };
  lastActiveAt: Date;
  refreshTokenRotationCounter: number; // <-- NEW FIELD
  createdAt: Date;
  updatedAt: Date;
}
