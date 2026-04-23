/**
 * server.ts — HTTP server entry point
 *
 * Loads environment config, creates the Express app, starts listening,
 * and wires graceful shutdown for SIGTERM / SIGINT signals.
 *
 * Layer: Interfaces.
 */

import * as dotenv from 'dotenv';

// Load .env before any other imports that read process.env
dotenv.config();

import { createApp } from './http/app';
import { postgresClient } from '../infrastructure/container';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

const app = createApp();

const server = app.listen(PORT, () => {
  console.info(`[server] dasdasdd API running`);
  console.info(`[server] Environment : ${NODE_ENV}`);
  console.info(`[server] Port        : ${PORT}`);
  console.info(`[server] API prefix  : ${process.env['API_PREFIX'] ?? '/api/v1'}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

function shutdown(signal: string): void {
  console.info(`[server] ${signal} received — shutting down gracefully...`);

  server.close(async () => {
    console.info('[server] HTTP server closed.');
    await postgresClient.close();
    console.info('[server] Database pool closed. Goodbye.');
    process.exit(0);
  });

  // Force exit after 10 s if graceful shutdown stalls.
  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[server] Unhandled Promise rejection:', reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error('[server] Uncaught exception:', err);
  process.exit(1);
});

export default app;
