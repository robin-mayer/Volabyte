-- liquibase formatted sql

-- changeset Robin.Mayer:1755346255-1
create table files
(
    id                  varchar(36) NOT NULL PRIMARY KEY,
    name                varchar(255) NOT NULL,
    is_directory        boolean NOT NULL,
    referenced_file     varchar(255) CONSTRAINT files_referenced_file_unique UNIQUE,
    parent_id           varchar(36),
    owner_id            varchar(36) NOT NULL,
    uploaded_at         timestamp(6) NOT NULL
);

-- changeset Robin.Mayer:1755346255-2
ALTER TABLE files
    ADD CONSTRAINT files_referenced_file_or_is_directory
    CHECK (
        (is_directory = true  AND referenced_file IS NULL) OR (is_directory = false AND referenced_file IS NOT NULL)
    );