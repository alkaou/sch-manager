import React, { useContext } from "react";
// import { useNavigate } from "react-router";

import { ThemeContext } from "../components/contexts";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import ColorPalette from "../components/ColorPalette.jsx";


const useTheme = () => useContext(ThemeContext);


const createNewDatabase = ({ name }) => {
    // create new database
    // Hide popup
    // Set Loader
    // Navigate to Start page
}


const Navbar = () => {
    const { theme } = useTheme();
    return (
        <nav className={`fixed top-0 left-0 w-full bg-white border-b border-b-2 border-white flex items-center justify-between px-6 py-3 dark:border-white/70
            ${
            theme === "light"
                ? "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
                : "bg-gradient-to-r from-gray-800 via-gray-900 to-black"
            }`
        }>
            {/* Icône de langue à gauche */}
            <LanguageSelector />

            {/* Icône de palette au centre */}
            <ColorPalette />

            {/* Bouton de changement de thème à droite */}
            <ThemeSwitcher />
        </nav>
    );
};


const HomePage = () => {

    return (
        <div className="min-h-screen w-full">
            <Navbar />
        </div>
    );
};

export default HomePage;