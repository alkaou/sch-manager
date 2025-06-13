import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Search
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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
  RadialLinearScale
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
  RadialLinearScale
);

const PaymentAnalytics = ({
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
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, monthly, yearly, comparison
  const [filterStatus, setFilterStatus] = useState('all'); // all, paid, unpaid, overdue

  // Calcul des données de paiements
  const paymentData = useMemo(() => {
    if (!database) return null;

    // Filtrer les systèmes de paiement pour l'année sélectionnée
    const paymentSystems = database.paymentSystems?.filter(ps => {
      const startYear = new Date(ps.startDate).getFullYear();
      const endYear = new Date(ps.endDate).getFullYear();
      return `${startYear}-${endYear}` === selectedYear;
    }) || [];

    // Filtrer par système de paiement si sélectionné
    const filteredSystems = selectedPaymentSystem === 'all' 
      ? paymentSystems 
      : paymentSystems.filter(ps => ps.id === selectedPaymentSystem);

    let totalAmount = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;
    let totalOverdue = 0;
    let totalStudents = 0;
    let paidStudents = 0;
    let unpaidStudents = 0;
    
    const monthlyData = Array(12).fill(0).map(() => ({
      expected: 0,
      paid: 0,
      unpaid: 0,
      overdue: 0
    }));
    
    const classSummary = {};
    const paymentSystemSummary = {};
    const studentPayments = [];

    filteredSystems.forEach(ps => {
      paymentSystemSummary[ps.name] = {
        total: 0,
        paid: 0,
        unpaid: 0,
        students: 0
      };

      if (ps.payments) {
        const studentIds = new Set();
        
        ps.payments.forEach(payment => {
          const amount = payment.amount || 0;
          const studentId = payment.studentId;
          const className = payment.className || 'Non défini';
          
          // Filtrer par classe si sélectionnée
          if (selectedClass !== 'all' && className !== selectedClass) return;
          
          studentIds.add(studentId);
          totalAmount += amount;
          
          // Initialiser le résumé de classe
          if (!classSummary[className]) {
            classSummary[className] = {
              total: 0,
              paid: 0,
              unpaid: 0,
              students: new Set()
            };
          }
          
          classSummary[className].total += amount;
          classSummary[className].students.add(studentId);
          paymentSystemSummary[ps.name].total += amount;
          
          const dueDate = new Date(payment.dueDate || Date.now());
          const month = dueDate.getMonth();
          monthlyData[month].expected += amount;
          
          if (payment.isPaid) {
            totalPaid += amount;
            classSummary[className].paid += amount;
            paymentSystemSummary[ps.name].paid += amount;
            monthlyData[month].paid += amount;
          } else {
            totalUnpaid += amount;
            classSummary[className].unpaid += amount;
            paymentSystemSummary[ps.name].unpaid += amount;
            monthlyData[month].unpaid += amount;
            
            // Vérifier si en retard
            if (dueDate < new Date()) {
              totalOverdue += amount;
              monthlyData[month].overdue += amount;
            }
          }
          
          // Ajouter aux paiements d'étudiants
          studentPayments.push({
            ...payment,
            systemName: ps.name,
            className,
            isOverdue: !payment.isPaid && dueDate < new Date()
          });
        });
        
        paymentSystemSummary[ps.name].students = studentIds.size;
        totalStudents += studentIds.size;
      }
    });

    // Convertir les Sets en nombres pour classSummary
    Object.keys(classSummary).forEach(className => {
      classSummary[className].students = classSummary[className].students.size;
      if (classSummary[className].paid > 0) paidStudents++;
      if (classSummary[className].unpaid > 0) unpaidStudents++;
    });

    // Calculer les statistiques
    const paymentRate = totalAmount > 0 ? (totalPaid / totalAmount * 100) : 0;
    const overdueRate = totalUnpaid > 0 ? (totalOverdue / totalUnpaid * 100) : 0;
    
    return {
      summary: {
        totalAmount,
        totalPaid,
        totalUnpaid,
        totalOverdue,
        totalStudents,
        paidStudents,
        unpaidStudents,
        paymentRate,
        overdueRate
      },
      monthly: monthlyData,
      byClass: classSummary,
      byPaymentSystem: paymentSystemSummary,
      studentPayments,
      availableClasses: Object.keys(classSummary),
      availablePaymentSystems: paymentSystems
    };
  }, [database, selectedYear, selectedClass, selectedPaymentSystem]);

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

  // Données pour l'évolution mensuelle des paiements
  const monthlyPaymentData = {
    labels: months,
    datasets: [
      {
        label: language === 'Français' ? 'Attendu' : 'Expected',
        data: paymentData?.monthly.map(m => m.expected) || [],
        borderColor: '#6B7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        fill: false
      },
      {
        label: language === 'Français' ? 'Payé' : 'Paid',
        data: paymentData?.monthly.map(m => m.paid) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false
      },
      {
        label: language === 'Français' ? 'En retard' : 'Overdue',
        data: paymentData?.monthly.map(m => m.overdue) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false
      }
    ]
  };

  // Données pour la répartition par statut
  const statusDistributionData = {
    labels: [
      language === 'Français' ? 'Payé' : 'Paid',
      language === 'Français' ? 'En attente' : 'Pending',
      language === 'Français' ? 'En retard' : 'Overdue'
    ],
    datasets: [{
      data: [
        paymentData?.summary.totalPaid || 0,
        (paymentData?.summary.totalUnpaid || 0) - (paymentData?.summary.totalOverdue || 0),
        paymentData?.summary.totalOverdue || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderColor: ['#059669', '#D97706', '#DC2626'],
      borderWidth: 2
    }]
  };

  // Données pour la répartition par classe
  const classDistributionData = {
    labels: Object.keys(paymentData?.byClass || {}),
    datasets: [{
      label: language === 'Français' ? 'Montant total' : 'Total amount',
      data: Object.values(paymentData?.byClass || {}).map(c => c.total),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
      ],
      borderColor: [
        '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED',
        '#DB2777', '#0891B2', '#65A30D', '#EA580C', '#4F46E5'
      ],
      borderWidth: 2
    }]
  };

  // Carte de métrique
  const MetricCard = ({ icon: Icon, title, value, subtitle, color, percentage, trend }) => (
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
                percentage >= 80 ? 'text-green-600' : 
                percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {percentage.toFixed(1)}%
              </div>
              <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
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

  if (!paymentData) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {language === 'Français' ? 'Aucune donnée de paiement' : 'No payment data'}
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
              {/* Filtre par classe */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`
                  px-3 py-2 rounded-lg text-sm border transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">
                  {language === 'Français' ? 'Toutes les classes' : 'All classes'}
                </option>
                {paymentData.availableClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
              
              {/* Filtre par système de paiement */}
              <select
                value={selectedPaymentSystem}
                onChange={(e) => setSelectedPaymentSystem(e.target.value)}
                className={`
                  px-3 py-2 rounded-lg text-sm border transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">
                  {language === 'Français' ? 'Tous les systèmes' : 'All systems'}
                </option>
                {paymentData.availablePaymentSystems.map(ps => (
                  <option key={ps.id} value={ps.id}>{ps.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={CreditCard}
          title={language === 'Français' ? 'Montant Total' : 'Total Amount'}
          value={`${paymentData.summary.totalAmount.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'frais attendus' : 'expected fees'}
          color="bg-blue-500"
          percentage={paymentData.summary.paymentRate}
        />
        
        <MetricCard
          icon={CheckCircle}
          title={language === 'Français' ? 'Paiements Reçus' : 'Payments Received'}
          value={`${paymentData.summary.totalPaid.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'frais collectés' : 'fees collected'}
          color="bg-green-500"
        />
        
        <MetricCard
          icon={Clock}
          title={language === 'Français' ? 'En Attente' : 'Pending'}
          value={`${(paymentData.summary.totalUnpaid - paymentData.summary.totalOverdue).toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'à collecter' : 'to collect'}
          color="bg-yellow-500"
        />
        
        <MetricCard
          icon={XCircle}
          title={language === 'Français' ? 'En Retard' : 'Overdue'}
          value={`${paymentData.summary.totalOverdue.toLocaleString()} FCFA`}
          subtitle={language === 'Français' ? 'paiements tardifs' : 'late payments'}
          color="bg-red-500"
          percentage={paymentData.summary.overdueRate}
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
            {chartType === 'bar' ? (
              <Bar data={monthlyPaymentData} options={chartOptions} />
            ) : (
              <Line data={monthlyPaymentData} options={chartOptions} />
            )}
          </div>
        </motion.div>

        {/* Répartition par statut */}
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {language === 'Français' ? 'Répartition par Statut' : 'Distribution by Status'}
          </h3>
          <div className="h-80">
            <Doughnut data={statusDistributionData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Répartition par classe */}
      {Object.keys(paymentData.byClass).length > 0 && (
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {language === 'Français' ? 'Répartition par Classe' : 'Distribution by Class'}
          </h3>
          <div className="h-80">
            <Bar data={classDistributionData} options={chartOptions} />
          </div>
        </motion.div>
      )}

      {/* Tableau détaillé par classe */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          {language === 'Français' ? 'Détails par Classe' : 'Details by Class'}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className="text-left py-3 px-4 font-medium">
                  {language === 'Français' ? 'Classe' : 'Class'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Étudiants' : 'Students'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Total' : 'Total'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Payé' : 'Paid'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'En attente' : 'Pending'}
                </th>
                <th className="text-right py-3 px-4 font-medium">
                  {language === 'Français' ? 'Taux' : 'Rate'}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentData.byClass).map(([className, data]) => {
                const rate = data.total > 0 ? (data.paid / data.total * 100) : 0;
                return (
                  <tr key={className} className={`border-b ${borderColor} hover:bg-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                    <td className="py-3 px-4 font-medium">{className}</td>
                    <td className="py-3 px-4 text-right">{data.students}</td>
                    <td className="py-3 px-4 text-right">{data.total.toLocaleString()} FCFA</td>
                    <td className="py-3 px-4 text-right text-green-600">{data.paid.toLocaleString()} FCFA</td>
                    <td className="py-3 px-4 text-right text-yellow-600">{data.unpaid.toLocaleString()} FCFA</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        rate >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentAnalytics;