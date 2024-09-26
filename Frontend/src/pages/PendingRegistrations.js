import { color } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const VehicleListItem = ({ vehicle, owner }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
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
            <button className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300">
              Approve
            </button>
            <button className="bg-[#F38120] text-white px-4 py-2 rounded hover:bg-[#DC5F00] transition-colors duration-300">
              Reject
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

const PendingRegistrationsDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      // Replace this with your actual data fetching logic
      const data = [
        {
          vehicle: {
            _id: '1',
            registrationNumber: 'ABC123',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            status: 'Pending',
            chassisNumber: 'CH123456',
            engineNumber: 'EN123456',
            registrationDate: '2023-08-12',
          },
          owner: {
            name: 'John Doe',
            ethereumAddress: '0xABC123456789DEF',
          },
        },
        {
          vehicle: {
            _id: '2',
            registrationNumber: 'XYZ987',
            make: 'Honda',
            model: 'Civic',
            year: 2021,
            status: 'Pending',
            chassisNumber: 'CH654321',
            engineNumber: 'EN654321',
            registrationDate: '2023-08-15',
          },
          owner: {
            name: 'Jane Smith',
            ethereumAddress: '0xDEF987654321ABC',
          },
        },
      ];
      setPendingRegistrations(data);
    };

    fetchPendingRegistrations();

    // Stop the animation after 3 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[##EADFB4] flex h-screen overflow-hidden relative ">
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundcolor: 'bg-[##EADFB4] ',
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
            transform: translateX(0); /* Ends with no translation */
          }
        }
      `}</style>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4">
            {sidebarOpen && <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 text-[#373A40]">
              <FaBars />
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            {[
              { icon: FaHome, text: 'Home', href: '/home' },
              { icon: FaChartLine, text: 'Dashboard', href: '/dashboard' },
              { icon: FaBell, text: 'Notifications', href: '/notifications' },
              { icon: FaCog, text: 'Settings', href: '/settings' },
            ].map((item, index) => (
              <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
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
          </div>
        </div>

        {/* Pending Registrations Section */}
        <div className="p-6 min-h-screen">
          <h2 className="text-4xl font-bold text-center text-[#373A40] mb-6 flex items-center justify-center">
            Pending Registrations Details
          </h2>

          <ul className="bg-white bg-opacity-50 shadow-md rounded-lg divide-y divide-gray-200 mt-6">
            {pendingRegistrations.map((vehicleData) => (
              <VehicleListItem key={vehicleData.vehicle._id} vehicle={vehicleData.vehicle} owner={vehicleData.owner} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationsDetails;
