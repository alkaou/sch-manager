import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronDown, ChevronUp, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTheme, useLanguage } from '../contexts';
import { translate } from './informations_translator.js';
import { formatDate, getMediaType } from './informations_methodes.js';

const InformationCard = ({ information, index, isOthersBGColors }) => {
  const { text_color, app_bg_color, gradients } = useTheme();
  const { live_language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const language = live_language?.language || 'Français';

  // Déterminer les couleurs selon le thème
  const cardBgColor = isOthersBGColors 
    ? 'bg-white dark:bg-gray-800' 
    : 'bg-gray-50 dark:bg-gray-900';
  
  const borderColor = isOthersBGColors 
    ? 'border-gray-200 dark:border-gray-700' 
    : 'border-gray-300 dark:border-gray-600';

  const textColorClass = isOthersBGColors 
    ? 'text-gray-900 dark:text-white' 
    : text_color;

  const secondaryTextColor = isOthersBGColors 
    ? 'text-gray-600 dark:text-gray-300' 
    : 'text-gray-500 dark:text-gray-400';

  // Gestion du média principal
  const primaryMedia = information.media_1 || information.media_2;
  const mediaType = getMediaType(primaryMedia);

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const mediaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
  };

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Rendu du média
  const renderMedia = () => {
    if (!primaryMedia) return null;

    return (
      <motion.div 
        className="relative overflow-hidden rounded-t-xl"
        variants={mediaVariants}
        initial="hidden"
        animate="visible"
      >
        {mediaType === 'image' && !imageError && (
          <motion.img
            src={primaryMedia}
            alt={translate('image_alt', language)}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
            onError={() => setImageError(true)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {mediaType === 'video' && !videoError && (
          <div className="relative">
            <video
              src={primaryMedia}
              className="w-full h-64 object-cover"
              controls
              preload="metadata"
              onError={() => setVideoError(true)}
            >
              {translate('video_not_supported', language)}
            </video>
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
              whileHover={{ opacity: 1 }}
            >
              <Play className="text-white w-16 h-16" />
            </motion.div>
          </div>
        )}
        
        {(imageError || videoError || mediaType === 'unknown') && information.media_2 && (
          <motion.img
            src={information.media_2}
            alt={translate('image_alt', language)}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </motion.div>
    );
  };

  return (
    <motion.article
      className={`${cardBgColor} ${borderColor} border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      {/* Média */}
      {renderMedia()}
      
      {/* Contenu */}
      <motion.div 
        className="p-6"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Titre */}
        <motion.h2 
          className={`text-2xl font-bold ${textColorClass} mb-4 leading-tight`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {information.title}
        </motion.h2>
        
        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <motion.div 
            className={`flex items-center ${secondaryTextColor} text-sm`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {translate('published_on', language)} {formatDate(information.createdAt, language)}
            </span>
          </motion.div>
          
          {information.contact && (
            <motion.div 
              className={`flex items-center ${secondaryTextColor} text-sm`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-4 h-4 mr-2" />
              <span>{translate('contact_info', language)}: {information.contact}</span>
            </motion.div>
          )}
        </div>
        
        {/* Description */}
        <div className={`${textColorClass} prose prose-sm max-w-none`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ReactMarkdown>
              {isExpanded ? information.descriptions : truncateText(information.descriptions)}
            </ReactMarkdown>
          </motion.div>
          
          {/* Bouton Lire plus/moins */}
          {information.descriptions && information.descriptions.length > 150 && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-4 flex items-center ${isOthersBGColors ? 'text-blue-600 hover:text-blue-800' : 'text-teal-600 hover:text-teal-800'} font-medium text-sm transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="mr-1">
                {isExpanded 
                  ? translate('read_less', language) 
                  : translate('read_more', language)
                }
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </div>
        
        {/* Animation de contenu étendu */}
        <motion.div
          variants={expandVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          className="overflow-hidden"
        >
          {isExpanded && (
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Contenu additionnel si nécessaire */}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Indicateur de nouvelle information */}
      <motion.div
        className="absolute top-4 right-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </motion.div>
    </motion.article>
  );
};

export default InformationCard;