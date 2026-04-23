/**
 * User DTOs
 *
 * Input and output contracts for all User-related use cases.
 * Use cases always return DTOs — never raw domain entities.
 *
 * Layer: Application.
 */

// ─── Input DTOs ──────────────────────────────────────────────────────────────

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
}

export interface GetUserByIdDto {
  id: string;
}

export interface DeleteUserDto {
  id: string;
}

export interface ListUsersDto {
  onlyActive?: boolean;
}

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
