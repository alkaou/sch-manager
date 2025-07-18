import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, useLanguage } from '../contexts';
import { translate } from './informations_translator.js';

const LoadingSpinner = ({ isOthersBGColors, message }) => {
  const { text_color } = useTheme();
  const { live_language } = useLanguage();
  
  const language = live_language?.language || 'Français';
  const loadingMessage = message || translate('loading_informations', language);
  
  const textColorClass = isOthersBGColors 
    ? 'text-gray-900 dark:text-white' 
    : text_color;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Spinner principal */}
      <div className="relative mb-8">
        {/* Cercle extérieur pulsant */}
        <motion.div
          className="absolute inset-0 w-20 h-20 border-4 border-teal-200 dark:border-teal-800 rounded-full"
          variants={pulseVariants}
          animate="animate"
        />
        
        {/* Spinner rotatif */}
        <motion.div
          className="w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full"
          variants={spinnerVariants}
          animate="animate"
        />
        
        {/* Point central */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-teal-600 rounded-full"
          variants={dotVariants}
          animate="animate"
        />
      </div>
      
      {/* Message de chargement */}
      <motion.div
        className={`text-lg font-medium ${textColorClass} mb-4 text-center`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loadingMessage}
      </motion.div>
      
      {/* Points animés */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-teal-600 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Effet de shimmer */}
      <div className="mt-8 w-full max-w-md space-y-4">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;