# Current Feature: Database-Backed Dashboard

## Status

In Progress

## Goals

- Replace mock-data.ts as the data source for the dashboard with live reads from the `budget_development` Postgres database
- Fetch transactions scoped to user id `1` (hardcoded placeholder until auth is implemented)
- Preserve existing dashboard behavior: sortable transaction table, running-balance column, and the four summary cards
- Keep `Transaction` typing consistent with the DB schema (type/category enums, NUMERIC amount, TEXT[] tags)
- Seed the database with sample transactions so the dashboard has data to render

## Notes

- Assume user id `1` for all queries; no auth yet
- Use server components / server-side data fetching (per coding-standards.md: "Server components by default")
- Need a Postgres client wired into the Next.js app (e.g. `pg` / `postgres` driver) with connection config via env vars
- `computeRunningBalance` helper can stay if it still applies; relocate if needed so it's not tied to mock data
- After migration, `src/lib/mock-data.ts` should either be removed or clearly marked as unused
- A `db/seed.sql` file already exists (untracked) and can be used to populate sample data
- DB DDL reference: `db/schema.sql`

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
- Mock Data: added src/lib/mock-data.ts with typed Transaction model, 90 seeded transactions (Jan 2025 – Apr 2026), tags column, and a computeRunningBalance helper
- Dashboard UI Phase 2: added sortable transaction table with running-balance column and four summary cards (today's date, last transaction date, record count, current balance) on /dashboard, sourcing from mock-data.ts
- Transaction Database: created transaction_type and transaction_category Postgres ENUMs, users table (id/username/email/first_name/last_name) and transactions table (id TEXT PK, user FK, date, type, category, amount NUMERIC(12,2), tags TEXT[], details, source) in budget_development, with DDL captured in db/schema.sql
