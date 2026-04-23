/**
 * validateBody — Zod schema validation middleware factory
 *
 * Validates request bodies against a Zod schema and returns 400 on failure.
 * Only schema/shape validation happens here — business rules stay in domain.
 *
 * Layer: Interfaces.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { type ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request body validation failed.',
        details: errors,
      });
      return;
    }

    req.body = result.data as Record<string, unknown>;
    next();
  };
}
