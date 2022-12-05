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
    - Create a relational database with the business rules. (To reduce the overhead of maintaining the rules in the code.)
    - Util function to validate incoming data against the business rules.
```

For this example, I choose SQLite because it is a relational database and serverless. (I dont want to maintain a server for this example. Additionally, we can use AWS Lambda for testing.)

Create employee SQLite database;
```SQL
CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    salary INTEGER NOT NULL
    savings INTEGER NOT NULL
    email TEXT NOT NULL
    phone TEXT NOT NULL
);
```

Validation example:
- Employee age cannot be less than 18.
- Employee salary cannot be less than 10000.
- Employee savings cannot be more than salary.
- Employee email cannot be duplicate and must be valid.
- Employee phone must be 10 digits.

Validation util function:
```js
const validateData = (req, res, next) => {
    const { name, age, salary, savings, email, phone } = req.body;
    const errors = [];

    if (age < 18) {
        errors.push('Age cannot be less than 18.');
    }

    if (salary < 10000) {
        errors.push('Salary cannot be less than 10000.');
    }

    if (savings > salary) {
        errors.push('Savings cannot be more than salary.');
    }

    if (email) {
        const validEmail = String(email).match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ? next()
            : res.status(400).json({ message: 'Email is not valid.' });
        
        // Check if email is duplicate
        const duplicateEmail = db.get('employee').find({ email
        }).value();

        if (duplicateEmail) {
            errors.push('Email is duplicate.');
        }
    }

    if (phone) {
        return String(phone).length === 10
            ? next()
            : res.status(400).json({ message: 'Phone number must be 10 digits.' });
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    next();
};
```

3. Data export

Each response to the form becomes a row in the sheet, and questions in the form become columns.

Solution/Approach:
```md
    - Create a API endpoint to fetch the responses from the database as a JSON.
    - Create a util function to convert the JSON to CSV.
```

For this example, we will use the above employee database.

JSON res
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
// API endpoint to export data

// function to convert JSON to CSV

// function to download CSV
```

4. A recent client partner wanted us to send an SMS to the customer whose details are collected in the response as soon as the ingestion was complete reliably. The content of the SMS consists of details of the customer, which were a part of the answers in the response. This customer was supposed to use this as a “receipt” for them having participated in the exercise.

Solution/Approach:
```
    - Create a API endpoint to fetch the responses from the database as a JSON.
    - Create a API endpoint to send the SMS to the customer. (I used Twilio for this)
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
