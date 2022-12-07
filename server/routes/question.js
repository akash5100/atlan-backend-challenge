// Endpoint for filling question table
/*  All operations for employee table  */

import express from "express";
import db from "../database.js";

const router = express.Router();

/**
 *     id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (form_id) REFERENCES form (id)
 */

router.post("/create", (req, res) => {
    const { form_id, question } = req.query;
    const data = [form_id, question];

    // Check if form_id exists in form table
    var query = `SELECT * FROM form WHERE id = ?`;
    db.get(query, form_id, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row === undefined) {
            return res.status(400).json({ error: "Form does not exist" });
        }
    });

    const sql = `INSERT INTO question (form_id, question, created_at) VALUES (?, ?, datetime('now'))`;
    db.run(sql, data, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID,
        });
    });
});

export default router;
