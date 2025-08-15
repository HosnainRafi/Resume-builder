// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { firebaseAuthMiddleware } from '../../middleware/firebase-auth.middleware';
import { getMe } from './auth.controller';

const router = Router();

// This is the only route this module needs. It fetches the user's
// profile from our local DB after they've been authenticated by Firebase.
// The frontend can call this route on app startup to get user details.
router.get('/me', firebaseAuthMiddleware, getMe);

export default router;
