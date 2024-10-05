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
    <div className="flex h-screen overflow-hidden relative">
      {/* Background animation */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#EADFB4',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
        }}
      />

      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={navOpen} toggleNav={toggleNav} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={toggleNav} />

        {/* Content area */}
        <div className="p-6 min-h-screen">
          <h2 className="text-4xl font-bold text-[#373A40]">Audit Logs</h2>
          <p className="mt-4 text-[#373A40]">This space will show audit logs and related information.</p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
