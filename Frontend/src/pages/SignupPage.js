import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiLockAlt } from 'react-icons/bi';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { motion } from 'framer-motion';

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
      <motion.div
        className="bg-[#686D76] bg-opacity-75 p-10 rounded-xl shadow-lg flex flex-col items-center w-full max-w-2xl mx-4 animate-fadeIn"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.h2
          className="text-4xl font-bold text-[#EEEEEE] mb-6 text-center"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Create Your Account
        </motion.h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <motion.form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <InputField icon={<BiUser />} type="text" placeholder="Username" value={username} onChange={setUsername} />
          <InputField icon={<AiOutlineMail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
          <InputField icon={<BiLockAlt />} type="password" placeholder="Password" value={password} onChange={setPassword} />
          <InputField icon={<AiOutlineMail />} type="text" placeholder="Ethereum Address" value={ethereumAddress} onChange={setEthereumAddress} />
          <InputField icon={<AiOutlinePhone />} type="text" placeholder="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
          <InputField icon={<BiUser />} type="text" placeholder="Address Details" value={addressDetails} onChange={setAddressDetails} />

          {/* Role selection dropdown */}
          <motion.div
            className="relative col-span-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
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
          </motion.div>

          <motion.button
            type="submit"
            className="col-span-full w-full p-4 bg-[#DC5F00] text-white rounded-lg hover:bg-[#FFFFFF] hover:text-[#DC5F00] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-6 text-center w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <a href="/signin" className="text-gray-300 hover:text-white underline transition duration-300 ease-in-out">Already have an account? Sign In</a>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <span className="absolute left-3 top-3 text-gray-400 group-hover:text-white transition duration-300 ease-in-out">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 group-hover:border-gray-400 transition duration-300 ease-in-out"
      />
    </motion.div>
  );
}
