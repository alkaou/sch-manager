import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, ChevronDown, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

import { useTheme } from "./contexts";

const SideBar = ({ school_name, text_color }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showOptionsNames, setShowOptionsNames] = useState(false);

    const { app_bg_color } = useTheme();


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setShowOptionsNames(!isOpen);
        }, 500);
    };
    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    return (
        <div className="flex">
            {/* Bouton pour ouvrir/fermer */}
            <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg">
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isOpen ? 250 : 80 }}
                className={`fixed left-0 top-0 h-screen ${app_bg_color} ${text_color} shadow-lg flex flex-col p-4 transition-all duration-300`}
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
                    <SidebarItem icon={<Home size={24} />} text={showOptionsNames ? "Dashboard" : ""} isOpen={isOpen} to="/" />
                    <SidebarItem icon={<User size={24} />} text={showOptionsNames ? "Profile" : ""} isOpen={isOpen} to="/profile" />

                    {/* Sous-menu paramètre */}
                    <div>
                        <button
                            onClick={toggleSettings}
                            className="flex items-center w-full text-left p-2 rounded-lg hover:text-white hover:bg-gray-800 transition"
                        >
                            <Settings size={24} />
                            {showOptionsNames && <span className={`ml-4 flex-1 hover:text-white ${text_color}`}>Settings</span>}
                            <ChevronDown size={18} className={`transition-transform ${isSettingsOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    <SidebarItem icon={<LogOut size={24} />} text={showOptionsNames ? "Logout" : ""} isOpen={isOpen} to="/logout" />
                </nav>
            </motion.aside>
        </div>
    );
};

const SidebarItem = ({ icon, text, isOpen, to }) => (
    <Link
        to={to}
        className="flex items-center p-2 rounded-lg hover:text-white hover:bg-gray-800 transition-all"
    >
        {icon}
        {isOpen && <span className="ml-4">{text}</span>}
    </Link>
);

export default SideBar;
