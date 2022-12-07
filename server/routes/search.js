import express from "express";
import db from "../database.js";

const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.body);
});

export default router;
