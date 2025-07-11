import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, change, icon, theme }) => {
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const getChangeColor = () => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  };

  const ChangeIcon = () => {
    if (change > 0) return <ArrowUp size={16} className="mr-1" />;
    if (change < 0) return <ArrowDown size={16} className="mr-1" />;
    return <Minus size={16} className="mr-1" />;
  };

  return (
    <motion.div
      className={`p-5 rounded-xl shadow-lg flex flex-col justify-between ${cardBg}`}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${subTextColor}`}>{title}</h3>
        {icon}
      </div>
      <div className="mt-2">
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        {change !== undefined && change !== null && (
          <div className={`flex items-center text-sm mt-1 ${getChangeColor()}`}>
            <ChangeIcon />
            <span>{`${change.toFixed(2)}%`}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
