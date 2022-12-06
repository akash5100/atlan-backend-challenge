import express from "express";
import { PORT } from "./constants.js";
import employeeRouter from "./routes/employee.js";
import { fillQueue, sendSMS, removeMessageFromQueue, isNull } from "./utils.js";
import path from "path";

const app = express();

app.get("/", (req, res) => {
    var __dirname = path.resolve();
    res.sendFile("./index.html", { root: __dirname });
});

// use the employee router
app.use("/employee", employeeRouter);

const processSMS = () => {
    // Fill the messageQueue with data from the database
    fillQueue();
    // Process the message queue
    if (messageQueue.length > 0) {
        const { name, phone } = messageQueue.shift();
        var error = sendSMS(name, phone);
        if (error) {
            messageQueue.push({ name, phone });
        } else {
            removeMessageFromQueue(name, phone);
        }
    }
    setTimeout(processSMS, 5000);
};

// This function will be called every 5 seconds
processSMS();

// start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
