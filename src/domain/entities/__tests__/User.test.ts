import { User } from '../User';
import { Email } from '../../value-objects/Email';
import { UserId } from '../../value-objects/UserId';
import { DomainError } from '../../errors/DomainError';

const makeUser = (overrides?: Partial<{ name: string; email: string }>) =>
  User.create({
    id: UserId.create('550e8400-e29b-41d4-a716-446655440000'),
    name: overrides?.name ?? 'Alice Smith',
    email: Email.create(overrides?.email ?? 'alice@example.com'),
  });

describe('User (Entity)', () => {
  describe('create()', () => {
    it('should create a valid user', () => {
      const user = makeUser();
      expect(user.name).toBe('Alice Smith');
      expect(user.email.value).toBe('alice@example.com');
      expect(user.isActive).toBe(true);
    });

    it('should trim the name', () => {
      const user = makeUser({ name: '  Bob  ' });
      expect(user.name).toBe('Bob');
    });

    it('should throw DomainError when name is empty', () => {
      expect(() => makeUser({ name: '' })).toThrow(DomainError);
    });

    it('should throw DomainError when name is too short', () => {
      expect(() => makeUser({ name: 'A' })).toThrow(DomainError);
    });

    it('should throw DomainError when name exceeds 100 characters', () => {
      expect(() => makeUser({ name: 'A'.repeat(101) })).toThrow(DomainError);
    });
  });

  describe('changeName()', () => {
    it('should update the name and updatedAt', () => {
      const user = makeUser();
      const before = user.updatedAt;
      user.changeName('Bob Jones');
      expect(user.name).toBe('Bob Jones');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should throw DomainError for invalid name', () => {
      const user = makeUser();
      expect(() => user.changeName('')).toThrow(DomainError);
    });
  });

  describe('deactivate() / activate()', () => {
    it('should deactivate an active user', () => {
      const user = makeUser();
      user.deactivate();
      expect(user.isActive).toBe(false);
    });

    it('should throw if already inactive', () => {
      const user = makeUser();
      user.deactivate();
      expect(() => user.deactivate()).toThrow(DomainError);
    });

    it('should activate an inactive user', () => {
      const user = makeUser();
      user.deactivate();
      user.activate();
      expect(user.isActive).toBe(true);
    });

    it('should throw if already active', () => {
      const user = makeUser();
      expect(() => user.activate()).toThrow(DomainError);
    });
  });

  describe('equals()', () => {
    it('should be equal when IDs match', () => {
      const a = makeUser();
      const b = makeUser({ name: 'Different Name' });
      expect(a.equals(b)).toBe(true);
    });
  });
});
