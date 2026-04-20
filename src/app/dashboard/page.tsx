import { SummaryCards } from '@/components/SummaryCards';
import { TransactionsTable } from '@/components/TransactionsTable';
import { getDistinctTagsForUser, getTransactionsForUser } from '@/lib/transactions';
import { computeRunningBalance } from '@/lib/types';
import { createTransactionAction } from './actions';
import styles from './page.module.css';

const CURRENT_USER_ID = 1;

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [transactions, existingTags] = await Promise.all([
    getTransactionsForUser(CURRENT_USER_ID),
    getDistinctTagsForUser(CURRENT_USER_ID),
  ]);
  const rows = computeRunningBalance(transactions);
  const lastRow = rows[rows.length - 1];
  const today = new Date();

  return (
    <div className={styles.dashboard}>
      <SummaryCards
        todayDate={formatDate(today)}
        lastTransactionDate={lastRow?.date ?? '—'}
        recordCount={rows.length}
        currentBalance={lastRow?.balance ?? 0}
      />
      <TransactionsTable
        rows={rows}
        existingTags={existingTags}
        onCreate={createTransactionAction}
      />
    </div>
  );
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
