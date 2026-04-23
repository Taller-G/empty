/**
 * DeleteUserUseCase
 *
 * Hard-deletes a User by ID after confirming they exist.
 *
 * Layer: Application.
 */

import { UserId } from '../../domain/value-objects/UserId';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { DeleteUserDto } from '../dtos/UserDto';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: DeleteUserDto): Promise<void> {
    const id = UserId.create(dto.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', dto.id);
    }

    await this.userRepository.delete(id);
  }
}
