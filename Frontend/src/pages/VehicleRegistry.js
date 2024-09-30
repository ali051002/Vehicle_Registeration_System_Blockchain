import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

const VehicleRegistry = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]); // State to store registered and approved vehicles data
  const navigate = useNavigate();

  // Function to fetch registered and approved vehicles data
  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/vehicles/registered'); // Fetch vehicles with status "Approved" or "Registered"
      setVehicles(response.data); // Set the vehicles in state
    } catch (error) {
      console.error('Error fetching vehicles data:', error);
    }
  };

  // Fetch vehicle data when the component mounts
  useEffect(() => {
    fetchVehicles(); // Call the function to fetch registered and approved vehicles on component mount
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
          <p className="mt-4 text-gray-600">Below is the list of registered and approved vehicles:</p>

          {/* Display vehicle data */}
          {vehicles.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {vehicles.map((vehicle) => (
                <li key={vehicle._id} className="p-4 bg-white rounded-lg shadow">
                  <p><strong>Make:</strong> {vehicle.make}</p>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>License Plate:</strong> {vehicle.registrationNumber}</p>
                  <p><strong>Status:</strong> {vehicle.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-gray-500">No registered or approved vehicles available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistry;
