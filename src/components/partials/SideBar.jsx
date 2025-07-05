import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  Palette,
  Menu,
  Edit2,
  Check,
  X,
  Layout,
  FileText,
  Star,
  DollarSign,
  BarChart,
  Database as DatabaseIcon,
  LucideBookOpenText,
  ArrowBigLeft,
  Users2Icon,
  Receipt,
} from "lucide-react";

import { useTheme, useLanguage, useFlashNotification } from "../contexts";
import { translate } from "./partials_translator.js";
import { updateDatabaseNameAndShortName } from "../../utils/database_methods";

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
  lastBtnActivate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenController, setIsOpenController] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { setFlashMessage } = useFlashNotification();

  // States for edit mode and modifiable values
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchoolName, setEditedSchoolName] = useState(school_name);
  const [editedShortName, setEditedShortName] = useState(school_short_name);
  const [error, setError] = useState("");

  const { theme } = useTheme();
  const { live_language, language } = useLanguage();
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
    }

    // Après
    refreshData();
    setIsEditing(false);
    setEditedSchoolName(school_name);
    setEditedShortName(school_short_name);
    if (isOpenController === true) {
      setIsOpen(false);
      setIsOpenController(false);
      setTimeout(() => {}, isOpenController ? 100 : 300);
    } else {
      setIsOpen(true);
      setIsOpenController(true);
      setTimeout(() => {}, isOpenController ? 100 : 300);
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
    {
      icon: <Home size={20} />,
      label: translate("dashboard_texte", language),
      path: "/started_page",
      index: 1,
    },
    {
      icon: <Users2Icon size={20} />,
      label: translate("employes_texte", language),
      path: "/employes",
      index: 11,
    },
    {
      icon: <Star size={20} />,
      label: translate("compositions_texte", language),
      path: "/compositions",
      index: 5,
    },
    {
      icon: <Layout size={20} />,
      label: translate("bulletins_texte", language),
      path: "/bulletins",
      index: 2,
    },
    {
      icon: <FileText size={20} />,
      label: translate("listes_texte", language),
      path: "/liste_eleves",
      index: 4,
    },
    {
      icon: <DollarSign size={20} />,
      label: translate("finance_texte", language),
      path: "/payements",
      index: 6,
    },
    {
      icon: <Receipt size={20} />,
      label: translate("depenses_texte", language),
      path: "/depenses",
      index: 12,
    },
    {
      icon: <BarChart size={20} />,
      label: translate("analytics_texte", language),
      path: "/statistiques",
      index: 7,
    },
    {
      icon: <DatabaseIcon size={20} />,
      label: translate("database_texte", language),
      path: "/database",
      index: 8,
    },
    {
      icon: <LucideBookOpenText size={20} />,
      label: translate("read_texte", language),
      path: "/read",
      index: 10,
    },
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
    <div ref={sidebarRef}>
      {/* Toggle button with animation */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed items-center justify-center top-2 sm:top-3 left-2 sm:left-3 z-40 p-1 sm:p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 50 }}
        animate={{
          width: isOpen ? 180 : 50,
          boxShadow: isOpen
            ? "0 4px 20px rgba(0, 0, 0, 0.1)"
            : "0 2px 10px rgba(0, 0, 0, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${sidebarBg} ${borderColor} border-r border-r-2 border-r-gray-300 fixed left-0 top-0 h-screen ${textColor} flex flex-col py-3 sm:py-4 px-1.5 sm:px-2 z-30`}
      >
        {/* School info section */}
        <div className="mb-4 mt-6 sm:mt-7 md:mt-8">
          {isEditing ? (
            <div className="px-1.5">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <label className="text-[10px] sm:text-xs font-medium mb-0.5 block opacity-70">
                  {translate("school_name_texte", language)}
                </label>
                <input
                  type="text"
                  value={editedSchoolName}
                  onChange={(e) => setEditedSchoolName(e.target.value)}
                  className={`w-full px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-xs ${inputBg} ${inputBorder} border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="mb-2"
              >
                <label className="text-[10px] sm:text-xs font-medium mb-0.5 block opacity-70">
                  {translate("short_name_texte", language)}
                </label>
                <input
                  type="text"
                  value={editedShortName}
                  onChange={(e) => setEditedShortName(e.target.value)}
                  className={`w-full px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-xs ${inputBg} ${inputBorder} border focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-[10px] mt-0.5"
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                className="flex space-x-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              >
                <button
                  onClick={handleEditSchoolInfo}
                  className="flex items-center justify-center p-1 sm:p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md flex-1 transition-colors text-[10px] sm:text-xs"
                >
                  <Check size={10} className="mr-0.5 sm:w-3 sm:h-3" />{" "}
                  {translate("save_texte", language)}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center p-1 sm:p-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex-1 transition-colors text-[10px] sm:text-xs"
                >
                  <X size={10} className="mr-0.5 sm:w-3 sm:h-3" />{" "}
                  {translate("cancel_texte", language)}
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-1.5">
              <motion.div layout className="relative w-full text-center">
                <motion.h2
                  layout
                  className="font-bold truncate"
                  style={{
                    fontSize: isOpen ? "0.85rem" : "1rem",
                    letterSpacing: isOpen ? "normal" : "0.05em",
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
                      className="flex items-center justify-center mt-0.5"
                    >
                      <span className="text-[10px] sm:text-xs opacity-75">
                        ({editedShortName})
                      </span>
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          ArrowBigLeftgroundColor:
                            theme === "dark"
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(219, 234, 254, 1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEditToggle}
                        className="ml-1 sm:ml-1.5 p-0.5 sm:p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit2 size={10} className="sm:w-3 sm:h-3" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>

        {/* Navigation section */}
        <div className="flex-1 overflow-y-auto scrollbar-custom scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-0.5">
          <nav className="space-y-0.5">
            {navigationItems.map((item) => (
              <motion.button
                key={item.index}
                title={item.label}
                onClick={() => handleNavigation(item.path, item.index)}
                className={`w-full flex items-center rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 transition-all duration-200
                  ${activeSideBarBtn === item.index ? activeBg : hoverBg}
                  ${
                    activeSideBarBtn === item.index
                      ? "font-medium"
                      : "font-normal"
                  }
                `}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`${
                    activeSideBarBtn === item.index
                      ? "text-blue-600 dark:text-blue-400"
                      : ""
                  } flex-shrink-0`}
                >
                  {React.cloneElement(item.icon, {
                    className: "w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5",
                  })}
                </span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-2 whitespace-nowrap overflow-hidden text-[11px] sm:text-xs"
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
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={() => navigate("/")}
            className={`w-full flex items-center rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 transition-all duration-200
              ${activeSideBarBtn === 20 ? activeBg : hoverBg}
              ${activeSideBarBtn === 20 ? "font-medium" : "font-normal"}
            `}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            title={translate("accueil_texte", language)}
          >
            <span
              className={`${
                activeSideBarBtn === 20
                  ? "text-blue-600 dark:text-blue-400"
                  : ""
              } flex-shrink-0`}
            >
              <ArrowBigLeft
                size={20}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5"
              />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 whitespace-nowrap overflow-hidden text-[11px] sm:text-xs"
                >
                  {translate("accueil_texte", language)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={toggleSettings}
            className={`w-full flex items-center rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 transition-all duration-200
              ${activeSideBarBtn === 3 ? activeBg : hoverBg}
              ${activeSideBarBtn === 3 ? "font-medium" : "font-normal"}
            `}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            title={translate("settings_texte", language)}
          >
            <span
              className={`${
                activeSideBarBtn === 3 ? "text-blue-600 dark:text-blue-400" : ""
              } flex-shrink-0`}
            >
              <Settings
                size={20}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5"
              />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 whitespace-nowrap overflow-hidden text-[11px] sm:text-xs"
                >
                  {translate("settings_texte", language)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={togglePalletteColor}
            className={`w-full flex items-center rounded-md px-1.5 sm:px-2 py-1.5 sm:py-2 mt-0.5 transition-all duration-200
              ${activeSideBarBtn === 9 ? activeBg : hoverBg}
              ${activeSideBarBtn === 9 ? "font-medium" : "font-normal"}
            `}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            title={translate("theme_texte", language)}
          >
            <span
              className={`${
                activeSideBarBtn === 9 ? "text-blue-600 dark:text-blue-400" : ""
              } flex-shrink-0`}
            >
              <Palette
                size={20}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5"
              />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 whitespace-nowrap overflow-hidden text-[11px] sm:text-xs"
                >
                  {translate("theme_texte", language)}
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
