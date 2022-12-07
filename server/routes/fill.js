// Fills the cities table and slang table with dummy data

import express from "express";
import cities from "../data/cities.js";
import slangs from "../data/slangs.js";
import db from "../database.js";
import { isNull } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
    const cityQuery = `INSERT INTO cities (id, name, country) VALUES ?`;
    const slangQuery = `INSERT INTO slangs (id, slang, translation, city_id) VALUES ?`;

    db.all("SELECT * FROM cities", (err, rows) => {
        if (isNull("cities")) {
            db.query(cityQuery, [cities.map((city) => [city.id, city.name, city.country])], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
    db.all("SELECT * FROM slangs", (err, rows) => {
        if (isNull("slangs")) {
            db.query(slangQuery, [slangs.map((slang) => [slang.id, slang.slang, slang.translation, slang.city_id])], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
    res.send("Database filled with dummy data");
});

export default router;
