import { Email } from '../Email';
import { DomainError } from '../../errors/DomainError';

describe('Email (Value Object)', () => {
  describe('create()', () => {
    it('should create a valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('should normalise to lower case', () => {
      const email = Email.create('User@EXAMPLE.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    it('should throw DomainError for empty string', () => {
      expect(() => Email.create('')).toThrow(DomainError);
    });

    it('should throw DomainError for invalid format', () => {
      expect(() => Email.create('not-an-email')).toThrow(DomainError);
      expect(() => Email.create('@nodomain')).toThrow(DomainError);
      expect(() => Email.create('no@')).toThrow(DomainError);
    });
  });

  describe('equals()', () => {
    it('should return true for identical emails', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('user@example.com');
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different emails', () => {
      const a = Email.create('alice@example.com');
      const b = Email.create('bob@example.com');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string value', () => {
      const email = Email.create('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });
});
