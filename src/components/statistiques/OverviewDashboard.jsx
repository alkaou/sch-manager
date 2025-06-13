import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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

const OverviewDashboard = ({
  database,
  selectedYear,
  theme,
  textColor,
  cardBg,
  borderColor,
  language
}) => {
  // Calcul des métriques principales
  const metrics = useMemo(() => {
    if (!database) return null;

    const currentSnapshot = database.snapshots?.find(s => s.schoolYear === selectedYear);
    const paymentSystems = database.paymentSystems?.filter(ps => {
      const startYear = new Date(ps.startDate).getFullYear();
      const endYear = new Date(ps.endDate).getFullYear();
      return `${startYear}-${endYear}` === selectedYear;
    }) || [];
    
    const schoolYear = database.schoolYears?.find(sy => sy.name === selectedYear);
    const expenses = schoolYear?.expenses || [];

    // Calculs des effectifs
    const totalStudents = currentSnapshot?.summary?.totalStudents || 0;
    const totalMale = currentSnapshot?.summary?.totalMale || 0;
    const totalFemale = currentSnapshot?.summary?.totalFemale || 0;

    // Calculs financiers
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    paymentSystems.forEach(ps => {
      if (ps.payments) {
        ps.payments.forEach(payment => {
          totalRevenue += payment.amount || 0;
          if (payment.isPaid) {
            totalPaid += payment.amount || 0;
          } else {
            totalUnpaid += payment.amount || 0;
          }
        });
      }
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const netProfit = totalPaid - totalExpenses;

    return {
      students: {
        total: totalStudents,
        male: totalMale,
        female: totalFemale,
        malePercentage: totalStudents > 0 ? (totalMale / totalStudents * 100).toFixed(1) : 0,
        femalePercentage: totalStudents > 0 ? (totalFemale / totalStudents * 100).toFixed(1) : 0
      },
      financial: {
        totalRevenue,
        totalPaid,
        totalUnpaid,
        totalExpenses,
        netProfit,
        paymentRate: totalRevenue > 0 ? (totalPaid / totalRevenue * 100).toFixed(1) : 0
      }
    };
  }, [database, selectedYear]);

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
        borderWidth: 1
      }
    },
    scales: {
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
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

  // Données pour le graphique des effectifs
  const enrollmentChartData = {
    labels: [language === 'Français' ? 'Garçons' : 'Boys', language === 'Français' ? 'Filles' : 'Girls'],
    datasets: [{
      data: [metrics?.students.male || 0, metrics?.students.female || 0],
      backgroundColor: ['#3B82F6', '#EC4899'],
      borderColor: ['#2563EB', '#DB2777'],
      borderWidth: 2
    }]
  };

  // Données pour le graphique financier
  const financialChartData = {
    labels: [
      language === 'Français' ? 'Payé' : 'Paid',
      language === 'Français' ? 'Non payé' : 'Unpaid',
      language === 'Français' ? 'Dépenses' : 'Expenses'
    ],
    datasets: [{
      data: [
        metrics?.financial.totalPaid || 0,
        metrics?.financial.totalUnpaid || 0,
        metrics?.financial.totalExpenses || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderColor: ['#059669', '#D97706', '#DC2626'],
      borderWidth: 2
    }]
  };

  // Cartes de métriques
  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
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
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : 
             <Activity className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (!metrics) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {language === 'Français' ? 'Aucune donnée disponible' : 'No data available'}
        </p>
        <p className="text-sm opacity-70">
          {language === 'Français' 
            ? 'Sélectionnez une année avec des données' 
            : 'Select a year with available data'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title={language === 'Français' ? 'Effectif Total' : 'Total Enrollment'}
          value={metrics.students.total.toLocaleString()}
          subtitle={language === 'Français' ? 'élèves inscrits' : 'enrolled students'}
          color="bg-blue-500"
        />
        
        <MetricCard
          icon={DollarSign}
          title={language === 'Français' ? 'Revenus Totaux' : 'Total Revenue'}
          value={`${metrics.financial.totalRevenue.toLocaleString()} FCFA`}
          subtitle={`${metrics.financial.paymentRate}% ${language === 'Français' ? 'collecté' : 'collected'}`}
          color="bg-green-500"
        />
        
        <MetricCard
          icon={CreditCard}
          title={language === 'Français' ? 'Paiements Reçus' : 'Payments Received'}
          value={`${metrics.financial.totalPaid.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'frais collectés' : 'fees collected'}
          color="bg-emerald-500"
        />
        
        <MetricCard
          icon={Target}
          title={language === 'Français' ? 'Bénéfice Net' : 'Net Profit'}
          value={`${metrics.financial.netProfit.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'revenus - dépenses' : 'revenue - expenses'}
          color={metrics.financial.netProfit >= 0 ? "bg-green-500" : "bg-red-500"}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des effectifs */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {language === 'Français' ? 'Répartition par Genre' : 'Gender Distribution'}
          </h3>
          <div className="h-64">
            <Doughnut data={enrollmentChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Situation financière */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {language === 'Français' ? 'Situation Financière' : 'Financial Overview'}
          </h3>
          <div className="h-64">
            <Bar data={financialChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Résumé détaillé */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {language === 'Français' ? `Résumé de l'année ${selectedYear}` : `${selectedYear} Summary`}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-600">
              {language === 'Français' ? 'Effectifs' : 'Enrollment'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Total:' : 'Total:'}</span>
                <span className="font-medium">{metrics.students.total}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Garçons:' : 'Boys:'}</span>
                <span className="font-medium">{metrics.students.male} ({metrics.students.malePercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Filles:' : 'Girls:'}</span>
                <span className="font-medium">{metrics.students.female} ({metrics.students.femalePercentage}%)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-green-600">
              {language === 'Français' ? 'Revenus' : 'Revenue'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Total attendu:' : 'Total expected:'}</span>
                <span className="font-medium">{metrics.financial.totalRevenue.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Collecté:' : 'Collected:'}</span>
                <span className="font-medium text-green-600">{metrics.financial.totalPaid.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'En attente:' : 'Pending:'}</span>
                <span className="font-medium text-orange-600">{metrics.financial.totalUnpaid.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-red-600">
              {language === 'Français' ? 'Dépenses & Profit' : 'Expenses & Profit'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Dépenses totales:' : 'Total expenses:'}</span>
                <span className="font-medium text-red-600">{metrics.financial.totalExpenses.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Bénéfice net:' : 'Net profit:'}</span>
                <span className={`font-medium ${
                  metrics.financial.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.financial.netProfit.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'Français' ? 'Taux de collecte:' : 'Collection rate:'}</span>
                <span className="font-medium">{metrics.financial.paymentRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewDashboard;