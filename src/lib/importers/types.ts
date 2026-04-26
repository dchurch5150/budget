import type { ImportTransactionRow, ImportRowError } from '@/lib/types';

export interface SourceAdapter {
  id: string;
  name: string;
  parse(text: string): { rows: ImportTransactionRow[]; errors: ImportRowError[] };
}
