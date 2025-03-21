Meeting Room Booking System

Overview

This project is a Meeting Room Booking System that allows users to check available meeting slots, book meetings, and generate new slots for a given date. The system is built with a React frontend and an Express.js backend that communicates with a MySQL database.

Tech Stack

Frontend: React, React Router

Backend: Express.js, MySQL

Database: MySQL

Hosting & Environment Management: Node.js with dotenv for environment variables

Backend (Express.js & MySQL)

Setup Instructions

Clone the repository:

Install dependencies:  

Set up environment variables by creating a .env file in the server directory with the following values:

Start the server:

Set up part:

1.Set up for backend setup:

cd meeting-app;

cd server;
npm init -y;
npm install express mysql cors body-parser dotenv;

//to run backend when whole frontend,backend,database setup done
node server.js;

2. Setup Database:
How to Run db.js
Once you've created the file, you can run it with:

cd meeting-app;

//move to database folder in terminal with cd database in main project folder and run
node db.js;

3.Setup for frontend:

cd client
npm install axios react-router-dom @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid;
npm install react-calendar;


//to start backend when whole frontend,backend,database setup done
cd server;
node server.js;

//to start frontend
cd client
npm start;


Response:

✅ Book a Meeting Slot

Endpoint: POST /api/book-slot

Description: Books a meeting slot if it's available.

Request Body:

Response:

✅ Generate Slots for a Date

Endpoint: POST /api/generate-slots

Description: Generates meeting slots for a selected date.

Request Body:

Response:

Frontend (React.js)

Routing (App.js)

The frontend uses React Router for navigation:

Path

Component

Description

/

Home.js

Homepage

/meeting-rooms

MeetingRooms.js

List of available meeting rooms

/booking/:room

Booking.js

Booking page for a selected room

/calendar/:room

CalendarPage.js

Calendar view of room bookings

Running the Frontend

Navigate to the client folder:

Install dependencies:

Start the frontend:

This will run the React app on http://localhost:3000/


This script will:

Create the meetings_db database (if not exists).
Create three tables (meeting_slots, meetings, and meeting_slots_archive).
Close the MySQL connection after execution.

our schema and query to view it :
SELECT table_name, column_name, data_type, column_type
    -> FROM information_schema.columns
    -> WHERE table_schema = 'meetings_db';
+----------------+-------------+-----------+--------------+
| TABLE_NAME     | COLUMN_NAME | DATA_TYPE | COLUMN_TYPE  |
+----------------+-------------+-----------+--------------+
| meeting_slots  | id          | int       | int          |
| meeting_slots  | date        | date      | date         |
| meeting_slots  | time_slot   | varchar   | varchar(50)  |
| meeting_slots  | start_time  | time      | time         |
| meeting_slots  | end_time    | time      | time         |
| meeting_slots  | room        | varchar   | varchar(50)  |
| meeting_slots  | duration    | int       | int          |
| meeting_slots  | is_booked   | tinyint   | tinyint(1)   |
| meeting_slots  | user_email  | varchar   | varchar(100) |
| meeting_slots  | first_name  | varchar   | varchar(50)  |
| meeting_slots  | last_name   | varchar   | varchar(50)  |
| meetings       | id          | int       | int          |
| meetings       | email       | varchar   | varchar(255) |
| meetings       | first_name  | varchar   | varchar(100) |
| meetings       | last_name   | varchar   | varchar(100) |
| meetings       | room        | varchar   | varchar(50)  |
| meetings       | date        | date      | date         |
| meetings       | time        | time      | time         |
| meetings       | duration    | int       | int          |
| meetings       | status      | varchar   | varchar(50)  |
| meetings_slots | id          | int       | int          |
| meetings_slots | date        | date      | date         |
| meetings_slots | time_slot   | varchar   | varchar(20)  |
| meetings_slots | room        | varchar   | varchar(50)  |
| meetings_slots | duration    | int       | int          |
| meetings_slots | is_booked   | tinyint   | tinyint(1)   |
+----------------+-------------+-----------+--------------+