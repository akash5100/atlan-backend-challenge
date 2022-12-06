# Architecture

## Form, Question, Response, Answer

Forms and questions can be stored in a SQL or NoSQL database as structured data, with each form and question having its own record. The form record can contain metadata such as the form's name, description, and creation date, as well as a list of questions that are associated with the form. Each question record can contain metadata such as the question text, data type (e.g. text, multiple choice, etc.), and any other relevant information.

This is the schema that I have created for the database:

Tables:
- form
    - id
    - name
    - description
    - created_at
    - updated_at
- question
    - id
    - form_id
    - question
    - created_at
    - updated_at
    - foreign key (form_id) references form (id)
- response
    - id
    - form_id
    - created_at
    - updated_at
    - foreign key (form_id) references form (id)
- answer
    - id
    - response_id
    - question_id
    - answer
    - created_at
    - updated_at
    - foreign key (response_id) references response (id)
    - foreign key (question_id) references question (id)

### Create tables with the following schema:

```SQL
CREATE TABLE form (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE question (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE response (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE answer (
    id INTEGER PRIMARY KEY,
    response_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (response_id) REFERENCES response (id),
    FOREIGN KEY (question_id) REFERENCES question (id)
);
```

Responses and answers can be stored in a separate table or collection in the database, with each response having its own record. The response record can contain metadata such as the form's name, response date, and the respondent's name, as well as a list of answers that are associated with the response. Each answer record can contain the question text and the respondent's answer to that question.

## Data export and integration (Google Sheets)

To support the Google Sheets use case, we can implement a background job that periodically queries the database for new responses and writes them to a Google Sheets document. This job can be configured to run on a regular schedule (e.g. every hour) to ensure that the data in the Google Sheets document stays up-to-date. To avoid exceeding the Google Sheets API rate limits, we can implement rate limiting and retry logic in the background job.

## Plug-in's

To support the other use cases in a plug-n-play fashion, we can implement a messaging system that allows different "actions" to be registered and executed when a new response is received. For example, when a new response is received, the system can publish a message to a message queue with the response data. Any registered actions can then listen for this message and perform the appropriate action (e.g. sending an SMS, validating the response against business rules, etc.). This approach allows new actions to be added and removed without modifying the core data store or background job.

To ensure eventual consistency and handle power/internet/service outages, we can implement a system of record acknowledgement and retry logic. When a response is received, it can be written to a local database that acts as a buffer. The background job can then process the responses in the buffer and write them to the primary data store and any other external systems (e.g. Google Sheets). If any errors occur during the processing, the responses can be retried according to a retry policy. This ensures that all responses are eventually processed and no responses are lost.

To monitor system health and set up alerts, we can implement logging and monitoring for the various components of the system (e.g. the data store, background job, and messaging system). For example, we can set up logs to track the number of responses received and processed, as well as any errors that occur. We can also set up alerts to notify us if the number of unprocessed responses in the buffer exceeds a certain threshold, indicating that the system is not keeping up with the incoming data.

As for limitations on the third party (Google Sheets in this case), we can monitor the rate limits and quotas for the Google Sheets API and adjust our usage accordingly to avoid exceeding them. We can also implement retry logic and rate limiting in the background job to ensure that we don't exceed the API limits and cause disruptions to the system.

Overall, this solution aims to provide a scalable and flexible data collection platform that can support a wide range of post-submission business logic and integrations, while ensuring that all responses are processed reliably and eventually consistent.

# Implementation

1. Search for slangs

At first, I decided to implment Full-text search. But the simplest answer is to just do a basic SQL query, we don't want a full text search because we don't have the full text. Partial search would be better.

```SQL
CREATE TABLE cities (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE slangs (
  id INTEGER PRIMARY KEY,
  slang TEXT NOT NULL,
  translation TEXT,
  city_id INTEGER NOT NULL,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);
```

We create a stand-alone module for the slang search api. 

```js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db');

app.get('/search', (req, res) => {
  const city = req.query.city;
  const query = req.query.q;

  db.all(
    `SELECT slang, translation FROM slangs WHERE city = ? AND slang LIKE ?`,
    [city, `%${query}%`],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: 'No results found' });
        return;
      }

      res.send({
        results: rows.map(row => ({
          slang: row.slang,
          translation: row.translation,
        })),
      });
    },
  );
});

module.exports = app;
```

Now this module can be used as plug-in for the main app.


2. Data Validation and Business Rules

Instead of coding, we can use SQL to validate the data. For example, we can use the `CHECK`, `UNIQUE` and `NOT NULL` etc. to validate the data. Thus, reduce the complexity and overhead of the code.

