// Endpoint for filling question table
/*  All operations for employee table  */

import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/create", (req, res) => {
    const { form_id } = req.query;
    const data = [form_id];

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
    console.log(form_id);
    const sql = `INSERT INTO response (form_id, created_at) VALUES (?, datetime('now'))`;

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
