import type { SourceAdapter } from './types';
import type { ImportRowError, ImportTransactionRow } from '@/lib/types';
import { parseCsv } from './csv';
import { matchRules } from './rules';

// Fidelity activity CSV header row:
//   Run Date, Action, Symbol, Description, Type, Quantity, Price, Commission, Amount
//
// The "Action" column is structured (e.g. "DIVIDEND RECEIVED", "YOU BOUGHT", "TRANSFERRED FROM")
// and is checked against rules before falling back to description-based matching.

function normalizeDate(raw: string): string {
  // Fidelity uses MM/DD/YYYY
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return raw.trim();
  return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

function isHeaderRow(cells: string[]): boolean {
  return cells[0]?.trim().toLowerCase() === 'run date';
}

// Actions that represent non-cash events we skip (buys/sells of securities)
const SKIP_ACTIONS = /^(YOU\s*BOUGHT|YOU\s*SOLD|REINVESTMENT|JOURNALED\s*SHARES|STOCK\s*PLAN)/i;

export const fidelityAdapter: SourceAdapter = {
  id: 'fidelity',
  name: 'Fidelity',
  parse(text: string) {
    const rows: ImportTransactionRow[] = [];
    const errors: ImportRowError[] = [];

    const grid = parseCsv(text);
    if (grid.length === 0) return { rows, errors };

    // Skip header row if present
    const dataStart = isHeaderRow(grid[0]) ? 1 : 0;

    for (let i = dataStart; i < grid.length; i++) {
      const cells = grid[i];
      const rowNumber = i + 1;

      if (cells.every((c) => c.trim() === '')) continue;

      if (cells.length < 9) {
        errors.push({
          rowNumber,
          date: cells[0] ?? '',
          category: '',
          amount: 0,
          error: `Row has ${cells.length} column(s); expected 9 (Run Date, Action, Symbol, Description, Type, Quantity, Price, Commission, Amount).`,
        });
        continue;
      }

      const [dateRaw, actionRaw, , descriptionRaw, , , , , amountRaw] = cells;
      const action = actionRaw.trim();

      // Skip buy/sell/reinvestment events — these are not cash budget transactions
      if (SKIP_ACTIONS.test(action)) continue;

      const date = normalizeDate(dateRaw);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push({ rowNumber, date: dateRaw.trim(), category: '', amount: 0, error: `Unrecognized date format "${dateRaw.trim()}".` });
        continue;
      }

      const rawAmount = Number(amountRaw.trim().replace(/[$,]/g, ''));
      if (!Number.isFinite(rawAmount) || rawAmount === 0) {
        errors.push({ rowNumber, date, category: '', amount: 0, error: `Invalid amount "${amountRaw.trim()}".` });
        continue;
      }

      const amount = Math.abs(rawAmount);
      const description = descriptionRaw.trim();

      // Try matching on the action first, then fall back to description
      const match =
        matchRules(action, 'fidelity') ??
        matchRules(description, 'fidelity');

      rows.push({
        rowNumber,
        date,
        type: match?.type ?? '',
        category: match?.category ?? '',
        amount,
        tags: [],
        details: description || action,
        source: 'Fidelity',
      });
    }

    return { rows, errors };
  },
};
