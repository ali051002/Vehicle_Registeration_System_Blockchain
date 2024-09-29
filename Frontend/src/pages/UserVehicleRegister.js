import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

export default function UserVehicleRegister() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    chassisNumber: '',
    engineNumber: '',
  });
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all values are valid
    if (!formData.make || !formData.model || !formData.year || !formData.chassisNumber || !formData.engineNumber) {
      setError('Please fill all required fields');
      return;
    }

    // Prepare the registration data
    const vehicleData = {
      ownerId: user.id, // Assuming logged-in user's ID
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year), // Parse year as integer
      color: formData.color || null, // Set color to null if not provided
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber,
      status: 'Pending', // Automatically set status to pending
      blockchainTransactionId: null, // Set to null
      insuranceDetails: null, // Set to null
      inspectionReports: null, // Set to null
      registrationNumber: null, // Set to null
    };

    try {
      // Post the vehicle data to the API
      const response = await axios.post('http://localhost:8085/api/registerVehicle', vehicleData);

      if (response.status === 200) {
        // Display SweetAlert notification
        Swal.fire({
          title: 'Vehicle Registered!',
          text: 'Waiting for government approval.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        console.log('Vehicle registered:', response.data);
      }
    } catch (error) {
      // Handle error
      setError('There was an error registering the vehicle.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background animation */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#EADFB4',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
          //animation: isAnimating ? 'slide 1s ease-in-out forwards' : 'none',
        }}
      />
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={sidebarOpen} toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">Vehicle Registration</h1>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative mx-auto bg-[#EADFB4] bg-opacity-30 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[80%] lg:w-[60%] h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="make" className="block text-lg font-medium text-[#373A40]">Vehicle Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  required
                  value={formData.make}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-lg font-medium text-[#373A40]">Vehicle Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  required
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-lg font-medium text-[#373A40]">Year of Manufacture</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  required
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="color" className="block text-lg font-medium text-[#373A40]">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="chassisNumber" className="block text-lg font-medium text-[#373A40]">Chassis Number</label>
                <input
                  type="text"
                  id="chassisNumber"
                  name="chassisNumber"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  required
                  value={formData.chassisNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="engineNumber" className="block text-lg font-medium text-[#373A40]">Engine Number</label>
                <input
                  type="text"
                  id="engineNumber"
                  name="engineNumber"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]"
                  required
                  value={formData.engineNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#F38120] text-white rounded-md hover:bg-[#DC5F00] transition-all duration-300"
              >
                Register Vehicle
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </main>
      </div>
    </div>
  );
}
