import React, { useEffect, useState } from "react";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Protectedroute from "./Pages/Protectedroute"; // Import the ProtectedRoute
import { setPersistence, browserSessionPersistence } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });

        return () => unsub();
      })
      .catch((error) => console.error("Persistence error:", error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <Protectedroute user={user}>
              <Dashboard onLogout={handleLogout} user={user} />
            </Protectedroute>
          }
        />

        {/* Redirect root "/" to /dashboard */}
        <Route
          path="/"
          element={
            <Protectedroute user={user}>
              <Dashboard onLogout={handleLogout} user={user} />
            </Protectedroute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
