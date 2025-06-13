import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingDown,
  GitCompare,
  LineChart,
  PieChart,
  BarChart2,
  Activity,
  Calendar,
  Filter
} from 'lucide-react';

const StatisticsNavigation = ({
  activeSection,
  onSectionChange,
  theme,
  textColor,
  cardBg,
  borderColor,
  language,
  chartType,
  onChartTypeChange,
  viewMode,
  onViewModeChange,
  timeRange,
  onTimeRangeChange
}) => {
  // Configuration des sections
  const sections = [
    {
      id: 'overview',
      icon: BarChart3,
      label: language === 'Français' ? 'Vue d\'ensemble' : 'Overview',
      description: language === 'Français' ? 'Tableau de bord général' : 'General dashboard'
    },
    {
      id: 'enrollment',
      icon: Users,
      label: language === 'Français' ? 'Effectifs' : 'Enrollment',
      description: language === 'Français' ? 'Analyse des effectifs' : 'Enrollment analysis'
    },
    {
      id: 'financial',
      icon: DollarSign,
      label: language === 'Français' ? 'Finances' : 'Financial',
      description: language === 'Français' ? 'Vue financière globale' : 'Global financial view'
    },
    {
      id: 'payments',
      icon: CreditCard,
      label: language === 'Français' ? 'Paiements' : 'Payments',
      description: language === 'Français' ? 'Frais de scolarité' : 'Tuition fees'
    },
    {
      id: 'expenses',
      icon: TrendingDown,
      label: language === 'Français' ? 'Dépenses' : 'Expenses',
      description: language === 'Français' ? 'Analyse des dépenses' : 'Expense analysis'
    },
    {
      id: 'comparison',
      icon: GitCompare,
      label: language === 'Français' ? 'Comparaisons' : 'Comparisons',
      description: language === 'Français' ? 'Comparaisons inter-années' : 'Year-over-year comparisons'
    }
  ];

  // Configuration des types de graphiques
  const chartTypes = [
    { id: 'line', icon: LineChart, label: language === 'Français' ? 'Ligne' : 'Line' },
    { id: 'bar', icon: BarChart2, label: language === 'Français' ? 'Barres' : 'Bar' },
    { id: 'pie', icon: PieChart, label: language === 'Français' ? 'Secteurs' : 'Pie' },
    { id: 'area', icon: Activity, label: language === 'Français' ? 'Aires' : 'Area' }
  ];

  // Configuration des modes de vue
  const viewModes = [
    { id: 'overview', label: language === 'Français' ? 'Aperçu' : 'Overview' },
    { id: 'detailed', label: language === 'Français' ? 'Détaillé' : 'Detailed' },
    { id: 'comparison', label: language === 'Français' ? 'Comparaison' : 'Comparison' }
  ];

  // Configuration des plages temporelles
  const timeRanges = [
    { id: 'month', label: language === 'Français' ? 'Mensuel' : 'Monthly' },
    { id: 'quarter', label: language === 'Français' ? 'Trimestriel' : 'Quarterly' },
    { id: 'year', label: language === 'Français' ? 'Annuel' : 'Yearly' }
  ];

  const buttonBaseClass = `
    px-4 py-3 rounded-lg border ${borderColor} transition-all duration-200
    flex items-center gap-3 text-left w-full
    hover:shadow-md transform hover:scale-[1.02]
  `;

  const activeButtonClass = theme === 'dark' 
    ? 'bg-blue-900 bg-opacity-50 border-blue-500 shadow-lg' 
    : 'bg-blue-50 border-blue-300 shadow-lg';

  const inactiveButtonClass = theme === 'dark' 
    ? 'bg-gray-700 hover:bg-gray-600' 
    : 'bg-gray-50 hover:bg-gray-100';

  return (
    <div className="space-y-6">
      {/* Navigation principale */}
      <motion.div 
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          {language === 'Français' ? 'Sections d\'analyse' : 'Analysis Sections'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`
                  ${buttonBaseClass}
                  ${isActive ? activeButtonClass : inactiveButtonClass}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * sections.indexOf(section) }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{section.label}</div>
                  <div className="text-xs opacity-70 truncate">{section.description}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Options de visualisation */}
      <motion.div 
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Types de graphiques */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {language === 'Français' ? 'Type de graphique' : 'Chart Type'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {chartTypes.map((type) => {
                const Icon = type.icon;
                const isActive = chartType === type.id;
                
                return (
                  <motion.button
                    key={type.id}
                    onClick={() => onChartTypeChange(type.id)}
                    className={`
                      px-3 py-2 rounded-lg border ${borderColor} transition-all duration-200
                      flex items-center gap-2 text-sm
                      ${isActive 
                        ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-50 border-blue-500' : 'bg-blue-50 border-blue-300')
                        : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : ''}`} />
                    <span>{type.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Modes de vue */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {language === 'Français' ? 'Mode de vue' : 'View Mode'}
            </h3>
            <div className="space-y-2">
              {viewModes.map((mode) => {
                const isActive = viewMode === mode.id;
                
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => onViewModeChange(mode.id)}
                    className={`
                      w-full px-3 py-2 rounded-lg border ${borderColor} transition-all duration-200
                      text-sm text-left
                      ${isActive 
                        ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-50 border-blue-500' : 'bg-blue-50 border-blue-300')
                        : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Plages temporelles */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {language === 'Français' ? 'Période' : 'Time Range'}
            </h3>
            <div className="space-y-2">
              {timeRanges.map((range) => {
                const isActive = timeRange === range.id;
                
                return (
                  <motion.button
                    key={range.id}
                    onClick={() => onTimeRangeChange(range.id)}
                    className={`
                      w-full px-3 py-2 rounded-lg border ${borderColor} transition-all duration-200
                      text-sm text-left
                      ${isActive 
                        ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-50 border-blue-500' : 'bg-blue-50 border-blue-300')
                        : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {range.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsNavigation;