import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Palette, ChevronDown, Menu, Edit2, Check } from "lucide-react";

import { useTheme, useLanguage, useFlashNotification } from "./contexts";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { gradients } from "../utils/colors";
import { updateDatabaseNameAndShortName } from "../utils/database_methods";

const SideBar = ({ setIsOpenPopup, school_name, school_short_name, text_color, setIsShowParameters, setisShowBgColorSelector, activeSideBarBtn, setActiveSideBarBtn, db, refreshData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showOptionsNames, setShowOptionsNames] = useState(false);

    const { setFlashMessage } = useFlashNotification();

    // Etats pour le mode édition et les valeurs modifiables
    const [isEditing, setIsEditing] = useState(false);
    const [editedSchoolName, setEditedSchoolName] = useState(school_name);
    const [editedShortName, setEditedShortName] = useState(school_short_name); // Vous pouvez initialiser selon vos besoins
    const [error, setError] = useState(""); // Vous pouvez initialiser selon vos besoins

    const { app_bg_color } = useTheme();
    const { live_language } = useLanguage();

    const toggleSidebar = () => {
        // console.log(school_name);
        refreshData();
        setIsEditing(false);
        setEditedSchoolName(school_name);
        setEditedShortName(school_short_name);
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

    // Méthode pour basculer le mode édition
    const handleEditSchoolInfo = () => {
        updateDatabaseNameAndShortName(
            editedSchoolName,
            editedShortName,
            setError,
            setFlashMessage,
            live_language,
            setIsEditing,
            db
        );
    };

    const handleEditToggle = () => {
        refreshData();
        setIsEditing(!isEditing);
    };

    const side_bar_text_color = app_bg_color === gradients[2] ? "text-gray-600" : text_color;

    return (
        <div className="flex fixed z-30">
            {/* Bouton pour ouvrir/fermer */}
            <button onClick={toggleSidebar} className="fixed top-4 left-4 z-30 p-2 bg-blue-500 text-white rounded-lg shadow-lg">
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isOpen ? 250 : 80 }}
                className={`border-r-2 fixed left-0 top-0 h-screen ${app_bg_color} ${side_bar_text_color} shadow-lg flex flex-col p-4 transition-all duration-300`}
            >
                {/* Logo */}
                <motion.div
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    className="ml-10 mb-6 mt-1 text-center text-xl font-bold"
                >
                    {showOptionsNames ? editedSchoolName : editedSchoolName[0]}
                    <motion.div
                        animate={{ opacity: isOpen ? 1 : 0 }}
                        className="text-center text-xl font-bold flex items-center justify-center"
                    >
                        {showOptionsNames ? `(${editedShortName})` : ""}
                        {showOptionsNames && (
                            <div className="ml-2 text-center items-center justify-center rounded-full h-8 w-8 border border-gray-300 hover:bg-green-200">
                                <Edit2
                                    size={20}
                                    className={`cursor-pointer ml-1 pb-1 mt-2 text-center items-center justify-center ${side_bar_text_color}`}
                                    onClick={handleEditToggle}
                                />
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Zone d'édition animée */}
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 text-center text-sm"
                    >
                        <p style={{color: "red"}}>{error}</p>

                        <input
                            style={{fontWeight: "bold"}}
                            type="text"
                            value={editedSchoolName}
                            onChange={(e) => setEditedSchoolName(e.target.value)}
                            placeholder="EX : Compexe-Scolaire-Dembele"
                            className="w-full bg-gray-100 text-gray-500 p-1 text-sm border rounded mb-1"
                        />
                        <input
                            style={{fontWeight: "bold"}}
                            type="text"
                            value={editedShortName}
                            onChange={(e) => setEditedShortName(e.target.value)}
                            placeholder="EX : CSAD"
                            className="w-full bg-gray-100 text-gray-500 p-1 text-sm border rounded"
                        />
                        {/* Bouton d'icône de validation pour les inputs */}
                        <button onClick={handleEditSchoolInfo} className="mt-2 p-1 bg-green-500 text-white rounded">
                            <Check size={18} />
                        </button>
                    </motion.div>
                )}

                {/* Menu principal */}
                <nav className="flex flex-col space-y-4">
                    <SidebarItem
                        icon={<Home size={24} />}
                        text={showOptionsNames ? live_language.dashboard_text : ""}
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
                            {showOptionsNames && <span className={`ml-4 flex-1 hover:text-white ${side_bar_text_color}`}>{live_language.setting_text}</span>}
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
