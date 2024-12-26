import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InspectionRequest = () => {
  const [inspectionRequests, setInspectionRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRole = user?.role || '';

  // Redirect unauthorized users
  useEffect(() => {
    if (!user || userRole !== 'InspectionOfficer') {
      navigate(user ? '/unauthorized' : '/signin');
    }
  }, [user, userRole, navigate]);

  // Decode JWT to retrieve logged-in officer ID
  const storedToken = localStorage.getItem('token');
  let loggedInUserId = null;

  try {
    const decoded = storedToken ? jwtDecode(storedToken) : null;
    loggedInUserId = decoded?.id || decoded?.userId;
  } catch (err) {
    console.error('Error decoding JWT:', err);
    Swal.fire('Error', 'Failed to authenticate user.', 'error');
  }

  // Fetch inspection requests on component mount
  useEffect(() => {
    const fetchInspectionRequests = async () => {
      if (!loggedInUserId) {
        Swal.fire('Error', 'User is not authorized.', 'error');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:8085/api/fetch-inspection-request-byOfficialID',
          { params: { officerId: loggedInUserId } } // Pass officerId as query params
        );

        if (response.status === 200 && response.data?.data) {
          setInspectionRequests(response.data.data);
        } else {
          Swal.fire('Error', 'Failed to fetch inspection requests.', 'error');
        }
      } catch (error) {
        console.error('Error fetching inspection requests:', error);
        Swal.fire('Error', 'Failed to fetch inspection requests.', 'error');
      }
    };

    fetchInspectionRequests();
  }, [loggedInUserId]);

  // Approve inspection request
  const approveRequest = async (requestId) => {
    try {
      const response = await axios.put('http://localhost:8085/api/inspection/approveInspection', {
        requestId,
      });

      if (response.status === 200) {
        Swal.fire('Success', 'Inspection request approved successfully!', 'success');
        setInspectionRequests((prev) =>
          prev.filter((request) => request.id !== requestId) // Remove approved request from state
        );
      } else {
        Swal.fire('Error', 'Failed to approve inspection request.', 'error');
      }
    } catch (error) {
      console.error('Error approving inspection request:', error);
      Swal.fire('Error', 'Failed to approve inspection request.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navbar */}
      <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideNavBar
          navOpen={sidebarOpen}
          toggleNav={() => setSidebarOpen(!sidebarOpen)}
          userRole="inspectionOfficer"
          logout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
          <h1 className="text-4xl font-bold text-[#F38120] mb-10 pt-16">
            Inspection Requests
          </h1>

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
                    <tr
                      key={request.id}
                      className="text-center hover:bg-gray-100"
                    >
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
                          onClick={() =>
                            Swal.fire('Info', 'Reject functionality not implemented.', 'info')
                          }
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

export default InspectionRequest;
