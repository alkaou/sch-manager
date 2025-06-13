import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  RotateCw,
  Calendar,
  Filter
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
  RadialLinearScale,
  Filler
} from 'chart.js';
import { getCurrentSchoolYear } from '../../utils/schoolYear';
import { getSnapshotsByYear, calculateEnrollmentStats } from '../../utils/snapshotManager';
import { getClasseName } from '../../utils/helpers';

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
  RadialLinearScale,
  Filler
);

const EnrollmentAnalytics = ({
  database,
  selectedYear,
  theme,
  textColor,
  cardBg,
  borderColor,
  language,
  chartType,
  viewMode
}) => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [timeView, setTimeView] = useState('evolution'); // evolution, snapshot, comparison
  
  // Calcul des statistiques d'effectifs
  const stats = useMemo(() => {
    if (!database?.snapshots) return null;
    return calculateEnrollmentStats(database.snapshots, selectedYear);
  }, [database?.snapshots, selectedYear]);

  // Données pour les graphiques d'évolution
  const evolutionData = useMemo(() => {
    if (!database?.snapshots) return [];
    
    const snapshots = getSnapshotsByYear(database.snapshots, selectedYear);
    return snapshots.map(snapshot => ({
      schoolYear: snapshot.schoolYear,
      total: snapshot.summary.totalStudents,
      male: snapshot.summary.totalMale,
      female: snapshot.summary.totalFemale,
      date: new Date(snapshot.timestamp).toLocaleDateString(),
      timestamp: snapshot.timestamp
    })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [database?.snapshots, selectedYear]);

  // Données par classe
  const classData = useMemo(() => {
    if (!stats?.classBreakdown) return [];
    return stats.classBreakdown.map(cls => ({
      ...cls,
      className: getClasseName(cls.classId, database?.classes || [])
    }));
  }, [stats, database?.classes]);

  // Classes disponibles pour le filtre
  const availableClasses = useMemo(() => {
    const classes = [{ id: 'all', name: language === 'Français' ? 'Toutes les classes' : 'All classes' }];
    if (database?.classes) {
      classes.push(...database.classes.map(cls => ({ id: cls.id, name: cls.name })));
    }
    return classes;
  }, [database?.classes, language]);

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
        beginAtZero: true,
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

  // Données pour le graphique d'évolution
  const evolutionChartData = {
    labels: evolutionData.map(d => d.date),
    datasets: [
      {
        label: language === 'Français' ? 'Total' : 'Total',
        data: evolutionData.map(d => d.total),
        borderColor: '#3B82F6',
        backgroundColor: chartType === 'area' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      },
      {
        label: language === 'Français' ? 'Garçons' : 'Boys',
        data: evolutionData.map(d => d.male),
        borderColor: '#10B981',
        backgroundColor: chartType === 'area' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      },
      {
        label: language === 'Français' ? 'Filles' : 'Girls',
        data: evolutionData.map(d => d.female),
        borderColor: '#EC4899',
        backgroundColor: chartType === 'area' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.8)',
        fill: chartType === 'area',
        tension: 0.4
      }
    ]
  };

  // Données pour la répartition par classe
  const classChartData = {
    labels: classData.map(cls => cls.className),
    datasets: [{
      label: language === 'Français' ? 'Effectif' : 'Enrollment',
      data: classData.map(cls => cls.total),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
      ],
      borderColor: [
        '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED',
        '#0891B2', '#65A30D', '#EA580C', '#DB2777', '#4F46E5'
      ],
      borderWidth: 2
    }]
  };

  // Données pour le graphique radar (répartition par genre par classe)
  const radarData = {
    labels: classData.slice(0, 6).map(cls => cls.className), // Limiter à 6 classes pour la lisibilité
    datasets: [
      {
        label: language === 'Français' ? 'Garçons' : 'Boys',
        data: classData.slice(0, 6).map(cls => cls.male),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#059669',
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#10B981'
      },
      {
        label: language === 'Français' ? 'Filles' : 'Girls',
        data: classData.slice(0, 6).map(cls => cls.female),
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        pointBackgroundColor: '#EC4899',
        pointBorderColor: '#DB2777',
        pointHoverBackgroundColor: '#DB2777',
        pointHoverBorderColor: '#EC4899'
      }
    ]
  };

  // Rendu du graphique selon le type sélectionné
  const renderChart = (data, title) => {
    const ChartComponent = {
      line: Line,
      bar: Bar,
      pie: Doughnut,
      area: Line
    }[chartType] || Line;

    return (
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {title}
        </h3>
        <div className="h-80">
          <ChartComponent data={data} options={chartOptions} />
        </div>
      </motion.div>
    );
  };

  // Carte de statistique
  const StatCard = ({ icon: Icon, title, value, subtitle, color, change }) => (
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
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {change > 0 ? <TrendingUp className="w-4 h-4" /> : 
             change < 0 ? <TrendingUp className="w-4 h-4 rotate-180" /> : null}
            <span>{change !== 0 ? `${Math.abs(change)}%` : '0%'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (!stats) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-8 text-center`}>
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {language === 'Français' ? 'Aucune donnée d\'effectifs' : 'No enrollment data'}
        </p>
        <p className="text-sm opacity-70">
          {language === 'Français' 
            ? 'Aucun snapshot disponible pour cette année' 
            : 'No snapshots available for this year'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et contrôles */}
      <motion.div
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 opacity-70" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} 
                border ${borderColor} rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              {availableClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            {['evolution', 'snapshot', 'comparison'].map(view => (
              <button
                key={view}
                onClick={() => setTimeView(view)}
                className={`
                  px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${timeView === view 
                    ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-blue-100 text-blue-700')
                    : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
                  }
                `}
              >
                {view === 'evolution' ? (language === 'Français' ? 'Évolution' : 'Evolution') :
                 view === 'snapshot' ? (language === 'Français' ? 'Instantané' : 'Snapshot') :
                 (language === 'Français' ? 'Comparaison' : 'Comparison')}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title={language === 'Français' ? 'Effectif Total' : 'Total Enrollment'}
          value={stats.totalStudents.toLocaleString()}
          subtitle={language === 'Français' ? 'élèves inscrits' : 'enrolled students'}
          color="bg-blue-500"
        />
        
        <StatCard
          icon={UserCheck}
          title={language === 'Français' ? 'Garçons' : 'Boys'}
          value={stats.totalMale.toLocaleString()}
          subtitle={`${((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%`}
          color="bg-green-500"
        />
        
        <StatCard
          icon={UserCheck}
          title={language === 'Français' ? 'Filles' : 'Girls'}
          value={stats.totalFemale.toLocaleString()}
          subtitle={`${((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%`}
          color="bg-pink-500"
        />
        
        <StatCard
          icon={BarChart3}
          title={language === 'Français' ? 'Classes Actives' : 'Active Classes'}
          value={stats.classBreakdown?.length || 0}
          subtitle={language === 'Français' ? 'classes avec effectifs' : 'classes with students'}
          color="bg-purple-500"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {timeView === 'evolution' && evolutionData.length > 0 && (
          renderChart(
            evolutionChartData,
            language === 'Français' ? 'Évolution des Effectifs' : 'Enrollment Evolution'
          )
        )}
        
        {classData.length > 0 && (
          renderChart(
            classChartData,
            language === 'Français' ? 'Répartition par Classe' : 'Distribution by Class'
          )
        )}
      </div>

      {/* Graphique radar pour la répartition par genre */}
      {classData.length > 0 && (
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {language === 'Français' ? 'Répartition par Genre et Classe' : 'Gender Distribution by Class'}
          </h3>
          <div className="h-80">
            <Radar data={radarData} options={{
              ...chartOptions,
              scales: {
                r: {
                  beginAtZero: true,
                  grid: {
                    color: theme === 'dark' ? '#374151' : '#E5E7EB'
                  },
                  pointLabels: {
                    color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  },
                  ticks: {
                    color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                }
              }
            }} />
          </div>
        </motion.div>
      )}

      {/* Tableau détaillé par classe */}
      {classData.length > 0 && (
        <motion.div
          className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'Français' ? 'Détail par Classe' : 'Class Details'}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  <th className="text-left py-3 px-4 font-medium">
                    {language === 'Français' ? 'Classe' : 'Class'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {language === 'Français' ? 'Total' : 'Total'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {language === 'Français' ? 'Garçons' : 'Boys'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {language === 'Français' ? 'Filles' : 'Girls'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {language === 'Français' ? 'Ratio G/F' : 'M/F Ratio'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {classData.map((cls, index) => (
                  <motion.tr
                    key={cls.classId}
                    className={`border-b ${borderColor} hover:bg-opacity-50 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="py-3 px-4 font-medium">{cls.className}</td>
                    <td className="text-center py-3 px-4">{cls.total}</td>
                    <td className="text-center py-3 px-4 text-green-600">{cls.male}</td>
                    <td className="text-center py-3 px-4 text-pink-600">{cls.female}</td>
                    <td className="text-center py-3 px-4">
                      {cls.female > 0 ? (cls.male / cls.female).toFixed(2) : '∞'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnrollmentAnalytics;