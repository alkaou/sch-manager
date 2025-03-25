import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClasseName } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';

const PayementsMonthlyClass = ({ db, theme, app_bg_color, text_color }) => {
    const { language } = useLanguage();
    const [monthlyData, setMonthlyData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [activePaymentSystems, setActivePaymentSystems] = useState([]);

    // Mois en français
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

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
            calculateMonthlyData();
        }
    }, [db, currentMonth, currentYear]);

    const calculateMonthlyData = () => {
        setIsLoading(true);

        if (!db || !db.classes || !db.students || !db.paymentSystems) {
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

        // Calculer les données pour chaque classe
        const data = db.classes.map(cls => {
            // Trouver le système de paiement actif pour cette classe
            const paymentSystem = activeSystems.find(system =>
                system.classes.includes(cls.id)
            );

            if (!paymentSystem) {
                return null; // Ignorer les classes sans système de paiement actif
            }

            // Compter les élèves dans cette classe
            const studentsInClass = db.students.filter(student =>
                student.class_id === cls.id && student.is_active
            );

            // Calculer le budget mensuel prévu (nombre d'élèves * frais mensuels)
            const monthlyBudget = studentsInClass.length * paymentSystem.monthlyFee;

            // Calculer les frais d'inscription pour le premier mois
            const isFirstMonth = new Date(paymentSystem.startDate).getMonth() === currentMonth &&
                new Date(paymentSystem.startDate).getFullYear() === currentYear;

            const registrationFees = isFirstMonth
                ? studentsInClass.length * paymentSystem.registrationFee
                : 0;

            // Budget total prévu pour le mois (frais mensuels + frais d'inscription si premier mois)
            const totalExpectedBudget = monthlyBudget + registrationFees;

            // Calculer le montant déjà reçu pour ce mois
            const receivedAmount = db.payments
                ? db.payments
                    .filter(payment => {
                        const paymentDate = new Date(payment.date);
                        return payment.paymentSystemId === paymentSystem.id &&
                            paymentDate.getMonth() === currentMonth &&
                            paymentDate.getFullYear() === currentYear &&
                            studentsInClass.some(s => s.id === payment.studentId);
                    })
                    .reduce((sum, payment) => sum + payment.amount, 0)
                : 0;

            // Calculer le pourcentage de paiement
            const paymentPercentage = totalExpectedBudget > 0
                ? Math.round((receivedAmount / totalExpectedBudget) * 100)
                : 0;

            // Compter les élèves qui ont payé
            const paidStudents = new Set();
            if (db.payments) {
                db.payments
                    .filter(payment => {
                        const paymentDate = new Date(payment.date);
                        return payment.paymentSystemId === paymentSystem.id &&
                            paymentDate.getMonth() === currentMonth &&
                            paymentDate.getFullYear() === currentYear;
                    })
                    .forEach(payment => {
                        if (studentsInClass.some(s => s.id === payment.studentId)) {
                            paidStudents.add(payment.studentId);
                        }
                    });
            }

            return {
                id: cls.id,
                className: getClasseName(cls),
                level: cls.level,
                name: cls.name,
                studentCount: studentsInClass.length,
                paidStudentCount: paidStudents.size,
                monthlyFee: paymentSystem.monthlyFee,
                registrationFee: paymentSystem.registrationFee,
                expectedBudget: totalExpectedBudget,
                receivedAmount: receivedAmount,
                remainingAmount: totalExpectedBudget - receivedAmount,
                paymentPercentage: paymentPercentage,
                paymentSystem: paymentSystem
            };
        }).filter(Boolean); // Filtrer les classes sans système de paiement actif

        // Trier les données par niveau et nom de classe
        const sortedData = data.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level.localeCompare(b.level);
            }
            return a.name.localeCompare(b.name);
        });

        setMonthlyData(sortedData);
        setIsLoading(false);
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className={`h-full flex flex-col ${app_bg_color}`}>
            {/* En-tête avec navigation des mois */}
            <div className={`p-4 border-b ${inputBorderColor}`}>
                <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-semibold ${textColorClass}`}>
                        Budget Mensuel par Classe
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePreviousMonth}
                            className={`p-2 rounded-full ${buttonSecondary} text-white`}
                        >
                            <Calendar size={16} className="mr-1" />
                            ←
                        </button>
                        <span className={`font-medium ${textColorClass}`}>
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className={`p-2 rounded-full ${buttonSecondary} text-white`}
                        >
                            <Calendar size={16} className="mr-1" />
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-grow overflow-auto p-4">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : activePaymentSystems.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${buttonSecondary} text-white`}>
                                <DollarSign size={32} />
                            </div>
                            <p className={`${textColorClass} font-medium text-lg mb-2`}>Aucun système de paiement actif</p>
                            <p className={`${textColorClass} opacity-70`}>
                                Créez un système de paiement pour voir les budgets mensuels par classe
                            </p>
                        </div>
                    </div>
                ) : monthlyData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${buttonSecondary} text-white`}>
                                <DollarSign size={32} />
                            </div>
                            <p className={`${textColorClass} font-medium text-lg mb-2`}>Aucune donnée disponible</p>
                            <p className={`${textColorClass} opacity-70`}>
                                Aucune classe n'est associée à un système de paiement actif
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {monthlyData.map(classData => (
                            <div
                                key={classData.id}
                                className={`${cardBgColor} rounded-lg shadow-sm border ${inputBorderColor} overflow-hidden`}
                            >
                                <div className={`${headerBgColor} p-4 border-b ${inputBorderColor}`}>
                                    <h3 className={`font-semibold ${textColorClass}`}>{classData.className}</h3>
                                    <div className="flex items-center mt-1">
                                        <Users size={16} className={`${textColorClass} opacity-70 mr-1`} />
                                        <span className={`text-sm ${textColorClass} opacity-70`}>
                                            {classData.studentCount} élèves
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Budget prévu</p>
                                            <p className={`text-lg font-bold text-blue-600`}>
                                                {classData.expectedBudget.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Montant reçu</p>
                                            <p className={`text-lg font-bold text-green-600`}>
                                                {classData.receivedAmount.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className={`text-xs font-medium ${textColorClass} opacity-70`}>Progression</p>
                                            <p className={`text-xs font-medium ${textColorClass}`}>
                                                {classData.paymentPercentage}%
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full"
                                                style={{ width: `${classData.paymentPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Reste à percevoir</p>
                                            <p className={`text-base font-bold text-red-600`}>
                                                {classData.remainingAmount.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Élèves ayant payé</p>
                                            <p className={`text-base font-bold ${textColorClass}`}>
                                                {classData.paidStudentCount} / {classData.studentCount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Frais mensuels</p>
                                                <p className={`text-sm ${textColorClass}`}>
                                                    {classData.monthlyFee.toLocaleString()} FCFA / élève
                                                </p>
                                            </div>
                                            {new Date(classData.paymentSystem.startDate).getMonth() === currentMonth &&
                                                new Date(classData.paymentSystem.startDate).getFullYear() === currentYear && (
                                                    <div>
                                                        <p className={`text-xs font-medium ${textColorClass} opacity-70 mb-1`}>Frais d'inscription</p>
                                                        <p className={`text-sm ${textColorClass}`}>
                                                            {classData.registrationFee.toLocaleString()} FCFA / élève
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayementsMonthlyClass;