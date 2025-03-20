


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css"; // Import external CSS

const Home = () => {
    const [form, setForm] = useState({ email: "", first_name: "", last_name: "" });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("userDetails", JSON.stringify(form));
        console.log("Saved User Details:", localStorage.getItem("userDetails"));
        navigate("/meeting-rooms");
    };

    return (
        <div className="home-container">
            <div className="overlay"></div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="form-container"
            >
                <h1 className="title">Book Your Meeting Room</h1>
                <form onSubmit={handleSubmit} className="form">
                    {/* First Name Input */}
                    <div className="input-group">
                        <label>First Name</label>
                        <motion.input
                            whileFocus={{ scale: 1.03 }}
                            type="text"
                            placeholder="Enter your first name"
                            required
                            className="input-field"
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        />
                    </div>

                    {/* Last Name Input */}
                    <div className="input-group">
                        <label>Last Name</label>
                        <motion.input
                            whileFocus={{ scale: 1.03 }}
                            type="text"
                            placeholder="Enter your last name"
                            required
                            className="input-field"
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="input-group">
                        <label>Email</label>
                        <motion.input
                            whileFocus={{ scale: 1.03 }}
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="input-field"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="submit-button"
                    >
                        Submit
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Home;





