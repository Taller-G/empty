/**
 * UserController
 *
 * Thin HTTP adapter for all User-related endpoints.
 * Pattern: validate input → call use case → serialize output.
 * Zero business logic lives here.
 *
 * Layer: Interfaces — imports from application/ only.
 */

import type { Request, Response, NextFunction } from 'express';
import type { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { GetUserByIdUseCase } from '../../../application/use-cases/GetUserByIdUseCase';
import type { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import type { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import type { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';

export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  // POST /users
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUser.execute({
        name: req.body.name as string,
        email: req.body.email as string,
      });
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  // GET /users
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const onlyActive = req.query['onlyActive'] === 'true';
      const result = await this.listUsers.execute({ onlyActive });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  // GET /users/:id
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUserById.execute({ id: req.params['id'] ?? '' });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  // PATCH /users/:id
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateUser.execute({
        id: req.params['id'] ?? '',
        name: req.body.name as string | undefined,
        email: req.body.email as string | undefined,
      });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /users/:id
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUser.execute({ id: req.params['id'] ?? '' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
