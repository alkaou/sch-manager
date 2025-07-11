import React from 'react';
import { ChevronDown } from 'lucide-react';
import { translate } from '../statistique_translator';
import { useLanguage } from '../../contexts';

const YearSelector = ({ schoolYears, selectedYearId, onYearChange, theme }) => {
  const { language } = useLanguage();

  const t = (key) => translate(key, language);

  const selectBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const selectTextColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const selectBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="relative min-w-[250px]">
      <select
        value={selectedYearId || ''}
        onChange={(e) => onYearChange(e.target.value)}
        className={`appearance-none w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium ${selectBgColor} ${selectTextColor} ${selectBorderColor}`}
      >
        {schoolYears.map((year) => (
          <option key={year.id} value={year.id}>
            {year.title}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
        <ChevronDown size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
      </div>
    </div>
  );
};

export default YearSelector;
