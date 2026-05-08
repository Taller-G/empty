/**
 * technologyRoutes — Express router for /technologies endpoints
 *
 * Provides endpoints to list technologies in a clear and readable format.
 * Following the existing project patterns for route definition.
 *
 * Layer: Interfaces.
 */

import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';

// ─── Controller instance ──────────────────────────────────────────────────────

const controller = new TechnologyController();

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

router.get('/', controller.list);

export { router as technologyRouter };