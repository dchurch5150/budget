# Current Feature: Category DB

## Status

In Progress

## Goals

- Move categories from a static Postgres ENUM into a dedicated `categories` table so they can be managed at runtime
- Each category row records the `transaction_type` it is allowed on (e.g., Dividends → Income, Groceries → Expenses)
- The Add Transaction UI only allows picking a Category once a Type is selected, and filters the Category options to those valid for the chosen Type
- Changing the Type clears the currently selected Category
- A user can either pick an existing category or create a new one on the fly; creating a new category inserts it into the table, pinned to the currently selected Type
- Existing transactions and seed data continue to work after the refactor

## Notes

- Spec: [context/features/category-db-spec.md](context/features/category-db-spec.md)
- Currently `transaction_category` is a Postgres ENUM; schema and seed live in [db/schema.sql](db/schema.sql) and [db/seed.sql](db/seed.sql)
- Out-of-the-box category list is documented in [context/project-overview.md](context/project-overview.md) and should seed the new `categories` table
- Transactions table currently stores `category` as the ENUM — refactor likely changes this to a FK (or text) referencing `categories`
- UI touch points: [src/components/AddTransactionRow.tsx](src/components/AddTransactionRow.tsx) (Type/Category inputs) and the `createTransactionAction` server action
- Need a new query similar to `getDistinctTagsForUser` to fetch categories (optionally filtered by type) for the datalist

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
