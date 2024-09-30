// src/components/TopNavBar.js
import React from 'react';

export default function TopNavBar({ toggleNav }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-[#EADFB4] bg-opacity-80 shadow-md">
      <div className="flex items-center space-x-4">
       

        {/* Secure Chain Logo */}
        <div className="navbar-logo text-sm font-serif text-[#373A40]">Secure Chain</div>
      </div>

      {/* Right-hand side elements */}
      <div className="flex items-center space-x-4 text-[#373A40]">
        <span>Platform</span>
        <span>About us</span>
        <span>Contact</span>
      </div>
    </div>
  );
}
