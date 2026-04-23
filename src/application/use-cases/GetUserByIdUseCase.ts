/**
 * GetUserByIdUseCase
 *
 * Fetches a single User by their UUID identifier.
 *
 * Layer: Application.
 */

import { UserId } from '../../domain/value-objects/UserId';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { GetUserByIdDto, UserResponseDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: GetUserByIdDto): Promise<UserResponseDto> {
    const id = UserId.create(dto.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', dto.id);
    }

    return UserMapper.toResponseDto(user);
  }
}
