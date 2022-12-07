import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/create", (req, res) => {
    const { response_id, question_id, answer } = req.query;
    const created_at = new Date().toISOString();
    const sql = `INSERT INTO answer (response_id, question_id, answer, created_at) VALUES (?, ?, ?, ?)`;
    const params = [response_id, question_id, answer, created_at];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: req.body,
            id: this.lastID,
        });
    });
});

router.get("/read", (req, res) => {
    const sql = `SELECT * FROM answer`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

router.get("/read/:id", (req, res) => {
    const sql = `SELECT * FROM answer WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: row,
        });
    });
});

export default router;
