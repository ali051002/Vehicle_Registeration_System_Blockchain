import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaUser, FaClock, FaFileAlt } from 'react-icons/fa';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

const AuditLogCard = ({ log }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(243, 129, 32, 0.3)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-[#4A4D52] mb-4">{log.action}</h3>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">User</h4>
            <div className="flex items-center">
              <FaUser className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{log.user}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Timestamp</h4>
            <div className="flex items-center">
              <FaClock className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{log.timestamp}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Details</h4>
            <div className="flex items-center">
              <FaFileAlt className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{log.details}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AuditLogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  // Mock audit log data
  const auditLogs = [
    { id: 1, action: 'User Login', user: 'John Doe', timestamp: '2023-06-01 10:30:00', details: 'Successful login' },
    { id: 2, action: 'Vehicle Registration', user: 'Jane Smith', timestamp: '2023-06-01 11:45:00', details: 'New vehicle added' },
    { id: 3, action: 'Document Update', user: 'Mike Johnson', timestamp: '2023-06-01 14:15:00', details: 'License renewal' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navigation Bar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation Bar */}
        <SideNavBar
          logout={handleLogout}
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="government"
        />

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-4xl font-bold text-[#F38120] text-center">
                Audit Logs
              </h1>
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {auditLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AuditLogCard log={log} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;