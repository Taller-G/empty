/**
 * UserUniquenessService — Domain Service
 *
 * Handles business logic that spans multiple aggregates or requires
 * cross-entity coordination — in this case, enforcing that email
 * addresses are unique across all User records.
 *
 * This service depends on IUserRepository (an abstraction) not an
 * implementation, keeping it firmly in the domain layer.
 *
 * Layer: Domain — imports only from domain/.
 */

import type { IUserRepository } from '../repositories/IUserRepository';
import type { Email } from '../value-objects/Email';
import { DomainError } from '../errors/DomainError';

export class UserUniquenessService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Throws a DomainError if the email is already in use.
   */
  async assertEmailIsUnique(email: Email): Promise<void> {
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new DomainError(`A user with email "${email.value}" already exists.`);
    }
  }

  /**
   * Same check but for update flows — ignores the user that owns the email.
   */
  async assertEmailIsUniqueExcluding(
    email: Email,
    excludedEmail: Email,
  ): Promise<void> {
    if (email.equals(excludedEmail)) {
      // Same email — no conflict possible.
      return;
    }
    await this.assertEmailIsUnique(email);
  }
}
