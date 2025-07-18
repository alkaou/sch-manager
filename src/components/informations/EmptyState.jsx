import React from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, Info } from 'lucide-react';
import { useTheme, useLanguage } from '../contexts';
import { translate } from './informations_translator.js';

const EmptyState = ({ isOthersBGColors, onRetry }) => {
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
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
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
      {/* Icône principale avec effets */}
      <motion.div
        className="relative mb-8"
        variants={itemVariants}
      >
        {/* Cercles d'arrière-plan */}
        <motion.div
          className="absolute inset-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/30 rounded-full -z-10"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute inset-2 w-28 h-28 bg-teal-200 dark:bg-teal-800/30 rounded-full -z-10"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        
        {/* Icône principale */}
        <motion.div
          className={`w-32 h-32 ${isOthersBGColors ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-teal-50 dark:bg-teal-900/20'} rounded-full flex items-center justify-center`}
          variants={iconVariants}
          whileHover="hover"
        >
          <motion.div variants={floatingVariants} animate="animate">
            <FileText 
              className={`w-16 h-16 ${isOthersBGColors ? 'text-blue-400' : 'text-teal-400'}`} 
            />
          </motion.div>
        </motion.div>
        
        {/* Icônes flottantes */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Info className={`w-6 h-6 ${isOthersBGColors ? 'text-blue-300' : 'text-teal-300'}`} />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-2 -left-2"
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <FileText className={`w-5 h-5 ${isOthersBGColors ? 'text-blue-200' : 'text-teal-200'}`} />
        </motion.div>
      </motion.div>
      
      {/* Titre */}
      <motion.h2
        className={`text-2xl md:text-3xl font-bold ${textColorClass} mb-4`}
        variants={itemVariants}
      >
        {language === 'Français' && 'Aucune information disponible'}
        {language === 'Anglais' && 'No Information Available'}
        {language === 'Bambara' && 'Kunafoni si tɛ yen'}
      </motion.h2>
      
      {/* Description */}
      <motion.p
        className={`text-lg ${secondaryTextColor} mb-8 leading-relaxed max-w-md`}
        variants={itemVariants}
      >
        {translate('no_informations_available', language)}
      </motion.p>
      
      {/* Bouton de rechargement si disponible */}
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
      
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particules flottantes */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 ${isOthersBGColors ? 'bg-blue-200' : 'bg-teal-200'} rounded-full opacity-30`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 3) * 20}%`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Message d'encouragement */}
      <motion.div
        className={`mt-8 text-sm ${secondaryTextColor} italic`}
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {language === 'Français' && '✨ Les nouvelles informations apparaîtront ici'}
        {language === 'Anglais' && '✨ New information will appear here'}
        {language === 'Bambara' && '✨ Kunafoni kuraw bɛna jɛ yan'}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;