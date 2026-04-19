import styles from './SummaryCards.module.css';

export interface SummaryCardsProps {
  todayDate: string;
  lastTransactionDate: string;
  recordCount: number;
  currentBalance: number;
}

export function SummaryCards({
  todayDate,
  lastTransactionDate,
  recordCount,
  currentBalance,
}: SummaryCardsProps) {
  const cards: Array<{ label: string; value: string }> = [
    { label: "Today's Date", value: todayDate },
    { label: 'Last Transaction', value: lastTransactionDate },
    { label: 'Tracked Records', value: recordCount.toLocaleString() },
    { label: 'Current Balance', value: formatCurrency(currentBalance) },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((c) => (
        <div key={c.label} className={styles.card}>
          <span className={styles.label}>{c.label}</span>
          <span className={styles.value}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
