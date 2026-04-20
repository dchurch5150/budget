# UI Add Transaction Spec

## Overview

Add the ability to add a new transaction from the budget tracking dashboard.

## Requirements

- Add a button next to the top row to create a new row at the top.
- A blank row appears for the user to manually enter each field. A confirm button appears at the end of the row to commit the transaction to the database. A cancel button would remove the temp row from the ui table and nothing will be committed to the database.
- The user and id should be updated automatically with the rest of the data once it is submitted. The id is calculated as date-source-amount as a single string, with no spaces or punctuation.
- Type should be restricted to the three types defined in the database. The UI should be able to auto-complete.
- Category should be restricted to the categories already defined in the database.
- Multiple tags can be selected. Either ones that already exist, or create new one.
- Balance should not be editable since it is auto-calculated.

## References

- @contact/project-overview.md
