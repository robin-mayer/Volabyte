-- liquibase formatted sql

-- changeset Robin.Mayer:1753078054-1
create table users
(
    id            varchar(36) NOT NULL PRIMARY KEY,
    created_at    timestamp(6) NOT NULL,
    last_login_at timestamp(6) NOT NULL,
    user_name     varchar(255) NOT NULL CONSTRAINT users_user_name_unique UNIQUE,
    display_name  varchar(255) NOT NULL,
    password      varchar(255) NOT NULL,
    role          varchar(255) NOT NULL CONSTRAINT users_role_check CHECK (role IN ('ADMIN', 'USER'))
);
