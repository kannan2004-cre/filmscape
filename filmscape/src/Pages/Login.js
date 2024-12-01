import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Link } from "react-router-dom";
import "../css/Login.css";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleGooglelogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in successfully");
      alert(`Welcome ${user.displayName} to filmscape!`);

      // Save user's scripts, scenes, and other data if not already saved
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          projects:[]
        });
      }

      navigate("/index", { state: { name: user.displayName, email: user.email, photoURL: user.photoURL } });
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user's profile with their name from the database if available
      const db = getFirestore();
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        await updateProfile(userCredential.user, {
          displayName: userDoc.data().name,
        });
      }

      setErrors({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-email":
          setErrors({ ...errors, email: "Invalid email format" });
          break;
        case "auth/user-not-found":
          setErrors({ ...errors, email: "Email not found" });
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrors({ ...errors, password: "Incorrect email or password" });
          break;
        case "auth/missing-password":
          setErrors({ ...errors, password: "Password is required" });
          break;
        default:
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
        <button onClick={handleGooglelogin} className="google-login">
          Sign-In with Google
        </button>
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
