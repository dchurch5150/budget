-- Budget app schema (budget_development)
-- Apply via psdev-mcp or psql.

CREATE TYPE transaction_type AS ENUM ('Income', 'Expenses', 'Savings');

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL UNIQUE,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL
);

CREATE TABLE categories (
  name  TEXT PRIMARY KEY,
  type  transaction_type NOT NULL
);

CREATE TABLE transactions (
  id        TEXT PRIMARY KEY,
  "user"    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  type      transaction_type NOT NULL,
  category  TEXT NOT NULL REFERENCES categories(name) ON UPDATE CASCADE ON DELETE RESTRICT,
  amount    NUMERIC(12, 2) NOT NULL,
  tags      TEXT[] NOT NULL DEFAULT '{}',
  details   TEXT NOT NULL DEFAULT '',
  source    TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_transactions_user_date ON transactions("user", date);
CREATE INDEX idx_transactions_category ON transactions(category);
