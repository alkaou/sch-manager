import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts";
import { translate } from "./statistique_translator";
import { getTotalExpensesPerYear } from "./expenses/analysticsExpensesMethod";
import { getRevenuePerSchoolYear } from "./expenses_and_revenu/analysticsExpensesAndRevenuMethod";
import ComparisonControls from "./expenses_and_revenu/ComparisonControls.jsx";
import ComparisonChart from "./expenses_and_revenu/ComparisonChart.jsx";
import ComparisonSummary from "./expenses_and_revenu/ComparisonSummary.jsx";
import PageLoading from "../partials/PageLoading.jsx";
import { AlertTriangle } from "lucide-react";

const StatisticsExpensesAndRevenu = ({ database, theme, text_color }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // State for selected years
  const [selectedExpenseYear, setSelectedExpenseYear] = useState(null);
  const [selectedRevenueYear, setSelectedRevenueYear] = useState(null);

  // Memoized data processing
  const expensesData = useMemo(() => {
    if (!database || !database.expenses || !database.schoolYears) return [];
    const _expensesData = getTotalExpensesPerYear(
      database.expenses,
      database.schoolYears
    );
    const sortData = _expensesData.sort((a, b) => b.created_at - a.created_at);
    return sortData;
  }, [database]);

  const revenueData = useMemo(() => {
    if (!database) return [];
    const _revenueData = getRevenuePerSchoolYear(database);
    const sortRevenueData = _revenueData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sortRevenueData;
  }, [database]);

  // Set default selected years once data is loaded
  useEffect(() => {
    if (expensesData.length > 0 && !selectedExpenseYear) {
      setSelectedExpenseYear(expensesData[0]); // Default to last year
    }
    if (revenueData.length > 0 && !selectedRevenueYear) {
      setSelectedRevenueYear(revenueData[0]); // Default to last year
    }
    setLoading(false);
  }, [expensesData, revenueData, selectedExpenseYear, selectedRevenueYear]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <PageLoading />;
  }

  if (expensesData.length === 0 || revenueData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${text_color}`}>
          {translate("no_comparison_data_title", language)}
        </h2>
        <p className={`${text_color} opacity-75`}>
          {translate("no_comparison_data_message", language)}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ComparisonControls
          expensesYears={expensesData}
          revenueYears={revenueData}
          selectedExpenseYear={selectedExpenseYear}
          setSelectedExpenseYear={setSelectedExpenseYear}
          selectedRevenueYear={selectedRevenueYear}
          setSelectedRevenueYear={setSelectedRevenueYear}
          theme={theme}
          text_color={text_color}
        />
      </motion.div>

      {selectedExpenseYear && selectedRevenueYear && (
        <>
          <motion.div variants={itemVariants}>
            <ComparisonSummary
              expenseYear={selectedExpenseYear}
              revenueYear={selectedRevenueYear}
              theme={theme}
              text_color={text_color}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ComparisonChart
              expenseYear={selectedExpenseYear}
              revenueYear={selectedRevenueYear}
              theme={theme}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default StatisticsExpensesAndRevenu;
