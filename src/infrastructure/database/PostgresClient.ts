/**
 * PostgresClient
 *
 * Thin wrapper around the `pg` Pool. Provides a single connection pool
 * shared by all repository implementations. Reads configuration from
 * environment variables — the only place in the codebase that does so.
 *
 * Layer: Infrastructure.
 */

import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg';

export class PostgresClient {
  private static instance: PostgresClient | null = null;
  private readonly pool: Pool;

  private constructor(config: PoolConfig) {
    this.pool = new Pool(config);

    this.pool.on('error', (err: Error) => {
      console.error('[PostgresClient] Unexpected pool error:', err.message);
    });
  }

  static getInstance(): PostgresClient {
    if (!PostgresClient.instance) {
      PostgresClient.instance = new PostgresClient({
        host: process.env['DB_HOST'] ?? 'localhost',
        port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
        database: process.env['DB_NAME'] ?? 'dasdasdd_db',
        user: process.env['DB_USER'] ?? 'postgres',
        password: process.env['DB_PASSWORD'] ?? '',
        max: parseInt(process.env['DB_POOL_MAX'] ?? '10', 10),
        min: parseInt(process.env['DB_POOL_MIN'] ?? '2', 10),
        idleTimeoutMillis: parseInt(process.env['DB_POOL_IDLE_TIMEOUT'] ?? '30000', 10),
        connectionTimeoutMillis: 5000,
      });
    }
    return PostgresClient.instance;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    const result = await this.pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (process.env['NODE_ENV'] !== 'production') {
      console.info(`[PostgresClient] query executed in ${duration}ms — rows: ${result.rowCount}`);
    }

    return result;
  }

  async transaction<T>(
    callback: (client: { query: PostgresClient['query'] }) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const queryFn = async <R extends QueryResultRow = QueryResultRow>(
        text: string,
        params?: unknown[],
      ): Promise<QueryResult<R>> => client.query<R>(text, params);

      const result = await callback({ query: queryFn });
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    PostgresClient.instance = null;
  }
}
