import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";

import { ThemeContext } from "../components/contexts";


const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`min-h-screen flex flex-col transition-all duration-500 ${
          theme === "light"
            ? "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
            : "bg-gradient-to-r from-gray-800 via-gray-900 to-black"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const RoutesManager = () => {
  return (
    // <HomePage></HomePage>
    <ThemeProvider>
      <div style={{background:"#000"}}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/started" element={<StartedPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default RoutesManager;