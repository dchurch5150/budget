# Current Feature: UI Add Transaction

## Status

In Progress

## Goals

- Add an "Add Transaction" button near the top of the dashboard transaction table that inserts a new blank editable row at the top
- Blank row has inline inputs for each editable field (Date, Type, Category, Amount, Tags, Details, Source) plus Confirm and Cancel buttons at the end of the row
- Cancel removes the temp row from the UI with no database write; Confirm persists the transaction to Postgres and refreshes the table
- On confirm, auto-populate `user` (current user placeholder: id 1) and `id` (computed as `date-source-amount` concatenated with no spaces or punctuation)
- Restrict Type input to the three database-defined transaction types, with auto-complete
- Restrict Category input to database-defined categories, with auto-complete
- Support multi-select tags that can pick from existing tags or create new ones
- Keep the Balance column read-only (it is auto-calculated by the running-balance helper)

## Notes

- Spec: @context/features/ui-add-transaction-spec.md
- Transaction types/categories are Postgres ENUMs in `db/schema.sql` — source the UI options from there (constants derived from the schema or a query) rather than hardcoding duplicates
- Existing tag set should be derived from distinct tags across the current user's transactions
- Needs a Server Action (or API route) to insert the transaction; server component page currently reads via `getTransactionsForUser` — inserting will require invalidating the route after mutation
- User id is still the hardcoded placeholder (1) until auth exists
- Amount is `NUMERIC(12,2)`; id string must be deterministic — decide formatting for date (likely ISO `YYYY-MM-DD` stripped of dashes) and amount (strip decimal point) when composing the id

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
- Mock Data: added src/lib/mock-data.ts with typed Transaction model, 90 seeded transactions (Jan 2025 – Apr 2026), tags column, and a computeRunningBalance helper
- Dashboard UI Phase 2: added sortable transaction table with running-balance column and four summary cards (today's date, last transaction date, record count, current balance) on /dashboard, sourcing from mock-data.ts
- Transaction Database: created transaction_type and transaction_category Postgres ENUMs, users table (id/username/email/first_name/last_name) and transactions table (id TEXT PK, user FK, date, type, category, amount NUMERIC(12,2), tags TEXT[], details, source) in budget_development, with DDL captured in db/schema.sql
- Database-Backed Dashboard: replaced mock-data.ts with live Postgres reads via a lazy pg Pool and getTransactionsForUser query; /dashboard is now an async server component scoped to user id 1 (placeholder until auth); types moved to src/lib/types.ts; added .env.example and db/seed.sql
