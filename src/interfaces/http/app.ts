/**
 * app.ts — Express application factory
 *
 * Creates and configures the Express application instance without
 * starting the HTTP server. Keeping these separate simplifies testing.
 *
 * Layer: Interfaces.
 */

import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { createRequestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { userRouter } from './routes/userRoutes';
import { healthRouter } from './routes/healthRoutes';

export function createApp(): Express {
  const app = express();

  // ─── Security headers ───────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:4200',
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // ─── Body parsing ────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Request logging ─────────────────────────────────────────────────────
  app.use(createRequestLogger());

  // ─── API routes ──────────────────────────────────────────────────────────
  const prefix = process.env['API_PREFIX'] ?? '/api/v1';

  app.use(`${prefix}/health`, healthRouter);
  app.use(`${prefix}/users`, userRouter);

  // ─── 404 catch-all ───────────────────────────────────────────────────────
  app.use((_req: Request, res: Response): void => {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: 'The requested route does not exist.',
    });
  });

  // ─── Global error handler ─────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
