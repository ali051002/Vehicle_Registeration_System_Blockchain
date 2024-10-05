import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

const GovernmentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const userRole = 'governmentOfficial';  // Ensure correct role is passed

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/signin');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#DA0037',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
        }}
      />

      {/* Sidebar */}
      <SideNavBar
        logout={handleLogout}
        navOpen={sidebarOpen}
        toggleNav={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}  // Pass the userRole prop as governmentOfficial
      />

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

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
