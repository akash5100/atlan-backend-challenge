import express from "express";
import { PORT } from "./constants.js";
import employeeRouter from "./routes/employee.js";
import formRouter from "./routes/form.js";
import questionRouter from "./routes/question.js";
import responseRouter from "./routes/response.js";
import answerRouter from "./routes/answer.js";
import fillRouter from "./routes/fill.js";
import searchRouter from "./routes/search.js";
import { fillQueue, sendSMS, removeMessageFromQueue, isNull } from "./utils.js";
import path from "path";

const app = express();

app.get("/", (req, res) => {
    var __dirname = path.resolve();
    res.sendFile("./index.html", { root: __dirname });
});

// use the employee router
app.use("/employee", employeeRouter);

// use the form router
app.use("/form", formRouter);

// use the question router
app.use("/question", questionRouter);

// use the response router
app.use("/response", responseRouter);

// use the answer router
app.use("/answer", answerRouter);

// use the fill router
app.use("/fill", fillRouter);

// use the search router
app.use("/search", searchRouter);

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
};

//TODO: Make this enable and disable, based on user preference
setInterval(processSMS, 5000);

// start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
