# Current Feature: Mock Data

## Status

In Progress

## Goals

- Create `src/lib/mock-data.ts` containing mock transaction data modeled after the Budget Tracking screenshot
- Match the transaction shape shown in the screenshot: Date, Type, Category, Amount, Details, Balance, Source, Effective Date
- Add reasonable `tags` per transaction (not shown in screenshot — invent sensible values consistent with category/details)
- Use the three Types (Income, Expenses, Savings) and categories defined in `context/project-overview.md`
- Export a properly typed dataset (no `any`) suitable for powering the Budget Tracking table and Dashboard later

## Notes

- Spec: `context/features/mock-data-spec.md`
- Reference screenshot: `context/screenshots/budget_tracking.png`
- Screenshot categories include some not listed in project-overview (e.g., "Stock Portfolio", "Gold Fund", "Crypto (Non stock portfolio)", "Home/Office") — reconcile with project-overview categories where appropriate, otherwise preserve screenshot wording
- Balance column in screenshot is a running balance — decide whether to store it or compute it; prefer computing from transactions where possible to keep mock data consistent
- Define TypeScript interfaces for Transaction, Type, and Category in the same module (or a shared types file) following coding standards
- Keep the dataset small enough to be readable but large enough to exercise the UI (multiple months, all three types, varied categories and tags)

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: migrated Vite to Next.js + TypeScript, added /dashboard route with dark-mode layout and "Budget Tracking" top bar
