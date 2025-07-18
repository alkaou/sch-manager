import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { useTheme, useLanguage } from "../contexts";
import { translate } from "./informations_translator.js";
import {
  listenToInformations,
  markMultipleInformationsAsRead,
  getUnreadInformations,
  markInformationAsRead
} from "./informations_methodes.js";
import InformationsList from "./InformationsList.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorState from "./ErrorState.jsx";

function InformationsManager({ setShowInformationPage, isOthersBGColors }) {
  const { text_color, app_bg_color, gradients } = useTheme();
  const { live_language } = useLanguage();
  
  const [informations, setInformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  
  const language = live_language?.language || 'Français';
  
  // Couleurs selon le thème
  const bgColor = isOthersBGColors 
    ? 'bg-gray-50 dark:bg-gray-900' 
    : app_bg_color;
    
  const textColorClass = isOthersBGColors 
    ? 'text-gray-900 dark:text-white' 
    : text_color;
    
  const buttonBgColor = isOthersBGColors 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-teal-600 hover:bg-teal-700';

  // Fonction pour gérer les changements d'informations
  const handleInformationsChange = useCallback((newInformations) => {
    setInformations(newInformations);
    setLoading(false);
    setError(null);
  }, []);

  // Fonction pour gérer les erreurs
  const handleError = useCallback((err) => {
    console.error('Erreur lors du chargement des informations:', err);
    setError(err);
    setLoading(false);
  }, []);

  // Initialiser l'écoute des informations
  useEffect(() => {
    setLoading(true);
    
    const unsubscribeFn = listenToInformations((newInformations) => {
      if (newInformations.length === 0 && !error) {
        // Aucune information mais pas d'erreur
        handleInformationsChange([]);
      } else if (newInformations.length > 0) {
        handleInformationsChange(newInformations);
      }
    });
    
    setUnsubscribe(() => unsubscribeFn);
    
    // Timeout pour gérer le cas où aucune donnée n'arrive
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000); // 10 secondes
    
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
      clearTimeout(timeout);
    };
  }, []);

  // Nettoyer l'écoute au démontage
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  // Fonction pour marquer toutes les informations comme lues
  const markAllAsRead = useCallback(() => {
    const unreadInfos = getUnreadInformations(informations);
    if (unreadInfos.length > 0) {
      const unreadIds = unreadInfos.map(info => info.id);
      markMultipleInformationsAsRead(unreadIds);
    }
  }, [informations]);

  // Fonction pour marquer une information comme lue
  const handleInformationRead = useCallback((informationId) => {
    markInformationAsRead(informationId);
  }, []);

  // Fonction de retour
  const onReturn = () => {
    // Marquer toutes les informations comme lues avant de quitter
    markAllAsRead();
    setShowInformationPage(false);
  };

  // Fonction de retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    if (unsubscribe) {
      unsubscribe();
    }
    
    const unsubscribeFn = listenToInformations(handleInformationsChange);
    setUnsubscribe(() => unsubscribeFn);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className={`min-h-screen ${bgColor} transition-colors duration-300`}
      style={{ marginTop: "10%" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <motion.header 
          className="mb-8"
          variants={headerVariants}
        >
          <div className="flex items-center justify-between mb-6">
            {/* Bouton retour */}
            <motion.button
              onClick={onReturn}
              className={`flex items-center gap-2 px-4 py-2 ${buttonBgColor} text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg`}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{translate('back_button', language)}</span>
            </motion.button>
            
            {/* Bouton marquer tout comme lu */}
            {informations.length > 0 && (
              <motion.button
                onClick={markAllAsRead}
                className={`flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <BellOff className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {translate('mark_all_as_read', language)}
                </span>
              </motion.button>
            )}
          </div>
          
          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className={`text-3xl md:text-4xl font-bold ${textColorClass} mb-2`}>
              {translate('informations_title', language)}
            </h1>
            <div className={`h-1 w-24 ${isOthersBGColors ? 'bg-blue-600' : 'bg-teal-600'} rounded-full`} />
          </motion.div>
        </motion.header>
        
        {/* Contenu principal */}
        <motion.main variants={contentVariants}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner isOthersBGColors={isOthersBGColors} />
              </motion.div>
            )}
            
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ErrorState 
                  isOthersBGColors={isOthersBGColors} 
                  onRetry={handleRetry}
                  error={error}
                />
              </motion.div>
            )}
            
            {!loading && !error && informations.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <EmptyState 
                  isOthersBGColors={isOthersBGColors} 
                  onRetry={handleRetry}
                />
              </motion.div>
            )}
            
            {!loading && !error && informations.length > 0 && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <InformationsList 
                  informations={informations}
                  isOthersBGColors={isOthersBGColors}
                  onInformationRead={handleInformationRead}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}

export default InformationsManager;
