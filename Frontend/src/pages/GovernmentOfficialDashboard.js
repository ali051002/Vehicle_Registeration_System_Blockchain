import React, { useState } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const GovernmentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-[#EADFB4] to-[#F38120]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4">
            {sidebarOpen && <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 text-[#373A40]">
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
              <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">{item.text}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-4 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]"
          >
            <FaSignOutAlt className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4">
          <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>
          <div className="flex items-center space-x-4 text-[#373A40]">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] flex items-center justify-center mb-6">
            <span>🏛 GOVERNMENT DASHBOARD</span>
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[
              { title: 'Pending Registrations', description: 'View and approve pending vehicle registrations.', href: '/pending-registrations' },
              { title: 'Ownership Transfers', description: 'Manage vehicle ownership transfer approvals.', href: '/ownership-transfers' },
              { title: 'Vehicle Registry', description: 'View the total registered vehicles with details.', href: '/vehicle-registry' },
              { title: 'Audit Logs', description: 'View transaction history and audit logs.', href: '/audit-logs' },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white bg-opacity-50 rounded-lg shadow-lg transition-all duration-300">
                <h3 className="mb-2 text-lg font-bold text-[#373A40]">{item.title}</h3>
                <p className="mb-4 text-[#373A40]">{item.description}</p>
                <button
                  onClick={() => navigate(item.href)}
                  className="px-4 py-2 text-white rounded-md bg-[#F38120] hover:bg-[#DC5F00] transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;