# Current Feature: Transaction Database

## Status

In Progress

## Goals

- Create a `users` table with columns: `id` (unique user id), `username`, `email`, `first_name`, `last_name`
- Create a `transactions` table with columns: `user` (foreign key to users.id), `id` (transaction id, NOT auto-generated/incremented), `date`, `type`, `category`, `amount`, `tags`, `details`, `source`
- Schema should align with the existing `Transaction` model in [src/lib/mock-data.ts](src/lib/mock-data.ts) (types, categories, tags as a collection, etc.)
- Tables created in the `budget_development` Postgres database via the `psdev-mcp` server

## Notes

- Spec source: [context/features/transaction-database-spec.md](context/features/transaction-database-spec.md)
- `transactions.id` is explicitly NOT auto-incremented — the application supplies it (mock data uses string IDs like `t-0001`)
- Reference data shape from mock-data.ts:
  - `type`: "Income" | "Expenses" | "Savings"
  - `category`: union of Income/Expenses/Savings categories (see project-overview.md table)
  - `tags`: array of strings (multiple tags per transaction)
  - `amount`: numeric
  - `date`: ISO date string
  - `details`, `source`: strings
- Schema decisions:
  - `type` → Postgres `ENUM` (Income, Expenses, Savings)
  - `category` → Postgres `ENUM` (full union from project-overview.md categories table)
  - `tags` → `text[]` array column
  - `amount` → `NUMERIC(12, 2)` (two decimal places)

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
- Mock Data: added src/lib/mock-data.ts with typed Transaction model, 90 seeded transactions (Jan 2025 – Apr 2026), tags column, and a computeRunningBalance helper
- Dashboard UI Phase 2: added sortable transaction table with running-balance column and four summary cards (today's date, last transaction date, record count, current balance) on /dashboard, sourcing from mock-data.ts
