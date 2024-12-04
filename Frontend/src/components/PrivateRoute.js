import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading spinner or message while authentication is being verified
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to the login page
  if (!user && !localStorage.getItem('token')) {
    console.log('Page rerouting to sign in due to no token'+ user + 'token ' + localStorage.getItem('token'))
    return <Navigate to="/signin" />;
  }


  // If the route requires a specific role and the user doesn't have it, redirect them
  if (role && user.role !== role) {
    return <Navigate to="/signin" />;
  }

  console.log(children);
  // If authenticated and role matches (or no role required), render the component
  return children;
};

export default PrivateRoute;
