import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './statistique_translator';

const StatisticsMainContent = ({ activeStat, theme }) => {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const getBackgroundColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };

  return (
    <motion.div
      key={activeStat} // Permet de ré-animer le composant à chaque changement de stat
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`h-full w-full p-8 rounded-lg shadow-lg flex flex-col justify-center items-center ${getBackgroundColor()} ${getTextColor()}`}
      style={{ border: theme === 'dark' ? '1px solid #4A5568' : '1px solid #E2E8F0' }}
    >
        <AlertTriangle size={64} className="text-yellow-500 mb-6"/>
        <h2 className="text-2xl font-semibold text-center">{translate(activeStat, language)}</h2>
        <p className="text-lg mt-4 text-center">
            {translate('no_stats_available', language)}
        </p>
    </motion.div>
  );
};

export default StatisticsMainContent;
