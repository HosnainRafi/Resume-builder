import { Router } from 'express';
import { create, getById, getAll, update, remove } from './resume.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

router.post('/', create); // Create a new resume
router.get('/', getAll); // Get all resumes for a user
router.get('/:id', getById); // Get a single resume by its ID
router.patch('/:id', update); // Update a resume by its ID
router.delete('/:id', remove); // Delete a resume by its ID

export default router;
