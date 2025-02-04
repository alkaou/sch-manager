import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router";

import { ThemeContext } from "../components/contexts";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import ColorPalette from "../components/ColorPalette.jsx";
import Popup from "../components/Popup.jsx";
import ColorsSelector from "../components/ColorsSelector.jsx";
import { checkThemeForBgColor } from "../utils/colors.js";

const useTheme = () => useContext(ThemeContext);


const createNewDatabase = ({ name }) => {
    // create new database
    // Hide popup
    // Set Loader
    // Navigate to Start page
}


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

    const [isOpenPopup, setIsOpenPopup] = useState(false);

    const showLangPanel = () => {
        setShowPanel(!showPanel);
        // setOnHover(false)
    }

    const OpenThePopup = () => {
        setIsOpenPopup(!isOpenPopup);
        // setOnHover(false)
    }

    const bodyIsClicked = () => {
        setShowPanel(false);
        setOnHover(false)
    }

    return (
        <div className="min-h-screen w-full">
            <Navbar
                showLangPanel={showLangPanel}
                showPanel={showPanel}
                setShowPanel={setShowPanel}
                onHover={onHover}
                setOnHover={setOnHover}
                OpenThePopup={OpenThePopup}
            />
            <section className="min-h-screen w-full" onClick={bodyIsClicked}>
                <Popup
                    isOpenPopup={isOpenPopup}
                    setIsOpenPopup={setIsOpenPopup}
                    children={<ColorsSelector
                        OpenThePopup={OpenThePopup}
                    />}
                />
            </section>
        </div>
    );
};

export default HomePage;