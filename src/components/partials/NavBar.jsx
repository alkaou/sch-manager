import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  Bell,
  ChevronDown,
  Crown,
  HelpCircle,
  Moon,
  Sun,
  LogIn,
} from "lucide-react";
import { useTheme, useLanguage } from "../contexts.js";
import { useAuth } from "../../auth/AuthContext.js";
import LoginModal from "../../auth/LoginModal.jsx";
import PremiumModal from "../../auth/PremiumModal.jsx";
import { translate } from "./partials_translator.js";

import { LogoSVG } from "./Logo.svg.jsx";
import {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  addListener,
  removeListener,
} from "../notifications/notifications.js";

const Navbar = ({
  loginModalOpen,
  setLoginModalOpen,
  setIsShowParameters,
  setIsOpenPopup,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { language } = useLanguage();

  const navigate = useNavigate();

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize notifications
  useEffect(() => {
    // Get initial notifications
    setNotifications(getAllNotifications());
    setUnreadCount(getUnreadCount());

    // Listen for notification updates
    const handleNotificationUpdate = (updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
    };

    addListener(handleNotificationUpdate);

    // Cleanup listener on unmount
    return () => {
      removeListener(handleNotificationUpdate);
    };
  }, [notifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
      if (
        notificationsOpen &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, notificationsOpen, notifications]);

  // Dynamic colors based on theme
  const navbarBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const dropdownBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const notificationUnreadBg =
    theme === "dark" ? "bg-blue-900/20" : "bg-blue-50";

  // Handle notification actions
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle notification actions
    if (notification.actions) {
      notification.actions.forEach((action) => {
        if (action.action === "view_event" && action.eventId) {
          navigate("/events");
          setNotificationsOpen(false);
        }
      });
    }
  };

  // Format notification time
  const formatNotificationTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return translate("just_now", language);
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
  };

  // Get notification icon
  const getNotificationIcon = (notification) => {
    switch (notification.icon) {
      case "calendar":
        return "📅";
      case "system":
        return "⚙️";
      case "mail":
        return "📧";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "🔔";
    }
  };

  // Handle help button click
  const handleHelpClick = () => {
    navigate("/helpers");
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

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 right-0 left-0 ${navbarBg} ${borderColor} border-b shadow-sm z-20 px-1 py-0.5 sm:py-1`}
      >
        <div
          className="flex items-center justify-between ml-[50px] sm:ml-[55px] md:ml-[60px]"
          style={{ height: "60px" }}
        >
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center">
              <LogoSVG
                className={
                  "mr-2 sm:mr-2 w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10"
                }
                title="School Manager Logo"
              />
              <span
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800 tracking-tight text-sm sm:text-base md:text-lg drop-shadow-sm transform transition-transform duration-300 hover:scale-105"
                style={{
                  textShadow:
                    theme === "dark"
                      ? "0 0 15px rgba(59, 130, 246, 0.5)"
                      : "0 0 10px rgba(79, 70, 229, 0.3)",
                  letterSpacing: "0.02em",
                  fontVariationSettings: '"wght" 800',
                }}
              >
                {translate("school_manager", language)}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div
            className={`flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 pr-4`}
          >
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-1 rounded-full ${hoverBg} transition-colors`}
              aria-label={translate("toggle_theme", language)}
            >
              {theme === "dark" ? (
                <Sun className="text-white w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5" />
              ) : (
                <Moon className="text-gray-600 w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5" />
              )}
            </motion.button>

            {/* Premium Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePremiumClick}
              className="flex items-center px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-[10px] sm:text-xs font-medium shadow-sm"
            >
              <Crown
                size={10}
                className="mr-0.5 sm:mr-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
              />
              <span className="hidden sm:inline p-1">
                {translate("premium", language)}
              </span>
            </motion.button>

            {/* Notifications */}
            <div className="relative notifications-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-1 rounded-full ${hoverBg} transition-colors relative`}
                aria-label={translate("notifications", language)}
              >
                <Bell
                  className={
                    theme === "dark"
                      ? "text-white w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5"
                      : "text-gray-600 w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5"
                  }
                />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] sm:text-[9px]">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                <>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                      }}
                      className={`absolute right-0 mt-2 w-64 sm:w-72 md:w-80 ${dropdownBg} ${borderColor} border rounded-lg shadow-lg overflow-hidden z-50`}
                    >
                      <div className="p-1.5 sm:p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-medium text-[10px] sm:text-xs">
                          {translate("notifications", language)}
                        </h3>
                        <div className="flex space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {translate("mark_all_as_read", language)}
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={handleClearAllNotifications}
                              className="text-[10px] sm:text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              {translate("clear_all", language) ||
                                "Supprimer tout"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto scrollbar-custom">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`p-2 sm:p-3 border-b ${borderColor} last:border-0 ${
                                !notification.read ? notificationUnreadBg : ""
                              } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2 flex-1">
                                  <span className="text-sm">
                                    {getNotificationIcon(notification)}
                                  </span>
                                  <div className="flex-1">
                                    {notification.title && (
                                      <p
                                        className={`${textColor} text-xs sm:text-sm font-medium mb-1`}
                                      >
                                        {notification.title}
                                      </p>
                                    )}
                                    <p
                                      className={`${textColor} text-xs sm:text-sm ${
                                        notification.title ? "opacity-80" : ""
                                      }`}
                                    >
                                      {notification.message}
                                    </p>
                                    {notification.priority === "high" && (
                                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                        Urgent
                                      </span>
                                    )}
                                    {notification.isExternal && (
                                      <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                        Admin
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatNotificationTime(notification.time)}
                                </p>
                                {notification.actions &&
                                  notification.actions.length > 0 && (
                                    <div className="flex space-x-2">
                                      {notification.actions
                                        .slice(0, 2)
                                        .map((action, index) => (
                                          <button
                                            key={`${notification.id}-action-${index}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleNotificationClick(
                                                notification
                                              );
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                          >
                                            {action.label}
                                          </button>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                            {translate("no_notifications", language)}
                          </div>
                        )}
                      </div>

                      <div className="p-1.5 border-t border-gray-200 dark:border-gray-700 text-center">
                        <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          {translate("view_all_notifications", language)}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              </AnimatePresence>
            </div>

            {/* User Profile / Login Button */}
            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-0.5 sm:space-x-1"
                  aria-label={translate("user_menu", language)}
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full overflow-hidden border-[1.5px] border-blue-500">
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
                          size={12}
                          className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                        />
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex items-center">
                    <span
                      className={`text-[10px] sm:text-xs font-medium ${textColor}`}
                    >
                      {currentUser?.displayName || translate("user", language)}
                    </span>
                    <ChevronDown size={10} className="ml-0.5" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  <>
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
                        <div className="p-1.5 sm:p-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full overflow-hidden border-[1.5px] border-blue-500">
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
                                    size={12}
                                    className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-[10px] sm:text-xs font-medium ${textColor}`}
                              >
                                {currentUser?.displayName ||
                                  translate("user", language)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {currentUser?.email || ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate("/profile-auth");
                              setDropdownOpen(false);
                            }}
                            className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs ${textColor} ${hoverBg}`}
                          >
                            <User size={10} className="mr-1.5" />
                            {translate("profile", language)}
                          </button>
                          <button
                            onClick={() => {
                              setIsShowParameters(true);
                              setIsOpenPopup(true);
                              setDropdownOpen(false);
                            }}
                            className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs ${textColor} ${hoverBg}`}
                          >
                            <Settings size={10} className="mr-1.5" />
                            {translate("settings_texte", language)}
                          </button>
                          <button
                            onClick={handleHelpClick}
                            className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs ${textColor} ${hoverBg}`}
                          >
                            <HelpCircle size={10} className="mr-1.5" />
                            {translate("help", language)}
                          </button>
                          <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-red-600 ${hoverBg}`}
                          >
                            <LogOut size={10} className="mr-1.5" />
                            {translate("logout", language)}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 sm:px-2.5 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] sm:text-xs font-medium transition-colors"
              >
                <span className="flex items-center p-1">
                  <LogIn size={10} className="mr-0.5 sm:mr-1" />
                  {translate("login", language)}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

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

export default Navbar;
