import React, { useContext, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaCarAlt, FaWallet, FaUserCircle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; // Import AuthContext to access user data
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext); // Get user and logout function from AuthContext
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate for programmatic navigation

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    logout(); // Perform logout action from AuthContext
    navigate('/signin'); // Redirect to the Sign-In page after logout
  };

  return (
    <div className="user-dashboard">
      {/* Navbar */}
      <header className="navbar bg-[#DC5F00] text-white p-4 flex justify-between items-center">
        <div className="navbar-logo text-sm font-serif">Secure Chain</div>
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex gap-12">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/profile" className="hover:text-gray-300">Profile</a></li>
            <li><a href="/vehicles" className="hover:text-gray-300">My Vehicles</a></li>
            <li><a href="/settings" className="hover:text-gray-300">Settings</a></li>
          </ul>
        </nav>
        <div className="hidden lg:flex gap-4">
          <button 
            className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
            onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="lg:hidden">
          <AiOutlineMenu className="text-white text-2xl cursor-pointer" onClick={toggleNav} />
        </div>
      </header>

      {/* Mobile Navbar */}
      {navOpen && (
        <div className="bg-[#DC5F00] text-white p-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/profile" className="hover:text-gray-300">Profile</a></li>
            <li><a href="/vehicles" className="hover:text-gray-300">My Vehicles</a></li>
            <li><a href="/settings" className="hover:text-gray-300">Settings</a></li>
            <li>
              <button 
                className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
                onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <main className="bg-gray-100 p-6 lg:p-20 min-h-screen">
        <h1 className="text-4xl font-bold text-[#DC5F00] text-center mb-10">User Dashboard</h1>

        {/* User Overview Section */}
        <section className="flex flex-wrap justify-center gap-12 mb-16">
          {/* Card 1: User Info */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-[#DC5F00] w-10 h-10" />
              <div>
                <p className="text-xl font-bold text-gray-900">{user?.name || 'User Name'}</p> {/* Dynamically show user name */}
                <p className="text-gray-600">{user?.email || 'User Email'}</p> {/* Dynamically show user email */}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <FaCarAlt className="text-[#DC5F00] w-10 h-10" />
              <div>
                <p className="text-xl font-bold text-gray-900">My Vehicles</p>
                <p className="text-gray-600">2 vehicles registered</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <FaWallet className="text-[#DC5F00] w-10 h-10" />
              <div>
                <p className="text-xl font-bold text-gray-900">Wallet Balance</p>
                <p className="text-gray-600">$150.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#DC5F00] mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <p className="text-gray-900 font-bold">Vehicle Registration Completed</p>
                <p className="text-gray-600">2023 Honda Accord | 2 days ago</p>
              </li>
              <li className="py-4">
                <p className="text-gray-900 font-bold">Wallet Recharged</p>
                <p className="text-gray-600">$50.00 | 5 days ago</p>
              </li>
              <li className="py-4">
                <p className="text-gray-900 font-bold">Updated Profile Information</p>
                <p className="text-gray-600">1 week ago</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="flex flex-wrap justify-center gap-12">
          {/* Card 1 */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="text-center">
              <FaCarAlt className="text-[#DC5F00] w-12 h-12 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Register a New Vehicle</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="text-center">
              <FaUserCircle className="text-[#DC5F00] w-12 h-12 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Edit Profile</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[350px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="text-center">
              <FaWallet className="text-[#DC5F00] w-12 h-12 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Top Up Wallet</h3>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer bg-[#DC5F00] text-white p-4 text-center">
        <p>© 2024 Secure Shift. All rights reserved.</p>
      </footer>
    </div>
  );
}
