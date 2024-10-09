import React, { useContext, useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaSignOutAlt, FaCarAlt, FaBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';  // Importing SideNavBar from components
import TopNavBar from '../components/TopNavBar';    // Importing TopNavBar from components

export default function UserTransferTo() {
  const { logout } = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    fees: '',
  });
  const navigate = useNavigate();

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { cnic } = formData;

    if (!cnic) {
      alert('Please fill out the required CNIC field.');
      return;
    }

    // Submit logic here
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
      <SideNavBar logout={handleLogout} navOpen={navOpen} toggleNav={toggleNav} />  {/* Using imported SideNavBar */}

      {/* Main content */}
      <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${navOpen ? 'ml-64' : 'ml-16'}`}>
        
        {/* Top Navbar */}
        <TopNavBar />  {/* Using imported TopNavBar */}

        {/* Page Content */}
        <main className="bg-transparent p-6 lg:p-20 min-h-screen">
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">Transfer Vehicle</h1>  {/* Removed ID from heading */}
          
          {/* Transfer Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative mx-auto bg-[#EADFB4] bg-opacity-50 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[80%] lg:w-[60%] h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-[#373A40]">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* CNIC */}
              <div>
                <label htmlFor="cnic" className="block text-lg font-medium text-[#373A40]">CNIC <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="cnic" 
                  name="cnic" 
                  value={formData.cnic}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Fees */}
              <div>
                <label htmlFor="fees" className="block text-lg font-medium text-[#373A40]">Fees</label>
                <input 
                  type="text" 
                  id="fees" 
                  name="fees" 
                  value={formData.fees}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button 
                type="submit" 
                className="px-6 py-2 bg-[#F38120] text-white rounded-md hover:bg-[#DC5F00] transition-all duration-300">
                Submit Transfer Request
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
