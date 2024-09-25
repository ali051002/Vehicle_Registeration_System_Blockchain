// /pages/OwnershipTransfer.js
import React, { useState } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEEEEE]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-[#DC5F00] text-white`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {sidebarOpen && <div className="navbar-logo text-sm font-serif">Secure Chain</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-[#DC5F00]">
            <FaBars />
          </button>
        </div>
        <nav className="mt-8 space-y-4">
          {[ 
            { icon: FaHome, text: 'Home', href: '/home' },
            { icon: FaChartLine, text: 'Dashboard', href: '/dashboard' },
            { icon: FaBell, text: 'Notifications', href: '/notifications' },
            { icon: FaCog, text: 'Settings', href: '/settings' },
          ].map((item, index) => (
            <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-[#DC5F00]">
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#DC5F00] text-white">
          <div className="navbar-logo text-sm font-serif">Secure Chain</div>
          <div className="flex items-center space-x-4">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
            <button onClick={handleLogout} className="text-sm hover:bg-[#DC5F00]">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Empty content area */}
        <div className="p-6 bg-[#EEEEEE] min-h-screen">
          {/* This space will be for future content */}
        </div>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
