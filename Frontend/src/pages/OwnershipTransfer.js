import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios'; // Import axios for API call
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState(null);
  const [disableHover, setDisableHover] = useState(false);  // To disable hover animations on click
  const [vehicles, setVehicles] = useState([]);  // State for vehicles fetched from API
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState('');  // Error state
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  // Fetch pending ownership transfers from the API
  useEffect(() => {
    const fetchPendingTransfers = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/transactions/pendingtransfers');
        setVehicles(response.data);  // Update state with the fetched vehicles
        setLoading(false);  // Stop loading when data is fetched
      } catch (err) {
        console.error('Error fetching pending transfers:', err);
        setError('Failed to load pending transfers.');
        setLoading(false);
      }
    };

    fetchPendingTransfers();
  }, []);

  // Approve Transfer API call
  const handleAccept = async (transactionId) => {
    try {
      // Send transactionId as an object
      const response = await axios.post('http://localhost:8085/api/approveTransfer', 
        { transactionId }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      Swal.fire({
        title: 'Transfer Accepted',
        text: response.data.msg,
        icon: 'success',
        confirmButtonText: 'OK',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });

      // Optionally, update the UI to remove the approved vehicle from the list
      setVehicles(vehicles.filter(vehicle => vehicle.TransactionId !== transactionId));
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.msg || 'Failed to approve the transfer.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Reject Transfer API call
  const handleReject = async (transactionId) => {
    try {
      // Send transactionId as an object to the reject route
      const response = await axios.post('http://localhost:8085/api/rejectTransfer', 
        { transactionId }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      Swal.fire({
        title: 'Transfer Rejected',
        text: response.data.msg,
        icon: 'success',
        confirmButtonText: 'OK',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });

      // Optionally, update the UI to remove the rejected vehicle from the list
      setVehicles(vehicles.filter(vehicle => vehicle.TransactionId !== transactionId));
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.msg || 'Failed to reject the transfer.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleViewDetails = (vehicleId) => {
    setExpandedTransfer(expandedTransfer === vehicleId ? null : vehicleId);
    setDisableHover(!disableHover);  // Disable hover animations
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

          {/* Display Loading, Error, or Vehicle List */}
          {loading ? (
            <p>Loading pending transfers...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <motion.ul
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {vehicles.map((vehicle) => (
                <motion.li 
                  key={vehicle.TransactionId} 
                  className="border border-gray-300 p-4 bg-white bg-opacity-30 rounded-lg"
                  whileHover={disableHover ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>From:</strong> {vehicle.FromUserName}</p>
                      <p><strong>To:</strong> {vehicle.ToUserName || 'Not Assigned'}</p>
                    </div>
                    <motion.button
                      className="bg-[#F38120] text-white px-4 py-2 rounded"
                      onClick={() => handleViewDetails(vehicle.TransactionId)}
                      whileHover={disableHover ? {} : { scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {expandedTransfer === vehicle.TransactionId ? 'Hide Details' : 'View Details'}
                    </motion.button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedTransfer === vehicle.TransactionId && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold">User Details:</h3>
                        <p><strong>From:</strong> {vehicle.FromUserName}</p>
                        <p><strong>To:</strong> {vehicle.ToUserName || 'Pending'}</p>

                        <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                        <p><strong>Year:</strong> {vehicle.year}</p>
                        <p><strong>Color:</strong> {vehicle.color}</p>
                        <p><strong>Status:</strong> {vehicle.transactionStatus}</p>
                        <p><strong>Registration Number:</strong> {vehicle.registrationNumber}</p>
                        <p><strong>Chassis Number:</strong> {vehicle.chassisNumber}</p>
                        <p><strong>Engine Number:</strong> {vehicle.engineNumber}</p>
                        <p><strong>Registration Date:</strong> {new Date(vehicle.registrationDate).toLocaleDateString()}</p>

                        {/* Accept and Reject Buttons */}
                        <div className="mt-4 flex space-x-4">
                          <motion.button
                            className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-all"
                            onClick={() => handleAccept(vehicle.TransactionId)}
                            whileHover={disableHover ? {} : { scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#C24A00] transition-all"
                            onClick={() => handleReject(vehicle.TransactionId)}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
