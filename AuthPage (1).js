import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isSignUp ? "/signup" : "/signin";
      const payload = isSignUp ? { username, email, password } : { email, password };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      alert(response.data.message);

      if (!isSignUp) {
        localStorage.setItem("token", response.data.token); // Store JWT token
        navigate("/HomePage"); // Redirect to HomePage after successful login
      } else {
        setIsSignUp(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button className={!isSignUp ? "active" : ""} onClick={() => setIsSignUp(false)}>Sign In</button>
        <button className={isSignUp ? "active" : ""} onClick={() => setIsSignUp(true)}>Sign Up</button>
      </div>

      <div className="auth-form">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" placeholder="Full Name" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="auth-button">{isSignUp ? "Sign Up" : "Sign In"}</button>
        </form>

        <p className="switch-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? " Sign In" : " Sign Up"}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
