import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts';

const PayementsMonthlyTotal = ({ db, theme, app_bg_color, text_color }) => {
    const { language } = useLanguage();
    const [monthlyData, setMonthlyData] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);

    // Mois en français
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    useEffect(() => {
        if (db) {
            calculateMonthlyTotal();
        }
    }, [db, currentMonth, currentYear]);

    const calculateMonthlyTotal = () => {
        setIsLoading(true);

        if (!db || !db.classes || !db.students || !db.paymentConfig) {
            setMonthlyData(null);
            setIsLoading(false);
            return;
        }

        // Calculer le nombre total d'élèves actifs
        const activeStudents = db.students.filter(student => student.status === "actif");

        // Calculer le montant total prévu pour le mois
        let expectedAmount = 0;
        let studentsByClass = {};

        db.classes.forEach(cls => {
            const className = `${cls.level} ${cls.name}`;
            const classConfig = db.paymentConfig.find(config => config.classId === cls.id) || {
                monthlyFee: 0
            };

            const studentsInClass = activeStudents.filter(student => student.classe === className);
            studentsByClass[className] = {
                count: studentsInClass.length,
                fee: classConfig.monthlyFee,
                total: studentsInClass.length * classConfig.monthlyFee
            };

            expectedAmount += studentsByClass[className].total;
        });

        // Calculer le montant déjà payé pour ce mois
        const payments = db.payments || [];
        const monthlyPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return payment.type === 'monthly' &&
                paymentDate.getMonth() === currentMonth &&
                paymentDate.getFullYear() === currentYear;
        });

        const paidAmount = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

        // Calculer le pourcentage de paiement
        const paymentPercentage = expectedAmount > 0
            ? Math.round((paidAmount / expectedAmount) * 100)
            : 0;

        // Calculer les statistiques par niveau
        const statsByLevel = {};
        db.classes.forEach(cls => {
            const level = cls.level;
            if (!statsByLevel[level]) {
                statsByLevel[level] = {
                    studentCount: 0,
                    expectedAmount: 0,
                    paidAmount: 0
                };
            }

            const className = `${cls.level} ${cls.name}`;
            if (studentsByClass[className]) {
                statsByLevel[level].studentCount += studentsByClass[className].count;
                statsByLevel[level].expectedAmount += studentsByClass[className].total;
            }
        });

        // Calculer les paiements par niveau
        monthlyPayments.forEach(payment => {
            const student = activeStudents.find(s => s.id === payment.studentId);
            if (student) {
                const className = student.classe;
                const level = parseInt(className.split(' ')[0]);
                if (statsByLevel[level]) {
                    statsByLevel[level].paidAmount += payment.amount;
                }
            }
        });

        // Convertir en tableau pour faciliter le tri
        const levelStats = Object.keys(statsByLevel).map(level => ({
            level: parseInt(level),
            ...statsByLevel[level],
            remainingAmount: statsByLevel[level].expectedAmount - statsByLevel[level].paidAmount,
            paymentPercentage: statsByLevel[level].expectedAmount > 0
                ? Math.round((statsByLevel[level].paidAmount / statsByLevel[level].expectedAmount) * 100)
                : 0
        }));

        // Trier par niveau
        levelStats.sort((a, b) => a.level - b.level);

        setMonthlyData({
            totalStudents: activeStudents.length,
            expectedAmount,
            paidAmount,
            remainingAmount: expectedAmount - paidAmount,
            paymentPercentage,
            studentsByClass,
            levelStats
        });

        setIsLoading(false);
    };

    // Styles en fonction du thème
    const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const textColorClass = theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${textColorClass}`}>Budget Mensuel Total</h2>

                <div className="flex space-x-4">
                    <div>
                        <select
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(Number(e.target.value))}
                            className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {months.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={currentYear}
                            onChange={(e) => setCurrentYear(Number(e.target.value))}
                            className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : !monthlyData ? (
                <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Aucune donnée disponible</h3>
                    <p className="text-gray-500">
                        Aucune classe n'a été configurée pour les paiements ou aucun élève n'est inscrit.
                    </p>
                </div>
            ) : (
                <>
                    {/* Résumé global */}
                    <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} p-6 mb-8`}>
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                            Résumé du mois de {months[currentMonth]} {currentYear}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                                <h4 className="text-blue-800 font-bold mb-1 text-sm">Élèves Actifs</h4>
                                <p className="text-2xl font-bold text-blue-900">
                                    {monthlyData.totalStudents}
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-indigo-100 border border-indigo-200`}>
                                <h4 className="text-indigo-800 font-bold mb-1 text-sm">Montant Prévu</h4>
                                <p className="text-2xl font-bold text-indigo-900">
                                    {monthlyData.expectedAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-green-100 border border-green-200`}>
                                <h4 className="text-green-800 font-bold mb-1 text-sm">Montant Payé</h4>
                                <p className="text-2xl font-bold text-green-900">
                                    {monthlyData.paidAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-red-100 border border-red-200`}>
                                <h4 className="text-red-800 font-bold mb-1 text-sm">Reste à Payer</h4>
                                <p className="text-2xl font-bold text-red-900">
                                    {monthlyData.remainingAmount.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className={`${textColorClass} font-medium`}>Progression globale des paiements</span>
                                <span className={`${textColorClass} font-bold`}>{monthlyData.paymentPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    style={{ width: `${monthlyData.paymentPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques par niveau */}
                    <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                        Statistiques par Niveau
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {monthlyData.levelStats.map((stat) => (
                            <motion.div
                                key={stat.level}
                                className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} overflow-hidden`}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={`p-4 ${headerBgColor} border-b ${borderColor}`}>
                                    <h3 className={`text-xl font-bold ${textColorClass}`}>
                                        Niveau {stat.level}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`${textColorClass} text-sm`}>
                                            {stat.studentCount} élèves
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className={`${textColorClass} text-sm`}>Progression des paiements</span>
                                            <span className={`${textColorClass} text-sm font-bold`}>{stat.paymentPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${stat.paymentPercentage >= 90 ? 'bg-green-600' :
                                                        stat.paymentPercentage >= 70 ? 'bg-green-500' :
                                                            stat.paymentPercentage >= 50 ? 'bg-yellow-500' :
                                                                stat.paymentPercentage >= 30 ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${stat.paymentPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={`${textColorClass}`}>Montant prévu:</span>
                                            <span className={`${textColorClass} font-bold`}>
                                                {stat.expectedAmount.toLocaleString()} FCFA
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${textColorClass}`}>Montant payé:</span>
                                            <span className={`${textColorClass} font-bold text-green-600`}>
                                                {stat.paidAmount.toLocaleString()} FCFA
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-300">
                                            <span className={`${textColorClass}`}>Reste à payer:</span>
                                            <span className={`${textColorClass} font-bold ${stat.remainingAmount > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {stat.remainingAmount.toLocaleString()} FCFA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Graphique ou visualisation supplémentaire pourrait être ajouté ici */}
                </>
            )}
        </motion.div>
    );
};

export default PayementsMonthlyTotal;