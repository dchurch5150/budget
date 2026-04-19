# Budget

A budget app for tracking expenses, incomes and savings/investments.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm run dev` — Start dev server (Next.js)
- `npm run build` — Production build
- `npm run lint` — Run ESLint (flat config, Next.js core-web-vitals + TypeScript rules)
- `npm run test` — Run unit tests (Vitest, single run)
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Run tests with coverage report

## Postgresql Database

- **Development database**: `budget_development` - Use this by default for all postgres mcp server operations. Uses MCP server `psdev-mcp` to access
- **Production database**: `budget_development` - NEVER use unless explicitly requested. Uses MCP server `psprod-mcp` to access
