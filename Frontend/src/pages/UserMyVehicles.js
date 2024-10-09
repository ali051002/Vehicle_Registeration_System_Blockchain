import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaCalendarAlt, FaBarcode, FaPalette, FaCogs, FaIdCard } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import axios from 'axios';

const VehicleCard = ({ vehicle }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(243, 129, 32, 0.3)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-[#4A4D52] mb-4">{vehicle.make} {vehicle.model}</h3>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Year</h4>
            <div className="flex items-center">
              <FaCalendarAlt className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{vehicle.manufactureYear}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Color</h4>
            <div className="flex items-center">
              <FaPalette className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{vehicle.color}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">License Plate</h4>
            <div className="flex items-center">
              <FaIdCard className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{vehicle.licensePlate}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Engine Number</h4>
            <div className="flex items-center">
              <FaCogs className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{vehicle.engineNumber}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Chassis Number</h4>
            <div className="flex items-center">
              <FaBarcode className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{vehicle.chassisNumber}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#F38120] mb-1">Registration Date</h4>
            <div className="flex items-center">
              <FaCar className="text-[#F38120] mr-2" />
              <span className="text-gray-600">{new Date(vehicle.registrationDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserMyVehicles = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`http://localhost:8085/api/vehicles/user/${user.id}`);
          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching user vehicles:', error);
        }
      }
    };

    fetchUserVehicles();
  }, [user]);

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
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          {/* Corrected Title Heading */}
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-4xl font-bold text-[#F38120] text-center">
                My Vehicles
              </h1>
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle._id || vehicle.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <VehicleCard vehicle={vehicle} />
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    className="text-[#373A40] text-center col-span-full text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    You do not own any vehicles.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserMyVehicles;