For this project, PostgreSQL/MySQL is a good choice, but I choose SQLite3 because it is a relational database and serverless. I don't need to set up a server to run the database.

Pros:
- Relational database
- Lightweight
- serverless
- Low maintenance
- Faster than MySQL
- Easy to set up

Cons:
- Size limited to 281 terabytes 
- Other SQLite3 limitations but they are not a problem for this project


Create employee (or user) SQLite database
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
-- Not Final
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

3. Data Export to Google Sheets

- First, we create an API endpoint to export data as CSV.
- Then, we create a plug-in whose job is to update the Google Sheets with the CSV data. (if enabled)

For this example, we will use the above employee table.

- #### JSON response from the API endpoint
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

- #### Convert JSON to CSV

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

4. SMS Plugin

If this plugin is enabled, then when we add an employee, it will send a welcome SMS to the employee's phone number.

Using the same employee table, we will add an employee.

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

We will send the SMS to the employee's phone number using the Twilio API and to make it failsafe by the use of message-queue (discussed above) to store the SMS and then process them asynchronously. In this case, I made a table called queue to store name and phone number of the employee. The nodejs server will convert the table to a queue and then process the queue asynchronously. The queue will be processed every 5 seconds. If the SMS is sent successfully, it will be removed from the queue. If the SMS is not sent successfully, it will retry after 5 seconds.

```js

// Helper function to send the SMS with Twilio
const sendSMS = (message, phone) => {
    // Example from documentaion
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
    // Fill the messageQueue with data from the database
    fillQueue();
    // Process the message queue
    if (messageQueue.length > 0) {
        const { name, phone } = messageQueue.shift();
        var error = sendSMS(name, phone);
        if (error) {
            messageQueue.push({ name, phone });
        } else {
            removeMessageFromQueue(name, phone); // Remove the message from the queue table
        }
    }
    setTimeout(processSMS, 5000);
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

// Did we just implement a message queue? 
//      Yes, we did.
```

## Additional requirements

1. Connecting employee table to forms table

Each employee can create a form to collect data from customers. To do this, we will add a column to the employee table called `form_id` which will be a foreign key to the forms table. The new employee table will look like this:

```SQL
CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    savings INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    form_id INTEGER,
    CONSTRAINT age_check CHECK (age > 18),
    CONSTRAINT salary_check CHECK (salary > 10000),
    CONSTRAINT savings_check CHECK (savings > salary),
    CONSTRAINT form_id FOREIGN KEY (form_id) REFERENCES forms(id)
);
```

2. Benchmarking 

To benchmark the performance of a system, we can use a benchmarking tool or framework such as Apache JMeter, LoadRunner, or Siege. These tools allow you to specify the workload that you want to use to test the system, and collect performance metrics such as response times, throughput, and error rates. You can then analyze these metrics to evaluate the performance of the system under the given workload.

3. Logging 

To set up logs for a system, you can use a logging framework or service such as Log4j, Logback, or Elasticsearch. These tools allow you to collect and store log messages generated by the system, and provide features such as log rotation, filtering, and aggregation. You can then use the logs to track the activity and performance of the system, and to troubleshoot issues or identify potential problems.

4. Monitoring

To monitor the health of a system, you can use a monitoring tool or framework such as Prometheus, Grafana, or Datadog. These tools allow you to collect and visualize metrics such as CPU utilization, memory usage, and network traffic, and provide alerts or notifications when certain thresholds or conditions are met. This can help you identify potential issues or problems with the system, and take appropriate action to prevent or resolve them.

5. Alerting

To set up alerts for a system, you can use a notification service or platform such as PagerDuty, Slack, or email. These services helps the team to be notified when certain event occurs. For example, when the system is down, or when the system is not performing well. This can help the team to take appropriate action to resolve the issue.


## Conclusion

- Successfully created a REST API using Node.js and SQLite.
- Implemented search for slang words in the database.
- Created schema for the user (employee) table and added some data to it.
- Created schema for the forms table and related it to the user (employee) table.
- Implemented message-queue to send SMS asynchronously and to make it failsafe in case of power/service/internet failure.
- Created an API to export the data in CSV format and a plugin, which will keep updating the data in Google Sheets.
- Created a plugin to send SMS to the employee's phone number when an employee is added.
- Discussed the additional requirements such as logging, monitoring, alerting, and benchmarking.
- Look into the pros and cons of using SQLite as a database.

## Existing issues

- Message send print 2 times in the console.