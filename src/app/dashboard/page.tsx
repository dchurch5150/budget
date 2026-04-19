import { SummaryCards } from '@/components/SummaryCards';
import { TransactionsTable } from '@/components/TransactionsTable';
import { computeRunningBalance, mockTransactions } from '@/lib/mock-data';
import styles from './page.module.css';

export default function DashboardPage() {
  const chronological = [...mockTransactions].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const rows = computeRunningBalance(chronological);
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
      <TransactionsTable rows={rows} />
    </div>
  );
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
