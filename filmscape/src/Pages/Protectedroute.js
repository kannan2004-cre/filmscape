import React from 'react';
import { Navigate } from 'react-router-dom';

const Protectedroute = ({ user, children }) => {
  if (!user) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }
  // If user is logged in, render the child components
  return children;
};

export default Protectedroute;
