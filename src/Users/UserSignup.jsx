import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserSignup.css";
import axios from "axios";

const UserSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password 
      
    ) {
      setSignupError("All fields are required.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const userData = {
      fullName,
      email: formData.email,
      password: formData.password,
     
      role: "USER",
    };

    try {
      setIsSubmitting(true);
      setSignupError("");
      const response = await axios.post("http://localhost:7004/api/auth/send-otp", userData);
      if (response.status === 200) {
        // Store email in localStorage or state to use in OTP verification
        localStorage.setItem("signupEmail", formData.email);
        localStorage.setItem("signupRole", "USER");
        navigate("/verify-otp");
      }
    } catch (error) {
      if (error.response) {
        setSignupError(error.response.data.message || "Failed to send OTP. Please try again.");
      } else if (error.request) {
        setSignupError("Network error. Please check your connection.");
      } else {
        setSignupError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="logingohome">
        <Link to="/">
          <i className="fa fa-arrow-left" aria-hidden="true"></i> go back
        </Link>
      </div>

      <div className="toggle-switch" onClick={handleToggle}>
        <div className="slider left"></div>
        <div className="option">
          <i className="fa-solid fa-user-plus"></i>
          <span className="signuplabel"> Sign Up</span>
        </div>
        <div className="option">
          <i className="fa fa-sign-in"></i>
        </div>
      </div>

      <div className="signup-content">
        <div className="signup-form">
          <h1>Sign Up</h1>
          <p>Create an account to get started</p>

          <div className="name-fields">
            <div className="name-input">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="eg. John"
                required
              />
            </div>
            <div className="name-input">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="eg. Doe"
                required
              />
            </div>
          </div>

          <label>Email</label>
          <div className="password-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {signupError && <span className="error-message">{signupError}</span>}

          <button className="signup-button" onClick={handleSignup} disabled={isSubmitting}>
            {isSubmitting ? "Sending OTP..." : "Sign Up"}
          </button>

          <span className="span">Or</span>

          <button className="signup-google">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <span className="directlogin" onClick={handleToggle}>
              Log In
            </span>
          </p>
        </div>

        <div className="signup-img-container">
          <img
            src="https://www.shutterstock.com/image-photo/crowd-partying-stage-lights-live-600nw-2297236461.jpg"
            alt="Event"
          />
        </div>
      </div>
    </div>
  );
};

export default UserSignup;