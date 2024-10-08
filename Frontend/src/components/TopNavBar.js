import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

export default function TopNavBar({ toggleNav }) {
  const navigate = useNavigate();  // Initialize navigate

  // Function to navigate to the LandingPage
  const goToHomePage = () => {
    navigate('/landingpage');  // Change this to your exact landing page route
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#686D76]  shadow-md">
      <div className="flex items-center space-x-4">
        {/* Secure Chain Logo */}
        <div className="navbar-logo text-sm font-serif text-[#EEEEEE]">Secure Chain</div>
      </div>

      {/* Right-hand side elements */}
      <div className="flex items-center space-x-4 text-[#EEEEEE]">
        {/* Home button with route */}
        <span className="cursor-pointer" onClick={goToHomePage}>Home</span> {/* Add onClick to navigate to landing page */}
      </div>
    </div>
  );
}
