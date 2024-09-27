import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiLockAlt } from 'react-icons/bi';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';  // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Validation regex patterns
  const namePattern = /^[A-Za-z.\s]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const ethereumPattern = /^0x[a-fA-F0-9]{40}$/;

  const validateForm = () => {
    if (!username || !email || !password || !ethereumAddress || !phoneNumber || !addressDetails) {
      setError('All fields are required.');
      return false;
    }

    if (!namePattern.test(username)) {
      setError('Username must contain only English letters, spaces, and dots.');
      return false;
    }

    if (!passwordPattern.test(password)) {
      setError('Password must be at least 8 characters long, contain at least one special character, and one number.');
      return false;
    }

    if (!ethereumPattern.test(ethereumAddress)) {
      setError('Ethereum address must start with 0x followed by 40 hexadecimal characters.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:8085/api/user', {
        name: username,
        email,
        password,
        ethereumAddress,
        phoneNumber,
        addressDetails,
        role,
      });

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'User created successfully. You can now sign in.',
          icon: 'success',
          confirmButtonColor: '#F38120',
          confirmButtonText: 'Sign In',
          background: '#EADFB4',
          backdrop: `
            rgba(0,0,0,0.4)
            url("/images/success.gif")
            left top
            no-repeat
          `,
        }).then(() => {
          navigate('/signin');
        });
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with image and vertical text */}
      <div className="relative w-1/2 overflow-hidden">
        <img
          src="/laptop.jpg"
          alt="Laptop and glasses"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center bg-[#EADFB4] bg-opacity-80">
          <div className="text-[60px] font-bold uppercase leading-none" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
            <span className="text-[#F38120]">SIGN</span>
            <span className="text-[#EEEEEE]"> UP</span>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 bg-[#EEEEEE] flex flex-col justify-center px-12 py-8">
        <motion.h2
          className="text-4xl font-bold text-[#F38120] mb-6 text-center"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Sign Up
        </motion.h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <motion.form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, easeInOut: 'easeInOut' }}
        >
          <InputField
            icon={<BiUser />}
            type="text"
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <InputField
            icon={<AiOutlineMail />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            icon={<BiLockAlt />}
            type="password"
            placeholder="Password (8+ characters, special char, number)"
            value={password}
            onChange={setPassword}
          />
          <InputField
            icon={<AiOutlineMail />}
            type="text"
            placeholder="Ethereum Address"
            value={ethereumAddress}
            onChange={setEthereumAddress}
          />
          <InputField
            icon={<AiOutlinePhone />}
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
          <InputField
            icon={<BiUser />}
            type="text"
            placeholder="Address Details"
            value={addressDetails}
            onChange={setAddressDetails}
          />

          <motion.div
            className="relative col-span-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, easeInOut: 'easeInOut' }}
          >
            <label className="text-[#686D76] font-semibold mb-2 block">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-gray-200 text-black rounded-lg border border-gray-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="government official">Government Official</option>
            </select>
          </motion.div>

          <motion.button
            type="submit"
            className="col-span-full w-full p-4 bg-[#F38120] text-white rounded-lg hover:bg-[#FFFFFF] hover:text-[#DC5F00] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
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
          transition={{ duration: 0.8, easeOut: 'easeOut' }}
        >
          <a
            href="/signin"
            className="text-gray-600 hover:text-black underline transition duration-300 ease-in-out"
          >
            Already a member? Log In
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, easeInOut: 'easeInOut' }}
    >
      <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 p-4 bg-gray-100 text-black rounded-lg border border-gray-300 focus:border-[#DC5F00] focus:outline-none transition duration-300 ease-in-out"
      />
    </motion.div>
  );
}
