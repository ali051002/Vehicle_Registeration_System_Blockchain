import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser, BiLockAlt, BiEnvelope, BiPhone, BiIdCard, BiMapPin } from 'react-icons/bi';
import { FaArrowRight, FaExclamationCircle, FaHashtag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Loading from './Loading';

// Reusable InputField Component
function InputField({ icon, type, placeholder, value, onChange, isPassword = false }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#F38120]">
        {icon}
      </div>
      <input
        type={isPassword && isPasswordVisible ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 text-sm bg-[#686D76] text-[#EEEEEE] placeholder-[#EEEEEE] rounded-lg border border-[#EEEEEE] focus:border-[#F38120] focus:ring focus:ring-[#F38120] focus:ring-opacity-50 transition duration-300 ease-in-out"
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#F38120] focus:outline-none"
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </motion.div>
  );
}

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [role, setRole] = useState('user');

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const namePattern = /^[A-Za-z.\s]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;

  const validateFormFields = () => {
    if (!username || !email || !password || !confirmPassword || !cnic || !phoneNumber || !addressDetails) {
      setError('All fields are required.');
      return false;
    }
    if (!namePattern.test(username)) {
      setError('Username must contain only letters, spaces, and dots.');
      return false;
    }
    if (!passwordPattern.test(password)) {
      setError('Password must be at least 8 characters, include one special character, and one number.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!cnicPattern.test(cnic)) {
      setError('CNIC must be in XXXXX-XXXXXXX-X format.');
      return false;
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      setError('Phone number must be exactly 11 digits.');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isOtpSent) {
      if (!validateFormFields()) return;

      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:8085/api/send-Regotp', { email });
        if (res.status === 200) {
          Swal.fire('OTP Sent!', 'Please check your email for the OTP.', 'info');
          setIsOtpSent(true);
        }
      } catch (err) {
        console.error('Error sending OTP:', err);
        Swal.fire('Error', 'Failed to send OTP. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (isOtpSent) {
      if (!otp) {
        setError('Please enter the OTP you received via email.');
        return;
      }

      setIsLoading(true);
      try {
        const verifyRes = await axios.post('http://localhost:8085/api/verify-Regotp', { email, otp });
        if (verifyRes.status === 200) {
          const createRes = await axios.post('http://localhost:8085/api/user', {
            name: username,
            email,
            password,
            cnic,
            phoneNumber,
            addressDetails,
            role,
          });

          if (createRes.status === 201) {
            setIsLoading(false);
            setIsRedirecting(true);

            Swal.fire({
              title: 'Success!',
              text: 'User created successfully. You can now sign in.',
              icon: 'success',
              confirmButtonColor: '#F38120',
              confirmButtonText: 'Sign In',
              background: '#EADFB4',
            }).then(() => {
              navigate('/signin');
            });
          }
        }
      } catch (err) {
        console.error('Error verifying OTP or creating user:', err);
        Swal.fire('Error', 'OTP is invalid/expired or registration failed.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getButtonLabel = () => {
    if (!isOtpSent) return 'Send OTP';
    return 'Verify & Register';
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
          <h1 className="text-2xl font-bold text-[#F38120] mb-2">BlockChain Based Vehicle Registration System</h1>
          <p className="text-[#F38120] text-center text-sm mb-6">
            Secure your future with blockchain technology
          </p>
          <motion.div
            className="w-full h-1 bg-[#F38120]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="md:w-2/3 bg-[#171717] rounded-lg p-6 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-[#F38120]">Sign Up</h2>

          {error && (
            <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded mb-4">
              <FaExclamationCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3">
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
                isPassword
              />
              <InputField
                icon={<BiLockAlt />}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                isPassword
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                icon={<BiIdCard />}
                type="text"
                placeholder="CNIC (XXXXX-XXXXXXX-X)"
                value={cnic}
                onChange={setCnic}
              />
              <InputField
                icon={<BiPhone />}
                type="text"
                placeholder="Phone Number (11 digits)"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </div>
            <InputField
              icon={<BiMapPin />}
              type="text"
              placeholder="Address Details"
              value={addressDetails}
              onChange={setAddressDetails}
            />

            {isOtpSent && (
              <InputField
                icon={<FaHashtag />}
                type="text"
                placeholder="Enter the OTP"
                value={otp}
                onChange={setOtp}
              />
            )}

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
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <span>{getButtonLabel()}</span>
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
            <Link to="/signin" className="text-[#F38120] hover:underline">
              Sign In
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
