import React, { useContext, useState, useEffect } from 'react';
import { FaCarAlt, FaExchangeAlt, FaFileAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import TopNavBar from '../components/TopNavBar';    // Import TopNavBar

export default function UserDashboard() {
  const {  logout } = useContext(AuthContext); 
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

        {/* Main Dashboard Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">User Dashboard</h1>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* New Registration */}
            <div 
              onClick={() => navigate('/user-vehicle-register')} 
              className="cursor-pointer p-6 bg-white bg-opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <FaFileAlt className="text-[#F38120] w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold text-[#F38120] mb-2">New Registration</h3>
              <p className="text-gray-600">Register a new vehicle easily.</p>
            </div>

            {/* Ownership Transfer */}
            <div 
              onClick={() => navigate('/user-ownership-transfer')} 
              className="cursor-pointer p-6 bg-white bg-opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <FaExchangeAlt className="text-[#F38120] w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold text-[#F38120] mb-2">Ownership Transfer</h3>
              <p className="text-gray-600">Transfer vehicle ownership.</p>
            </div>

            {/* My Vehicles */}
            <div 
              onClick={() => navigate('/user-my-vehicles')} 
              className="cursor-pointer p-6 bg-white bg-opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto md:col-span-2 flex flex-col items-center">
              <FaCarAlt className="text-[#F38120] w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold text-[#F38120] mb-2">My Vehicles</h3>
              <p className="text-gray-600 text-center">View all your registered vehicles.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
