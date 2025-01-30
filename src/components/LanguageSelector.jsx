import React, { useState } from "react";
// import { FaGlobe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import maliIcon from "../assets/images/mali.png";
import franceIcon from "../assets/images/france.png";
import angletterIcon from "../assets/images/angletter.png";

const LanguageSelector = () => {
    const [language, setLanguage] = useState("Français");
    const [showPanel, setShowPanel] = useState(false);
    const Languages = ["Français", "Bambara", "Anglais"]

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setShowPanel(false)
        // localStorage.setItem("preferredLanguage", lang); // Sauvegarde la langue choisie
    };

    const showLangPanel = () => {
        setShowPanel(!showPanel)
    }

    return (
        <div className="relative">
            <button onClick={showLangPanel} className="text-gray-700 dark:text-white flex items-center">
                {/* <FaGlobe className="text-2xl" /> */}
                <img
                    src={language === Languages[0] ? franceIcon : language === Languages[1] ? maliIcon : angletterIcon}
                    className="w-7 h-7 rounded-full transition-all duration-300 hover:w-8 hover:h-8"
                    alt="Lang"
                />
            </button>
            {/* Dropdown */}
            <AnimatePresence>
                {showPanel && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-md rounded-md"
                    >
                        {Languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => changeLanguage(lang)}
                                className={`block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 
                        ${language === lang ? "font-bold text-blue-600" : ""}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
