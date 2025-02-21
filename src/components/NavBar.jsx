import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Filter, List, Search, RefreshCw } from "lucide-react";

import { useTheme, useLanguage } from "./contexts";
import { gradients } from "../utils/colors";

const Navbar = ({ isFilterOpen, setIsFilterOpen, isClassesOpen, setIsClassesOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const { app_bg_color, text_color } = useTheme();
    const { live_language } = useLanguage();

    // Ouvrir/fermer le dropdown du filtre
    const toggleFilter = () => {
        setIsFilterOpen((prev) => !prev);
        if (isClassesOpen) setIsClassesOpen(false);
    };

    // Ouvrir/fermer le dropdown des classes
    const toggleClasses = () => {
        setIsClassesOpen((prev) => !prev);
        if (isFilterOpen) setIsFilterOpen(false);
    };

    // Fonction pour rafraîchir la page
    const refreshPage = () => {
        window.location.reload();
    };

    const input_color = app_bg_color === gradients[1] ? "text-white" : text_color;

    return (
        <nav
            className={`fixed top-0 left-[80px] border-b-2 ${app_bg_color} ${text_color} p-4 flex items-center justify-center space-x-6 shadow-md z-30`}
            style={{ width: "calc(100% - 80px)" }}
        >
            {/* Option 1 : Ajouter (Add) */}
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400 transition">
                <PlusCircle size={24} />
                <span>{live_language.add_new_text}</span>
            </button>

            {/* Option 2 : Filter avec dropdown */}
            <div className="relative">
                <button
                    onClick={toggleFilter}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400 transition"
                >
                    <Filter size={24} />
                    <span>{live_language.filter_text}</span>
                </button>
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg z-10"
                        >
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Par Classe</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">A à Z</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Date d'inscription</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Option 3 : Classes avec dropdown */}
            <div className="relative">
                <button
                    onClick={toggleClasses}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400 transition"
                >
                    <List size={24} />
                    <span>{live_language.calsse_text}</span>
                </button>
                <AnimatePresence>
                    {isClassesOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg z-10"
                        >
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    {live_language.all_text}
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">1ère année</li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">2ème année</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Option 4 : Bouton Refresh */}
            <button
                onClick={refreshPage}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 hover:text-blue-400 transition"
            >
                <RefreshCw size={24} />
                <span>{live_language.refresh_text}</span>
            </button>

            {/* Option 5 : Champ de recherche en direct */}
            <div className="relative flex items-center">
                <Search size={20} className="absolute left-3 text-gray-500" />
                <input
                    type="text"
                    placeholder={live_language.recherche_text}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-full bg-gray-700 ${input_color} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                />
            </div>
        </nav>
    );
};

export default Navbar;
