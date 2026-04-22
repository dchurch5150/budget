import 'server-only';
import { getPool } from './db';
import type { Category, TransactionType } from './types';

export async function getCategories(): Promise<Category[]> {
  const result = await getPool().query<Category>(
    `SELECT name, type FROM categories ORDER BY type ASC, name ASC`,
  );
  return result.rows;
}

export async function getCategoryByName(name: string): Promise<Category | null> {
  const result = await getPool().query<Category>(
    `SELECT name, type FROM categories WHERE name = $1`,
    [name],
  );
  return result.rows[0] ?? null;
}

export async function insertCategory(name: string, type: TransactionType): Promise<void> {
  await getPool().query(
    `INSERT INTO categories (name, type) VALUES ($1, $2)`,
    [name, type],
  );
}
