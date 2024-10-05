import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext); // Get the current user from the AuthContext

  // If no user is logged in, redirect to the sign-in page
  if (!user) {
    return <Navigate to="/signin" />;  // Redirects to sign-in if no user is found
  }

  // If a specific role is required and the user doesn't match, redirect based on the user's role
  if (role && user.role !== role) {
    if (user.role === 'government official') {
      return <Navigate to="/government-official-dashboard" />;  // Redirect to government dashboard if role mismatch
    }
    return <Navigate to="/user-dashboard" />;  // Default redirect for normal users
  }

  // Render the children (protected component) if the user is authenticated and has the correct role
  return children;
};

export default PrivateRoute;
