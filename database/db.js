const mysql = require("mysql2");

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password", // Replace with your actual MySQL password
});

// Create the database if it doesn't exist
connection.query("CREATE DATABASE IF NOT EXISTS meetings_db", (err) => {
  if (err) throw err;
  console.log("Database created or already exists.");

  // Use the newly created database
  connection.changeUser({ database: "meetings_db" }, (err) => {
    if (err) throw err;

    // Create `meeting_slots` table
    const meetingSlotsTable = `
      CREATE TABLE IF NOT EXISTS meeting_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room VARCHAR(50) NOT NULL,
        duration INT NOT NULL,
        is_booked TINYINT(1) DEFAULT 0,
        user_email VARCHAR(100),
        first_name VARCHAR(50),
        last_name VARCHAR(50)
      )`;

    // Create `meetings` table
    const meetingsTable = `
      CREATE TABLE IF NOT EXISTS meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        room VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        duration INT NOT NULL,
        status VARCHAR(50) NOT NULL
      )`;

    // Create `meeting_slots_archive` table (if needed)
    const meetingSlotsArchiveTable = `
      CREATE TABLE IF NOT EXISTS meeting_slots_archive (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        room VARCHAR(50) NOT NULL,
        duration INT NOT NULL,
        is_booked TINYINT(1) DEFAULT 0
      )`;

    // Execute the queries
    connection.query(meetingSlotsTable, (err) => {
      if (err) throw err;
      console.log("meeting_slots table created or already exists.");
    });

    connection.query(meetingsTable, (err) => {
      if (err) throw err;
      console.log("meetings table created or already exists.");
    });

    connection.query(meetingSlotsArchiveTable, (err) => {
      if (err) throw err;
      console.log("meeting_slots_archive table created or already exists.");
    });

    // Close connection after execution
    connection.end();
  });
});
