'use client';

import { useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { isTransactionType, type Category } from '@/lib/types';
import type {
  ImportRowError,
  ImportTransactionRow,
  ImportTransactionsResult,
} from '@/app/dashboard/actions';
import styles from './MassImportButton.module.css';
import tableStyles from './TransactionsTable.module.css';

interface MassImportButtonProps {
  categories: Category[];
  onImport: (input: {
    rows: ImportTransactionRow[];
    approvedCategories: Array<{ name: string; type: string }>;
  }) => Promise<ImportTransactionsResult>;
}

interface ParsePreview {
  fileName: string;
  rows: ImportTransactionRow[];
  parseErrors: ImportRowError[];
  unknownCategories: Array<{ name: string; type: string }>;
}

export function MassImportButton({ categories, onImport }: MassImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ParsePreview | null>(null);
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

    const grid = parseCsv(text);
    if (grid.length === 0) {
      setError('CSV is empty.');
      return;
    }

    const dataStart = looksLikeHeader(grid[0]) ? 1 : 0;
    const dataRows = grid.slice(dataStart);
    if (dataRows.length === 0) {
      setError('CSV has no data rows.');
      return;
    }

    const parseErrors: ImportRowError[] = [];
    const rows: ImportTransactionRow[] = [];
    for (let i = 0; i < dataRows.length; i++) {
      const cells = dataRows[i];
      const rowNumber = dataStart + i + 1;
      if (cells.every((c) => c.trim() === '')) continue;
      if (cells.length < 7) {
        parseErrors.push({
          rowNumber,
          date: cells[0] ?? '',
          category: cells[2] ?? '',
          amount: 0,
          error: `Row has ${cells.length} column(s); expected 7 (Date, Type, Category, Amount, Tags, Details, Source).`,
        });
        continue;
      }
      const [dateRaw, typeRaw, categoryRaw, amountRaw, tagsRaw, detailsRaw, sourceRaw] = cells;
      const tags = tagsRaw
        .split(';')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const amountNum = Number(amountRaw.trim());
      rows.push({
        rowNumber,
        date: dateRaw.trim(),
        type: typeRaw.trim(),
        category: categoryRaw.trim(),
        amount: Number.isFinite(amountNum) ? amountNum : NaN,
        tags,
        details: detailsRaw.trim(),
        source: sourceRaw.trim(),
      });
    }

    if (rows.length === 0 && parseErrors.length === 0) {
      setError('CSV has no data rows.');
      return;
    }

    const known = new Set(categories.map((c) => c.name));
    const unknownMap = new Map<string, string>();
    for (const r of rows) {
      if (!isTransactionType(r.type)) continue;
      if (!r.category) continue;
      if (known.has(r.category)) continue;
      if (!unknownMap.has(r.category)) unknownMap.set(r.category, r.type);
    }
    const unknownCategories = Array.from(unknownMap.entries()).map(([name, type]) => ({
      name,
      type,
    }));

    setPreview({ fileName: file.name, rows, parseErrors, unknownCategories });
  }

  function cancelPreview() {
    if (isImporting) return;
    setPreview(null);
  }

  function confirmImport() {
    if (!preview) return;
    const current = preview;
    setError(null);
    startTransition(async () => {
      try {
        const r = await onImport({
          rows: current.rows,
          approvedCategories: current.unknownCategories,
        });
        const merged = [...current.parseErrors, ...r.errors].sort(
          (a, b) => a.rowNumber - b.rowNumber,
        );
        setResult({
          fileName: current.fileName,
          importedCount: r.importedCount,
          errors: merged,
        });
        setPreview(null);
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
              isImporting={isImporting}
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
  isImporting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function PreviewModal({ preview, isImporting, onCancel, onConfirm }: PreviewModalProps) {
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
            <p className={styles.hint}>
              Cancel to abort the import if any of these are wrong.
            </p>
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

function looksLikeHeader(cells: string[]): boolean {
  const first = cells[0]?.trim() ?? '';
  return !/^\d{4}-\d{2}-\d{2}$/.test(first);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch === '\r') {
      // handled by '\n'
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
