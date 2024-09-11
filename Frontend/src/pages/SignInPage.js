import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const { login } = useContext(AuthContext);  // Get login function from AuthContext
  const [email, setEmail] = useState('');  // State for email input
  const [password, setPassword] = useState('');  // State for password input
  const [error, setError] = useState(null);  // State for error messages
  const navigate = useNavigate();  // Hook to programmatically navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call login from AuthContext, passing email and password
      await login(email, password);
      // On successful login, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Set error message if login fails
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default SignInPage;
