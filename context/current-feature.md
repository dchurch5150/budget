# Current Feature: Mass Import

## Status

In Progress

## Goals

- Add a "Mass Import" button on the dashboard that accepts a CSV file of transactions
- Parse CSV rows in column order: Date, Type, Category, Amount, Tags, Details, Source
- Insert each row as a transaction for the current user, reusing existing validation/id rules from createTransactionAction
- Surface per-row errors (invalid Type, unknown Category for the Type, bad Amount/Date, duplicate id, etc.) without aborting the whole import
- Revalidate /dashboard after a successful import so new rows appear immediately

## Notes

- Spec: context/features/mass-import-spec.md
- Column order is fixed; tags column will use semicolon for delimiter
- Categories must already exist for the given Type, or be auto-created consistent with the single-add flow - for any unknown category found, have a modal confirm if the user wants to create category or cancel import.
- Source is required (used in deterministic id alongside date+amount)
- Should respect the same user scoping as the rest of the dashboard (user id 1 placeholder until auth)

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
- Category DB: replaced transaction_category ENUM with a categories table (name PK, type FK to transaction_type) seeded with the 25 out-of-the-box categories; transactions.category is now TEXT with FK ON UPDATE CASCADE / ON DELETE RESTRICT; added src/lib/categories.ts with getCategories/getCategoryByName/insertCategory; dashboard fetches categories alongside transactions/tags and passes them to AddTransactionRow, where the Category input is disabled until a Type is picked, filtered to that Type's categories, and prompts a confirmation modal on blur when the typed name doesn't exist; createTransactionAction auto-creates new categories pinned to the submitted Type and rejects names that already exist under a different Type
