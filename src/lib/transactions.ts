import 'server-only';
import { getPool } from './db';
import type { Category, Transaction, TransactionType } from './types';

interface TransactionRow {
  id: string;
  date: Date;
  type: TransactionType;
  category: Category;
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

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
