import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Import Link or useNavigate from react-router-dom
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const InspectionOfficerRequests = () => {
  const [inspectionRequests, setInspectionRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const userRole = user?.role || '';
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // For navigation (optional if you want to programmatically navigate)
  const navigate = useNavigate();

  // 1. Decode JWT to get the logged-in user's ID
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setLoggedInUserId(decoded?.id || decoded?.userId);
      } catch (err) {
        console.error('Error decoding JWT:', err);
        Swal.fire('Error', 'Failed to authenticate user.', 'error');
        logout();
      }
    }
  }, [logout]);

  // 2. Redirect unauthorized users
  useEffect(() => {
    if (!user || userRole !== 'InspectionOfficer') {
      Swal.fire('Unauthorized', 'Access denied!', 'error');
      logout();
    }
  }, [user, userRole, logout]);

  // 3. Fetch inspection requests (returns { InspectionId, VehicleId, Status, ... })
  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchInspectionRequests = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8085/api/fetch-inspection-request-byOfficialID',
          { params: { officerId: loggedInUserId } }
        );

        if (response.status === 200 && Array.isArray(response.data?.data)) {
          setInspectionRequests(response.data.data);
        } else {
          Swal.fire('Info', 'No requests found for the officer.', 'info');
        }
      } catch (error) {
        console.error('Error fetching inspection requests:', error);
        Swal.fire('Error', 'Failed to fetch inspection requests.', 'error');
      }
    };

    fetchInspectionRequests();
  }, [loggedInUserId]);

  // Approve an inspection request
  const approveRequest = async (inspectionId) => {
    try {
      const response = await axios.put('http://localhost:8085/api/approveInspection', {
        requestId: inspectionId,
      });
      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request approved!', 'success');
        setInspectionRequests((prev) => prev.filter((req) => req.InspectionId !== inspectionId));
      } else {
        Swal.fire('Error', 'Failed to approve request.', 'error');
      }
    } catch (error) {
      console.error('Error approving inspection request:', error);
      Swal.fire('Error', 'Failed to approve request.', 'error');
    }
  };

  // Reject an inspection request
  const rejectRequest = async (inspectionId) => {
    try {
      const response = await axios.put('http://localhost:8085/api/rejectInspection', {
        requestId: inspectionId,
      });
      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request rejected!', 'success');
        setInspectionRequests((prev) => prev.filter((req) => req.InspectionId !== inspectionId));
      } else {
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    } catch (error) {
      console.error('Error rejecting inspection request:', error);
      Swal.fire('Error', 'Failed to reject request.', 'error');
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="InspectionOfficer"
          logout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.h1
            className="text-3xl lg:text-4xl font-bold text-orange-400 mb-8 pt-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Inspection Requests
          </motion.h1>

          <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            {inspectionRequests.length === 0 ? (
              <p className="text-center text-xl font-semibold text-gray-400 py-10">
                No inspection requests found.
              </p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-200">
                    <th className="p-3 border-b border-gray-600">Inspection ID</th>
                    <th className="p-3 border-b border-gray-600">Vehicle ID</th>
                    <th className="p-3 border-b border-gray-600">Status</th>
                    <th className="p-3 border-b border-gray-600">Appointment</th>
                    <th className="p-3 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionRequests.map((req) => (
                    <tr key={req.InspectionId} className="hover:bg-gray-700">
                      <td className="p-3 text-center">{req.InspectionId}</td>
                      <td className="p-3 text-center">{req.VehicleId}</td>
                      <td className="p-3 text-center">{req.Status || 'Pending'}</td>
                      <td className="p-3 text-center">
                        {req.AppointmentDate
                          ? new Date(req.AppointmentDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => approveRequest(req.InspectionId)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectRequest(req.InspectionId)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                        {/* 
                          VIEW DETAILS 
                          Option 1: Use Link from react-router-dom
                        */}
                        <Link
                          to={`/vehicle-details/${req.VehicleId}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                        >
                          View Details
                        </Link>

                        {/*
                          Option 2: Use navigate() programmatically:
                          <button
                            onClick={() => navigate(`/vehicle-details/${req.VehicleId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                          >
                            View Details
                          </button>
                        */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionOfficerRequests;
