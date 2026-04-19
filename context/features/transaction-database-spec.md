# Transaction Database Spec

## Overview

Build the tables for the budget app. The table `users` tracks users and `transactions` for each individual transaction.

## users Columns

- `id` - unique user id
- `username`
- `email`
- `first_name`
- `last_name`

## transactions Columns

- `user` - user id
- `id` - id of transaction (this will not be auto generated/incremented).
- `date`
- `type`
- `category`
- `amount`
- `tags`
- `details`
- `source`

## References

- @src/lib/mock-data.js
