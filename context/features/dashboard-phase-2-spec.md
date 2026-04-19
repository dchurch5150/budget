# Dashboard UI Phase 1 Spec

## Overview

This is phase 2 for the budget tracking UI layout. Use the screenshot referenced below for a reference, but note that the exact columns will be different. Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 2

- Create a table view for each transaction.
- The columns should be sortable.
- The balance should be a running total of the Amount column.
- When the type is `Income`, the amount should be added to the balance. When the type is `Expenses` or `Savings`, it should be subtracted from the balance.
- Above the table, four cards should display the following items:
  - Today's Date
  - Date of last transaction
  - Number of tracked records
  - The current balance

## References

- @context/screenshots/budget_tracking.png
- @contact/project-overview.md
