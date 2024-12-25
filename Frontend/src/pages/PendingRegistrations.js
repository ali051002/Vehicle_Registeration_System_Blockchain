import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

// Vehicle List Item Component
const VehicleListItem = ({ vehicle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDocuments = () => {
    setShowDocuments(!showDocuments);
  };

  // Convert binary data to base64
  const getBase64Document = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    return `data:image/jpeg;base64,${btoa(String.fromCharCode(...byteArray))}`;
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
          <p className="text-[#373A40]">Owner: {vehicle.FromUserName}</p>
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
            <p className="text-[#373A40]">Engine Number: {vehicle.engineNumber}</p>
            <p className="text-[#373A40]">Chassis Number: {vehicle.chassisNumber}</p>
            <p className="text-[#373A40]">Transaction Status: {vehicle.transactionStatus}</p>
            <p className="text-[#373A40]">Inspection Status: {vehicle.inspectionStatus || 'Not Inspected'}</p>

            <div className="mt-4">
              <h4 className="font-semibold text-[#373A40]">
                Number of Documents Uploaded: {vehicle.documents.length}
              </h4>
              {vehicle.documents.length > 0 && (
                <motion.button
                  className="mt-2 text-[#F38120] underline cursor-pointer"
                  onClick={toggleDocuments}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showDocuments ? "Hide Documents" : "Show Documents"}
                </motion.button>
              )}
              {showDocuments && (
                <div className="mt-4 space-y-4">
                  {vehicle.documents.map((doc, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm text-[#373A40] font-semibold">Document {index + 1}:</p>
                      <img
                        src={getBase64Document(doc.data)}
                        alt={`Document ${index + 1}`}
                        className="rounded-lg shadow-md max-w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}
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
  const user = useContext(AuthContext);

  const storedToken = localStorage.getItem('token');
  const decoded = jwtDecode(storedToken);
  const loggedInUserId = decoded.id || decoded.userId;

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/transactions/pending');

        // Group vehicles by vehicleId and collect documents
        const groupedVehicles = response.data.reduce((acc, vehicle) => {
          const existingVehicle = acc.find(v => v.vehicleId === vehicle.vehicleId);

          if (existingVehicle) {
            // Add document to the existing vehicle
            if (vehicle.FileContent) {
              existingVehicle.documents.push(vehicle.FileContent);
            }
          } else {
            // Add new vehicle with its document
            acc.push({
              ...vehicle,
              documents: vehicle.FileContent ? [vehicle.FileContent] : [],
            });
          }

          return acc;
        }, []);

        setPendingRegistrations(groupedVehicles);
      } catch (error) {
        console.error('Error fetching pending vehicles:', error);
        Swal.fire('Error', 'Failed to fetch pending registrations', 'error');
      }
    };

    fetchPendingRegistrations();
  }, []);

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
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PendingRegistrations;
