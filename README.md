## Task Management System API

### Overview

This project is a scalable RESTful API built with Node.js and MongoDB for managing tasks with JWT-based user authentication and Redis caching. The API supports task CRUD operations, user registration, and login. Caching is implemented for retrieving task lists, and invalidation is handled for create, update, and delete operations.

### Features

-  User: registration and login
-  JWT Authentication: Secure endpoints using JWT tokens.
-  Task Management: Create, read, update, and delete tasks with pagination support.
-  Redis Caching: Task lists are cached for faster read access.
-  Rate Limiting: Prevent abuse by limiting the number of API requests. User can make 5 
requests in per second.
-  Cloud Deployment: Server deployed on AWS cloud (EC2 Instance)
- Scalability: It is scalable application. We can do horizontal scale. Will do load balancing using nginx server.

### Requirements

-  Node.js (v16+)
-  MongoDB (v4.x+)
-  Redis (for caching)
-  Postman for API testing
-  Nginx (Reverse proxy server)

### Setup

#### Installation

1. Clone the repository:

```bash
git clone <repository_url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by changing in .env file:

```bash
MONGO_HOST=<mongo_host>
MONGO_QUERY_PARAMETERS=<query_parameters_for_mongo>
MONGO_USERNAME=<username>
MONGO_PASSWORD=<password>
DB_NAME=<db_name>
PORT=<port> # default 3000
JWT_SECRET=<secret_key>
REDIS_HOST=<redis_host>
REDIS_PORT=<redis_port>

#### Example

MONGO_HOST=mongo.hycdymo.mongodb.net
MONGO_QUERY_PARAMETERS=?retryWrites=true&w=majority&appName=mongo
MONGO_USERNAME=dasaripravin123
MONGO_PASSWORD=Task123
DB_NAME=TaskMgmtApp
PORT=3000
JWT_SECRET='secret'
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

```

4. Start the server:

```bash

node src/server.js

```

5. Install and setup nginx reverse proxy server

Add the below contain in nginx server configuration file at /etc/nginx/sites-enabled/default

```bash
upstream task-mgmt-upstream {
        server 127.0.0.1:3000;
}

server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name 0.0.0.0;

        location / {
                proxy_pass http://task-mgmt-upstream;
        }
}

```

The server will be running on http://localhost:3000

You can test the below API's by importing postman json file. find the task-mgmt-app.postman_collection.json file in repository, Import the same file in postman. You will get all API test.

### API Documentation

You can interact with the API using Postman once the server is running.

#### User Authentication

#### Register a New User

-  URL: /register
-  Method: POST
-  Body:

```bash
{
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "password": "string"
}
```

-  Explanation

   -  All fields are mandatory
   -  Password should be greater than 8 and less than 16 characters

-  Response

```bash
{
    "message": "User registered successfully"
}
```

#### User Login

-  URL: /login
-  Method: POST
-  Body:

```bash
{
    "username": "string",
    "password": "string"
}
```

-  Response

```bash
{
    "message": "user login success",
    "token": <jwt_token>
}
```

### Task Management

All task operations are JWT protected and require a valid token in the Authorization header.

#### Create a Task

-  URL: /task
-  Method: POST
-  Headers:
   -  Authorization: Bearer <JWT token>
-  Body:

```bash
{
    "title": "string",
    "description": "string",
    "status": "Pending | In Progress | Completed" # default Pending status
    "dueDate": "ISO Date", # 09-11-2024
    "userId": "number"
}
```

-  Explanation

   -  All fields are mandotory except status
   -  Status field is optional and default value is pending

-  Response

```bash
{
    "message": "Task inserted"
}
```

#### Get All Tasks (With Redis Caching)

-  URL: /task
-  Method: GET
-  Headers:
   -  Authorization: Bearer <JWT token>
-  Query Params (optional):
   -  page: Page number (default: 1)
   -  limit: Number of tasks per page (default: 2)
-  Response:

```bash
[
    {
        "title": "string",
        "description": "string",
        "status": "Pending | In Progress | Completed",
        "dueDate": "ISO Date",
        "userId": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "_id": "string", # id
        "taskId": "number",
    },
    {
        "title": "string",
        "description": "string",
        "status": "Pending | In Progress | Completed",
        "dueDate": "ISO Date",
        "userId": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "_id": "string",
        "taskId": "number",
    }
]
```

#### Get a Task by ID

-  URL: /task/:id
-  Method: GET
-  Headers:
   -  Authorization: Bearer <JWT token>
- Exlanation

    - Provide task id in url
-  Response:

```bash
{
    "title": "string",
    "description": "string",
    "status": "Pending | In Progress | Completed",
    "dueDate": "ISO Date",
    "userId": "number",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "_id": "string",
    "taskId": "number",
}
```

#### Update a Task

- URL: /task/:id
- Method: PUT
- Headers:
    - Authorization: Bearer <JWT token>
- Body:
```bash
{
    "title": "string",
    "description": "string",
    "status": "Pending | In Progress | Completed" # default Pending status
    "dueDate": "ISO Date", # 09-11-2024
}
```
- Explanation

    - All fields are optional
    - Provide task id in url

- Response
```bash
{
    "title": "string",
    "description": "string",
    "status": "Pending | In Progress | Completed",
    "dueDate": "ISO Date",
    "userId": "number",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "_id": "string",
    "taskId": "number",
}
```

#### Delete a Task

- URL: /tasks/:id
- Method: DELETE
- Headers:
    - Authorization: Bearer <JWT token>
- Response:
```bash
{
    "title": "string",
    "description": "string",
    "status": "Pending | In Progress | Completed",
    "dueDate": "ISO Date",
    "userId": "number",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "_id": "string",
    "taskId": "number",
}
```

### Caching

Redis caching is implemented for the GET /task /task/:id endpoint. The cache is invalidated automatically whenever a task is created, updated, or deleted to ensure consistency.

### Error Handling

The API includes error handling for:

- Invalid inputs
- Unauthorized access(401)
- Non-existent resources (404 errors)
- Too many requests(429)





