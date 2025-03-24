import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts';

const PayementsStudentList = ({ db, theme, app_bg_color, text_color }) => {
    const { language } = useLanguage();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (db) {
            loadStudentsWithPaymentInfo();
        }
    }, [db, currentYear]);

    useEffect(() => {
        filterStudents();
    }, [students, searchTerm, selectedClass, selectedStatus, selectedPaymentStatus]);

    const loadStudentsWithPaymentInfo = async () => {
        setIsLoading(true);

        if (!db || !db.students || !db.classes || !db.paymentConfig) {
            setStudents([]);
            setFilteredStudents([]);
            setIsLoading(false);
            return;
        }

        // Préparer les données des étudiants avec les informations de paiement
        const studentsWithPayments = db.students.map(student => {
            const className = student.classe;
            const classObj = db.classes.find(cls => `${cls.level} ${cls.name}` === className);
            const classId = classObj ? classObj.id : null;

            const paymentConfig = classId
                ? db.paymentConfig.find(config => config.classId === classId)
                : { monthlyFee: 0, yearlyFee: 0, registrationFee: 0, otherFees: [] };

            // Calculer les montants attendus
            const monthlyTotal = paymentConfig.monthlyFee * 12;
            const yearlyTotal = paymentConfig.yearlyFee;
            const registrationTotal = paymentConfig.registrationFee;
            const otherFeesTotal = paymentConfig.otherFees
                ? paymentConfig.otherFees.reduce((sum, fee) => sum + fee.amount, 0)
                : 0;

            const expectedAmount = monthlyTotal + yearlyTotal + registrationTotal + otherFeesTotal;

            // Calculer les paiements effectués
            const payments = db.payments || [];
            const studentPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.date);
                return payment.studentId === student.id && paymentDate.getFullYear() === currentYear;
            });

            const paidAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const remainingAmount = expectedAmount - paidAmount;
            const paymentPercentage = expectedAmount > 0
                ? Math.round((paidAmount / expectedAmount) * 100)
                : 0;

            // Déterminer le statut de paiement
            let paymentStatus = 'unpaid';
            if (paymentPercentage >= 100) {
                paymentStatus = 'paid';
            } else if (paymentPercentage > 0) {
                paymentStatus = 'partial';
            }

            return {
                ...student,
                classId,
                paymentConfig,
                monthlyTotal,
                yearlyTotal,
                registrationTotal,
                otherFeesTotal,
                expectedAmount,
                paidAmount,
                remainingAmount,
                paymentPercentage,
                paymentStatus,
                payments: studentPayments
            };
        });

        setStudents(studentsWithPayments);
        setFilteredStudents(studentsWithPayments);
        setIsLoading(false);
    };

    const filterStudents = () => {
        let filtered = [...students];

        // Filtrer par terme de recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(term) ||
                student.surname.toLowerCase().includes(term) ||
                student.id.toLowerCase().includes(term)
            );
        }

        // Filtrer par classe
        if (selectedClass !== 'all') {
            filtered = filtered.filter(student => student.classe === selectedClass);
        }

        // Filtrer par statut d'étudiant
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(student => student.status === selectedStatus);
        }

        // Filtrer par statut de paiement
        if (selectedPaymentStatus !== 'all') {
            filtered = filtered.filter(student => student.paymentStatus === selectedPaymentStatus);
        }

        setFilteredStudents(filtered);
    };

    // Styles en fonction du thème
    const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const textColorClass = theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
    const tableBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
    const tableHeaderBgColor = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
    const tableRowHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    // Obtenir la liste des classes uniques
    const uniqueClasses = [...new Set(students.map(student => student.classe))].sort();

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className={`text-2xl font-bold ${textColorClass}`}>Liste des Élèves et Paiements</h2>

                <div>
                    <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className={`px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtres */}
            <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className={`block text-sm font-medium ${textColorClass} mb-1`}>
                            Rechercher un élève
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nom, prénom ou ID..."
                            className={`w-full px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${textColorClass} mb-1`}>
                            Classe
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className={`w-full px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="all">Toutes les classes</option>
                            {uniqueClasses.map(className => (
                                <option key={className} value={className}>{className}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${textColorClass} mb-1`}>
                            Statut de l'élève
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className={`w-full px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${textColorClass} mb-1`}>
                            Statut de paiement
                        </label>
                        <select
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className={`w-full px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="paid">Payé intégralement</option>
                            <option value="partial">Partiellement payé</option>
                            <option value="unpaid">Non payé</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des élèves */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className={`${cardBgColor} rounded-lg shadow-lg p-8 text-center ${textColorClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Aucun élève trouvé</h3>
                    <p className="text-gray-500">
                        Aucun élève ne correspond aux critères de recherche.
                    </p>
                </div>
            ) : (
                <div className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className={`${tableHeaderBgColor}`}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                        Élève
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${textColorClass} uppercase tracking-wider`}>
                                        Classe
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
                                {filteredStudents.map((student) => (
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
                                            {student.classe}
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
            )}

            {/* Résumé */}
            {filteredStudents.length > 0 && (
                <motion.div
                    className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} mt-8 p-6`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>
                        Résumé des paiements ({filteredStudents.length} élèves)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-4 rounded-lg bg-blue-100 border border-blue-200`}>
                            <h4 className="text-blue-800 font-bold mb-2">Montant Total Prévu</h4>
                            <p className="text-2xl font-bold text-blue-900">
                                {filteredStudents.reduce((sum, student) => sum + student.expectedAmount, 0).toLocaleString()} FCFA
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg bg-green-100 border border-green-200`}>
                            <h4 className="text-green-800 font-bold mb-2">Montant Total Payé</h4>
                            <p className="text-2xl font-bold text-green-900">
                                {filteredStudents.reduce((sum, student) => sum + student.paidAmount, 0).toLocaleString()} FCFA
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg bg-red-100 border border-red-200`}>
                            <h4 className="text-red-800 font-bold mb-2">Reste à Payer</h4>
                            <p className="text-2xl font-bold text-red-900">
                                {filteredStudents.reduce((sum, student) => sum + student.remainingAmount, 0).toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between mb-2">
                            <span className={`${textColorClass} font-medium`}>Progression globale des paiements</span>
                            <span className={`${textColorClass} font-bold`}>
                                {(() => {
                                    const totalExpected = filteredStudents.reduce((sum, student) => sum + student.expectedAmount, 0);
                                    const totalPaid = filteredStudents.reduce((sum, student) => sum + student.paidAmount, 0);
                                    return totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;
                                })()}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-3">
                            <div
                                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                style={{
                                    width: `${(() => {
                                        const totalExpected = filteredStudents.reduce((sum, student) => sum + student.expectedAmount, 0);
                                        const totalPaid = filteredStudents.reduce((sum, student) => sum + student.paidAmount, 0);
                                        return totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;
                                    })()}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PayementsStudentList;