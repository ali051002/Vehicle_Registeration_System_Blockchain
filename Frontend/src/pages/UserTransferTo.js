import React, { useContext, useState, useEffect } from 'react';
import { FaBars, FaHome, FaCog, FaSignOutAlt, FaCarAlt, FaBell } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';

export default function UserTransferTo() {
  const {  logout } = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    cnic: '',
    make: '',
    model: '',
    registrationDate: '',
    engineNumber: '',
    licensePlate: '',
    color: '',
    chassisNumber: '',
    manufactureYear: ''
  });
  const navigate = useNavigate();
  const { vehicleId } = useParams();

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
    const { cnic, chassisNumber, licensePlate } = formData;

    if (!cnic || !chassisNumber || !licensePlate) {
      alert('Please fill out all required fields (CNIC, Chassis Number, License Plate).');
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
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-white hover:bg-opacity-20 text-[#373A40] transition-colors duration-300"
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
          <h1 className="text-4xl font-bold text-[#373A40] text-center mb-10">Transfer Vehicle (ID: {vehicleId})</h1>
          
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

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-[#373A40]">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-lg font-medium text-[#373A40]">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-lg font-medium text-[#373A40]">Phone Number</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
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

              {/* Vehicle Make */}
              <div>
                <label htmlFor="make" className="block text-lg font-medium text-[#373A40]">Vehicle Make</label>
                <input 
                  type="text" 
                  id="make" 
                  name="make" 
                  value={formData.make}
                  onChange={handleChange}
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
                  value={formData.model}
                  onChange={handleChange}
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
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Engine Number */}
              <div>
                <label htmlFor="engineNumber" className="block text-lg font-medium text-[#373A40]">Engine Number</label>
                <input 
                  type="text" 
                  id="engineNumber" 
                  name="engineNumber" 
                  value={formData.engineNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* License Plate */}
              <div>
                <label htmlFor="licensePlate" className="block text-lg font-medium text-[#373A40]">License Plate <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="licensePlate" 
                  name="licensePlate" 
                  value={formData.licensePlate}
                  onChange={handleChange}
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
                  value={formData.color}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F38120] focus:border-[#F38120]" 
                  required 
                />
              </div>

              {/* Chassis Number */}
              <div>
                <label htmlFor="chassisNumber" className="block text-lg font-medium text-[#373A40]">Chassis Number <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="chassisNumber" 
                  name="chassisNumber" 
                  value={formData.chassisNumber}
                  onChange={handleChange}
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
                  value={formData.manufactureYear}
                  onChange={handleChange}
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
                Submit Transfer Request
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
