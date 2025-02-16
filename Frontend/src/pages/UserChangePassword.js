<<<<<<< HEAD
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserChangePassword = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

=======
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import SideNavBar from "../components/SideNavBar";
import TopNavBar from "../components/TopNavBar";
import { FaLock } from "react-icons/fa";

// InputField component for rendering input fields with icons
const InputField = ({ icon: Icon, label, name, type, value, onChange, required, placeholder }) => {
  return (
    <motion.div
      className="mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <motion.div
        className="relative rounded-lg shadow-lg overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="text-[#F38120] w-4 h-4" />}
        </div>
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          className="block w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-[#F38120] focus:border-[#F38120] transition-all duration-300 bg-[#EEEEEE] bg-opacity-50 backdrop-blur-none"
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
        />
      </motion.div>
    </motion.div>
  );
};

// UserChangePassword component to handle password change
const UserChangePassword = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form data changes
>>>>>>> 524592f9b4729a2fab1a261730611141f0d9f5a2
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
=======
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
>>>>>>> 524592f9b4729a2fab1a261730611141f0d9f5a2
      return;
    }

    try {
      const response = await axios.put(
<<<<<<< HEAD
        'http://localhost:8085/api/update-password',
        {
          email: 'user@example.com', // Replace with the user's email
=======
        "http://localhost:8085/api/update-password",
        {
          email: "user@example.com", // Replace with the user's email
>>>>>>> 524592f9b4729a2fab1a261730611141f0d9f5a2
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

<<<<<<< HEAD
      setMessage(response.data.msg);
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Change Password
          </button>
        </form>
=======
      Swal.fire({
        title: "Success!",
        text: response.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      });
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update password.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar
          logout={handleLogout}
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="user"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-5 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F38120] to-[#F3A620] text-center">
              Change Password
            </h1>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto flex-grow flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
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
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
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
          <AnimatePresence>
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
          </AnimatePresence>
        </main>
>>>>>>> 524592f9b4729a2fab1a261730611141f0d9f5a2
      </div>
    </div>
  );
};

export default UserChangePassword;
