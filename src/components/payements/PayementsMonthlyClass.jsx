import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClasseName } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { Calendar, DollarSign, TrendingUp, Users, ArrowLeft, ArrowRight } from 'lucide-react';

const PayementsMonthlyClass = ({ db, theme, app_bg_color, text_color, refreshData }) => {
    const { language } = useLanguage();
    const [monthlyData, setMonthlyData] = useState([]);
    const [schoolMonths, setSchoolMonths] = useState([]);
    const [selectedSchoolMonth, setSelectedSchoolMonth] = useState(1); // Default to first school month
    const [isLoading, setIsLoading] = useState(true);
    const [activePaymentSystems, setActivePaymentSystems] = useState([]);
    const [totalExpected, setTotalExpected] = useState(0);
    const [totalReceived, setTotalReceived] = useState(0);

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

    useEffect(() => {
        if (db) {
            // Filtrer les systèmes de paiement actifs (non expirés)
            const now = new Date();
            const activeSystems = db.paymentSystems?.filter(system => {
                const endDate = new Date(system.endDate);
                return endDate >= now && system.isActive;
            }) || [];

            setActivePaymentSystems(activeSystems);
            
            // Générer les mois scolaires à partir des systèmes de paiement actifs
            if (activeSystems.length > 0) {
                const schoolMonthsArray = generateSchoolMonths(activeSystems);
                setSchoolMonths(schoolMonthsArray);
            }
            
            calculateMonthlyData();
        }
    }, [db]);

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

    const calculateMonthlyData = () => {
        setIsLoading(true);

        if (!db || !db.classes || !db.students || !db.paymentSystems || schoolMonths.length === 0) {
            setMonthlyData([]);
            setIsLoading(false);
            return;
        }

        // Filtrer les systèmes de paiement actifs (non expirés)
        const now = new Date();
        const activeSystems = db.paymentSystems.filter(system => {
            const endDate = new Date(system.endDate);
            return endDate >= now && system.isActive;
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

        db.classes.forEach(cls => {
            // Trouver le système de paiement actif pour cette classe
            const paymentSystem = activeSystems.find(system =>
                system.classes && system.classes.includes(cls.id)
            );

            if (!paymentSystem) {
                return; // Ignorer les classes sans système de paiement actif
            }

            // Compter les élèves dans cette classe
            const studentsInClass = db.students.filter(student =>
                student.classe === `${cls.level} ${cls.name}` && student.status === "actif"
            );

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
            const registrationFeeKey = `registration_fee_${paymentSystem.id}_${cls.id}`;
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
            const paymentKey = `students_${paymentSystem.id}_${cls.id}`;
            
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

            data.push({
                id: cls.id,
                className: getClasseName(`${cls.level} ${cls.name}`, language),
                level: cls.level,
                name: cls.name,
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

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`${cardBgColor} rounded-lg shadow-lg p-6 mb-6`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${textColorClass}`}>
                        Budget Mensuel par Classe
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePreviousMonth}
                            className={`p-2 rounded-full ${buttonSecondary} text-white ${selectedSchoolMonth <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedSchoolMonth <= 1}
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <span className={`text-lg font-medium ${textColorClass}`}>
                            {getCurrentMonthDisplay()} (Mois {selectedSchoolMonth}/{schoolMonths.length})
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className={`p-2 rounded-full ${buttonSecondary} text-white ${selectedSchoolMonth >= schoolMonths.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedSchoolMonth >= schoolMonths.length}
                        >
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Résumé global */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        className={`${headerBgColor} rounded-lg p-4 shadow`}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-2">
                            <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                            <h3 className={`font-semibold ${textColorClass}`}>Budget Total Prévu</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-500">{formatCurrency(totalExpected)}</p>
                    </motion.div>

                    <motion.div
                        className={`${headerBgColor} rounded-lg p-4 shadow`}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-2">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                            <h3 className={`font-semibold ${textColorClass}`}>Montant Total Reçu</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-500">{formatCurrency(totalReceived)}</p>
                    </motion.div>

                    <motion.div
                        className={`${headerBgColor} rounded-lg p-4 shadow`}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-red-500" />
                            <h3 className={`font-semibold ${textColorClass}`}>Budget en Attente</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-500">
                            {formatCurrency(totalExpected - totalReceived)}
                        </p>
                    </motion.div>

                    <motion.div
                        className={`${headerBgColor} rounded-lg p-4 shadow`}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                            <h3 className={`font-semibold ${textColorClass}`}>Taux de Recouvrement</h3>
                        </div>
                        <p className="text-2xl font-bold text-purple-500">
                            {totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0}%
                        </p>
                    </motion.div>
                </div>

                {/* Sélecteur de mois scolaires */}
                {schoolMonths.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {schoolMonths.map((month) => (
                            <button
                                key={month.number}
                                onClick={() => setSelectedSchoolMonth(month.number)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    selectedSchoolMonth === month.number
                                        ? `${buttonPrimary} text-white`
                                        : `border ${inputBorderColor} ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`
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
                                className={`${cardBgColor} rounded-lg shadow-md overflow-hidden`}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                                    <h3 className="text-lg font-bold">{classData.className}</h3>
                                    <div className="flex items-center mt-1">
                                        <Users size={16} className="mr-1" />
                                        <span className="text-sm">
                                            {classData.paidStudentCount}/{classData.studentCount} élèves ont payé
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className={`text-sm ${textColorClass}`}>Progression des paiements</span>
                                            <span className={`text-sm font-medium ${textColorClass}`}>{classData.paymentPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <motion.div
                                                className={`h-2.5 rounded-full ${getProgressColor(classData.paymentPercentage)}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${classData.paymentPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className={`text-xs opacity-70 ${textColorClass}`}>Frais mensuels</p>
                                            <p className={`${textColorClass} font-medium`}>{formatCurrency(classData.monthlyFee)}</p>
                                        </div>
                                        {classData.isFirstMonth && classData.registrationFee > 0 && (
                                            <div>
                                                <p className={`text-xs opacity-70 ${textColorClass}`}>Frais d'inscription</p>
                                                <p className={`${textColorClass} font-medium`}>{formatCurrency(classData.registrationFee)}</p>
                                                <p className={`text-xs opacity-70 ${textColorClass}`}>
                                                    ({classData.studentsRequiringRegistrationFee} nouveaux élèves)
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-3 rounded-lg ${inputBgColor} border ${inputBorderColor}`}>
                                        <div className="flex justify-between mb-2">
                                            <span className={`${textColorClass} text-sm`}>Prévu:</span>
                                            <span className={`${textColorClass} font-bold`}>
                                                {formatCurrency(classData.expectedBudget)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className={`${textColorClass} text-sm`}>Reçu:</span>
                                            <span className={`text-green-500 font-bold`}>
                                                {formatCurrency(classData.receivedAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-300">
                                            <span className={`${textColorClass} text-sm`}>Restant:</span>
                                            <span className={`text-red-500 font-bold`}>
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