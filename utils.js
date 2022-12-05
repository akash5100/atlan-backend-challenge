/*
 * After CONSTRAINTS are defined, do we need to validate the data?
    For the phone number, yes.
 */
import db from "./database.js";

const validateData = (salary, savings, age, phone) => {
    if (age < 18) {
        return "Age must be greater than 18";
    }
    if (salary < 10000) {
        return "Salary must be greater than 10000";
    }
    if (savings > salary) {
        return "Savings must be less than salary";
    }
    if (String(phone).length !== 10) {
        return "Phone number must be 10 digits";
    }
    return null;
};

const fillQueue = () => {
    // Fill the global queue with the data from the database
    // Format: {name, phone}
    const sql = `SELECT name, phone FROM queue`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            messageQueue.push(row);
        });
    });
};

const removeMessageFromQueue = (name, phone) => {
    const sql = `DELETE FROM queue WHERE name = ? AND phone = ?`;
    const params = [name, phone];

    db.run(sql, params, function (err, _result) {
        if (err) {
            console.log(err.message);
        }
    });
};

const addMessageToQueue = (name, phone) => {
    const sql = `INSERT INTO queue (name, phone) VALUES (?,?)`;
    const params = [name, phone];

    db.run(sql, params, function (err, _result) {
        if (err) {
            console.log(err.message);
        }
    });
};

const sendSMS = (name, phone) => {
    // Send an SMS to the employee
    // Twilio API here
    // This is a dummy function
    console.log(`Sending SMS to ${name} at ${phone}`);
};

export { validateData, addMessageToQueue, sendSMS, fillQueue, removeMessageFromQueue };
export default validateData;
