import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import translations from './enrollements_traduction';
import { useLanguage } from '../contexts';

const StatsCard = ({
  title,
  value,
  previousValue,
  icon: Icon,
  theme,
  app_bg_color,
  text_color,
  className = "",
  evolutionTextColor = "",
}) => {
  const { language } = useLanguage();
  
  // Fonction helper pour les traductions
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  // Calcul du pourcentage de changement
  const calculatePercentageChange = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue * 100).toFixed(1);
  };

  const percentageChange = calculatePercentageChange();
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  // Styles adaptatifs selon le thème
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const iconBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const valueTextColor = evolutionTextColor !== "" ? evolutionTextColor : theme === "dark" ? "text-white" : "text-gray-900";
  const titleTextColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  
  // Couleurs pour les tendances
  const trendColors = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: theme === "dark" ? "text-gray-400" : "text-gray-500"
  };

  const trendBgColors = {
    positive: "bg-green-50 border-green-200",
    negative: "bg-red-50 border-red-200",
    neutral: theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
  };

  const getTrendColor = () => {
    if (isPositive) return trendColors.positive;
    if (isNegative) return trendColors.negative;
    return trendColors.neutral;
  };

  const getTrendBgColor = () => {
    if (theme === "dark") {
      if (isPositive) return "bg-green-900/20 border-green-700/30";
      if (isNegative) return "bg-red-900/20 border-red-700/30";
      return "bg-gray-700 border-gray-600";
    }
    if (isPositive) return trendBgColors.positive;
    if (isNegative) return trendBgColors.negative;
    return trendBgColors.neutral;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: theme === "dark" 
          ? "0 10px 25px rgba(0, 0, 0, 0.3)" 
          : "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
      className={`
        ${cardBgColor} ${borderColor} ${className}
        border rounded-xl p-6 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:shadow-xl cursor-pointer
        relative overflow-hidden
      `}
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Titre */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`${titleTextColor} text-sm font-medium mb-2 tracking-wide`}
          >
            {title}
          </motion.p>
          
          {/* Valeur principale */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`${valueTextColor} text-3xl font-bold mb-3`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.div>
          
          {/* Indicateur de tendance */}
          {percentageChange !== null && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${getTrendBgColor()} ${getTrendColor()} border
              `}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : isNegative ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : null}
              {Math.abs(percentageChange)}%
              <span className="ml-1 opacity-75">
                {isPositive ? t('increase') : isNegative ? t('decrease') : t('stable')}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Icône */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`
            ${iconBgColor} p-3 rounded-lg
            transition-all duration-300 ease-in-out
          `}
        >
          {Icon && (
            <Icon 
              className={`w-6 h-6 ${
                evolutionTextColor !== "" ? evolutionTextColor :
                theme === "dark" ? "text-gray-300" : "text-gray-600"}
              `} 
            />
          )}
        </motion.div>
      </div>
      
      {/* Barre de progression subtile en bas */}
      {percentageChange !== null && (
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
        />
      )}
    </motion.div>
  );
};

export default StatsCard;