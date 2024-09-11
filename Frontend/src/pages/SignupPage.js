import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/user', {
        name: username,
        email,
        password,
        ethereumAddress,
        phoneNumber,
        addressDetails
      });
      if (response.status === 201) {
        alert('User created successfully.');
        navigate('/signin');  // Navigate to the Sign-In page
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <input
          type="text"
          placeholder="Ethereum Address"
          value={ethereumAddress}
          onChange={(e) => setEthereumAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address Details"
          value={addressDetails}
          onChange={(e) => setAddressDetails(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;
