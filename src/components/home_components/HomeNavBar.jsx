import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Sun,
  LogIn,
  User,
  Settings,
  ChevronDown,
  LogOut,
  HelpCircle,
  Crown,
  Info,
} from "lucide-react";
import LanguageSelector from "../partials/LanguageSelector.jsx";
import { useTheme, useLanguage } from "../contexts";
import { useAuth } from "../../auth/AuthContext";
import LoginModal from "../../auth/LoginModal.jsx";
import PremiumModal from "../../auth/PremiumModal.jsx";
import NotificationBadge from "../informations/NotificationBadge.jsx";

// En haut de votre fichier React
import { LogoSVG } from "../partials/Logo.svg.jsx";

const HomeNavBar = ({ setIsOpenPopup, data_exist, setShowInformationPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme, app_bg_color, text_color } = useTheme();
  const { live_language, language } = useLanguage();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showPanel, setShowPanel] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const showLangPanel = () => setShowPanel(!showPanel);

  // Detect scrolling to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
      if (showPanel && !event.target.closest(".language-dropdown")) {
        setShowPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, showPanel]);

  // Naviguer vers le profile
  const navigate_to_profile = () => {
    const path = data_exist ? "/profile-auth" : "/no_data_profile-auth";
    navigate(path);
    setDropdownOpen(false);
  };

  // Handle help button click
  const handleHelpClick = () => {
    const path = data_exist ? "/helpers" : "/tuto_helpers";
    navigate(path);
    setDropdownOpen(false);
  };

  // Handle premium button click
  const handlePremiumClick = () => {
    setPremiumModalOpen(true);
  };

  // Handle login button click
  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // Dynamic colors based on theme
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const dropdownBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 w-full z-50 transition-all duration-300 
          border-b-2 border-white
          ${scrolled ? `${app_bg_color} shadow-lg` : "bg-transparent"}
      `}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 flex items-center"
              variants={linkVariants}
            >
              <Link
                onClick={() => setShowInformationPage(false)}
                to="/"
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 overflow-hidden">
                  <LogoSVG
                    className={"h-full w-full object-contain"}
                    title="School Manager Logo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent mix-blend-overlay rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-sm sm:text-base md:text-xl tracking-tight ${text_color} bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600`}
                  >
                    {live_language.app_name || "SchoolManager"}
                  </span>
                  <span
                    className={`text-xs font-medium ${text_color} hidden sm:inline`}
                  >
                    {live_language.excellent_edu}
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <motion.div variants={linkVariants}>
                <LanguageSelector
                  showLangPanel={showLangPanel}
                  showPanel={showPanel}
                  setShowPanel={setShowPanel}
                />
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                variants={linkVariants}
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-full ${text_color} hover:bg-green-200/80 dark:hover:bg-green-700/80`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                ) : (
                  <Moon size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                )}
              </motion.button>

              {/* Premium Button */}
              <motion.button
                variants={linkVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePremiumClick}
                className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs sm:text-sm font-medium shadow-sm"
              >
                <Crown
                  size={14}
                  className="mr-1 sm:mr-1.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
                <span>{live_language.premium_text || "Premium"}</span>
              </motion.button>

              <div className="relative">
                <motion.button
                  variants={linkVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInformationPage(true)}
                  className="flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
                >
                  <Info size={14} className="mr-1.5 sm:w-4 sm:h-4" />
                  <span>
                    {language === "Bambara" ? "Kunafoniw" : "Informations"}
                  </span>
                </motion.button>
                <NotificationBadge onNotificationClick={() => setShowInformationPage(true)} />
              </div>

              {/* User Profile / Login Button */}
              {isAuthenticated ? (
                <div className="relative user-dropdown">
                  <motion.button
                    variants={linkVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2"
                    aria-label="User menu"
                  >
                    <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full overflow-hidden border-2 border-blue-500">
                      {currentUser?.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}
                        >
                          <User
                            size={16}
                            className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                          />
                        </div>
                      )}
                    </div>
                    <div className="hidden md:flex items-center">
                      <span
                        className={`text-xs sm:text-sm font-medium ${text_color}`}
                      >
                        {currentUser?.displayName ||
                          live_language.user_text ||
                          "User"}
                      </span>
                      <ChevronDown size={14} className="ml-1" />
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className={`absolute right-0 mt-2 w-48 sm:w-52 md:w-56 ${dropdownBg} ${borderColor} border rounded-lg shadow-lg overflow-hidden z-50`}
                      >
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-blue-500">
                              {currentUser?.photoURL ? (
                                <img
                                  src={currentUser.photoURL}
                                  alt="User"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}
                                >
                                  <User
                                    size={16}
                                    className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-xs sm:text-sm font-medium ${text_color}`}
                              >
                                {currentUser?.displayName ||
                                  live_language.user_text ||
                                  "User"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {currentUser?.email || ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={navigate_to_profile}
                            className={`flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm ${text_color} ${hoverBg}`}
                          >
                            <User size={14} className="mr-2" />
                            {live_language.profile_btn_text || "Profile"}
                          </button>
                          <button
                            onClick={handleHelpClick}
                            className={`flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm ${text_color} ${hoverBg}`}
                          >
                            <HelpCircle size={14} className="mr-2" />
                            {live_language.help_btn_text || "Help"}
                          </button>
                          <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 ${hoverBg}`}
                          >
                            <LogOut size={14} className="mr-2" />
                            {live_language.logout_btn_text || "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  variants={linkVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors space-x-1 shadow-md text-xs sm:text-sm"
                >
                  <LogIn size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span>{live_language.loginText || "Connexion"}</span>
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.button
                variants={linkVariants}
                onClick={toggleTheme}
                className={`p-1.5 rounded-full ${text_color} hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              <motion.button
                variants={linkVariants}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 rounded-md ${text_color} hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${app_bg_color}`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
            <div className="pt-2 flex flex-col space-y-3">
              <LanguageSelector
                showLangPanel={showLangPanel}
                showPanel={showPanel}
                setShowPanel={setShowPanel}
              />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-500">
                      {currentUser?.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}
                        >
                          <User size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${text_color}`}>
                        {currentUser?.displayName ||
                          live_language.user_text ||
                          "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {currentUser?.email || ""}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/profile-auth");
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${text_color} ${hoverBg} rounded-md`}
                  >
                    <User size={16} className="mr-2" />
                    {live_language.profile_btn_text || "Profile"}
                  </button>

                  <button
                    onClick={() => {
                      setIsOpenPopup("SETTINGS");
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${text_color} ${hoverBg} rounded-md`}
                  >
                    <Settings size={16} className="mr-2" />
                    {live_language.settings_btn_text || "Settings"}
                  </button>

                  <button
                    onClick={handleHelpClick}
                    className={`flex items-center w-full px-4 py-2 text-sm ${text_color} ${hoverBg} rounded-md`}
                  >
                    <HelpCircle size={16} className="mr-2" />
                    {live_language.help_btn_text || "Help"}
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${hoverBg} rounded-md`}
                  >
                    <LogOut size={16} className="mr-2" />
                    {live_language.logout_btn_text || "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors space-x-1 shadow-md"
                >
                  <LogIn className="mr-1.5" size={18} />
                  <span>{live_language.loginText || "Connexion"}</span>
                </button>
              )}

              <button
                onClick={handlePremiumClick}
                className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md text-sm font-medium shadow-sm"
              >
                <Crown size={16} className="mr-1.5" />
                <span>{live_language.premium_text || "Premium"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </>
  );
};

export default HomeNavBar;
