import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Target,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  AlertCircle
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

const FinancialAnalytics = ({
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
  const [viewType, setViewType] = useState('overview'); // overview, revenue, expenses, profit
  const [selectedMonth, setSelectedMonth] = useState('all');
  
  // Calcul des données financières
  const financialData = useMemo(() => {
    if (!database) return null;

    // Données des paiements
    const paymentSystems = database.paymentSystems?.filter(ps => {
      const startYear = new Date(ps.startDate).getFullYear();
      const endYear = new Date(ps.endDate).getFullYear();
      return `${startYear}-${endYear}` === selectedYear;
    }) || [];

    // Données des dépenses
    const schoolYear = database.schoolYears?.find(sy => sy.name === selectedYear);
    const expenses = schoolYear?.expenses || [];

    // Calculs des revenus
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;
    const monthlyRevenue = Array(12).fill(0);
    const monthlyPaid = Array(12).fill(0);
    const monthlyUnpaid = Array(12).fill(0);

    paymentSystems.forEach(ps => {
      if (ps.payments) {
        ps.payments.forEach(payment => {
          const amount = payment.amount || 0;
          totalRevenue += amount;
          
          if (payment.isPaid) {
            totalPaid += amount;
            if (payment.paidDate) {
              const month = new Date(payment.paidDate).getMonth();
              monthlyPaid[month] += amount;
            }
          } else {
            totalUnpaid += amount;
            monthlyUnpaid[new Date(payment.dueDate || Date.now()).getMonth()] += amount;
          }
          
          const month = new Date(payment.dueDate || Date.now()).getMonth();
          monthlyRevenue[month] += amount;
        });
      }
    });

    // Calculs des dépenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const monthlyExpenses = Array(12).fill(0);
    
    expenses.forEach(expense => {
      if (expense.date) {
        const month = new Date(expense.date).getMonth();
        monthlyExpenses[month] += expense.amount || 0;
      }
    });

    // Calculs des profits
    const netProfit = totalPaid - totalExpenses;
    const monthlyProfit = monthlyPaid.map((paid, index) => paid - monthlyExpenses[index]);

    // Répartition des dépenses par catégorie
    const expensesByCategory = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Autres';
      expensesByCategory[category] = (expensesByCategory[category] || 0) + (expense.amount || 0);
    });

    return {
      revenue: {
        total: totalRevenue,
        paid: totalPaid,
        unpaid: totalUnpaid,
        monthly: monthlyRevenue,
        monthlyPaid,
        monthlyUnpaid,
        paymentRate: totalRevenue > 0 ? (totalPaid / totalRevenue * 100) : 0
      },
      expenses: {
        total: totalExpenses,
        monthly: monthlyExpenses,
        byCategory: expensesByCategory
      },
      profit: {
        net: netProfit,
        monthly: monthlyProfit,
        margin: totalPaid > 0 ? (netProfit / totalPaid * 100) : 0
      }
    };
  }, [database, selectedYear]);

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

  // Données pour le graphique d'évolution mensuelle
  const monthlyEvolutionData = {
    labels: months,
    datasets: [
      {
        label: language === 'Français' ? 'Revenus' : 'Revenue',
        data: financialData?.revenue.monthlyPaid || [],
        borderColor: '#10B981',
        backgroundColor: chartType === 'area' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      },
      {
        label: language === 'Français' ? 'Dépenses' : 'Expenses',
        data: financialData?.expenses.monthly || [],
        borderColor: '#EF4444',
        backgroundColor: chartType === 'area' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      },
      {
        label: language === 'Français' ? 'Profit' : 'Profit',
        data: financialData?.profit.monthly || [],
        borderColor: '#3B82F6',
        backgroundColor: chartType === 'area' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      }
    ]
  };

  // Données pour la répartition des revenus
  const revenueDistributionData = {
    labels: [
      language === 'Français' ? 'Payé' : 'Paid',
      language === 'Français' ? 'En attente' : 'Pending'
    ],
    datasets: [{
      data: [
        financialData?.revenue.paid || 0,
        financialData?.revenue.unpaid || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B'],
      borderColor: ['#059669', '#D97706'],
      borderWidth: 2
    }]
  };

  // Données pour la répartition des dépenses par catégorie
  const expensesCategoryData = {
    labels: Object.keys(financialData?.expenses.byCategory || {}),
    datasets: [{
      data: Object.values(financialData?.expenses.byCategory || {}),
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

  // Carte de métrique financière
  const FinancialCard = ({ icon: Icon, title, value, subtitle, color, trend, percentage }) => (
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
          {percentage !== undefined && (
            <div className="mt-2">
              <div className={`text-xs font-medium mb-1 ${
                percentage >= 70 ? 'text-green-600' : 
                percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {percentage.toFixed(1)}%
              </div>
              <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage >= 70 ? 'bg-green-500' : 
                    percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{trend !== 0 ? `${Math.abs(trend)}%` : '0%'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (!financialData) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {language === 'Français' ? 'Aucune donnée financière' : 'No financial data'}
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
      {/* Contrôles de vue */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 opacity-70" />
            <div className="flex gap-2">
              {['overview', 'revenue', 'expenses', 'profit'].map(type => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`
                    px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${viewType === type 
                      ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-blue-100 text-blue-700')
                      : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
                    }
                  `}
                >
                  {type === 'overview' ? (language === 'Français' ? 'Vue d\'ensemble' : 'Overview') :
                   type === 'revenue' ? (language === 'Français' ? 'Revenus' : 'Revenue') :
                   type === 'expenses' ? (language === 'Français' ? 'Dépenses' : 'Expenses') :
                   (language === 'Français' ? 'Profits' : 'Profits')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          icon={DollarSign}
          title={language === 'Français' ? 'Revenus Totaux' : 'Total Revenue'}
          value={`${financialData.revenue.total.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'frais attendus' : 'expected fees'}
          color="bg-blue-500"
          percentage={financialData.revenue.paymentRate}
        />
        
        <FinancialCard
          icon={CreditCard}
          title={language === 'Français' ? 'Paiements Reçus' : 'Payments Received'}
          value={`${financialData.revenue.paid.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'frais collectés' : 'fees collected'}
          color="bg-green-500"
        />
        
        <FinancialCard
          icon={TrendingDown}
          title={language === 'Français' ? 'Dépenses Totales' : 'Total Expenses'}
          value={`${financialData.expenses.total.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'coûts engagés' : 'costs incurred'}
          color="bg-red-500"
        />
        
        <FinancialCard
          icon={Target}
          title={language === 'Français' ? 'Bénéfice Net' : 'Net Profit'}
          value={`${financialData.profit.net.toLocaleString()} FCFA`}
          subtitle={`${financialData.profit.margin.toFixed(1)}% ${language === 'Français' ? 'marge' : 'margin'}`}
          color={financialData.profit.net >= 0 ? "bg-green-500" : "bg-red-500"}
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
            <BarChart3 className="w-5 h-5" />
            {language === 'Français' ? 'Évolution Mensuelle' : 'Monthly Evolution'}
          </h3>
          <div className="h-80">
            {chartType === 'line' || chartType === 'area' ? (
              <Line data={monthlyEvolutionData} options={chartOptions} />
            ) : (
              <Bar data={monthlyEvolutionData} options={chartOptions} />
            )}
          </div>
        </motion.div>

        {/* Répartition des revenus */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {language === 'Français' ? 'État des Paiements' : 'Payment Status'}
          </h3>
          <div className="h-80">
            <Doughnut data={revenueDistributionData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Répartition des dépenses par catégorie */}
      {Object.keys(financialData.expenses.byCategory).length > 0 && (
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {language === 'Français' ? 'Dépenses par Catégorie' : 'Expenses by Category'}
          </h3>
          <div className="h-80">
            <Doughnut data={expensesCategoryData} options={chartOptions} />
          </div>
        </motion.div>
      )}

      {/* Alertes et recommandations */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {language === 'Français' ? 'Alertes et Recommandations' : 'Alerts and Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Alerte taux de paiement */}
          {financialData.revenue.paymentRate < 70 && (
            <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
              theme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">
                  {language === 'Français' ? 'Taux de collecte faible' : 'Low collection rate'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? `Seulement ${financialData.revenue.paymentRate.toFixed(1)}% des frais ont été collectés`
                  : `Only ${financialData.revenue.paymentRate.toFixed(1)}% of fees have been collected`
                }
              </p>
            </div>
          )}

          {/* Alerte profit négatif */}
          {financialData.profit.net < 0 && (
            <div className={`p-4 rounded-lg border-l-4 border-red-500 ${
              theme === 'dark' ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-300">
                  {language === 'Français' ? 'Déficit budgétaire' : 'Budget deficit'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? 'Les dépenses dépassent les revenus collectés'
                  : 'Expenses exceed collected revenue'
                }
              </p>
            </div>
          )}

          {/* Recommandation positive */}
          {financialData.revenue.paymentRate >= 80 && financialData.profit.net > 0 && (
            <div className={`p-4 rounded-lg border-l-4 border-green-500 ${
              theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  {language === 'Français' ? 'Situation financière saine' : 'Healthy financial situation'}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {language === 'Français' 
                  ? 'Bon taux de collecte et bénéfices positifs'
                  : 'Good collection rate and positive profits'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialAnalytics;