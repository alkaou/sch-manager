import React from "react";
import { motion } from "framer-motion";
import { Settings, School, BarChart2, BarChart, Layers } from "lucide-react";
import { usePayementTranslator } from "./usePayementTranslator";

const PayementsTabs = ({
  activeTab,
  setActiveTab,
  theme,
  app_bg_color,
  text_color,
  setSelectedClass
}) => {
  const { t } = usePayementTranslator();
  
  // Clear selected class when changing tabs
  const handleTabChange = (index) => {
    setActiveTab(index);
    setSelectedClass && setSelectedClass(null);
  };

  const getActiveTabTextColor = () => {
    if (theme === "dark") {
      return "text-blue-400";
    }
    return "text-blue-600";
  };

  const getTabStyle = (index) => {
    return activeTab === index
      ? `${getActiveTabTextColor()} border-blue-500 dark:border-blue-400`
      : `${text_color} hover:text-blue-500 dark:hover:text-blue-300 border-transparent`;
  };

  return (
    <div className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
      <div className="flex space-x-6 overflow-x-auto scrollbar-none py-1 px-4 md:px-6">
        <TabButton
          label={t("payment_configuration")}
          icon={<Settings size={20} />}
          active={activeTab === 0}
          onClick={() => handleTabChange(0)}
          tabStyle={getTabStyle(0)}
        />
        <TabButton
          label={t("payment_monthly_class")}
          icon={<School size={20} />}
          active={activeTab === 1}
          onClick={() => handleTabChange(1)}
          tabStyle={getTabStyle(1)}
        />
        <TabButton
          label={t("payment_yearly_class")}
          icon={<Layers size={20} />}
          active={activeTab === 2}
          onClick={() => handleTabChange(2)}
          tabStyle={getTabStyle(2)}
        />
        <TabButton
          label={t("payment_monthly_statistics")}
          icon={<BarChart size={20} />}
          active={activeTab === 3}
          onClick={() => handleTabChange(3)}
          tabStyle={getTabStyle(3)}
        />
        <TabButton
          label={t("payment_yearly_statistics")}
          icon={<BarChart2 size={20} />}
          active={activeTab === 4}
          onClick={() => handleTabChange(4)}
          tabStyle={getTabStyle(4)}
        />
      </div>
    </div>
  );
};

const TabButton = ({ label, icon, active, onClick, tabStyle }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center whitespace-nowrap py-3 font-medium transition-colors duration-200 focus:outline-none ${tabStyle}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

export default PayementsTabs;