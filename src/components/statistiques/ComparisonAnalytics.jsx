import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Target,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
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

const ComparisonAnalytics = ({
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
  const [comparisonType, setComparisonType] = useState('revenue'); // revenue, expenses, enrollment, profit
  const [selectedYears, setSelectedYears] = useState([]);
  const [viewMode, setViewMode] = useState('yearly'); // yearly, monthly, quarterly
  const [metricType, setMetricType] = useState('absolute'); // absolute, percentage, growth

  // Obtenir toutes les années disponibles
  const availableYears = useMemo(() => {
    if (!database) return [];
    
    const years = new Set();
    
    // Années des systèmes de paiement
    if (database.paymentSystems) {
      database.paymentSystems.forEach(ps => {
        const startYear = new Date(ps.startDate).getFullYear();
        const endYear = new Date(ps.endDate).getFullYear();
        years.add(`${startYear}-${endYear}`);
      });
    }
    
    // Années scolaires
    if (database.schoolYears) {
      database.schoolYears.forEach(sy => {
        years.add(sy.name);
      });
    }
    
    // Années des snapshots
    if (database.snapshots) {
      database.snapshots.forEach(snapshot => {
        const year = new Date(snapshot.date).getFullYear();
        const nextYear = year + 1;
        years.add(`${year}-${nextYear}`);
      });
    }
    
    return Array.from(years).sort();
  }, [database]);

  // Calculer les données de comparaison
  const comparisonData = useMemo(() => {
    if (!database || selectedYears.length === 0) return null;

    const yearData = {};
    
    selectedYears.forEach(year => {
      yearData[year] = {
        enrollment: { total: 0, male: 0, female: 0, byClass: {} },
        revenue: { total: 0, paid: 0, unpaid: 0, rate: 0 },
        expenses: { total: 0, byCategory: {} },
        profit: { net: 0, margin: 0 }
      };
      
      // Données d'inscription
      const snapshot = database.snapshots?.find(s => {
        const snapshotYear = new Date(s.date).getFullYear();
        const nextYear = snapshotYear + 1;
        return `${snapshotYear}-${nextYear}` === year;
      });
      
      if (snapshot && snapshot.enrollmentData) {
        const enrollment = snapshot.enrollmentData;
        yearData[year].enrollment.total = enrollment.totalStudents || 0;
        yearData[year].enrollment.male = enrollment.maleStudents || 0;
        yearData[year].enrollment.female = enrollment.femaleStudents || 0;
        yearData[year].enrollment.byClass = enrollment.classSummary || {};
      }
      
      // Données de revenus
      const paymentSystems = database.paymentSystems?.filter(ps => {
        const startYear = new Date(ps.startDate).getFullYear();
        const endYear = new Date(ps.endDate).getFullYear();
        return `${startYear}-${endYear}` === year;
      }) || [];
      
      let totalRevenue = 0;
      let totalPaid = 0;
      
      paymentSystems.forEach(ps => {
        if (ps.payments) {
          ps.payments.forEach(payment => {
            const amount = payment.amount || 0;
            totalRevenue += amount;
            if (payment.isPaid) {
              totalPaid += amount;
            }
          });
        }
      });
      
      yearData[year].revenue.total = totalRevenue;
      yearData[year].revenue.paid = totalPaid;
      yearData[year].revenue.unpaid = totalRevenue - totalPaid;
      yearData[year].revenue.rate = totalRevenue > 0 ? (totalPaid / totalRevenue * 100) : 0;
      
      // Données de dépenses
      const schoolYear = database.schoolYears?.find(sy => sy.name === year);
      if (schoolYear && schoolYear.expenses) {
        const totalExpenses = schoolYear.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        yearData[year].expenses.total = totalExpenses;
        
        // Répartition par catégorie
        schoolYear.expenses.forEach(expense => {
          const category = expense.category || 'Autres';
          yearData[year].expenses.byCategory[category] = 
            (yearData[year].expenses.byCategory[category] || 0) + (expense.amount || 0);
        });
      }
      
      // Calcul du profit
      yearData[year].profit.net = yearData[year].revenue.paid - yearData[year].expenses.total;
      yearData[year].profit.margin = yearData[year].revenue.paid > 0 
        ? (yearData[year].profit.net / yearData[year].revenue.paid * 100) 
        : 0;
    });
    
    return yearData;
  }, [database, selectedYears]);

  // Calculer les taux de croissance
  const growthData = useMemo(() => {
    if (!comparisonData || selectedYears.length < 2) return null;
    
    const sortedYears = selectedYears.sort();
    const growth = {};
    
    for (let i = 1; i < sortedYears.length; i++) {
      const currentYear = sortedYears[i];
      const previousYear = sortedYears[i - 1];
      
      const current = comparisonData[currentYear];
      const previous = comparisonData[previousYear];
      
      growth[currentYear] = {
        enrollment: previous.enrollment.total > 0 
          ? ((current.enrollment.total - previous.enrollment.total) / previous.enrollment.total * 100)
          : 0,
        revenue: previous.revenue.total > 0 
          ? ((current.revenue.total - previous.revenue.total) / previous.revenue.total * 100)
          : 0,
        expenses: previous.expenses.total > 0 
          ? ((current.expenses.total - previous.expenses.total) / previous.expenses.total * 100)
          : 0,
        profit: previous.profit.net !== 0 
          ? ((current.profit.net - previous.profit.net) / Math.abs(previous.profit.net) * 100)
          : 0
      };
    }
    
    return growth;
  }, [comparisonData, selectedYears]);

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
            const value = context.parsed.y;
            if (metricType === 'percentage') {
              return `${context.dataset.label}: ${value.toFixed(1)}%`;
            }
            return `${context.dataset.label}: ${value.toLocaleString()} ${comparisonType === 'enrollment' ? '' : 'FCFA'}`;
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
            if (metricType === 'percentage') {
              return value.toFixed(1) + '%';
            }
            return value.toLocaleString() + (comparisonType === 'enrollment' ? '' : ' FCFA');
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

  // Préparer les données pour les graphiques
  const getChartData = () => {
    if (!comparisonData) return null;
    
    const labels = selectedYears;
    let datasets = [];
    
    switch (comparisonType) {
      case 'enrollment':
        datasets = [
          {
            label: language === 'Français' ? 'Total des inscriptions' : 'Total enrollment',
            data: labels.map(year => comparisonData[year].enrollment.total),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: chartType === 'area'
          },
          {
            label: language === 'Français' ? 'Garçons' : 'Male',
            data: labels.map(year => comparisonData[year].enrollment.male),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: chartType === 'area'
          },
          {
            label: language === 'Français' ? 'Filles' : 'Female',
            data: labels.map(year => comparisonData[year].enrollment.female),
            borderColor: '#EC4899',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            fill: chartType === 'area'
          }
        ];
        break;
        
      case 'revenue':
        datasets = [
          {
            label: language === 'Français' ? 'Revenus totaux' : 'Total revenue',
            data: labels.map(year => comparisonData[year].revenue.total),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.8)'
          },
          {
            label: language === 'Français' ? 'Revenus collectés' : 'Collected revenue',
            data: labels.map(year => comparisonData[year].revenue.paid),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.8)'
          }
        ];
        break;
        
      case 'expenses':
        datasets = [
          {
            label: language === 'Français' ? 'Dépenses totales' : 'Total expenses',
            data: labels.map(year => comparisonData[year].expenses.total),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.8)'
          }
        ];
        break;
        
      case 'profit':
        datasets = [
          {
            label: language === 'Français' ? 'Bénéfice net' : 'Net profit',
            data: labels.map(year => comparisonData[year].profit.net),
            borderColor: '#8B5CF6',
            backgroundColor: labels.map(year => 
              comparisonData[year].profit.net >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
            )
          }
        ];
        break;
        
      default:
        return null;
    }
    
    return { labels, datasets };
  };

  // Carte de comparaison
  const ComparisonCard = ({ title, data, icon: Icon, color, format = 'number' }) => {
    const values = selectedYears.map(year => data[year] || 0);
    const trend = values.length > 1 ? ((values[values.length - 1] - values[0]) / Math.abs(values[0]) * 100) : 0;
    
    return (
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        whileHover={{ scale: 1.02, y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {selectedYears.map((year, index) => {
            const value = values[index];
            const prevValue = index > 0 ? values[index - 1] : null;
            const yearTrend = prevValue !== null && prevValue !== 0 
              ? ((value - prevValue) / Math.abs(prevValue) * 100) 
              : 0;
            
            return (
              <div key={year} className="flex items-center justify-between">
                <span className="text-sm opacity-70">{year}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {format === 'currency' 
                      ? `${value.toLocaleString()} FCFA`
                      : format === 'percentage'
                      ? `${value.toFixed(1)}%`
                      : value.toLocaleString()
                    }
                  </span>
                  {index > 0 && (
                    <div className={`flex items-center gap-1 text-xs ${
                      yearTrend > 0 ? 'text-green-500' : yearTrend < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {yearTrend > 0 ? <TrendingUp className="w-3 h-3" /> : 
                       yearTrend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                      <span>{Math.abs(yearTrend).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {values.length > 1 && (
          <div className={`mt-4 pt-4 border-t ${borderColor} flex items-center justify-between`}>
            <span className="text-sm opacity-70">
              {language === 'Français' ? 'Tendance globale' : 'Overall trend'}
            </span>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
               trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Contrôles de comparaison */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ArrowUpDown className="w-5 h-5 opacity-70" />
            <h3 className="font-medium">
              {language === 'Français' ? 'Configuration de la comparaison' : 'Comparison configuration'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sélection des années */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'Français' ? 'Années à comparer' : 'Years to compare'}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableYears.map(year => (
                  <label key={year} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(year)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedYears([...selectedYears, year]);
                        } else {
                          setSelectedYears(selectedYears.filter(y => y !== year));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{year}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Type de comparaison */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'Français' ? 'Type de données' : 'Data type'}
              </label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm border transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="enrollment">
                  {language === 'Français' ? 'Inscriptions' : 'Enrollment'}
                </option>
                <option value="revenue">
                  {language === 'Français' ? 'Revenus' : 'Revenue'}
                </option>
                <option value="expenses">
                  {language === 'Français' ? 'Dépenses' : 'Expenses'}
                </option>
                <option value="profit">
                  {language === 'Français' ? 'Profits' : 'Profit'}
                </option>
              </select>
            </div>
            
            {/* Type de métrique */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'Français' ? 'Affichage' : 'Display'}
              </label>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm border transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="absolute">
                  {language === 'Français' ? 'Valeurs absolues' : 'Absolute values'}
                </option>
                <option value="percentage">
                  {language === 'Français' ? 'Pourcentages' : 'Percentages'}
                </option>
                <option value="growth">
                  {language === 'Français' ? 'Taux de croissance' : 'Growth rates'}
                </option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {selectedYears.length === 0 ? (
        <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">
            {language === 'Français' ? 'Sélectionnez des années à comparer' : 'Select years to compare'}
          </p>
          <p className="text-sm opacity-70">
            {language === 'Français' 
              ? 'Choisissez au moins une année dans les options ci-dessus' 
              : 'Choose at least one year from the options above'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Cartes de comparaison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ComparisonCard
              title={language === 'Français' ? 'Inscriptions' : 'Enrollment'}
              data={Object.fromEntries(selectedYears.map(year => [year, comparisonData[year]?.enrollment.total || 0]))}
              icon={Users}
              color="bg-blue-500"
            />
            
            <ComparisonCard
              title={language === 'Français' ? 'Revenus' : 'Revenue'}
              data={Object.fromEntries(selectedYears.map(year => [year, comparisonData[year]?.revenue.total || 0]))}
              icon={DollarSign}
              color="bg-green-500"
              format="currency"
            />
            
            <ComparisonCard
              title={language === 'Français' ? 'Dépenses' : 'Expenses'}
              data={Object.fromEntries(selectedYears.map(year => [year, comparisonData[year]?.expenses.total || 0]))}
              icon={TrendingDown}
              color="bg-red-500"
              format="currency"
            />
            
            <ComparisonCard
              title={language === 'Français' ? 'Profits' : 'Profit'}
              data={Object.fromEntries(selectedYears.map(year => [year, comparisonData[year]?.profit.net || 0]))}
              icon={Target}
              color="bg-purple-500"
              format="currency"
            />
          </div>

          {/* Graphique de comparaison principal */}
          <motion.div
            className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {language === 'Français' ? 'Comparaison Annuelle' : 'Annual Comparison'} - 
              {comparisonType === 'enrollment' ? (language === 'Français' ? 'Inscriptions' : 'Enrollment') :
               comparisonType === 'revenue' ? (language === 'Français' ? 'Revenus' : 'Revenue') :
               comparisonType === 'expenses' ? (language === 'Français' ? 'Dépenses' : 'Expenses') :
               (language === 'Français' ? 'Profits' : 'Profit')}
            </h3>
            
            <div className="h-96">
              {getChartData() && (
                chartType === 'line' ? (
                  <Line data={getChartData()} options={chartOptions} />
                ) : chartType === 'radar' ? (
                  <Radar data={getChartData()} options={chartOptions} />
                ) : (
                  <Bar data={getChartData()} options={chartOptions} />
                )
              )}
            </div>
          </motion.div>

          {/* Tableau de comparaison détaillé */}
          <motion.div
            className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              {language === 'Français' ? 'Tableau de Comparaison' : 'Comparison Table'}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${borderColor}`}>
                    <th className="text-left py-3 px-4 font-medium">
                      {language === 'Français' ? 'Métrique' : 'Metric'}
                    </th>
                    {selectedYears.map(year => (
                      <th key={year} className="text-right py-3 px-4 font-medium">{year}</th>
                    ))}
                    <th className="text-right py-3 px-4 font-medium">
                      {language === 'Français' ? 'Évolution' : 'Evolution'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${borderColor}`}>
                    <td className="py-3 px-4 font-medium">
                      {language === 'Français' ? 'Inscriptions totales' : 'Total enrollment'}
                    </td>
                    {selectedYears.map(year => (
                      <td key={year} className="py-3 px-4 text-right">
                        {comparisonData[year]?.enrollment.total.toLocaleString() || '0'}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      {selectedYears.length > 1 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ((comparisonData[selectedYears[selectedYears.length - 1]]?.enrollment.total || 0) - 
                           (comparisonData[selectedYears[0]]?.enrollment.total || 0)) > 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {(((comparisonData[selectedYears[selectedYears.length - 1]]?.enrollment.total || 0) - 
                             (comparisonData[selectedYears[0]]?.enrollment.total || 0)) / 
                             Math.abs(comparisonData[selectedYears[0]]?.enrollment.total || 1) * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                  
                  <tr className={`border-b ${borderColor}`}>
                    <td className="py-3 px-4 font-medium">
                      {language === 'Français' ? 'Revenus totaux' : 'Total revenue'}
                    </td>
                    {selectedYears.map(year => (
                      <td key={year} className="py-3 px-4 text-right">
                        {(comparisonData[year]?.revenue.total || 0).toLocaleString()} FCFA
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      {selectedYears.length > 1 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ((comparisonData[selectedYears[selectedYears.length - 1]]?.revenue.total || 0) - 
                           (comparisonData[selectedYears[0]]?.revenue.total || 0)) > 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {(((comparisonData[selectedYears[selectedYears.length - 1]]?.revenue.total || 0) - 
                             (comparisonData[selectedYears[0]]?.revenue.total || 0)) / 
                             Math.abs(comparisonData[selectedYears[0]]?.revenue.total || 1) * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                  
                  <tr className={`border-b ${borderColor}`}>
                    <td className="py-3 px-4 font-medium">
                      {language === 'Français' ? 'Dépenses totales' : 'Total expenses'}
                    </td>
                    {selectedYears.map(year => (
                      <td key={year} className="py-3 px-4 text-right">
                        {(comparisonData[year]?.expenses.total || 0).toLocaleString()} FCFA
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      {selectedYears.length > 1 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ((comparisonData[selectedYears[selectedYears.length - 1]]?.expenses.total || 0) - 
                           (comparisonData[selectedYears[0]]?.expenses.total || 0)) > 0
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {(((comparisonData[selectedYears[selectedYears.length - 1]]?.expenses.total || 0) - 
                             (comparisonData[selectedYears[0]]?.expenses.total || 0)) / 
                             Math.abs(comparisonData[selectedYears[0]]?.expenses.total || 1) * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                  
                  <tr className={`border-b ${borderColor}`}>
                    <td className="py-3 px-4 font-medium">
                      {language === 'Français' ? 'Bénéfice net' : 'Net profit'}
                    </td>
                    {selectedYears.map(year => (
                      <td key={year} className="py-3 px-4 text-right">
                        <span className={comparisonData[year]?.profit.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {(comparisonData[year]?.profit.net || 0).toLocaleString()} FCFA
                        </span>
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      {selectedYears.length > 1 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ((comparisonData[selectedYears[selectedYears.length - 1]]?.profit.net || 0) - 
                           (comparisonData[selectedYears[0]]?.profit.net || 0)) > 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {Math.abs(comparisonData[selectedYears[0]]?.profit.net || 0) > 0 
                            ? (((comparisonData[selectedYears[selectedYears.length - 1]]?.profit.net || 0) - 
                               (comparisonData[selectedYears[0]]?.profit.net || 0)) / 
                               Math.abs(comparisonData[selectedYears[0]]?.profit.net || 1) * 100).toFixed(1)
                            : '∞'
                          }%
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ComparisonAnalytics;