/**
 * healthRoutes — Liveness / readiness endpoints
 *
 * Used by load balancers, container orchestrators, and monitoring tools.
 *
 * Layer: Interfaces.
 */

import { Router, type Request, type Response } from 'express';
import { postgresClient } from '../../../infrastructure/container';

const router = Router();

// GET /health — liveness probe (app is running)
router.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'dasdasdd',
  });
});

// GET /health/ready — readiness probe (dependencies are reachable)
router.get('/ready', async (_req: Request, res: Response): Promise<void> => {
  const dbHealthy = await postgresClient.healthCheck();

  if (!dbHealthy) {
    res.status(503).json({
      status: 'unavailable',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: 'unhealthy',
      },
    });
    return;
  }

  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: 'healthy',
    },
  });
});

export { router as healthRouter };
