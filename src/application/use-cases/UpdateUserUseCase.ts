/**
 * UpdateUserUseCase
 *
 * Applies partial updates (name, email) to an existing User.
 *
 * Layer: Application.
 */

import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { UserUniquenessService } from '../../domain/services/UserUniquenessService';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { UpdateUserDto, UserResponseDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

export class UpdateUserUseCase {
  private readonly uniquenessService: UserUniquenessService;

  constructor(private readonly userRepository: IUserRepository) {
    this.uniquenessService = new UserUniquenessService(userRepository);
  }

  async execute(dto: UpdateUserDto): Promise<UserResponseDto> {
    const id = UserId.create(dto.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', dto.id);
    }

    if (dto.name !== undefined) {
      user.changeName(dto.name);
    }

    if (dto.email !== undefined) {
      const newEmail = Email.create(dto.email);
      await this.uniquenessService.assertEmailIsUniqueExcluding(
        newEmail,
        user.email,
      );
      user.changeEmail(newEmail);
    }

    await this.userRepository.update(user);

    return UserMapper.toResponseDto(user);
  }
}
