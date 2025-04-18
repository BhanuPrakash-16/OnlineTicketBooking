import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HostLogin.css";
import axios from "axios";

const HostLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting host login with:", formData); // Debug log
      const response = await axios.post("http://localhost:7004/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Host login response:", response); // Debug log
      if (response.status === 200) {
        const userData = response.data;
        if (userData.role !== "HOST") {
          setError("This account is registered as a User. Please use /login to log in.");
          return;
        }
        // Store user data in localStorage with role
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/host/dashboard"); // Redirect to host dashboard
      }
    } catch (error) {
      console.error("Host login error:", error); // Debug log
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid email or password, or account not verified.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hostlogin-container">
      {/* Left Section */}
      <div className="hostlogin-left">
        <h1 className="hostlogintitle">Why Choose Our Event Management Tool?</h1>
        <br />
        <div className="hostloginbenefits-list">
          <div className="hostloginbenefit-item">
            <img
              src="https://www.bigpartnership.co.uk/wp-content/uploads/2022/07/highlight-08.svg"
              alt="Quick Registration"
            />
            <div>
              <h3>Quick Registration</h3>
              <p>Register effortlessly using your PAN card and bank details.</p>
            </div>
          </div>
          <div className="hostloginbenefit-item">
            <img
              src="https://www.smartwires.com/wp-content/uploads/2024/04/SW-OG-47-1030x1030.png"
              alt="Save Time"
            />
            <div>
              <h3>Save Time</h3>
              <p>Our streamlined process ensures a hassle-free experience.</p>
            </div>
          </div>
          <div className="hostloginbenefit-item">
            <img
              src="https://marketdojo.com/wp-content/uploads/2024/03/Tranformational-Reporting.svg"
              alt="Secure & Verified"
            />
            <div>
              <h3>Secure & Verified</h3>
              <p>We prioritize security with verified user authentication.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hostlogin-right">
        <div className="hostloginform-wrapper">
          <h2>Host Login</h2>
          <p>Sign in to manage your events with ease.</p>

          <form className="hostlogin-form" onSubmit={handleLogin}>
            <label>Email Address</label>
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

            <div className="hostloginform-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {error && <span className="error-message">{error}</span>}

            <button type="submit" className="hostlogin-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
          </form>

          <p className="hostsignup-text">
            New to our platform? <Link to="/host/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;