import 'server-only';
import { Pool } from 'pg';

declare global {
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
  }
  return new Pool({ connectionString });
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}
