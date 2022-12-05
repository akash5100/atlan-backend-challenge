/*
    All operations for employee table
*/

import express from "express";
import db from "../database.js";

const router = express.Router();

// Endpoint to add message to message queue
router.post("/", (req, res) => {
    const { message, phone } = req.body;

    const sql = `INSERT INTO sms (message, phone) VALUES (?,?)`;
    const params = [message, phone];

    db.run(sql, params, function (err, _result) {
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

export default router;
