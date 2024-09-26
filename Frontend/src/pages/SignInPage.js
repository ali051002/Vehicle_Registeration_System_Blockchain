import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';
import { BiLockAlt } from 'react-icons/bi';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import Swal from 'sweetalert2';  // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles

export default function SignInPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if email or password is empty
    if (!email || !password) {
      Swal.fire({
        title: 'Error!',
        text: 'Both email and password fields are required.',
        icon: 'error',
        confirmButtonColor: '#F38120',
      });
      return; // Prevent form submission if fields are empty
    }

    try {
      const user = await login(email, password);
      Swal.fire({
        title: 'Login Successful',
        text: `Welcome, ${user.role}! Redirecting to your dashboard...`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
          if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (user.role === 'government official') {
            navigate('/government-official-dashboard');
          } else {
            navigate('/user-dashboard');
          }
        }
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid email or password',
        icon: 'error',
        confirmButtonColor: '#F38120',
      });
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
            <span className="text-[#EEEEEE]"> IN</span>
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
          Sign In
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, easeInOut: 'easeInOut' }}
        >
          <InputField icon={<AiOutlineMail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
          <InputField icon={<BiLockAlt />} type="password" placeholder="Password" value={password} onChange={setPassword} />

          <motion.button
            type="submit"
            className="w-full p-4 bg-[#F38120] text-white rounded-lg hover:bg-[#FFFFFF] hover:text-[#DC5F00] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-6 text-center w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, easeOut: 'easeOut' }}
        >
          <a href="/signup" className="text-gray-600 hover:text-black underline transition duration-300 ease-in-out">Don't have an account? Sign Up</a>
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
