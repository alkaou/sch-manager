import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, Filter, ArrowUpDown, CheckSquare, SortAsc, SortDesc } from 'lucide-react';
import { translations } from '../../utils/bulletin_translation';

const BulletinFilters = ({
  theme,
  cardBgColor,
  textClass,
  buttonPrimary,
  buttonSecondary,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  selectAllStudents,
  selectedStudents,
  filteredStudents,
  language,
  closeFilters
}) => {
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Check if all students are selected
  const allSelected = selectedStudents.length === filteredStudents.length && filteredStudents.length > 0;

  return (
    <motion.div
      className="absolute z-20 top-20 left-6 w-full max-w-md"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={`${cardBgColor} ${textClass} rounded-lg shadow-xl p-5 border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <Filter size={20} className="mr-2" />
            {translations[language].filters}
          </h3>
          <button
            onClick={closeFilters}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Search input */}
          <div>
            <label className="block mb-2 font-medium flex items-center">
              <Search size={18} className="mr-2" />
              {translations[language].search}
            </label>
            <div className="relative">
            {/* Dans la partie de recherche, assurons-nous que l'événement est correctement géré */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  console.log("Search term changed:", e.target.value); // Ajout de log pour déboguer
                }}
                placeholder={translations[language].search}
                className={`w-full p-3 pl-10 rounded-lg border ${theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort options */}
          <div>
            <label className="block mb-2 font-medium flex items-center">
              <ArrowUpDown size={18} className="mr-2" />
              {translations[language].sortBy}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSortOrder('rank')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center transition-all ${sortOrder === 'rank'
                  ? `${buttonPrimary} text-white`
                  : `${buttonSecondary} text-gray-700 dark:text-gray-200`
                  }`}
              >
                <SortAsc size={16} className="mr-1" />
                {translations[language].rank}
              </button>

              <button
                onClick={() => setSortOrder('name')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center transition-all ${sortOrder === 'name'
                  ? `${buttonPrimary} text-white`
                  : `${buttonSecondary} text-gray-700 dark:text-gray-200`
                  }`}
              >
                <SortAsc size={16} className="mr-1" />
                {translations[language].name}
              </button>

              <button
                onClick={() => setSortOrder('average')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center transition-all ${sortOrder === 'average'
                  ? `${buttonPrimary} text-white`
                  : `${buttonSecondary} text-gray-700 dark:text-gray-200`
                  }`}
              >
                <SortDesc size={16} className="mr-1" />
                {translations[language].average}
              </button>
            </div>
          </div>

          {/* Select all option */}
          <div>
            <button
              onClick={selectAllStudents}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all ${allSelected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : `${buttonSecondary} text-gray-700 dark:text-gray-200`
                }`}
            >
              <CheckSquare size={18} className="mr-2" />
              {allSelected
                ? `${translations[language].selectAll} (${selectedStudents.length})`
                : translations[language].selectAll}
            </button>
          </div>

          {/* Results count */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {filteredStudents.length} {translations[language].studentsFound}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BulletinFilters;