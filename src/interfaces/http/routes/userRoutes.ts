/**
 * userRoutes — Express router for /users endpoints
 *
 * Attaches Zod validation middleware to mutating routes and maps
 * HTTP verbs + paths to the UserController handler methods.
 *
 * Layer: Interfaces.
 */

import { Router } from 'express';
import { z } from 'zod';
import { UserController } from '../controllers/UserController';
import { validateBody } from '../middleware/validateBody';
import {
  createUserUseCase,
  getUserByIdUseCase,
  listUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase,
} from '../../../infrastructure/container';

// ─── Validation schemas ───────────────────────────────────────────────────────

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'At least one of "name" or "email" must be provided.',
  });

// ─── Controller instance ──────────────────────────────────────────────────────

const controller = new UserController(
  createUserUseCase,
  getUserByIdUseCase,
  listUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase,
);

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

router.post('/', validateBody(createUserSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id', validateBody(updateUserSchema), controller.update);
router.delete('/:id', controller.remove);

export { router as userRouter };
