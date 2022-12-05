import express from "express";
import employeeRouter from "./routes/employee.js";

const app = express();

const PORT = 3000;

// display routes in the root
app.get("/", (req, res) => {
    res.send("Hello World");
});

// use the employee router
app.use("/employee", employeeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
