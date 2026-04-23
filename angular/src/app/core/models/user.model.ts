/**
 * User model — mirrors the API UserResponseDto.
 * Lives in the Angular core layer; has no dependency on backend source.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
  details?: { path: string; message: string }[];
}
