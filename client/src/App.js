import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MeetingRooms from "./pages/MeetingRooms";
import Booking from "./pages/Booking";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting-rooms" element={<MeetingRooms />} />
        <Route path="/booking/:room" element={<Booking />} />
        <Route path="/calendar/:room" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
