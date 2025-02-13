import React, { useState, useContext } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import SideNavBar from "../../components/SideNavBar";
import TopNavBar from "../../components/TopNavBar";
import { FaEnvelope, FaLock } from "react-icons/fa";

// Reusable Input Field Component
const InputField = ({ icon: Icon, label, name, type, value, onChange, required, placeholder, disabled }) => {
  return (
    <motion.div className="mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <motion.div className="relative rounded-lg shadow-lg overflow-hidden" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="text-[#F38120] w-4 h-4" />}
        </div>
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          disabled={disabled}
          className="block w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-[#F38120] focus:border-[#F38120] transition-all duration-300 bg-[#EEEEEE] bg-opacity-50 backdrop-blur-none"
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
        />
      </motion.div>
    </motion.div>
  );
};

const ChangePasswordGovernmentOfficial = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:8085/api/update-password',
        {
          email: formData.email,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.msg);
      navigate('/government-official-dashboard', {
        state: { successMessage: 'Password updated successfully!' },
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.msg || 'Failed to update password.');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar 
          logout={logout}
          navOpen={sidebarOpen} 
          toggleNav={() => setSidebarOpen(!sidebarOpen)} 
          userRole="governmentOfficial"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-5 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F38120] to-[#F3A620] text-center leading-relaxed py-2">
              Change Password
            </h1>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-2xl rounded-2xl p-6 max-w-3xl mx-auto flex-grow flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <InputField
                icon={FaEnvelope}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <InputField
                icon={FaLock}
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaLock}
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
              />
            </div>
            <motion.div
              className="mt-8 flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#F38120] to-[#F3A620] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
              >
                Change Password
              </button>
            </motion.div>
          </motion.form>
          {message && (
            <motion.div
              className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{message}</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{error}</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChangePasswordGovernmentOfficial;