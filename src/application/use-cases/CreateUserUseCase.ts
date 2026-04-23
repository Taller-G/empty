/**
 * CreateUserUseCase
 *
 * Orchestrates creating a new User:
 *   1. Validate that the email is not already in use (domain service).
 *   2. Construct the User entity (enforces invariants internally).
 *   3. Persist via the repository interface.
 *   4. Return a UserResponseDto.
 *
 * Layer: Application — imports from domain/ and application/ only.
 */

import { v4 as uuidv4 } from 'uuid';

import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';
import { UserUniquenessService } from '../../domain/services/UserUniquenessService';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { CreateUserDto, UserResponseDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

export class CreateUserUseCase {
  private readonly uniquenessService: UserUniquenessService;

  constructor(private readonly userRepository: IUserRepository) {
    this.uniquenessService = new UserUniquenessService(userRepository);
  }

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Build value objects — throws DomainError on invalid input.
    const email = Email.create(dto.email);
    const id = UserId.create(uuidv4());

    // 2. Enforce uniqueness invariant.
    await this.uniquenessService.assertEmailIsUnique(email);

    // 3. Construct entity (internal invariants checked inside User.create).
    const user = User.create({
      id,
      name: dto.name,
      email,
    });

    // 4. Persist.
    await this.userRepository.save(user);

    // 5. Return DTO — never the entity.
    return UserMapper.toResponseDto(user);
  }
}
