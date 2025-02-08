import React, { useEffect } from "react";
// import { FaGlobe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import secureLocalStorage from "react-secure-storage";

import maliIcon from "../assets/images/mali.png";
import franceIcon from "../assets/images/france.png";
import angletterIcon from "../assets/images/angletter.png";

import { useLanguage, useTheme } from "./contexts";
import { checkThemeForBgColor } from "../utils/colors";


const LanguageSelector = ({ showLangPanel, showPanel, setShowPanel, setOnHover }) => {
    // const [language, setLanguage] = useState("Français");
    const Languages = ["Français", "Bambara", "Anglais"];

    const { theme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const bg_colors = checkThemeForBgColor();

    useEffect(() => {
        let applanguage = secureLocalStorage.getItem("language");
        if (applanguage !== undefined && applanguage !== null) {
            setLanguage(applanguage);
            // console.log(applanguage);
        }
    }, [language]);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setShowPanel(false)
        secureLocalStorage.setItem("language", lang);
        // localStorage.setItem("preferredLanguage", lang); // Sauvegarde la langue choisie
    };

    return (
        <div className="relative">
            <button onClick={showLangPanel} className="text-gray-700 dark:text-white flex items-center">
                {/* <FaGlobe className="text-2xl" /> */}
                <img
                    src={language === Languages[0] ? franceIcon : language === Languages[1] ? maliIcon : angletterIcon}
                    className="w-8 h-8 hover:border-2 border-white rounded-full transition-all hover:scale-110"
                    alt="Lang"
                    onMouseMove={() => { setOnHover(true) }}
                    onMouseOut={() => { setOnHover(false) }}
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
                        className={`absolute left-0 mt-2 w-32 ${bg_colors[theme]} text-white dark:bg-gray-800 shadow-md rounded-md`}
                    >
                        {Languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => changeLanguage(lang)}
                                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 dark:hover:bg-blue-700 
                        ${language === lang ? "font-bold bg-white text-blue-600" : ""}`}
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
