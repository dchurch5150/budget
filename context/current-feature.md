# Current Feature

<!-- Feature Name -->

## Status

Not Started

## Goals

<!-- Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
- Mock Data: added src/lib/mock-data.ts with typed Transaction model, 90 seeded transactions (Jan 2025 – Apr 2026), tags column, and a computeRunningBalance helper
- Dashboard UI Phase 2: added sortable transaction table with running-balance column and four summary cards (today's date, last transaction date, record count, current balance) on /dashboard, sourcing from mock-data.ts
- Transaction Database: created transaction_type and transaction_category Postgres ENUMs, users table (id/username/email/first_name/last_name) and transactions table (id TEXT PK, user FK, date, type, category, amount NUMERIC(12,2), tags TEXT[], details, source) in budget_development, with DDL captured in db/schema.sql
- Database-Backed Dashboard: replaced mock-data.ts with live Postgres reads via a lazy pg Pool and getTransactionsForUser query; /dashboard is now an async server component scoped to user id 1 (placeholder until auth); types moved to src/lib/types.ts; added .env.example and db/seed.sql
- UI Add Transaction: added "+ Add Transaction" button above the dashboard table that opens an inline editable row with Type/Category datalist autocompletes, chip-style multi-tag input (existing + new), read-only Balance, and Confirm/Cancel; new createTransactionAction server action validates input, computes the deterministic id (date-source-amount, non-alphanumerics stripped, amount in cents), inserts via insertTransaction, and revalidates /dashboard; existing tags sourced from a new getDistinctTagsForUser query
- UI Delete Transaction: added a hover-only red × button at the end of each dashboard row; clicking opens a confirmation modal showing the target date/category/amount and a Delete/Cancel pair; new deleteTransactionAction server action calls deleteTransaction(id, userId) scoped to the current user and revalidates /dashboard; AddTransactionRow extended with a trailing cell and error colSpan bumped to 9
