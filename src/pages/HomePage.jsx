import React, { useContext } from "react";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router";

import { ThemeContext } from "../components/contexts";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";


const useTheme = () => useContext(ThemeContext);


const HomePage = () => {
  // const navigate = useNavigate();
  // const { theme } = useTheme();
  const theme = "light";

  return (
    <div className="flex flex-col items-center justify-center">
      {/*<ThemeSwitcher />*/}

      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={`text-4xl font-bold mb-8 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Bienvenue à SchoolManager
      </motion.h1>

      {/* Create Database Button */}
      <motion.button
        // onClick={() => navigate("/started")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Créer une base de données
      </motion.button>

      {/* Illustration */}
      <motion.img
        src="https://via.placeholder.com/400x300"
        alt="Illustration"
        initial={{ opacity : 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mt-12 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default HomePage;