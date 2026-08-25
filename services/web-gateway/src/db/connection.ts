import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'dispatchmesh',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
});

/**
 * Run any one-time database setup (migrations, schema creation, etc.).

export async function initializeDatabase(): Promise<void> {
  // TODO: implement database initialisation / migration logic
  throw new Error('Not implemented');
}
 */