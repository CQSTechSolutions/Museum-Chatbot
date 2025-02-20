import React from 'react';

const MenuButton = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full p-4 mb-2 text-left bg-white hover:bg-gray-50 rounded-lg shadow transition-all duration-200 hover:translate-x-1"
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="text-blue-900 font-medium">{text}</span>
      <span className="ml-auto text-gray-400">›</span>
    </button>
  );
};

export default MenuButton; 