import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  DollarSign,
  CreditCard,
  Target
} from "lucide-react";
import { useLanguage, useFlashNotification } from '../components/contexts';
import StatisticsNavigation from '../components/statistiques/StatisticsNavigation.jsx';
import OverviewDashboard from '../components/statistiques/OverviewDashboard.jsx';
import EnrollmentAnalytics from '../components/statistiques/EnrollmentAnalytics.jsx';
import FinancialAnalytics from '../components/statistiques/FinancialAnalytics.jsx';
import PaymentAnalytics from '../components/statistiques/PaymentAnalytics.jsx';
import ExpenseAnalytics from '../components/statistiques/ExpenseAnalytics.jsx';
import ComparisonAnalytics from '../components/statistiques/ComparisonAnalytics.jsx';
import YearSelector from '../components/statistiques/YearSelector.jsx';
import LoadingSpinner from '../components/statistiques/LoadingSpinner.jsx';
import { getCurrentSchoolYear } from '../utils/schoolYear';
import { gradients } from '../utils/colors';

const StatistiquesPageContent = ({
  app_bg_color,
  text_color,
  theme,
  database,
  refreshData,
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  
  // États principaux
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(getCurrentSchoolYear());
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('detailed'); // overview, detailed, comparison
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('year'); // month, quarter, year
  
  // Données calculées
  const availableYears = useMemo(() => {
    if (!database) return [getCurrentSchoolYear()];
    
    const years = new Set();
    
    // Années des systèmes de paiement
    if (database.paymentSystems) {
      database.paymentSystems.forEach(system => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();
        years.add(`${startYear}-${endYear}`);
      });
    }
    
    // Années des snapshots d'effectifs
    if (database.snapshots) {
      database.snapshots.forEach(snapshot => {
        years.add(snapshot.schoolYear);
      });
    }
    
    // Années des dépenses
    if (database.schoolYears) {
      database.schoolYears.forEach(schoolYear => {
        years.add(schoolYear.name);
      });
    }
    
    return Array.from(years).sort().reverse();
  }, [database]);
  
  // Styles basés sur le thème
  const isOthersBGColors = app_bg_color === gradients[1] || app_bg_color === gradients[2] || theme === "dark" ? false : true;
  const containerBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const _text_color = isOthersBGColors ? "text-gray-700" : text_color;
  
  // Gestion du rafraîchissement
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      setFlashMessage({
        message: language === 'Français' ? "Données rafraîchies avec succès" : "Data refreshed successfully",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setFlashMessage({
        message: language === 'Français' ? "Erreur lors du rafraîchissement" : "Error refreshing data",
        type: "error",
        duration: 3000
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Rendu du contenu principal
  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingSpinner theme={theme} />;
    }
    
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewDashboard
            database={database}
            selectedYear={selectedYear}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
          />
        );
      case 'enrollment':
        return (
          <EnrollmentAnalytics
            database={database}
            selectedYear={selectedYear}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
            chartType={chartType}
            viewMode={viewMode}
          />
        );
      case 'financial':
        return (
          <FinancialAnalytics
            database={database}
            selectedYear={selectedYear}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
            chartType={chartType}
            timeRange={timeRange}
          />
        );
      case 'payments':
        return (
          <PaymentAnalytics
            database={database}
            selectedYear={selectedYear}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
            chartType={chartType}
          />
        );
      case 'expenses':
        return (
          <ExpenseAnalytics
            database={database}
            selectedYear={selectedYear}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
            chartType={chartType}
          />
        );
      case 'comparison':
        return (
          <ComparisonAnalytics
            database={database}
            availableYears={availableYears}
            theme={theme}
            textColor={_text_color}
            cardBg={cardBg}
            borderColor={borderColor}
            language={language}
            chartType={chartType}
          />
        );
      default:
        return null;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div 
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
      className={`overflow-auto scrollbar-custom min-h-screen ${containerBg} ${_text_color} transition-all duration-300`}
    >
      <motion.div 
        className="p-6 pt-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* En-tête */}
        <motion.div 
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6 mb-6`}
          variants={headerVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {language === 'Français' ? 'Tableau de Bord Statistiques' : 'Statistics Dashboard'}
                </h1>
                <p className="text-sm opacity-70 mt-1">
                  {language === 'Français' 
                    ? 'Analyse complète des données de l\'établissement' 
                    : 'Complete analysis of school data'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sélecteur d'année */}
              <YearSelector
                selectedYear={selectedYear}
                availableYears={availableYears}
                onYearChange={setSelectedYear}
                theme={theme}
                language={language}
              />
              
              {/* Bouton de rafraîchissement */}
              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`
                  px-4 py-2 rounded-lg border ${borderColor} 
                  ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                  transition-all duration-200 flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {language === 'Français' ? 'Actualiser' : 'Refresh'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Navigation */}
        <StatisticsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          theme={theme}
          textColor={_text_color}
          cardBg={cardBg}
          borderColor={borderColor}
          language={language}
          chartType={chartType}
          onChartTypeChange={setChartType}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        
        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const StatistiquesPage = () => {
  const context = useOutletContext();
  return <StatistiquesPageContent {...context} />;
};

export default StatistiquesPage;
