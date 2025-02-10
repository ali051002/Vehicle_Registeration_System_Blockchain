import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const InspectionOfficerRequests = () => {
  // Store the array of requests (with optional vehicle details)
  const [inspectionRequests, setInspectionRequests] = useState([]);
  
  // Sidebar toggling
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth info from context
  const { logout, user } = useContext(AuthContext);
  // We check user.role to ensure they're allowed here
  const userRole = user?.role || '';

  // We'll decode the token to get officer ID
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // 1) Decode JWT from localStorage
  useEffect(() => {
    console.log('%c[Effect] Decoding JWT token...', 'color: #8ec07c');
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        console.log('%cDecoded token:', 'color: #8ec07c', decoded);

        // Adjust depending on your JWT structure
        const officerId = decoded?.id || decoded?.userId;
        setLoggedInUserId(officerId);

        console.log('%cSet loggedInUserId =', 'color: #8ec07c', officerId);
      } catch (err) {
        console.error('%cError decoding token:', 'color: red', err);
        Swal.fire('Error', 'Failed to authenticate user.', 'error');
        logout();
      }
    } else {
      console.log('%cNo token in localStorage.', 'color: orange');
    }
  }, [logout]);

  // 2) Redirect unauthorized users
  useEffect(() => {
    console.log('%c[Effect] Checking user role...', 'color: #8ec07c');
    console.log('User object:', user);
    console.log('User role:', userRole);

    if (!user || userRole !== 'InspectionOfficer') {
      console.warn('%cUnauthorized access. Logging out...', 'color: red');
      Swal.fire('Unauthorized', 'Access denied!', 'error');
      logout();
    }
  }, [user, userRole, logout]);

  // 3) Fetch inspection requests + optional vehicle details
  useEffect(() => {
    if (!loggedInUserId) {
      console.log('%cNo loggedInUserId yet, skipping fetch...', 'color: orange');
      return;
    }

    const fetchInspectionRequests = async () => {
      console.log('%c[Fetch] Getting requests for officerId: ' + loggedInUserId, 'color: #8ec07c');
      try {
        // a) Get the raw inspection requests
        const response = await axios.get(
          'http://localhost:8085/api/fetch-inspection-request-byOfficialID',
          { params: { officerId: loggedInUserId } }
        );
        console.log('%cRequests API response:', 'color: #8ec07c', response);

        if (response.status === 200 && Array.isArray(response.data?.data)) {
          const requests = response.data.data;
          console.log('%cRequests array:', 'color: #8ec07c', requests);

          // b) For each request, also fetch vehicle details if needed
          // Only do this if you want more info than just "VehicleId"
          const enrichedRequests = await Promise.all(
            requests.map(async (req) => {
              console.log(
                '%cFetching vehicle details for InspectionId:',
                'color: #8ec07c',
                req.InspectionId,
                'with VehicleId:',
                req.VehicleId
              );
              try {
                const vehResponse = await axios.get(
                  `http://localhost:8085/api/vehicle/${req.VehicleId}`
                );
                console.log('%cVehicle details:', 'color: #8ec07c', vehResponse.data);

                return {
                  ...req,
                  // We store the fetched vehicle details in a new property
                  vehicleDetails: vehResponse.data || {},
                };
              } catch (vehicleErr) {
                console.error(
                  '%cError fetching vehicle ' + req.VehicleId + ':',
                  'color: red',
                  vehicleErr
                );
                // Return the original request with null vehicleDetails
                return { ...req, vehicleDetails: null };
              }
            })
          );

          console.log(
            '%cFinal enrichedRequests:',
            'color: #8ec07c',
            enrichedRequests
          );
          setInspectionRequests(enrichedRequests);
        } else {
          console.log('%cNo inspection requests found or invalid format.', 'color: orange');
          Swal.fire('Info', 'No inspection requests found for this officer.', 'info');
        }
      } catch (err) {
        console.error('%cError fetching inspection requests:', 'color: red', err);
        Swal.fire('Error', 'Failed to fetch inspection requests.', 'error');
      }
    };

    fetchInspectionRequests();
  }, [loggedInUserId]);

  // Approve a request
  const approveRequest = async (inspectionId) => {
    console.log('%cApproving inspectionId:', 'color: #fabd2f', inspectionId);
    try {
      const response = await axios.put('http://localhost:8085/api/approveInspection', {
        requestId: inspectionId,
      });
      console.log('%cApprove response:', 'color: #fabd2f', response);

      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request approved!', 'success');
        // Remove it from our local state
        setInspectionRequests((prev) =>
          prev.filter((r) => r.InspectionId !== inspectionId)
        );
      } else {
        Swal.fire('Error', 'Failed to approve request.', 'error');
      }
    } catch (err) {
      console.error('%cError approving request:', 'color: red', err);
      Swal.fire('Error', 'Failed to approve request.', 'error');
    }
  };

  // Reject a request (similar to approve)
  const rejectRequest = async (inspectionId) => {
    console.log('%cRejecting inspectionId:', 'color: #fabd2f', inspectionId);
    try {
      // Suppose you have an endpoint PUT /api/rejectInspection
      const response = await axios.put('http://localhost:8085/api/rejectInspection', {
        requestId: inspectionId,
      });
      console.log('%cReject response:', 'color: #fabd2f', response);

      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request rejected!', 'success');
        setInspectionRequests((prev) =>
          prev.filter((r) => r.InspectionId !== inspectionId)
        );
      } else {
        Swal.fire('Error', 'Failed to reject request.', 'error');
      }
    } catch (err) {
      console.error('%cError rejecting request:', 'color: red', err);
      Swal.fire('Error', 'Failed to reject request.', 'error');
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log('%cLogging out user...', 'color: orange');
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top NavBar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Side NavBar */}
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="InspectionOfficer"
          logout={handleLogout}
        />

        <main className="flex-1 overflow-x-auto overflow-y-auto p-6 lg:p-10">
          {/* Title */}
          <motion.h1
            className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-8 pt-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Inspection Requests
          </motion.h1>

          {/* Main Content Container */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            {inspectionRequests.length === 0 ? (
              <p className="text-center text-xl font-semibold text-gray-400 py-10">
                No inspection requests found.
              </p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-200">
                    <th className="p-3 border-b border-gray-700">Inspection ID</th>
                    <th className="p-3 border-b border-gray-700">Vehicle ID</th>
                    <th className="p-3 border-b border-gray-700">Officer ID</th>
                    <th className="p-3 border-b border-gray-700">Status</th>
                    <th className="p-3 border-b border-gray-700">Appointment</th>
                    <th className="p-3 border-b border-gray-700">Created At</th>
                    <th className="p-3 border-b border-gray-700">Updated At</th>
                    <th className="p-3 border-b border-gray-700">Vehicle Info</th>
                    <th className="p-3 border-b border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectionRequests.map((req) => {
                    // Each "req" has keys like:
                    //   req.InspectionId, req.VehicleId, req.Status, ...
                    //   plus optional req.vehicleDetails from the second fetch
                    const vehicle = req.vehicleDetails || {};
                    return (
                      <tr
                        key={req.InspectionId}
                        className="border-b border-gray-700 hover:bg-gray-750"
                      >
                        {/* Inspection ID */}
                        <td className="p-3 text-center">
                          {req.InspectionId}
                        </td>

                        {/* Vehicle ID (direct from request) */}
                        <td className="p-3 text-center">
                          {req.VehicleId}
                        </td>

                        {/* Officer ID */}
                        <td className="p-3 text-center">
                          {req.OfficerId}
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          {req.Status || 'Pending'}
                        </td>

                        {/* Appointment Date */}
                        <td className="p-3 text-center">
                          {req.AppointmentDate
                            ? new Date(req.AppointmentDate).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        {/* CreatedAt */}
                        <td className="p-3 text-center">
                          {req.CreatedAt
                            ? new Date(req.CreatedAt).toLocaleString()
                            : 'N/A'}
                        </td>

                        {/* UpdatedAt */}
                        <td className="p-3 text-center">
                          {req.UpdatedAt
                            ? new Date(req.UpdatedAt).toLocaleString()
                            : 'N/A'}
                        </td>

                        {/* Vehicle Info (from second fetch) */}
                        <td className="p-3 text-center">
                          {/* For example, Make & Model */}
                          {vehicle.make && vehicle.model ? (
                            <div className="text-gray-200">
                              <span className="font-semibold">Make:</span>{' '}
                              {vehicle.make} <br />
                              <span className="font-semibold">Model:</span>{' '}
                              {vehicle.model}
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Approve / Reject */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => approveRequest(req.InspectionId)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectRequest(req.InspectionId)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
