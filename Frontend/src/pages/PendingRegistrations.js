import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API calls
import Swal from 'sweetalert2'; // Import SweetAlert
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

const PendingRegistrationsDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  // Fetch pending registrations
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/vehicles/pending'); // Adjust endpoint if necessary
        setPendingRegistrations(response.data); // Assume that response.data contains the pending vehicles
      } catch (error) {
        console.error('Error fetching pending vehicles:', error);
      }
    };

    fetchPendingRegistrations();

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Approve a vehicle registration
  const handleApprove = async (vehicleId) => {
    try {
      const response = await axios.post('http://localhost:8085/api/vehicles/approve', {
        vehicleId,
        status: 'Approved', // Send the status as "Approved"
      });

      if (response.status === 200) {
        Swal.fire('Success', 'Vehicle registration approved!', 'success');
        // Remove approved vehicle from the list
        setPendingRegistrations(pendingRegistrations.filter(vehicle => vehicle._id !== vehicleId));
      }
    } catch (error) {
      console.error('Error approving vehicle registration:', error);
      Swal.fire('Error', 'Failed to approve vehicle registration', 'error');
    }
  };

  // Reject a vehicle registration
  const handleReject = async (vehicleId) => {
    try {
      const response = await axios.post('http://localhost:8085/api/vehicles/reject', {
        vehicleId,
        status: 'Rejected', // Send the status as "Rejected"
      });

      if (response.status === 200) {
        Swal.fire('Rejected', 'Vehicle registration rejected.', 'info');
        // Remove rejected vehicle from the list
        setPendingRegistrations(pendingRegistrations.filter(vehicle => vehicle._id !== vehicleId));
      }
    } catch (error) {
      console.error('Error rejecting vehicle registration:', error);
      Swal.fire('Error', 'Failed to reject vehicle registration', 'error');
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
            transform: translateX(0); /* Ends with no translation */
          }
        }
      `}</style>

      {/* Sidebar */}
      <SideNavBar logout={handleLogout} navOpen={sidebarOpen} toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

        {/* Pending Registrations Section */}
        <div className="p-6 min-h-screen">
          <h2 className="text-4xl font-bold text-center text-[#373A40] mb-6 flex items-center justify-center">
            Pending Registrations Details
          </h2>

          <ul className="bg-white bg-opacity-50 shadow-md rounded-lg divide-y divide-gray-200 mt-6">
            {pendingRegistrations.map((vehicleData) => (
              <VehicleListItem
                key={vehicleData._id}
                vehicle={vehicleData}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationsDetails;
