import 'server-only';
import { getPool } from './db';
import type { Transaction, TransactionType } from './types';

interface TransactionRow {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  amount: string;
  tags: string[];
  details: string;
  source: string;
}

export async function getTransactionsForUser(userId: number): Promise<Transaction[]> {
  const result = await getPool().query<TransactionRow>(
    `SELECT id, date, type, category, amount, tags, details, source
       FROM transactions
      WHERE "user" = $1
      ORDER BY date ASC, id ASC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    date: formatDate(row.date),
    type: row.type,
    category: row.category,
    amount: Number(row.amount),
    tags: row.tags,
    details: row.details,
    source: row.source,
  }));
}

export async function getDistinctTagsForUser(userId: number): Promise<string[]> {
  const result = await getPool().query<{ tag: string }>(
    `SELECT DISTINCT UNNEST(tags) AS tag
       FROM transactions
      WHERE "user" = $1
      ORDER BY tag ASC`,
    [userId],
  );
  return result.rows.map((row) => row.tag).filter((tag) => tag.length > 0);
}

export interface InsertTransactionInput {
  id: string;
  userId: number;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  tags: string[];
  details: string;
  source: string;
}

export async function insertTransaction(input: InsertTransactionInput): Promise<void> {
  await getPool().query(
    `INSERT INTO transactions (id, "user", date, type, category, amount, tags, details, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      input.id,
      input.userId,
      input.date,
      input.type,
      input.category,
      input.amount,
      input.tags,
      input.details,
      input.source,
    ],
  );
}

export async function deleteTransaction(id: string, userId: number): Promise<boolean> {
  const result = await getPool().query(
    `DELETE FROM transactions WHERE id = $1 AND "user" = $2`,
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
