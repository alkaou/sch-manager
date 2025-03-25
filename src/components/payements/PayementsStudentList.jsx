import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts';
import { useFlashNotification } from "../contexts";
import { Search, Calendar, CheckCircle, XCircle, Edit2, ArrowLeft, ArrowRight, Filter, AlertCircle, DollarSign } from "lucide-react";

const PayementsStudentList = ({ db, theme, app_bg_color, text_color, selectedClass, selectedPaymentSystem }) => {
    const { language } = useLanguage();
    const { setFlashMessage } = useFlashNotification();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [validatedPayments, setValidatedPayments] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [showValidated, setShowValidated] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [paymentToEdit, setPaymentToEdit] = useState(null);
    const [isSystemExpired, setIsSystemExpired] = useState(false);

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
    const buttonDanger = "bg-red-600 hover:bg-red-700";
    const buttonSuccess = "bg-green-600 hover:bg-green-700";

    // Mois en français
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    // Vérifier si le système de paiement est expiré
    useEffect(() => {
        if (selectedPaymentSystem) {
            const endDate = new Date(selectedPaymentSystem.endDate);
            const today = new Date();
            setIsSystemExpired(endDate < today);

            // Définir le mois sélectionné au premier mois de l'année scolaire
            const startDate = new Date(selectedPaymentSystem.startDate);
            setSelectedMonth(startDate.getMonth());
            setSelectedYear(startDate.getFullYear());
        }
    }, [selectedPaymentSystem]);

    // Charger les étudiants de la classe sélectionnée
    useEffect(() => {
        if (db && selectedClass && selectedPaymentSystem) {
            setIsLoading(true);
            loadStudentsWithPaymentInfo();
        } else {
            setStudents([]);
            setFilteredStudents([]);
            setValidatedPayments([]);
            setPendingPayments([]);
        }
        // console.log(selectedClass);
    }, [db, selectedClass, selectedPaymentSystem, selectedMonth, selectedYear]);

    // Filtrer les étudiants en fonction de la recherche
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = students.filter(student =>
                student.name_complet.toLowerCase().includes(term) ||
                student.matricule.toLowerCase().includes(term)
            );
            setFilteredStudents(filtered);
        }
    }, [students, searchTerm]);

    // Charger les informations de paiement des étudiants
    const loadStudentsWithPaymentInfo = async () => {
        if (!db || !db.students || !selectedClass || !selectedPaymentSystem) {
            setIsLoading(false);
            return;
        }

        // Récupérer les étudiants de la classe sélectionnée
        const classStudents = db.students.filter(student =>
            student.classe === `${selectedClass.level} ${selectedClass.name}` &&
            student.status === "actif"
        );

        // Récupérer les paiements existants
        const payments = db.payments || [];

        // Préparer les données pour chaque étudiant
        const studentsWithPayments = classStudents.map(student => {
            // Calculer les montants attendus pour le mois sélectionné
            const monthlyFee = selectedPaymentSystem.monthlyFee || 0;

            // Déterminer si le frais d'inscription doit être affiché (uniquement pour le premier mois)
            const startDate = new Date(selectedPaymentSystem.startDate);
            const isFirstMonth = selectedMonth === startDate.getMonth() && selectedYear === startDate.getFullYear();
            const registrationFee = isFirstMonth ? (selectedPaymentSystem.registrationFee || 0) : 0;

            // Calculer le montant total à payer pour ce mois
            const totalMonthlyAmount = monthlyFee + registrationFee;

            // Trouver les paiements de l'étudiant pour ce mois
            const studentPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.date);
                return payment.studentId === student.id &&
                    payment.paymentSystemId === selectedPaymentSystem.id &&
                    paymentDate.getMonth() === selectedMonth &&
                    paymentDate.getFullYear() === selectedYear;
            });

            // Calculer le montant total payé pour ce mois
            const paidAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);

            // Déterminer si le paiement est validé pour ce mois
            const isValidated = paidAmount >= totalMonthlyAmount;

            return {
                ...student,
                monthlyFee,
                registrationFee,
                totalMonthlyAmount,
                paidAmount,
                remainingAmount: Math.max(0, totalMonthlyAmount - paidAmount),
                isValidated,
                payments: studentPayments
            };
        });

        // Trier les étudiants par nom
        studentsWithPayments.sort((a, b) => a.name_complet.localeCompare(b.name_complet));

        // Séparer les paiements validés et en attente
        const validated = studentsWithPayments.filter(student => student.isValidated);
        const pending = studentsWithPayments.filter(student => !student.isValidated);

        setStudents(studentsWithPayments);
        setFilteredStudents(studentsWithPayments);
        setValidatedPayments(validated);
        setPendingPayments(pending);
        setIsLoading(false);
    };

    // Gérer l'ajout d'un nouveau paiement
    const handleAddPayment = async (student, amount) => {
        if (isSystemExpired) {
            setFlashMessage({
                message: "Impossible de modifier les paiements d'un système expiré",
                type: "error",
                duration: 5000,
            });
            return;
        }

        if (!amount || amount <= 0) {
            setFlashMessage({
                message: "Veuillez entrer un montant valide",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            // Créer un nouvel objet de paiement
            const newPayment = {
                id: `payment-${Date.now()}`,
                studentId: student.id,
                paymentSystemId: selectedPaymentSystem.id,
                amount: Number(amount),
                date: new Date().toISOString(),
                month: selectedMonth,
                year: selectedYear,
                type: "monthly",
                createdAt: new Date().toISOString()
            };

            // Ajouter le paiement à la base de données
            const updatedDb = { ...db };
            if (!updatedDb.payments) updatedDb.payments = [];
            updatedDb.payments.push(newPayment);

            // Sauvegarder dans la base de données
            await window.electron.saveDatabase(updatedDb);

            // Mettre à jour l'interface
            setFlashMessage({
                message: `Paiement de ${amount} FCFA enregistré pour ${student.name_complet}`,
                type: "success",
                duration: 5000,
            });

            // Recharger les données
            loadStudentsWithPaymentInfo();
        } catch (error) {
            setFlashMessage({
                message: "Erreur lors de l'enregistrement du paiement",
                type: "error",
                duration: 5000,
            });
        }
    };

    // Gérer la modification d'un paiement existant
    const handleEditPayment = async (payment, newAmount) => {
        if (isSystemExpired) {
            setFlashMessage({
                message: "Impossible de modifier les paiements d'un système expiré",
                type: "error",
                duration: 5000,
            });
            return;
        }

        if (!newAmount || newAmount <= 0) {
            setFlashMessage({
                message: "Veuillez entrer un montant valide",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            // Mettre à jour le paiement dans la base de données
            const updatedDb = { ...db };
            const paymentIndex = updatedDb.payments.findIndex(p => p.id === payment.id);

            if (paymentIndex !== -1) {
                updatedDb.payments[paymentIndex] = {
                    ...updatedDb.payments[paymentIndex],
                    amount: Number(newAmount),
                    updatedAt: new Date().toISOString()
                };

                // Sauvegarder dans la base de données
                await window.electron.saveDatabase(updatedDb);

                // Mettre à jour l'interface
                setFlashMessage({
                    message: "Paiement modifié avec succès",
                    type: "success",
                    duration: 5000,
                });

                // Réinitialiser l'état d'édition
                setEditingPayment(null);
                setPaymentToEdit(null);

                // Recharger les données
                loadStudentsWithPaymentInfo();
            }
        } catch (error) {
            setFlashMessage({
                message: "Erreur lors de la modification du paiement",
                type: "error",
                duration: 5000,
            });
        }
    };

    // Gérer la suppression d'un paiement
    const handleDeletePayment = async (payment) => {
        if (isSystemExpired) {
            setFlashMessage({
                message: "Impossible de supprimer les paiements d'un système expiré",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            // Supprimer le paiement de la base de données
            const updatedDb = { ...db };
            updatedDb.payments = updatedDb.payments.filter(p => p.id !== payment.id);

            // Sauvegarder dans la base de données
            await window.electron.saveDatabase(updatedDb);

            // Mettre à jour l'interface
            setFlashMessage({
                message: "Paiement supprimé avec succès",
                type: "success",
                duration: 5000,
            });

            // Recharger les données
            loadStudentsWithPaymentInfo();
        } catch (error) {
            setFlashMessage({
                message: "Erreur lors de la suppression du paiement",
                type: "error",
                duration: 5000,
            });
        }
    };

    // Générer les mois disponibles pour le système de paiement sélectionné
    const availableMonths = useMemo(() => {
        if (!selectedPaymentSystem) return [];

        const startDate = new Date(selectedPaymentSystem.startDate);
        const endDate = new Date(selectedPaymentSystem.endDate);
        const result = [];

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            result.push({
                month: currentDate.getMonth(),
                year: currentDate.getFullYear(),
                label: `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return result;
    }, [selectedPaymentSystem]);

    // Changer le mois sélectionné
    const handleMonthChange = (monthData) => {
        setSelectedMonth(monthData.month);
        setSelectedYear(monthData.year);
    };

    // Naviguer au mois précédent
    const goToPreviousMonth = () => {
        const currentIndex = availableMonths.findIndex(m =>
            m.month === selectedMonth && m.year === selectedYear
        );

        if (currentIndex > 0) {
            const prevMonth = availableMonths[currentIndex - 1];
            setSelectedMonth(prevMonth.month);
            setSelectedYear(prevMonth.year);
        }
    };

    // Naviguer au mois suivant
    const goToNextMonth = () => {
        const currentIndex = availableMonths.findIndex(m =>
            m.month === selectedMonth && m.year === selectedYear
        );

        if (currentIndex < availableMonths.length - 1) {
            const nextMonth = availableMonths[currentIndex + 1];
            setSelectedMonth(nextMonth.month);
            setSelectedYear(nextMonth.year);
        }
    };

    // Afficher un message si aucune classe n'est sélectionnée
    if (!selectedClass || !selectedPaymentSystem) {
        return (
            <div className={`h-full flex items-center justify-center ${cardBgColor}`}>
                <div className="text-center p-8">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className={`text-xl font-bold ${textColorClass} mb-2`}>Aucune classe sélectionnée</h2>
                    <p className={`${textColorClass} opacity-70`}>Veuillez sélectionner une classe dans le menu de gauche pour gérer les paiements.</p>
                </div>
            </div>
        );
    }

    // Afficher un indicateur de chargement
    if (isLoading) {
        return (
            <div className={`h-full flex items-center justify-center ${cardBgColor}`}>
                <div className="text-center p-8">
                    <div className="mb-4">
                        <svg className="animate-spin h-10 w-10 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className={`${textColorClass}`}>Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full flex flex-col ${cardBgColor}`}>
            {/* En-tête avec informations sur la classe et le système de paiement */}
            <div className={`p-4 ${headerBgColor} border-b flex justify-between items-center`}>
                <div>
                    <h2 className={`text-xl font-bold ${textColorClass}`}>
                        Classe: {selectedClass.level} {selectedClass.name}
                        <span className="ml-2 text-sm font-normal opacity-70">
                            ({filteredStudents.length} élèves)
                        </span>
                    </h2>
                    <p className={`${textColorClass} opacity-80 text-sm`}>
                        Système de paiement: {selectedPaymentSystem.name}
                        {isSystemExpired && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                Expiré
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToPreviousMonth}
                        className={`p-2 rounded-full ${buttonSecondary} text-white`}
                        disabled={availableMonths.findIndex(m => m.month === selectedMonth && m.year === selectedYear) === 0}
                    >
                        <ArrowLeft size={16} />
                    </button>

                    <div className="relative">
                        <select
                            value={`${selectedMonth}-${selectedYear}`}
                            onChange={(e) => {
                                const [month, year] = e.target.value.split('-');
                                handleMonthChange({ month: parseInt(month), year: parseInt(year) });
                            }}
                            className={`px-3 py-2 rounded ${inputBgColor} ${textColorClass} border ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8`}
                        >
                            {availableMonths.map((monthData, index) => (
                                <option key={index} value={`${monthData.month}-${monthData.year}`}>
                                    {monthData.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <Calendar size={16} className={textColorClass} />
                        </div>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className={`p-2 rounded-full ${buttonSecondary} text-white`}
                        disabled={availableMonths.findIndex(m => m.month === selectedMonth && m.year === selectedYear) === availableMonths.length - 1}
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher un élève..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded ${inputBgColor} ${textColorClass} border ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Search size={18} className={`${textColorClass} opacity-60`} />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowValidated(!showValidated)}
                        className={`px-4 py-2 rounded flex items-center space-x-2 ${showValidated ? buttonPrimary : buttonSecondary} text-white`}
                    >
                        {showValidated ? <CheckCircle size={18} /> : <Filter size={18} />}
                        <span>{showValidated ? "Paiements validés" : "Paiements en attente"}</span>
                    </button>

                    {isSystemExpired && (
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded">
                            <AlertCircle size={16} />
                            <span className="text-sm">Mode lecture seule (système expiré)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-grow overflow-auto">
                {filteredStudents.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className={`${textColorClass} font-medium`}>Aucun élève trouvé</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className={`rounded-lg overflow-hidden border ${inputBorderColor} mb-6`}>
                            <table className="w-full">
                                <thead className={`${tableHeaderBgColor}`}>
                                    <tr>
                                        <th className={`px-4 py-3 text-left ${textColorClass}`}>Élève</th>
                                        <th className={`px-4 py-3 text-right ${textColorClass}`}>Frais mensuel</th>
                                        {selectedMonth === new Date(selectedPaymentSystem.startDate).getMonth() &&
                                            selectedYear === new Date(selectedPaymentSystem.startDate).getFullYear() && (
                                                <th className={`px-4 py-3 text-right ${textColorClass}`}>Frais d'inscription</th>
                                            )}
                                        <th className={`px-4 py-3 text-right ${textColorClass}`}>Total à payer</th>
                                        <th className={`px-4 py-3 text-right ${textColorClass}`}>Montant payé</th>
                                        <th className={`px-4 py-3 text-right ${textColorClass}`}>Reste à payer</th>
                                        <th className={`px-4 py-3 text-center ${textColorClass}`}>Statut</th>
                                        <th className={`px-4 py-3 text-center ${textColorClass}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(showValidated ? validatedPayments : pendingPayments)
                                        .filter(student => filteredStudents.some(s => s.id === student.id))
                                        .map((student, index) => (
                                            <tr
                                                key={student.id}
                                                className={`${index % 2 === 0 ? tableBgColor : ''} ${tableRowHoverBgColor} border-t ${inputBorderColor}`}
                                            >
                                                <td className={`px-4 py-3 ${textColorClass}`}>
                                                    <div className="flex items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.isValidated ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                            } mr-3`}>
                                                            {student.name_complet.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{student.name_complet}</div>
                                                            <div className="text-xs opacity-70">Matricule: {student.matricule}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 text-right ${textColorClass}`}>
                                                    {student.monthlyFee.toLocaleString()} FCFA
                                                </td>
                                                {selectedMonth === new Date(selectedPaymentSystem.startDate).getMonth() &&
                                                    selectedYear === new Date(selectedPaymentSystem.startDate).getFullYear() && (
                                                        <td className={`px-4 py-3 text-right ${textColorClass}`}>
                                                            {student.registrationFee.toLocaleString()} FCFA
                                                        </td>
                                                    )}
                                                <td className={`px-4 py-3 text-right font-medium ${textColorClass}`}>
                                                    {student.totalMonthlyAmount.toLocaleString()} FCFA
                                                </td>
                                                <td className={`px-4 py-3 text-right font-medium text-green-600`}>
                                                    {student.paidAmount.toLocaleString()} FCFA
                                                </td>
                                                <td className={`px-4 py-3 text-right font-medium ${student.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {student.remainingAmount.toLocaleString()} FCFA
                                                </td>
                                                <td className={`px-4 py-3 text-center`}>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.isValidated
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {student.isValidated ? (
                                                            <>
                                                                <CheckCircle size={12} className="mr-1" />
                                                                Payé
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={12} className="mr-1" />
                                                                En attente
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-center`}>
                                                    {!isSystemExpired && (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {editingPayment === student.id ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="number"
                                                                        value={paymentToEdit || ''}
                                                                        onChange={(e) => setPaymentToEdit(e.target.value)}
                                                                        className={`w-24 px-2 py-1 rounded ${inputBgColor} ${textColorClass} border ${inputBorderColor} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                                        placeholder="Montant"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            handleAddPayment(student, paymentToEdit);
                                                                            setEditingPayment(null);
                                                                            setPaymentToEdit(null);
                                                                        }}
                                                                        className={`p-1 rounded ${buttonSuccess} text-white`}
                                                                    >
                                                                        <CheckCircle size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingPayment(null);
                                                                            setPaymentToEdit(null);
                                                                        }}
                                                                        className={`p-1 rounded ${buttonDanger} text-white`}
                                                                    >
                                                                        <XCircle size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingPayment(student.id);
                                                                        setPaymentToEdit(student.remainingAmount > 0 ? student.remainingAmount : '');
                                                                    }}
                                                                    className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                                                >
                                                                    <DollarSign size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Section des paiements détaillés */}
                        <div className="mt-8">
                            <h3 className={`text-lg font-semibold ${textColorClass} mb-4`}>
                                Historique des paiements - {months[selectedMonth]} {selectedYear}
                            </h3>

                            {/* Liste des paiements pour le mois sélectionné */}
                            <div className={`rounded-lg overflow-hidden border ${inputBorderColor}`}>
                                <table className="w-full">
                                    <thead className={`${tableHeaderBgColor}`}>
                                        <tr>
                                            <th className={`px-4 py-3 text-left ${textColorClass}`}>Élève</th>
                                            <th className={`px-4 py-3 text-left ${textColorClass}`}>Date</th>
                                            <th className={`px-4 py-3 text-right ${textColorClass}`}>Montant</th>
                                            <th className={`px-4 py-3 text-center ${textColorClass}`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {db.payments && db.payments
                                            .filter(payment => {
                                                const paymentDate = new Date(payment.date);
                                                return payment.paymentSystemId === selectedPaymentSystem.id &&
                                                    paymentDate.getMonth() === selectedMonth &&
                                                    paymentDate.getFullYear() === selectedYear &&
                                                    filteredStudents.some(s => s.id === payment.studentId);
                                            })
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .map((payment, index) => {
                                                const student = filteredStudents.find(s => s.id === payment.studentId);
                                                if (!student) return null;

                                                return (
                                                    <tr
                                                        key={payment.id}
                                                        className={`${index % 2 === 0 ? tableBgColor : ''} ${tableRowHoverBgColor} border-t ${inputBorderColor}`}
                                                    >
                                                        <td className={`px-4 py-3 ${textColorClass}`}>
                                                            <div className="flex items-center">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mr-3`}>
                                                                    {student.name_complet.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{student.name_complet}</div>
                                                                    <div className="text-xs opacity-70">Matricule: {student.matricule}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-4 py-3 ${textColorClass}`}>
                                                            {new Date(payment.date).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className={`px-4 py-3 text-right font-medium text-green-600`}>
                                                            {payment.amount.toLocaleString()} FCFA
                                                        </td>
                                                        <td className={`px-4 py-3 text-center`}>
                                                            {!isSystemExpired && (
                                                                <div className="flex items-center justify-center space-x-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingPayment(`payment-${payment.id}`);
                                                                            setPaymentToEdit(payment.amount);
                                                                        }}
                                                                        className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                                                    >
                                                                        <Edit2 size={16} />
                                                                    </button>

                                                                    {editingPayment === `payment-${payment.id}` ? (
                                                                        <div className="flex items-center space-x-2">
                                                                            <input
                                                                                type="number"
                                                                                value={paymentToEdit || ''}
                                                                                onChange={(e) => setPaymentToEdit(e.target.value)}
                                                                                className={`w-24 px-2 py-1 rounded ${inputBgColor} ${textColorClass} border ${inputBorderColor} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                                                                placeholder="Montant"
                                                                            />
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleEditPayment(payment, paymentToEdit);
                                                                                }}
                                                                                className={`p-1 rounded ${buttonSuccess} text-white`}
                                                                            >
                                                                                <CheckCircle size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingPayment(null);
                                                                                    setPaymentToEdit(null);
                                                                                }}
                                                                                className={`p-1 rounded ${buttonDanger} text-white`}
                                                                            >
                                                                                <XCircle size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce paiement de ${payment.amount.toLocaleString()} FCFA ?`)) {
                                                                                    handleDeletePayment(payment);
                                                                                }
                                                                            }}
                                                                            className={`p-1.5 rounded ${buttonDanger} text-white`}
                                                                        >
                                                                            <XCircle size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                        {(!db.payments || db.payments.filter(payment => {
                                            const paymentDate = new Date(payment.date);
                                            return payment.paymentSystemId === selectedPaymentSystem.id &&
                                                paymentDate.getMonth() === selectedMonth &&
                                                paymentDate.getFullYear() === selectedYear &&
                                                filteredStudents.some(s => s.id === payment.studentId);
                                        }).length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className={`px-4 py-6 text-center ${textColorClass} opacity-70`}>
                                                        Aucun paiement enregistré pour ce mois
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statistiques de paiement */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-lg border ${inputBorderColor} ${cardBgColor}`}>
                                <h4 className={`text-sm font-medium opacity-70 ${textColorClass} mb-1`}>Total des paiements</h4>
                                <p className={`text-2xl font-bold text-green-600`}>
                                    {db.payments
                                        ? db.payments
                                            .filter(payment => {
                                                const paymentDate = new Date(payment.date);
                                                return payment.paymentSystemId === selectedPaymentSystem.id &&
                                                    paymentDate.getMonth() === selectedMonth &&
                                                    paymentDate.getFullYear() === selectedYear &&
                                                    filteredStudents.some(s => s.id === payment.studentId);
                                            })
                                            .reduce((sum, payment) => sum + payment.amount, 0)
                                            .toLocaleString()
                                        : 0
                                    } FCFA
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg border ${inputBorderColor} ${cardBgColor}`}>
                                <h4 className={`text-sm font-medium opacity-70 ${textColorClass} mb-1`}>Élèves ayant payé</h4>
                                <p className={`text-2xl font-bold ${textColorClass}`}>
                                    {validatedPayments.length} / {students.length}
                                </p>
                                <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{ width: `${students.length > 0 ? (validatedPayments.length / students.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border ${inputBorderColor} ${cardBgColor}`}>
                                <h4 className={`text-sm font-medium opacity-70 ${textColorClass} mb-1`}>Reste à percevoir</h4>
                                <p className={`text-2xl font-bold text-red-600`}>
                                    {pendingPayments
                                        .reduce((sum, student) => sum + student.remainingAmount, 0)
                                        .toLocaleString()
                                    } FCFA
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayementsStudentList;