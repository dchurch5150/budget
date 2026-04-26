import type { SourceAdapter } from './types';
import type { ImportRowError, ImportTransactionRow } from '@/lib/types';
import { parseCsv } from './csv';
import { matchRules } from './rules';

// Wells Fargo CSV format (no header row):
//   Date (MM/DD/YYYY), Amount (signed), Running Balance, <empty/check#>, Description

function normalizeDate(raw: string): string {
  // MM/DD/YYYY → YYYY-MM-DD
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return raw.trim();
  return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

export const wellsFargoAdapter: SourceAdapter = {
  id: 'wells-fargo',
  name: 'Wells Fargo',
  parse(text: string) {
    const rows: ImportTransactionRow[] = [];
    const errors: ImportRowError[] = [];

    const grid = parseCsv(text);

    for (let i = 0; i < grid.length; i++) {
      const cells = grid[i];
      const rowNumber = i + 1;

      if (cells.every((c) => c.trim() === '')) continue;

      if (cells.length < 5) {
        errors.push({
          rowNumber,
          date: cells[0] ?? '',
          category: '',
          amount: 0,
          error: `Row has ${cells.length} column(s); expected 5 (Date, Amount, Balance, Check#, Description).`,
        });
        continue;
      }

      const [dateRaw, amountRaw, , , descriptionRaw] = cells;
      const date = normalizeDate(dateRaw);

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push({ rowNumber, date: dateRaw.trim(), category: '', amount: 0, error: `Unrecognized date format "${dateRaw.trim()}".` });
        continue;
      }

      const rawAmount = Number(amountRaw.trim().replace(/,/g, ''));
      if (!Number.isFinite(rawAmount) || rawAmount === 0) {
        errors.push({ rowNumber, date, category: '', amount: 0, error: `Invalid amount "${amountRaw.trim()}".` });
        continue;
      }

      // Wells Fargo uses signed amounts: negative = money out, positive = money in
      const amount = Math.abs(rawAmount);
      const description = descriptionRaw.trim();
      const match = matchRules(description, 'wells-fargo');

      rows.push({
        rowNumber,
        date,
        type: match?.type ?? '',
        category: match?.category ?? '',
        amount,
        tags: [],
        details: description,
        source: 'Wells Fargo',
      });
    }

    return { rows, errors };
  },
};
