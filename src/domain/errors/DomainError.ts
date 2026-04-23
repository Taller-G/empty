/**
 * DomainError
 *
 * Base class for all errors that originate from broken domain invariants.
 * Use this (or subclasses) to signal business-rule violations.
 *
 * Layer: Domain.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    // Maintains proper prototype chain in transpiled ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
