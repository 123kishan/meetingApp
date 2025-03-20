import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MeetingRooms.css"; // Import external CSS

const MeetingRooms = () => {
    const [pendingMeetings, setPendingMeetings] = useState([]);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({ email: "", first_name: "", last_name: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
            setUserDetails(JSON.parse(storedUser));
        }
        if (!userDetails.email) {
            console.error("No user email found in localStorage");
            return;
        }

        axios.get(`http://localhost:5000/api/meetings?email=${userDetails.email}`)
            .then(response => {
                console.log("API Response:", response.data);
                if (Array.isArray(response.data)) {
                    setPendingMeetings(response.data);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            })
            .catch(error => console.error("Error fetching pending meetings:", error));
    }, [userDetails.email]);

    return (
        <div className="meeting-rooms-container">
            <div className="overlay"></div>

            <div className="content">
                <h1 className="title">Choose a Meeting Room</h1>
                
                <div className="buttons">
                    <button onClick={() => navigate("/booking/meeting_room1")} className="room-button">
                        Meeting Room 1
                    </button>
                    <button onClick={() => navigate("/booking/meeting_room2")} className="room-button">
                        Meeting Room 2
                    </button>
                </div>

                <div className="pending-meetings">
                    <h3>Pending Meetings</h3>
                    {pendingMeetings.length === 0 ? (
                        <p>No pending meetings for your email.</p>
                    ) : (
                        <ul>
                            {pendingMeetings.map((meeting, index) => (
                                <li key={index} className="meeting-item">
                                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time} - {meeting.room}
                                    <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">
                                        <button className="join-button">Join</button>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingRooms;
