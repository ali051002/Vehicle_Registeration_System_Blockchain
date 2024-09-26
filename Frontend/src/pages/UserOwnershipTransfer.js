import React, { useContext, useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaSignOutAlt, FaCarAlt, FaBell, FaChevronDown, FaChevronUp, FaExchangeAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const VehicleListItem = ({ vehicle, owner, onTransfer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="bg-white bg-opacity-20 rounded-lg shadow-md mb-4 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex-grow cursor-pointer" onClick={toggleDetails}>
          <h3 className="font-semibold text-[#373A40]">{vehicle.make} {vehicle.model}</h3>
          <p className="text-[#373A40]">Owner: {owner.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onTransfer(vehicle.id)}
            className="px-4 py-2 bg-[#F38120] text-white rounded-md hover:bg-[#DC5F00] transition-all duration-300 flex items-center"
          >
            <FaExchangeAlt className="mr-2" />
            Transfer
          </button>
          <button className="text-[#373A40] hover:text-[#F38120]" onClick={toggleDetails}>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 p-4 bg-white bg-opacity-10">
          <p className="text-[#373A40]"><strong>Year:</strong> {vehicle.manufactureYear}</p>
          <p className="text-[#373A40]"><strong>Registration Date:</strong> {vehicle.registrationDate}</p>
          <p className="text-[#373A40]"><strong>Engine Number:</strong> {vehicle.engineNumber}</p>
          <p className="text-[#373A40]"><strong>License Plate:</strong> {vehicle.licensePlate}</p>
          <p className="text-[#373A40]"><strong>Color:</strong> {vehicle.color}</p>
          <p className="text-[#373A40]"><strong>Chassis Number:</strong> {vehicle.chassisNumber}</p>
        </div>
      )}
    </li>
  );
};

export default function UserOwnershipTransfer() {
  const { user, logout } = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const vehicles = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      registrationDate: '2023-01-01',
      engineNumber: 'EN123456',
      licensePlate: 'ABC-1234',
      color: 'Blue',
      chassisNumber: 'CH123456',
      manufactureYear: 2022,
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      registrationDate: '2023-02-01',
      engineNumber: 'EN654321',
      licensePlate: 'DEF-5678',
      color: 'Red',
      chassisNumber: 'CH654321',
      manufactureYear: 2021,
    },
  ];

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleTransferTo = (vehicleId) => {
    navigate(`/user-transfer-to/${vehicleId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background animation */}
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
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${navOpen ? 'w-64' : 'w-16'} flex flex-col justify-between bg-[##EADFB4] bg-opacity-80`}
      >
        {/* Sidebar content (unchanged) */}
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#EADFB4] bg-opacity-80">
          <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>
          <div className="flex items-center space-x-4 text-[#373A40]">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">Ownership Transfer</h1>

          <ul className="space-y-4">
            {vehicles.map(vehicle => (
              <VehicleListItem 
                key={vehicle.id} 
                vehicle={vehicle} 
                owner={user} 
                onTransfer={handleTransferTo}
              />
            ))}
          </ul>
        </main>

        
      </div>
    </div>
  );
}