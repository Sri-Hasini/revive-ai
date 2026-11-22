import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    setMessage(
      "Registration form validated! Account creation will be enabled after backend integration."
    );
  };

  return (
    <div className="register-page">

      <nav className="register-navbar">
        <a href="/" className="register-logo">
          ReVive AI ♻
        </a>

        <a href="/" className="register-home">
          Back to Home
        </a>
      </nav>

      <div className="register-container">

        <div className="register-card">

          <div className="register-heading">
            <span className="register-icon">♻</span>

            <h1>Create Your Account</h1>

            <p>
              Join ReVive AI and give unwanted items
              a meaningful second life.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="register-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            <div className="register-field">
              <label>Password</label>

              <div className="register-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="register-field">
              <label>Confirm Password</label>

              <div className="register-password">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="register-terms">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <label>
                I agree to the Terms and Conditions
                and Privacy Policy.
              </label>
            </div>

            {message && (
              <p className="register-message">
                {message}
              </p>
            )}

            <button type="submit" className="register-submit">
              Create Account
            </button>

          </form>

          <div className="register-login">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
