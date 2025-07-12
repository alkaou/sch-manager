import React from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign } from "lucide-react";
import { useLanguage } from "../../contexts";
import { translate } from "../statistique_translator";

const YearlyTotals = ({ data, theme }) => {
  const { language } = useLanguage();
  const locale = language === "Anglais" ? "en-US" : "fr-FR";
  const formatCurrency = (value) => new Intl.NumberFormat(locale).format(value);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-bold mb-6 text-white text-center">
        {translate("expense_statistics_total", language)}
      </h3>
      <div className="overflow-y-auto scrollbar-custom pr-2">
        <div className="space-y-4">
          {data
            .sort((a, b) => b.created_at - a.created_at)
            .map((year) => (
              <motion.div
                key={year.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"
                }`}
                variants={itemVariants}
              >
                <div className="flex items-center gap-4">
                  <Calendar className="text-blue-400" size={24} />
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {year.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-lg text-green-400">
                  <DollarSign size={18} />
                  <span>{formatCurrency(year.total)}</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default YearlyTotals;
