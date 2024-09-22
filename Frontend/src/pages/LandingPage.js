import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaCheckCircle, FaShieldAlt, FaClock } from 'react-icons/fa';

const cars = [
  { thumbnail: '', bigCar: '' },
  { thumbnail: '', bigCar: '' },
  { thumbnail: '', bigCar: '' }
];

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [bigCarImg, setBigCarImg] = useState(cars[0].bigCar);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="navbar bg-[#DC5F00] text-white p-4 flex justify-between items-center">
        <div className="navbar-logo text-sm font-serif">Secure Chain</div>
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex gap-12">
            <li><a href="/" className="hover:text-gray-300">Platform</a></li>
            <li><a href="/about" className="hover:text-gray-300">About us</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </nav>
        <div className="hidden lg:flex gap-4">
          <button 
            className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
            onClick={() => window.location.href = '/signin'}>
            Sign In
          </button>
          <button 
            className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
            onClick={() => window.location.href = '/signup'}>
            Sign Up
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
            <li><a href="/" className="hover:text-gray-300">Platform</a></li>
            <li><a href="/about" className="hover:text-gray-300">About us</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
            <li>
              <button 
                className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
                onClick={() => window.location.href = '/signin'}>
                Sign In
              </button>
            </li>
            <li>
              <button 
                className="bg-white text-[#DC5F00] py-2 px-4 rounded hover:bg-gray-200 transition-all border-2 border-white hover:text-black" 
                onClick={() => window.location.href = '/signup'}>
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full flex flex-col lg:flex-row justify-between items-center min-h-screen gap-10 max-container bg-gray-100 px-6 lg:px-20">
        {/* Text Section */}
        <div className="lg:w-1/2 flex flex-col justify-center items-start">
          <p className="text-xl font-serif text-[#DC5F00]">
            Secure Shift Vehicle Registration
          </p>
          <h1 className="mt-6 font-bold text-4xl lg:text-6xl max-sm:text-[48px] max-sm:leading-[56px]">
            <span className="relative z-10 pr-10 text-[#373A40]">
              A New Era of Vehicle Registration
            </span>
            <br />
            <span className="text-[#DC5F00] inline-block mt-3">Explore the System</span>
          </h1>
          <p className="text-gray-600 text-lg leading-8 mt-6 mb-10 max-w-md">
            Discover our secure and transparent vehicle registration system,
            powered by blockchain technology.
          </p>

          <button className="bg-[#DC5F00] text-white py-3 px-6 rounded-lg hover:bg-black transition duration-300">
            Register Now
          </button>

          <div className="flex justify-start items-start flex-wrap w-full mt-10 gap-16">
            <div>
              <p className="text-4xl font-bold">100+</p>
              <p className="text-gray-600">Vehicles Registered</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50+</p>
              <p className="text-gray-600">Trusted Partners</p>
            </div>
          </div>
        </div>

        {/* Car Image Section */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center">
          <img
            src={bigCarImg}
            alt="car collection"
            className="object-contain relative z-10 w-full max-w-[600px] h-auto"
          />
          {/* Thumbnail Car Images */}
          <div className="flex justify-center gap-4 mt-4">
            {cars.map((image, index) => (
              <div key={index} className="cursor-pointer" onClick={() => setBigCarImg(image.bigCar)}>
                <img
                  src={image.thumbnail}
                  alt={`car ${index + 1}`}
                  className={`w-16 h-16 object-cover border-2 rounded-lg ${
                    bigCarImg === image.bigCar ? "border-[#DC5F00]" : "border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>  

      {/* Introduction Section */}
      <section className="introduction-section text-center py-10 bg-[#DC5F00]">
        <h2 className="text-3xl font-bold text-white">Introduction</h2>
        <p className="text-white mt-4 max-w-2xl mx-auto">
          Our system integrates blockchain technology to ensure data integrity, reduce fraud, and improve the overall efficiency of the vehicle registration process.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#DC5F00]">Our Key Features</h2>
          <div className="flex justify-center flex-wrap gap-8">
            {/* Feature Card 1 */}
            <div className="flex-1 sm:w-[350px] sm:min-w-[350px] w-full bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex justify-center items-center bg-[#DC5F00] rounded-full">
                <FaCheckCircle className="text-white w-6 h-6" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">Enhanced Trust</h3>
              <p className="mt-3 text-lg text-gray-600">With transparent and secure data management, gain the trust of all stakeholders.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="flex-1 sm:w-[350px] sm:min-w-[350px] w-full bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex justify-center items-center bg-[#DC5F00] rounded-full">
                <FaShieldAlt className="text-white w-6 h-6" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">Reduced Fraud</h3>
              <p className="mt-3 text-lg text-gray-600">Blockchain technology significantly reduces the risk of fraud and data manipulation.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="flex-1 sm:w-[350px] sm:min-w-[350px] w-full bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex justify-center items-center bg-[#DC5F00] rounded-full">
                <FaClock className="text-white w-6 h-6" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">Improved Efficiency</h3>
              <p className="mt-3 text-lg text-gray-600">Automated processes and decentralized validation lead to faster and more reliable registration services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-12">
          {/* Text on the Right */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-5xl font-bold text-[#DC5F00] leading-tight mb-4">
                Let's Work Together
              </h2>
              <p className="text-gray-600 text-lg leading-loose max-w-md">
                Join us in transforming vehicle registration.
                <br />
                Sign up today and experience the benefits of a secure and efficient system!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer bg-[#DC5F00] text-white p-4 text-center">
        <p>© 2024 Secure Shift. All rights reserved.</p>
      </footer>
    </div>
  );
}
