import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

const InspectionOfficerRequests = () => {
  const [inspectionRequests, setInspectionRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const userRole = user?.role || '';
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    // Decode JWT to fetch logged-in user's ID
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

  useEffect(() => {
    // Redirect unauthorized users
    if (!user || userRole !== 'InspectionOfficer') {
      Swal.fire('Unauthorized', 'Access denied!', 'error');
      logout();
    }
  }, [user, userRole, logout]);

  useEffect(() => {
    if (!loggedInUserId) return;
    const fetchInspectionRequests = async () => {
      try {
          const response = await axios.get('http://localhost:8085/api/fetch-inspection-request-byOfficialID', {
              params: { officerId: loggedInUserId },
          });
          console.log('API Response:', response.data); // Debugging
          if (response.status === 200 && Array.isArray(response.data?.data)) {
              setInspectionRequests(response.data.data);
          } else {
              Swal.fire('Error', 'No requests found for the officer.', 'info');
          }
      } catch (error) {
          console.error('Error fetching inspection requests:', error);
          Swal.fire('Error', 'Failed to fetch inspection requests.', 'error');
      }
  };
  
    fetchInspectionRequests();
  }, [loggedInUserId]);

  const approveRequest = async (requestId) => {
    try {
      const response = await axios.put('http://localhost:8085/api/approveInspection', { requestId });
      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request approved!', 'success');
        setInspectionRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        Swal.fire('Error', 'Failed to approve request.', 'error');
      }
    } catch (error) {
      console.error('Error approving inspection request:', error);
      Swal.fire('Error', 'Failed to approve request.', 'error');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await axios.put('http://localhost:8085/api/rejectInspection', { requestId }); // Adjust route if needed
      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request rejected!', 'success');
        setInspectionRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    } catch (error) {
      console.error('Error rejecting inspection request:', error);
      Swal.fire('Error', 'Failed to reject request.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="InspectionOfficer"
          logout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          <motion.h1
            className="text-4xl font-bold text-[#F38120] mb-10 pt-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Inspection Requests
          </motion.h1>
          <div className="bg-white shadow-lg rounded-lg p-6">
          {inspectionRequests.length === 0 ? (
    <p className="text-center text-xl font-semibold text-gray-500 py-10">
        No inspection requests found.
    </p>
) : (
    <table className="min-w-full border-collapse">
        <thead>
            <tr className="bg-gray-200">
                <th className="p-4 border">Request ID</th>
                <th className="p-4 border">Vehicle ID</th>
                <th className="p-4 border">Appointment Date</th>
                <th className="p-4 border">Status</th>
                <th className="p-4 border">Actions</th>
            </tr>
        </thead>
        <tbody>
            {inspectionRequests.map((request) => (
                <tr key={request.id} className="text-center hover:bg-gray-100">
                    <td className="p-4 border">{request.id}</td>
                    <td className="p-4 border">{request.vehicleId}</td>
                    <td className="p-4 border">
                        {new Date(request.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 border">{request.status || 'Pending'}</td>
                    <td className="p-4 border">
                        <button
                            onClick={() => approveRequest(request.id)}
                            className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => rejectRequest(request.id)}
                            className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Reject
                        </button>
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
