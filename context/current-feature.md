# Current Feature: Dashboard UI Phase 2

## Status

In Progress

## Goals

- Build a sortable transaction table on the Budget Tracking page with columns matching the project spec
- Compute a running Balance column: add `Income` amounts, subtract `Expenses` and `Savings` amounts
- Display four summary cards above the table: Today's Date, Date of Last Transaction, Number of Tracked Records, and Current Balance
- Source transactions directly from `src/lib/mock-data.ts` (no database yet)

## Notes

- Reference screenshot: `context/screenshots/budget_tracking.png` (use for layout feel; exact columns differ)
- Reuse the existing `Transaction` model and `computeRunningBalance` helper from `src/lib/mock-data.ts`
- Columns should be sortable (e.g., Date, Type, Category, Amount, Balance)
- Keep dark-mode styling consistent with Phase 1 layout

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
- Mock Data: added src/lib/mock-data.ts with typed Transaction model, 90 seeded transactions (Jan 2025 – Apr 2026), tags column, and a computeRunningBalance helper
