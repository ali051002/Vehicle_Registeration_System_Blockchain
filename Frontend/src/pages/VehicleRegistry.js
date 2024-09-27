import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

const VehicleRegistry = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]); // State to store vehicles data
  const navigate = useNavigate();

  // Function to fetch vehicles data
  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/vehicles');
      setVehicles(response.data); // Assuming the API returns an array of vehicle objects
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  // Fetch vehicle data when the component mounts
  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleLogout = () => {
    navigate('/signin');
  };

  // Function to handle Home click
  const handleHomeClick = () => {
    navigate('/government-official-dashboard'); // Redirect to government-official-dashboard
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEEEEE]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-[#DC5F00] text-white`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {sidebarOpen && <div className="navbar-logo text-sm font-serif">Secure Chain</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-[#DC5F00]">
            <FaBars />
          </button>
        </div>
        <nav className="mt-8 space-y-4">
          {[
            { icon: FaHome, text: 'Home', onClick: handleHomeClick },
            { icon: FaChartLine, text: 'Dashboard', href: '/dashboard' },
            { icon: FaBell, text: 'Notifications', href: '/notifications' },
            { icon: FaCog, text: 'Settings', href: '/settings' },
          ].map((item, index) => (
            <div
              key={index}
              onClick={item.onClick} // Use onClick handler for Home
              className="flex items-center px-4 py-2 text-sm hover:bg-[#DC5F00] cursor-pointer"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">{item.text}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#DC5F00] text-white">
          <div className="navbar-logo text-sm font-serif">Secure Chain</div>
          <div className="flex items-center space-x-4">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
            <button onClick={handleLogout} className="text-sm hover:bg-[#DC5F00]">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Vehicle Data Content */}
        <div className="p-6 bg-[#EEEEEE] min-h-screen">
          <h2 className="text-4xl font-bold">Vehicle Registry</h2>
          <p className="mt-4 text-gray-600">Below is the list of registered vehicles:</p>

          {/* Display vehicle data */}
          {vehicles.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {vehicles.map((vehicle) => (
                <li key={vehicle.id} className="p-4 bg-white rounded-lg shadow">
                  <p><strong>Make:</strong> {vehicle.make}</p>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-gray-500">No vehicles available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistry;
