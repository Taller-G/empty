-- Migration: 001_create_users_table
-- Creates the initial users table for the dasdasdd application.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(254)    NOT NULL,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Unique index on email — enforces the domain uniqueness invariant at DB level.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
    ON users (LOWER(email));

-- Index for common listing query.
CREATE INDEX IF NOT EXISTS users_is_active_idx
    ON users (is_active);

-- Automatically update updated_at on every row modification.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at_trigger ON users;

CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
