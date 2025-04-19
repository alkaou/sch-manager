import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from "lucide-react";
import { gradients } from '../../utils/colors';

const PayementsTabs = ({
  activeTab,
  setActiveTab,
  theme,
  app_bg_color,
  text_color,
  setSelectedClass
}) => {
  const tabs = [
    {
      id: 0,
      title: "Configuration",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 1,
      title: "Budget Mensuel",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Budget Annuel",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Statistique Mensuelle",
      icon: (
        <TrendingUp className="h-4 w-4" />
      )
    },
    {
      id: 4,
      title: "Statistique Annuelle",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  // Styles en fonction du thème
  const tabsBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const activeTabBgColor = app_bg_color === gradients[1] || app_bg_color === gradients[2] || theme === "dark" ?
    "bg-gradient-to-r from-blue-500 to-indigo-600" :
    "bg-gradient-to-r from-white to-white";
  const hoverTabBgColor = theme === "dark" ? "hover:bg-gray-700" : 
      app_bg_color === gradients[1] || app_bg_color === gradients[2] ?
      "hover:bg-gray-200" : "hover:hover:bg-gray-400";
  const tabTextColor = text_color;
  const activeTextColor = text_color;
  const borderColor = app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "border-gray-400" : "border-white";

  return (
    <div className={`${tabsBgColor} border-b-2 mt-5 ${borderColor} shadow-md`}>
      <div className="container mx-auto px-2">
        <div className="flex overflow-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedClass(null);
              }}
              className={`flex items-center space-x-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                ? `${activeTextColor}`
                : `${tabTextColor} ${hoverTabBgColor}`
                }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.icon}
              <span>{tab.title}</span>

              {/* Indicateur d'onglet actif */}
              {activeTab === tab.id && (
                <motion.div
                  className={`absolute bottom-0 left-0 w-full h-1 ${activeTabBgColor}`}
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayementsTabs;