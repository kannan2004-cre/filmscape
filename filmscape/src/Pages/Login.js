import React from "react";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../css/Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setErrors({ email: "", password: "" });
      alert("login successful");
    } catch (error) {
      // Log the error code to see what we're actually getting
      console.log("Firebase error code:", error.code);

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/invalid-login-credentials":
          setErrors({ ...errors, email: "Invalid email or password" });
          break;
        case "auth/invalid-email":
          setErrors({ ...errors, email: "Invalid email format" });
          break;
        case "auth/user-not-found":
          setErrors({ ...errors, email: "Email not found" });
          break;
        case "auth/wrong-password":
          setErrors({ ...errors, password: "Incorrect password" });
          break;
        case "auth/missing-password":
          setErrors({ ...errors, password: "Password is required" });
          break;
        default:
          console.error("Unhandled Firebase auth error:", error.code);
          setErrors({
            email: error.message || "Login failed. Please try again.",
          });
          setFormData({ ...formData, email: "", password: "" });
      }
    }
  };

  return (
    <div className="login">
      <div></div>
      <form onSubmit={handlesubmit}>
        <h2>Welcome Back!</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={handlechange}
            name="email"
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={handlechange}
            name="password"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;
