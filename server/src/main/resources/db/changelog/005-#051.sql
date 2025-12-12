-- liquibase formatted sql

-- changeset Robin.Mayer:1765554428-1
ALTER TABLE sessions DROP CONSTRAINT sessions_device_id_unique;