import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import "../css/Register.css";
import { Link , useNavigate} from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };

    setPasswordRequirements(requirements);

    // Check if all requirements are met
    const allRequirementsMet = Object.values(requirements).every(
      (req) => req === true
    );
    if (allRequirementsMet) {
      setIsPasswordFocused(false);
    }
  };

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        createdat: new Date(),
      });
      alert("User created successfully");
      navigate("/login");
    } catch (error) {
      alert("Registration failed!");
    }
  };
  return (
    <div className="register">
      {" "}
      <form onSubmit={handlesubmit}>
        <h2>Welcome to Filmscape !</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="username"
          onChange={handlechange}
          name="name"
          required
        ></input>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          onChange={handlechange}
          name="email"
          required
        ></input>
        <div>
        <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="password"
            onChange={handlechange}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            name="password"
            required
          />
          {isPasswordFocused && (
            <div className="password-requirements">
              <div
                className={`requirement ${
                  passwordRequirements.hasUpperCase ? "met" : "unmet"
                }`}
              >
                {passwordRequirements.hasUpperCase ? "✓" : "✗"} At least one
                uppercase letter
              </div>
              <div
                className={`requirement ${
                  passwordRequirements.hasLowerCase ? "met" : "unmet"
                }`}
              >
                {passwordRequirements.hasLowerCase ? "✓" : "✗"} At least one
                lowercase letter
              </div>
              <div
                className={`requirement ${
                  passwordRequirements.hasNumber ? "met" : "unmet"
                }`}
              >
                {passwordRequirements.hasNumber ? "✓" : "✗"} At least one number
              </div>
              <div
                className={`requirement ${
                  passwordRequirements.hasSpecialChar ? "met" : "unmet"
                }`}
              >
                {passwordRequirements.hasSpecialChar ? "✓" : "✗"} At least one
                special character
              </div>
              <div
                className={`requirement ${
                  passwordRequirements.hasMinLength ? "met" : "unmet"
                }`}
              >
                {passwordRequirements.hasMinLength ? "✓" : "✗"} Minimum 8
                characters
              </div>
            </div>
          )}
        </div>
        <button type="submit">Sign-Up</button>
        <p className="redirect-text">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
export default Register;
