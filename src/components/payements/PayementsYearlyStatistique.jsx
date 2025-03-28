import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts';
import { Bar, Line, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Calendar, Filter, TrendingUp, DollarSign, PieChart, BarChart2, ArrowUp, ArrowDown } from 'lucide-react';

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PayementsYearlyStatistique = ({ db, theme, app_bg_color, text_color }) => {
  const { language } = useLanguage();
  const [yearlyData, setYearlyData] = useState([]);
  const [compareYears, setCompareYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSchoolYears, setAvailableSchoolYears] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyTrends, setYearlyTrends] = useState({
    totalExpected: 0,
    totalReceived: 0,
    percentageChange: 0,
    isPositive: true
  });
  // Ajout d'un état pour les mois scolaires
  const [schoolMonths, setSchoolMonths] = useState([]);

  // Styles en fonction du thème
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const textColorClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const chartBgColor = theme === "dark" ? "rgba(26, 32, 44, 0.8)" : "rgba(255, 255, 255, 0.8)";
  const chartGridColor = theme === "dark" ? "rgba(74, 85, 104, 0.2)" : "rgba(160, 174, 192, 0.2)";

  // Mois en français - nous utiliserons cette liste uniquement comme référence
  const months = language === 'fr'
    ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Fonction pour générer les mois scolaires à partir des systèmes de paiement
  const generateSchoolMonths = (systems) => {
    if (!systems || systems.length === 0) return [];

    // Utiliser le premier système pour déterminer les mois scolaires
    const system = systems[0];
    const startDate = new Date(system.startDate);
    const endDate = new Date(system.endDate);

    const monthsArray = [];
    let currentMonth = new Date(startDate);

    while (currentMonth <= endDate) {
      monthsArray.push({
        number: monthsArray.length + 1, // 1-indexed school month number
        name: months[currentMonth.getMonth()],
        year: currentMonth.getFullYear(),
        jsMonth: currentMonth.getMonth(), // 0-indexed JavaScript month
        jsYear: currentMonth.getFullYear()
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return monthsArray;
  };

  useEffect(() => {
    if (db && db.paymentSystems) {
      // Extraire les années scolaires uniques
      const schoolYears = new Map();
      db.paymentSystems.forEach(system => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();

        // Créer une clé pour l'année scolaire (ex: "2023-2024")
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

        // Ajouter ce système à l'année scolaire correspondante
        schoolYears.get(schoolYearKey).systems.push(system);
      });

      // Convertir en tableau et trier
      const sortedSchoolYears = Array.from(schoolYears.values()).sort((a, b) => {
        // D'abord par année de début (décroissant)
        if (a.startYear !== b.startYear) {
          return b.startYear - a.startYear;
        }
        // Ensuite par année de fin (décroissant)
        return b.endYear - a.endYear;
      });

      setAvailableSchoolYears(sortedSchoolYears);

      // Générer les mois scolaires à partir du premier système de paiement disponible
      if (sortedSchoolYears.length > 0 && sortedSchoolYears[0].systems.length > 0) {
        const schoolMonthsArray = generateSchoolMonths(sortedSchoolYears[0].systems);
        setSchoolMonths(schoolMonthsArray);
      }

      // Extraire les années civiles pour la comparaison
      // Mais nous utiliserons les années scolaires pour la sélection
      const yearsSet = new Set();
      sortedSchoolYears.forEach(schoolYear => {
        yearsSet.add(schoolYear.key);
      });

      const sortedYears = Array.from(yearsSet);
      setAvailableYears(sortedYears);

      // Sélectionner par défaut les deux années scolaires les plus récentes pour la comparaison
      if (sortedYears.length >= 2) {
        setCompareYears([sortedYears[0], sortedYears[1]]);
      } else if (sortedYears.length === 1) {
        setCompareYears([sortedYears[0]]);
      }
    }
  }, [db, language]);

  useEffect(() => {
    if (db && compareYears.length > 0 && schoolMonths.length > 0) {
      calculateYearlyData();
    }
  }, [db, compareYears, schoolMonths]);

  const calculateYearlyData = () => {
    setIsLoading(true);

    if (!db || !db.classes || !db.students || !db.paymentSystems || compareYears.length === 0 || schoolMonths.length === 0) {
      setYearlyData([]);
      setIsLoading(false);
      return;
    }

    // Initialiser les données pour chaque année scolaire à comparer
    const yearlyStats = compareYears.map(yearKey => {
      // Trouver l'année scolaire correspondante
      const schoolYear = availableSchoolYears.find(sy => sy.key === yearKey);

      if (!schoolYear) return null;

      return {
        year: yearKey,
        label: schoolYear.label,
        startYear: schoolYear.startYear,
        endYear: schoolYear.endYear,
        monthlyData: schoolMonths.map((month, index) => ({
          month: month.name,
          monthIndex: index,
          expectedAmount: 0,
          receivedAmount: 0,
          paymentPercentage: 0
        })),
        totalExpected: 0,
        totalReceived: 0,
        paymentPercentage: 0
      };
    }).filter(Boolean); // Filtrer les valeurs null

    // Pour chaque année scolaire à comparer
    yearlyStats.forEach(yearStat => {
      // Trouver l'année scolaire correspondante
      const schoolYear = availableSchoolYears.find(sy => sy.key === yearStat.year);

      if (!schoolYear) return;

      // Utiliser les systèmes de paiement de cette année scolaire
      const yearSystems = schoolYear.systems;

      if (yearSystems.length === 0) return;

      // Pour chaque système de paiement
      yearSystems.forEach(system => {
        // Filtrer les classes concernées par ce système
        const classes = db.classes.filter(cls =>
          system.classes && system.classes.includes(cls.id)
        );

        // Pour chaque classe
        classes.forEach(cls => {
          // Compter les élèves dans cette classe
          const studentsInClass = db.students.filter(student =>
            student.classe === `${cls.level} ${cls.name}` && student.status === "actif"
          );

          if (studentsInClass.length === 0) return;

          // Frais mensuels
          const monthlyFee = Number(system.monthlyFee);

          // Clé pour les paiements de cette classe
          const paymentKey = `students_${system.id}_${cls.id}`;

          // Récupérer les paiements pour cette classe
          const classPayments = db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];

          // Pour chaque mois, calculer les montants attendus et reçus
          yearStat.monthlyData.forEach((monthData, monthIndex) => {
            // Vérifier si ce mois fait partie de l'année scolaire
            const monthDate = new Date(schoolMonths[monthIndex].jsYear, schoolMonths[monthIndex].jsMonth);
            const systemStartDate = new Date(system.startDate);
            const systemEndDate = new Date(system.endDate);

            if (monthDate >= systemStartDate && monthDate <= systemEndDate) {
              // Montant attendu pour ce mois
              const expectedMonthly = studentsInClass.length * monthlyFee;
              monthData.expectedAmount += expectedMonthly;
              yearStat.totalExpected += expectedMonthly;

              // Compter les élèves qui ont payé ce mois
              let receivedMonthly = 0;
              classPayments.forEach(student => {
                if (student.month_payed && Array.isArray(student.month_payed) &&
                  student.month_payed.includes(schoolMonths[monthIndex].jsMonth)) {
                  receivedMonthly += monthlyFee;
                }
              });

              monthData.receivedAmount += receivedMonthly;
              yearStat.totalReceived += receivedMonthly;
            }
          });

          // Frais d'inscription
          const registrationFee = Number(system.registrationFee);

          // Clé pour les frais d'inscription de cette classe
          const registrationFeeKey = `registration_fee_${system.id}_${cls.id}`;
          const registrationFeeData = db.registrationFees && db.registrationFees[registrationFeeKey]
            ? db.registrationFees[registrationFeeKey]
            : {};

          // Compter les élèves qui doivent payer les frais d'inscription
          const studentsRequiringRegistrationFee = Object.entries(registrationFeeData)
            .filter(([studentId, value]) => value === true)
            .length;

          // Calculer les frais d'inscription prévus et reçus
          const expectedRegistration = studentsRequiringRegistrationFee * registrationFee;
          yearStat.totalExpected += expectedRegistration;

          // Trouver le premier mois de l'année scolaire pour y ajouter les frais d'inscription
          const firstMonthIndex = yearStat.monthlyData.findIndex((monthData, idx) => {
            const monthDate = new Date(schoolMonths[idx].jsYear, schoolMonths[idx].jsMonth);
            const systemStartDate = new Date(system.startDate);
            return monthDate.getMonth() === systemStartDate.getMonth() &&
              monthDate.getFullYear() === systemStartDate.getFullYear();
          });

          if (firstMonthIndex !== -1) {
            yearStat.monthlyData[firstMonthIndex].expectedAmount += expectedRegistration;
            // Supposons que tous les frais d'inscription ont été payés
            yearStat.totalReceived += expectedRegistration;
            yearStat.monthlyData[firstMonthIndex].receivedAmount += expectedRegistration;
          }
        });
      });

      // Calculer les pourcentages de paiement pour chaque mois
      yearStat.monthlyData.forEach(monthData => {
        monthData.paymentPercentage = monthData.expectedAmount > 0
          ? Math.round((monthData.receivedAmount / monthData.expectedAmount) * 100)
          : 0;
      });

      // Calculer le pourcentage global de paiement pour l'année
      yearStat.paymentPercentage = yearStat.totalExpected > 0
        ? Math.round((yearStat.totalReceived / yearStat.totalExpected) * 100)
        : 0;
    });

    // Calculer les tendances annuelles (comparaison avec l'année précédente)
    if (yearlyStats.length >= 2) {
      const currentYear = yearlyStats[0];
      const previousYear = yearlyStats[1];

      const percentageChange = previousYear.paymentPercentage > 0
        ? ((currentYear.paymentPercentage - previousYear.paymentPercentage) / previousYear.paymentPercentage) * 100
        : 0;

      setYearlyTrends({
        totalExpected: currentYear.totalExpected,
        totalReceived: currentYear.totalReceived,
        percentageChange: Math.abs(Math.round(percentageChange)),
        isPositive: percentageChange >= 0
      });
    } else if (yearlyStats.length === 1) {
      setYearlyTrends({
        totalExpected: yearlyStats[0].totalExpected,
        totalReceived: yearlyStats[0].totalReceived,
        percentageChange: 0,
        isPositive: true
      });
    }

    setYearlyData(yearlyStats);
    setIsLoading(false);
  };

  // Configuration des graphiques
  const getChartData = () => {
    return {
      labels: schoolMonths.map(month => month.name),
      datasets: yearlyData.map((yearStat, index) => {
        // Générer une couleur différente pour chaque année
        const colors = [
          { border: 'rgba(53, 162, 235, 1)', background: 'rgba(53, 162, 235, 0.5)' },
          { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.5)' },
          { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.5)' },
          { border: 'rgba(255, 159, 64, 1)', background: 'rgba(255, 159, 64, 0.5)' }
        ];

        const colorIndex = index % colors.length;

        return {
          label: yearStat.label,
          data: yearStat.monthlyData.map(data => data.receivedAmount),
          borderColor: colors[colorIndex].border,
          backgroundColor: colors[colorIndex].background,
          tension: 0.4,
          fill: chartType === 'line' ? 'origin' : false,
          borderWidth: 2
        };
      })
    };
  };

  const getChartOptions = () => {
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
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(context.parsed.y);
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
              return value.toLocaleString() + ' FCFA';
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

  // Données pour le graphique radar (comparaison des pourcentages de paiement par mois)
  const getRadarData = () => {
    return {
      labels: months,
      datasets: yearlyData.map((yearStat, index) => {
        // Générer une couleur différente pour chaque année
        const colors = [
          { border: 'rgba(53, 162, 235, 1)', background: 'rgba(53, 162, 235, 0.3)' },
          { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.3)' },
          { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.3)' },
          { border: 'rgba(255, 159, 64, 1)', background: 'rgba(255, 159, 64, 0.3)' }
        ];

        const colorIndex = index % colors.length;

        return {
          label: `Année ${yearStat.year}`,
          data: yearStat.monthlyData.map(data => data.paymentPercentage),
          borderColor: colors[colorIndex].border,
          backgroundColor: colors[colorIndex].background,
          borderWidth: 2
        };
      })
    };
  };

  const getRadarOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            color: chartGridColor
          },
          grid: {
            color: chartGridColor
          },
          pointLabels: {
            color: theme === 'dark' ? '#fff' : '#333'
          },
          ticks: {
            color: theme === 'dark' ? '#fff' : '#333',
            backdropColor: 'transparent',
            callback: function (value) {
              return value + '%';
            }
          }
        }
      },
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
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      animation: {
        duration: 2000
      }
    };
  };

  // Fonction pour formater les montants en FCFA
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + " FCFA";
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

  // Fonction pour gérer la sélection des années à comparer
  const handleYearSelection = (year) => {
    // Vérifier si l'année est déjà sélectionnée
    if (compareYears.includes(year)) {
      // Si c'est la seule année, ne pas la retirer
      if (compareYears.length === 1) return;

      // Sinon, retirer cette année
      setCompareYears(compareYears.filter(y => y !== year));
    } else {
      // Limiter à 3 années maximum pour la lisibilité des graphiques
      if (compareYears.length >= 3) {
        // Retirer la plus ancienne année et ajouter la nouvelle
        const newYears = [...compareYears];
        newYears.pop();
        newYears.unshift(year);
        setCompareYears(newYears);
      } else {
        // Ajouter cette année au début du tableau
        setCompareYears([year, ...compareYears]);
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
        <h2 className={`text-2xl font-bold ${textColorClass}`}>Comparaison Annuelle des Revenus</h2>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <BarChart2 className={`h-5 w-5 mr-2 ${textColorClass}`} />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="bar">Graphique à barres</option>
              <option value="line">Graphique linéaire</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className={`text-lg font-medium ${textColorClass} mb-3`}>Sélectionner les années à comparer:</h3>
        <div className="flex flex-wrap gap-2">
          {availableYears.map(year => {
            // Trouver l'année scolaire correspondante pour afficher le label
            const schoolYear = availableSchoolYears.find(sy => sy.key === year);
            return (
              <button
                key={year}
                onClick={() => handleYearSelection(year)}
                className={`px-4 py-2 rounded-full transition-all ${compareYears.includes(year)
                  ? 'bg-blue-500 text-white'
                  : `${headerBgColor} ${textColorClass}`
                  }`}
              >
                {schoolYear ? schoolYear.label : year}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {yearlyData.length === 0 ? (
            <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Aucune donnée disponible</h3>
              <p className="text-gray-500">
                Veuillez sélectionner au moins une année pour afficher les statistiques.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Cartes de résumé */}
              {yearlyData.map((yearStat, index) => (
                <motion.div
                  key={yearStat.year}
                  className={`${cardBgColor} rounded-lg shadow-lg p-6`}
                  variants={itemVariants}
                >
                  <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                    Année {yearStat.year}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`${textColorClass}`}>Budget total:</span>
                      <span className="font-bold text-blue-500">
                        {formatCurrency(yearStat.totalExpected)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${textColorClass}`}>Montant reçu:</span>
                      <span className="font-bold text-green-500">
                        {formatCurrency(yearStat.totalReceived)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${textColorClass}`}>Taux de recouvrement:</span>
                      <span className={`font-bold ${yearStat.paymentPercentage >= 70 ? 'text-green-500' :
                        yearStat.paymentPercentage >= 40 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                        {yearStat.paymentPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <motion.div
                        className={`h-2.5 rounded-full ${yearStat.paymentPercentage >= 70 ? 'bg-green-500' :
                          yearStat.paymentPercentage >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: '0%' }}
                        animate={{ width: `${yearStat.paymentPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Graphique principal */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6 lg:col-span-3`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  Évolution des revenus mensuels par année
                </h3>
                <div className="h-96">
                  {chartType === 'line' ? (
                    <Line data={getChartData()} options={getChartOptions()} />
                  ) : (
                    <Bar data={getChartData()} options={getChartOptions()} />
                  )}
                </div>
              </motion.div>

              {/* Graphique radar */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6 lg:col-span-2`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  Comparaison des taux de recouvrement mensuels
                </h3>
                <div className="h-80">
                  <Radar data={getRadarData()} options={getRadarOptions()} />
                </div>
              </motion.div>

              {/* Tendances annuelles */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  Tendances annuelles
                </h3>
                {yearlyData.length >= 2 ? (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className={`p-4 rounded-full ${yearlyTrends.isPositive ? 'bg-green-100' : 'bg-red-100'} mr-4`}>
                        {yearlyTrends.isPositive ? (
                          <ArrowUp className={`h-8 w-8 ${yearlyTrends.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                        ) : (
                          <ArrowDown className={`h-8 w-8 ${yearlyTrends.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm ${textColorClass}`}>
                          {yearlyTrends.isPositive ? 'Amélioration' : 'Baisse'} du taux de recouvrement
                        </p>
                        <p className={`text-2xl font-bold ${yearlyTrends.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {yearlyTrends.percentageChange}%
                        </p>
                        <p className={`text-xs ${textColorClass} opacity-70`}>
                          Par rapport à l'année précédente
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${headerBgColor}`}>
                      <h4 className={`text-sm font-medium ${textColorClass} mb-2`}>Analyse</h4>
                      <p className={`text-sm ${textColorClass}`}>
                        {yearlyTrends.isPositive
                          ? `Le taux de recouvrement s'est amélioré de ${yearlyTrends.percentageChange}% par rapport à l'année précédente, ce qui indique une meilleure gestion des paiements.`
                          : `Le taux de recouvrement a diminué de ${yearlyTrends.percentageChange}% par rapport à l'année précédente. Des mesures pourraient être nécessaires pour améliorer le recouvrement.`
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg ${headerBgColor} text-center`}>
                    <p className={`${textColorClass}`}>
                      Sélectionnez au moins deux années pour voir les tendances comparatives.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Tableau comparatif */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6 lg:col-span-3`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  Tableau comparatif des revenus mensuels
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={headerBgColor}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>Mois</th>
                        {yearlyData.map(yearStat => (
                          <th key={yearStat.year} className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                            {yearStat.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {schoolMonths.map((month, monthIndex) => (
                        <tr key={monthIndex} className={monthIndex % 2 === 0 ? headerBgColor : ''}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}>{month.name}</td>
                          {yearlyData.map(yearStat => (
                            <td key={`${yearStat.year}-${monthIndex}`} className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}>
                              <div className="flex flex-col">
                                <span>{formatCurrency(yearStat.monthlyData[monthIndex].receivedAmount)}</span>
                                <span className={`text-xs ${yearStat.monthlyData[monthIndex].paymentPercentage >= 70 ? 'text-green-500' :
                                  yearStat.monthlyData[monthIndex].paymentPercentage >= 40 ? 'text-yellow-500' :
                                    'text-red-500'
                                  }`}>
                                  ({yearStat.monthlyData[monthIndex].paymentPercentage}%)
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default PayementsYearlyStatistique;