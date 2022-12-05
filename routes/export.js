/*
    Download CSV file of all data in the employee table
*/

import express from "express";
import db from "../database.js";

const router = express.Router();

// Download CSV file of all data in the employee table
router.get("/", (_req, res) => {
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
