import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onBookNowClick }) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Museum</span>
            <span className="text-2xl font-bold text-white">AI</span>
          </Link>
          <button
            onClick={onBookNowClick}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg flex items-center space-x-2"
          >
            <span>Book Now</span>
            <span className="text-xl">🎟️</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
