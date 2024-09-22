import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiLockAlt } from 'react-icons/bi';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [role, setRole] = useState('user');  // Default role
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/user', {
        name: username,
        email,
        password,
        ethereumAddress,
        phoneNumber,
        addressDetails,
        role  // Send the selected role to the backend
      });
      if (response.status === 201) {
        alert('User created successfully.');
        navigate('/signin');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
      <div className="bg-[#686D76] bg-opacity-75 p-10 rounded-xl shadow-lg flex flex-col items-center w-full max-w-2xl mx-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-[#EEEEEE] mb-6 text-center" style={{ fontFamily: 'monospace' }}>Create Your Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<BiUser />} type="text" placeholder="Username" value={username} onChange={setUsername} />
          <InputField icon={<AiOutlineMail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
          <InputField icon={<BiLockAlt />} type="password" placeholder="Password" value={password} onChange={setPassword} />
          <InputField icon={<AiOutlineMail />} type="text" placeholder="Ethereum Address" value={ethereumAddress} onChange={setEthereumAddress} />
          <InputField icon={<AiOutlinePhone />} type="text" placeholder="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
          <InputField icon={<BiUser />} type="text" placeholder="Address Details" value={addressDetails} onChange={setAddressDetails} />

          {/* Role selection dropdown */}
          <div className="relative col-span-full">
            <label className="text-[#EEEEEE] font-semibold mb-2 block">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-gray-400 transition duration-300 ease-in-out"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="government official">Government Official</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-full w-full p-4 bg-[#DC5F00] text-white rounded-lg hover:bg-[#FFFFFF] hover:text-[#DC5F00] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center w-full">
          <a href="/signin" className="text-gray-300 hover:text-white underline transition duration-300 ease-in-out">Already have an account? Sign In</a>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative group">
      <span className="absolute left-3 top-3 text-gray-400 group-hover:text-white transition duration-300 ease-in-out">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 group-hover:border-gray-400 transition duration-300 ease-in-out"
      />
    </div>
  );
}
