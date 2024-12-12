import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

// Vehicle List Item Component
const VehicleListItem = ({ vehicle, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.li
      className="border-b border-gray-200 p-4 hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-[#373A40]">{vehicle.make} {vehicle.model}</h3>
          <p className="text-[#373A40]">Owner ID: {vehicle.ownerId}</p>
        </div>
        <motion.button
          onClick={toggleDetails}
          className="text-[#373A40] hover:text-gray-900"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[#373A40]">Year: {vehicle.year}</p>
            <p className="text-[#373A40]">Color: {vehicle.color}</p>
            <p className="text-[#373A40]">Status: {vehicle.status}</p>
            <p className="text-[#373A40]">Registration Number: {vehicle.registrationNumber}</p>
            <p className="text-[#373A40]">Chassis Number: {vehicle.chassisNumber}</p>
            <p className="text-[#373A40]">Engine Number: {vehicle.engineNumber}</p>
            <p className="text-[#373A40]">Registration Date: {new Date(vehicle.registrationDate).toLocaleDateString()}</p>

            <div className="mt-4 flex space-x-4">
              <motion.button
                className="bg-gradient-to-r from-[#F38120] to-[#F3A620] text-white px-4 py-2 rounded shadow-lg"
                onClick={() => onApprove(vehicle)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(243, 129, 32, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Approve
              </motion.button>
              <motion.button
                className="bg-gradient-to-r from-[#F38120] to-[#F3A620] text-white px-4 py-2 rounded shadow-lg"
                onClick={() => onReject(vehicle.TransactionId, vehicle.FromUserId, `${vehicle.make} ${vehicle.model}`)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(243, 129, 32, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const PendingRegistrations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [registrationId, setRegistrationId] = useState('');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/transactions/pending');
        setPendingRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching pending vehicles:', error);
        Swal.fire('Error', 'Failed to fetch pending registrations', 'error');
      }
    };

    fetchPendingRegistrations();
  }, []);

  const storedToken = localStorage.getItem('token');
  const decoded = jwtDecode(storedToken);
  const loggedInUserId = decoded.id || decoded.userId;

  const handleApprove = async (vehicle) => {
    const { value: registrationNumber } = await Swal.fire({
      title: 'Enter Registration Number',
      input: 'text',
      inputLabel: 'Registration Number',
      inputPlaceholder: 'Enter the vehicle registration number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a registration number!';
        }
      }
    });

    if (registrationNumber && user) {
      try {
        const response = await axios.post(
          'http://localhost:8085/api/approveRegistration',
          {
            transactionId: vehicle.TransactionId,
            approvedBy: loggedInUserId,
            registrationNumber: registrationNumber
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          Swal.fire('Success', 'Vehicle registration approved!', 'success');

          // Fetch user details from /api/user/:id using FromUserId
          const userResponse = await axios.get(`http://localhost:8085/api/user/${vehicle.FromUserId}`);
          const userData = userResponse.data; // Should contain { name: '...', email: '...' }

          // Send approval email
          await axios.post('http://localhost:8085/api/send-email', {
            to: userData.email,
            subject: 'Registration Approved',
            data: {
              user: userData.name,
              action: 'registration',
              vehicle: `${vehicle.make} ${vehicle.model}`,
              status: 'approved'
            }
          });

          setPendingRegistrations(pendingRegistrations.filter(v => v.TransactionId !== vehicle.TransactionId));
        }
      } catch (error) {
        console.error('Error approving vehicle registration:', error.response?.data || error.message);
        Swal.fire('Error', error.response?.data?.msg || 'Failed to approve vehicle registration', 'error');
      }
    }
  };

  const handleReject = async (transactionId, fromUserId, vehicleName) => {
    try {
      const response = await axios.post('http://localhost:8085/api/vehicles/reject', {
        transactionId,
        status: 'Rejected',
      });

      if (response.status === 200) {
        Swal.fire('Info', 'Vehicle registration request rejected.', 'info');

        // Fetch user details from /api/user/:id using fromUserId
        const userResponse = await axios.get(`http://localhost:8085/api/user/${fromUserId}`);
        const userData = userResponse.data; // Should contain { name: '...', email: '...' }
        
        // Send rejection email
        await axios.post('http://localhost:8085/api/send-email', {
          to: userData.email,
          subject: 'Registration Rejected',
          data: {
            user: userData.name,
            action: 'registration',
            vehicle: vehicleName,
            status: 'rejected'
          }
        });

        setPendingRegistrations(pendingRegistrations.filter(vehicle => vehicle.TransactionId !== transactionId));
      }
    } catch (error) {
      console.error('Error rejecting vehicle registration:', error.response?.data || error.message);
      Swal.fire('Error', error.response?.data?.msg || 'Failed to reject vehicle registration', 'error');
    }
  };

  const confirmApproval = async () => {
    try {
      const response = await axios.post('http://localhost:8085/api/vehicles/approve', {
        vehicleId: selectedVehicleId,
        registrationId: registrationId,
        status: 'Approved',
      });

      if (response.status === 200) {
        Swal.fire('Success', 'Vehicle registration approved!', 'success');
        setPendingRegistrations(pendingRegistrations.filter(vehicle => vehicle._id !== selectedVehicleId));
        setApprovalModalOpen(false);
        setRegistrationId('');
      }
    } catch (error) {
      console.error('Error approving vehicle registration:', error.response?.data || error.message);
      Swal.fire('Error', error.response?.data?.msg || 'Failed to approve vehicle registration', 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="governmentOfficial"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          <motion.h1
            className="text-4xl font-bold text-[#F38120] mb-10 pt-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pending Registrations
          </motion.h1>

          <motion.div
            className="bg-white bg-opacity-50 shadow-lg rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pendingRegistrations.length === 0 ? (
              <motion.p
                className="text-center text-2xl font-semibold text-[#373A40] py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No pending registrations available
              </motion.p>
            ) : (
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {pendingRegistrations.map((vehicle) => (
                    <VehicleListItem
                      key={vehicle.TransactionId}
                      vehicle={vehicle}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {approvalModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="p-6 bg-gradient-to-r from-[#F38120] to-[#F3A620]">
                <h2 className="text-2xl font-bold">Enter Registration ID</h2>
              </div>
              <div className="p-6 space-y-4">
                <motion.input
                  type="text"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Registration ID"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                />
                <div className="flex justify-end space-x-2">
                  <motion.button
                    className="px-4 py-2 bg-gray-700 rounded text-white"
                    onClick={() => setApprovalModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-gradient-to-r from-[#F38120] to-[#F3A620] rounded text-white"
                    onClick={confirmApproval}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(243, 129, 32, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirm
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingRegistrations;
