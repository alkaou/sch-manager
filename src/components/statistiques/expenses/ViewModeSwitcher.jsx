import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts';
import { translate } from '../statistique_translator';

const ViewModeSwitcher = ({ currentMode, onModeChange, theme }) => {
  const { language } = useLanguage();
  const t = (key) => translate(key, language);

  const modes = [
    { key: 'monthly', labelKey: 'monthly_view' },
    { key: 'yearly', labelKey: 'yearly_view' },
    { key: 'comparison', labelKey: 'comparison_view' },
    { key: 'totals', labelKey: 'totals_view' },
  ];

  const baseBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const activeBg = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const activeTextColor = 'text-white';

  return (
    <div className={`flex p-1 rounded-lg ${baseBg} space-x-1`}>
      {modes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onModeChange(mode.key)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${textColor}`}
        >
          {currentMode === mode.key && (
            <motion.div
              layoutId="active-expense-view-pill"
              className={`absolute inset-0 ${activeBg} rounded-md`}
              style={{ borderRadius: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${currentMode === mode.key ? activeTextColor : ''}`}>
            {t(mode.labelKey)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ViewModeSwitcher;
