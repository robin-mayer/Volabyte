-- liquibase formatted sql

-- changeset Robin.Mayer:1765554428-1
ALTER TABLE sessions DROP CONSTRAINT sessions_device_id_unique;

-- changeset Robin.Mayer:1765554428-2
ALTER TABLE sessions
    ADD CONSTRAINT sessions_user_id_device_id_unique
    UNIQUE (user_id, device_id);