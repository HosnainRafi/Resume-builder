import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
} from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware'; // Will create this next

const router = Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, getCurrentUser); // Protected route

export default router;
