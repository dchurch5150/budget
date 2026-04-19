-- Budget app schema (budget_development)
-- Apply via psdev-mcp or psql.

CREATE TYPE transaction_type AS ENUM ('Income', 'Expenses', 'Savings');

CREATE TYPE transaction_category AS ENUM (
  'Employment (Net)',
  'Side Hustle',
  'Dividends',
  'Interest',
  'Options Premium',
  'Housing',
  'Utilities',
  'Groceries',
  'Transportation',
  'Insurance',
  'Clothing',
  'Medical',
  'Media',
  'Fun & Vacation',
  'Home Office',
  'Charity',
  'Gifts',
  'Margin',
  'Taxes',
  'Emergency Fund',
  'Retirement Account',
  'Brokerage Account',
  'Crypto',
  'Sinking Fund',
  'Physical Emergency'
);

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL UNIQUE,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL
);

CREATE TABLE transactions (
  id        TEXT PRIMARY KEY,
  "user"    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  type      transaction_type NOT NULL,
  category  transaction_category NOT NULL,
  amount    NUMERIC(12, 2) NOT NULL,
  tags      TEXT[] NOT NULL DEFAULT '{}',
  details   TEXT NOT NULL DEFAULT '',
  source    TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_transactions_user_date ON transactions("user", date);
