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
7. `/form/create` - Create a form.
8. `/form/get` - Get all forms.
9. `/form/get/:id` - Get form by id.
10. `/form/delete/:id` - Delete form by id.
11. `/form/export` - Export all forms as CSV.

# Example of each endpoint

1. Add employee to the database.

    POST http://localhost:5000/employee/add

    Request body:
    {
        "full_name": "John",
        "email": "John@gmail.com"
        "phone": 1234567890,
        "age": 22,
        "salary": 32000,
        "savings": 10000
    }

    - Make one on the running server: http://localhost:5000/employee/add?full_name=Jacob&age=22&salary=32000&savings=10000&email=Jacob@gmail.com&phone=9926211966

2. Get all employees from the database.
    
        GET http://localhost:5000/employee/get
    
        - Make one on the running server: http://localhost:5000/employee/get

3. Get employee by id from the database.

        GET http://localhost:5000/employee/get/:id
    
        - Make one on the running server: http://localhost:5000/employee/get/1

4. Update employee by id in the database.

        PUT http://localhost:5000/employee/update/:id
    
        Request body:
        {
            "full_name": "John",
            "email": "Johnny@gmail.com",
            "phone": 1234567890,
            "age": 22,
            "salary": 32000,
            "savings": 10000,
        }

        - Make one on the running server: http://localhost:5000/employee/update/1?full_name=Jane&age=21&salary=32000&savings=10000&email=Jane@gmail.com&phone=1782361231

5. Delete employee by id from the database.
    
            DELETE http://localhost:5000/employee/delete/:id
        
            - Make one on the running server: http://localhost:5000/employee/delete/1

6. Export all employees from the database as CSV.

        GET http://localhost:5000/employee/export
    
        - Make one on the running server: http://localhost:5000/employee/export
