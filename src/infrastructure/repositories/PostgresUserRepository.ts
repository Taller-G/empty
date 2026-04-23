/**
 * PostgresUserRepository
 *
 * Fulfils the IUserRepository contract defined in the domain layer.
 * Maps raw PostgreSQL rows ↔ User domain entities.
 * All infrastructure concerns (SQL, connection) live here exclusively.
 *
 * Layer: Infrastructure — imports from domain/ and application/ only.
 */

import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';
import { DomainError } from '../../domain/errors/DomainError';
import type { PostgresClient } from '../database/PostgresClient';

interface UserRow {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: PostgresClient) {}

  // ─── Private helpers ──────────────────────────────────────────────────────

  private mapRowToEntity(row: UserRow): User {
    try {
      return User.create({
        id: UserId.create(row.id),
        name: row.name,
        email: Email.create(row.email),
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (err) {
      // Translate low-level mapping errors into domain errors so they
      // propagate consistently without leaking infrastructure details.
      throw new DomainError(
        `Failed to reconstruct User from database row: ${(err as Error).message}`,
      );
    }
  }

  // ─── IUserRepository implementation ──────────────────────────────────────

  async save(user: User): Promise<void> {
    const sql = `
      INSERT INTO users (id, name, email, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.db.query(sql, [
      user.id.value,
      user.name,
      user.email.value,
      user.isActive,
      user.createdAt,
      user.updatedAt,
    ]);
  }

  async update(user: User): Promise<void> {
    const sql = `
      UPDATE users
      SET name       = $1,
          email      = $2,
          is_active  = $3,
          updated_at = $4
      WHERE id = $5
    `;
    await this.db.query(sql, [
      user.name,
      user.email.value,
      user.isActive,
      user.updatedAt,
      user.id.value,
    ]);
  }

  async findById(id: UserId): Promise<User | null> {
    const sql = `
      SELECT id, name, email, is_active, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const result = await this.db.query<UserRow>(sql, [id.value]);

    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const sql = `
      SELECT id, name, email, is_active, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await this.db.query<UserRow>(sql, [email.value]);

    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findAll(onlyActive = false): Promise<User[]> {
    const sql = onlyActive
      ? `
          SELECT id, name, email, is_active, created_at, updated_at
          FROM users
          WHERE is_active = TRUE
          ORDER BY created_at DESC
        `
      : `
          SELECT id, name, email, is_active, created_at, updated_at
          FROM users
          ORDER BY created_at DESC
        `;

    const result = await this.db.query<UserRow>(sql);
    return result.rows.map((row) => this.mapRowToEntity(row));
  }

  async delete(id: UserId): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = $1', [id.value]);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const sql = `
      SELECT 1 FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await this.db.query<{ '?column?': number }>(sql, [email.value]);
    return result.rows.length > 0;
  }
}
