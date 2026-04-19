'use client';

import { useMemo, useState } from 'react';
import type { Transaction, TransactionType } from '@/lib/mock-data';
import styles from './TransactionsTable.module.css';

export type TransactionWithBalance = Transaction & { balance: number };

type SortKey = 'date' | 'type' | 'category' | 'amount' | 'balance' | 'source';
type SortDirection = 'asc' | 'desc';

interface Column {
  key: SortKey | null;
  label: string;
  align?: 'right';
}

const COLUMNS: Column[] = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: null, label: 'Tags' },
  { key: null, label: 'Details' },
  { key: 'balance', label: 'Balance', align: 'right' },
  { key: 'source', label: 'Source' },
];

interface TransactionsTableProps {
  rows: TransactionWithBalance[];
}

export function TransactionsTable({ rows }: TransactionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => compareRows(a, b, sortKey));
    if (sortDirection === 'desc') copy.reverse();
    return copy;
  }, [rows, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'date' ? 'desc' : 'asc');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                const isActive = col.key === sortKey;
                const isSortable = col.key !== null;
                const alignClass =
                  col.align === 'right'
                    ? col.key === 'amount'
                      ? styles.amountCell
                      : styles.balanceCell
                    : undefined;
                return (
                  <th
                    key={col.label}
                    className={`${styles.th} ${alignClass ?? ''}`}
                    scope="col"
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className={`${styles.thButton} ${isActive ? styles.thActive : ''}`}
                        onClick={() => handleSort(col.key as SortKey)}
                      >
                        {col.label}
                        <span
                          className={`${styles.sortIcon} ${isActive ? '' : styles.sortIconInactive}`}
                          aria-hidden="true"
                        >
                          {isActive ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>
                  <span className={`${styles.typeBadge} ${typeClass(row.type)}`}>
                    {row.type}
                  </span>
                </td>
                <td>{row.category}</td>
                <td
                  className={`${styles.amountCell} ${
                    row.type === 'Income' ? styles.amountIncome : styles.amountOutflow
                  }`}
                >
                  {row.type === 'Income' ? '+' : '−'}
                  {formatCurrency(row.amount)}
                </td>
                <td>
                  <div className={styles.tags}>
                    {row.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={styles.details}>{row.details || '—'}</td>
                <td
                  className={`${styles.balanceCell} ${row.balance < 0 ? styles.balanceNegative : ''}`}
                >
                  {formatCurrency(row.balance)}
                </td>
                <td>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function compareRows(
  a: TransactionWithBalance,
  b: TransactionWithBalance,
  key: SortKey,
): number {
  const av = a[key];
  const bv = b[key];
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv));
}

function typeClass(type: TransactionType): string {
  if (type === 'Income') return styles.typeIncome;
  if (type === 'Expenses') return styles.typeExpenses;
  return styles.typeSavings;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
