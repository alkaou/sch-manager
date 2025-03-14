import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Settings, Palette, ChevronDown, Menu, Edit2, Check, X,
  Layout, FileText, Star, DollarSign, BarChart, Database as DatabaseIcon
} from "lucide-react";

import { useTheme, useLanguage, useFlashNotification } from "./contexts";
import { updateDatabaseNameAndShortName } from "../utils/database_methods";

const SideBar = ({
  setIsOpenPopup,
  isOpenPopup,
  school_name,
  school_short_name,
  setIsShowParameters,
  setisShowBgColorSelector,
  activeSideBarBtn,
  setActiveSideBarBtn,
  db,
  refreshData,
  setLastBtnActivate,
  lastBtnActivate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenController, setIsOpenController] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOptionsNames, setShowOptionsNames] = useState(false);

  const { setFlashMessage } = useFlashNotification();

  // States for edit mode and modifiable values
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchoolName, setEditedSchoolName] = useState(school_name);
  const [editedShortName, setEditedShortName] = useState(school_short_name);
  const [error, setError] = useState("");

  const { theme } = useTheme();
  const { live_language } = useLanguage();
  const navigate = useNavigate();

  const sidebarRef = useRef(null);


  // Update local state when props change
  useEffect(() => {
    setEditedSchoolName(school_name);
    setEditedShortName(school_short_name);

    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Réduire la sidebar si elle était ouverte
        if (isOpen) {
          if (isOpenPopup === false) {
            toggleSidebar();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, [school_name, school_short_name, isOpen, isOpenPopup]);

  const toggleSidebar = () => {
    // Fermer tous les popu
    if (isOpenPopup === true) {
      setIsOpenPopup(false);
      setActiveSideBarBtn(lastBtnActivate);
      setIsSettingsOpen(false);
      setIsShowParameters(false);
      setisShowBgColorSelector(false);
      return;
    };

    // Après
    refreshData();
    setIsEditing(false);
    setEditedSchoolName(school_name);
    setEditedShortName(school_short_name);
    if (isOpenController === true) {
      setIsOpen(false);
      setIsOpenController(false);
      setTimeout(() => {
        setShowOptionsNames(false);
      }, isOpenController ? 100 : 300);
    } else {
      setIsOpen(true);
      setIsOpenController(true);
      setTimeout(() => {
        setShowOptionsNames(true);
      }, isOpenController ? 100 : 300);
    }
    // console.log(isOpen);
  };


  const toggleSettings = () => {
    setActiveSideBarBtn(3);
    setIsSettingsOpen(!isSettingsOpen);
    setIsShowParameters(true);
    setisShowBgColorSelector(false);
    setIsOpenPopup(true);
  };

  const togglePalletteColor = () => {
    setActiveSideBarBtn(9);
    setisShowBgColorSelector(true);
    setIsShowParameters(false);
    setIsOpenPopup(true);
  };

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

  const handleCancelEdit = () => {
    setEditedSchoolName(school_name);
    setEditedShortName(school_short_name);
    setIsEditing(false);
    setError("");
  };

  // Generic navigation method that updates the active button and navigates
  const handleNavigation = (path, btnIndex) => {
    setLastBtnActivate(btnIndex);
    setActiveSideBarBtn(btnIndex);
    navigate(path);
  };

  // Navigation items configuration
  const navigationItems = [
    { icon: <Home size={22} />, label: "Dashboard", path: "/started_page", index: 1 },
    { icon: <Star size={22} />, label: "Compostions", path: "/compositions", index: 5 },
    { icon: <Layout size={22} />, label: "Bulletins", path: "/bulletins", index: 2 },
    { icon: <FileText size={22} />, label: "Listes", path: "/liste_eleves", index: 4 },
    { icon: <DollarSign size={22} />, label: "Finance", path: "/payements", index: 6 },
    { icon: <BarChart size={22} />, label: "Analytics", path: "/statistiques", index: 7 },
    { icon: <DatabaseIcon size={22} />, label: "Database", path: "/database", index: 8 },
  ];

  // Dynamic colors based on theme
  const sidebarBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const activeBg = theme === "dark" ? "bg-blue-900/40" : "bg-blue-100";
  const inputBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const inputBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";

  return (
    <div
      ref={sidebarRef}
    >
      {/* Toggle button with animation */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={24} />
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{
          width: isOpen ? 250 : 80,
          boxShadow: isOpen ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "0 2px 10px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${sidebarBg} ${borderColor} border-r fixed left-0 top-0 h-screen ${textColor} flex flex-col py-6 px-4 z-30`}
      >
        {/* School info section */}
        <div className="mb-8 mt-10">
          {isEditing ? (
            <div className="px-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3"
              >
                <label className="text-xs font-medium mb-1 block opacity-70">School Name</label>
                <input
                  type="text"
                  value={editedSchoolName}
                  onChange={(e) => setEditedSchoolName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md ${inputBg} ${inputBorder} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="mb-3"
              >
                <label className="text-xs font-medium mb-1 block opacity-70">Short Name</label>
                <input
                  type="text"
                  value={editedShortName}
                  onChange={(e) => setEditedShortName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md ${inputBg} ${inputBorder} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                className="flex space-x-2 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              >
                <button
                  onClick={handleEditSchoolInfo}
                  className="flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex-1 transition-colors"
                >
                  <Check size={16} className="mr-1" /> Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex-1 transition-colors"
                >
                  <X size={16} className="mr-1" /> Cancel
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-2">
              <motion.div
                layout
                className="relative w-full text-center"
              >
                <motion.h2
                  layout
                  className="font-bold truncate"
                  style={{
                    fontSize: isOpen ? "1.25rem" : "1.5rem",
                    letterSpacing: isOpen ? "normal" : "0.05em"
                  }}
                >
                  {isOpen ? editedSchoolName : editedSchoolName.charAt(0)}
                </motion.h2>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center justify-center mt-1"
                    >
                      <span className="text-sm opacity-75">({editedShortName})</span>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: theme === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(219, 234, 254, 1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEditToggle}
                        className="ml-2 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit2 size={14} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>

        {/* Navigation section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1">
          <nav className="space-y-1.5">
            {navigationItems.map((item) => (
              <motion.button
                key={item.index}
                title={item.label}
                onClick={() => handleNavigation(item.path, item.index)}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 transition-all duration-200
                  ${activeSideBarBtn === item.index ? activeBg : hoverBg}
                  ${activeSideBarBtn === item.index ? 'font-medium' : 'font-normal'}
                `}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`${activeSideBarBtn === item.index ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {item.icon}
                </span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={toggleSettings}
            className={`w-full flex items-center rounded-lg px-3 py-2.5 transition-all duration-200
              ${activeSideBarBtn === 3 ? activeBg : hoverBg}
              ${activeSideBarBtn === 3 ? 'font-medium' : 'font-normal'}
            `}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`${activeSideBarBtn === 3 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              <Settings size={22} />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={togglePalletteColor}
            className={`w-full flex items-center rounded-lg px-3 py-2.5 mt-1 transition-all duration-200
              ${activeSideBarBtn === 9 ? activeBg : hoverBg}
              ${activeSideBarBtn === 9 ? 'font-medium' : 'font-normal'}
            `}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`${activeSideBarBtn === 9 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              <Palette size={22} />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </div>
  );
};

export default SideBar;