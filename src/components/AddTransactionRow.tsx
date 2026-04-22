'use client';

import { useMemo, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import {
  TRANSACTION_TYPES,
  isTransactionType,
  type Category,
  type TransactionType,
} from '@/lib/types';
import type { CreateTransactionResult } from '@/app/dashboard/actions';
import styles from './AddTransactionRow.module.css';
import tableStyles from './TransactionsTable.module.css';

interface AddTransactionRowProps {
  existingTags: string[];
  categories: Category[];
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
  categories,
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
  const [pendingNewCategory, setPendingNewCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const typeListId = 'add-txn-type-list';
  const categoryListId = 'add-txn-category-list';
  const tagListId = 'add-txn-tag-list';

  const typeIsSelected = isTransactionType(type);

  const availableCategories = useMemo<Category[]>(() => {
    if (!typeIsSelected) return [];
    return categories.filter((c) => c.type === (type as TransactionType));
  }, [categories, type, typeIsSelected]);

  const tagSuggestions = useMemo(
    () => existingTags.filter((t) => !tags.includes(t)),
    [existingTags, tags],
  );

  function handleTypeChange(next: string) {
    setType(next);
    setCategory('');
    setPendingNewCategory(null);
  }

  function handleCategoryBlur() {
    const trimmed = category.trim();
    if (!trimmed) return;
    if (!typeIsSelected) return;
    if (categories.some((c) => c.name === trimmed)) return;
    setPendingNewCategory(trimmed);
  }

  function confirmNewCategory() {
    setPendingNewCategory(null);
  }

  function cancelNewCategory() {
    setCategory('');
    setPendingNewCategory(null);
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
    if (!typeIsSelected) return 'Pick a Type.';
    const trimmedCategory = category.trim();
    if (!trimmedCategory) return 'Pick or enter a Category.';
    const existing = categories.find((c) => c.name === trimmedCategory);
    if (existing && existing.type !== type) {
      return `Category "${trimmedCategory}" is for ${existing.type}, not ${type}.`;
    }
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
        category: category.trim(),
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
            placeholder={typeIsSelected ? 'Category' : 'Select Type first'}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleCategoryBlur}
            disabled={!typeIsSelected}
            aria-label="Category"
          />
          <datalist id={categoryListId}>
            {availableCategories.map((c) => (
              <option key={c.name} value={c.name} />
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
      {pendingNewCategory && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={tableStyles.modalOverlay}
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-category-modal-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) cancelNewCategory();
              }}
            >
              <div className={tableStyles.modal}>
                <h2 id="new-category-modal-title" className={tableStyles.modalTitle}>
                  Create new category?
                </h2>
                <p className={tableStyles.modalBody}>
                  <strong>{pendingNewCategory}</strong> isn&apos;t an existing
                  category. Add it as a new <strong>{type}</strong> category?
                </p>
                <div className={tableStyles.modalActions}>
                  <button
                    type="button"
                    className={`${tableStyles.modalBtn} ${tableStyles.modalBtnCancel}`}
                    onClick={cancelNewCategory}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`${tableStyles.modalBtn} ${tableStyles.modalBtnConfirm}`}
                    onClick={confirmNewCategory}
                    autoFocus
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
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
