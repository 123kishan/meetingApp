import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AvailableSlots from "./AvailableSlots";
import "../styles/CalendarPage.css"; // Import external CSS

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [room, setRoom] = useState("Room 1");
    const [duration, setDuration] = useState(30); // Default duration in minutes

    const handleDateChange = (date) => {
        console.log("Hi I am in CalendarPage ", selectedDate);
        setSelectedDate(date);
    };

    return (
        <div className="calendar-page">
            <div className="overlay"></div>

            <div className="content">
                <h2 className="title">Book a Meeting Slot</h2>

                {/* Calendar for Date Selection */}
                <div className="calendar-container">
                    <Calendar onChange={handleDateChange} value={selectedDate} />
                </div>

                {/* Dropdown for Room Selection */}
                <div className="selector">
                    <label>Select Room:</label>
                    <select value={room} onChange={(e) => setRoom(e.target.value)}>
                        <option value="Room 1">Room 1</option>
                        <option value="Room 2">Room 2</option>
                        <option value="Room 3">Room 3</option>
                    </select>
                </div>

                {/* Dropdown for Duration Selection */}
                <div className="selector">
                    <label>Select Duration:</label>
                    <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                    </select>
                </div>

                {/* Available Slots Component */}
                <AvailableSlots date={selectedDate} room={room} duration={duration} />
            </div>
        </div>
    );
};

export default CalendarPage;
