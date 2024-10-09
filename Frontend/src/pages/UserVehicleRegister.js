import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar
import { jwtDecode } from 'jwt-decode';

export default function UserVehicleRegister() {
  const { user, logout } = useContext(AuthContext); // Get user from AuthContext
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

    // Log the user object to ensure it's available
    console.log('User:', user);

    console.log("User id: ", user.id)
    // Ensure user is logged in and user object exists
    if (!user || !user.id) {
      setError('You must be logged in to register a vehicle.');
      return;
    }

    // Validation to check if all required fields are provided
    if (!formData.make || !formData.model || !formData.year || !formData.chassisNumber || !formData.engineNumber) {
      setError('All fields must be filled out.');
      return;
    }

    const storedToken = localStorage.getItem('token')
    const decoded = jwtDecode(storedToken);
    const loggedInUserId = decoded.userId;

    console.log("User id :", loggedInUserId)

    // Prepare the registration data, including ownerId from logged-in user
    const vehicleData = {
      ownerId: loggedInUserId, // Automatically include the logged-in user's ID
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year), // Ensure year is an integer
      color: formData.color || null, // Optional color field
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber
    };

    console.log('Vehicle Data being sent:', vehicleData);

    try {
      // Get the token from localStorage or AuthContext
      const token = localStorage.getItem('token');

      // Post formData to the API with Authorization header
      const response = await axios.post('http://localhost:8085/api/registerVehicleRequest', vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Display SweetAlert notification
        Swal.fire({
          title: 'Vehicle Registered!',
          text: 'Waiting for government approval.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        console.log('Vehicle registered:', response.data);

        // Reset form data after submission
        setFormData({
          make: '',
          model: '',
          year: '',
          color: '',
          chassisNumber: '',
          engineNumber: '',
        });
      }
    } catch (error) {
      // Handle error and log the response for debugging
      console.error('Error response from server:', error.response ? error.response.data : error.message);
      setError('There was an error registering the vehicle. Please make sure all fields are filled.');
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
