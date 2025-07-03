import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, Settings, Bell, ChevronDown,
  Crown, HelpCircle, Moon, Sun, LogIn
} from "lucide-react";
import { useTheme } from "../contexts.js";
import { useAuth } from "../../auth/AuthContext.js";
import LoginModal from "../../auth/LoginModal.jsx";
import PremiumModal from "../../auth/PremiumModal.jsx";

import { LogoSVG } from "./Logo.svg.jsx";

const Navbar = ({
  loginModalOpen,
  setLoginModalOpen,
  setIsShowParameters,
  setIsOpenPopup
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const navigate = useNavigate();

  // Mock notifications for demo
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New student registration", time: "5 min ago", read: false },
    { id: 2, message: "Report generated successfully", time: "1 hour ago", read: false },
    { id: 3, message: "System update available", time: "Yesterday", read: true }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
      if (notificationsOpen && !event.target.closest(".notifications-dropdown")) {
        setNotificationsOpen(false);
      }
      // console.log(isAuthenticated);
      // console.log(currentUser);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, notificationsOpen]);

  // Dynamic colors based on theme
  const navbarBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const dropdownBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const notificationUnreadBg = theme === "dark" ? "bg-blue-900/20" : "bg-blue-50";

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

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
          style={{height: "60px"}}
        >
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center">
              <LogoSVG
                className={"mr-2 sm:mr-2 w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10"}
                title="School Manager Logo"
              />
              <span 
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800 tracking-tight text-sm sm:text-base md:text-lg drop-shadow-sm transform transition-transform duration-300 hover:scale-105"
                style={{
                  textShadow: theme === 'dark' ? '0 0 15px rgba(59, 130, 246, 0.5)' : '0 0 10px rgba(79, 70, 229, 0.3)',
                  letterSpacing: '0.02em',
                  fontVariationSettings: '"wght" 800'
                }}
              >
                SchoolManager
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className={`flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 pr-4`}>
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-1 rounded-full ${hoverBg} transition-colors`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="text-white w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5" /> : 
                <Moon className="text-gray-600 w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5" />
              }
            </motion.button>

            {/* Premium Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePremiumClick}
              className="flex items-center px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-[10px] sm:text-xs font-medium shadow-sm"
            >
              <Crown size={10} className="mr-0.5 sm:mr-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline p-1">Premium</span>
            </motion.button>

            {/* Notifications */}
            <div className="relative notifications-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-1 rounded-full ${hoverBg} transition-colors relative`}
                aria-label="Notifications"
              >
                <Bell className={theme === "dark" ? "text-white w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5" : "text-gray-600 w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5"} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] sm:text-[9px]">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`absolute right-0 mt-2 w-64 sm:w-72 md:w-80 ${dropdownBg} ${borderColor} border rounded-lg shadow-lg overflow-hidden z-50`}
                  >
                    <div className="p-1.5 sm:p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-[10px] sm:text-xs">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-2 sm:p-3 border-b ${borderColor} last:border-0 ${!notification.read ? notificationUnreadBg : ''}`}
                          >
                            <div className="flex justify-between">
                              <p className={`${textColor} text-xs sm:text-sm`}>{notification.message}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                          No notifications
                        </div>
                      )}
                    </div>

                    <div className="p-1.5 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
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
                  aria-label="User menu"
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full overflow-hidden border-[1.5px] border-blue-500">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                        <User size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex items-center">
                    <span className={`text-[10px] sm:text-xs font-medium ${textColor}`}>
                      {currentUser?.displayName || "User"}
                    </span>
                    <ChevronDown size={10} className="ml-0.5" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
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
                              <div className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                                <User size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={`text-[10px] sm:text-xs font-medium ${textColor}`}>
                              {currentUser?.displayName || "User"}
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
                          Profile
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
                          Settings
                        </button>
                        <button
                          onClick={handleHelpClick}
                          className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs ${textColor} ${hoverBg}`}
                        >
                          <HelpCircle size={10} className="mr-1.5" />
                          Help
                        </button>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-red-600 ${hoverBg}`}
                        >
                          <LogOut size={10} className="mr-1.5" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
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
                  Login
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <PremiumModal isOpen={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
    </>
  );
};

export default Navbar;