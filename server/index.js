const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Mysql@25032000",
    database: process.env.DB_NAME || "meetings_db"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
    console.log("✅ Connected to MySQL");
});

// 🟢 Fetch available slots with duration filter
app.get("/api/available-slots", (req, res) => {
    const { date, room, duration } = req.query;

    if (!date || !room || !duration) {
        return res.status(400).json({ error: "Date, room, and duration are required!" });
    }

    const durationMinutes = parseInt(duration); // Convert duration to minutes

    // Generate all possible time slots from 9 AM to 6 PM
    const generateTimeSlots = () => {
        let slots = [];
        let startTime = 9 * 60; // 9:00 AM in minutes
        let endTime = 18 * 60;  // 6:00 PM in minutes

        while (startTime + durationMinutes <= endTime) {
            let hours = Math.floor(startTime / 60);
            let minutes = startTime % 60;
            let period = hours >= 12 ? "PM" : "AM";
            let displayHours = hours > 12 ? hours - 12 : hours;
            let timeString = `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;

            let endMinutes = startTime + durationMinutes;
            let endHours = Math.floor(endMinutes / 60);
            let endDisplayHours = endHours > 12 ? endHours - 12 : endHours;
            let endPeriod = endHours >= 12 ? "PM" : "AM";
            let endTimeString = `${endDisplayHours}:${(endMinutes % 60).toString().padStart(2, "0")} ${endPeriod}`;

            slots.push(`${timeString} - ${endTimeString}`);
            startTime += 15; // Move in 15-min intervals
        }

        return slots;
    };

    const allSlots = generateTimeSlots();

    // Fetch booked slots from the database
    const query = `SELECT time_slot FROM meeting_slots WHERE date = ? AND room = ? AND is_booked = 1`;

    db.query(query, [date, room], (err, results) => {
        if (err) {
            console.error("❌ Error fetching booked slots:", err);
            return res.status(500).json({ error: "Database error fetching booked slots" });
        }

        let bookedSlots = results.map(slot => slot.time_slot);
        let slotsWithAvailability = allSlots.map(slot => ({
            time: slot,
            available: !bookedSlots.includes(slot) // Mark available (green) or booked (red)
        }));

        res.json(slotsWithAvailability);
    });
});

// 🟢 Book a meeting with conflict checking
app.post("/api/book-slot", (req, res) => {
    console.log("Received booking request:", req.body);
    const { date, time_slot, room, user_email, first_name, last_name, duration } = req.body;

    if (!date || !time_slot || !room || !user_email || !first_name || !last_name || !duration) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    // Convert slot time into MySQL TIME format
    const [startTime, endTime] = time_slot.split(" - ").map(t => {
        let [hours, minutes, period] = t.match(/(\d+):(\d+) (\w+)/).slice(1);
        hours = parseInt(hours) + (period === "PM" && hours !== "12" ? 12 : 0);
        return `${hours.toString().padStart(2, "0")}:${minutes}:00`; // Convert to 'HH:mm:ss'
    });

    // Check for overlapping slots
    const checkQuery = `
        SELECT * FROM meeting_slots
        WHERE date = ? AND room = ?
        AND (
            (? BETWEEN start_time AND ADDTIME(start_time, SEC_TO_TIME(duration * 60))) OR
            (? BETWEEN start_time AND ADDTIME(start_time, SEC_TO_TIME(duration * 60))) OR
            (start_time BETWEEN ? AND ?)
        )
    `;

    db.query(checkQuery, [date, room, startTime, endTime, startTime, endTime], (err, results) => {
        if (err) {
            console.error("❌ Database error checking availability:", err);
            return res.status(500).json({ error: "Database error checking availability" });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "Slot already booked!" });
        }

        // Insert the booking
        const insertQuery = `
            INSERT INTO meeting_slots (date, time_slot, room, duration, is_booked, user_email, first_name, last_name, start_time)
            VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [date, time_slot, room, duration, user_email, first_name, last_name, startTime], (err) => {
            if (err) {
                console.error("❌ Error booking slot:", err);
                return res.status(500).json({ error: "Error booking the slot" });
            }
            res.json({ success: true, message: "Meeting booked successfully!" });
        });
    });
});

// 🟢 Generate slots for a selected date when a user selects it
app.post("/api/generate-slots", (req, res) => {
    const { date } = req.body; 

    if (!date) {
        return res.status(400).json({ error: "Date is required!" });
    }

    const query = `CALL InsertSlotsForDate(?)`;

    db.query(query, [date], (err, result) => {
        if (err) {
            console.error("❌ Error generating slots:", err);
            return res.status(500).json({ error: "Error generating meeting slots" });
        }
        res.json({ success: true, message: `Slots generated for ${date}` });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
