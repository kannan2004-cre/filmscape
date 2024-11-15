import React from "react";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../css/Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("login successfull");
    } catch (error) {
      alert("login failed");
    }
  };
  return (
    <div className="login">
        <div>
        </div>
      <form onSubmit={handlesubmit}>
        <h2>Welcome Back!</h2>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          onChange={handlechange}
          name="email"
          required
        ></input>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          onChange={handlechange}
          name="password"
          required
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;
