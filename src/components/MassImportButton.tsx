'use client';

import { useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import {
  isTransactionType,
  TRANSACTION_TYPES,
  type Category,
  type ImportRowError,
  type ImportTransactionRow,
} from '@/lib/types';
import type { ImportTransactionsResult } from '@/app/dashboard/actions';
import { ADAPTERS, getAdapter } from '@/lib/importers';
import styles from './MassImportButton.module.css';
import tableStyles from './TransactionsTable.module.css';

interface MassImportButtonProps {
  categories: Category[];
  onImport: (input: {
    rows: ImportTransactionRow[];
    approvedCategories: Array<{ name: string; type: string }>;
  }) => Promise<ImportTransactionsResult>;
}

interface UnmatchedGroup {
  description: string;
  rowNumbers: number[];
  type: string;
  category: string;
}

interface ParsePreview {
  fileName: string;
  rows: ImportTransactionRow[];
  parseErrors: ImportRowError[];
  unknownCategories: Array<{ name: string; type: string }>;
  matchedCount: number;
}

export function MassImportButton({ categories, onImport }: MassImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAdapterId, setSelectedAdapterId] = useState('generic');
  const [preview, setPreview] = useState<ParsePreview | null>(null);
  const [unmatchedGroups, setUnmatchedGroups] = useState<UnmatchedGroup[]>([]);
  const [result, setResult] = useState<{
    fileName: string;
    importedCount: number;
    errors: ImportRowError[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, startTransition] = useTransition();

  function openFilePicker() {
    setError(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setResult(null);

    let text: string;
    try {
      text = await file.text();
    } catch {
      setError('Could not read file.');
      return;
    }

    const adapter = getAdapter(selectedAdapterId);
    const { rows, errors: parseErrors } = adapter.parse(text);

    if (rows.length === 0 && parseErrors.length === 0) {
      setError('CSV is empty or has no data rows.');
      return;
    }

    // Group rows missing type or category by description for manual classification
    const groupMap = new Map<string, UnmatchedGroup>();
    for (const r of rows) {
      if (r.type && r.category) continue;
      const key = r.details || `row-${r.rowNumber}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, { description: key, rowNumbers: [], type: '', category: '' });
      }
      groupMap.get(key)!.rowNumbers.push(r.rowNumber);
    }

    const matchedCount = rows.filter((r) => r.type && r.category).length;

    // Unknown categories from already-matched rows
    const known = new Set(categories.map((c) => c.name));
    const unknownMap = new Map<string, string>();
    for (const r of rows) {
      if (!r.type || !r.category) continue;
      if (!isTransactionType(r.type)) continue;
      if (known.has(r.category)) continue;
      if (!unknownMap.has(r.category)) unknownMap.set(r.category, r.type);
    }
    const unknownCategories = Array.from(unknownMap.entries()).map(([name, type]) => ({ name, type }));

    setUnmatchedGroups(Array.from(groupMap.values()));
    setPreview({ fileName: file.name, rows, parseErrors, unknownCategories, matchedCount });
  }

  function handleGroupChange(description: string, field: 'type' | 'category', value: string) {
    setUnmatchedGroups((prev) =>
      prev.map((g) =>
        g.description === description
          ? { ...g, [field]: value, ...(field === 'type' ? { category: '' } : {}) }
          : g,
      ),
    );
  }

  function cancelPreview() {
    if (isImporting) return;
    setPreview(null);
    setUnmatchedGroups([]);
  }

  function confirmImport() {
    if (!preview) return;
    const current = preview;

    // Apply group assignments back to rows
    const groupMap = new Map(unmatchedGroups.map((g) => [g.description, g]));
    const mergedRows = current.rows.map((r) => {
      if (r.type && r.category) return r;
      const g = groupMap.get(r.details || `row-${r.rowNumber}`);
      if (!g) return r;
      return { ...r, type: g.type, category: g.category };
    });

    // Recompute unknownCategories from the fully merged rows
    const known = new Set(categories.map((c) => c.name));
    const unknownMap = new Map<string, string>();
    for (const r of mergedRows) {
      if (!isTransactionType(r.type)) continue;
      if (!r.category) continue;
      if (known.has(r.category)) continue;
      if (!unknownMap.has(r.category)) unknownMap.set(r.category, r.type);
    }
    const approvedCategories = Array.from(unknownMap.entries()).map(([name, type]) => ({ name, type }));

    setError(null);
    startTransition(async () => {
      try {
        const r = await onImport({ rows: mergedRows, approvedCategories });
        const merged = [...current.parseErrors, ...r.errors].sort(
          (a, b) => a.rowNumber - b.rowNumber,
        );
        setResult({ fileName: current.fileName, importedCount: r.importedCount, errors: merged });
        setPreview(null);
        setUnmatchedGroups([]);
      } catch {
        setError('Import failed. Please try again.');
      }
    });
  }

  function dismissResult() {
    setResult(null);
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
      <select
        className={styles.sourceSelect}
        value={selectedAdapterId}
        onChange={(e) => setSelectedAdapterId(e.target.value)}
        disabled={isImporting}
        aria-label="Import source"
      >
        {ADAPTERS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.importButton}
        onClick={openFilePicker}
        disabled={isImporting}
      >
        Mass Import
      </button>
      {error ? <span className={styles.inlineError}>{error}</span> : null}
      {preview && typeof document !== 'undefined'
        ? createPortal(
            <PreviewModal
              preview={preview}
              unmatchedGroups={unmatchedGroups}
              categories={categories}
              isImporting={isImporting}
              onGroupChange={handleGroupChange}
              onCancel={cancelPreview}
              onConfirm={confirmImport}
            />,
            document.body,
          )
        : null}
      {result && typeof document !== 'undefined'
        ? createPortal(<ResultModal result={result} onClose={dismissResult} />, document.body)
        : null}
    </>
  );
}

interface PreviewModalProps {
  preview: ParsePreview;
  unmatchedGroups: UnmatchedGroup[];
  categories: Category[];
  isImporting: boolean;
  onGroupChange: (description: string, field: 'type' | 'category', value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function PreviewModal({
  preview,
  unmatchedGroups,
  categories,
  isImporting,
  onGroupChange,
  onCancel,
  onConfirm,
}: PreviewModalProps) {
  const totalRows = preview.rows.length + preview.parseErrors.length;
  return (
    <div
      className={tableStyles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mass-import-preview-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={`${tableStyles.modal} ${styles.modalWide}`}>
        <h2 id="mass-import-preview-title" className={tableStyles.modalTitle}>
          Import {preview.fileName}?
        </h2>
        <p className={tableStyles.modalBody}>
          Found <strong>{totalRows}</strong> data row{totalRows === 1 ? '' : 's'} in the file.
        </p>

        {preview.matchedCount > 0 && unmatchedGroups.length > 0 ? (
          <p className={styles.matchedSummary}>
            {preview.matchedCount} row{preview.matchedCount === 1 ? '' : 's'} auto-classified by
            rules.
          </p>
        ) : null}

        {preview.parseErrors.length > 0 ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {preview.parseErrors.length} row(s) will be skipped (parse errors)
            </h3>
            <ul className={styles.list}>
              {preview.parseErrors.slice(0, 10).map((err) => (
                <li key={err.rowNumber}>
                  Row {err.rowNumber}: {err.error}
                </li>
              ))}
              {preview.parseErrors.length > 10 ? (
                <li>…and {preview.parseErrors.length - 10} more</li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {unmatchedGroups.length > 0 ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {unmatchedGroups.length} description{unmatchedGroups.length === 1 ? '' : 's'} need
              manual classification
            </h3>
            <p className={styles.hint}>
              Rows left unclassified will be skipped on import.
            </p>
            <div className={styles.unmatchedList}>
              {unmatchedGroups.map((g) => {
                const filteredCategories = categories.filter((c) => c.type === g.type);
                return (
                  <div key={g.description} className={styles.unmatchedRow}>
                    <span className={styles.unmatchedDesc} title={g.description}>
                      {g.description}
                    </span>
                    <span className={styles.unmatchedCount}>×{g.rowNumbers.length}</span>
                    <select
                      className={styles.unmatchedSelect}
                      value={g.type}
                      onChange={(e) => onGroupChange(g.description, 'type', e.target.value)}
                      aria-label="Type"
                    >
                      <option value="">Type…</option>
                      {TRANSACTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      className={styles.unmatchedSelect}
                      value={g.category}
                      onChange={(e) => onGroupChange(g.description, 'category', e.target.value)}
                      disabled={!g.type}
                      aria-label="Category"
                    >
                      <option value="">Category…</option>
                      {filteredCategories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {preview.unknownCategories.length > 0 ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {preview.unknownCategories.length} new categor
              {preview.unknownCategories.length === 1 ? 'y' : 'ies'} will be created
            </h3>
            <ul className={styles.list}>
              {preview.unknownCategories.map((c) => (
                <li key={c.name}>
                  <strong>{c.name}</strong> ({c.type})
                </li>
              ))}
            </ul>
            <p className={styles.hint}>Cancel to abort the import if any of these are wrong.</p>
          </div>
        ) : null}

        <div className={tableStyles.modalActions}>
          <button
            type="button"
            className={`${tableStyles.modalBtn} ${tableStyles.modalBtnCancel}`}
            onClick={onCancel}
            disabled={isImporting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${tableStyles.modalBtn} ${tableStyles.modalBtnConfirm}`}
            onClick={onConfirm}
            disabled={isImporting || preview.rows.length === 0}
            autoFocus
          >
            {isImporting ? 'Importing…' : `Import ${preview.rows.length} row(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ResultModalProps {
  result: { fileName: string; importedCount: number; errors: ImportRowError[] };
  onClose: () => void;
}

function ResultModal({ result, onClose }: ResultModalProps) {
  return (
    <div
      className={tableStyles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mass-import-result-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${tableStyles.modal} ${styles.modalWide}`}>
        <h2 id="mass-import-result-title" className={tableStyles.modalTitle}>
          Import complete
        </h2>
        <p className={tableStyles.modalBody}>
          Imported <strong>{result.importedCount}</strong> row(s) from{' '}
          <strong>{result.fileName}</strong>.
          {result.errors.length > 0
            ? ` Skipped ${result.errors.length} row(s) due to errors.`
            : ''}
        </p>
        {result.errors.length > 0 ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Skipped rows</h3>
            <ul className={`${styles.list} ${styles.listScroll}`}>
              {result.errors.map((err) => (
                <li key={`${err.rowNumber}-${err.error}`}>
                  <span className={styles.errorRowMeta}>
                    Row {err.rowNumber}
                    {err.date ? ` · ${err.date}` : ''}
                    {err.category ? ` · ${err.category}` : ''}
                  </span>
                  <span className={styles.errorRowMessage}>{err.error}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={tableStyles.modalActions}>
          <button
            type="button"
            className={`${tableStyles.modalBtn} ${tableStyles.modalBtnConfirm}`}
            onClick={onClose}
            autoFocus
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
