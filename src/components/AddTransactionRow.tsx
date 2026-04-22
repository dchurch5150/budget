'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  ALL_CATEGORIES,
  CATEGORIES_BY_TYPE,
  TRANSACTION_TYPES,
  isCategory,
  isTransactionType,
  type Category,
  type TransactionType,
} from '@/lib/types';
import type { CreateTransactionResult } from '@/app/dashboard/actions';
import styles from './AddTransactionRow.module.css';
import tableStyles from './TransactionsTable.module.css';

interface AddTransactionRowProps {
  existingTags: string[];
  onCancel: () => void;
  onCreate: (input: {
    date: string;
    type: string;
    category: string;
    amount: number;
    tags: string[];
    details: string;
    source: string;
  }) => Promise<CreateTransactionResult>;
  onSuccess: () => void;
}

export function AddTransactionRow({
  existingTags,
  onCancel,
  onCreate,
  onSuccess,
}: AddTransactionRowProps) {
  const [date, setDate] = useState(() => todayIso());
  const [type, setType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');
  const [details, setDetails] = useState('');
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const typeListId = 'add-txn-type-list';
  const categoryListId = 'add-txn-category-list';
  const tagListId = 'add-txn-tag-list';

  const availableCategories = useMemo<readonly Category[]>(() => {
    if (isTransactionType(type)) return CATEGORIES_BY_TYPE[type as TransactionType];
    return ALL_CATEGORIES;
  }, [type]);

  const tagSuggestions = useMemo(
    () => existingTags.filter((t) => !tags.includes(t)),
    [existingTags, tags],
  );

  function handleTypeChange(next: string) {
    setType(next);
    if (category && !CATEGORIES_BY_TYPE[next as TransactionType]?.includes(category as Category)) {
      setCategory('');
    }
  }

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagDraft('');
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === 'Backspace' && tagDraft === '' && tags.length > 0) {
      e.preventDefault();
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function validateLocal(): string | null {
    if (!date) return 'Date is required.';
    if (!isTransactionType(type)) return 'Pick a Type.';
    if (!isCategory(category)) return 'Pick a Category.';
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return 'Amount must be a positive number.';
    if (!source.trim()) return 'Source is required.';
    return null;
  }

  function handleConfirm() {
    setError(null);
    const localError = validateLocal();
    if (localError) {
      setError(localError);
      return;
    }
    const pendingTags = tagDraft.trim() ? [...tags, tagDraft.trim()] : tags;
    startTransition(async () => {
      const result = await onCreate({
        date,
        type,
        category,
        amount: Number(amount),
        tags: pendingTags,
        details,
        source: source.trim(),
      });
      if (result.ok) {
        onSuccess();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <tr className={styles.row}>
        <td>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Date"
          />
        </td>
        <td>
          <input
            type="text"
            list={typeListId}
            className={styles.input}
            value={type}
            placeholder="Type"
            onChange={(e) => handleTypeChange(e.target.value)}
            aria-label="Type"
          />
          <datalist id={typeListId}>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </td>
        <td>
          <input
            type="text"
            list={categoryListId}
            className={styles.input}
            value={category}
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
          />
          <datalist id={categoryListId}>
            {availableCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </td>
        <td className={tableStyles.amountCell}>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`${styles.input} ${styles.inputAmount}`}
            value={amount}
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Amount"
          />
        </td>
        <td>
          <div className={styles.tagsField}>
            <div className={styles.tagChips}>
              {tags.map((tag) => (
                <span key={tag} className={tableStyles.tag}>
                  {tag}
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                list={tagListId}
                className={styles.tagInput}
                value={tagDraft}
                placeholder={tags.length === 0 ? 'Add tags' : ''}
                onChange={(e) => {
                  const next = e.target.value;
                  // Selecting from datalist fires onChange with the full value;
                  // commit immediately when it matches a known suggestion.
                  if (existingTags.includes(next) && !tags.includes(next)) {
                    addTag(next);
                  } else {
                    setTagDraft(next);
                  }
                }}
                onKeyDown={handleTagKeyDown}
                onBlur={() => {
                  if (tagDraft.trim()) addTag(tagDraft);
                }}
                aria-label="Tags"
              />
            </div>
            <datalist id={tagListId}>
              {tagSuggestions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </td>
        <td>
          <input
            type="text"
            className={styles.input}
            value={details}
            placeholder="Details"
            onChange={(e) => setDetails(e.target.value)}
            aria-label="Details"
          />
        </td>
        <td className={`${tableStyles.balanceCell} ${styles.balanceReadonly}`}>—</td>
        <td>
          <div className={styles.sourceCell}>
            <input
              type="text"
              className={styles.input}
              value={source}
              placeholder="Source"
              onChange={(e) => setSource(e.target.value)}
              aria-label="Source"
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnConfirm}`}
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? '…' : 'Confirm'}
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnCancel}`}
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
        <td aria-hidden="true" />
      </tr>
      {error ? (
        <tr className={styles.errorRow}>
          <td colSpan={9} className={styles.errorCell}>
            {error}
          </td>
        </tr>
      ) : null}
    </>
  );
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
