/**
 * User Entity
 *
 * Core business entity representing a registered user in the system.
 * Protects its own invariants — all validation lives inside the constructor
 * and mutating methods.
 *
 * Layer: Domain — no imports from application, infrastructure, or interfaces.
 */

import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';
import { DomainError } from '../errors/DomainError';

export interface UserProps {
  id: UserId;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateUserProps {
  id: UserId;
  name: string;
  email: Email;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export class User {
  private readonly _id: UserId;
  private _name: string;
  private _email: Email;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Factory method — the only way to construct a valid User.
   */
  static create(props: CreateUserProps): User {
    User.validateName(props.name);

    const now = new Date();
    return new User({
      id: props.id,
      name: props.name.trim(),
      email: props.email,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  // ─── Invariant guards ────────────────────────────────────────────────────────

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('User name cannot be empty.');
    }
    if (name.trim().length < 2) {
      throw new DomainError('User name must be at least 2 characters long.');
    }
    if (name.trim().length > 100) {
      throw new DomainError('User name must not exceed 100 characters.');
    }
  }

  // ─── Behaviour ───────────────────────────────────────────────────────────────

  changeName(newName: string): void {
    User.validateName(newName);
    this._name = newName.trim();
    this._updatedAt = new Date();
  }

  changeEmail(newEmail: Email): void {
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new DomainError('User is already inactive.');
    }
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    if (this._isActive) {
      throw new DomainError('User is already active.');
    }
    this._isActive = true;
    this._updatedAt = new Date();
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  get id(): UserId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ─── Equality ────────────────────────────────────────────────────────────────

  equals(other: User): boolean {
    return this._id.equals(other._id);
  }
}
