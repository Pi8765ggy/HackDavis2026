PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS plants;

CREATE TABLE users (
	sub TEXT PRIMARY KEY,
	zipcode INTEGER,
	zone_code TEXT
);

CREATE TABLE plants (
	id INTEGER PRIMARY KEY,
	owner TEXT NOT NULL,
	name TEXT NOT NULL,
	date_planted TEXT,
	FOREIGN KEY (owner) REFERENCES users(sub)
);
