# How to run this project

1. Clone this repository.
2. Install the dependencies using `npm install`.
3. Run the server using `nodemon server.js`.
4. Open the browser and go to `http://localhost:3000/`.

# Implemented Endpoints

1. `/employee/add` - Add employee to the database.
2. `/employee/get` - Get all employees from the database.
3. `/employee/get/:id` - Get employee by id from the database.
4. `/employee/update/:id` - Update employee by id in the database.
5. `/employee/delete/:id` - Delete employee by id from the database.
6. `/employee/export` - Export all employees from the database as CSV.
7. `/sms` - Adds a new SMS to the message queue.

# What we want to achieve

1. Full Text Search

<!-- Clients wanted to search for slangs (in local language) for an answer to a text question on the basis of cities (which was the answer to a different MCQ question)
```
Solution/Approach:
    - Implement Full Text Search (FTS) with Redis.
    (Note: Why redis?
        - Redis is a key-value store, which is in-memory. So, it is faster than a database.
        - Redis is a NoSQL database, which is more flexible than a SQL database.
        - Redis is a single-threaded database, which is more efficient than a multi-threaded database.)
    - Use the FTS to search for the slangs in the local language.
    - Use the FTS to search for the cities.
```

Example:

Table: cities

| city_id | city_name |
|---------|-----------|
| 1       | Delhi     |
| 2       | Nagpur    |
| 3       | Raipur    |


Table: slangs

| slang_id | slang_name | city_id |
|----------|------------|---------|
| 1        | Dilli      | 1       |
| 2        | pasand     | 2       |
| 3        | bhat       | 3       | -->


2. Data Validation

A market research agency wanted to validate responses coming in against a set of business rules (eg. monthly savings cannot be more than monthly income) and send the response back to the data collector to fix it when the rules generate a flag.

Solution/Approach:
```md
    - Create a relational database with the rules. (To reduce the overhead of maintaining the rules in the code.)
    - Util function to validate incoming data against the business rules.
```

For this project, PostgreSQL/MySQL is a good choice, But I made it in SQLite3 because it is a relational database and serverless. (I dont want to maintain a server for this example. Additionally, later we can use AWS Lambda for testing.)

Create employee SQLite database
```SQL
CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    savings INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
);
```

This will create a table like:
| id | name | age | salary | savings | email | phone |
|----|------|-----|--------|---------|-------|-------|
| 1  | John | 25  | 50000  | 10000   | john@gmail.com | 1234567890 |
| 2  | Jane | 30  | 100000 | 50000   | jane@gmail.com | 1234567891 |


Validation example:
- Employee age cannot be less than 18.
- Employee salary cannot be less than 10000.
- Employee savings cannot be more than salary.
- Employee email cannot be duplicate and must be valid.
- Employee phone number cannot be duplicate and must be 10 digits.

These all will be checked by CONSTRAINT's in the database.

```SQL
CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    savings INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    CONSTRAINT age_check CHECK (age > 18),
    CONSTRAINT salary_check CHECK (salary > 10000),
    CONSTRAINT savings_check CHECK (savings > salary)
);
```

3. Data export

A very common need for organizations is wanting all their data onto Google Sheets, wherein they could connect their CRM, and also generate graphs and charts offered by Sheets out of the box. In such cases, each response to the form becomes a row in the sheet, and questions in the form become columns. 


Solution/Approach:
```md
    - Create a API endpoint to fetch the responses from the database as a JSON.
    - Create a util function to convert the JSON to CSV.
```

For this example, we will use the above employee database.

`json` response from the endpoint be like:
```JSON
[
    {
        "id": 1,
        "name": "John",
        "age": 25,
        "salary": 50000,
        "savings": 10000,
        "email": "john@gmail.com",
        "phone": "1234567890",
    },
    {
        "id": 2,
        "name": "Jane",
        "age": 30,
        "salary": 100000,
        "savings": 50000,
        "email": "Jane@gmail.com",
        "phone": "1234567890",
    }
]
```

```js
// API endpoint to export data as CSV
app.get("/", (_req, res) => {
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
```

Output: 
```csv
id,full_name,age,salary,savings,email,phone
1,Akash,19,30000,10000,akash@gmail.com,9876543210
2,Akash,19,30000,10000,akash1@gmail.com,9876543211
3,Jane,21,32000,10000,Jane@gmail.com,1782361231
```

4. A recent client partner wanted us to send an SMS to the customer whose details are collected in the response as soon as the ingestion was complete reliably. The content of the SMS consists of details of the customer, which were a part of the answers in the response. This customer was supposed to use this as a “receipt” for them having participated in the exercise.

Solution/Approach:
```
    - Create a API endpoint to fetch the responses from the database as a JSON.
    - Create a API endpoint to send the SMS to the customer. (I used Twilio for this)
```

we will use the above employee database and send the details of the employee as SMS to the employee's phone number.

After inserting the employee, we get:
```json
{
    "message": "success",
    "data": {
        "full_name": "Jane",
        "age": "21",
        "salary": "32000",
        "savings": "10000",
        "email": "Jane@gmail.com",
        "phone": "1782361231"
    },
    "id": 1
}
```

We will send the SMS to the employee's phone number using the Twilio API and to make it failsafe, we will use a message queue to store the SMS and then process them asynchronously.

```js
// API endpoint to push the SMS to the message queue
app.post("/sms", (req, res) => {

    const  { phone } = req.body;

    const message = `Hi ${full_name}, welcome to the club!`;

    queue.push({ message, phone });
    res.json({ message: "success" });
});

// Helper function to send the SMS with Twilio
const sendSMS = (message, phone) => {
    client.messages
        .create({
            body: message,
            from: "+12058500000",
            to: phone,
        })
        .then((message) => console.log(message.sid));
};

// Process the SMS in the queue, once the queue is empty, it will wait for 5 seconds and then check again.
const processSMS = () => {
    if (queue.length > 0) {
        const { message, phone } = queue.shift();
        var error = sendSMS(message, phone);
        if (error) {
            queue.push({ message, phone });
        }
    }
    setTimeout(processSMS, 5000);
};
```

# Additional requirements
Design a sample schematic for how you would store forms (with questions) and responses (with answers) in the Collect data store. Forms, Questions, Responses and Answers each will have relevant metadata.
```
    - We use a relational database to store the forms, questions, responses and answers.
```

Eventual consistency is what the clients expect as an outcome of this feature, making sure no responses get missed in the journey. Do keep in mind that this solution must be failsafe, should eventually recover from circumstances like power/internet/service outages, and should scale to cases like millions of responses across hundreds of forms for an organization.
```
    - We use a message queue to store the responses and then process them asynchronously.
    (We can use a message queue like RabbitMQ or Kafka or we can implement one with Redis, but due to time constraints, I used a simple queue in nodejs with npm package called message-queue)
```

Design a sample schematic for how you would store forms (with questions) and responses (with answers) in the Collect data store. Forms, Questions, Responses and Answers each will have relevant metadata

```SQL
CREATE TABLE form (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
