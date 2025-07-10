import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Landmark,
  School,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './statistique_translator';

const StatisticsSidebar = ({ activeStat, setActiveStat, theme }) => {
  const { language } = useLanguage();

  const sidebarItems = [
    { key: 'students_stats', icon: <Users size={24} /> },
    { key: 'staff_stats', icon: <Briefcase size={24} /> },
    { key: 'finance_stats', icon: <Landmark size={24} /> },
    { key: 'classes_stats', icon: <School size={24} /> },
    { key: 'exams_stats', icon: <ClipboardCheck size={24} /> },
  ];

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    hover: { scale: 1.1, originX: 0 },
    tap: { scale: 0.95 },
  };

  const getBackgroundColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  };

  const getActiveItemColor = () => {
    return theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white';
  };
  
  const getInactiveItemColor = () => {
    return theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className={`h-full ${getBackgroundColor()} ${getTextColor()} p-4 rounded-lg shadow-lg flex flex-col`}
      style={{ border: theme === 'dark' ? '1px solid #4A5568' : '1px solid #E2E8F0' }}
    >
      <div className="flex items-center mb-8">
        <BarChart3 size={32} className="text-blue-500" />
        <h2 className="text-2xl font-bold ml-3">{translate('stats_title', language)}</h2>
      </div>
      <motion.ul
        className="space-y-3"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {sidebarItems.map((item) => (
          <motion.li
            key={item.key}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setActiveStat(item.key)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-300 ${activeStat === item.key ? getActiveItemColor() : getInactiveItemColor()}`}
          >
            {item.icon}
            <span className="ml-4 font-medium">{translate(item.key, language)}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default StatisticsSidebar;
