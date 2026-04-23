import { CreateUserUseCase } from '../CreateUserUseCase';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { User } from '../../../domain/entities/User';
import type { UserId } from '../../../domain/value-objects/UserId';
import type { Email } from '../../../domain/value-objects/Email';
import { DomainError } from '../../../domain/errors/DomainError';

// ─── Mock repository ──────────────────────────────────────────────────────────

const makeRepo = (overrides?: Partial<IUserRepository>): IUserRepository => ({
  save: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  findById: jest.fn().mockResolvedValue(null),
  findByEmail: jest.fn().mockResolvedValue(null),
  findAll: jest.fn().mockResolvedValue([]),
  delete: jest.fn().mockResolvedValue(undefined),
  existsByEmail: jest.fn().mockResolvedValue(false),
  ...overrides,
});

describe('CreateUserUseCase', () => {
  it('should create and return a user DTO', async () => {
    const repo = makeRepo();
    const useCase = new CreateUserUseCase(repo);

    const result = await useCase.execute({
      name: 'Alice Smith',
      email: 'alice@example.com',
    });

    expect(result.name).toBe('Alice Smith');
    expect(result.email).toBe('alice@example.com');
    expect(result.isActive).toBe(true);
    expect(typeof result.id).toBe('string');
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw DomainError when email already exists', async () => {
    const repo = makeRepo({
      existsByEmail: jest.fn().mockResolvedValue(true),
    });
    const useCase = new CreateUserUseCase(repo);

    await expect(
      useCase.execute({ name: 'Alice', email: 'alice@example.com' }),
    ).rejects.toThrow(DomainError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should throw DomainError for invalid email format', async () => {
    const repo = makeRepo();
    const useCase = new CreateUserUseCase(repo);

    await expect(
      useCase.execute({ name: 'Alice', email: 'not-an-email' }),
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError for invalid name', async () => {
    const repo = makeRepo();
    const useCase = new CreateUserUseCase(repo);

    await expect(
      useCase.execute({ name: 'A', email: 'alice@example.com' }),
    ).rejects.toThrow(DomainError);
  });

  it('should never return a domain entity — only DTOs', async () => {
    const repo = makeRepo();
    const useCase = new CreateUserUseCase(repo);

    const result = await useCase.execute({
      name: 'Alice Smith',
      email: 'alice@example.com',
    });

    // DTOs have plain string dates, not Date objects
    expect(typeof result.createdAt).toBe('string');
    expect(typeof result.updatedAt).toBe('string');
    // Ensure no domain entity methods leak out
    expect((result as unknown as { changeName?: unknown }).changeName).toBeUndefined();
  });
});

// Suppress unused import warnings from TypeScript in test context
type _SuppressUnusedImports = User | UserId | Email;
