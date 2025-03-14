import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, Settings, Bell, ChevronDown,
  Crown, HelpCircle, Moon, Sun
} from "lucide-react";
import { useTheme } from "./contexts";

const Navbar = ({ isAuthenticated, userProfile, onLogout, onLogin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 right-0 left-0 ${navbarBg} ${borderColor} border-b shadow-sm z-20 px-4 py-2 ml-[80px]`}
    >
      <div className="flex items-center justify-between h-14">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
            </svg>
            <span className={`font-bold text-xl ${textColor}`}>SchoolManager</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${hoverBg} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="text-white" size={20} /> : <Moon className="text-gray-600" size={20} />}
          </motion.button>

          {/* Premium Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium shadow-sm"
          >
            <Crown size={16} className="mr-1.5" />
            <span>Premium</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-full ${hoverBg} transition-colors relative`}
              aria-label="Notifications"
            >
              <Bell className={theme === "dark" ? "text-white" : "text-gray-600"} size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
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
                  className={`absolute right-0 mt-2 w-80 ${dropdownBg} ${borderColor} border rounded-lg shadow-lg overflow-hidden z-50`}
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b ${borderColor} last:border-0 ${!notification.read ? notificationUnreadBg : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className={`${textColor} text-sm`}>{notification.message}</p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
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
                className="flex items-center space-x-2"
                aria-label="User menu"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-500">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center">
                  <span className={`text-sm font-medium ${textColor}`}>
                    {userProfile?.displayName || "User"}
                  </span>
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`absolute right-0 mt-2 w-48 ${dropdownBg} ${borderColor} border rounded-lg shadow-lg overflow-hidden z-50`}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium">{userProfile?.displayName || "User"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile?.email || ""}</p>
                    </div>

                    <div className="py-1">
                      <button className={`flex items-center w-full px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                        <User size={16} className="mr-2" />
                        Profile
                      </button>
                      <button className={`flex items-center w-full px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                        <Settings size={16} className="mr-2" />
                        Settings
                      </button>
                      <button className={`flex items-center w-full px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                        <HelpCircle size={16} className="mr-2" />
                        Help & Support
                      </button>
                    </div>

                    <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;