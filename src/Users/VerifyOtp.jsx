import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("signupEmail");
  const role = localStorage.getItem("signupRole"); // Retrieve stored role

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Move focus to next input
    if (e.target.value && index < 5) {
      document.getElementsByClassName("otp-input")[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    try {
      const response = await axios.post("http://localhost:7004/api/auth/verify-otp", {
        email,
        otp: otpCode,
      });
      if (response.status === 200) {
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupRole"); // Clean up role
        // Navigate based on role
        const destination = role === "HOST" ? "/host/login" : "/login";
        navigate(destination);
      }
    } catch (err) {
      setError(err.response?.data || "Invalid OTP");
    }
  };

  const handleResend = () => {
    // Logic to resend OTP (e.g., call send-otp endpoint again)
    console.log("Resend OTP to", email);
    // You could implement resend logic here, e.g., axios.post("/api/auth/send-otp", { email, role });
  };

  return (
    <div className="verify-container">
      <div className="logingohome">
        <Link to="/">
          <i className="fa fa-arrow-left" aria-hidden="true"></i> go back
        </Link>
      </div>

      <div className="verify-content">
        <div className="verify-form">
          <h1>Verify Your Email Address</h1>
          <p>Please enter the 6-digit code we sent to {email}.</p>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="otp-input"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                maxLength="1"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <a href="#" className="send-again" onClick={handleResend}>
            Send Again
          </a>
          {error && <span className="error-message">{error}</span>}
          <button className="verify-button" onClick={handleVerify}>
            Continue
          </button>
        </div>
        <div className="verify-img-container"></div>
      </div>
    </div>
  );
};

export default VerifyOtp;