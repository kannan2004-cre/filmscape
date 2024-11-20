import React, { useEffect, useState } from "react";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import UScripts from "./Pages/userScripts";
import UScenes from "./Pages/userScenes";
import USettings from "./Pages/userSettings";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard with nested routes */}
        <Route
          path="/"
          element={
            <Protectedroute user={user}>
              <Dashboard onLogout={handleLogout} user={user} />
            </Protectedroute>
          }
        >
          {/* Index route for dashboard default content */}
          <Route index element={<div>Welcome to Dashboard</div>} />
          
          {/* Nested routes */}
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="uscripts" element={<UScripts user={user} />} />
          <Route path="uscenes" element={<UScenes user={user} />} />
          <Route path="usettings" element={<USettings user={user} />} />
        </Route>

        {/* Add this redirect route */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
