import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts';

const PayementsYearlyTotal = ({ db, theme, app_bg_color, text_color }) => {
    const { language } = useLanguage();
    const [yearlyData, setYearlyData] = useState(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (db) {
            calculateYearlyTotal();
        }
    }, [db, currentYear]);

    const calculateYearlyTotal = () => {
        setIsLoading(true);

        if (!db || !db.classes || !db.students || !db.paymentConfig) {
            setYearlyData(null);
            setIsLoading(false);
            return;
        }

        // Calculer le nombre total d'élèves actifs
        const activeStudents = db.students.filter(student => student.status === "actif");

        // Calculer les montants totaux prévus pour l'année
        let monthlyTotal = 0;
        let yearlyTotal = 0;
        let registrationTotal = 0;
        let otherFeesTotal = 0;
        let studentsByClass = {};

        db.classes.forEach(cls => {
            const className = `${cls.level} ${cls.name}`;
            const classConfig = db.paymentConfig.find(config => config.classId === cls.id) || {
                monthlyFee: 0,
                yearlyFee: 0,
                registrationFee: 0,
                otherFees: []
            };

            const studentsInClass = activeStudents.filter(student => student.classe === className);
            const classMonthlyTotal = studentsInClass.length * classConfig.monthlyFee * 12;
            const classYearlyTotal = studentsInClass.length * classConfig.yearlyFee;
            const classRegistrationTotal = studentsInClass.length * classConfig.registrationFee;
            const classOtherFeesTotal = studentsInClass.length *
                (classConfig.otherFees ? classConfig.otherFees.reduce((sum, fee) => sum + fee.amount, 0) : 0);

            studentsByClass[className] = {
                count: studentsInClass.length,
                monthlyTotal: classMonthlyTotal,
                yearlyTotal: classYearlyTotal,
                registrationTotal: classRegistrationTotal,
                otherFeesTotal: classOtherFeesTotal,
                total: classMonthlyTotal + classYearlyTotal + classRegistrationTotal + classOtherFeesTotal
            };

            monthlyTotal += classMonthlyTotal;
            yearlyTotal += classYearlyTotal;
            registrationTotal += classRegistrationTotal;
            otherFeesTotal += classOtherFeesTotal;
        });

        const expectedAmount = monthlyTotal + yearlyTotal + registrationTotal + otherFeesTotal;

        // Calculer le montant déjà payé pour cette année
        const payments = db.payments || [];
        const yearlyPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getFullYear() === currentYear;
        });

        const paidAmount = yearlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

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
                    monthlyTotal: 0,
                    yearlyTotal: 0,
                    registrationTotal: 0,
                    otherFeesTotal: 0,
                    expectedAmount: 0,
                    paidAmount: 0
                };
            }

            const className = `${cls.level} ${cls.name}`;
            if (studentsByClass[className]) {
                statsByLevel[level].studentCount += studentsByClass[className].count;
                statsByLevel[level].monthlyTotal += studentsByClass[className].monthlyTotal;
                statsByLevel[level].yearlyTotal += studentsByClass[className].yearlyTotal;
                statsByLevel[level].registrationTotal += studentsByClass[className].registrationTotal;
                statsByLevel[level].otherFeesTotal += studentsByClass[className].otherFeesTotal;
                statsByLevel[level].expectedAmount += studentsByClass[className].total;
            }
        });

        // Calculer les paiements par niveau
        yearlyPayments.forEach(payment => {
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

        setYearlyData({
            totalStudents: activeStudents.length,
            monthlyTotal,
            yearlyTotal,
            registrationTotal,
            otherFeesTotal,
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
                <h2 className={`text-2xl font-bold ${textColorClass}`}>Budget Annuel Total</h2>

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

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : !yearlyData ? (
                <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                            Résumé de l'année {currentYear}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                                <h4 className="text-blue-800 font-bold mb-1 text-sm">Élèves Actifs</h4>
                                <p className="text-xl font-bold text-blue-900">
                                    {yearlyData.totalStudents}
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-purple-100 border border-purple-200`}>
                                <h4 className="text-purple-800 font-bold mb-1 text-sm">Frais Mensuels (x12)</h4>
                                <p className="text-xl font-bold text-purple-900">
                                    {yearlyData.monthlyTotal.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-indigo-100 border border-indigo-200`}>
                                <h4 className="text-indigo-800 font-bold mb-1 text-sm">Frais Annuels</h4>
                                <p className="text-xl font-bold text-indigo-900">
                                    {yearlyData.yearlyTotal.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-pink-100 border border-pink-200`}>
                                <h4 className="text-pink-800 font-bold mb-1 text-sm">Frais d'Inscription</h4>
                                <p className="text-xl font-bold text-pink-900">
                                    {yearlyData.registrationTotal.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-teal-100 border border-teal-200`}>
                                <h4 className="text-teal-800 font-bold mb-1 text-sm">Frais Supplémentaires</h4>
                                <p className="text-xl font-bold text-teal-900">
                                    {yearlyData.otherFeesTotal.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                                <h4 className="text-blue-800 font-bold mb-2">Montant Total Prévu</h4>
                                <p className="text-2xl font-bold text-blue-900">
                                    {yearlyData.expectedAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-green-100 border border-green-200`}>
                                <h4 className="text-green-800 font-bold mb-2">Montant Total Payé</h4>
                                <p className="text-2xl font-bold text-green-900">
                                    {yearlyData.paidAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-red-100 border border-red-200`}>
                                <h4 className="text-red-800 font-bold mb-2">Reste à Payer</h4>
                                <p className="text-2xl font-bold text-red-900">
                                    {yearlyData.remainingAmount.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className={`${textColorClass} font-medium`}>Progression globale des paiements</span>
                                <span className={`${textColorClass} font-bold`}>{yearlyData.paymentPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    style={{ width: `${yearlyData.paymentPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques par niveau */}
                    <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                        Statistiques par Niveau
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {yearlyData.levelStats.map((stat) => (
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

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className={`p-3 rounded-lg ${headerBgColor}`}>
                                            <h4 className={`text-sm font-bold ${textColorClass} mb-1`}>Frais mensuels (x12)</h4>
                                            <p className={`${textColorClass} font-bold`}>
                                                {stat.monthlyTotal.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${headerBgColor}`}>
                                            <h4 className={`text-sm font-bold ${textColorClass} mb-1`}>Frais annuels</h4>
                                            <p className={`${textColorClass} font-bold`}>
                                                {stat.yearlyTotal.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${headerBgColor}`}>
                                            <h4 className={`text-sm font-bold ${textColorClass} mb-1`}>Frais d'inscription</h4>
                                            <p className={`${textColorClass} font-bold`}>
                                                {stat.registrationTotal.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${headerBgColor}`}>
                                            <h4 className={`text-sm font-bold ${textColorClass} mb-1`}>Frais supplémentaires</h4>
                                            <p className={`${textColorClass} font-bold`}>
                                                {stat.otherFeesTotal.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-gray-300">
                                        <div className="flex justify-between">
                                            <span className={`${textColorClass}`}>Montant total prévu:</span>
                                            <span className={`${textColorClass} font-bold`}>
                                                {stat.expectedAmount.toLocaleString()} FCFA
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${textColorClass}`}>Montant total payé:</span>
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
                    <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} p-6 mb-8`}>
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                            Répartition des frais pour l'année {currentYear}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`p-4 rounded-lg ${headerBgColor}`}>
                                <h4 className={`text-lg font-bold ${textColorClass} mb-3`}>Répartition par type de frais</h4>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800`}>
                                                Frais mensuels (x12)
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold inline-block ${textColorClass}`}>
                                                {yearlyData.expectedAmount > 0 ? Math.round((yearlyData.monthlyTotal / yearlyData.expectedAmount) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                        <div style={{ width: `${yearlyData.expectedAmount > 0 ? Math.round((yearlyData.monthlyTotal / yearlyData.expectedAmount) * 100) : 0}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-800`}>
                                                Frais annuels
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold inline-block ${textColorClass}`}>
                                                {yearlyData.expectedAmount > 0 ? Math.round((yearlyData.yearlyTotal / yearlyData.expectedAmount) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                        <div style={{ width: `${yearlyData.expectedAmount > 0 ? Math.round((yearlyData.yearlyTotal / yearlyData.expectedAmount) * 100) : 0}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-pink-200 text-pink-800`}>
                                                Frais d'inscription
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold inline-block ${textColorClass}`}>
                                                {yearlyData.expectedAmount > 0 ? Math.round((yearlyData.registrationTotal / yearlyData.expectedAmount) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                        <div style={{ width: `${yearlyData.expectedAmount > 0 ? Math.round((yearlyData.registrationTotal / yearlyData.expectedAmount) * 100) : 0}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-teal-200 text-teal-800`}>
                                                Frais supplémentaires
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold inline-block ${textColorClass}`}>
                                                {yearlyData.expectedAmount > 0 ? Math.round((yearlyData.otherFeesTotal / yearlyData.expectedAmount) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                        <div style={{ width: `${yearlyData.expectedAmount > 0 ? Math.round((yearlyData.otherFeesTotal / yearlyData.expectedAmount) * 100) : 0}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${headerBgColor}`}>
                                <h4 className={`text-lg font-bold ${textColorClass} mb-3`}>Répartition par niveau</h4>
                                {yearlyData.levelStats.map((stat) => (
                                    <div key={stat.level} className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800`}>
                                                    Niveau {stat.level}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-semibold inline-block ${textColorClass}`}>
                                                    {yearlyData.expectedAmount > 0 ? Math.round((stat.expectedAmount / yearlyData.expectedAmount) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                            <div style={{ width: `${yearlyData.expectedAmount > 0 ? Math.round((stat.expectedAmount / yearlyData.expectedAmount) * 100) : 0}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default PayementsYearlyTotal;