# Flask PostgreSQL CRUD Application

This repository contains a Flask application that implements a basic CRUD (Create, Read, Update, Delete) interface for managing user data stored in a PostgreSQL database. The application is designed with a simple front end using HTML, CSS, and vanilla JavaScript.

## Features

- **User Management**: Create, read, update, and delete user entries.
- **Data Encryption**: Encrypt user passwords using the Fernet symmetric encryption method from the cryptography library.
- **Database Integration**: Use psycopg2 for PostgreSQL database connection and operations.
- **Frontend**: Simple and responsive user interface using Bootstrap and custom CSS.

## Prerequisites
Before you begin, ensure you have met the following requirements:

Python 3.8 or higher
Flask
psycopg2
cryptography
PostgreSQL database setup locally or on a server

## Installation
Clone the repository to your local machine:

git clone [repository-url]
cd [repository-folder]
Install the necessary Python packages:
pip install Flask psycopg2-binary cryptography

## Configuration
Update the database credentials in the Python script to match your local or remote PostgreSQL setup:

python
Copy code
host = 'localhost'
port = 5432
dbname = 'pythoncruddb'
username = 'postgres'
password = 'mysecretpassword'

## Running the Application
To run the application, execute:
python app.py
This will start the Flask server on http://localhost:5000. Open a web browser and navigate to this address to interact with the application.

## API Endpoints
GET /api/users: Fetch all users.
POST /api/users: Create a new user.
GET /api/users/<id>: Fetch a single user by ID.
PUT /api/users/<id>: Update an existing user.
DELETE /api/users/<id>: Delete a user.
