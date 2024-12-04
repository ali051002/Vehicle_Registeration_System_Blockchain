import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Named import for jwtDecode

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedToken = localStorage.getItem('token'); // Retrieve token from localStorage
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken); // Decode JWT token
      console.log('Response from JWT', decoded);
      const userID = decoded.userId; // Extract userId from decoded token
      console.log("Auth Context user id:", userID);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Set token in axios headers

      // Fetch user data with the token
      axios.get(`http://localhost:8085/api/user/${userID}`)
        .then(response => {
          console.log(response.data);
          setUser(response.data); // Set user data from the response
          setLoading(false); // Stop loading after user data is fetched
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setLoading(false); // Stop loading even if there's an error
        });
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8085/api/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      setToken(response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Set token in axios headers
      console.log('Login successful:', response.data);
      setUser(response.data.user); // Set user data after successful login
      setLoading(false);
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || 'Login failed');
      setLoading(false); // Stop loading if login fails
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    delete axios.defaults.headers.common['Authorization']; // Remove token from axios headers
    setUser(null); // Reset user state to null
    setLoading(false); // Stop loading after logout
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {loading ? <div>Loading...</div> : children} {/* Show loading spinner if still loading */}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
