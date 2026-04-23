/**
 * Dependency Injection Container
 *
 * Wires infrastructure implementations to application use cases.
 * This is the only place where concrete classes are constructed.
 * Controllers receive only use case instances — never repositories directly.
 *
 * Layer: Infrastructure (orchestrates the full dependency graph).
 */

import { PostgresClient } from './database/PostgresClient';
import { PostgresUserRepository } from './repositories/PostgresUserRepository';

import { CreateUserUseCase } from '../application/use-cases/CreateUserUseCase';
import { GetUserByIdUseCase } from '../application/use-cases/GetUserByIdUseCase';
import { ListUsersUseCase } from '../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/use-cases/DeleteUserUseCase';

// ─── Singletons ──────────────────────────────────────────────────────────────

const db = PostgresClient.getInstance();
const userRepository = new PostgresUserRepository(db);

// ─── Use Cases ───────────────────────────────────────────────────────────────

export const createUserUseCase = new CreateUserUseCase(userRepository);
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
export const listUsersUseCase = new ListUsersUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// ─── DB client (for health checks) ───────────────────────────────────────────

export const postgresClient = db;
