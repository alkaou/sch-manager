import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts';

const PayementsClassDetails = ({ classInfo, db, theme, app_bg_color, text_color }) => {
    const { language } = useLanguage();
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [viewMode, setViewMode] = useState('yearly'); // 'yearly' ou 'monthly'

    // Mois en français
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    useEffect(() => {
        if (db && classInfo) {
            loadClassData();
        }
    }, [db, classInfo, currentYear, currentMonth, viewMode]);

    const loadClassData = async () => {
        setIsLoading(true);

        if (!db || !db.students || !db.classes || !db.paymentConfig) {
            setClassData(null);
            setStudents([]);
            setIsLoading(false);
            return;
        }

        // Trouver la classe dans la base de données
        const classObj = db.classes.find(cls => cls.id === classInfo.id);
        if (!classObj) {
            setClassData(null);
            setStudents([]);
            setIsLoading(false);
            return;
        }

        const className = `${classObj.level} ${classObj.name}`;

        // Trouver la configuration de paiement pour cette classe
        const paymentConfig = db.paymentConfig.find(config => config.classId === classObj.id) || {
            monthlyFee: 0,
            yearlyFee: 0,
            registrationFee: 0,
            otherFees: []
        };

        // Trouver tous les étudiants de cette classe
        const classStudents = db.students.filter(student =>
            student.classe === className && student.status === "actif"
        );

        // Calculer les montants attendus
        const monthlyTotal = paymentConfig.monthlyFee * classStudents.length;
        const yearlyTotal = paymentConfig.yearlyFee * classStudents.length;
        const registrationTotal = paymentConfig.registrationFee * classStudents.length;
        const otherFeesTotal = classStudents.length *
            (paymentConfig.otherFees ? paymentConfig.otherFees.reduce((sum, fee) => sum + fee.amount, 0) : 0);

        // Calculer les montants pour l'année ou le mois en fonction du mode de vue
        let expectedAmount, paidAmount, payments;

        if (viewMode === 'yearly') {
            // Calcul pour l'année entière
            expectedAmount = (monthlyTotal * 12) + yearlyTotal + registrationTotal + otherFeesTotal;

            // Trouver tous les paiements pour cette classe cette année
            payments = (db.payments || []).filter(payment => {
                const paymentDate = new Date(payment.date);
                const studentInClass = classStudents.some(student => student.id === payment.studentId);
                return studentInClass && paymentDate.getFullYear() === currentYear;
            });

            paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        } else {
            // Calcul pour le mois sélectionné
            expectedAmount = monthlyTotal;

            // Trouver tous les paiements pour cette classe ce mois
            payments = (db.payments || []).filter(payment => {
                const paymentDate = new Date(payment.date);
                const studentInClass = classStudents.some(student => student.id === payment.studentId);
                return studentInClass &&
                    paymentDate.getFullYear() === currentYear &&
                    paymentDate.getMonth() === currentMonth &&
                    payment.type === 'monthly';
            });

            paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        }

        // Calculer le pourcentage de paiement
        const paymentPercentage = expectedAmount > 0
            ? Math.round((paidAmount / expectedAmount) * 100)
            : 0;

        // Préparer les données des étudiants avec les informations de paiement
        const studentsWithPayments = classStudents.map(student => {
            // Calculer les montants attendus pour cet étudiant
            const studentMonthlyTotal = paymentConfig.monthlyFee;
            const studentYearlyTotal = paymentConfig.yearlyFee;
            const studentRegistrationTotal = paymentConfig.registrationFee;
            const studentOtherFeesTotal = paymentConfig.otherFees
                ? paymentConfig.otherFees.reduce((sum, fee) => sum + fee.amount, 0)
                : 0;

            let studentExpectedAmount, studentPayments;

            if (viewMode === 'yearly') {
                // Calcul pour l'année entière
                studentExpectedAmount = (studentMonthlyTotal * 12) + studentYearlyTotal + studentRegistrationTotal + studentOtherFeesTotal;

                // Trouver tous les paiements pour cet étudiant cette année
                studentPayments = (db.payments || []).filter(payment => {
                    const paymentDate = new Date(payment.date);
                    return payment.studentId === student.id && paymentDate.getFullYear() === currentYear;
                });
            } else {
                // Calcul pour le mois sélectionné
                studentExpectedAmount = studentMonthlyTotal;

                // Trouver tous les paiements pour cet étudiant ce mois
                studentPayments = (db.payments || []).filter(payment => {
                    const paymentDate = new Date(payment.date);
                    return payment.studentId === student.id &&
                        paymentDate.getFullYear() === currentYear &&
                        paymentDate.getMonth() === currentMonth &&
                        payment.type === 'monthly';
                });
            }

            const studentPaidAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const studentRemainingAmount = studentExpectedAmount - studentPaidAmount;
            const studentPaymentPercentage = studentExpectedAmount > 0
                ? Math.round((studentPaidAmount / studentExpectedAmount) * 100)
                : 0;

            // Déterminer le statut de paiement
            let paymentStatus = 'unpaid';
            if (studentPaymentPercentage >= 100) {
                paymentStatus = 'paid';
            } else if (studentPaymentPercentage > 0) {
                paymentStatus = 'partial';
            }

            return {
                ...student,
                expectedAmount: studentExpectedAmount,
                paidAmount: studentPaidAmount,
                remainingAmount: studentRemainingAmount,
                paymentPercentage: studentPaymentPercentage,
                paymentStatus,
                payments: studentPayments
            };
        });

        // Trier les étudiants par nom
        studentsWithPayments.sort((a, b) => a.name.localeCompare(b.name));

        setClassData({
            ...classObj,
            className,
            paymentConfig,
            studentCount: classStudents.length,
            monthlyTotal,
            yearlyTotal,
            registrationTotal,
            otherFeesTotal,
            expectedAmount,
            paidAmount,
            remainingAmount: expectedAmount - paidAmount,
            paymentPercentage,
            payments
        });

        setStudents(studentsWithPayments);
        setIsLoading(false);
    };

    // Styles en fonction du thème
    const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const textColorClass = theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const selectBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const tableBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
    const tableHeaderBgColor = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
    const tableRowHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : !classData ? (
                <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Classe non trouvée</h3>
                    <p className="text-gray-500">
                        La classe sélectionnée n'existe pas ou a été supprimée.
                    </p>
                </div>
            ) : (
                <>
                    {/* En-tête avec informations de la classe */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className={`text-2xl font-bold ${textColorClass}`}>
                                Classe {classData.className}
                            </h2>
                            <p className={`${textColorClass} mt-1`}>
                                {classData.studentCount} élèves • Niveau {classData.level}
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <div>
                                <select
                                    value={viewMode}
                                    onChange={(e) => setViewMode(e.target.value)}
                                    className={`px-3 py-2 rounded ${selectBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="yearly">Vue annuelle</option>
                                    <option value="monthly">Vue mensuelle</option>
                                </select>
                            </div>

                            {viewMode === 'monthly' && (
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
                            )}

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

                    {/* Résumé des paiements */}
                    <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} p-6 mb-8`}>
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                            {viewMode === 'yearly'
                                ? `Résumé des paiements pour l'année ${currentYear}`
                                : `Résumé des paiements pour ${months[currentMonth]} ${currentYear}`}
                        </h3>

                        {viewMode === 'yearly' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                                    <h4 className="text-blue-800 font-bold mb-1 text-sm">Frais Mensuels (x12)</h4>
                                    <p className="text-xl font-bold text-blue-900">
                                        {(classData.monthlyTotal * 12).toLocaleString()} FCFA
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg bg-purple-100 border border-purple-200`}>
                                    <h4 className="text-purple-800 font-bold mb-1 text-sm">Frais Annuels</h4>
                                    <p className="text-xl font-bold text-purple-900">
                                        {classData.yearlyTotal.toLocaleString()} FCFA
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg bg-indigo-100 border border-indigo-200`}>
                                    <h4 className="text-indigo-800 font-bold mb-1 text-sm">Frais d'Inscription</h4>
                                    <p className="text-xl font-bold text-indigo-900">
                                        {classData.registrationTotal.toLocaleString()} FCFA
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg bg-teal-100 border border-teal-200`}>
                                    <h4 className="text-teal-800 font-bold mb-1 text-sm">Frais Supplémentaires</h4>
                                    <p className="text-xl font-bold text-teal-900">
                                        {classData.otherFeesTotal.toLocaleString()} FCFA
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                                <h4 className="text-blue-800 font-bold mb-2">Montant Total Prévu</h4>
                                <p className="text-2xl font-bold text-blue-900">
                                    {classData.expectedAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-green-100 border border-green-200`}>
                                <h4 className="text-green-800 font-bold mb-2">Montant Total Payé</h4>
                                <p className="text-2xl font-bold text-green-900">
                                    {classData.paidAmount.toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg bg-red-100 border border-red-200`}>
                                <h4 className="text-red-800 font-bold mb-2">Reste à Payer</h4>
                                <p className="text-2xl font-bold text-red-900">
                                    {classData.remainingAmount.toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className={`${textColorClass} font-medium`}>Progression des paiements</span>
                                <span className={`${textColorClass} font-bold`}>{classData.paymentPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    style={{ width: `${classData.paymentPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des élèves */}
                    <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} overflow-hidden mb-8`}>
                        <div className={`p-4 ${headerBgColor} border-b ${borderColor}`}>
                            <h3 className={`text-xl font-bold ${textColorClass}`}>
                                Liste des élèves ({students.length})
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className={`${tableHeaderBgColor}`}>
                                    <tr>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Élève
                                        </th>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Montant prévu
                                        </th>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Montant payé
                                        </th>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Reste à payer
                                        </th>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Progression
                                        </th>
                                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${tableBgColor} divide-y divide-gray-300`}>
                                    {students.map((student) => (
                                        <tr key={student.id} className={`${tableRowHoverBgColor}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {student.image ? (
                                                            <img className="h-10 w-10 rounded-full" src={student.image} alt="" />
                                                        ) : (
                                                            <div className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center`}>
                                                                <span className="text-gray-600 font-bold">
                                                                    {student.name.charAt(0)}{student.surname.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className={`font-medium ${textColorClass}`}>
                                                            {student.name} {student.surname}
                                                        </div>
                                                        <div className="text-gray-500 text-sm">
                                                            ID: {student.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                {student.expectedAmount.toLocaleString()} FCFA
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-green-600 font-medium`}>
                                                {student.paidAmount.toLocaleString()} FCFA
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${student.remainingAmount > 0 ? 'text-red-500' : 'text-green-600'} font-medium`}>
                                                {student.remainingAmount.toLocaleString()} FCFA
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-300 rounded-full h-2.5 mr-2">
                                                        <div
                                                            className={`h-2.5 rounded-full ${student.paymentPercentage >= 90 ? 'bg-green-600' :
                                                                    student.paymentPercentage >= 70 ? 'bg-green-500' :
                                                                        student.paymentPercentage >= 50 ? 'bg-yellow-500' :
                                                                            student.paymentPercentage >= 30 ? 'bg-orange-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${student.paymentPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm ${textColorClass}`}>{student.paymentPercentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                    onClick={() => {/* Fonction pour voir les détails */ }}
                                                >
                                                    Détails
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() => {/* Fonction pour ajouter un paiement */ }}
                                                >
                                                    Paiement
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Historique des paiements */}
                    <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} overflow-hidden`}>
                        <div className={`p-4 ${headerBgColor} border-b ${borderColor}`}>
                            <h3 className={`text-xl font-bold ${textColorClass}`}>
                                Historique des paiements
                            </h3>
                        </div>

                        {classData.payments && classData.payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className={`${tableHeaderBgColor}`}>
                                        <tr>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Date
                                            </th>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Élève
                                            </th>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Type
                                            </th>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Montant
                                            </th>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Méthode
                                            </th>
                                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                                Référence
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${tableBgColor} divide-y divide-gray-300`}>
                                        {classData.payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((payment) => {
                                            const student = students.find(s => s.id === payment.studentId);
                                            return (
                                                <tr key={payment.id} className={`${tableRowHoverBgColor}`}>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                        {student ? `${student.name} ${student.surname}` : 'Élève inconnu'}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                        {payment.type === 'monthly' ? 'Mensuel' :
                                                            payment.type === 'yearly' ? 'Annuel' :
                                                                payment.type === 'registration' ? 'Inscription' :
                                                                    payment.type === 'other' ? 'Autre' : payment.type}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-green-600 font-medium`}>
                                                        {payment.amount.toLocaleString()} FCFA
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                        {payment.method}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap ${textColorClass}`}>
                                                        {payment.reference || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Aucun paiement enregistré pour cette période.
                            </div>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default PayementsClassDetails;