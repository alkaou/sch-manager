import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts";
import { getClasseName, getClasseById } from "../../utils/helpers";
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
import { Line, Bar, PolarArea, Radar } from 'react-chartjs-2';
import { Calendar, Filter, TrendingUp, DollarSign, PieChart, BarChart2, ArrowUpRight, ArrowDownRight, Layers, Target } from 'lucide-react';

// Register ChartJS components
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

const PayementsYearlyStatistique = ({ db, theme, app_bg_color, text_color }) => {
  const { language } = useLanguage();
  const [yearlyData, setYearlyData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [comparisonMetric, setComparisonMetric] = useState('totalRevenue');
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [topPerformingClasses, setTopPerformingClasses] = useState([]);
  const [underperformingClasses, setUnderperformingClasses] = useState([]);
  const [yearOverYearGrowth, setYearOverYearGrowth] = useState(0);

  // Styles based on theme
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColorClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const chartBgColor = theme === "dark" ? "rgba(26, 32, 44, 0.8)" : "rgba(255, 255, 255, 0.8)";
  const chartGridColor = theme === "dark" ? "rgba(74, 85, 104, 0.2)" : "rgba(160, 174, 192, 0.2)";
  const cardHoverEffect = theme === "dark" ? "hover:bg-gray-750" : "hover:bg-gray-50";

  // Extract available school years from payment systems
  useEffect(() => {
    if (db && db.paymentSystems) {
      // Extract unique school years from payment systems
      const schoolYears = new Map();

      db.paymentSystems.forEach(system => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();

        // Create a key for the school year (e.g., "2023-2024")
        const schoolYearKey = `${startYear}-${endYear}`;

        if (!schoolYears.has(schoolYearKey)) {
          schoolYears.set(schoolYearKey, {
            key: schoolYearKey,
            startYear,
            endYear,
            label: `Année scolaire ${startYear}-${endYear}`,
            systems: []
          });
        }

        // Add this system to the corresponding school year
        schoolYears.get(schoolYearKey).systems.push(system);
      });

      // Convert to array and sort
      const sortedSchoolYears = Array.from(schoolYears.values()).sort((a, b) => {
        // First by start year (descending)
        if (a.startYear !== b.startYear) {
          return b.startYear - a.startYear;
        }
        // Then by end year (descending)
        return b.endYear - a.endYear;
      });

      setAvailableYears(sortedSchoolYears);

      // Select the two most recent years by default if available
      if (sortedSchoolYears.length > 0) {
        const yearsToSelect = sortedSchoolYears.slice(0, Math.min(2, sortedSchoolYears.length)).map(y => y.key);
        setSelectedYears(yearsToSelect);
      }
    }
  }, [db]);

  // Calculate yearly data when selected years change
  useEffect(() => {
    if (db && selectedYears.length > 0) {
      calculateYearlyData();
    }
  }, [db, selectedYears, comparisonMetric]);

  const calculateYearlyData = () => {
    setIsLoading(true);

    if (!db || !db.paymentSystems || selectedYears.length === 0) {
      setYearlyData([]);
      setComparisonData([]);
      setIsLoading(false);
      return;
    }

    // Process data for each selected school year
    const yearlyStats = [];
    const comparisonStats = [];
    const trends = [];
    let previousYearTotal = 0;
    let currentYearTotal = 0;

    // Process each selected year
    selectedYears.forEach((yearKey, yearIndex) => {
      const selectedYear = availableYears.find(y => y.key === yearKey);
      if (!selectedYear) return;

      const yearSystems = selectedYear.systems;
      if (yearSystems.length === 0) return;

      // Initialize data for this year
      const yearData = {
        year: yearKey,
        label: selectedYear.label,
        totalExpected: 0,
        totalReceived: 0,
        registrationFees: 0,
        monthlyFees: 0,
        yearlyFees: 0,
        paymentPercentage: 0,
        classeStats: [],
        monthlyBreakdown: Array(12).fill(0).map((_, i) => ({
          month: i,
          expected: 0,
          received: 0
        }))
      };

      // Récupérer toutes les classes des modes de payement 'paymentSystems'
      const classes = [];
      db.paymentSystems.map(sys => {
          sys.classes.map(cls => {
              if(!classes.includes(cls)){
                  classes.push(cls);
              }
          });
      });

      // Process each class for this year
      classes.forEach(cls => {
        // Find the payment system for this class in the selected year
        const paymentSystem = yearSystems.find(system =>
          system.classes && system.classes.includes(cls)
        );

        if (!paymentSystem) return; // Skip classes without a payment system for this year

        // Key for payments for this class
        const paymentKey = `students_${paymentSystem.id}_${cls}`;
        // Get payments for this class
        const classPayments = db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];
        // Count students in this class
        const studentsInClass = classPayments;

        if (studentsInClass.length === 0) return; // Skip classes without students

        // Calculate expected annual budget
        const monthlyFee = Number(paymentSystem.monthlyFee);
        const yearlyFee = Number(paymentSystem.yearlyFee || 0);

        // Calculate number of months in the school year
        const startDate = new Date(paymentSystem.startDate);
        const endDate = new Date(paymentSystem.endDate);
        const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth()) + 1;

        // Total monthly budget for the year - using the correct number of months
        const monthlyTotal = studentsInClass.length * monthlyFee * monthDiff;

        // Registration fees
        const registrationFee = Number(paymentSystem.registrationFee);

        // Key for registration fees for this class
        const registrationFeeKey = `registration_fee_${paymentSystem.id}_${cls}`;
        const registrationFeeData = db.registrationFees && db.registrationFees[registrationFeeKey]
          ? db.registrationFees[registrationFeeKey]
          : {};

        // Count students who need to pay registration fees
        const studentsRequiringRegistrationFee = Object.entries(registrationFeeData)
          .filter(([studentId, value]) => value === true)
          .length;

        // Calculate expected registration fees
        const registrationTotal = studentsRequiringRegistrationFee * registrationFee;

        // Yearly fees total if applicable
        const yearlyTotal = studentsInClass.length * yearlyFee;

        // Total expected budget for the year
        const expectedAmount = monthlyTotal + registrationTotal;
        yearData.totalExpected += expectedAmount;
        yearData.registrationFees += registrationTotal;
        yearData.monthlyFees += monthlyTotal;
        yearData.yearlyFees += yearlyTotal;

        // Calculate total amount received for all months
        let receivedAmount = 0;

        // For each student, count paid months and multiply by monthly fee
        classPayments.forEach(student => {
          if (student.month_payed && Array.isArray(student.month_payed)) {
            receivedAmount += student.month_payed.length * monthlyFee;

            // Add to monthly breakdown
            student.month_payed.forEach(monthNum => {
              const monthIndex = parseInt(monthNum) - 1;
              if (monthIndex >= 0 && monthIndex < 12) {
                yearData.monthlyBreakdown[monthIndex].received += monthlyFee;
              }
            });
          }

          // Add yearly fee if paid
          if (student.yearly_paid) {
            receivedAmount += yearlyFee;
          }
        });

        // Add received registration fees - THIS IS THE CORRECTED PART
        const paidRegistrationCount = Object.entries(registrationFeeData)
          .filter(([studentId, value]) => value === true)
          .length;

        const receivedRegistrationFees = paidRegistrationCount * registrationFee;
        receivedAmount += receivedRegistrationFees;

        yearData.totalReceived += receivedAmount;

        // Calculate payment percentage
        const paymentPercentage = expectedAmount > 0
          ? Math.round((receivedAmount / expectedAmount) * 100)
          : 0;

        const this_classe = getClasseById(db.classes, cls, language);

        // Add class stats
        yearData.classeStats.push({
          id: this_classe.id,
          className: getClasseName(`${this_classe.level} ${this_classe.name}`, language),
          level: this_classe.level,
          name: this_classe.name,
          studentCount: studentsInClass.length,
          expectedAmount,
          receivedAmount,
          paymentPercentage
        });

        // Add expected amounts to monthly breakdown
        // Distribute expected monthly fees evenly across the school months
        const monthlyExpected = monthlyTotal / monthDiff;
        for (let i = 0; i < monthDiff; i++) {
          const monthIndex = (startDate.getMonth() + i) % 12;
          yearData.monthlyBreakdown[monthIndex].expected += monthlyExpected;
        }
      });

      // Calculate overall payment percentage
      yearData.paymentPercentage = yearData.totalExpected > 0
        ? Math.round((yearData.totalReceived / yearData.totalExpected) * 100)
        : 0;

      // Sort classes by payment percentage (descending)
      yearData.classeStats.sort((a, b) => b.paymentPercentage - a.paymentPercentage);

      // Add to yearly stats
      yearlyStats.push(yearData);

      // Track totals for year-over-year calculation
      if (yearIndex === 0 && selectedYears.length > 1) {
        currentYearTotal = yearData.totalReceived;
      } else if (yearIndex === 1) {
        previousYearTotal = yearData.totalReceived;
      }

      // Add to comparison data
      comparisonStats.push({
        year: yearKey,
        label: selectedYear.label,
        value: comparisonMetric === 'totalRevenue' ? yearData.totalReceived :
          comparisonMetric === 'expectedRevenue' ? yearData.totalExpected :
            comparisonMetric === 'paymentPercentage' ? yearData.paymentPercentage :
              comparisonMetric === 'registrationFees' ? yearData.registrationFees :
                comparisonMetric === 'monthlyFees' ? yearData.monthlyFees :
                  yearData.yearlyFees
      });

      // Calculate monthly trends
      const monthlyTrend = yearData.monthlyBreakdown.map((month, index) => ({
        month: index,
        percentage: month.expected > 0 ? (month.received / month.expected) * 100 : 0
      }));

      trends.push({
        year: yearKey,
        label: selectedYear.label,
        trend: monthlyTrend
      });
    });

    // Calculate year-over-year growth
    const yoyGrowth = previousYearTotal > 0
      ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
      : 0;

    // Find top and underperforming classes
    if (yearlyStats.length > 0) {
      const latestYear = yearlyStats[0];
      setTopPerformingClasses(latestYear.classeStats.slice(0, 3));
      setUnderperformingClasses([...latestYear.classeStats].sort((a, b) =>
        a.paymentPercentage - b.paymentPercentage
      ).slice(0, 3));
    }

    setYearlyData(yearlyStats);
    setComparisonData(comparisonStats);
    setYearlyTrends(trends);
    setYearOverYearGrowth(yoyGrowth);
    setIsLoading(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get chart data for comparison
  const getComparisonChartData = () => {
    const labels = comparisonData.map(data => data.label);
    const values = comparisonData.map(data => data.value);

    return {
      labels,
      datasets: [
        {
          label: getComparisonMetricLabel(),
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Get chart options for comparison
  const getComparisonChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: theme === 'dark' ? '#fff' : '#333',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: chartBgColor,
          titleColor: theme === 'dark' ? '#fff' : '#333',
          bodyColor: theme === 'dark' ? '#fff' : '#333',
          borderColor: borderColor,
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (comparisonMetric === 'paymentPercentage') {
                label += context.parsed.y + '%';
              } else {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: chartGridColor
          },
          ticks: {
            color: theme === 'dark' ? '#fff' : '#333'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: chartGridColor
          },
          ticks: {
            color: theme === 'dark' ? '#fff' : '#333',
            callback: function (value) {
              if (comparisonMetric === 'paymentPercentage') {
                return value + '%';
              } else {
                return value.toLocaleString() + ' FCFA';
              }
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    };
  };

  // Get trend chart data
  const getTrendChartData = () => {
    // Get months in French or English based on language
    const months = language === 'Français'
      ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      labels: months,
      datasets: yearlyTrends.map((yearTrend, index) => ({
        label: yearTrend.label,
        data: yearTrend.trend.map(m => m.percentage),
        borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    };
  };

  // Get trend chart options
  const getTrendChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: theme === 'dark' ? '#fff' : '#333',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: chartBgColor,
          titleColor: theme === 'dark' ? '#fff' : '#333',
          bodyColor: theme === 'dark' ? '#fff' : '#333',
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y.toFixed(1) + '%';
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: chartGridColor
          },
          ticks: {
            color: theme === 'dark' ? '#fff' : '#333'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: chartGridColor
          },
          ticks: {
            color: theme === 'dark' ? '#fff' : '#333',
            callback: function (value) {
              return value + '%';
            }
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    };
  };

  // Get radar chart data for class performance
  const getClassPerformanceData = () => {
    if (yearlyData.length === 0) return { labels: [], datasets: [] };

    const latestYear = yearlyData[0];
    const topClasses = latestYear.classeStats.slice(0, 6);

    return {
      labels: topClasses.map(cls => cls.className),
      datasets: [
        {
          label: 'Taux de paiement (%)',
          data: topClasses.map(cls => cls.paymentPercentage),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  // Get radar chart options
  const getRadarChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: theme === 'dark' ? '#fff' : '#333'
          }
        },
        tooltip: {
          backgroundColor: chartBgColor,
          titleColor: theme === 'dark' ? '#fff' : '#333',
          bodyColor: theme === 'dark' ? '#fff' : '#333',
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.r}%`;
            }
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            color: theme === 'dark' ? '#fff' : '#333'
          },
          grid: {
            color: chartGridColor
          },
          angleLines: {
            color: chartGridColor
          },
          pointLabels: {
            color: theme === 'dark' ? '#fff' : '#333',
            font: {
              size: 10
            }
          }
        }
      },
      animation: {
        duration: 2000
      }
    };
  };

  // Get comparison metric label
  const getComparisonMetricLabel = () => {
    switch (comparisonMetric) {
      case 'totalRevenue':
        return 'Revenu Total';
      case 'expectedRevenue':
        return 'Revenu Attendu';
      case 'paymentPercentage':
        return 'Taux de Paiement (%)';
      case 'registrationFees':
        return 'Frais d\'Inscription';
      case 'monthlyFees':
        return 'Frais Mensuels';
      case 'yearlyFees':
        return 'Frais Annuels';
      default:
        return 'Revenu Total';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${text_color}`}>Statistiques Annuelles des Paiements</h2>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className={`h-5 w-5 mr-2 ${text_color}`} />
              <span className={`text-sm font-medium ${text_color}`}>Années scolaires</span>
            </div>
            <div className="flex flex-wrap gap-2 max-w-md">
              {availableYears.map(year => (
                <button
                  key={year.key}
                  onClick={() => {
                    if (selectedYears.includes(year.key)) {
                      // Remove year if already selected
                      setSelectedYears(selectedYears.filter(y => y !== year.key));
                    } else {
                      // Add year if not selected (limit to 4)
                      if (selectedYears.length < 4) {
                        setSelectedYears([...selectedYears, year.key]);
                      }
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
                    ${selectedYears.includes(year.key)
                      ? 'bg-blue-500 text-white shadow-md'
                      : `${cardBgColor} ${textColorClass} border ${borderColor} hover:bg-blue-100 dark:hover:bg-gray-700`}
                  `}
                >
                  {year.label.replace('Année scolaire ', '')}
                  {selectedYears.includes(year.key) && (
                    <span className="ml-1.5 inline-flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedYears.length === 0 && (
              <p className={`text-xs mt-1 text-red-500`}>
                Veuillez sélectionner au moins une année
              </p>
            )}
            {selectedYears.length === 4 && (
              <p className={`text-xs mt-1 text-amber-500`}>
                Maximum 4 années sélectionnables
              </p>
            )}
          </div>

          <div className="flex items-center">
            <Filter className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={comparisonMetric}
              onChange={(e) => setComparisonMetric(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="totalRevenue">Revenu Total</option>
              <option value="expectedRevenue">Revenu Attendu</option>
              <option value="paymentPercentage">Taux de Paiement (%)</option>
              <option value="registrationFees">Frais d'Inscription</option>
              <option value="monthlyFees">Frais Mensuels</option>
              <option value="yearlyFees">Frais Annuels</option>
            </select>
          </div>

          <div className="flex items-center">
            <BarChart2 className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="bar">Graphique à barres</option>
              <option value="line">Graphique linéaire</option>
              <option value="polarArea">Graphique polaire</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : yearlyData.length === 0 ? (
        <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-500">
            Veuillez sélectionner au moins une année scolaire pour afficher les statistiques.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Key Performance Indicators */}
          {yearlyData.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Latest Year Revenue Card */}
              <div className={`${cardBgColor} rounded-lg p-6 shadow-lg border-l-4 border-blue-500`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <DollarSign className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${textColorClass} opacity-70`}>Revenu Total</h3>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="mb-1">
                    <p className="text-2xl font-bold text-blue-500">{formatCurrency(yearlyData[0]?.totalReceived || 0)}</p>
                  </div>
                  <p className={`text-xs ${textColorClass} opacity-60`}>
                    Année scolaire {yearlyData[0]?.label}
                  </p>
                </div>
              </div>

              {/* Expected Revenue Card */}
              <div className={`${cardBgColor} rounded-lg p-6 shadow-lg border-l-4 border-green-500`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${textColorClass} opacity-70`}>Revenu Attendu</h3>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="mb-1">
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(yearlyData[0]?.totalExpected || 0)}</p>
                  </div>
                  <p className={`text-xs ${textColorClass} opacity-60`}>
                    Objectif financier pour {yearlyData[0]?.label}
                  </p>
                </div>
              </div>

              {/* Payment Rate Card */}
              <div className={`${cardBgColor} rounded-lg p-6 shadow-lg border-l-4 border-purple-500`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <PieChart className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${textColorClass} opacity-70`}>Taux de Paiement</h3>
                    <p className="text-2xl font-bold text-purple-500">{yearlyData[0]?.paymentPercentage || 0}%</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className={`text-xs ${textColorClass} opacity-60`}>
                    Pourcentage des revenus perçus
                  </p>
                </div>
              </div>

              {/* Year-over-Year Growth Card */}
              <div className={`${cardBgColor} rounded-lg p-6 shadow-lg border-l-4 ${yearOverYearGrowth >= 0 ? 'border-amber-500' : 'border-red-500'}`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full ${yearOverYearGrowth >= 0 ? 'bg-amber-100' : 'bg-red-100'} mr-4`}>
                    {yearOverYearGrowth >= 0 ? (
                      <ArrowUpRight className="h-6 w-6 text-amber-500" />
                    ) : (
                      <ArrowDownRight className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${textColorClass} opacity-70`}>Croissance Annuelle</h3>
                    <p className={`text-2xl font-bold ${yearOverYearGrowth >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                      {yearOverYearGrowth >= 0 ? '+' : ''}{yearOverYearGrowth.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className={`text-xs ${textColorClass} opacity-60`}>
                    {selectedYears.length > 1
                      ? `Par rapport à ${availableYears.find(y => y.key === selectedYears[1])?.label}`
                      : 'Sélectionnez une année précédente pour comparer'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Charts Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Comparison Chart */}
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>
                Comparaison des {getComparisonMetricLabel()} par Année Scolaire
              </h3>
              <div className="h-80">
                {chartType === 'bar' && (
                  <Bar data={getComparisonChartData()} options={getComparisonChartOptions()} />
                )}
                {chartType === 'line' && (
                  <Line data={getComparisonChartData()} options={getComparisonChartOptions()} />
                )}
                {chartType === 'polarArea' && (
                  <PolarArea data={getComparisonChartData()} options={{
                    ...getComparisonChartOptions(),
                    scales: undefined
                  }} />
                )}
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>
                Évolution Mensuelle du Taux de Paiement
              </h3>
              <div className="h-80">
                <Line data={getTrendChartData()} options={getTrendChartOptions()} />
              </div>
            </div>
          </motion.div>

          {/* Class Performance Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Top Performing Classes */}
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Classes les Plus Performantes
                </span>
              </h3>
              <div className="space-y-4">
                {topPerformingClasses.map((cls, index) => (
                  <div key={cls.id} className={`p-3 rounded-lg ${cardHoverEffect} border ${borderColor}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-medium ${textColorClass}`}>{cls.className}</h4>
                        <p className="text-xs text-gray-500">{cls.studentCount} élèves</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-500 font-bold">{cls.paymentPercentage}%</div>
                        <p className="text-xs text-gray-500">{formatCurrency(cls.receivedAmount)}</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${cls.paymentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Performance Radar Chart */}
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>
                <span className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-500" />
                  Performance des Classes
                </span>
              </h3>
              <div className="h-64">
                <Radar data={getClassPerformanceData()} options={getRadarChartOptions()} />
              </div>
            </div>

            {/* Underperforming Classes */}
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>
                <span className="flex items-center">
                  <ArrowDownRight className="h-5 w-5 mr-2 text-red-500" />
                  Classes à Améliorer
                </span>
              </h3>
              <div className="space-y-4">
                {underperformingClasses.map((cls, index) => (
                  <div key={cls.id} className={`p-3 rounded-lg ${cardHoverEffect} border ${borderColor}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-medium ${textColorClass}`}>{cls.className}</h4>
                        <p className="text-xs text-gray-500">{cls.studentCount} élèves</p>
                      </div>
                      <div className="text-right">
                        <div className="text-red-500 font-bold">{cls.paymentPercentage}%</div>
                        <p className="text-xs text-gray-500">{formatCurrency(cls.receivedAmount)}</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${cls.paymentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PayementsYearlyStatistique;