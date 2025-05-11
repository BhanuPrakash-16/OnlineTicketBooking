import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserLogin.css";
import axios from "axios";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle toggle between login and signup views
  const [isLoginView, setIsLoginView] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setLoginError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting login with:", formData); // Debug log
      const response = await axios.post("http://localhost:7004/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login response:", response); // Debug log
      if (response.status === 200) {
        const userData = response.data;
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login Successful");
        navigate("/"); // Redirect to home
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Invalid email or password, or account not verified.");
        } else {
          setLoginError("An error occurred. Please try again.");
        }
      } else {
        setLoginError("Network error. Check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = () => {
    setIsLoginView(!isLoginView);
    navigate(isLoginView ? "/signup" : "/login");
  };

  return (
    <div className="login-container">
      <div className="logingohome">
        <Link to="/">
          <i className="fa fa-arrow-left" aria-hidden="true"></i> go back
        </Link>
      </div>

      <div className="toggle-switch" onClick={handleToggle}>
        <div className={`slider ${isLoginView ? "right" : "left"}`}></div>
        <div className="option">
          <i className="fa-solid fa-user-plus"></i>
          {!isLoginView && <span className="label">Sign Up</span>}
        </div>
        <div className="option">
          <i className="fa fa-sign-in"></i>
          {isLoginView && <span className="label">Log In</span>}
        </div>
      </div>

      <div className="login-content">
        <div className="login-img-container">
          <img
            src="https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4="
            alt="Event"
          />
        </div>

        <div className="login-form">
          <h1>Log In</h1>
          <p>Enter your email and password to access your account</p>

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

          <div className="login-error-container">
            {loginError && <span className="error-message">{loginError}</span>}
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>

          <span className="span">Or</span>

          <button className="login-google">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;