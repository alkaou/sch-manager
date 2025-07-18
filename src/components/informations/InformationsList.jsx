import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Calendar, X } from 'lucide-react';
import { useTheme, useLanguage } from '../contexts';
import { translate } from './informations_translator.js';
import { filterInformationsBySearch, sortInformationsByDate } from './informations_methodes.js';
import InformationCard from './InformationCard.jsx';

const InformationsList = ({ informations, isOthersBGColors, onInformationRead }) => {
  const { text_color, app_bg_color, gradients } = useTheme();
  const { live_language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const language = live_language?.language || 'Français';

  // Couleurs selon le thème
  const inputBgColor = isOthersBGColors 
    ? 'bg-white dark:bg-gray-800' 
    : 'bg-gray-50 dark:bg-gray-900';
  
  const borderColor = isOthersBGColors 
    ? 'border-gray-300 dark:border-gray-600' 
    : 'border-gray-400 dark:border-gray-500';

  const textColorClass = isOthersBGColors 
    ? 'text-gray-900 dark:text-white' 
    : text_color;

  const buttonBgColor = isOthersBGColors 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-teal-600 hover:bg-teal-700';

  // Filtrage et tri des informations
  const filteredAndSortedInformations = useMemo(() => {
    let filtered = filterInformationsBySearch(informations, searchTerm);
    return sortInformationsByDate(filtered, sortOrder);
  }, [informations, searchTerm, sortOrder]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
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

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const handleInformationClick = (informationId) => {
    if (onInformationRead) {
      onInformationRead(informationId);
    }
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* En-tête avec recherche et filtres */}
      <motion.div
        className="mb-8"
        variants={headerVariants}
      >
        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textColorClass} w-5 h-5 opacity-50`} />
            <input
              type="text"
              placeholder={translate('search_placeholder', language)}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full pl-10 pr-10 py-3 ${inputBgColor} ${borderColor} border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${textColorClass} placeholder-gray-400 transition-all duration-200`}
            />
            {searchTerm && (
              <motion.button
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textColorClass} opacity-50 hover:opacity-100 transition-opacity`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
          
          {/* Boutons de contrôle */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 ${buttonBgColor} text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {translate('filter_by_date', language)}
              </span>
            </motion.button>
            
            <motion.button
              onClick={toggleSortOrder}
              className={`px-4 py-3 ${inputBgColor} ${borderColor} border rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${textColorClass}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sortOrder === 'newest' ? (
                <SortDesc className="w-4 h-4" />
              ) : (
                <SortAsc className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {sortOrder === 'newest' 
                  ? translate('sort_newest_first', language)
                  : translate('sort_oldest_first', language)
                }
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className={`${inputBgColor} ${borderColor} border rounded-lg p-4 overflow-hidden`}
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${textColorClass}`} />
                  <span className={`text-sm font-medium ${textColorClass}`}>
                    {translate('filter_by_date', language)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setSortOrder('newest')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      sortOrder === 'newest'
                        ? `${buttonBgColor} text-white`
                        : `${textColorClass} hover:bg-gray-200 dark:hover:bg-gray-700`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {translate('sort_newest_first', language)}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setSortOrder('oldest')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      sortOrder === 'oldest'
                        ? `${buttonBgColor} text-white`
                        : `${textColorClass} hover:bg-gray-200 dark:hover:bg-gray-700`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {translate('sort_oldest_first', language)}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Résultats de recherche */}
        {searchTerm && (
          <motion.div
            className={`mt-4 text-sm ${textColorClass} opacity-75`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredAndSortedInformations.length} résultat(s) pour "{searchTerm}"
          </motion.div>
        )}
      </motion.div>
      
      {/* Grille des informations */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredAndSortedInformations.map((information, index) => (
            <motion.div
              key={information.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => handleInformationClick(information.id)}
              className="cursor-pointer"
            >
              <InformationCard
                information={information}
                index={index}
                isOthersBGColors={isOthersBGColors}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Message si aucun résultat */}
      {filteredAndSortedInformations.length === 0 && searchTerm && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`text-lg font-medium ${textColorClass} mb-2`}>
            Aucun résultat trouvé
          </div>
          <div className={`text-sm ${textColorClass} opacity-75`}>
            Essayez avec d'autres mots-clés
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InformationsList;