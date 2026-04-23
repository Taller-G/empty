/**
 * Email Value Object
 *
 * Immutable. Equality by value. Encapsulates email validation rules
 * so they never need to be duplicated across the codebase.
 *
 * Layer: Domain — zero external dependencies.
 */

import { DomainError } from '../errors/DomainError';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Factory method — validates and normalises the raw string.
   */
  static create(rawEmail: string): Email {
    if (!rawEmail || rawEmail.trim().length === 0) {
      throw new DomainError('Email address cannot be empty.');
    }

    const normalised = rawEmail.trim().toLowerCase();

    if (!Email.isValid(normalised)) {
      throw new DomainError(`"${rawEmail}" is not a valid email address.`);
    }

    return new Email(normalised);
  }

  private static isValid(email: string): boolean {
    // RFC-5322 simplified — covers the vast majority of real-world addresses.
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email) && email.length <= 254;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
