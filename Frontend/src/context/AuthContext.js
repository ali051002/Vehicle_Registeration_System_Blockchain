import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to store logged-in user info
  const [loading, setLoading] = useState(true); // Loading state to track authentication status

  // Effect to load user profile if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in axios headers
      axios
        .get('http://localhost:8085/api/profile') // Fetch user profile
        .then((response) => {
          console.log('User profile response:', response.data);
          setUser(response.data.user); // Set user data on successful response
        })
        .catch((error) => {
          console.error('Failed to fetch user profile', error);
          logout(); // Logout if fetching profile fails (invalid token, etc.)
        });
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  // Function to handle login
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8085/api/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Set token in axios
      console.log('Login successful:', response.data);
      setUser(response.data.user); // Set user data (including role and id) after successful login
      return response.data.user; // Return user object
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || 'Login failed');
      throw new Error(error.response?.data?.msg || 'Login failed'); // Throw an error if login fails
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    delete axios.defaults.headers.common['Authorization']; // Remove token from axios headers
    setUser(null); // Reset user state to null
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children} {/* Only render children when not loading */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
