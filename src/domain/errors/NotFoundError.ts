/**
 * NotFoundError
 *
 * Raised when an entity cannot be located by its identifier.
 *
 * Layer: Domain.
 */

import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} with identifier "${identifier}" was not found.`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
