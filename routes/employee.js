/*
    All operations for employee table
*/

import express from "express";
import db from "../database.js";
import { validateData, addMessageToQueue } from "../utils.js";

const router = express.Router();

// Create a new employee
router.post("/add", (req, res) => {
    const { full_name, age, salary, savings, email, phone } = req.query;

    const error = validateData(salary, savings, age, phone);
    if (error) {
        res.status(400).json({ error });
        return;
    }

    const sql = `INSERT INTO employee (full_name, age, salary, savings, email, phone) VALUES (?,?,?,?,?,?)`;
    const params = [full_name, age, salary, savings, email, phone];

    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // Add entry to message queue
        addMessageToQueue(full_name, phone);

        res.json({
            message: "success",
            data: req.query,
            id: this.lastID,
        });
    });
});

// Get all employees
router.get("/get", (_req, res) => {
    const sql = `SELECT * FROM employee`;
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

// Get a single employee
router.get("/get/:id", (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ?`;
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

// Update an employee
router.patch("/update/:id", (req, res) => {
    const { full_name, age, salary, savings, email, phone } = req.body;
    const sql = `UPDATE employee SET full_name = ?, age = ?, salary = ?, savings = ?, email = ?, phone = ? WHERE id = ?`;
    const params = [full_name, age, salary, savings, email, phone, req.params.id];

    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({
            message: "success",
            data: req.body,
            changes: this.changes,
        });
    });
});

// Delete an employee
router.delete("/delete/:id", (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});

// Download CSV file of all data in the employee table
router.get("/export", (_req, res) => {
    const sql = `SELECT * FROM employee`;
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const header = "id,full_name,age,salary,savings,email,phone";
        var csv = rows.map((row) => Object.values(row).join(",")).join("\n");
        csv = header + "\n" + csv;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=employee.csv");
        res.send(csv);
    });
});

export default router;
