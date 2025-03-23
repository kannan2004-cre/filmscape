import React, { useEffect, useState } from "react";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Collaboration from "./Pages/Collaboration";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Projects from "./Pages/Projects";
import UScenes from "./Pages/userScenes";
import USettings from "./Pages/userSettings";
import Index from "./Pages/home";
import Scripts from "./Pages/Scripts";
import Navbar from "./Components/Navbar";
import Storyboard from "./Pages/Storyboard";
import View from "./Pages/View"; // Import the View component
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Protectedroute from "./Pages/Protectedroute"; // Import the ProtectedRoute
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { AuthProvider } from "./context/AuthContext";

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
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/index" element={<Index />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/storyboard" element={<Storyboard />} />
          
          {/* Shared project viewing route - accessible to anyone */}
          <Route path="/shared/:shareId" element={<View />} />

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
            <Route path="uscripts" element={<Projects user={user} />} />
            <Route path="uscenes" element={<UScenes user={user} />} />
            <Route path="usettings" element={<USettings user={user} />} />
            
            {/* Project sharing feature - protected route */}
            {/* <Route path="share" element={<Collaboration />} /> */}
          </Route>

          {/* Add this redirect route */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;