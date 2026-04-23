/**
 * errorHandler — Global Express error-handling middleware
 *
 * Translates domain/application errors into appropriate HTTP responses.
 * Business meaning lives in the domain; HTTP status codes live here.
 *
 * Layer: Interfaces.
 */

import type { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/DomainError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { ConflictError } from '../../../domain/errors/ConflictError';

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let response: ApiError;

  if (err instanceof NotFoundError) {
    response = {
      error: 'NOT_FOUND',
      message: err.message,
      statusCode: 404,
    };
  } else if (err instanceof ConflictError) {
    response = {
      error: 'CONFLICT',
      message: err.message,
      statusCode: 409,
    };
  } else if (err instanceof DomainError) {
    response = {
      error: 'UNPROCESSABLE_ENTITY',
      message: err.message,
      statusCode: 422,
    };
  } else if (err instanceof Error) {
    const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;
    response = {
      error: 'INTERNAL_SERVER_ERROR',
      message:
        process.env['NODE_ENV'] === 'production'
          ? 'An unexpected error occurred.'
          : err.message,
      statusCode,
    };
  } else {
    response = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
      statusCode: 500,
    };
  }

  if (response.statusCode >= 500) {
    console.error('[errorHandler]', err);
  }

  res.status(response.statusCode).json({
    error: response.error,
    message: response.message,
  });
}
