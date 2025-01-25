import React, { useContext } from "react";

import { ThemeContext } from "../components/contexts";

const useTheme = () => useContext(ThemeContext);

const StartedPage = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-900 text-white"
      }`}
    >
      <h1 className="text-2xl font-bold">Page de démarrage</h1>
    </div>
  );
};


export default StartedPage;