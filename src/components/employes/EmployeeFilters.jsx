import React from 'react';
import { motion } from 'framer-motion';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { useTheme } from '../contexts';

const EmployeeFilters = ({ 
  filters, 
  setFilters, 
  positionName 
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Theme-based styling
  const containerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonColor = theme === 'dark' 
    ? 'bg-gray-700 hover:bg-gray-600' 
    : 'bg-gray-200 hover:bg-gray-300';
  const activeFilterBg = theme === 'dark' ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100';

  const _text_color = app_bg_color === gradients[1] ||
        app_bg_color === gradients[2] ||
        theme === "dark" ? text_color : "text-gray-700";
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${containerBg} border ${borderColor} rounded-lg p-4 mb-4 shadow-md`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Position Title */}
        <div className="flex-1">
          <h2 className={`text-xl font-bold ${_text_color}`}>
            Employés: {positionName}
          </h2>
        </div>
        
        {/* Search */}
        <div className="w-full md:w-auto md:flex-1">
          <div className={`flex items-center px-3 py-2 rounded-md ${inputBgColor}`}>
            <Search size={18} className={`${_text_color} opacity-60 mr-2`} />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className={`bg-transparent outline-none w-full ${_text_color}`}
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`px-3 py-2 rounded-md appearance-none ${inputBgColor} ${_text_color} pr-8 cursor-pointer focus:ring-2 focus:ring-blue-500`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="All">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
        
        {/* Sort By */}
        <div>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className={`px-3 py-2 rounded-md appearance-none ${inputBgColor} ${_text_color} pr-8 cursor-pointer focus:ring-2 focus:ring-blue-500`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="name">Nom</option>
            <option value="added_at">Date d'ajout</option>
            <option value="service_started_at">Date de service</option>
            <option value="status">Statut</option>
          </select>
        </div>
        
        {/* Sort Direction Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSortOrder}
          className={`p-2 rounded-md ${buttonColor} ${_text_color}`}
          title={filters.sortOrder === 'asc' ? 'Tri ascendant' : 'Tri descendant'}
        >
          {filters.sortOrder === 'asc' ? (
            <SortAsc size={20} />
          ) : (
            <SortDesc size={20} />
          )}
        </motion.button>
      </div>
      
      {/* Active filters display */}
      {(filters.searchTerm || filters.status !== 'All') && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className={`text-sm ${_text_color}`}>Filtres actifs:</span>
          
          {filters.searchTerm && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 rounded-md ${activeFilterBg} text-sm ${_text_color} flex items-center`}
            >
              <span>Recherche: {filters.searchTerm}</span>
              <button 
                onClick={() => handleFilterChange('searchTerm', '')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </motion.div>
          )}
          
          {filters.status !== 'All' && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 rounded-md ${activeFilterBg} text-sm ${_text_color} flex items-center`}
            >
              <span>Statut: {filters.status === 'actif' ? 'Actifs' : 'Inactifs'}</span>
              <button 
                onClick={() => handleFilterChange('status', 'All')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setFilters(prev => ({
                ...prev,
                searchTerm: '',
                status: 'All'
              }));
            }}
            className={`px-2 py-1 text-sm ${buttonColor} ${_text_color} rounded-md ml-auto`}
          >
            Réinitialiser les filtres
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeFilters; 