/**
 * UserMapper
 *
 * Converts domain entities to output DTOs.
 * Keeps serialisation logic out of entities and controllers.
 *
 * Layer: Application — imports from domain/ only.
 */

import type { User } from '../../domain/entities/User';
import type { UserResponseDto } from '../dtos/UserDto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(users: User[]): UserResponseDto[] {
    return users.map(UserMapper.toResponseDto);
  }
}
