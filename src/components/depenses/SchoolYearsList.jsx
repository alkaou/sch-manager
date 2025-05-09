import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, Edit, Trash2, Clock, 
  Calendar, DollarSign, Search, Filter, 
  ArrowUpRight, X, Lock
} from 'lucide-react';
import { useLanguage } from '../contexts';

const SchoolYearsList = ({ 
  schoolYears, 
  onSelectSchoolYear, 
  onAddSchoolYear, 
  onEditSchoolYear, 
  onDeleteSchoolYear,
  getExpenseCount,
  getTotalExpenseAmount,
  checkYearExpired,
  app_bg_color,
  text_color,
  theme
}) => {
  const { live_language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, expired
  
  // Theme-based styling
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? text_color : 'text-gray-700';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inactiveColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  
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
  
  // Function to get appropriate filter button style
  const getFilterButtonStyle = (filterType) => {
    const isActive = filterType === filterType;
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200";
    
    if (theme === 'dark') {
      return isActive
        ? `${baseStyle} bg-blue-600 text-white`
        : `${baseStyle} bg-gray-700 text-gray-300 hover:bg-gray-600`;
    } else {
      return isActive
        ? `${baseStyle} bg-blue-500 text-white`
        : `${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300`;
    }
  };
  
  // Handler for clearing search
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 rounded-lg ${cardBgColor} border ${borderColor} shadow-sm`}>
        <div className="relative w-full md:w-2/5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className={textClass} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-10 py-2 w-full rounded-lg ${inputBgColor} ${textClass} border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={live_language.search_year || "Rechercher une année..."}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
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
          >
            {live_language.all_years || "Toutes"}
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={filterType === 'active' 
              ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white" 
              : `px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
          >
            {live_language.active_years || "Actives"}
          </button>
          <button
            onClick={() => setFilterType('expired')}
            className={filterType === 'expired' 
              ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white" 
              : `px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
          >
            {live_language.expired_years || "Expirées"}
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
            <h3 className="text-xl font-bold mb-2">{live_language.no_years_title || "Aucune année scolaire"}</h3>
            <p className="mb-6 opacity-75">{live_language.no_years_message || "Vous n'avez pas encore créé d'année scolaire. Commencez par en ajouter une."}</p>
            <button
              onClick={onAddSchoolYear}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors duration-200"
            >
              <PlusCircle size={20} className="mr-2" />
              {live_language.add_school_year || "Ajouter une année scolaire"}
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
            <h3 className="text-xl font-bold mb-2">{live_language.no_results_title || "Aucun résultat"}</h3>
            <p className="mb-6 opacity-75">{live_language.no_results_message || "Aucune année scolaire ne correspond à votre recherche."}</p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors duration-200"
            >
              <X size={20} className="mr-2" />
              {live_language.clear_search || "Effacer la recherche"}
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
                className={`${cardBgColor} border ${borderColor} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold ${textClass}`}>{year.title}</h3>
                    <div className="flex space-x-2">
                      {isExpired ? (
                        <div className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          <Lock size={12} className="mr-1" />
                          {live_language.expired || "Expirée"}
                        </div>
                      ) : (
                        <div className="flex items-center px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs">
                          <Clock size={12} className="mr-1" />
                          {live_language.active || "Active"}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Calendar size={16} className={`${textClass} mr-2 opacity-75`} />
                    <span className={`${textClass} text-sm`}>
                      {formatDate(year.start_date)} - {formatDate(year.end_date)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {live_language.expenses_count || "Dépenses"}
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xl font-bold ${textClass}`}>
                          {expenseCount}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {live_language.total_amount || "Total"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-green-500 mr-1" />
                        <span className={`text-xl font-bold ${textClass}`}>
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onSelectSchoolYear(year)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <ArrowUpRight size={20} className="mr-2" />
                      {live_language.view_details || "Voir les détails"}
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
                      >
                        <Edit size={16} className="mr-1" />
                        {live_language.edit || "Modifier"}
                      </button>
                      
                      <button
                        onClick={() => onDeleteSchoolYear(year)}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                      >
                        <Trash2 size={16} className="mr-1" />
                        {live_language.delete || "Supprimer"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default SchoolYearsList; 