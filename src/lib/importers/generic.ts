import type { SourceAdapter } from './types';
import { parseCsv } from './csv';
import type { ImportRowError, ImportTransactionRow } from '@/lib/types';

function looksLikeHeader(cells: string[]): boolean {
  const first = cells[0]?.trim() ?? '';
  return !/^\d{4}-\d{2}-\d{2}$/.test(first);
}

export const genericAdapter: SourceAdapter = {
  id: 'generic',
  name: 'Generic (Budget CSV)',
  parse(text: string) {
    const rows: ImportTransactionRow[] = [];
    const errors: ImportRowError[] = [];

    const grid = parseCsv(text);
    if (grid.length === 0) return { rows, errors };

    const dataStart = looksLikeHeader(grid[0]) ? 1 : 0;
    const dataRows = grid.slice(dataStart);

    for (let i = 0; i < dataRows.length; i++) {
      const cells = dataRows[i];
      const rowNumber = dataStart + i + 1;
      if (cells.every((c) => c.trim() === '')) continue;
      if (cells.length < 7) {
        errors.push({
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

    return { rows, errors };
  },
};
