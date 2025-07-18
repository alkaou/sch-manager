import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
// import secureLocalStorage from "react-secure-storage";
import { listenToInformations, getReadInformationsIds } from './informations_methodes.js';
import { useLanguage } from '../contexts';
import { translate } from './informations_translator.js';

const NotificationBadge = ({ onNotificationClick }) => {
  const [hasNewInformations, setHasNewInformations] = useState(false);
  const [newInformationsCount, setNewInformationsCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [latestInformation, setLatestInformation] = useState(null);
  const { live_language } = useLanguage();
  
  const language = live_language?.language || 'Français';

  useEffect(() => {
    // Écouter les nouvelles informations
    const unsubscribe = listenToInformations((informations) => {
      if (informations.length === 0) {
        setHasNewInformations(false);
        setNewInformationsCount(0);
        setShowNotification(false);
        return;
      }

      const readIds = getReadInformationsIds();
      const unreadInformations = informations.filter(info => !readIds.includes(info.id));
      
      if (unreadInformations.length > 0) {
        setHasNewInformations(true);
        setNewInformationsCount(unreadInformations.length);
        setLatestInformation(unreadInformations[0]); // La plus récente
        setShowNotification(true);
      } else {
        setHasNewInformations(false);
        setNewInformationsCount(0);
        setShowNotification(false);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotification(false);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const dismissNotification = (e) => {
    e.stopPropagation();
    setShowNotification(false);
  };

  // Animation variants
  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const notificationVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const bellVariants = {
    ring: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  return (
    <>
      {/* Badge de notification sur le bouton Informations */}
      <AnimatePresence>
        {hasNewInformations && (
          <motion.div
            className="absolute -top-1 -right-1 z-10"
            variants={badgeVariants}
            initial="hidden"
            animate={["visible", "pulse"]}
            exit="hidden"
          >
            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
              {newInformationsCount > 9 ? '9+' : newInformationsCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification popup */}
      <AnimatePresence>
        {showNotification && latestInformation && (
          <motion.div
            className="fixed top-20 right-4 z-50 max-w-sm"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* En-tête */}
              <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div variants={bellVariants} animate="ring">
                    <Bell className="w-4 h-4" />
                  </motion.div>
                  <span className="font-medium text-sm">
                    {translate('new_information_available', language)}
                  </span>
                </div>
                <motion.button
                  onClick={dismissNotification}
                  className="text-white hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Contenu */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {latestInformation.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                  {latestInformation.descriptions?.substring(0, 100)}...
                </p>
                
                {/* Bouton d'action */}
                <motion.button
                  onClick={handleNotificationClick}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {translate('view_new_information', language)}
                </motion.button>
              </div>
              
              {/* Indicateur de nouvelles informations */}
              {newInformationsCount > 1 && (
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-600 dark:text-gray-300 text-center">
                  {newInformationsCount === 2 
                    ? (language === 'Français' ? '+ 1 autre information' : 
                       language === 'Anglais' ? '+ 1 other information' : 
                       '+ kunafoni 1 wɛrɛ')
                    : (language === 'Français' ? `+ ${newInformationsCount - 1} autres informations` : 
                       language === 'Anglais' ? `+ ${newInformationsCount - 1} other informations` : 
                       `+ kunafoni ${newInformationsCount - 1} wɛrɛw`)
                  }
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationBadge;