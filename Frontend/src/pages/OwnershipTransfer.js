import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState(null);
  const [disableHover, setDisableHover] = useState(false);  // To disable hover animations on click
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const vehicles = [
    {
      id: 1,
      registrationNumber: 'XYZ123',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Red',
      status: 'Pending',
      chassisNumber: 'CH123456',
      engineNumber: 'EN123456',
      registrationDate: '2020-05-12',
      fromOwner: { id: 'owner1', name: 'John Doe', cnic: '12345-6789012-3' },
      toOwner: { id: 'owner2', name: 'Jane Smith', cnic: '98765-4321098-7' },
    },
    {
      id: 2,
      registrationNumber: 'ABC456',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Blue',
      status: 'Pending',
      chassisNumber: 'CH654321',
      engineNumber: 'EN654321',
      registrationDate: '2019-08-20',
      fromOwner: { id: 'owner2', name: 'Jane Smith', cnic: '98765-4321098-7' },
      toOwner: { id: 'owner1', name: 'John Doe', cnic: '12345-6789012-3' },
    },
  ];

  const handleViewDetails = (vehicleId) => {
    setExpandedTransfer(expandedTransfer === vehicleId ? null : vehicleId);
    setDisableHover(!disableHover);  // Disable hover animations
  };

  const handleAccept = (vehicleId) => {
    Swal.fire({
      title: 'Transfer Accepted',
      text: `You have successfully accepted the transfer for vehicle ID: ${vehicleId}.`,
      icon: 'success',
      confirmButtonText: 'OK',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });
  };

  const handleReject = (vehicleId) => {
    Swal.fire({
      title: 'Transfer Rejected',
      text: `You have rejected the transfer for vehicle ID: ${vehicleId}.`,
      icon: 'error',
      confirmButtonText: 'OK',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });
  };

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
          userRole="user"
        />

        {/* Main content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F38120] to-[#F3A620] text-center">
              Ownership Transfer Approvals
            </h1>
          </motion.div>

          {/* Transfer List */}
          <motion.ul
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {vehicles.map((vehicle) => (
              <motion.li 
                key={vehicle.id} 
                className="border border-gray-300 p-4 bg-white bg-opacity-30 rounded-lg"
                whileHover={disableHover ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>From:</strong> {vehicle.fromOwner.name}</p>
                    <p><strong>To:</strong> {vehicle.toOwner.name}</p>
                  </div>
                  <motion.button
                    className="bg-[#F38120] text-white px-4 py-2 rounded"
                    onClick={() => handleViewDetails(vehicle.id)}
                    whileHover={disableHover ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedTransfer === vehicle.id ? 'Hide Details' : 'View Details'}
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedTransfer === vehicle.id && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold">User Details:</h3>
                      <p><strong>From:</strong> {vehicle.fromOwner.name} (CNIC: {vehicle.fromOwner.cnic})</p>
                      <p><strong>To:</strong> {vehicle.toOwner.name} (CNIC: {vehicle.toOwner.cnic})</p>

                      <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                      <p><strong>Year:</strong> {vehicle.year}</p>
                      <p><strong>Color:</strong> {vehicle.color}</p>
                      <p><strong>Status:</strong> {vehicle.status}</p>
                      <p><strong>Registration Number:</strong> {vehicle.registrationNumber}</p>
                      <p><strong>Chassis Number:</strong> {vehicle.chassisNumber}</p>
                      <p><strong>Engine Number:</strong> {vehicle.engineNumber}</p>
                      <p><strong>Registration Date:</strong> {new Date(vehicle.registrationDate).toLocaleDateString()}</p>

                      {/* Accept and Reject Buttons */}
                      <div className="mt-4 flex space-x-4">
                        <motion.button
                          className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-all"
                          onClick={() => handleAccept(vehicle.id)}
                          whileHover={disableHover ? {} : { scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#C24A00] transition-all"
                          onClick={() => handleReject(vehicle.id)}
                          whileHover={disableHover ? {} : { scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ul>
        </main>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
