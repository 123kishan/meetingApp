

import React, { useState, useEffect } from "react";
import axios from "axios";
 import "../styles/AvailableSlots.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify"; // Notification popup
import "react-toastify/dist/ReactToastify.css";

const AvailableSlots = ({ date, room, duration }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    console.log("Hi I am in Available selected date  ",date);
    // const formattedDate = date instanceof Date ? date.toISOString().split("T")[0] : "";
    const formattedDate = date instanceof Date
    ? date.toLocaleDateString("en-CA") // Ensures local time is used
    : "";

    // Fetch user details from local storage
    const getUserDetails = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        return userDetails || { email: "", first_name: "", last_name: "" };
    };


    useEffect(() => {
        console.log("Hi I am in Available formatted date  ",formattedDate);
        if (!formattedDate) return;
        fetchSlots();
    }, [formattedDate, room, duration]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/available-slots?date=${formattedDate}&room=${room}&duration=${duration}`
            );
            setSlots(response.data);
        } catch (error) {
            console.error("Error fetching available slots:", error);
            toast.error("Failed to fetch available slots");
        }
        setLoading(false);
    };

    const handleSlotSelection = (slot) => {
        if (!slot.available) return;
        setSelectedSlot(slot);
    };

    const bookSlot = async () => {
        if (!selectedSlot) return;

        const { email, first_name, last_name } = getUserDetails(); // Get user details from local storage

        if (!email || !first_name || !last_name) {
            toast.error("User details are missing! Please log in again.");
            return;
        }
        console.log("Booking slot with data:", {
            date: formattedDate,
            time_slot: selectedSlot.time,
            room,
            user_email: email,
            first_name,
            last_name,
            duration,
        });

        try {
            const response = await axios.post("http://localhost:5000/api/book-slot", {
                date: formattedDate,
                time_slot: selectedSlot.time,
                room,
                user_email: email,
                first_name,
                last_name,
                duration,
            });

            if (response.data.success) {
                toast.success("Slot booked successfully!");
                fetchSlots(); // Refresh slots after booking
                setSelectedSlot(null);
            }
        } catch (error) {
            console.error("Booking failed:", error);
            toast.error("Failed to book the slot.");
        }
    };

    return (
        <div className="slots-container">
            <h3>Available Slots for {formattedDate || "Selected Date"}</h3>

            {loading ? (
                <div className="loading-spinner"></div>
            ) : slots.length === 0 ? (
                <p className="no-slots">No slots available for the selected date and duration.</p>
            ) : (
                <div className="slots-grid">
                    {slots.map((slot, index) => (
                        <button
                            key={index}
                            className={`slot-button ${slot.available ? "available" : "unavailable"}`}
                            disabled={!slot.available}
                            onClick={() => handleSlotSelection(slot)}
                        >
                            {slot.time}{" "}
                            {slot.available ? <FaCheckCircle className="icon" /> : <FaTimesCircle className="icon" />}
                        </button>
                    ))}
                </div>
            )}

            {selectedSlot && (
                <div className="confirmation-popup">
                    <h4>Confirm Booking</h4>
                    <p>Do you want to book the slot at <strong>{selectedSlot.time}</strong>?</p>
                    <button className="confirm-button" onClick={bookSlot}>Yes, Book</button>
                    <button className="cancel-button" onClick={() => setSelectedSlot(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AvailableSlots;


