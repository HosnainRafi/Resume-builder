// src/modules/users/user.interface.ts

import { Document } from 'mongoose';

export interface IUser extends Document {
  // --- FIX: Add the firebaseUid property ---
  firebaseUid: string;

  email: string;
  name?: string;
  plan: 'free' | 'premium'; // Using a union type for better type safety

  // You can safely remove passwordHash now
  // passwordHash: string;

  lastActiveAt?: Date;
  refreshTokenRotationCounter?: number;
}
