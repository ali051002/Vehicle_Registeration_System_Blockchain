import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';  // Import AuthContext to check authentication and role

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);  // Get the current user from the AuthContext

  // If no user is logged in, redirect to the sign-in page
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // If a specific role is required (e.g., admin) and the user doesn't have that role, redirect to the user dashboard
  if (role && user.role !== role) {
    return <Navigate to="/user-dashboard" />;
  }

  // If the user is authenticated and has the correct role, render the requested component
  return children;
};

export default PrivateRoute;
