'use client';

import { useMemo, useState, useTransition } from 'react';
import type { Category, Transaction, TransactionType } from '@/lib/types';
import type {
  CreateTransactionResult,
  DeleteTransactionResult,
  ImportTransactionRow,
  ImportTransactionsResult,
} from '@/app/dashboard/actions';
import { AddTransactionRow } from './AddTransactionRow';
import { MassImportButton } from './MassImportButton';
import styles from './TransactionsTable.module.css';

export type TransactionWithBalance = Transaction & { balance: number };

type SortKey = 'date' | 'type' | 'category' | 'amount' | 'balance' | 'source';
type SortDirection = 'asc' | 'desc';

interface Column {
  key: SortKey | null;
  label: string;
  align?: 'right';
  srOnly?: boolean;
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
  { key: null, label: 'Actions', srOnly: true },
];

interface TransactionsTableProps {
  rows: TransactionWithBalance[];
  existingTags: string[];
  categories: Category[];
  onCreate: (input: {
    date: string;
    type: string;
    category: string;
    amount: number;
    tags: string[];
    details: string;
    source: string;
  }) => Promise<CreateTransactionResult>;
  onDelete: (id: string) => Promise<DeleteTransactionResult>;
  onImport: (input: {
    rows: ImportTransactionRow[];
    approvedCategories: Array<{ name: string; type: string }>;
  }) => Promise<ImportTransactionsResult>;
}

export function TransactionsTable({
  rows,
  existingTags,
  categories,
  onCreate,
  onDelete,
  onImport,
}: TransactionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isAdding, setIsAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TransactionWithBalance | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

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

  function requestDelete(row: TransactionWithBalance) {
    setDeleteError(null);
    setPendingDelete(row);
  }

  function cancelDelete() {
    if (isDeleting) return;
    setPendingDelete(null);
    setDeleteError(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await onDelete(target.id);
      if (result.ok) {
        setPendingDelete(null);
      } else {
        setDeleteError(result.error);
      }
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <MassImportButton categories={categories} onImport={onImport} />
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          + Add Transaction
        </button>
      </div>
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
                const actionsClass = col.srOnly ? styles.actionsCell : undefined;
                return (
                  <th
                    key={col.label}
                    className={`${styles.th} ${alignClass ?? ''} ${actionsClass ?? ''}`}
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
                    ) : col.srOnly ? (
                      <span className={styles.srOnly}>{col.label}</span>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isAdding ? (
              <AddTransactionRow
                existingTags={existingTags}
                categories={categories}
                onCancel={() => setIsAdding(false)}
                onCreate={onCreate}
                onSuccess={() => setIsAdding(false)}
              />
            ) : null}
            {sorted.map((row) => (
              <tr key={row.id} className={styles.dataRow}>
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
                <td className={styles.actionsCell}>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => requestDelete(row)}
                    aria-label={`Delete transaction from ${row.date} (${row.category})`}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingDelete ? (
        <ConfirmDeleteModal
          row={pendingDelete}
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}

interface ConfirmDeleteModalProps {
  row: TransactionWithBalance;
  error: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteModal({
  row,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.modal}>
        <h2 id="delete-modal-title" className={styles.modalTitle}>
          Delete transaction?
        </h2>
        <p className={styles.modalBody}>
          This will permanently remove the{' '}
          <strong>{row.category}</strong> transaction from{' '}
          <strong>{row.date}</strong> for{' '}
          <strong>{formatCurrency(row.amount)}</strong>.
        </p>
        {error ? <p className={styles.modalError}>{error}</p> : null}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.modalBtn} ${styles.modalBtnDelete}`}
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
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
