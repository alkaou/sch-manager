import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts';
import { translate } from './statistique_translator';
import {
  getMonthlyExpensesForYear,
  getTotalExpensesPerYear,
  compareLastTwoYears,
  getExpensesByCategoryForYear,
} from './expenses/analysticsExpensesMethod';

import YearSelector from './expenses/YearSelector.jsx';
import ViewModeSwitcher from './expenses/ViewModeSwitcher.jsx';
import StatsCard from './expenses/StatsCard.jsx';
import MonthlyChart from './expenses/MonthlyChart.jsx';
import YearlyComparisonChart from './expenses/YearlyComparisonChart.jsx';
import TwoYearComparison from './expenses/TwoYearComparison.jsx';
import CategoryPieChart from './expenses/CategoryPieChart.jsx';
import YearlyTotals from './expenses/YearlyTotals.jsx';

import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';

const StatisticsExpenses = ({ database, theme }) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState('monthly');

  const t = (key) => translate(key, language);

  const schoolYears = useMemo(() => {
    if (!database?.schoolYears) return [];
    return [...database.schoolYears].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  }, [database]);

  const expenses = useMemo(() => database?.expenses || [], [database]);

  const [selectedYearId, setSelectedYearId] = useState(schoolYears[0]?.id || null);

  const selectedSchoolYear = useMemo(() => {
    return schoolYears.find(y => y.id === selectedYearId);
  }, [selectedYearId, schoolYears]);

  const monthlyData = useMemo(() => {
    if (!selectedSchoolYear) return [];
    return getMonthlyExpensesForYear(expenses, selectedSchoolYear);
  }, [expenses, selectedSchoolYear]);

  const yearlyData = useMemo(() => {
    return getTotalExpensesPerYear(expenses, schoolYears);
  }, [expenses, schoolYears]);

  const categoryData = useMemo(() => {
    if (!selectedSchoolYear) return [];
    return getExpensesByCategoryForYear(expenses, selectedSchoolYear);
  }, [expenses, selectedSchoolYear]);

  const comparisonData = useMemo(() => {
    return compareLastTwoYears(expenses, schoolYears);
  }, [expenses, schoolYears]);

  if (!database || !expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Info size={48} className="text-blue-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{t('no_expense_data_title')}</h2>
        <p className="text-gray-400">{t('no_expense_data_message')}</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'monthly':
        return <MonthlyChart data={monthlyData} theme={theme} schoolYear={selectedSchoolYear} />;
      case 'yearly':
        return <YearlyComparisonChart data={yearlyData} theme={theme} />;
      case 'comparison':
        return <TwoYearComparison data={comparisonData} theme={theme} />;
      case 'totals':
        return <YearlyTotals data={yearlyData} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col space-y-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold uppercase">{t('expense_statistics_title')}</h1>
        </div>
        <div className="flex items-center gap-4">
          {viewMode === 'monthly' && schoolYears.length > 0 && (
            <YearSelector
              schoolYears={schoolYears}
              selectedYearId={selectedYearId}
              onYearChange={setSelectedYearId}
              theme={theme}
            />
          )}
          <ViewModeSwitcher
            currentMode={viewMode}
            onModeChange={setViewMode}
            theme={theme}
          />
        </div>
      </motion.header>

      <main className="flex-grow grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Main content area for charts */}
        <div className="xl:col-span-3 h-[500px] xl:h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full h-full bg-gray-800/50 rounded-xl shadow-lg p-4"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar area for extra stats and pie chart */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Show comparison card except in comparison view to avoid redundancy */}
          {viewMode !== 'comparison' && comparisonData && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <StatsCard
                title={t('last_two_years_comparison')}
                value={`${comparisonData.growthRate.toFixed(1)}%`}
                change={comparisonData.growthRate}
                icon={comparisonData.growthRate >= 0 ? <TrendingUp /> : <TrendingDown />}
                theme={theme}
              />
            </motion.div>
          )}

          {/* Always show category pie chart */}
          <CategoryPieChart 
            data={categoryData} 
            schoolYear={selectedSchoolYear} 
          />
        </div>
      </main>
    </div>
  );
};

export default StatisticsExpenses;