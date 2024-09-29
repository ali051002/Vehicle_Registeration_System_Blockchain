import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

const AuditLogs = () => {
  const [navOpen, setNavOpen] = useState(false);  // Manage the sidebar state
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);  // Toggle sidebar open/close
  };

  return (
    <div className="flex h-screen bg-[#f3e7d1]">
      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={navOpen} toggleNav={toggleNav} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={toggleNav} />

        {/* Content area */}
        <div className="p-6 bg-gradient-to-r from-[#EADFB4] to-[#F38120] min-h-screen">
          <h2 className="text-4xl font-bold text-[#373A40]">Audit Logs</h2>
          <p className="mt-4 text-[#373A40]">This space will show audit logs and related information.</p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
