import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import "../css/Login.css";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Fetch additional user data from Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        // Update user profile with display name
        await updateProfile(userCredential.user, {
          displayName: userDoc.data().name
        });
      }

      setErrors({ email: "", password: "" });
      alert("Login successful");
      setFormData({ email: "", password: "" });
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Firebase error code:", error.code); 

      
      switch (error.code) {
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
            email: "",
            password: "",
            general: "Login failed. Please try again.",
          });
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        {errors.general && (
          <span className="error-message">{errors.general}</span>
        )}
        <button type="submit">Login</button>
        <p className="redirect-text">Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
