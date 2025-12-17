-- liquibase formatted sql

-- changeset Robin.Mayer:1765979325-1
ALTER TABLE files ADD COLUMN upload_complete boolean;

-- changeset Robin.Mayer:1765979325-2
UPDATE files SET upload_complete = true WHERE is_directory = false;

-- changeset Robin.Mayer:1765979325-3
ALTER TABLE files
    ADD CONSTRAINT files_referenced_file_and_is_directory_false
    CHECK (
        (is_directory = false AND upload_complete IS NOT NULL) OR (is_directory = true AND upload_complete IS NULL)
    );