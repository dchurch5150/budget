export type TransactionType = 'Income' | 'Expenses' | 'Savings';

export const TRANSACTION_TYPES: readonly TransactionType[] = [
  'Income',
  'Expenses',
  'Savings',
] as const;

export function isTransactionType(value: string): value is TransactionType {
  return (TRANSACTION_TYPES as readonly string[]).includes(value);
}

export interface Category {
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  tags: string[];
  details: string;
  source: string;
}

export function computeRunningBalance(
  transactions: Transaction[],
): Array<Transaction & { balance: number }> {
  let balance = 0;
  return transactions.map((t) => {
    if (t.type === 'Income') balance += t.amount;
    else balance -= t.amount;
    return { ...t, balance };
  });
}

export interface ImportTransactionRow {
  rowNumber: number;
  date: string;
  type: string;
  category: string;
  amount: number;
  tags: string[];
  details: string;
  source: string;
}

export interface ImportRowError {
  rowNumber: number;
  date: string;
  category: string;
  amount: number;
  error: string;
}

// Deterministic id per spec: `date-source-amount` concatenated with
// no spaces or punctuation. Strips anything non-alphanumeric from each part.
export function computeTransactionId(
  date: string,
  source: string,
  amount: number,
): string {
  const datePart = date.replace(/[^0-9A-Za-z]/g, '');
  const sourcePart = source.replace(/[^0-9A-Za-z]/g, '');
  const amountPart = Math.round(amount * 100).toString();
  return `${datePart}${sourcePart}${amountPart}`;
}
