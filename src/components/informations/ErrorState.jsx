import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useTheme, useLanguage } from '../contexts';
import { translate } from './informations_translator.js';

const ErrorState = ({ isOthersBGColors, onRetry, error }) => {
  const { text_color } = useTheme();
  const { live_language } = useLanguage();
  
  const language = live_language?.language || 'Français';
  
  const textColorClass = isOthersBGColors 
    ? 'text-gray-900 dark:text-white' 
    : text_color;
    
  const secondaryTextColor = isOthersBGColors 
    ? 'text-gray-600 dark:text-gray-300' 
    : 'text-gray-500 dark:text-gray-400';
    
  const buttonBgColor = isOthersBGColors 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-teal-600 hover:bg-teal-700';

  // Déterminer le type d'erreur
  const isNetworkError = error?.message?.includes('network') || error?.message?.includes('fetch');
  const errorMessage = error?.message || translate('error_loading', language);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  };

  const shakeVariants = {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glitchVariants = {
    animate: {
      x: [0, -2, 2, 0],
      y: [0, 1, -1, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Icône d'erreur avec effets */}
      <motion.div
        className="relative mb-8"
        variants={itemVariants}
      >
        {/* Cercles d'arrière-plan avec effet de pulsation */}
        <motion.div
          className="absolute inset-0 w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full -z-10"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute inset-2 w-28 h-28 bg-red-200 dark:bg-red-800/30 rounded-full -z-10"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        
        {/* Icône principale */}
        <motion.div
          className="w-32 h-32 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center"
          variants={iconVariants}
          whileHover="hover"
        >
          <motion.div 
            variants={shakeVariants} 
            animate="animate"
          >
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </motion.div>
        </motion.div>
        
        {/* Icône de réseau si erreur réseau */}
        {isNetworkError && (
          <motion.div
            className="absolute -top-2 -right-2"
            variants={glitchVariants}
            animate="animate"
          >
            <div className="relative">
              <WifiOff className="w-6 h-6 text-red-400" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wifi className="w-6 h-6 text-red-300" />
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Effet de glitch */}
        <motion.div
          className="absolute inset-0 w-32 h-32 border-2 border-red-300 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Titre d'erreur */}
      <motion.h2
        className={`text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-4`}
        variants={itemVariants}
      >
        {language === 'Français' && 'Erreur de chargement'}
        {language === 'Anglais' && 'Loading Error'}
        {language === 'Bambara' && 'Fili ye kɛ'}
      </motion.h2>
      
      {/* Message d'erreur */}
      <motion.p
        className={`text-lg ${secondaryTextColor} mb-2 leading-relaxed max-w-md`}
        variants={itemVariants}
      >
        {translate('error_loading', language)}
      </motion.p>
      
      {/* Détails de l'erreur si disponibles */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md"
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-red-700 dark:text-red-300 font-mono">
            {errorMessage}
          </p>
        </motion.div>
      )}
      
      {/* Suggestions selon le type d'erreur */}
      <motion.div
        className={`text-sm ${secondaryTextColor} mb-8 max-w-md`}
        variants={itemVariants}
      >
        {isNetworkError ? (
          <div>
            {language === 'Français' && (
              <p>Vérifiez votre connexion internet et réessayez.</p>
            )}
            {language === 'Anglais' && (
              <p>Check your internet connection and try again.</p>
            )}
            {language === 'Bambara' && (
              <p>I ka internet jɔginni lajɛ ka segin kɛ.</p>
            )}
          </div>
        ) : (
          <div>
            {language === 'Français' && (
              <p>Une erreur inattendue s'est produite. Veuillez réessayer.</p>
            )}
            {language === 'Anglais' && (
              <p>An unexpected error occurred. Please try again.</p>
            )}
            {language === 'Bambara' && (
              <p>Fili dɔ ye kɛ min tun ma makɔnɔ. Aw ye segin kɛ.</p>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Bouton de rechargement */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className={`${buttonBgColor} text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl`}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          <span>{translate('retry_button', language)}</span>
        </motion.button>
      )}
      
      {/* Éléments décoratifs d'erreur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particules d'erreur */}
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-red-400 rounded-full"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + (index % 2) * 30}%`
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2 + index * 0.3,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Lignes de glitch */}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={`glitch-${index}`}
            className="absolute h-px bg-red-300 opacity-30"
            style={{
              left: '20%',
              right: '20%',
              top: `${50 + index * 10}%`
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: index * 0.2,
              repeatDelay: 3
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ErrorState;