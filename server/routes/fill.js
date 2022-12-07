// Fills the cities table and slang table with dummy data

import express from "express";
import db from "../database.js";
import { isNull } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
    const slangQuery = `INSERT INTO slangs (id, slang, translation, city_id) VALUES (?,?,?,?)`;

    db.all("SELECT * FROM cities", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                db.run("INSERT INTO cities (id, name, country) VALUES (?,?,?)", [1, "Brooklyn", "USA"], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
                db.run("INSERT INTO cities (id, name, country) VALUES (?,?,?)", [2, "Chicago", "USA"], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
                db.run("INSERT INTO cities (id, name, country) VALUES (?,?,?)", [3, "New Orleans", "USA"], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
                db.run("INSERT INTO cities (id, name, country) VALUES (?,?,?)", [4, "Philadelphia", "USA"], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }

        db.all("SELECT * FROM slangs", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    db.run(slangQuery, [1, "lit", "Cool, awesome, great, etc", 1], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    db.run(slangQuery, [2, "bruh", "Brother, friend, dude, etc", 1], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    db.run(slangQuery, [3, "dump", "To throw away, to get rid of, to discard, etc", 1], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    db.run(slangQuery, [4, "dope", "Cool, awesome, great, etc", 1], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    });
    res.send("Database filled with dummy data");
});

export default router;
