import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

const PendingRegistrationsDetails = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/signin');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 bg-[#DC5F00] dark:bg-[#373A40] text-white">
        <div className="flex items-center justify-between h-16 px-4">
          <h2 className="text-xl font-bold">Secure Chain</h2>
        </div>
        <nav className="mt-8 space-y-4">
          {[{ icon: FaHome, text: 'Home', href: '/home' },
            { icon: FaChartLine, text: 'Dashboard', href: '/dashboard-overview' },
            { icon: FaBell, text: 'Notifications', href: '/notifications' },
            { icon: FaCog, text: 'Settings', href: '/settings' },
          ].map((item, index) => (
            <a key={index} href={item.href} className="flex items-center px-4 py-2 text-sm">
              <item.icon className="w-5 h-5" />
              <span className="ml-4">{item.text}</span>
            </a>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center px-4 py-2 mt-auto w-full text-sm">
          <FaSignOutAlt className="w-5 h-5" />
          <span className="ml-4">Logout</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-[#EEEEEE] dark:bg-[#373A40] min-h-screen p-6">
        {/* Top Navbar */}
        <div className="flex justify-between bg-[#DC5F00] dark:bg-[#373A40] text-white p-4">
          <h2 className="text-xl font-bold">Pending Registrations Details</h2>
          <div className="flex items-center space-x-4">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold">Details of Pending Registrations</h3>
          <p className="mt-4">This page will show detailed information about the pending registrations.</p>
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationsDetails;
