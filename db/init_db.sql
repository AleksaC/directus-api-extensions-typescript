CREATE DATABASE directus;

CREATE USER
    admin
WITH
    PASSWORD 'admin';

\c directus;

set role admin;

CREATE TABLE people (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,

    PRIMARY KEY (id)
);
