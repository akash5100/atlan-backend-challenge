/*  All operations for form table  */

import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/create", (req, res) => {
    const { name, user_id, description } = req.query;
    const data = [name, user_id, description];

    // Check if user_id exists in employee table
    var query = `SELECT * FROM employee WHERE id = ?`;
    db.get(query, user_id, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row === undefined) {
            return res.status(400).json({ error: "User does not exist" });
        }
    });

    const sql = `INSERT INTO form (name, user_id, description, created_at) VALUES (?, ?, ?, datetime('now'))`;
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

// Delete a form by id
router.delete("/delete/:id", (req, res) => {
    const sql = `DELETE FROM form WHERE id = ?`;
    const id = req.params.id;
    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});

// Get all forms
router.get("/get", (req, res) => {
    const sql = `SELECT * FROM form`;
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

// Get a form by id
router.get("/get/:id", (req, res) => {
    const sql = `SELECT * FROM form WHERE id = ?`;
    const id = req.params.id;
    db.get(sql, id, (err, row) => {
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

// Export as a csv
router.get("/export", (req, res) => {
    const sql = `SELECT * FROM form`;
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

export default router;
