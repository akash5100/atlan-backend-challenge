import express from "express";
import { PORT } from "./constants.js";
import employeeRouter from "./routes/employee.js";
import { fillQueue, sendSMS, removeMessageFromQueue } from "./utils.js";

const app = express();

// display routes in the root
app.get("/", (req, res) => {
    res.send("Hello World");
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

// Run the processSMS function every 5 seconds
processSMS();

// start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
