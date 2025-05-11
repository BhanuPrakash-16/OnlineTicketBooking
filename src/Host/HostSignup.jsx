import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HostSignup.css";
import axios from "axios";

const HostSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, email, password } = formData;

    if (!fullName || !phoneNumber || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7004/api/host-auth/send-otp", {
        fullName,
        email,
        password,
        phoneNumber,
      });

      if (response.status === 200) {
        localStorage.setItem("signupEmail", email);
        navigate("/host/verify-otp");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="hostsignup-container">
      {/* Left Section */}
      <div className="hostsignup-left">
        <h1 className="hostsignuptitle">Why Choose Our Event Management Tool?</h1>
        <br />
        <div className="hostsignupbenefits-list">
          <div className="hostsignupbenefit-item">
            <img src="https://www.bigpartnership.co.uk/wp-content/uploads/2022/07/highlight-08.svg" alt="Quick Registration" />
            <div>
              <h3>Quick Registration</h3>
              <p>Register effortlessly using your PAN card and bank details.</p>
            </div>
          </div>
          <div className="hostsignupbenefit-item">
            <img src="https://www.smartwires.com/wp-content/uploads/2024/04/SW-OG-47-1030x1030.png" alt="Save Time" />
            <div>
              <h3>Save Time</h3>
              <p>Our streamlined process ensures a hassle-free experience.</p>
            </div>
          </div>
          <div className="hostsignupbenefit-item">
            <img src="https://marketdojo.com/wp-content/uploads/2024/03/Tranformational-Reporting.svg" alt="Secure & Verified" />
            <div>
              <h3>Secure & Verified</h3>
              <p>We prioritize security with verified user authentication.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hostsignup-right">
        <div className="hostsignupform-wrapper">
          <h2>Host Signup</h2>
          <p>Start managing your events with ease.</p>

          <form className="hostsignup-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />

            {error && <span className="error-message">{error}</span>}

            <button type="submit" className="hostsignup-btn">
              Proceed
            </button>
          </form>

          <p className="hostlogin-text">
            Already have an account? <Link to="/host/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostSignup;
