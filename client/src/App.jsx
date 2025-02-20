import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <Navbar />
          <Home />
        </div>
  } />
    </Routes>
  );
};

export default App;
