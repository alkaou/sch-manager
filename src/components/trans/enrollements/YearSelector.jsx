import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import translations from './enrollements_traduction';
import { useLanguage } from '../contexts';

/**
 * Composant pour la sélection de l'année scolaire
 * @param {Object} props - Props du composant
 * @param {Array} props.years - Liste des années disponibles
 * @param {string} props.selectedYear - Année actuellement sélectionnée
 * @param {function} props.onYearChange - Fonction appelée lors du changement d'année
 * @param {string} props.theme - Thème actuel ('dark' ou 'light')
 */
const YearSelector = ({ years = [], selectedYear, onYearChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language } = useLanguage();

  // Fonction helper pour les traductions
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Ferme le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sélection d'une année
  const handleYearSelect = (year) => {
    onYearChange(year);
    setIsOpen(false);
  };

  // Styles adaptatifs selon le thème
  const buttonStyles = theme === 'dark'
    ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  
  const dropdownStyles = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';
  
  const optionStyles = {
    base: theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-700'
      : 'text-gray-700 hover:bg-gray-100',
    selected: theme === 'dark'
      ? 'bg-blue-600 text-white'
      : 'bg-blue-50 text-blue-800'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        title={t('year_selector')}
        className={`
          ${buttonStyles} 
          px-4 py-2 rounded-lg border flex items-center gap-2 
          transition-all duration-200
        `}
      >
        <Calendar className="w-4 h-4" />
        <span className="font-medium">{selectedYear}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-10 mt-2 w-48 rounded-lg shadow-lg ${dropdownStyles} border
              overflow-hidden max-h-72 overflow-y-auto scrollbar-thin
            `}
          >
            <div className="py-1">
              {years.length > 0 ? (
                years.map((year) => (
                  <motion.button
                    key={year}
                    whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6' }}
                    onClick={() => handleYearSelect(year)}
                    className={`
                      w-full px-4 py-2 text-left flex items-center justify-between
                      ${selectedYear === year ? optionStyles.selected : optionStyles.base}
                    `}
                  >
                    <span>{year}</span>
                    {selectedYear === year && (
                      <Check className="w-4 h-4" />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {t('no_data_available')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YearSelector;