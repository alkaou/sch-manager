import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  Type,
  Clock,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './events_translator';
import { EVENT_TYPES, EVENT_STATUS } from './EventsMethodes';

const EventFilters = ({
  onFiltersChange,
  theme,
  text_color
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'startDate',
    sortOrder: 'desc'
  });

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'startDate',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.status !== 'all' || 
           filters.type !== 'all' || 
           filters.startDate || 
           filters.endDate;
  };

  const getInputClasses = () => {
    const baseClasses = "w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const themeClasses = theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
    
    return `${baseClasses} ${themeClasses}`;
  };

  const getSelectClasses = () => {
    return getInputClasses();
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: {
        opacity: { duration: 0.1 },
        height: { duration: 0.2, delay: 0.1 }
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } ${text_color}`}
    >
      {/* Barre de recherche et bouton de filtre */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Recherche rapide */}
          <div className="flex-1 relative">
            <Search 
              size={20} 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} 
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder={translate('search_events', language)}
              className={`${getInputClasses()} pl-10`}
            />
          </div>

          {/* Bouton de filtres avancés */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
            } ${hasActiveFilters() ? 'ring-2 ring-blue-500' : ''}`}
          >
            <Filter size={16} />
            {translate('filters', language)}
            {hasActiveFilters() && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>

          {/* Bouton de réinitialisation */}
          {hasActiveFilters() && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
              title={translate('reset_filters', language)}
            >
              <RotateCcw size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className={`p-4 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Filtre par statut */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    {translate('status', language)}
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className={getSelectClasses()}
                  >
                    <option value="all">{translate('all_status', language)}</option>
                    {Object.values(EVENT_STATUS).map(status => (
                      <option key={status} value={status}>
                        {translate(status, language)}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Filtre par type */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Type size={14} className="text-green-500" />
                    {translate('type', language)}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className={getSelectClasses()}
                  >
                    <option value="all">{translate('all_types', language)}</option>
                    {EVENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {translate(type, language)}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Date de début */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-purple-500" />
                    {translate('from_date', language)}
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className={getInputClasses()}
                  />
                </motion.div>

                {/* Date de fin */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-red-500" />
                    {translate('to_date', language)}
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className={getInputClasses()}
                    min={filters.startDate}
                  />
                </motion.div>

                {/* Tri par */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2">
                    {translate('sort_by', language)}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className={getSelectClasses()}
                  >
                    <option value="startDate">{translate('start_date', language)}</option>
                    <option value="endDate">{translate('end_date', language)}</option>
                    <option value="title">{translate('title', language)}</option>
                    <option value="type">{translate('type', language)}</option>
                    <option value="createdAt">{translate('created_at', language)}</option>
                  </select>
                </motion.div>

                {/* Ordre de tri */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium mb-2">
                    {translate('sort_order', language)}
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className={getSelectClasses()}
                  >
                    <option value="asc">{translate('ascending', language)}</option>
                    <option value="desc">{translate('descending', language)}</option>
                  </select>
                </motion.div>
              </motion.div>

              {/* Résumé des filtres actifs */}
              {hasActiveFilters() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {translate('active_filters', language)}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {filters.search && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {translate('search', language)}: "{filters.search}"
                        </span>
                      )}
                      {filters.status !== 'all' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {translate('status', language)}: {translate(filters.status, language)}
                        </span>
                      )}
                      {filters.type !== 'all' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {translate('type', language)}: {translate(filters.type, language)}
                        </span>
                      )}
                      {filters.startDate && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                          {translate('from', language)}: {filters.startDate}
                        </span>
                      )}
                      {filters.endDate && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {translate('to', language)}: {filters.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventFilters;