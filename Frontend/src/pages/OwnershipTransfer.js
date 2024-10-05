import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState(null); // State to track expanded item
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const vehicles = [
    {
      id: 1,
      registrationNumber: 'XYZ123',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Red',
      status: 'Pending',
      chassisNumber: 'CH123456',
      engineNumber: 'EN123456',
      registrationDate: '2020-05-12',
      fromOwner: { id: 'owner1', name: 'John Doe', cnic: '12345-6789012-3' },
      toOwner: { id: 'owner2', name: 'Jane Smith', cnic: '98765-4321098-7' },
    },
    {
      id: 2,
      registrationNumber: 'ABC456',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Blue',
      status: 'Pending',
      chassisNumber: 'CH654321',
      engineNumber: 'EN654321',
      registrationDate: '2019-08-20',
      fromOwner: { id: 'owner2', name: 'Jane Smith', cnic: '98765-4321098-7' },
      toOwner: { id: 'owner1', name: 'John Doe', cnic: '12345-6789012-3' },
    },
  ];

  const handleViewDetails = (vehicleId) => {
    setExpandedTransfer(expandedTransfer === vehicleId ? null : vehicleId); // Toggle expanded state
  };

  const handleAccept = (vehicleId) => {
    alert(`Accepted transfer for vehicle ${vehicleId}`);
  };

  const handleReject = (vehicleId) => {
    alert(`Rejected transfer for vehicle ${vehicleId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#EADFB4',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
        }}
      />

      <SideNavBar logout={handleLogout} navOpen={sidebarOpen} toggleNav={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <TopNavBar toggleNav={() => setSidebarOpen(!sidebarOpen)} />

        {/* Ownership Transfer Section */}
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-6">Ownership Transfer Approvals</h1>
          
          {/* Transfer List */}
          <ul className="space-y-6">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="border border-gray-300 p-4 bg-white bg-opacity-30 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>From:</strong> {vehicle.fromOwner.name}</p>
                    <p><strong>To:</strong> {vehicle.toOwner.name}</p>
                  </div>
                  <button
                    className="bg-[#F38120] text-white px-4 py-2 rounded"
                    onClick={() => handleViewDetails(vehicle.id)}
                  >
                    {expandedTransfer === vehicle.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedTransfer === vehicle.id && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">User Details:</h3>
                    <p><strong>From:</strong> {vehicle.fromOwner.name} (CNIC: {vehicle.fromOwner.cnic})</p>
                    <p><strong>To:</strong> {vehicle.toOwner.name} (CNIC: {vehicle.toOwner.cnic})</p>

                    <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                    <p><strong>Year:</strong> {vehicle.year}</p>
                    <p><strong>Color:</strong> {vehicle.color}</p>
                    <p><strong>Status:</strong> {vehicle.status}</p>
                    <p><strong>Registration Number:</strong> {vehicle.registrationNumber}</p>
                    <p><strong>Chassis Number:</strong> {vehicle.chassisNumber}</p>
                    <p><strong>Engine Number:</strong> {vehicle.engineNumber}</p>
                    <p><strong>Registration Date:</strong> {new Date(vehicle.registrationDate).toLocaleDateString()}</p>

                    {/* Accept and Reject Buttons with Theme Colors */}
                    <div className="mt-4 flex space-x-4">
                      <button
                        className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-all"
                        onClick={() => handleAccept(vehicle.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#C24A00] transition-all"
                        onClick={() => handleReject(vehicle.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
