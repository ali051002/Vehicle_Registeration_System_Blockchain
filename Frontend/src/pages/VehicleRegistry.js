import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

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

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEEEEE] relative">
      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={sidebarOpen} toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

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
