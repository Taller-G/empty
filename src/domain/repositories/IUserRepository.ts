/**
 * IUserRepository — Repository Interface
 *
 * Describes WHAT persistence operations exist for User aggregates.
 * The HOW is implemented in the infrastructure layer.
 *
 * Layer: Domain — only imports from domain itself.
 */

import type { User } from '../entities/User';
import type { UserId } from '../value-objects/UserId';
import type { Email } from '../value-objects/Email';

export interface IUserRepository {
  /**
   * Persist a new User.
   */
  save(user: User): Promise<void>;

  /**
   * Persist changes to an existing User.
   */
  update(user: User): Promise<void>;

  /**
   * Find a User by their unique identifier.
   * Returns null when no user with that ID exists.
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Find a User by their email address.
   * Returns null when no user with that email exists.
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Retrieve all users (optionally restricted to active only).
   */
  findAll(onlyActive?: boolean): Promise<User[]>;

  /**
   * Hard-delete a user record by ID.
   */
  delete(id: UserId): Promise<void>;

  /**
   * Check whether a user with the given email already exists.
   */
  existsByEmail(email: Email): Promise<boolean>;
}
