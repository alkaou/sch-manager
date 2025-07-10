import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getClasseName, getClasseById } from "../../utils/helpers";
import { useLanguage } from "../contexts";
import { translate } from "./payement_translator";
import {
  Calendar,
  X,
  DollarSign,
  TrendingUp,
  Users,
  ArrowRight,
  PieChart,
  Timer,
} from "lucide-react";

const PayementsYearlyClass = ({
  db,
  theme,
  // app_bg_color,
  text_color,
}) => {
  const { language } = useLanguage();
  const [yearlyData, setYearlyData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [availableSchoolYears, setAvailableSchoolYears] = useState([]);
  const [currentSchoolYear, setCurrentSchoolYear] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpected, setTotalExpected] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Styles en fonction du thème
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const textColorClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  useEffect(() => {
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

        // Définir l'année civile en fonction de l'année scolaire sélectionnée
        const selectedSchoolYear = sortedSchoolYears[0];
        setCurrentYear(selectedSchoolYear.startYear);
      }

      // Garder aussi la liste des années civiles pour la compatibilité
      const years = new Set();
      db.paymentSystems.forEach((system) => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();

        for (let year = startYear; year <= endYear; year++) {
          years.add(year);
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);
    }
  }, [db]);

  // Mettre à jour l'année civile lorsque l'année scolaire change
  useEffect(() => {
    if (currentSchoolYear && availableSchoolYears.length > 0) {
      const selectedSchoolYear = availableSchoolYears.find(
        (sy) => sy.key === currentSchoolYear
      );
      if (selectedSchoolYear) {
        setCurrentYear(selectedSchoolYear.startYear);
      }
    }
  }, [currentSchoolYear, availableSchoolYears]);

  useEffect(() => {
    if (db) {
      calculateYearlyData();
    }
  }, [db, currentYear, currentSchoolYear]);

  const calculateYearlyData = () => {
    setIsLoading(true);

    if (!db || !db.paymentSystems) {
      setYearlyData([]);
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
    } else {
      // Fallback sur l'ancienne méthode basée sur l'année civile
      selectedYearSystems = db.paymentSystems.filter((system) => {
        const startYear = new Date(system.startDate).getFullYear();
        const endYear = new Date(system.endDate).getFullYear();
        return startYear <= currentYear && endYear >= currentYear;
      });
    }

    if (selectedYearSystems.length === 0) {
      setYearlyData([]);
      setIsLoading(false);
      return;
    }

    // Le reste du code reste inchangé
    const data = [];
    let expectedTotalSum = 0;
    let receivedTotalSum = 0;

    // Récupérer toutes les classes des modes de payement 'paymentSystems'
    const classes = [];
    db.paymentSystems.map((sys) => {
      sys.classes.map((cls) => {
        if (!classes.includes(cls)) {
          classes.push(cls);
        }
      });
    });

    classes.forEach((cls) => {
      // Trouver le système de paiement pour cette classe dans l'année sélectionnée
      const paymentSystem = selectedYearSystems.find(
        (system) => system.classes && system.classes.includes(cls)
      );

      if (!paymentSystem) {
        return; // Ignorer les classes sans système de paiement pour l'année sélectionnée
      }

      // Compter les élèves dans cette classe
      const the_system = `students_${paymentSystem.id}_${cls}`;
      const studentsInClass = db.payments[the_system] || [];

      if (studentsInClass.length === 0) {
        return; // Ignorer les classes sans élèves
      }

      // Calculer le budget annuel prévu
      const monthlyFee = Number(paymentSystem.monthlyFee);

      // Calculer le nombre de mois dans l'année scolaire
      const startDate = new Date(paymentSystem.startDate);
      const endDate = new Date(paymentSystem.endDate);
      const monthDiff =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()) +
        1;

      // Budget mensuel total pour l'année
      const monthlyTotal = studentsInClass.length * monthlyFee * monthDiff;

      // Frais d'inscription
      const registrationFee = Number(paymentSystem.registrationFee);

      // Clé pour les frais d'inscription de cette classe
      const registrationFeeKey = `registration_fee_${paymentSystem.id}_${cls}`;
      const registrationFeeData =
        db.registrationFees && db.registrationFees[registrationFeeKey]
          ? db.registrationFees[registrationFeeKey]
          : {};

      // Compter les élèves qui doivent payer les frais d'inscription
      const studentsRequiringRegistrationFee = Object.entries(
        registrationFeeData
      ).filter(([studentId, value]) => value === true).length;

      // Calculer les frais d'inscription prévus
      const registrationTotal =
        studentsRequiringRegistrationFee * registrationFee;

      // Budget total prévu pour l'année
      const expectedAmount = monthlyTotal + registrationTotal;
      expectedTotalSum += expectedAmount;

      // Clé pour les paiements de cette classe
      const paymentKey = `students_${paymentSystem.id}_${cls}`;

      // Récupérer les paiements pour cette classe
      const classPayments =
        db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];

      // Calculer le montant total reçu pour tous les mois
      let receivedAmount = 0;

      // Pour chaque élève, compter les mois payés et multiplier par le frais mensuel
      classPayments.forEach((student) => {
        if (student.month_payed && Array.isArray(student.month_payed)) {
          receivedAmount += student.month_payed.length * monthlyFee;
        }
      });

      // Ajouter les frais d'inscription reçus
      const paidRegistrationCount = Object.entries(registrationFeeData).filter(
        ([studentId, value]) => value === true
      ).length;

      const receivedRegistrationFees = paidRegistrationCount * registrationFee;
      receivedAmount += receivedRegistrationFees;

      receivedTotalSum += receivedAmount;

      // Calculer le pourcentage de paiement
      const paymentPercentage =
        expectedAmount > 0
          ? Math.round((receivedAmount / expectedAmount) * 100)
          : 0;

      const this_classe = getClasseById(db.classes, cls, language);

      data.push({
        id: this_classe.id,
        className: getClasseName(
          `${this_classe.level} ${this_classe.name}`,
          language
        ),
        level: this_classe.level,
        name: this_classe.name,
        studentCount: studentsInClass.length,
        monthlyFee: monthlyFee,
        monthCount: monthDiff,
        monthlyTotal: monthlyTotal,
        registrationFee: registrationFee,
        registrationTotal: registrationTotal,
        newStudentCount: studentsRequiringRegistrationFee,
        expectedAmount: expectedAmount,
        receivedAmount: receivedAmount,
        remainingAmount: expectedAmount - receivedAmount,
        paymentPercentage: paymentPercentage,
        paymentSystem: paymentSystem,
      });
    });

    // Trier les données par niveau et nom de classe
    const sortedData = data.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    });

    setYearlyData(sortedData);
    setTotalExpected(expectedTotalSum);
    setTotalReceived(receivedTotalSum);
    setIsLoading(false);
  };

  // Fonction pour formater les montants en FCFA
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + " FCFA";
  };

  // Déterminer la couleur de la barre de progression en fonction du pourcentage
  const getProgressColor = (percentage) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
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

  const handleClassClick = (classData) => {
    setSelectedClass(classData);
    setShowDetails(true);
  };

  return (
    <motion.div
      className="container mx-auto p-2 sm:p-3 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-bold ${text_color}`}
        >
          {translate("yearly_class_budget", language)}
        </h2>

        <div className="flex items-center">
          <Calendar
            className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 ${text_color}`}
          />
          <select
            value={currentSchoolYear}
            onChange={(e) => setCurrentSchoolYear(e.target.value)}
            className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {availableSchoolYears.length > 0 ? (
              availableSchoolYears.map((schoolYear) => (
                <option key={schoolYear.key} value={schoolYear.key}>
                  {schoolYear.label}
                </option>
              ))
            ) : (
              <option value="">
                {translate("no_school_year_available", language)}
              </option>
            )}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Résumé global */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={`${cardBgColor} rounded-lg p-3 sm:p-4 md:p-6 shadow-lg border-l-4 border-blue-500`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 mr-3 sm:mr-4">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                </div>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-medium ${textColorClass} opacity-70`}
                  >
                    {translate("total_budget_expected", language)}
                  </h3>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-blue-500">
                    {formatCurrency(totalExpected)}
                  </p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2">
                <p
                  className={`text-2xs sm:text-xs ${textColorClass} opacity-60`}
                >
                  {translate(
                    "budget_annuel_prevu_pour_toutes_les_classes",
                    language
                  )}
                </p>
              </div>
            </motion.div>

            <motion.div
              className={`${cardBgColor} rounded-lg p-3 sm:p-4 md:p-6 shadow-lg border-l-4 border-green-500`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-green-100 mr-3 sm:mr-4">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                </div>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-medium ${textColorClass} opacity-70`}
                  >
                    {translate("total_amount_received", language)}
                  </h3>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-green-500">
                    {formatCurrency(totalReceived)}
                  </p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2">
                <p
                  className={`text-2xs sm:text-xs ${textColorClass} opacity-60`}
                >
                  {translate("montant_total_recu_jusqua_present", language)}
                </p>
              </div>
            </motion.div>

            <motion.div
              className={`${cardBgColor} rounded-lg p-3 sm:p-4 md:p-6 shadow-lg border-l-4 border-red-500`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-red-100 mr-3 sm:mr-4">
                  <Timer className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500" />
                </div>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-medium ${textColorClass} opacity-70`}
                  >
                    {translate("montant_en_attente", language)}
                  </h3>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-red-500">
                    {formatCurrency(totalExpected - totalReceived)}
                  </p>
                </div>
              </div>
              <div className="mt-1 sm:mt-2">
                <p
                  className={`text-2xs sm:text-xs ${textColorClass} opacity-60`}
                >
                  {translate("montant_en_attente_jusqua_present", language)}
                </p>
              </div>
            </motion.div>

            <motion.div
              className={`${cardBgColor} rounded-lg p-3 sm:p-4 md:p-6 shadow-lg border-l-4 border-purple-500`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-purple-100 mr-3 sm:mr-4">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500" />
                </div>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-medium ${textColorClass} opacity-70`}
                  >
                    {translate("recovery_rate", language)}
                  </h3>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-purple-500">
                    {totalExpected > 0
                      ? Math.round((totalReceived / totalExpected) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                <div
                  className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{
                    width: `${
                      totalExpected > 0
                        ? Math.round((totalReceived / totalExpected) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </motion.div>
          </motion.div>

          {yearlyData.length === 0 ? (
            <div
              className={`${cardBgColor} rounded-lg shadow-lg p-4 sm:p-6 md:p-8 text-center ${textColorClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 mx-auto mb-3 sm:mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">
                {translate("no_data_available", language)}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {translate("no_class_configured", language)}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {yearlyData.map((data) => (
                <motion.div
                  key={data.id}
                  className={`${cardBgColor} rounded-lg shadow-lg overflow-hidden`}
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div
                    className={`p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm sm:text-base font-semibold">
                        {translate("total_expected_for", language)}{" "}
                        {currentYear}
                      </h3>
                      <span className="bg-white bg-opacity-30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-2xs sm:text-xs">
                        {translate("niveau", language)} {data.level}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm">
                        {data.studentCount} {translate("students", language)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between mb-0.5 sm:mb-1">
                        <span
                          className={`${textColorClass} text-xs sm:text-sm`}
                        >
                          {translate("taux_de_paiement", language)}
                        </span>
                        <span
                          className={`${textColorClass} text-xs sm:text-sm font-bold`}
                        >
                          {data.paymentPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5">
                        <motion.div
                          className={`h-1.5 sm:h-2.5 rounded-full ${getProgressColor(
                            data.paymentPercentage
                          )}`}
                          style={{ width: "0%" }}
                          animate={{ width: `${data.paymentPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg ${headerBgColor}`}>
                        <h4
                          className={`text-2xs sm:text-xs font-bold ${textColorClass} mb-0.5 sm:mb-1`}
                        >
                          {translate("monthly_fee", language)} (
                          {data.monthCount} {translate("months", language)})
                        </h4>
                        <p
                          className={`${textColorClass} text-xs sm:text-sm font-bold`}
                        >
                          {data.monthlyTotal.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg ${headerBgColor}`}>
                        <h4
                          className={`text-2xs sm:text-xs font-bold ${textColorClass} mb-0.5 sm:mb-1`}
                        >
                          {translate("registration_fees", language)}
                        </h4>
                        <p
                          className={`${textColorClass} text-xs sm:text-sm font-bold`}
                        >
                          {data.registrationTotal.toLocaleString()} FCFA
                        </p>
                        {data.newStudentCount > 0 && (
                          <p
                            className={`text-2xs sm:text-xs ${textColorClass} opacity-70`}
                          >
                            ({data.newStudentCount}{" "}
                            {translate("new_students", language)})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span
                          className={`${textColorClass} text-xs sm:text-sm`}
                        >
                          {translate("amount_expected", language)}:
                        </span>
                        <span
                          className={`${textColorClass} text-xs sm:text-sm font-bold`}
                        >
                          {data.expectedAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`${textColorClass} text-xs sm:text-sm`}
                        >
                          {translate("amount_received", language)}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-green-600">
                          {data.receivedAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 sm:pt-2 border-t border-gray-200">
                        <span
                          className={`${textColorClass} text-xs sm:text-sm`}
                        >
                          {translate("amount_pending", language)}:
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            data.remainingAmount > 0
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {data.remainingAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-center">
                    <button
                      className="w-full py-1.5 sm:py-2 text-xs sm:text-sm text-white font-medium rounded hover:bg-white hover:bg-opacity-20 transition-colors flex items-center justify-center"
                      onClick={() => handleClassClick(data)}
                    >
                      <span>{translate("view_details", language)}</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Modal de détails */}
          <AnimatePresence>
            {showDetails && selectedClass && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDetails(false)}
              >
                <motion.div
                  className={`${cardBgColor} rounded-lg shadow-2xl w-full max-w-sm sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-custom`}
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 md:p-6 text-white relative">
                    <button
                      className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-white hover:text-gray-200"
                      onClick={() => setShowDetails(false)}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </button>
                    <h2
                      className={`text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6`}
                    >
                      {translate("payment_details_for", language)}
                      {" : "}
                      {selectedClass.className}
                    </h2>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">
                        {selectedClass.studentCount}{" "}
                        {translate("students", language)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                      <div
                        className={`p-2 sm:p-3 md:p-4 rounded-lg ${headerBgColor}`}
                      >
                        <h3
                          className={`text-sm sm:text-base md:text-lg font-bold ${textColorClass} mb-2 sm:mb-3`}
                        >
                          {translate("details_de_paiement", language)}
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("monthly_fee", language)}:
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.monthlyFee.toLocaleString()} FCFA
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("number_of_months", language)}:
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.monthCount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("registration_fee", language)}:
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.registrationFee.toLocaleString()}{" "}
                              FCFA
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("new_students", language)}:
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.newStudentCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-2 sm:p-3 md:p-4 rounded-lg ${headerBgColor}`}
                      >
                        <h3
                          className={`text-sm sm:text-base md:text-lg font-bold ${textColorClass} mb-2 sm:mb-3`}
                        >
                          {translate("summary", language)}
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("yearly_summary_money", language)}
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.monthlyTotal.toLocaleString()} FCFA
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("total_registration_budget", language)}
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.registrationTotal.toLocaleString()}{" "}
                              FCFA
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 sm:pt-2 border-t border-gray-300">
                            <span
                              className={`${textColorClass} text-xs sm:text-sm`}
                            >
                              {translate("total_budget_expected", language)}
                            </span>
                            <span
                              className={`${textColorClass} text-xs sm:text-sm font-bold`}
                            >
                              {selectedClass.expectedAmount.toLocaleString()}{" "}
                              FCFA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-2 sm:p-3 md:p-4 rounded-lg ${headerBgColor} mb-3 sm:mb-4 md:mb-6`}
                    >
                      <h3
                        className={`text-sm sm:text-base md:text-lg font-bold ${textColorClass} mb-2 sm:mb-3`}
                      >
                        {translate("payment_progression", language)}
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between">
                          <span
                            className={`${textColorClass} text-xs sm:text-sm`}
                          >
                            {translate("amount_received_details", language)} :
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-green-600">
                            {selectedClass.receivedAmount.toLocaleString()} FCFA
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`${textColorClass} text-xs sm:text-sm`}
                          >
                            {translate("remaining_to_pay_details", language)} :
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              selectedClass.remainingAmount > 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {selectedClass.remainingAmount.toLocaleString()}{" "}
                            FCFA
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`${textColorClass} text-xs sm:text-sm`}
                          >
                            {translate("recovery_rate_details", language)} :
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              selectedClass.paymentPercentage >= 70
                                ? "text-green-600"
                                : selectedClass.paymentPercentage >= 40
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {selectedClass.paymentPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 md:h-4 overflow-hidden">
                        <motion.div
                          className={`h-2 sm:h-3 md:h-4 ${getProgressColor(
                            selectedClass.paymentPercentage
                          )}`}
                          style={{ width: "0%" }}
                          animate={{
                            width: `${selectedClass.paymentPercentage}%`,
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => setShowDetails(false)}
                      >
                        {translate("close", language)}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default PayementsYearlyClass;
