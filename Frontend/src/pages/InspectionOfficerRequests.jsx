import React, { useContext, useState, useEffect } from 'react';
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

  // Grab `logout` and `user` from AuthContext
  const { logout, user } = useContext(AuthContext);

  // Extract user role from the user object
  const userRole = user?.role || '';

  // State to store the decoded user ID from JWT
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // 1. Decode JWT to get the logged-in user's ID
  useEffect(() => {
    console.log('Attempting to read token from localStorage...');
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        console.log('Token found. Decoding...');
        const decoded = jwtDecode(storedToken);
        console.log('Decoded JWT:', decoded);
        setLoggedInUserId(decoded?.id || decoded?.userId);
        console.log('Set loggedInUserId:', decoded?.id || decoded?.userId);
      } catch (err) {
        console.error('Error decoding JWT:', err);
        Swal.fire('Error', 'Failed to authenticate user.', 'error');
        logout();
      }
    } else {
      console.log('No token found in localStorage.');
    }
  }, [logout]);

  // 2. Redirect unauthorized users
  useEffect(() => {
    console.log('Checking user and role for authorization...');
    console.log('Current user:', user);
    console.log('User role:', userRole);

    if (!user || userRole !== 'InspectionOfficer') {
      console.warn('Unauthorized access! Logging out...');
      Swal.fire('Unauthorized', 'Access denied!', 'error');
      logout();
    }
  }, [user, userRole, logout]);

  // 3. Fetch inspection requests (along with vehicle details) if we have a valid user ID
  useEffect(() => {
    if (!loggedInUserId) {
      console.log('loggedInUserId not set yet. Skipping fetch...');
      return;
    }

    const fetchInspectionRequests = async () => {
      try {
        console.log('Fetching inspection requests for officer ID:', loggedInUserId);

        const response = await axios.get(
          'http://localhost:8085/api/fetch-inspection-request-byOfficialID',
          {
            params: { officerId: loggedInUserId },
          }
        );

        console.log('Raw API Response:', response);

        if (response.status === 200 && Array.isArray(response.data?.data)) {
          console.log('Inspection requests array received:', response.data.data);

          // Enrich each request with vehicle details
          const enrichedRequests = await Promise.all(
            response.data.data.map(async (request) => {
              console.log(`Fetching vehicle details for vehicleId: ${request.vehicleId}`);
              try {
                const vehicleResponse = await axios.get(
                  `http://localhost:8085/api/vehicle/${request.vehicleId}`
                );
                console.log('Vehicle details response:', vehicleResponse.data);

                return {
                  ...request,
                  vehicleDetails: vehicleResponse.data || {},
                };
              } catch (vehicleError) {
                console.error(`Error fetching vehicle details for ID ${request.vehicleId}:`, vehicleError);
                return { ...request, vehicleDetails: null };
              }
            })
          );

          console.log('Enriched Requests:', enrichedRequests);
          setInspectionRequests(enrichedRequests);
        } else {
          console.log('No requests found or response data is not an array.');
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
  const approveRequest = async (requestId) => {
    console.log('Approving request with requestId:', requestId);
    try {
      const response = await axios.put('http://localhost:8085/api/approveInspection', {
        requestId,
      });

      console.log('Approve API response:', response);

      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request approved!', 'success');

        // Filter out the approved request from the state
        setInspectionRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        Swal.fire('Error', 'Failed to approve request.', 'error');
      }
    } catch (error) {
      console.error('Error approving inspection request:', error);
      Swal.fire('Error', 'Failed to approve request.', 'error');
    }
  };

  // Reject an inspection request
  const rejectRequest = async (requestId) => {
    console.log('Rejecting request with requestId:', requestId);
    try {
      const response = await axios.put('http://localhost:8085/api/rejectInspection', {
        requestId,
      });

      console.log('Reject API response:', response);

      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request rejected!', 'success');

        // Filter out the rejected request from the state
        setInspectionRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    } catch (error) {
      console.error('Error rejecting inspection request:', error);
      Swal.fire('Error', 'Failed to reject request.', 'error');
    }
  };

  // Handle logout and redirect
  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navigation Bar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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
                    <th className="p-4 border">Vehicle Details</th>
                    <th className="p-4 border">Appointment Date</th>
                    <th className="p-4 border">Status</th>
                    <th className="p-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionRequests.map((request) => (
                    <tr key={request.id} className="text-center hover:bg-gray-100">
                      <td className="p-4 border">{request.id}</td>
                      <td className="p-4 border">
                        {request.vehicleDetails
                          ? `${request.vehicleDetails.make || 'N/A'} ${
                              request.vehicleDetails.model || ''
                            }`
                          : 'Vehicle not found'}
                      </td>
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
