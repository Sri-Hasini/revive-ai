import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setMessage(
      "Login form validated successfully! Backend authentication will be connected soon."
    );
  };

  return (
    <div className="login-page">

      <nav className="login-navbar">
        <a href="/" className="login-logo">
          ReVive AI <span>♻</span>
        </a>

        <a href="/" className="back-home">
          ← Back to Home
        </a>
      </nav>

      <main className="login-container">

        <div className="login-left">
          <div className="login-tag">
            ♻ SUSTAINABLE LIVING, SMARTER FUTURE
          </div>

          <h1>
            Welcome Back to
            <span> ReVive AI!</span>
          </h1>

          <p>
            Every item deserves a second chance.
            Sign in and continue your journey towards
            a greener and more sustainable future.
          </p>

          <div className="login-illustration">
            <div className="login-plant">🌱</div>
            <h2>Reuse. Recycle. Revive.</h2>
            <p>Small actions create a better tomorrow.</p>
          </div>
        </div>

        <div className="login-right">

          <div className="login-card">

            <div className="login-card-icon">♻</div>

            <h2>Sign In</h2>

            <p className="login-subtitle">
              Enter your details to access your account.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="login-input-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setMessage("Password recovery will be available soon.")
                  }
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="login-submit">
                Login to Your Account →
              </button>

              {message && (
                <p className="login-message" role="status">
                  {message}
                </p>
              )}

            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <p className="signup-text">
              <div className="login-register">
                Don't have an account?
            {/* <a href="/register"> Register</a> */}
            <Link to="/register">Register</Link>
            </div>
              <a href="/register"> Create Account</a>
            </p>

            <div className="login-footer">
              By continuing, you agree to use ReVive AI
              responsibly and contribute towards a sustainable future.
            </div>

          </div>

        </div>

      </main>

      <footer className="login-bottom">
        © 2026 ReVive AI. Reuse more. Waste less. Revive the future.
      </footer>

    </div>
  );
}

export default Login;
