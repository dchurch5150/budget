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
