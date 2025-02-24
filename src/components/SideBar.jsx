import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Palette, ChevronDown, Menu } from "lucide-react";

import { useTheme, useLanguage } from "./contexts";
import ThemeSwitcher from "./ThemeSwitcher.jsx";

const SideBar = ({ setIsOpenPopup, school_name, text_color, setIsShowParameters, setisShowBgColorSelector, activeSideBarBtn, setActiveSideBarBtn }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showOptionsNames, setShowOptionsNames] = useState(false);

    const { app_bg_color } = useTheme();
    const { live_language } = useLanguage();


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setShowOptionsNames(!isOpen);
        }, 500);
    };
    const toggleSettings = () => {
        setActiveSideBarBtn(3);
        setIsSettingsOpen(!isSettingsOpen);
        setIsShowParameters(true);
        setisShowBgColorSelector(false);
        setIsOpenPopup(true);
    };


    return (
        <div className="flex fixed z-30">
            {/* Bouton pour ouvrir/fermer */}
            <button onClick={toggleSidebar} className="fixed top-4 left-4 z-30 p-2 bg-blue-500 text-white rounded-lg shadow-lg">
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isOpen ? 250 : 80 }}
                className={`border-r-2 fixed left-0 top-0 h-screen ${app_bg_color} ${text_color} shadow-lg flex flex-col p-4 transition-all duration-300`}
            >
                {/* Logo */}
                <motion.div
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    className="ml-10 mb-6 mt-1 text-center text-xl font-bold"
                >
                    {showOptionsNames ? school_name : school_name[0]}
                </motion.div>

                {/* Menu principal */}
                <nav className="flex flex-col space-y-4">
                    <SidebarItem
                        icon={<Home size={24} />}
                        text={showOptionsNames ? "Dashboard" : ""}
                        isOpen={isOpen}
                        onClick={() => {
                            setActiveSideBarBtn(1);
                        }}
                        active_class={activeSideBarBtn === 1 ? "text-white bg-gray-800" : ""}
                    />

                    <SidebarItem
                        icon={<Palette size={24} />}
                        text={showOptionsNames ? live_language.color_text : ""}
                        isOpen={isOpen}
                        onClick={() => {
                            setIsShowParameters(false);
                            setisShowBgColorSelector(true);
                            setIsOpenPopup(true);
                            setActiveSideBarBtn(2);
                        }}
                        active_class={activeSideBarBtn === 2 ? "text-white bg-gray-800" : ""}
                    />

                    {/* Theme Switcher */}
                    <div className={`${showOptionsNames ? "flex" : ""} items-center p-2 rounded-lg hover:text-white hover:bg-gray-800 transition-all`}>
                        <ThemeSwitcher />
                        {showOptionsNames && <span className="ml-1">{live_language.theme_text}</span>}
                    </div>

                    {/* Sous-menu paramètre */}
                    <div>
                        <button
                            onClick={toggleSettings}
                            className={`flex items-center w-full text-left p-2 rounded-lg ${activeSideBarBtn === 3 ? "text-white bg-gray-800" : ""} hover:text-white hover:bg-gray-800 transition`}
                        >
                            <Settings size={24} />
                            {showOptionsNames && <span className={`ml-4 flex-1 hover:text-white ${text_color}`}>Settings</span>}
                            <ChevronDown size={18} className={`transition-transform hover:text-white ${isSettingsOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                </nav>
            </motion.aside>
        </div>
    );
};

const SidebarItem = ({ icon, text, isOpen, onClick, active_class }) => (
    <button
        onClick={onClick}
        className={`flex ${active_class} items-center p-2 rounded-lg hover:text-white hover:bg-gray-800 transition-all`}
    >
        {icon}
        {isOpen && <span className="ml-4">{text}</span>}
    </button>
);

export default SideBar;
