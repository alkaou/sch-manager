import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClasseName, getClasseById } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { Calendar, DollarSign, TrendingUp, Users, ArrowLeft, ArrowRight, Filter } from 'lucide-react';

const PayementsMonthlyClass = ({ db, theme, app_bg_color, text_color, refreshData }) => {
    const { language } = useLanguage();
    const [monthlyData, setMonthlyData] = useState([]);
    const [schoolMonths, setSchoolMonths] = useState([]);
    const [selectedSchoolMonth, setSelectedSchoolMonth] = useState(1); // Default to first school month
    const [isLoading, setIsLoading] = useState(true);
    const [activePaymentSystems, setActivePaymentSystems] = useState([]);
    const [totalExpected, setTotalExpected] = useState(0);
    const [totalReceived, setTotalReceived] = useState(0);
    const [paymentSystemGroups, setPaymentSystemGroups] = useState([]);
    const [selectedSystemGroup, setSelectedSystemGroup] = useState(null);

    // Styles en fonction du thème
    const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const textColorClass = theme === "dark" ? text_color : "text-gray-700";
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
    const tableBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
    const tableHeaderBgColor = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
    const tableRowHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
    const buttonPrimary = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
    const buttonSecondary = theme === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 hover:bg-gray-500";
    const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

    useEffect(() => {
        if (db) {
            // Filtrer les systèmes de paiement actifs (non expirés)
            const now = new Date();
            const activeSystems = db.paymentSystems?.filter(system => {
                const endDate = new Date(system.endDate);
                return endDate >= now && system.isActive;
            }) || [];

            setActivePaymentSystems(activeSystems);

            // Grouper les systèmes de paiement par dates de début et de fin
            const groups = groupPaymentSystemsByDate(activeSystems);
            setPaymentSystemGroups(groups);

            // Sélectionner le premier groupe par défaut
            if (groups.length > 0) {
                setSelectedSystemGroup(groups[0]);

                // Générer les mois scolaires à partir du groupe sélectionné
                const schoolMonthsArray = generateSchoolMonths(groups[0].systems);
                setSchoolMonths(schoolMonthsArray);
            }

            calculateMonthlyData();
        }
    }, [db]);

    // Grouper les systèmes de paiement par dates de début et de fin
    const groupPaymentSystemsByDate = (systems) => {
        const groups = [];
        const groupMap = {};

        systems.forEach(system => {
            const key = `${system.startDate}_${system.endDate}`;

            if (!groupMap[key]) {
                groupMap[key] = {
                    id: key,
                    startDate: system.startDate,
                    endDate: system.endDate,
                    systems: []
                };
                groups.push(groupMap[key]);
            }

            groupMap[key].systems.push(system);
        });

        return groups;
    };

    // Générer les mois scolaires à partir des systèmes de paiement
    const generateSchoolMonths = (systems) => {
        // Utiliser le premier système pour déterminer les mois scolaires
        // (Idéalement, tous les systèmes devraient avoir les mêmes dates de début/fin)
        const system = systems[0];
        const startDate = new Date(system.startDate);
        const endDate = new Date(system.endDate);

        const monthsArray = [];
        let currentMonth = new Date(startDate);

        while (currentMonth <= endDate) {
            monthsArray.push({
                number: monthsArray.length + 1, // 1-indexed school month number
                name: currentMonth.toLocaleString('fr-FR', { month: 'long' }),
                year: currentMonth.getFullYear(),
                jsMonth: currentMonth.getMonth(), // 0-indexed JavaScript month
                jsYear: currentMonth.getFullYear()
            });
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        return monthsArray;
    };

    useEffect(() => {
        if (schoolMonths.length > 0) {
            calculateMonthlyData();
        }
    }, [selectedSchoolMonth, schoolMonths]);

    // Gérer le changement de groupe de système de paiement
    const handleSystemGroupChange = (groupId) => {
        const group = paymentSystemGroups.find(g => g.id === groupId);
        if (group) {
            setSelectedSystemGroup(group);
            const schoolMonthsArray = generateSchoolMonths(group.systems);
            setSchoolMonths(schoolMonthsArray);
            setSelectedSchoolMonth(1); // Réinitialiser au premier mois
        }
    };

    // ... existing code (calculateMonthlyData, handlePreviousMonth, handleNextMonth, etc.)
    const calculateMonthlyData = () => {
        setIsLoading(true);

        if (!db || !db.paymentSystems || schoolMonths.length === 0 || !selectedSystemGroup) {
            setMonthlyData([]);
            setIsLoading(false);
            return;
        }

        // Obtenir les IDs des systèmes de paiement du groupe sélectionné
        const selectedSystemIds = selectedSystemGroup.systems.map(system => system.id);

        // Filtrer les systèmes de paiement actifs qui appartiennent au groupe sélectionné
        const activeSystems = db.paymentSystems.filter(system => {
            const endDate = new Date(system.endDate);
            const now = new Date();
            return endDate >= now && system.isActive && selectedSystemIds.includes(system.id);
        });

        if (activeSystems.length === 0) {
            setMonthlyData([]);
            setIsLoading(false);
            return;
        }

        // Obtenir le mois scolaire sélectionné
        const currentSchoolMonth = schoolMonths.find(month => month.number === selectedSchoolMonth);

        if (!currentSchoolMonth) {
            setMonthlyData([]);
            setIsLoading(false);
            return;
        }

        // Calculer les données pour chaque classe
        const data = [];
        let expectedTotal = 0;
        let receivedTotal = 0;

        // console.log(db.paymentSystems);
        // Récupérer toutes les classes des modes de payement 'paymentSystems'
        const classes = [];
        db.paymentSystems.map(sys => {
            sys.classes.map(cls => {
                if(!classes.includes(cls)){
                    classes.push(cls);
                }
            });
        });
        // console.log(classes);

        classes.forEach(cls => {
            // Trouver le système de paiement actif pour cette classe qui appartient au groupe sélectionné
            const paymentSystem = activeSystems.find(system =>
                system.classes && system.classes.includes(cls)
            );

            if (!paymentSystem) {
                return; // Ignorer les classes sans système de paiement actif dans le groupe sélectionné
            }

            // Compter les élèves dans cette classe
            const the_system = `students_${paymentSystem.id}_${cls}`;
            const studentsInClass = db.payments[the_system] || [];

            if (studentsInClass.length === 0) {
                return; // Ignorer les classes sans élèves
            }

            // Calculer le budget mensuel prévu (nombre d'élèves * frais mensuels)
            const monthlyFee = Number(paymentSystem.monthlyFee);
            const monthlyBudget = studentsInClass.length * monthlyFee;

            // Vérifier si c'est le premier mois pour les frais d'inscription
            const isFirstMonth = selectedSchoolMonth === 1;
            const registrationFee = Number(paymentSystem.registrationFee);

            // Clé pour les frais d'inscription de cette classe
            const registrationFeeKey = `registration_fee_${paymentSystem.id}_${cls}`;
            const registrationFeeData = db.registrationFees && db.registrationFees[registrationFeeKey]
                ? db.registrationFees[registrationFeeKey]
                : {};

            // Compter les élèves qui doivent payer les frais d'inscription
            // (ceux qui ont true dans registrationFeeData - les nouveaux élèves)
            const studentsRequiringRegistrationFee = Object.entries(registrationFeeData)
                .filter(([studentId, value]) => value === true)
                .map(([studentId]) => studentId);

            // Calculer les frais d'inscription prévus uniquement pour les nouveaux élèves
            const registrationFees = isFirstMonth ? studentsRequiringRegistrationFee.length * registrationFee : 0;

            // Budget total prévu pour le mois (frais mensuels + frais d'inscription si premier mois)
            const totalExpectedBudget = monthlyBudget + registrationFees;
            expectedTotal += totalExpectedBudget;

            // Clé pour les paiements de cette classe
            const paymentKey = `students_${paymentSystem.id}_${cls}`;

            // Récupérer les paiements pour cette classe
            const classPayments = db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];

            // Compter les élèves qui ont payé pour le mois scolaire en cours
            const paidStudents = classPayments.filter(student =>
                student.month_payed && student.month_payed.includes(selectedSchoolMonth.toString())
            );

            // Calculer le montant reçu (nombre d'élèves payés * frais mensuels)
            const receivedAmount = paidStudents.length * monthlyFee;

            // Compter les élèves qui ont payé les frais d'inscription
            // (ceux qui ont une entrée dans registrationFeeData qui est true)
            const paidRegistrationCount = Object.entries(registrationFeeData)
                .filter(([studentId, value]) => value === true)
                .length;

            const receivedRegistrationFees = paidRegistrationCount * registrationFee;

            // Ajouter les frais d'inscription reçus au montant total reçu si c'est le premier mois
            const totalReceivedAmount = receivedAmount + (isFirstMonth ? receivedRegistrationFees : 0);

            // Ajouter au total reçu global (incluant les frais d'inscription si c'est le premier mois)
            receivedTotal += totalReceivedAmount;

            // Calculer le pourcentage de paiement
            const paymentPercentage = totalExpectedBudget > 0
                ? Math.round((totalReceivedAmount / totalExpectedBudget) * 100)
                : 0;
            const this_classe = getClasseById(db.classes, cls, language);
            data.push({
                id: this_classe.id,
                className: getClasseName(`${this_classe.level} ${this_classe.name}`, language),
                level: this_classe.level,
                name: this_classe.name,
                studentCount: studentsInClass.length,
                paidStudentCount: paidStudents.length,
                monthlyFee: monthlyFee,
                registrationFee: registrationFee,
                expectedBudget: totalExpectedBudget,
                receivedAmount: totalReceivedAmount,
                remainingAmount: totalExpectedBudget - totalReceivedAmount,
                paymentPercentage: paymentPercentage,
                paymentSystem: paymentSystem,
                isFirstMonth: isFirstMonth,
                studentsRequiringRegistrationFee: studentsRequiringRegistrationFee.length
            });
        });

        // Trier les données par niveau et nom de classe
        const sortedData = data.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });

        setMonthlyData(sortedData);
        setTotalExpected(expectedTotal);
        setTotalReceived(receivedTotal);
        setIsLoading(false);
    };

    const handlePreviousMonth = () => {
        if (selectedSchoolMonth > 1) {
            setSelectedSchoolMonth(selectedSchoolMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedSchoolMonth < schoolMonths.length) {
            setSelectedSchoolMonth(selectedSchoolMonth + 1);
        }
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

    // Obtenir le mois actuel pour l'affichage
    const getCurrentMonthDisplay = () => {
        const currentMonth = schoolMonths.find(month => month.number === selectedSchoolMonth);
        if (currentMonth) {
            return `${currentMonth.name} ${currentMonth.year}`;
        }
        return "";
    };

    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6 mb-6`}>
                {/* Sélecteur de système de paiement */}
                {paymentSystemGroups.length > 1 && (
                    <div className="mb-6">
                        <div className={`p-4 ${headerBgColor} rounded-lg shadow-md`}>
                            <div className="flex items-center mb-3">
                                <Filter className="h-5 w-5 mr-2 text-blue-500" />
                                <h3 className={`font-semibold ${textColorClass}`}>Sélectionner une période de paiement</h3>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <select
                                    className={`${selectBgColor} ${textColorClass} border ${inputBorderColor} rounded-md p-2 flex-grow`}
                                    value={selectedSystemGroup?.id || ''}
                                    onChange={(e) => handleSystemGroupChange(e.target.value)}
                                >
                                    {paymentSystemGroups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            Du {formatDate(group.startDate)} au {formatDate(group.endDate)}
                                        </option>
                                    ))}
                                </select>
                                <div className={`text-sm ${textColorClass} bg-blue-50 dark:bg-gray-700 p-2 rounded-md`}>
                                    <span className="font-medium">Période actuelle:</span> {selectedSystemGroup &&
                                        `${formatDate(selectedSystemGroup.startDate)} - ${formatDate(selectedSystemGroup.endDate)}`}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className={`text-2xl font-bold ${textColorClass} flex items-center`}>
                        <DollarSign className="h-6 w-6 mr-2 text-blue-500" />
                        Budget Mensuel par Classe
                    </h2>
                    <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-md">
                        <button
                            onClick={handlePreviousMonth}
                            className={`p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors ${selectedSchoolMonth <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedSchoolMonth <= 1}
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-lg font-medium text-white">
                            {getCurrentMonthDisplay()} (Mois {selectedSchoolMonth}/{schoolMonths.length})
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className={`p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors ${selectedSchoolMonth >= schoolMonths.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedSchoolMonth >= schoolMonths.length}
                        >
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Résumé global */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        className={`rounded-lg p-5 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white`}
                        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-white/20 rounded-full mr-3">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Budget Total Prévu</h3>
                        </div>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(totalExpected)}</p>
                        <div className="mt-3 text-sm text-blue-100">Montant total attendu pour ce mois</div>
                    </motion.div>

                    <motion.div
                        className={`rounded-lg p-5 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white`}
                        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-white/20 rounded-full mr-3">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Montant Total Reçu</h3>
                        </div>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(totalReceived)}</p>
                        <div className="mt-3 text-sm text-green-100">Paiements déjà effectués</div>
                    </motion.div>

                    <motion.div
                        className={`rounded-lg p-5 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white`}
                        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-white/20 rounded-full mr-3">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Budget en Attente</h3>
                        </div>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(totalExpected - totalReceived)}</p>
                        <div className="mt-3 text-sm text-red-100">Montant restant à percevoir</div>
                    </motion.div>

                    <motion.div
                        className={`rounded-lg p-5 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white`}
                        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-white/20 rounded-full mr-3">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Taux de Recouvrement</h3>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0}%
                        </p>
                        <div className="mt-3 text-sm text-purple-100">Pourcentage des paiements reçus</div>
                    </motion.div>
                </div>

                {/* Sélecteur de mois scolaires */}
                {schoolMonths.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner">
                        {schoolMonths.map((month) => (
                            <button
                                key={month.number}
                                onClick={() => setSelectedSchoolMonth(month.number)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${selectedSchoolMonth === month.number
                                        ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md`
                                        : `bg-white dark:bg-gray-600 ${textColorClass} shadow hover:shadow-md`
                                    }`}
                            >
                                {month.name} {month.year}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : monthlyData.length === 0 ? (
                    <div className={`text-center py-12 ${textColorClass}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-medium mb-2">Aucune donnée disponible</h3>
                        <p className="text-gray-500">
                            Aucun système de paiement actif n'a été trouvé pour ce mois.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {monthlyData.map((classData) => (
                            <motion.div
                                key={classData.id}
                                className={`${cardBgColor} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700`}
                                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
                                        <div className="w-full h-full bg-white/10 rounded-full"></div>
                                    </div>
                                    <h3 className="text-xl font-bold relative z-10">{classData.className}</h3>
                                    <div className="flex items-center mt-2 relative z-10">
                                        <div className="p-1.5 bg-white/20 rounded-full mr-2">
                                            <Users size={16} />
                                        </div>
                                        <span className="text-sm">
                                            {classData.paidStudentCount}/{classData.studentCount} élèves ont payé
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2">
                                            <span className={`text-sm font-medium ${textColorClass}`}>Progression des paiements</span>
                                            <span className={`text-sm font-bold ${classData.paymentPercentage < 30 ? 'text-red-500' :
                                                    classData.paymentPercentage < 70 ? 'text-yellow-500' : 'text-green-500'
                                                }`}>{classData.paymentPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                className={`h-3 rounded-full ${getProgressColor(classData.paymentPercentage)}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${classData.paymentPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div className="bg-blue-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                            <p className={`text-xs font-medium text-blue-500 dark:text-blue-300 mb-1`}>Frais mensuels</p>
                                            <p className={`${textColorClass} font-bold`}>{formatCurrency(classData.monthlyFee)}</p>
                                        </div>
                                        {classData.isFirstMonth && classData.registrationFee > 0 ? (
                                            <div className="bg-purple-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                <p className={`text-xs font-medium text-purple-500 dark:text-purple-300 mb-1`}>Frais d'inscription</p>
                                                <p className={`${textColorClass} font-bold`}>{formatCurrency(classData.registrationFee)}</p>
                                                <p className={`text-xs text-purple-500 dark:text-purple-300 mt-1`}>
                                                    ({classData.studentsRequiringRegistrationFee} nouveaux)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                <p className={`text-xs font-medium text-gray-500 dark:text-gray-300 mb-1`}>Élèves inscrits</p>
                                                <p className={`${textColorClass} font-bold`}>{classData.studentCount}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-inner`}>
                                        <div className="flex justify-between mb-3">
                                            <span className={`${textColorClass} text-sm font-medium`}>Prévu:</span>
                                            <span className={`${textColorClass} text-sm font-medium`}>Prévu:</span>
                                            <span className={`text-blue-600 dark:text-blue-400 font-bold`}>
                                                {formatCurrency(classData.expectedBudget)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-3">
                                            <span className={`${textColorClass} text-sm font-medium`}>Reçu:</span>
                                            <span className={`text-green-600 dark:text-green-400 font-bold`}>
                                                {formatCurrency(classData.receivedAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                                            <span className={`${textColorClass} text-sm font-medium`}>Restant:</span>
                                            <span className={`text-red-600 dark:text-red-400 font-bold`}>
                                                {formatCurrency(classData.remainingAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PayementsMonthlyClass;