// src/components/SideNavBar.js
import React from 'react';
import { FaBars, FaHome, FaCarAlt, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function SideNavBar({ logout, navOpen, toggleNav }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
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
        <nav className="mt-8 space-y-4">
          {[
            { icon: FaHome, text: 'Home', href: '/' },
            { icon: FaCarAlt, text: 'My Vehicles', href: '/vehicles' },
            { icon: FaBell, text: 'Notifications', href: '/notifications' },
            { icon: FaCog, text: 'Settings', href: '/settings' },
          ].map((item, index) => (
            <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
              <item.icon className="w-5 h-5" />
              {navOpen && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button - Always Visible */}
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
