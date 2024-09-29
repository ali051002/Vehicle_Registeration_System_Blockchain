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

  const fetchPendingRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/vehicle/pending-registrations');
      setPendingRegistrations(response.data);
    } catch (err) {
      console.error('Error fetching pending registrations:', err);
    }
  };

  useEffect(() => {
    fetchPendingRegistrations();

    // Stop the animation after 3 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const VehicleListItem = ({ vehicle, owner, fetchPendingRegistrations }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => {
      setIsExpanded(!isExpanded);
    };

    const handleApprove = async () => {
      try {
        const response = await axios.post('http://localhost:8085/api/vehicle/approve-registration', {
          transactionId: vehicle._id
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Approved!',
            text: 'The vehicle registration has been approved.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          fetchPendingRegistrations(); // Refresh the list
        }
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to approve registration.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    };

    const handleReject = async () => {
      try {
        const response = await axios.post('http://localhost:8085/api/vehicle/reject-registration', {
          transactionId: vehicle._id
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Rejected!',
            text: 'The vehicle registration has been rejected.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
          fetchPendingRegistrations(); // Refresh the list
        }
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to reject registration.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    };

    return (
      <li className="border-b border-gray-200 p-4 hover:bg-white hover:bg-opacity-20 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-[#373A40]">{vehicle.make} {vehicle.model}</h3>
            <p className="text-[#373A40]">Owner: {owner.name}</p>
          </div>
          <button onClick={toggleDetails} className="text-[#373A40] hover:text-gray-900">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4">
            <p className="text-[#373A40]">Year: {vehicle.year}</p>
            <p className="text-[#373A40]">Ethereum Address: {owner.ethereumAddress}</p>
            <p className="text-[#373A40]">Status: {vehicle.status}</p>
            <p className="text-[#373A40]">Registration Number: {vehicle.registrationNumber}</p>
            <p className="text-[#373A40]">Chassis Number: {vehicle.chassisNumber}</p>
            <p className="text-[#373A40]">Engine Number: {vehicle.engineNumber}</p>
            <p className="text-[#373A40]">Registration Date: {vehicle.registrationDate}</p>

            <div className="mt-4 flex space-x-4">
              <button
                className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </li>
    );
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

        {/* Pending Registrations Section */}
        <div className="p-6 min-h-screen">
          <h2 className="text-4xl font-bold text-center text-[#373A40] mb-6 flex items-center justify-center">
            Pending Registrations Details
          </h2>

          <ul className="bg-white bg-opacity-50 shadow-md rounded-lg divide-y divide-gray-200 mt-6">
            {pendingRegistrations.map((vehicleData) => (
              <VehicleListItem
                key={vehicleData.vehicle._id}
                vehicle={vehicleData.vehicle}
                owner={vehicleData.owner}
                fetchPendingRegistrations={fetchPendingRegistrations}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationsDetails;
