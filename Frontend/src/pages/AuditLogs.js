import React, { useState } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const AuditLogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/government-official-dashboard'); // Redirect to Government Official Dashboard
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3e7d1]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-[#373A40] text-white`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {sidebarOpen && <div className="navbar-logo text-sm font-serif text-[#F38120]">Secure Chain</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-[#F38120]">
            <FaBars />
          </button>
        </div>
        <nav className="mt-8 space-y-4">
          {/* Home button with redirection to Government Official Dashboard */}
          <button
            onClick={handleHomeClick}
            className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20"
          >
            <FaHome className="w-5 h-5 text-[#F38120]" />
            {sidebarOpen && <span className="ml-4 text-[#F38120]">Home</span>}
          </button>
          {[
            { icon: FaChartLine, text: 'Dashboard', href: '/dashboard' },
            { icon: FaBell, text: 'Notifications', href: '/notifications' },
            { icon: FaCog, text: 'Settings', href: '/settings' },
          ].map((item, index) => (
            <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20">
              <item.icon className="w-5 h-5 text-[#F38120]" />
              {sidebarOpen && <span className="ml-4 text-[#F38120]">{item.text}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#f3e7d1] text-[#373A40]">
          <div className="navbar-logo text-lg font-serif">Secure Chain</div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-black cursor-pointer">Platform</span>
            <span className="hover:text-black cursor-pointer">About us</span>
            <span className="hover:text-black cursor-pointer">Contact</span>
            <button onClick={handleLogout} className="flex items-center text-sm text-[#373A40] hover:text-black">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 bg-gradient-to-r from-[#f3e7d1] via-[#f3e7d1] to-[#F38120] min-h-screen">
          <h2 className="text-4xl font-bold text-[#373A40]">Audit Logs</h2>
          <p className="mt-4 text-[#373A40]">This space will show audit logs and related information.</p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
