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
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 bg-[#EEEEEE] min-h-screen">
        <h1 className="text-4xl font-bold text-black flex items-center space-x-4 ">
    <span>🏛</span>
    <span>GOVERNMENT DASHBOARD</span>
</h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[
              { title: 'Pending Registrations', description: 'View and approve pending vehicle registrations.', href: '/pending-registrations' },
              { title: 'Ownership Transfers', description: 'Manage vehicle ownership transfer approvals.', href: '/ownership-transfers' },
              { title: 'Vehicle Registry', description: 'View the total registered vehicles with details.', href: '/vehicle-registry' },
              { title: 'Audit Logs', description: 'View transaction history and audit logs.', href: '/audit-logs' },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-[#EEEEEE] rounded-lg shadow-lg transition-all duration-300">
                <h3 className="mb-2 text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="mb-4 text-gray-600">{item.description}</p>
                <button
                  onClick={() => navigate(item.href)} // Navigate to respective pages
                  className="px-4 py-2 text-white rounded-md bg-[#DC5F00] hover:bg-[#DC5F00] transition-all duration-300"
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
