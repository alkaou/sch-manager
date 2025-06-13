import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';

const YearSelector = ({
  selectedYear,
  availableYears,
  onYearChange,
  theme,
  language
}) => {
  const selectBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const hoverColor = theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200';

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 opacity-70" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className={`
            ${selectBgColor} ${hoverColor}
            border ${borderColor} rounded-lg px-3 py-2
            text-sm font-medium cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            appearance-none pr-8
          `}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 opacity-70 absolute right-2 pointer-events-none" />
      </div>
      
      <div className="text-xs opacity-70 mt-1 text-center">
        {language === 'Français' ? 'Année scolaire' : 'School Year'}
      </div>
    </motion.div>
  );
};

export default YearSelector;