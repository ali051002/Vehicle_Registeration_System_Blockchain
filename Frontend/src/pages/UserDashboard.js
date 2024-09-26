import React, { useContext, useState, useEffect } from 'react';
import { FaCarAlt, FaWallet, FaUserCircle, FaBars, FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext); 
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
          backgroundImage: 'linear-gradient(-60deg, #EADFB4 50%, #F38120 50%)',
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
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${navOpen ? 'w-64' : 'w-16'} flex flex-col justify-between bg-white bg-opacity-80`}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4">
            {navOpen && <div className="navbar-logo text-sm font-serif text-[#373A40]"></div>}
            <button onClick={toggleNav} className="p-2 rounded-md hover:text-[#373A40] hover:text-white transition-colors duration-300">
              <FaBars />
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            {[
              { icon: FaHome, text: 'Home', href: '/' },
              { icon: FaUserCircle, text: 'Profile', href: '/profile' },
              { icon: FaCarAlt, text: 'My Vehicles', href: '/vehicles' },
              { icon: FaCog, text: 'Settings', href: '/settings' },
            ].map((item, index) => (
              <Link key={index} to={item.href} className="flex items-center px-4 py-2 text-sm hover:bg-[#F38120] hover:text-white transition-colors duration-300">
                <item.icon className="w-5 h-5 text-[#373A40]" />
                {navOpen && <span className="ml-4 text-[#373A40]">{item.text}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mb-4 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#F38120] hover:text-white transition-colors duration-300"
          >
            <FaSignOutAlt className="w-5 h-5 text-[#373A40]" />
            {navOpen && <span className="ml-4 text-[#373A40]">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-white bg-opacity-80">
          <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>
          <div className="flex items-center space-x-4 text-[#373A40]">
            <span>Platform</span>
            <span>About us</span>
            <span>Contact</span>
            
          </div>
        </div>

        {/* Main Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">User Dashboard</h1>

          {/* User Overview Section */}
          <section className="flex flex-wrap justify-center gap-12 mb-16">
            {/* Card 1: User Info */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-[#F38120] w-10 h-10" />
                <div>
                  <p className="text-xl font-bold text-[#F38120]">{user?.name || 'User Name'}</p>
                  <p className="text-gray-600">{user?.email || 'User Email'}</p>
                </div>
              </div>
            </div>

            {/* Card 2: My Vehicles */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <FaCarAlt className="text-[#F38120] w-10 h-10" />
                <div>
                  <p className="text-xl font-bold text-[#F38120]">My Vehicles</p>
                  <p className="text-gray-600">2 vehicles registered</p>
                </div>
              </div>
            </div>

            {/* Card 3: Wallet Balance */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <FaWallet className="text-[#F38120] w-10 h-10" />
                <div>
                  <p className="text-xl font-bold text-[#F38120]">Wallet Balance</p>
                  <p className="text-gray-600">$150.00</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#373A40] mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ul className="divide-y divide-gray-200">
                <li className="py-4">
                  <p className="text-[#F38120] font-bold">Vehicle Registration Completed</p>
                  <p className="text-gray-600">2023 Honda Accord | 2 days ago</p>
                </li>
                <li className="py-4">
                  <p className="text-[#F38120] font-bold">Wallet Recharged</p>
                  <p className="text-gray-600">$50.00 | 5 days ago</p>
                </li>
                <li className="py-4">
                  <p className="text-[#F38120] font-bold">Updated Profile Information</p>
                  <p className="text-gray-600">1 week ago</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="flex flex-wrap justify-center gap-12">
            {/* Card 1: Register a New Vehicle */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <FaCarAlt className="text-[#F38120] w-12 h-12 mx-auto" />
                <h3 className="mt-4 text-2xl font-bold text-[#F38120]">Register a New Vehicle</h3>
              </div>
            </div>

            {/* Card 2: Edit Profile */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <FaUserCircle className="text-[#F38120] w-12 h-12 mx-auto" />
                <h3 className="mt-4 text-2xl font-bold text-[#F38120]">Edit Profile</h3>
              </div>
            </div>

            {/* Card 3: Top Up Wallet */}
            <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <FaWallet className="text-[#F38120] w-12 h-12 mx-auto" />
                <h3 className="mt-4 text-2xl font-bold text-[#F38120]">Top Up Wallet</h3>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Section */}
        <footer className="footer bg-white bg-opacity-80 text-[#F38120] p-4 text-center">
          <p>© 2024 Secure Shift. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}