import React from "react";
import Hero from "../components/Hero";
import ChatInterface from "../components/ChatInterface";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-white">Interactive Learning</h3>
            <p className="text-gray-400">Engage in meaningful conversations about art and history with our AI-powered guide</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-white">24/7 Assistance</h3>
            <p className="text-gray-400">Get instant answers to your questions about exhibits and artifacts anytime</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-semibold mb-3 text-white">Personalized Experience</h3>
            <p className="text-gray-400">Receive tailored recommendations and insights based on your interests</p>
          </div>
        </div>
      </div>
      <ChatInterface />
    </div>
  );
};

export default Home;
