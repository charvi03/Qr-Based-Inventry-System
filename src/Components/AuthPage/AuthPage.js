import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

const URL = process.env.REACT_APP_BASE_URL

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp
      ? "https://qr-based-inventry-system.onrender.com/api/auth/signup"
      : "https://qr-based-inventry-system.onrender.com/api/auth/signin";

    try {
      const response = await axios.post(url, formData);
      console.log("Response Data:", response.data);

      if (isSignUp) {
        if (response.data.error) {
          setErrorMessage(response.data.error);
          setTimeout(() => setErrorMessage(""), 2000);
        } else {
          setSuccessMessage(response.data.message);
          setTimeout(() => setSuccessMessage(""), 2000);
          setTimeout(() => navigate("/admin-dashboard"), 2000);
        }
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        setSuccessMessage("Successfully logged in");
        setTimeout(() => setSuccessMessage(""), 2000);
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setErrorMessage(err.response?.data?.error || "An error occurred");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <nav>
        <h1>Inventory Management System</h1>
        <div>
          <button onClick={() => setIsSignUp(false)}>Sign In</button>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
