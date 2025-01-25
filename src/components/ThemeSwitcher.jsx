import React, { useContext } from "react";

import { ThemeContext } from "./contexts";

const useTheme = () => useContext(ThemeContext);

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed top-4 right-4 px-4 py-2 rounded-full shadow-lg transition-all ${
        theme === "light" ? "bg-blue-600 text-white" : "bg-yellow-500 text-gray-800"
      }`}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </motion.button>
  );
};

export default ThemeSwitcher;