-- liquibase formatted sql

-- changeset Robin.Mayer:1765545992-1
-- make field last_login_at nullable
ALTER TABLE users ALTER COLUMN last_login_at DROP NOT NULL;