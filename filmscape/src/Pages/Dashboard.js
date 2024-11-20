import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = ({ onLogout, user }) => {
  return (
    <div className="maincontainer">
      <div className="sidebar">
        <ul>
          <h1><Link to="/">Dashboard</Link></h1>
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="uscripts">Saved Scripts</Link></li>
          <li><Link to="uscenes">Saved Scenes</Link></li>
          <li><Link to="usettings">Edit Account</Link></li>
        </ul>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <div className="dashboard-display">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
