import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { basePlugin } from '../../utils/mongoose.plugins';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  planLimits: {
    aiGenerations: { type: Number, default: 20 },
  },
  lastActiveAt: { type: Date, default: Date.now },
  refreshTokenRotationCounter: { type: Number, default: 0 }, // <-- NEW FIELD for refresh token rotation
});

userSchema.plugin(basePlugin);

export const UserModel = model<IUser>('User', userSchema);
