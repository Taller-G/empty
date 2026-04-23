/**
 * requestLogger — HTTP request logging middleware
 *
 * Configures morgan for structured request logging.
 *
 * Layer: Interfaces.
 */

import morgan from 'morgan';
import type { RequestHandler } from 'express';

export function createRequestLogger(): RequestHandler {
  const format =
    process.env['NODE_ENV'] === 'production'
      ? 'combined'
      : ':method :url :status :response-time ms - :res[content-length]';

  return morgan(format);
}
