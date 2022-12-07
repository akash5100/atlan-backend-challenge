/*
    This file contains the database connection and the schema for the database
*/

import sqlite3 from "sqlite3";
import { formSchema, questionSchema, responseSchema, answerSchema, citiesSchema, slangsSchema, employeesSchema, queueSchema } from "./schemas/schemas.js";

const DBSOURCE = "db.sqlite";

const Err = (err, name) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else console.log(`connected to ${name} table.`);
};
// Employee table schema
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log("Connected to the database.");

        db.serialize(() => {
            db.run(formSchema), Err(err, "Form");
            db.run(questionSchema), Err(err, "Question");
            db.run(responseSchema), Err(err, "Response");
            db.run(answerSchema), Err(err, "Answer");
            db.run(citiesSchema), Err(err, "Cities");
            db.run(slangsSchema), Err(err, "Slangs");
            db.run(employeesSchema), Err(err, "Employees");
            db.run(queueSchema), Err(err, "Queue");
        });
    }
});

export default db;
