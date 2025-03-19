import React from 'react';
import { motion } from 'framer-motion';
import { X, Filter, Download, Settings, Users } from 'lucide-react';
import { translations } from '../../utils/bulletin_translation';


const BulletinHeader = ({
  handleCloseComponent,
  selectedComposition,
  className,
  theme,
  buttonPrimary,
  buttonSecondary,
  setShowSettings,
  setShowFilters,
  handleGeneratePDF,
  generating,
  selectedStudents,
  filteredStudents,
  language
}) => {
  // Animation variants
  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-md px-6 py-4`}
      variants={headerVariants}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and composition info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">{translations[language].title}</span>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {filteredStudents.length}
            </span>
          </h1>
          <div className="text-sm opacity-75 mt-1">
            <span className="font-semibold">{selectedComposition.label}</span> • <span>{className}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Filter button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={setShowFilters}
            className={`${buttonSecondary} text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md flex items-center`}
          >
            <Filter size={18} className="mr-1" />
            <span className="hidden sm:inline">{translations[language].filters}</span>
          </motion.button>

          {/* Settings button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={setShowSettings}
            className={`${buttonSecondary} text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md flex items-center`}
          >
            <Settings size={18} className="mr-1" />
            <span className="hidden sm:inline">{translations[language].settings}</span>
          </motion.button>

          {/* Selected students count */}
          {selectedStudents.length > 0 && (
            <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center">
              <Users size={18} className="mr-1" />
              <span>{selectedStudents.length} {translations[language].selected}</span>
            </div>
          )}

          {/* Generate PDF button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePDF}
            disabled={generating}
            className={`${buttonPrimary} text-white px-4 py-2 rounded-md flex items-center ${generating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Download size={18} className={`mr-2 ${generating ? 'animate-bounce' : ''}`} />
            <span>{generating ? translations[language].generating : translations[language].generatePDF}</span>
          </motion.button>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCloseComponent}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
          >
            <X size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BulletinHeader;