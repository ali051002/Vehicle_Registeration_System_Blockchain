import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const SideNavBar = ({ logout, navOpen, toggleNav, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getDashboardLink = () => {
    return userRole === 'governmentOfficial' ? '/government-official-dashboard' : '/user-dashboard';
  };

  const sidebarVariants = {
    open: { width: '16rem', transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '4rem', transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 } },
  };

  const linkVariants = {
    open: { opacity: 1, x: 0, display: 'block', transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -20, display: 'none', transition: { duration: 0.2 } },
  };

  const iconVariants = {
    open: { rotate: 0 },
    closed: { rotate: 360 },
  };

  return (
    <motion.div
      className="bg-gradient-to-b from-[#4A4D52] to-[#3A3D42] shadow-lg flex flex-col justify-between"
      initial="closed"
      animate={navOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <nav className="mt-8 space-y-4">
        <motion.div
          className="flex items-center px-4 py-2 text-white hover:bg-[#F38120] transition-colors duration-200 rounded-l-full"
          whileHover={{ x: 5 }}
        >
          <Link to={getDashboardLink()} className="flex items-center w-full">
            <motion.div variants={iconVariants}>
              <FaHome className="w-5 h-5" />
            </motion.div>
            <motion.span className="ml-4" variants={linkVariants}>
              Dashboard
            </motion.span>
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center px-4 py-2 text-white hover:bg-[#F38120] transition-colors duration-200 rounded-l-full"
          whileHover={{ x: 5 }}
        >
          <Link to="/notifications" className="flex items-center w-full">
            <motion.div variants={iconVariants}>
              <FaBell className="w-5 h-5" />
            </motion.div>
            <motion.span className="ml-4" variants={linkVariants}>
              Notifications
            </motion.span>
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center px-4 py-2 text-white hover:bg-[#F38120] transition-colors duration-200 rounded-l-full"
          whileHover={{ x: 5 }}
        >
          <Link to="/settings" className="flex items-center w-full">
            <motion.div variants={iconVariants}>
              <FaCog className="w-5 h-5" />
            </motion.div>
            <motion.span className="ml-4" variants={linkVariants}>
              Settings
            </motion.span>
          </Link>
        </motion.div>
      </nav>
      <div className="mb-8">
        <motion.button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-white hover:bg-[#F38120] transition-colors duration-200 rounded-l-full"
          whileHover={{ x: 5 }}
        >
          <motion.div variants={iconVariants}>
            <FaSignOutAlt className="w-5 h-5" />
          </motion.div>
          <motion.span className="ml-4" variants={linkVariants}>
            Logout
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SideNavBar;