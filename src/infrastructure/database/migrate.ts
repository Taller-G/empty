/**
 * migrate.ts — Database migration runner
 *
 * Reads SQL migration files in order and applies any that have not yet
 * been executed. Tracks applied migrations in a `schema_migrations` table.
 *
 * Run via: npm run db:migrate
 *
 * Layer: Infrastructure.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigrations(): Promise<void> {
  const pool = new Pool({
    host: process.env['DB_HOST'] ?? 'localhost',
    port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
    database: process.env['DB_NAME'] ?? 'dasdasdd_db',
    user: process.env['DB_USER'] ?? 'postgres',
    password: process.env['DB_PASSWORD'] ?? '',
  });

  const client = await pool.connect();

  try {
    // Ensure the migrations tracking table exists.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id          SERIAL PRIMARY KEY,
        filename    VARCHAR(255) NOT NULL UNIQUE,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      const { rows } = await client.query<{ filename: string }>(
        'SELECT filename FROM schema_migrations WHERE filename = $1',
        [filename],
      );

      if (rows.length > 0) {
        console.info(`[migrate] Skipping ${filename} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, filename), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename],
        );
        await client.query('COMMIT');
        console.info(`[migrate] Applied: ${filename}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.info('[migrate] All migrations applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err: unknown) => {
  console.error('[migrate] Migration failed:', err);
  process.exit(1);
});
