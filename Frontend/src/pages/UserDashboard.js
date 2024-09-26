import React, { useContext, useState, useEffect } from 'react';
import { FaCarAlt, FaExchangeAlt, FaFileAlt, FaBars, FaHome, FaCog, FaSignOutAlt, FaBell, FaChartLine } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';

export default function UserDashboard() {
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
