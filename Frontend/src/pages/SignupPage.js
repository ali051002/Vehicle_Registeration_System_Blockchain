// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BiUser, BiLockAlt, BiEnvelope, BiPhone, BiIdCard, BiMapPin } from 'react-icons/bi';
import { FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password || !cnic || !phoneNumber || !addressDetails) {
      setIsLoading(false);
      
      // Custom styled error popup using Tailwind CSS classes
      Swal.fire({
        html: `
          <div class="flex flex-col items-center">
            <FaExclamationCircle class="text-6xl text-[#F38120] mb-4" />
            <p class="text-xl text-white">All fields are required!</p>
          </div>
        `,
        background: '#171717',
        color: '#EEEEEE',
        showConfirmButton: true,
        confirmButtonColor: '#F38120',
      });
      return;
    }

    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsRedirecting(true);
      
      // Simulate redirection delay
      setTimeout(() => {
        setIsRedirecting(false);
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'government official') {
          navigate('/government-official-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'Sign up failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#F38120',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#686D76] text-white p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#EEEEEE] rounded-lg shadow-2xl overflow-hidden">
        <motion.div 
          className="md:w-1/3 flex flex-col justify-center items-center p-6 bg-[#EEEEEE]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/SC.png" alt="SecureChain Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold text-[#F38120] mb-2">SecureChain</h1>
          <p className="text-[#F38120] text-center text-sm mb-6">Secure your future with blockchain technology</p>
          <motion.div 
            className="w-full h-1 bg-[#F38120]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.div 
          className="md:w-2/3 bg-[#171717] rounded-border-20 p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-[#F38120]">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                icon={<BiUser />}
                type="text"
                placeholder="Username"
                value={username}
                onChange={setUsername}
              />
              <InputField
                icon={<BiEnvelope />}
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                icon={<BiLockAlt />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />
              <InputField
                icon={<BiIdCard />}
                type="text"
                placeholder="CNIC (XXXXX-XXXXXXX-X)"
                value={cnic}
                onChange={setCnic}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                icon={<BiPhone />}
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <InputField
                icon={<BiMapPin />}
                type="text"
                placeholder="Address Details"
                value={addressDetails}
                onChange={setAddressDetails}
              />
            </div>

            {/* Role Selection */}
            <motion.div
              className="bg-[#2C2C2C] p-3 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <label className="text-[#F38120] font-semibold mb-2 block text-center">Select Your Role</label>
              <div className="flex justify-between">
                {['user', 'admin', 'government official'].map((roleOption) => (
                  <motion.div 
                    key={roleOption} 
                    className={`cursor-pointer p-3 text-center rounded-lg transition duration-300 ease-in-out transform ${
                      role === roleOption ? 'bg-[#F38120] text-white' : 'bg-[#3A3A3A] text-[#EEEEEE]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole(roleOption)}
                  >
                    <span className="capitalize">{roleOption}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-[#F38120] text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-[#e0701c] transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || isRedirecting}
            >
              {isLoading || isRedirecting ? (
                <motion.div
                  className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <span>Sign Up</span>
                  <FaArrowRight />
                </>
              )}
            </motion.button>
          </form>
          <motion.p 
            className="mt-4 text-center text-[#EEEEEE] text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Already have an account?{' '}
            <a href="/signin" className="text-[#F38120] hover:underline">
              Sign In
            </a>
          </motion.p>
        </motion.div>
      </div>
      <AnimatePresence>
        {(isLoading || isRedirecting) && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#171717] p-8 rounded-lg shadow-lg text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 border-t-4 border-[#F38120] rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xl font-semibold text-[#F38120]">
                {isLoading ? "Signing you up..." : "Redirecting to your dashboard..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-[#F38120]">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-8 pr-3 py-2 text-sm bg-[#686D76] text-[#EEEEEE] placeholder-[#EEEEEE] rounded-lg border border-[#EEEEEE] focus:border-[#F38120] focus:ring focus:ring-[#F38120] focus:ring-opacity-50 transition duration-300 ease-in-out"
      />
    </motion.div>
  );
}
