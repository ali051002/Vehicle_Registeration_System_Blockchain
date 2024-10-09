import React, { useState, useEffect, useContext } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // For notifications
import SideNavBar from '../components/SideNavBar'; // Importing SideNavBar component
import TopNavBar from '../components/TopNavBar';   // Importing TopNavBar component
import { AuthContext } from '../context/AuthContext';  // Importing AuthContext for approvedBy
import { jwtDecode } from "jwt-decode"; 

// Vehicle List Item Component
const VehicleListItem = ({ vehicle, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle vehicle details display
  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="border-b border-gray-200 p-4 hover:bg-white hover:bg-opacity-20 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-[#373A40]">{vehicle.make} {vehicle.model}</h3>
          <p>Transaction ID: {vehicle.TransactionId}</p>
          <p className="text-[#373A40]">Owner ID: {vehicle.ownerId}</p>
        </div>
        <button onClick={toggleDetails} className="text-[#373A40] hover:text-gray-900">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <p className="text-[#373A40]">Year: {vehicle.year}</p>
          <p className="text-[#373A40]">Color: {vehicle.color}</p>
          <p className="text-[#373A40]">Status: {vehicle.status}</p>
          <p className="text-[#373A40]">Chassis Number: {vehicle.chassisNumber}</p>
          <p className="text-[#373A40]">Engine Number: {vehicle.engineNumber}</p>
          <p className="text-[#373A40]">Registration Date: {new Date(vehicle.registrationDate).toLocaleDateString()}</p>

          <div className="mt-4 flex space-x-4">
            <button
              className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300"
              onClick={() => onApprove(vehicle)}
            >
              Approve
            </button>
            <button
              className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300"
              onClick={() => onReject(vehicle._id)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

// Pending Registrations Component
const PendingRegistrationsDetails = () => {
  const { user } = useContext(AuthContext);  // Fetch user data from AuthContext (approvedBy)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    navigate('/signin');
  };

  // Fetch pending transactions (registrations) from the backend
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/transactions/pending');
        setPendingRegistrations(response.data); // Set the pending registrations
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


  const storedToken = localStorage.getItem('token')
  const decoded = jwtDecode(storedToken);
  const loggedInUserId = decoded.userId;

  console.log("User id :", loggedInUserId)  
  // Function to fetch registered and approved vehicles  
  // Approve a vehicle registration
  const handleApprove = async (vehicle) => {
    const { value: registrationNumber } = await Swal.fire({
      title: 'Enter Registration Number',
      input: 'text',
      inputLabel: 'Registration Number',
      inputPlaceholder: 'Enter the vehicle registration number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a registration number!';
        }
      }
    });

    if (registrationNumber && user) {
      try {
        const response = await axios.post(
          'http://localhost:8085/api/approveRegistration',
          {
            transactionId: vehicle.TransactionId,  // Send transaction ID from the backend for this vehicle
            approvedBy: loggedInUserId,                   // Use the logged-in government user ID (from AuthContext)
            registrationNumber: registrationNumber // The registration number entered by the user
          },
          {
            headers: {
              'Content-Type': 'application/json',  // Set the headers explicitly
            },
          }
        );

        if (response.status === 200) {
          Swal.fire('Success', 'Vehicle registration approved!', 'success');
          setPendingRegistrations(pendingRegistrations.filter(v => v.transactionId !== vehicle.transactionId));
        }
      } catch (error) {
        console.error('Error approving vehicle registration:', error);
        Swal.fire('Error', 'Failed to approve vehicle registration', 'error');
      }
    }
  };

  // Reject a vehicle registration
  const handleReject = async (vehicleId) => {
    try {
      const response = await axios.post('http://localhost:8085/api/vehicles/reject', {
        vehicleId,
        status: 'Rejected',
      });

      if (response.status === 200) {
        Swal.fire('Rejected', 'Vehicle registration rejected.', 'info');
        setPendingRegistrations(pendingRegistrations.filter(vehicle => vehicle.transactionId !== vehicleId));
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

          {/* Check if there are no pending registrations */}
          {pendingRegistrations.length === 0 ? (
            <p className="text-center text-gray-800 text-lg">No pending registrations available</p>
          ) : (
            <ul className="bg-white bg-opacity-50 shadow-md rounded-lg divide-y divide-gray-200 mt-6">
              {pendingRegistrations.map((vehicleData) => (
                <VehicleListItem
                  key={vehicleData.transactionId}   // Make sure to use transactionId as the key
                  vehicle={vehicleData}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationsDetails;
