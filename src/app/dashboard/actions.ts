'use server';

import { revalidatePath } from 'next/cache';
import { deleteTransaction, insertTransaction } from '@/lib/transactions';
import {
  computeTransactionId,
  isCategory,
  isTransactionType,
  type Category,
  type TransactionType,
} from '@/lib/types';

const CURRENT_USER_ID = 1;

export interface CreateTransactionInput {
  date: string;
  type: string;
  category: string;
  amount: number;
  tags: string[];
  details: string;
  source: string;
}

export type CreateTransactionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createTransactionAction(
  input: CreateTransactionInput,
): Promise<CreateTransactionResult> {
  const validation = validate(input);
  if (!validation.ok) return validation;

  const { date, type, category, amount, tags, details, source } = validation;
  const id = computeTransactionId(date, source, amount);

  try {
    await insertTransaction({
      id,
      userId: CURRENT_USER_ID,
      date,
      type,
      category,
      amount,
      tags,
      details,
      source,
    });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === '23505') {
      return { ok: false, error: 'A transaction with this date/source/amount already exists.' };
    }
    return { ok: false, error: 'Failed to save transaction. Please try again.' };
  }

  revalidatePath('/dashboard');
  return { ok: true, id };
}

export type DeleteTransactionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteTransactionAction(id: string): Promise<DeleteTransactionResult> {
  const trimmed = typeof id === 'string' ? id.trim() : '';
  if (!trimmed) {
    return { ok: false, error: 'Transaction id is required.' };
  }

  try {
    const deleted = await deleteTransaction(trimmed, CURRENT_USER_ID);
    if (!deleted) {
      return { ok: false, error: 'Transaction not found.' };
    }
  } catch {
    return { ok: false, error: 'Failed to delete transaction. Please try again.' };
  }

  revalidatePath('/dashboard');
  return { ok: true };
}

type Validated =
  | {
      ok: true;
      date: string;
      type: TransactionType;
      category: Category;
      amount: number;
      tags: string[];
      details: string;
      source: string;
    }
  | { ok: false; error: string };

function validate(input: CreateTransactionInput): Validated {
  const date = input.date?.trim() ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: 'Date is required (YYYY-MM-DD).' };
  }

  const type = input.type?.trim() ?? '';
  if (!isTransactionType(type)) {
    return { ok: false, error: 'Type must be one of Income, Expenses, Savings.' };
  }

  const category = input.category?.trim() ?? '';
  if (!isCategory(category)) {
    return { ok: false, error: 'Category is not recognized.' };
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Amount must be a positive number.' };
  }

  const source = input.source?.trim() ?? '';
  if (source.length === 0) {
    return { ok: false, error: 'Source is required (used in the transaction id).' };
  }

  const tags = Array.isArray(input.tags)
    ? input.tags.map((t) => t.trim()).filter((t) => t.length > 0)
    : [];
  const details = input.details?.trim() ?? '';

  return { ok: true, date, type, category, amount, tags, details, source };
}
