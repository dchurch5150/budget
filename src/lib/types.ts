export type TransactionType = 'Income' | 'Expenses' | 'Savings';

export type IncomeCategory =
  | 'Employment (Net)'
  | 'Side Hustle'
  | 'Dividends'
  | 'Interest'
  | 'Options Premium';

export type ExpensesCategory =
  | 'Housing'
  | 'Utilities'
  | 'Groceries'
  | 'Transportation'
  | 'Insurance'
  | 'Clothing'
  | 'Medical'
  | 'Media'
  | 'Fun & Vacation'
  | 'Home Office'
  | 'Charity'
  | 'Gifts'
  | 'Margin'
  | 'Taxes';

export type SavingsCategory =
  | 'Emergency Fund'
  | 'Retirement Account'
  | 'Brokerage Account'
  | 'Crypto'
  | 'Sinking Fund'
  | 'Physical Emergency';

export type Category = IncomeCategory | ExpensesCategory | SavingsCategory;

export const TRANSACTION_TYPES: readonly TransactionType[] = [
  'Income',
  'Expenses',
  'Savings',
] as const;

export const INCOME_CATEGORIES: readonly IncomeCategory[] = [
  'Employment (Net)',
  'Side Hustle',
  'Dividends',
  'Interest',
  'Options Premium',
] as const;

export const EXPENSES_CATEGORIES: readonly ExpensesCategory[] = [
  'Housing',
  'Utilities',
  'Groceries',
  'Transportation',
  'Insurance',
  'Clothing',
  'Medical',
  'Media',
  'Fun & Vacation',
  'Home Office',
  'Charity',
  'Gifts',
  'Margin',
  'Taxes',
] as const;

export const SAVINGS_CATEGORIES: readonly SavingsCategory[] = [
  'Emergency Fund',
  'Retirement Account',
  'Brokerage Account',
  'Crypto',
  'Sinking Fund',
  'Physical Emergency',
] as const;

export const ALL_CATEGORIES: readonly Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSES_CATEGORIES,
  ...SAVINGS_CATEGORIES,
] as const;

export const CATEGORIES_BY_TYPE: Record<TransactionType, readonly Category[]> = {
  Income: INCOME_CATEGORIES,
  Expenses: EXPENSES_CATEGORIES,
  Savings: SAVINGS_CATEGORIES,
};

export function isTransactionType(value: string): value is TransactionType {
  return (TRANSACTION_TYPES as readonly string[]).includes(value);
}

export function isCategory(value: string): value is Category {
  return (ALL_CATEGORIES as readonly string[]).includes(value);
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: Category;
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
