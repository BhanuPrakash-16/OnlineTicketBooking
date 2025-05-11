import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/VerifyOtp.css";

const VerifyHostOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("signupEmail"); // Only email is stored for Host

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(-1); // Only last character
    setOtp(newOtp);

    // Auto-focus next field
    if (e.target.value && index < 5) {
      document.getElementsByClassName("otp-input")[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join(""); // Join into a 6-digit string
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7004/api/host-auth/verify-otp", {
        email,
        otp: otpCode,
      });

      if (response.status === 200) {
        localStorage.removeItem("signupEmail"); // Clean up
        navigate("/host/login"); // Redirect to Host login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:7004/api/host-auth/send-otp", {
        email,
      });
      alert("OTP resent successfully!");
    } catch (err) {
      alert("Failed to resend OTP.");
    }
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
          <p>Please enter the 6-digit code sent to {email}.</p>
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

export default VerifyHostOtp;
