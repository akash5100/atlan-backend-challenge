# Run server first

`cd server`

1. `npm install`
2. `npm start`

# Run client

To visualize the data, run the client.

`cd client`

1. `npm install`
2. `npm run dev`

# Run project

*Note:* I used SQLite3, so to visualize the data, you need to install DB Browser for SQLite3. You can download it from [here](https://sqlitebrowser.org/dl/).

*Note:* I used postman to make requests. You can download it from [here](https://www.postman.com/downloads/), I also attached the postman collection in the server folder, you can import it.


1. Run the server first.
    - `cd server && npm install && npm start`

2. Search for slangs: 
    We can use `/search` after we fill the slang and cities table with data.
    - I created `/fill` endpoint to fill the data.
    - Run the server and go to `http://localhost:5000/fill` to fill the data in cities and slang table.
    - After filling the data, go to `http://localhost:5000/search` to search for slangs, with query params `slang`. Currently, it only supports one slang at a time. and dictionary is limited to 4 slangs and 4 cities.(in dummy data)
    - Example: `http://localhost:5000/search?slang=lit`

3. Create employee (user):
    - Run the server and go to `http://localhost:5000/employee/add` to create an employee.
    - Example: http://localhost:5000/employee/add?full_name=Jeremy&age=32&salary=32000&savings=10000&email=Jeremy@gmail.com&phone=1782261231
    - I implemented CRUD for employee, so you can also update and delete employee. See the API documentation for more details.

4. Create a new form:
    - Run the server and go to `http://localhost:5000/form/add` to create a new form.
    - Example: http://localhost:5000/form/create?name=Demo&user_id=1&description=Demo
    - Create question in the form.
    - Example: http://localhost:5000/question/create?form_id=1&question=what%20is%20your%20gender
    - Create response for form.
    - Example: http://localhost:5000/response/create?form_id=1
    - Create answer for response.
    - Example: http://localhost:5000/answer/create?response_id=1&question_id=1&answer=male

5. Message queue
    - To see the message queue, you should also run the client.
    - Run the client and go to `http://localhost:3000` to see the table.
    - Add a employee and keep refreshing the page to see the message queue.
    - More details in PROPOSAL.md

There are few bugs, I mentioned them in PROPOSAL.md

# [Proposal](PROPOSAL.md)
