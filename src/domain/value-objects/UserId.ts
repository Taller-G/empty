/**
 * UserId Value Object
 *
 * Wraps a UUID string to give identity a first-class type in the domain.
 * Prevents accidentally passing any string where an ID is expected.
 *
 * Layer: Domain — zero external dependencies.
 */

import { DomainError } from '../errors/DomainError';

export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new DomainError('UserId cannot be empty.');
    }

    if (!UserId.isValidUuid(value)) {
      throw new DomainError(`"${value}" is not a valid UUID.`);
    }

    return new UserId(value.toLowerCase());
  }

  /**
   * Use when generating a brand-new ID (delegates to the caller for UUID gen).
   */
  static fromString(value: string): UserId {
    return UserId.create(value);
  }

  private static isValidUuid(value: string): boolean {
    const pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return pattern.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
