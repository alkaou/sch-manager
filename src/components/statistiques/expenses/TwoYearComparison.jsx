import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useLanguage } from '../../contexts';
import { translate } from '../statistique_translator';
import StatsCard from './StatsCard.jsx';

const TwoYearComparison = ({ data, theme }) => {
  const { language } = useLanguage();
  const t = (key) => translate(key, language);

  if (!data || !data.lastYear || !data.previousYear) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-gray-800/50 rounded-xl shadow-lg">
        <p className="text-white">{t('no_data_for_comparison')}</p>
      </div>
    );
  }

  const { lastYear, previousYear, difference, growthRate } = data;
  const locale = language === 'Anglais' ? 'en-US' : 'fr-FR';

  const formatCurrency = (value) => new Intl.NumberFormat(locale).format(value);

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-between"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h3 className="text-xl font-bold mb-6 text-white text-center">{t('last_two_years_comparison')}</h3>
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Previous Year Card */}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className={`p-4 rounded-lg bg-gray-700/60 w-64 text-center`}>
              <h4 className="font-semibold text-lg text-gray-300">{previousYear.title}</h4>
              <p className="text-2xl font-bold text-white mt-2">{formatCurrency(previousYear.total)}</p>
            </div>
          </motion.div>

          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
            <ArrowRight size={40} className="text-blue-400 my-4 md:my-0" />
          </motion.div>

          {/* Last Year Card */}
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className={`p-4 rounded-lg bg-gray-700/60 w-64 text-center`}>
              <h4 className="font-semibold text-lg text-gray-300">{lastYear.title}</h4>
              <p className="text-2xl font-bold text-white mt-2">{formatCurrency(lastYear.total)}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title={t('difference')} 
          value={formatCurrency(difference)} 
          icon={<DollarSign />} 
          theme={theme} 
        />
        <StatsCard 
          title={t('growth_rate')} 
          value={`${growthRate.toFixed(1)}%`} 
          change={growthRate} 
          icon={growthRate >= 0 ? <TrendingUp /> : <TrendingDown />} 
          theme={theme} 
        />
      </div>
    </motion.div>
  );
};

export default TwoYearComparison;
