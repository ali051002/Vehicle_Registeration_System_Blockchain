import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/user-dashboard');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const vehicles = [
    {
      id: 1,
      registrationNumber: 'XYZ123',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Red',
      ownerId: 'owner1',
    },
    {
      id: 2,
      registrationNumber: 'ABC456',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Blue',
      ownerId: 'owner2',
    },
  ];

  const owners = [
    {
      id: 'owner1',
      name: 'John Doe',
      email: 'john@example.com',
      ethereumAddress: '0x12345',
    },
    {
      id: 'owner2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      ethereumAddress: '0x67890',
    },
  ];

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [listType, setListType] = useState(null); // To identify which list was clicked

  const handleViewDetails = (ownerId, type) => {
    const owner = owners.find(o => o.id === ownerId);
    setSelectedOwner(owner);
    setListType(type);
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

        {/* Ownership Transfer Section */}
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] flex items-center justify-center mb-6">
            Ownership Transfer Approvals
          </h1>

          <div className="flex justify-around">
            {/* Transferred From List */}
            <div className="w-1/3 bg-white bg-opacity-30 backdrop-blur-sm border border-gray-300 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-center">Transferred From</h2>
              <ul className="space-y-4">
                {owners.map((owner) => (
                  <li key={owner.id} className="flex justify-between items-center border p-2 rounded bg-opacity-50">
                    <span>{owner.name}</span>
                    <button
                      className="bg-[#F38120] text-white px-4 py-2 rounded"
                      onClick={() => handleViewDetails(owner.id, 'from')}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transferred To List */}
            <div className="w-1/3 bg-white bg-opacity-30 backdrop-blur-sm border border-gray-300 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-center">Transferred To</h2>
              <ul className="space-y-4">
                {owners.map((owner) => (
                  <li key={owner.id} className="flex justify-between items-center border p-2 rounded bg-opacity-50">
                    <span>{owner.name}</span>
                    <button
                      className="bg-[#F38120] text-white px-4 py-2 rounded"
                      onClick={() => handleViewDetails(owner.id, 'to')}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Display Owner and Vehicle Details */}
          {selectedOwner && (
            <div className="mt-8 flex justify-center">
              <div className="w-2/3 bg-white bg-opacity-30 backdrop-blur-sm border border-gray-300 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {listType === 'from' ? 'Transferred From' : 'Transferred To'}: {selectedOwner.name}
                </h2>
                <p>Email: {selectedOwner.email}</p>
                <p>Ethereum Address: {selectedOwner.ethereumAddress}</p>
                <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                <p>Make: {vehicles.find(v => v.ownerId === selectedOwner.id)?.make}</p>
                <p>Model: {vehicles.find(v => v.ownerId === selectedOwner.id)?.model}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
