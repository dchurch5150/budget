# Category DB Spec

## Overview

Refactor the project so that categories are managed in a table instead of staticly in the app.

## Requirements

- The category table should also track which type a category can be assigned to. For example, Dividends can only be applied to Income, Groceries can only be applied to Expenses, etc.
- The UI should enforce the Category restriction to the Type when creating a new transaction. The user should not be able to select a category unless the Type is already selected. If the Type changes, clear the Category box.
- A user can either select an already existing category or create a new one. Creating a new category adds it to the database, with the currently set Type as the type restriction.

## References

- @contact/project-overview.md
