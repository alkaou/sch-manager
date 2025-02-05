import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

// import { useNavigate } from "react-router";

import { ThemeContext, LanguageContext } from "../components/contexts";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import ColorPalette from "../components/ColorPalette.jsx";
import Popup from "../components/Popup.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import { checkThemeForBgColor } from "../utils/colors.js";
import DatabaseCreator from "../components/DatabaseCreator.jsx";

import { Translator } from "../utils/Translator.js";

const useTheme = () => useContext(ThemeContext);
const useLanguage = () => useContext(LanguageContext);


const Navbar = ({ showLangPanel, showPanel, setShowPanel, onHover, setOnHover, OpenThePopup }) => {
    const { theme } = useTheme();

    const bg_colors = checkThemeForBgColor();

    const hide_all_panel = () => {
        if (onHover === false) {
            setShowPanel(false);
        }
    }
    return (
        <nav onClick={hide_all_panel} className={`fixed top-0 left-0 w-full bg-white border-b border-b-2 border-white flex items-center justify-between px-6 py-3 dark:border-white/70
            ${bg_colors[theme]}`
        }>
            {/* Icône de langue à gauche */}
            <LanguageSelector
                showLangPanel={showLangPanel}
                showPanel={showPanel}
                setShowPanel={setShowPanel}
                setOnHover={setOnHover}
            />

            {/* Icône de palette au centre */}
            <ColorPalette
                OpenThePopup={OpenThePopup}
                theme={theme}
            />

            {/* Bouton de changement de thème à droite */}
            <ThemeSwitcher />
        </nav>
    );
};


const HomePage = () => {
    const [showPanel, setShowPanel] = useState(false);
    const [onHover, setOnHover] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState("DB_CREATOR"); // On doit passer par defaut le bool : false

    const { language } = useLanguage();

    const showLangPanel = () => setShowPanel(!showPanel);

    const OpenThePopup = () => {
        // console.log(isOpenPopup);
        const popup_bool = isOpenPopup === true ? false : isOpenPopup === false ? true : false;
        setIsOpenPopup(popup_bool);
    };

    return (
        <div>
            <Navbar
                showLangPanel={showLangPanel}
                showPanel={showPanel}
                setShowPanel={setShowPanel}
                onHover={onHover}
                setOnHover={setOnHover}
                OpenThePopup={OpenThePopup}
            />

            <div className="grid place-items-center min-h-screen p-4 text-white">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Titre principal avec effet de gradient lumineux */}
                    <motion.p
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-300 drop-shadow-lg"
                        style={{
                            WebkitTextStroke: "1px white", // Contour blanc pour le contraste
                            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" // Ombre douce
                        }}
                        initial={{ backgroundPosition: "0% 50%" }}
                        animate={{ backgroundPosition: "100% 50%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        SCHOOL-MANAGER
                    </motion.p>


                    {/* Sous-titre avec effet de fondu */}
                    <motion.p
                        className="text-lg mt-10 font-bold text-white text-center"
                        style={{
                            textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)"
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            duration: 1.5,
                            delay: 0.5,
                            ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.05, textShadow: "0 0 15px rgba(255, 255, 255, 1)" }}
                    >
                        {Translator[language].welcome_text}
                    </motion.p>

                    <div className="mt-10 flex flex-col items-center space-y-4">
                        <p className="text-2xl italic font-extrabold tracking-wider">
                            {Translator[language].create_db_text}
                        </p>
                        {/* https://codepen.io/yuhomyan/pen/OJMejWJ */}
                        <button
                            className="custom-btn btn-7"
                            onClick={() => {
                                setIsOpenPopup("DB_CREATOR");
                            }}
                        >
                            <span>{Translator[language].create_btn_text}</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            <Popup
                isOpenPopup={isOpenPopup}
                setIsOpenPopup={setIsOpenPopup}
                children={
                    isOpenPopup === "DB_CREATOR" ? <DatabaseCreator /> : <ColorsSelector OpenThePopup={OpenThePopup} />
                }
            />
        </div>
    );
};

export default HomePage;
