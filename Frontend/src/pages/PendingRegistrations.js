/**
 * PendingRegistrations.js
 * Full code with "hide Send for Inspection button once clicked" functionality
 */

import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

// Components (Update these imports according to your actual file paths)
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

// Context & Utilities
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

// --------------------------------------------------------------------------
//                          INSPECTION MODAL COMPONENT
// --------------------------------------------------------------------------
const InspectionModal = ({
  isOpen,
  onClose,
  vehicleId,
  onInspectionSent, // <-- Callback to inform parent when inspection is sent
}) => {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  // --------------------------------------------------------------------------
  //   Fetch Officers whenever the modal is opened
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      fetchOfficers();
    }
  }, [isOpen]);

  const fetchOfficers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8085/api/fetch-all-inspection-officers'
      );
      if (response.data?.data) {
        setOfficers(response.data.data);
      } else {
        Swal.fire('Error', 'Invalid response from server', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch inspection officers', 'error');
    }
  };

  // --------------------------------------------------------------------------
  //   Handle Submit Inspection
  // --------------------------------------------------------------------------
  const handleSubmitInspection = async () => {
    // Basic validation
    if (!selectedOfficer || !appointmentDate) {
      Swal.fire(
        'Validation',
        'Please select an officer and appointment date',
        'warning'
      );
      return;
    }

    try {
      // Construct payload
      const payload = {
        VehicleId: vehicleId,
        OfficerId: selectedOfficer,
        AppointmentDate: appointmentDate,
      };

      // Send API request
      await axios.post('http://localhost:8085/api/send-inspection-request', payload);

      Swal.fire('Success', 'Inspection request sent!', 'success');

      // Notify parent that this vehicle has been inspected
      if (onInspectionSent) {
        onInspectionSent(vehicleId);
      }

      // Close modal
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to send inspection request';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  // --------------------------------------------------------------------------
  //   If modal is closed, don't render anything
  // --------------------------------------------------------------------------
  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  //   Return Modal JSX
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        {/* Close button (top-right X) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Book Inspection
        </h2>

        {/* Officer Select */}
        <label htmlFor="officerSelect" className="block mb-1 font-medium">
          Select Officer:
        </label>
        <select
          id="officerSelect"
          className="border p-2 w-full mb-4"
          value={selectedOfficer}
          onChange={(e) => setSelectedOfficer(e.target.value)}
        >
          <option value="">-- Choose an Officer --</option>
          {officers.map((officer) => (
            <option key={officer.UserId} value={officer.UserId}>
              {officer.Name} ({officer.Email})
            </option>
          ))}
        </select>

        {/* Appointment Date */}
        <label htmlFor="appointmentDate" className="block mb-1 font-medium">
          Appointment Date:
        </label>
        <input
          id="appointmentDate"
          type="date"
          className="border p-2 w-full mb-4"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitInspection}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
//                       VEHICLE LIST ITEM COMPONENT
// --------------------------------------------------------------------------
const VehicleListItem = ({
  vehicle,
  onBookInspection,
  inspectedVehicles = [],
}) => {
  // Local states
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expand/collapse details
  const toggleDetails = () => {
    setIsExpanded((prev) => !prev);
  };

  // Determine if this vehicle is already inspected (button should be hidden)
  const isInspected = inspectedVehicles.includes(vehicle.vehicleId);

  // --------------------------------------------------------------------------
  //   Render
  // --------------------------------------------------------------------------
  return (
    <motion.li
      className="border-b border-gray-200 p-4 hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        {/* Vehicle Basic Info */}
        <div>
          <h3 className="font-semibold text-[#373A40]">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-[#373A40]">Owner: {vehicle.FromUserName}</p>
        </div>

        {/* Expand/Collapse Button */}
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
            {/* Vehicle Details */}
            <p className="text-[#373A40]">Year: {vehicle.year}</p>
            <p className="text-[#373A40]">Color: {vehicle.color}</p>
            <p className="text-[#373A40]">Engine Number: {vehicle.engineNumber}</p>
            <p className="text-[#373A40]">Chassis Number: {vehicle.chassisNumber}</p>
            <p className="text-[#373A40]">
              Transaction Status: {vehicle.transactionStatus}
            </p>
            <p className="text-[#373A40]">
              Inspection Status: {vehicle.inspectionStatus || 'Not Inspected'}
            </p>

            {/* Conditional Button */}
            {isInspected ? (
              <span className="mt-2 inline-block text-green-600 font-semibold">
                Sent for Inspection
              </span>
            ) : (
              <button
                onClick={() => onBookInspection(vehicle.vehicleId)}
                className="mt-2 inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Send for Inspection
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

// --------------------------------------------------------------------------
//                    PENDING REGISTRATIONS COMPONENT
// --------------------------------------------------------------------------
const PendingRegistrations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [modalVehicleId, setModalVehicleId] = useState(null);

  // This state will track vehicle IDs that have been sent for inspection
  const [inspectedVehicles, setInspectedVehicles] = useState([]);

  // Access auth context if needed
  const auth = useContext(AuthContext);

  // Decode JWT if needed (if you actually use it in your logic)
  const storedToken = localStorage.getItem('token');
  let decoded = null;
  try {
    decoded = storedToken ? jwtDecode(storedToken) : null;
  } catch (err) {
    console.error('Error decoding JWT:', err);
  }
  const loggedInUserId = decoded?.id || decoded?.userId;

  // --------------------------------------------------------------------------
  //   Fetch pending registrations once on component mount
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8085/api/transactions/pending'
        );
        // If your API returns an array of vehicles directly:
        //   setPendingRegistrations(response.data);

        // If you need to group documents by VehicleId:
        // (Based on your original code that groups documents)
        const groupedVehicles = response.data.reduce((acc, vehicle) => {
          const existingVehicle = acc.find(
            (v) => v.vehicleId === vehicle.vehicleId
          );
          if (existingVehicle) {
            if (vehicle.FileContent) {
              existingVehicle.documents.push(vehicle.FileContent);
            }
          } else {
            acc.push({
              ...vehicle,
              documents: vehicle.FileContent ? [vehicle.FileContent] : [],
            });
          }
          return acc;
        }, []);

        setPendingRegistrations(groupedVehicles);
      } catch (error) {
        console.error('Error fetching pending registrations:', error);
        Swal.fire('Error', 'Failed to fetch pending registrations', 'error');
      }
    };

    fetchPendingRegistrations();
  }, []);

  // --------------------------------------------------------------------------
  //   Handler to open "Book Inspection" modal
  // --------------------------------------------------------------------------
  const handleBookInspection = (vehicleId) => {
    setModalVehicleId(vehicleId);
    setShowInspectionModal(true);
  };

  // --------------------------------------------------------------------------
  //   Handler to close "Book Inspection" modal
  // --------------------------------------------------------------------------
  const closeInspectionModal = () => {
    setModalVehicleId(null);
    setShowInspectionModal(false);
  };

  // --------------------------------------------------------------------------
  //   Handler to mark a vehicle as inspected once the request is sent
  // --------------------------------------------------------------------------
  const handleInspectionSent = (vehicleId) => {
    setInspectedVehicles((prev) => [...prev, vehicleId]);
  };

  // --------------------------------------------------------------------------
  //   Render
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navigation Bar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation Bar */}
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="governmentOfficial"
        />

        {/* Main Content */}
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
            {/* Check if there are pending registrations */}
            {pendingRegistrations.length === 0 ? (
              <motion.p
                className="text-center text-2xl font-semibold text-[#373A40] py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading...
              </motion.p>
            ) : (
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {pendingRegistrations.map((vehicle) => (
                    <VehicleListItem
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      onBookInspection={handleBookInspection}
                      inspectedVehicles={inspectedVehicles}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>
        </main>
      </div>

      {/* Inspection Modal */}
      <InspectionModal
        isOpen={showInspectionModal}
        onClose={closeInspectionModal}
        vehicleId={modalVehicleId}
        onInspectionSent={handleInspectionSent}
      />
    </div>
  );
};

export default PendingRegistrations;
