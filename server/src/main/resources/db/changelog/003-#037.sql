-- liquibase formatted sql

-- changeset Robin.Mayer:1756517573-1
ALTER TABLE users DROP COLUMN id;
DROP SEQUENCE IF EXISTS users_id_seq;
ALTER TABLE users RENAME COLUMN user_id TO id;