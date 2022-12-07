import express from "express";
import db from "../database.js";

const router = express.Router();

router.get("/", (req, res) => {
    const { city, slang } = req.query;
    // Get the translation of the slang
    db.get(`SELECT translation FROM slangs WHERE slang = ?`, [slang], (err, row) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).send(row);
    });
});

export default router;
