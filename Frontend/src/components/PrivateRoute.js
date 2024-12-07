import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading, setUser } = useContext(AuthContext); // Added setUser for token-based user fetching
  const [authLoading, setAuthLoading] = useState(true); // State to track authentication process

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Assuming you might fetch user data based on token
      fetchUserFromToken(token);
    } else {
      setAuthLoading(false);
    }
  }, [user]);

  const fetchUserFromToken = async (token) => {
    try {
      // Fetch user from token (example using axios or fetch)
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data); // Set user in context from the fetched data
      } else {
        // Handle any errors, such as expired token, invalid token, etc.
        localStorage.removeItem('token'); // Clear invalid token
        setUser(null); // Reset user context
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null); // Clear user state on error
    } finally {
      setAuthLoading(false); // End loading state
    }
  };

  if (loading || authLoading) {
    return <div>Loading...</div>; // Show loading while fetching user or checking authentication
  }

  // If user is not logged in and no token, redirect to signin
  if (!user && !localStorage.getItem('token')) {
    console.log('Page rerouting to sign in due to no token');
    return <Navigate to="/signin" />;
  }

  // If the route requires a specific role and the user doesn't have it, redirect them
  if (role && user?.role !== role) {
    console.log(`User role (${user.role}) does not match the required role (${role})`);
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized page if role doesn't match
  }

  // If authenticated and role matches (or no role required), render the children components
  return children;
};

export default PrivateRoute;
