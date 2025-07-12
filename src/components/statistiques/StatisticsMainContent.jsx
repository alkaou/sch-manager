import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart2 } from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './statistique_translator';
import PageLoading from '../partials/PageLoading.jsx';
import EnrollmentStats from '../enrollements/EnrollmentStats.jsx';
import StatisticsExpenses from './StatisticsExpenses.jsx';
import StatisticsExpensesAndRevenu from './StatisticsExpensesAndRevenu.jsx';

const StatisticsMainContent = ({
  activeStat,
  theme,
  database,
  loadingData,
  refreshData,
  app_bg_color,
  text_color,
}) => {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const renderContent = () => {
    if (loadingData || !database) {
      return <PageLoading />;
    }

    switch (activeStat) {
      case 'students_stats':
        return <EnrollmentStats database={database} refreshData={refreshData} />;
      case 'expense_stats':
        return <StatisticsExpenses database={database} theme={theme} app_bg_color={app_bg_color} text_color={text_color} />;
      case 'finance_stats_and_expense':
        return <StatisticsExpensesAndRevenu database={database} theme={theme} app_bg_color={app_bg_color} text_color={text_color} />;
      case '':
        return (
          <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <BarChart2 size={64} className="text-yellow-500 mb-6" />
            <h2 className={`text-2xl font-semibold ${text_color}`}>{translate('welcome', language)}</h2>
            <p className={`text-lg mt-4 ${text_color} opacity-75`}>
              {translate('welcome_to_statistique_description', language)}
            </p>
          </div>
        );
      default:
        return (
          <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <AlertTriangle size={64} className="text-yellow-500 mb-6" />
            <h2 className={`text-2xl font-semibold ${text_color}`}>{translate(activeStat, language)}</h2>
            <p className={`text-lg mt-4 ${text_color} opacity-75`}>
              {translate('no_stats_available', language)}
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      key={activeStat}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-full h-full overflow-y-auto scrollbar-custom ${app_bg_color} p-4`}
    >
      {renderContent()}
    </motion.div>
  );
};

export default StatisticsMainContent;
