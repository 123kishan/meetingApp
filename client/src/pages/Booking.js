import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Booking.css"; // Import external CSS

const Booking = () => {
    const navigate = useNavigate();
    const { room } = useParams();

    return (
        <div className="booking-container">
            <div className="overlay"></div>

            <div className="content">
                <h1 className="title">Booking Options for {room}</h1>

                <div className="buttons">
                    <button onClick={() => navigate(`/calendar/${room}`)} className="booking-button">
                        Book with Meeting
                    </button>
                    <button onClick={() => alert("Meeting booked without calendar!")} className="booking-button">
                        Book without Meeting
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
