import React from 'react';

const Dashboard = ({ onLogout, user }) => {
  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
