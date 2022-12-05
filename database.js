/*
    This file contains the database connection and the schema for the database
*/

import sqlite3 from "sqlite3";

const DBSOURCE = "db.sqlite";

// Employee table schema
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log("Connected to the database.");

        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS employee (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                age INTEGER NOT NULL,
                salary INTEGER NOT NULL,
                savings INTEGER NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT NOT NULL UNIQUE
              )`),
                (err) => {
                    if (err) {
                        console.error(err.message);
                        throw err;
                    } else {
                        console.log("User table created.");
                    }
                };
        });
    }
});

export default db;

/*
    Due to SQL query, we only need to validate salary, savings, and age. Thus, we remove the validation for email and phone.
*/
