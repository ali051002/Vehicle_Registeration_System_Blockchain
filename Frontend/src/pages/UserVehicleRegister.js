import React, { useContext, useState, useEffect } from 'react';
import { FaCarAlt, FaExchangeAlt, FaFileAlt, FaBars, FaHome, FaCog, FaSignOutAlt, FaBell, FaChartLine } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';

export default function UserVehicleRegister() {
  const { user, logout } = useContext(AuthContext); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    navigate('/signin'); 
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
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col justify-between bg-opacity-80`}
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

        {/* Page Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">Vehicle Registration</h1>
          
          {/* Registration Form */}
          <form className="space-y-6 relative mx-auto bg-[#EADFB4] bg-opacity-30 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[80%] lg:w-[60%] h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Make */}
              <div>
                <label htmlFor="make" className="block text-lg font-medium text-[#373A40]">Vehicle Make</label>
                <input 
                  type="text" 
                  id="make" 
                  name="make" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Vehicle Model */}
              <div>
                <label htmlFor="model" className="block text-lg font-medium text-[#373A40]">Vehicle Model</label>
                <input 
                  type="text" 
                  id="model" 
                  name="model" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Registration Date */}
              <div>
                <label htmlFor="registrationDate" className="block text-lg font-medium text-[#373A40]">Registration Date</label>
                <input 
                  type="date" 
                  id="registrationDate" 
                  name="registrationDate" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                  pattern="\d{4}-\d{2}-\d{2}" 
                  placeholder="yy/mm/dd"
                />
              </div>

              {/* Engine Number */}
              <div>
                <label htmlFor="engineNumber" className="block text-lg font-medium text-[#373A40]">Engine Number</label>
                <input 
                  type="text" 
                  id="engineNumber" 
                  name="engineNumber" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* License Plate */}
              <div>
                <label htmlFor="licensePlate" className="block text-lg font-medium text-[#373A40]">License Plate</label>
                <input 
                  type="text" 
                  id="licensePlate" 
                  name="licensePlate" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-lg font-medium text-[#373A40]">Color</label>
                <input 
                  type="text" 
                  id="color" 
                  name="color" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Chassis Number */}
              <div>
                <label htmlFor="chassisNumber" className="block text-lg font-medium text-[#373A40]">Chassis Number</label>
                <input 
                  type="text" 
                  id="chassisNumber" 
                  name="chassisNumber" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Year of Manufacture */}
              <div>
                <label htmlFor="manufactureYear" className="block text-lg font-medium text-[#373A40]">Year of Manufacture</label>
                <input 
                  type="number" 
                  id="manufactureYear" 
                  name="manufactureYear" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                  min="1900" max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button 
                type="submit" 
                className="px-6 py-2 bg-[#F38120] text-white rounded-md hover:bg-[#DC5F00] transition-all duration-300">
                Register Vehicle
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
