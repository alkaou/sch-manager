import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Edit, Trash2, Clock, 
  Calendar, DollarSign, Search, Filter, 
  ArrowUpRight, X, Lock, FileText, Info
} from 'lucide-react';
import { useLanguage } from '../contexts';
import translations from './depense_translator';

const SchoolYearDescriptionModal = ({ isOpen, onClose, schoolYear, theme, getExpenseCount, getTotalExpenseAmount }) => {
  if (!isOpen) return null;
  
  const isDark = theme === 'dark';
  const { language } = useLanguage();
  
  // Get translation
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date with translated months
  const formatDate = (dateString) => {
    // Vérifier si dateString est une date valide
    let date;
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'number') {
      // Si c'est un timestamp (nombre)
      date = new Date(dateString);
    } else if (typeof dateString === 'string') {
      // Si c'est une chaîne de caractères (date ISO)
      date = new Date(dateString);
    } else {
      // Valeur par défaut si la date est invalide
      date = new Date();
    }
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Get translated month name
    const monthNames = [
      'month_january', 'month_february', 'month_march', 'month_april',
      'month_may', 'month_june', 'month_july', 'month_august',
      'month_september', 'month_october', 'month_november', 'month_december'
    ];
    
    const translatedMonth = t(monthNames[month]);
    
    // Format based on language
    if (language === 'Anglais') {
      return `${translatedMonth} ${day}, ${year}`;
    } else {
      return `${day} ${translatedMonth} ${year}`;
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`w-full overflow-hidden max-w-2xl rounded-xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 500 }}
        style={{height: "90vh"}}
      >
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="mr-2 text-blue-500" size={24} />
            {schoolYear.title}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            title={t('close')}
          >
            <X size={20} />
          </button>
        </div>
        
        <div 
          className="p-6 scrollbar-custom overflow-y-auto"
          style={{height: "80vh"}}
        >
          <div className="flex items-center mb-4 text-sm opacity-75">
            <Calendar size={16} className="mr-2" />
            <span>
              {formatDate(schoolYear.start_date)} - {formatDate(schoolYear.end_date)}
            </span>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} whitespace-pre-wrap`}>
            {schoolYear.description}
          </div>
          
          <div className="mt-6 text-sm opacity-75">
            <p>{t('id')}: {schoolYear.id}</p>
            <p>{t('created_on')}: {formatDate(schoolYear.created_at)}</p>
            {schoolYear.updated_at && schoolYear.updated_at !== schoolYear.created_at && (
              <p>{t('updated_on')}: {formatDate(schoolYear.updated_at)}</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SchoolYearsList = ({ 
  schoolYears, 
  onSelectSchoolYear, 
  onAddSchoolYear, 
  onEditSchoolYear, 
  onDeleteSchoolYear,
  getExpenseCount,
  getTotalExpenseAmount,
  checkYearExpired,
  text_color,
  theme
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, expired
  const [viewingYearDescription, setViewingYearDescription] = useState(null);
  
  // Get translation
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Theme-based styling
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? text_color : 'text-gray-700';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Filter schoolYears based on search and filter type
  const filteredSchoolYears = schoolYears.filter(year => {
    const matchesSearch = year.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && !checkYearExpired(year);
    if (filterType === 'expired') return matchesSearch && checkYearExpired(year);
    
    return matchesSearch;
  });
  
  
  // Handler for clearing search
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Format date for display with translated months
  const formatDate = (dateString) => {
    // Vérifier si dateString est une date valide
    let date;
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'number') {
      // Si c'est un timestamp (nombre)
      date = new Date(dateString);
    } else if (typeof dateString === 'string') {
      // Si c'est une chaîne de caractères (date ISO)
      date = new Date(dateString);
    } else {
      // Valeur par défaut si la date est invalide
      date = new Date();
    }
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Get translated month name
    const monthNames = [
      'month_january', 'month_february', 'month_march', 'month_april',
      'month_may', 'month_june', 'month_july', 'month_august',
      'month_september', 'month_october', 'month_november', 'month_december'
    ];
    
    const translatedMonth = t(monthNames[month]);
    
    // Format based on language
    if (language === 'Anglais') {
      return `${translatedMonth} ${day}, ${year}`;
    } else {
      return `${day} ${translatedMonth} ${year}`;
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="w-full">
      {/* Header with search and filters */}
      <div className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 rounded-lg ${cardBgColor} border-2 ${borderColor} shadow-md ring-1 ring-opacity-5 ring-gray-300 dark:ring-gray-700`}>
        <div className="relative w-full md:w-2/5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className={textClass} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-10 py-2 w-full rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={t('search_year')}
            title={t('search_year')}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              title={t('clear_search')}
            >
              <X size={18} className={textClass} />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={18} className={`${textClass} mr-2`} />
          <button
            onClick={() => setFilterType('all')}
            className={filterType === 'all' 
              ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white" 
              : `px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
            title={t('all_years')}
          >
            {t('all_years')}
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={filterType === 'active' 
              ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white" 
              : `px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
            title={t('active_years')}
          >
            {t('active_years')}
          </button>
          <button
            onClick={() => setFilterType('expired')}
            className={filterType === 'expired' 
              ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white" 
              : `px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
            title={t('expired_years')}
          >
            {t('expired_years')}
          </button>
        </div>
      </div>
      
      {/* Empty state */}
      {schoolYears.length === 0 ? (
        <motion.div 
          className={`${cardBgColor} ${textClass} border ${borderColor} rounded-lg p-8 text-center shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center">
            <Calendar size={64} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('no_years_title')}</h3>
            <p className="mb-6 opacity-75">{t('no_years_message')}</p>
            <button
              onClick={onAddSchoolYear}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors duration-200"
              title={t('add_school_year_tooltip')}
            >
              <PlusCircle size={20} className="mr-2" />
              {t('add_school_year')}
            </button>
          </div>
        </motion.div>
      ) : filteredSchoolYears.length === 0 ? (
        <motion.div 
          className={`${cardBgColor} ${textClass} border ${borderColor} rounded-lg p-8 text-center shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center">
            <Search size={64} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('no_results_title')}</h3>
            <p className="mb-6 opacity-75">{t('no_results_message')}</p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors duration-200"
              title={t('clear_search')}
            >
              <X size={20} className="mr-2" />
              {t('clear_search')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {filteredSchoolYears.map((year) => {
            const isExpired = checkYearExpired(year);
            const expenseCount = getExpenseCount(year.id);
            const totalAmount = getTotalExpenseAmount(year.id);
            
            return (
              <motion.div
                key={year.id}
                variants={item}
                className={`${cardBgColor} border-2 ${borderColor} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ring-1 ring-opacity-5 ring-gray-300 dark:ring-gray-700`}
              >
                <div className="p-6 overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg sm:text-xl font-bold ${textClass} break-words overflow-hidden max-w-[75%]`}>{year.title}</h3>
                    <div className="flex space-x-2 flex-shrink-0 ml-2">
                      {isExpired ? (
                        <div className="flex items-center px-2 py-1 bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-300 rounded-full text-xs">
                          <Lock size={12} className="mr-1" />
                          {t('expired')}
                        </div>
                      ) : (
                        <div className="flex items-center px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs">
                          <Clock size={12} className="mr-1" />
                          {t('active')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View Description Button */}
                  <button
                    onClick={() => setViewingYearDescription(year)}
                    className={`mb-3 w-full flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    title={t('view_school_year_description')}
                  >
                    <Info size={14} className="mr-1.5 text-blue-500" />
                    <span className="truncate">{t('view_school_year_description')}</span>
                  </button>
                  
                  <div className="flex items-center mb-3 overflow-hidden">
                    <Calendar size={16} className={`${textClass} mr-2 opacity-75 flex-shrink-0`} />
                    <span className={`${textClass} text-xs sm:text-sm truncate`}>
                      {formatDate(year.start_date)} - {formatDate(year.end_date)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('expenses_count')}
                      </div>
                      <div className="flex items-center">
                        <span className={`text-lg sm:text-xl font-bold ${textClass}`}>
                          {expenseCount}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('total_amount')}
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-green-500 mr-1 flex-shrink-0" />
                        <span className={`text-lg sm:text-xl font-bold ${textClass} truncate`}>
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onSelectSchoolYear(year)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                      title={t('view_details')}
                    >
                      <ArrowUpRight size={20} className="mr-2" />
                      {t('view_details')}
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditSchoolYear(year)}
                        disabled={isExpired}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 
                          ${isExpired 
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`
                        }
                        title={isExpired ? t('school_year_expired_readonly') : t('edit')}
                      >
                        <Edit size={16} className="mr-1" />
                        {t('edit')}
                      </button>
                      
                      <button
                        onClick={() => onDeleteSchoolYear(year)}
                        disabled={isExpired}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-colors duration-200
                          ${isExpired 
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'}`
                        }
                        title={isExpired ? t('school_year_expired_readonly') : t('delete')}
                      >
                        <Trash2 size={16} className="mr-1" />
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      
      {/* School Year Description Modal */}
      <AnimatePresence>
        {viewingYearDescription && (
          <SchoolYearDescriptionModal 
            isOpen={Boolean(viewingYearDescription)}
            onClose={() => setViewingYearDescription(null)}
            schoolYear={viewingYearDescription}
            theme={theme}
            getExpenseCount={getExpenseCount}
            getTotalExpenseAmount={getTotalExpenseAmount}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolYearsList;
