/**
 * ConflictError
 *
 * Raised when an operation cannot complete because it would violate
 * a uniqueness or state constraint (e.g. duplicate email).
 *
 * Layer: Domain.
 */

import { DomainError } from './DomainError';

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
