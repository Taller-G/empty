/**
 * ListUsersUseCase
 *
 * Returns a list of users, optionally filtered to active-only records.
 *
 * Layer: Application.
 */

import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { ListUsersDto, UserResponseDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: ListUsersDto): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll(dto.onlyActive);
    return UserMapper.toResponseDtoList(users);
  }
}
