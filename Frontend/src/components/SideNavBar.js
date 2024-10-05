import React from 'react';
import { FaBars, FaHome, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function SideNavBar({ logout, navOpen, toggleNav, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Determine the dashboard link based on the user role
  const getDashboardLink = () => {
    if (userRole === 'governmentOfficial') {
      return '/government-official-dashboard';  // Route for government officials
    }
    return '/user-dashboard';  // Route for regular users
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out 
      ${navOpen ? 'w-64' : 'w-16'} flex flex-col justify-between bg-[#EADFB4] bg-opacity-80`}
    >
      {/* Top Section with Hamburger Button */}
      <div>
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={toggleNav} className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 text-[#373A40]">
            <FaBars />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-4">
          {/* Dashboard Link */}
          <Link to={getDashboardLink()} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
            <FaHome className="w-5 h-5" />
            {navOpen && <span className="ml-4">Dashboard</span>}
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
            <FaBell className="w-5 h-5" />
            {navOpen && <span className="ml-4">Notifications</span>}
          </Link>

          {/* Settings */}
          <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
            <FaCog className="w-5 h-5" />
            {navOpen && <span className="ml-4">Settings</span>}
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 hover:bg-white hover:bg-opacity-20 text-[#373A40]"
        >
          <FaSignOutAlt className="w-5 h-5" />
          {navOpen && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
}
