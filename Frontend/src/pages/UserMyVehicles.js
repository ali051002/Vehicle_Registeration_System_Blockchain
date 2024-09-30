import React, { useState, useEffect, useContext } from 'react';
import { FaCarAlt, FaBars, FaHome, FaCog, FaSignOutAlt, FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

const VehicleListItem = ({ vehicle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="bg-white bg-opacity-20 rounded-lg shadow-md mb-4 overflow-hidden">
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleDetails}>
        <div>
          <h3 className="font-semibold text-[#373A40]">{vehicle.make} {vehicle.model}</h3>
          <p className="text-[#373A40]">Owner: {vehicle.ownerId}</p>
        </div>
        <button className="text-[#373A40] hover:text-[#F38120]">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
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

export default function UserMyVehicles() {
  const { user, logout } = useContext(AuthContext); // Use AuthContext to get the logged-in user
  const [vehicles, setVehicles] = useState([]); // Store vehicles in state
  const [navOpen, setNavOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Fetch vehicles for the logged-in user when the component mounts
  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:8085/api/vehicles/user/${user.id}`); // Fetch vehicles using the logged-in user's ID
          setVehicles(response.data); // Set the fetched vehicles
        } catch (error) {
          console.error('Error fetching user vehicles:', error);
        }
      }
    };

    fetchUserVehicles();

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]); // The effect depends on the user state

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
        <div>
          <div className="flex items-center justify-between h-16 px-4">
            {navOpen && <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>}
            <button onClick={toggleNav} className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 text-[#373A40]">
              <FaBars />
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            {[ 
              { icon: FaHome, text: 'Home', href: '/' },
              { icon: FaCarAlt, text: 'My Vehicles', href: '/vehicles' },
              { icon: FaBell, text: 'Notifications', href: '/notifications' },
              { icon: FaCog, text: 'Settings', href: '/settings' },
            ].map((item, index) => (
              <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40]">
                <item.icon className="w-5 h-5" />
                {navOpen && <span className="ml-4">{item.text}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-4 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:text-[#373A40] transition-colors duration-300"
          >
            <FaSignOutAlt className="w-5 h-5" />
            {navOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
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
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">My Vehicles</h1>

          <ul className="space-y-4">
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <VehicleListItem key={vehicle._id} vehicle={vehicle} owner={user} />
              ))
            ) : (
              <p className="text-[#373A40] text-center">You do not own any vehicles.</p>
            )}
          </ul>
        </main>
      </div>
    </div>
  );
}
