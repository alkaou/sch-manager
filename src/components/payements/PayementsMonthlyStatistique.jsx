import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts";
import { translate } from "./payement_translator";
import {
  getClasseName,
  getClasseById,
  delay,
  fr_months,
  bm_months,
  en_months,
} from "../../utils/helpers";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
  Filler,
} from "chart.js";
import {
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart2,
} from "lucide-react";

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

const PayementsMonthlyStatistique = ({
  db,
  theme,
  text_color,
  all_classes = [],
}) => {
  const { language } = useLanguage();
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState("");
  const [chartType, setChartType] = useState("line");
  const [isLoading, setIsLoading] = useState(true);
  const [availableSchoolYears, setAvailableSchoolYears] = useState([]);
  const [currentSchoolYear, setCurrentSchoolYear] = useState("");
  const [schoolMonths, setSchoolMonths] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availablePaymentSystems, setAvailablePaymentSystems] = useState([]);
  let [classesToProcess, setClassesToProcess] = useState([]);

  // Styles en fonction du thème
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const textColorClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const chartBgColor =
    theme === "dark" ? "rgba(26, 32, 44, 0.8)" : "rgba(255, 255, 255, 0.8)";
  const chartGridColor =
    theme === "dark" ? "rgba(74, 85, 104, 0.2)" : "rgba(160, 174, 192, 0.2)";

  // Mois en français
  const months =
    language === "Français"
      ? fr_months
      : language === "Bambara"
      ? bm_months
      : en_months;

  const handleOnlySchoolYearSystem = (value) => {
    const year_1 = value.substr(0, 4);
    const year_2 = value.substr(5, 8);
    if (db.paymentSystems && db.paymentSystems.length > 0) {
      const findSystems = db.paymentSystems.filter(
        (sys) =>
          sys.startDate.substr(0, 4) === year_1 &&
          sys.endDate.substr(0, 4) === year_2
      );
      // console.log(findSystems);
      setAvailablePaymentSystems(findSystems);
    }
  };

  useEffect(() => {
    if (!db || !db.paymentSystems) {
      setIsLoading(false);
      return;
    }
    if (db && db.paymentSystems) {
      // Extraire toutes les années scolaires uniques des systèmes de paiement
      const schoolYears = new Map();

      db.paymentSystems.forEach((system) => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();

        // Créer une clé pour l'année scolaire (ex: "2023-2024")
        const schoolYearKey = `${startYear}-${endYear}`;

        if (!schoolYears.has(schoolYearKey)) {
          schoolYears.set(schoolYearKey, {
            key: schoolYearKey,
            startYear,
            endYear,
            label: `${translate(
              "school_year",
              language
            )} ${startYear}-${endYear}`,
            systems: [],
          });
        }

        // Ajouter ce système à l'année scolaire correspondante
        schoolYears.get(schoolYearKey).systems.push(system);
      });

      // Convertir en tableau et trier
      const sortedSchoolYears = Array.from(schoolYears.values()).sort(
        (a, b) => {
          // D'abord par année de début (décroissant)
          if (a.startYear !== b.startYear) {
            return b.startYear - a.startYear;
          }
          // Ensuite par année de fin (décroissant)
          return b.endYear - a.endYear;
        }
      );

      setAvailableSchoolYears(sortedSchoolYears);

      // Si des années scolaires sont disponibles, sélectionner la première par défaut
      if (sortedSchoolYears.length > 0) {
        const defaultSchoolYear = sortedSchoolYears[0].key;
        setCurrentSchoolYear(defaultSchoolYear);

        // Générer les mois scolaires pour cette année
        const selectedSchoolYear = sortedSchoolYears[0];
        generateSchoolMonths(selectedSchoolYear.systems);
      }

      // Extraire les systèmes de paiement disponibles
      const paymentSystems = db.paymentSystems.map((system) => ({
        id: system.id,
        name: system.name,
      }));
      // setAvailablePaymentSystems(paymentSystems);

      // console.log(paymentSystems);

      // Définir le système de paiement par défaut (le plus récent)
      if (db.paymentSystems.length > 0) {
        setSelectedPaymentSystem(db.paymentSystems[0].id);
        const year_1 = db.paymentSystems[0].startDate;
        const year_2 = db.paymentSystems[0].endDate;
        const SysAvailableValue = `${year_1.substr(0, 4)}-${year_2.substr(
          0,
          4
        )}`;
        // console.log(SysAvailableValue);
        handleOnlySchoolYearSystem(SysAvailableValue);
      }
    }
  }, [db]);

  // Mettre à jour les classes disponibles lorsque le système de paiement change
  useEffect(() => {
    if (db && selectedPaymentSystem) {
      // Trouver le système de paiement sélectionné
      const paymentSystem = db.paymentSystems.find(
        (system) => system.id === selectedPaymentSystem
      );

      db.paymentSystems.map((sys) => {
        sys.classes.map((cls) => {
          const real_classe = getClasseById(db.classes, cls, language);
          if (!all_classes.includes(real_classe)) {
            all_classes.push(real_classe);
          }
        });
      });
      // console.log(all_classes);

      if (paymentSystem && paymentSystem.classes && all_classes.length > 0) {
        // Filtrer uniquement les classes qui sont dans le système de paiement
        const filteredClasses = all_classes
          .filter((cls) => paymentSystem.classes.includes(cls.id))
          .sort((a, b) => a.level - b.level);

        const classes = filteredClasses.map((cls) => ({
          id: cls.id,
          name: getClasseName(`${cls.level} ${cls.name}`, language),
        }));

        setAvailableClasses([
          { id: "all", name: translate("all_classes", language) },
          ...classes,
        ]);
      } else {
        // Si aucun système n'est sélectionné ou s'il n'a pas de classes, afficher une liste vide
        setAvailableClasses([
          { id: "all", name: translate("all_classes", language) },
        ]);
      }
    }
  }, [db, selectedPaymentSystem]);

  // Générer les mois scolaires à partir des systèmes de paiement
  const generateSchoolMonths = (systems) => {
    if (!systems || systems.length === 0) {
      setIsLoading(false);
      return;
    }

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
        jsYear: currentMonth.getFullYear(),
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    setSchoolMonths(monthsArray);
  };

  // Mettre à jour les mois scolaires lorsque l'année scolaire change
  useEffect(() => {
    if (currentSchoolYear && availableSchoolYears.length > 0) {
      const selectedSchoolYear = availableSchoolYears.find(
        (sy) => sy.key === currentSchoolYear
      );
      if (selectedSchoolYear) {
        generateSchoolMonths(selectedSchoolYear.systems);
      }
    }
  }, [currentSchoolYear, availableSchoolYears]);

  useEffect(() => {
    if (db && schoolMonths.length > 0) {
      calculateMonthlyData();
    }
  }, [
    db,
    selectedClass,
    selectedPaymentSystem,
    currentSchoolYear,
    schoolMonths,
  ]);

  const calculateMonthlyData = () => {
    setIsLoading(true);

    if (!db || !db.paymentSystems || schoolMonths.length === 0) {
      setMonthlyData([]);
      setIsLoading(false);
      return;
    }
    // Filtrer les systèmes de paiement pour l'année scolaire sélectionnée
    let selectedYearSystems = [];

    if (currentSchoolYear) {
      // Trouver l'année scolaire sélectionnée
      const schoolYear = availableSchoolYears.find(
        (sy) => sy.key === currentSchoolYear
      );
      if (schoolYear) {
        selectedYearSystems = schoolYear.systems;
      }
    }

    if (selectedYearSystems.length === 0) {
      setMonthlyData([]);
      setIsLoading(false);
      return;
    }

    // Trouver le système de paiement sélectionné parmi ceux de l'année scolaire
    const paymentSystem = selectedYearSystems.find(
      (system) => system.id === selectedPaymentSystem
    );
    if (!paymentSystem) {
      // Si le système sélectionné n'est pas dans l'année scolaire, prendre le premier disponible
      if (selectedYearSystems.length > 0) {
        setSelectedPaymentSystem(selectedYearSystems[0].id);
        const year_1 = selectedYearSystems[0].startDate;
        const year_2 = selectedYearSystems[0].endDate;
        const SysAvailableValue = `${year_1.substr(0, 4)}-${year_2.substr(
          0,
          4
        )}`;
        // console.log(SysAvailableValue);
        handleOnlySchoolYearSystem(SysAvailableValue);
      }
      setMonthlyData([]);
      setIsLoading(false);
      return;
    }

    // Filtrer les classes selon la sélection
    if (selectedClass === "all") {
      all_classes.forEach((cls) => {
        if (
          paymentSystem.classes &&
          paymentSystem.classes.includes(cls.id) &&
          !classesToProcess.includes(cls)
        ) {
          classesToProcess.push(cls);
        }
      });
    } else {
      setIsLoading(true);
      // console.log(selectedClass);
      const the_classe = getClasseById(db.classes, selectedClass, language);
      // console.log([the_classe]);
      classesToProcess = [the_classe];
      delay(1000).then(() => {
        setIsLoading(false);
      });
    }

    // console.log(all_classes);
    // console.log(classesToProcess);
    // console.log(selectedClass);

    // Initialiser les données mensuelles basées sur les mois scolaires
    const monthlyStats = schoolMonths.map((schoolMonth) => ({
      month: schoolMonth.name,
      monthNumber: schoolMonth.number,
      jsMonth: schoolMonth.jsMonth,
      jsYear: schoolMonth.jsYear,
      expectedAmount: 0,
      receivedAmount: 0,
      studentCount: 0,
      paidCount: 0,
      paymentPercentage: 0,
      yearlyExpectedAmount: 0,
      yearlyReceivedAmount: 0,
      yearlyPaidCount: 0,
    }));

    // Calculer les statistiques pour chaque classe
    classesToProcess.forEach((cls) => {
      // Clé pour les paiements de cette classe
      const paymentKey = `students_${paymentSystem.id}_${cls.id}`;

      // Compter les élèves dans cette classe
      // Récupérer les paiements pour cette classe
      const classPayments =
        db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];
      const studentsInClass = classPayments;

      if (studentsInClass.length === 0) {
        setIsLoading(false);
        return;
      }

      // Frais mensuels et annuels
      const monthlyFee = Number(paymentSystem.monthlyFee);
      const yearlyFee = Number(paymentSystem.yearlyFee || 0);

      // Pour chaque mois, calculer les montants attendus et reçus
      monthlyStats.forEach((stat) => {
        // Montant mensuel attendu pour ce mois
        const monthlyExpected = studentsInClass.length * monthlyFee;
        stat.expectedAmount += monthlyExpected;
        stat.studentCount += studentsInClass.length;

        // Compter les élèves qui ont payé ce mois
        let paidStudentsCount = 0;
        classPayments.forEach((student) => {
          if (
            student.month_payed &&
            Array.isArray(student.month_payed) &&
            student.month_payed.includes(stat.monthNumber.toString())
          ) {
            paidStudentsCount++;
            stat.receivedAmount += monthlyFee;
          }

          // Si l'élève a payé le frais annuel (supposons qu'il est marqué dans le premier mois)
          if (
            yearlyFee > 0 &&
            stat.monthNumber === 1 &&
            student.yearly_paid === true
          ) {
            stat.yearlyReceivedAmount += yearlyFee;
            stat.yearlyPaidCount++;
          }
        });

        stat.paidCount += paidStudentsCount;
      });

      // Ajouter les frais d'inscription au premier mois si c'est applicable
      if (monthlyStats.length > 0) {
        const firstMonth = monthlyStats[0];
        const registrationFee = Number(paymentSystem.registrationFee);

        // Clé pour les frais d'inscription de cette classe
        const registrationFeeKey = `registration_fee_${paymentSystem.id}_${cls.id}`;
        const registrationFeeData =
          db.registrationFees && db.registrationFees[registrationFeeKey]
            ? db.registrationFees[registrationFeeKey]
            : {};

        // Compter les élèves qui doivent payer les frais d'inscription
        const studentsRequiringRegistrationFee = Object.entries(
          registrationFeeData
        ).filter(([studentId, value]) => value === true).length;

        // Calculer les frais d'inscription prévus
        const registrationFees =
          studentsRequiringRegistrationFee * registrationFee;

        // Ajouter au premier mois
        firstMonth.expectedAmount += registrationFees;
        firstMonth.receivedAmount += registrationFees; // Supposons que tous les frais d'inscription sont payés
      }
    });

    // Calculer les pourcentages de paiement
    monthlyStats.forEach((stat) => {
      // Ajouter les frais annuels aux montants totaux
      const totalExpected = stat.expectedAmount + stat.yearlyExpectedAmount;
      const totalReceived = stat.receivedAmount + stat.yearlyReceivedAmount;

      stat.totalExpectedAmount = totalExpected;
      stat.totalReceivedAmount = totalReceived;

      stat.paymentPercentage =
        totalExpected > 0
          ? Math.round((totalReceived / totalExpected) * 100)
          : 0;
    });
    // console.log(monthlyStats);
    setMonthlyData(monthlyStats);
    setIsLoading(false);
  };

  // Configuration des graphiques
  const getChartData = () => {
    return {
      labels: monthlyData.map((data) => data.month),
      datasets: [
        {
          label: translate("monthly_expected_amount", language),
          data: monthlyData.map((data) => data.expectedAmount),
          borderColor: "rgba(53, 162, 235, 1)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.4,
          fill: chartType === "line" ? "origin" : false,
          borderWidth: 2,
        },
        {
          label: translate("monthly_received_amount", language),
          data: monthlyData.map((data) => data.receivedAmount),
          borderColor: "rgb(4, 241, 83)",
          backgroundColor: "rgba(8, 245, 87, 0.5)",
          tension: 0.4,
          fill: chartType === "line" ? "origin" : false,
          borderWidth: 2,
        },
      ],
    };
  };

  // Le reste du code reste inchangé
  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: theme === "dark" ? "#fff" : "#333",
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: chartBgColor,
          titleColor: theme === "dark" ? "#fff" : "#333",
          bodyColor: theme === "dark" ? "#fff" : "#333",
          borderColor: borderColor,
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              const locale = language === "Anglais" ? "en-US" : "fr-FR";
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "XAF",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: chartGridColor,
          },
          ticks: {
            color: theme === "dark" ? "#fff" : "#333",
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: chartGridColor,
          },
          ticks: {
            color: theme === "dark" ? "#fff" : "#333",
            callback: function (value) {
              return value.toLocaleString() + " FCFA";
            },
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
    };
  };

  // Données pour le graphique en anneau (taux de paiement)
  const getDoughnutData = () => {
    // Calculer la moyenne des pourcentages de paiement
    const avgPaymentPercentage =
      monthlyData.length > 0
        ? monthlyData.reduce((sum, data) => sum + data.paymentPercentage, 0) /
          monthlyData.length
        : 0;

    return {
      labels: [translate("paid", language), translate("not_paid", language)],
      datasets: [
        {
          data: [avgPaymentPercentage, 100 - avgPaymentPercentage],
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDoughnutOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: theme === "dark" ? "#fff" : "#333",
          },
        },
        tooltip: {
          backgroundColor: chartBgColor,
          titleColor: theme === "dark" ? "#fff" : "#333",
          bodyColor: theme === "dark" ? "#fff" : "#333",
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
      },
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${text_color}`}>
          {translate("monthly_payment_statistics", language)}
        </h2>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <Calendar className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={currentSchoolYear}
              onChange={(e) => {
                setCurrentSchoolYear(e.target.value);
                handleOnlySchoolYearSystem(e.target.value);
              }}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {availableSchoolYears.map((year) => (
                <option key={year.key} value={year.key}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <Filter className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={selectedPaymentSystem}
              onChange={(e) => setSelectedPaymentSystem(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {availablePaymentSystems.map((system) => (
                <option key={system.id} value={system.id}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <Filter className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {availableClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <BarChart2 className={`h-5 w-5 mr-2 ${text_color}`} />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="line">
                {translate("linear_chart", language)}
              </option>
              <option value="bar">{translate("bar_chart", language)}</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {monthlyData.length === 0 ? (
            <div
              className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">
                {translate("no_data_available", language)}
              </h3>
              <p className="text-gray-500">
                {translate("no_payment_data_message", language)}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Graphique principal */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6 lg:col-span-2`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  {translate("monthly_payment_evolution", language)}
                </h3>
                <div className="h-80">
                  {chartType === "line" ? (
                    <Line data={getChartData()} options={getChartOptions()} />
                  ) : (
                    <Bar data={getChartData()} options={getChartOptions()} />
                  )}
                </div>
              </motion.div>

              {/* Graphique en anneau et statistiques */}
              <motion.div
                className="flex flex-col gap-6"
                variants={containerVariants}
              >
                <motion.div
                  className={`${cardBgColor} rounded-lg shadow-lg p-6`}
                  variants={itemVariants}
                >
                  <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                    {translate("average_collection_rate", language)}
                  </h3>
                  <div className="h-60">
                    <Doughnut
                      data={getDoughnutData()}
                      options={getDoughnutOptions()}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className={`${cardBgColor} rounded-lg shadow-lg p-6`}
                  variants={itemVariants}
                >
                  <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                    {translate("financial_summary", language)}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 mr-3">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className={`${textColorClass}`}>
                          {translate("total_expected", language)}
                        </span>
                      </div>
                      <span className="font-bold text-blue-500">
                        {formatCurrency(
                          monthlyData.reduce(
                            (sum, data) => sum + data.expectedAmount,
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 mr-3">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <span className={`${textColorClass}`}>
                          {translate("total_received", language)}
                        </span>
                      </div>
                      <span className="font-bold text-green-500">
                        {formatCurrency(
                          monthlyData.reduce(
                            (sum, data) => sum + data.receivedAmount,
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-100 mr-3">
                          <PieChart className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className={`${textColorClass}`}>
                          {translate("average_rate", language)}
                        </span>
                      </div>
                      <span className="font-bold text-purple-500">
                        {Math.round(
                          monthlyData.reduce(
                            (sum, data) => sum + data.paymentPercentage,
                            0
                          ) / monthlyData.length
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Tableau des données mensuelles */}
              <motion.div
                className={`${cardBgColor} rounded-lg shadow-lg p-6 lg:col-span-3`}
                variants={itemVariants}
              >
                <h3 className={`text-lg font-bold ${textColorClass} mb-4`}>
                  {translate("monthly_details", language)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={headerBgColor}>
                      <tr>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("month", language)}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("students", language)}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("paid_students", language)}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("expected", language)}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("received", language)}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}
                        >
                          {translate("rate", language)}
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {monthlyData.map((data, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? headerBgColor : ""}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}
                          >
                            {data.month}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}
                          >
                            {data.studentCount}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}
                          >
                            {data.paidCount}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}
                          >
                            {formatCurrency(
                              data.totalExpectedAmount || data.expectedAmount
                            )}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${textColorClass}`}
                          >
                            {formatCurrency(
                              data.totalReceivedAmount || data.receivedAmount
                            )}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              data.paymentPercentage >= 70
                                ? "text-green-500"
                                : data.paymentPercentage >= 40
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {data.paymentPercentage}%
                          </td>
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

export default PayementsMonthlyStatistique;
