import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const OwnershipTransfer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/user-dashboard'); // Redirect to User Dashboard
  };

  useEffect(() => {
    // Stop the animation after 3 seconds
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

  const [selectedFromOwner, setSelectedFromOwner] = useState(null);
  const [selectedToOwner, setSelectedToOwner] = useState(null);

  const handleViewDetails = (fromOwnerId, toOwnerId) => {
    const fromOwner = owners.find(o => o.id === fromOwnerId);
    const toOwner = owners.find(o => o.id === toOwnerId);
    setSelectedFromOwner(fromOwner);
    setSelectedToOwner(toOwner);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundColor: '#EADFB4',
          backgroundImage: 'linear-gradient(-60deg, #F38120 50%, #EADFB4 50%)',
          animation: isAnimating ? 'slide 1s ease-in-out forwards' : 'none',
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
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4">
            {sidebarOpen && <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 text-[#373A40]"
            >
              <FaBars />
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            {/* Home button with redirection to User Dashboard */}
            <button
              onClick={handleHomeClick}
              className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]"
            >
              <FaHome className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">Home</span>}
            </button>
            {[{ icon: FaChartLine, text: 'Dashboard', href: '/dashboard' },
              { icon: FaBell, text: 'Notifications', href: '/notifications' },
              { icon: FaCog, text: 'Settings', href: '/settings' }].map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]"
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">{item.text}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-4 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]"
          >
            <FaSignOutAlt className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-white bg-opacity-50">
          <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>
          <div className="flex items-center space-x-4 text-[#373A40]">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
            <button onClick={handleLogout} className="text-sm hover:bg-[#DC5F00]">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Ownership Transfer Section */}
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] flex items-center justify-center mb-6">
            Ownership Transfer Approvals
          </h1>

          {/* List of Owners for Transfer */}
          <div className="flex justify-around">
            <div className="w-1/3">
              <h2 className="text-xl font-semibold mb-4">Transferred From</h2>
              <ul className="space-y-4">
                {owners.slice(0, 3).map((owner, index) => (
                  <li key={index} className="flex justify-between items-center border p-2 rounded">
                    <span>{owner.name}</span>
                    <button
                      className="bg-[#F38120] text-white px-4 py-2 rounded"
                      onClick={() => handleViewDetails(owner.id, owners[index + 1]?.id)} // Simplified example
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-1/3">
              <h2 className="text-xl font-semibold mb-4">Transferred To</h2>
              <ul className="space-y-4">
                {owners.slice(0, 3).map((owner, index) => (
                  <li key={index} className="flex justify-between items-center border p-2 rounded">
                    <span>{owner.name}</span>
                    <button
                      className="bg-[#F38120] text-white px-4 py-2 rounded"
                      onClick={() => handleViewDetails(owners[index]?.id, owner.id)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Display Owner and Vehicle Details */}
          {selectedFromOwner && selectedToOwner && (
            <div className="flex justify-around mt-8">
              <div className="p-4 border rounded w-1/3">
                <h2 className="text-xl font-semibold">Transferred From: {selectedFromOwner.name}</h2>
                <p>Email: {selectedFromOwner.email}</p>
                <p>Ethereum Address: {selectedFromOwner.ethereumAddress}</p>
                <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                <p>Make: {vehicles.find(v => v.ownerId === selectedFromOwner.id)?.make}</p>
                <p>Model: {vehicles.find(v => v.ownerId === selectedFromOwner.id)?.model}</p>
              </div>

              <div className="p-4 border rounded w-1/3">
                <h2 className="text-xl font-semibold">Transferred To: {selectedToOwner.name}</h2>
                <p>Email: {selectedToOwner.email}</p>
                <p>Ethereum Address: {selectedToOwner.ethereumAddress}</p>
                <h3 className="text-lg font-semibold mt-4">Vehicle Details:</h3>
                <p>Make: {vehicles.find(v => v.ownerId === selectedToOwner.id)?.make}</p>
                <p>Model: {vehicles.find(v => v.ownerId === selectedToOwner.id)?.model}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnershipTransfer;
