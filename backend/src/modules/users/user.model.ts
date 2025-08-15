// src/modules/users/user.model.ts

import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    // This will now match the IUser interface correctly
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String },
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    lastActiveAt: { type: Date, default: Date.now },
    refreshTokenRotationCounter: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', userSchema);
