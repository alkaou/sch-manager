import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  Calendar,
  Tag,
  DollarSign,
  BarChart3,
  PieChart,
  Filter,
  Plus,
  Minus,
  AlertTriangle,
  Target,
  TrendingUp
} from 'lucide-react';
import { Line, Bar, Doughnut, Area } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const ExpenseAnalytics = ({
  database,
  selectedYear,
  theme,
  textColor,
  cardBg,
  borderColor,
  language,
  chartType,
  timeRange
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, monthly, category, trends
  const [sortBy, setSortBy] = useState('amount'); // amount, date, category
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Calcul des données de dépenses
  const expenseData = useMemo(() => {
    if (!database) return null;

    // Trouver l'année scolaire correspondante
    const schoolYear = database.schoolYears?.find(sy => sy.name === selectedYear);
    if (!schoolYear || !schoolYear.expenses) return null;

    const expenses = schoolYear.expenses;
    
    // Filtrer par catégorie si sélectionnée
    const filteredExpenses = selectedCategory === 'all' 
      ? expenses 
      : expenses.filter(expense => expense.category === selectedCategory);

    // Calculs de base
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalCount = filteredExpenses.length;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
    
    // Données mensuelles
    const monthlyData = Array(12).fill(0).map(() => ({
      amount: 0,
      count: 0,
      expenses: []
    }));
    
    // Répartition par catégorie
    const categoryData = {};
    
    // Analyse des tendances
    const dailyExpenses = {};
    
    filteredExpenses.forEach(expense => {
      const amount = expense.amount || 0;
      const category = expense.category || 'Non catégorisé';
      const date = new Date(expense.date || Date.now());
      const month = date.getMonth();
      const dayKey = date.toISOString().split('T')[0];
      
      // Données mensuelles
      monthlyData[month].amount += amount;
      monthlyData[month].count += 1;
      monthlyData[month].expenses.push(expense);
      
      // Données par catégorie
      if (!categoryData[category]) {
        categoryData[category] = {
          amount: 0,
          count: 0,
          expenses: [],
          percentage: 0
        };
      }
      categoryData[category].amount += amount;
      categoryData[category].count += 1;
      categoryData[category].expenses.push(expense);
      
      // Données quotidiennes pour les tendances
      if (!dailyExpenses[dayKey]) {
        dailyExpenses[dayKey] = {
          amount: 0,
          count: 0
        };
      }
      dailyExpenses[dayKey].amount += amount;
      dailyExpenses[dayKey].count += 1;
    });
    
    // Calculer les pourcentages par catégorie
    Object.keys(categoryData).forEach(category => {
      categoryData[category].percentage = totalAmount > 0 
        ? (categoryData[category].amount / totalAmount * 100) 
        : 0;
    });
    
    // Trouver le mois le plus coûteux
    const maxMonthIndex = monthlyData.reduce((maxIndex, current, index) => 
      current.amount > monthlyData[maxIndex].amount ? index : maxIndex, 0
    );
    
    // Trouver la catégorie la plus coûteuse
    const maxCategory = Object.keys(categoryData).reduce((maxCat, category) => 
      categoryData[category].amount > (categoryData[maxCat]?.amount || 0) ? category : maxCat, 
      Object.keys(categoryData)[0]
    );
    
    // Calculer la tendance (comparaison des 6 premiers mois vs 6 derniers mois)
    const firstHalf = monthlyData.slice(0, 6).reduce((sum, month) => sum + month.amount, 0);
    const secondHalf = monthlyData.slice(6, 12).reduce((sum, month) => sum + month.amount, 0);
    const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100) : 0;
    
    // Obtenir les catégories disponibles
    const availableCategories = [...new Set(expenses.map(e => e.category || 'Non catégorisé'))];
    
    return {
      summary: {
        totalAmount,
        totalCount,
        averageAmount,
        maxMonthIndex,
        maxCategory,
        trend
      },
      monthly: monthlyData,
      byCategory: categoryData,
      dailyExpenses,
      availableCategories,
      expenses: filteredExpenses
    };
  }, [database, selectedYear, selectedCategory]);

  // Noms des mois
  const months = language === 'Français'
    ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Configuration des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#374151',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        titleColor: theme === 'dark' ? '#E5E7EB' : '#374151',
        bodyColor: theme === 'dark' ? '#E5E7EB' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} FCFA`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return value.toLocaleString() + ' FCFA';
          }
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
        }
      }
    }
  };

  // Données pour l'évolution mensuelle
  const monthlyExpenseData = {
    labels: months,
    datasets: [
      {
        label: language === 'Français' ? 'Montant des dépenses' : 'Expense amount',
        data: expenseData?.monthly.map(m => m.amount) || [],
        borderColor: '#EF4444',
        backgroundColor: chartType === 'area' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      },
      {
        label: language === 'Français' ? 'Nombre de dépenses' : 'Number of expenses',
        data: expenseData?.monthly.map(m => m.count * 1000) || [], // Multiplié pour la visibilité
        borderColor: '#F59E0B',
        backgroundColor: chartType === 'area' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.8)',
        fill: chartType === 'area',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  // Ajouter une deuxième échelle Y pour le nombre de dépenses
  const monthlyChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return (value / 1000).toFixed(0);
          }
        }
      }
    }
  };

  // Données pour la répartition par catégorie
  const categoryDistributionData = {
    labels: Object.keys(expenseData?.byCategory || {}),
    datasets: [{
      data: Object.values(expenseData?.byCategory || {}).map(c => c.amount),
      backgroundColor: [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
      ],
      borderColor: [
        '#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED',
        '#DB2777', '#0891B2', '#65A30D', '#EA580C', '#4F46E5'
      ],
      borderWidth: 2
    }]
  };

  // Carte de métrique
  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend, isPositive }) => (
    <motion.div
      className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-medium text-sm opacity-70">{title}</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{value}</div>
          {subtitle && (
            <div className="text-sm opacity-60">{subtitle}</div>
          )}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive 
              ? (trend > 0 ? 'text-green-500' : 'text-red-500')
              : (trend > 0 ? 'text-red-500' : 'text-green-500')
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{trend !== 0 ? `${Math.abs(trend).toFixed(1)}%` : '0%'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (!expenseData) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
        <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {language === 'Français' ? 'Aucune donnée de dépense' : 'No expense data'}
        </p>
        <p className="text-sm opacity-70">
          {language === 'Français' 
            ? 'Aucune donnée disponible pour cette année' 
            : 'No data available for this year'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contrôles et filtres */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 opacity-70" />
            <div className="flex flex-wrap gap-2">
              {/* Filtre par catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`
                  px-3 py-2 rounded-lg text-sm border transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">
                  {language === 'Français' ? 'Toutes les catégories' : 'All categories'}
                </option>
                {expenseData.availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Mode de vue */}
              <div className="flex gap-2">
                {['overview', 'monthly', 'category', 'trends'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`
                      px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${viewMode === mode 
                        ? (theme === 'dark' ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-red-100 text-red-700')
                        : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
                      }
                    `}
                  >
                    {mode === 'overview' ? (language === 'Français' ? 'Vue d\'ensemble' : 'Overview') :
                     mode === 'monthly' ? (language === 'Français' ? 'Mensuel' : 'Monthly') :
                     mode === 'category' ? (language === 'Français' ? 'Catégories' : 'Categories') :
                     (language === 'Français' ? 'Tendances' : 'Trends')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          title={language === 'Français' ? 'Total des Dépenses' : 'Total Expenses'}
          value={`${expenseData.summary.totalAmount.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'montant total' : 'total amount'}
          color="bg-red-500"
          trend={expenseData.summary.trend}
          isPositive={false}
        />
        
        <MetricCard
          icon={BarChart3}
          title={language === 'Français' ? 'Nombre de Dépenses' : 'Number of Expenses'}
          value={expenseData.summary.totalCount.toLocaleString()}
          subtitle={language === 'Français' ? 'transactions' : 'transactions'}
          color="bg-orange-500"
        />
        
        <MetricCard
          icon={Target}
          title={language === 'Français' ? 'Dépense Moyenne' : 'Average Expense'}
          value={`${expenseData.summary.averageAmount.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'par transaction' : 'per transaction'}
          color="bg-yellow-500"
        />
        
        <MetricCard
          icon={Tag}
          title={language === 'Français' ? 'Catégorie Principale' : 'Top Category'}
          value={expenseData.summary.maxCategory}
          subtitle={`${expenseData.byCategory[expenseData.summary.maxCategory]?.percentage.toFixed(1)}% ${language === 'Français' ? 'du total' : 'of total'}`}
          color="bg-purple-500"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'Français' ? 'Évolution Mensuelle' : 'Monthly Evolution'}
          </h3>
          <div className="h-80">
            {chartType === 'line' || chartType === 'area' ? (
              <Line data={monthlyExpenseData} options={monthlyChartOptions} />
            ) : (
              <Bar data={monthlyExpenseData} options={monthlyChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Répartition par catégorie */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {language === 'Français' ? 'Répartition par Catégorie' : 'Distribution by Category'}
          </h3>
          <div className="h-80">
            <Doughnut data={categoryDistributionData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Tableau détaillé par catégorie */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          {language === 'Français' ? 'Détails par Catégorie' : 'Details by Category'}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className="text-left py-3 px-4 font-medium">
                  {language === 'Français' ? 'Catégorie' : 'Category'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Nombre' : 'Count'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Montant Total' : 'Total Amount'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Moyenne' : 'Average'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Pourcentage' : 'Percentage'}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expenseData.byCategory)
                .sort(([,a], [,b]) => b.amount - a.amount)
                .map(([category, data]) => {
                  const average = data.count > 0 ? data.amount / data.count : 0;
                  return (
                    <tr key={category} className={`border-b ${borderColor} hover:bg-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                      <td className="py-3 px-4 font-medium">{category}</td>
                      <td className="py-3 px-4 text-right">{data.count}</td>
                      <td className="py-3 px-4 text-right text-red-600">{data.amount.toLocaleString()} FCFA</td>
                      <td className="py-3 px-4 text-right">{average.toLocaleString()} FCFA</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 flex-1`}>
                            <div 
                              className="h-2 rounded-full bg-red-500 transition-all duration-500"
                              style={{ width: `${Math.min(data.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[3rem]">
                            {data.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Alertes et recommandations */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {language === 'Français' ? 'Analyse et Recommandations' : 'Analysis and Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Alerte tendance croissante */}
          {expenseData.summary.trend > 20 && (
            <div className={`p-4 rounded-lg border-l-4 border-red-500 ${
              theme === 'dark' ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-300">
                  {language === 'Français' ? 'Augmentation des dépenses' : 'Increasing expenses'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? `Les dépenses ont augmenté de ${expenseData.summary.trend.toFixed(1)}% en cours d'année`
                  : `Expenses have increased by ${expenseData.summary.trend.toFixed(1)}% during the year`
                }
              </p>
            </div>
          )}

          {/* Recommandation catégorie dominante */}
          {expenseData.byCategory[expenseData.summary.maxCategory]?.percentage > 50 && (
            <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
              theme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">
                  {language === 'Français' ? 'Catégorie dominante' : 'Dominant category'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? `${expenseData.summary.maxCategory} représente plus de 50% des dépenses`
                  : `${expenseData.summary.maxCategory} represents over 50% of expenses`
                }
              </p>
            </div>
          )}

          {/* Recommandation positive */}
          {expenseData.summary.trend < -10 && (
            <div className={`p-4 rounded-lg border-l-4 border-green-500 ${
              theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  {language === 'Français' ? 'Réduction des coûts' : 'Cost reduction'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? 'Bonne maîtrise des dépenses en cours d\'année'
                  : 'Good expense control during the year'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseAnalytics;