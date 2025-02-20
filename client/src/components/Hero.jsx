import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0">
        <div className="h-full w-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Welcome to Museum AI Assistant
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Your personal guide to explore the fascinating world of art and history. 
              Ask questions, discover stories, and learn about exhibits in an interactive way.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
              onClick={() => document.getElementById('chat-interface').scrollIntoView({ behavior: 'smooth' })}
            >
              Start Chatting
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 