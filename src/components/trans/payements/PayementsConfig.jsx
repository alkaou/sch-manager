import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClasseName } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { useFlashNotification } from "../contexts";
import { X } from "lucide-react";
import ActionConfirmePopup from "../ActionConfirmePopup.jsx";
import { gradients } from '../../utils/colors.js';
import { usePayementTranslator } from "./usePayementTranslator";

const PayementsConfig = ({ db, theme, app_bg_color, text_color, refreshData }) => {
    const { language } = useLanguage();
    const { setFlashMessage } = useFlashNotification();
    const { t } = usePayementTranslator();
    const [paymentSystems, setPaymentSystems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewSystemForm, setShowNewSystemForm] = useState(false);
    const [editingSystemId, setEditingSystemId] = useState(null);
    const [availableClasses, setAvailableClasses] = useState([]);

    // État pour la popup de confirmation
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [systemToDelete, setSystemToDelete] = useState(null);

    // Les date pour Input Date
    const DateForInputs = new Date().getFullYear();
    // Calculer la date de demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Nouveau système de paiement
    const [newSystem, setNewSystem] = useState({
        id: Date.now().toString(),
        name: '',
        monthlyFee: 0,
        registrationFee: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 9)).toISOString().split('T')[0],
        classes: [],
        otherFees: [],
        isActive: true,
        createdAt: new Date().toISOString()
    });

    // Trier les classes par level
    const sortClassesByLevel = (classeArray = []) => {
        if (classeArray.length < 2) return classeArray;
        const sortedClasses = [...classeArray].sort((a, b) =>
            b.level - a.level
        );
        return sortedClasses;
    };

    const loadData = () => {
        if (db && db.paymentSystems) {
            // Sort payment systems by creation date (newest first)
            const sortedSystems = [...db.paymentSystems].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setPaymentSystems(sortedSystems);
        }
        const sortedClasses = sortClassesByLevel(db?.classes);
        updateAvailableClasses(sortedClasses, paymentSystems);
    }

    // Charger les systèmes de paiement existants
    useEffect(() => {
        loadData();
    }, [db]);

    // Mettre à jour les classes disponibles
    const updateAvailableClasses = (allClasses, systems) => {
        if (!allClasses) return;

        // Get current date for comparison
        const currentDate = new Date();

        // Find classes that are already assigned to active payment systems (not expired)
        const assignedClassIds = new Set();

        systems.forEach(system => {
            // Only consider systems that are active and not expired
            const endDate = new Date(system.endDate);
            const isExpired = endDate < currentDate;

            // If system is not expired, mark its classes as assigned
            if (system.isActive && !isExpired && system.classes) {
                system.classes.forEach(classId => assignedClassIds.add(classId));
            }
        });

        // Filter out classes that are already assigned to active systems
        const available = allClasses.filter(cls => !assignedClassIds.has(cls.id));
        setAvailableClasses(available);
    };

    // Calculer les frais annuels
    const calculateYearlyFee = (monthlyFee, startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const monthDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        return monthlyFee * Math.max(1, monthDiff);
    };

    // Gérer les changements dans le formulaire
    const handleSystemChange = (field, value) => {
        const updatedSystem = { ...newSystem, [field]: value };

        // Calculer les bornes pour startDate (règle a)
        const startMin = new Date(`${DateForInputs - 1}-01-01`);
        const startMax = new Date(`${DateForInputs + 1}-12-31`);

        // Calculer les bornes pour endDate (règle b)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const endMin = new Date(tomorrowStr);
        const endMax = new Date(`${tomorrow.getFullYear() + 2}-12-31`);

        // Convertir les dates saisies en objets Date
        const startDate = updatedSystem.startDate ? new Date(updatedSystem.startDate) : null;
        const endDate = updatedSystem.endDate ? new Date(updatedSystem.endDate) : null;

        // 1. Vérifier que la date de fin n'est pas antérieure à la date de début
        if (startDate && endDate && endDate < startDate) {
            setFlashMessage({
                message: t("end_date_before_start_date"),
                type: "error",
                duration: 5000,
            });
            return;
        }

        // 2. Vérifier que la date de début est dans la plage autorisée
        if (startDate && (startDate < startMin || startDate > startMax)) {
            setFlashMessage({
                message: t("start_date_out_of_range", { startMin: startMin.toISOString().split('T')[0], startMax: startMax.toISOString().split('T')[0] }),
                type: "error",
                duration: 5000,
            });
            return;
        }

        // 3. Vérifier que la date de fin est dans la plage autorisée
        if (endDate && (endDate < endMin || endDate > endMax)) {
            setFlashMessage({
                message: t("end_date_out_of_range", { endMin: endMin.toISOString().split('T')[0], endMax: endMax.toISOString().split('T')[0] }),
                type: "error",
                duration: 5000,
            });
            return;
        }

        // Recalculer les frais annuels si nécessaire
        if (field === 'monthlyFee' || field === 'startDate' || field === 'endDate') {
            updatedSystem.yearlyFee = calculateYearlyFee(
                field === 'monthlyFee' ? Number(value) : newSystem.monthlyFee,
                field === 'startDate' ? value : newSystem.startDate,
                field === 'endDate' ? value : newSystem.endDate
            );
        }

        setNewSystem(updatedSystem);
    };


    // Ajouter/Supprimer une classe du nouveau système
    const toggleClassSelection = (classId) => {
        const updatedClasses = newSystem.classes.includes(classId)
            ? newSystem.classes.filter(id => id !== classId)
            : [...newSystem.classes, classId];

        setNewSystem({ ...newSystem, classes: updatedClasses });
    };

    // Ajouter un frais supplémentaire
    const handleAddOtherFee = () => {
        const updatedSystem = { ...newSystem };
        updatedSystem.otherFees.push({ name: '', amount: 0 });
        setNewSystem(updatedSystem);
    };

    // Mettre à jour un frais supplémentaire
    const handleOtherFeeChange = (feeIndex, field, value) => {
        const updatedSystem = { ...newSystem };
        updatedSystem.otherFees[feeIndex][field] = field === 'amount' ? Number(value) : value;
        setNewSystem(updatedSystem);
    };

    // Supprimer un frais supplémentaire
    const handleRemoveOtherFee = (feeIndex) => {
        const updatedSystem = { ...newSystem };
        updatedSystem.otherFees.splice(feeIndex, 1);
        setNewSystem(updatedSystem);
    };

    // Sauvegarder le nouveau système
    const handleSaveSystem = async () => {
        if (!newSystem.name.trim()) {
            setFlashMessage({
                message: t("please_enter_payment_system_name"),
                type: "error",
                duration: 5000,
            });
            return;
        }

        if (newSystem.monthlyFee <= 0) {
            setFlashMessage({
                message: t("monthly_fee_must_be_positive"),
                type: "error",
                duration: 5000,
            });
            return;
        }

        if (newSystem.classes.length === 0) {
            setFlashMessage({
                message: t("please_select_at_least_one_class"),
                type: "error",
                duration: 5000,
            });
            return;
        }

        // Vérifier les dates
        const start = new Date(newSystem.startDate);
        const end = new Date(newSystem.endDate);

        if (end < start) {
            setFlashMessage({
                message: t("end_date_before_start_date"),
                type: "error",
                duration: 5000,
            });
            return;
        }

        setIsLoading(true);

        try {
            let updatedSystems;
            let updatedPayments = { ...db.payments };
            let updatedRegistrationFees = { ...db.registrationFees };

            if (editingSystemId) {
                // Récupérer l'ancien système pour comparer les classes
                const oldSystem = paymentSystems.find(system => system.id === editingSystemId);

                // Identifier les classes qui ont été supprimées
                if (oldSystem && oldSystem.classes) {
                    const removedClasses = oldSystem.classes.filter(
                        classId => !newSystem.classes.includes(classId)
                    );

                    // Supprimer les paiements liés aux classes supprimées
                    removedClasses.forEach(classId => {
                        const paymentKey = `students_${editingSystemId}_${classId}`;
                        if (updatedPayments[paymentKey]) {
                            delete updatedPayments[paymentKey];
                        }

                        // Supprimer également les frais d'inscription liés aux classes supprimées
                        const registrationFeeKey = `registration_fee_${editingSystemId}_${classId}`;
                        if (updatedRegistrationFees[registrationFeeKey]) {
                            delete updatedRegistrationFees[registrationFeeKey];
                        }
                    });
                }

                // Si les frais d'inscription sont mis à 0, supprimer tous les enregistrements de frais d'inscription
                if (Number(newSystem.registrationFee) === 0 && oldSystem.registrationFee > 0) {
                    newSystem.classes.forEach(classId => {
                        const registrationFeeKey = `registration_fee_${editingSystemId}_${classId}`;
                        if (updatedRegistrationFees[registrationFeeKey]) {
                            delete updatedRegistrationFees[registrationFeeKey];
                        }
                    });
                }

                // Mise à jour d'un système existant
                updatedSystems = paymentSystems.map(system =>
                    system.id === editingSystemId ? { ...newSystem, id: editingSystemId } : system
                );
            } else {
                // Ajout d'un nouveau système
                updatedSystems = [...paymentSystems, { ...newSystem, id: Date.now().toString() }];
            }

            const updatedDb = {
                ...db,
                paymentSystems: updatedSystems,
                payments: updatedPayments,
                registrationFees: updatedRegistrationFees
            };
            await window.electron.saveDatabase(updatedDb);

            setPaymentSystems(updatedSystems);
            const sortedClasses = sortClassesByLevel(db.classes);
            updateAvailableClasses(sortedClasses, updatedSystems);

            setFlashMessage({
                message: editingSystemId
                    ? t("payment_system_updated_successfully")
                    : t("payment_system_created_successfully"),
                type: "success",
                duration: 5000,
            });

            // Réinitialiser le formulaire
            setShowNewSystemForm(false);
            setEditingSystemId(null);
            setNewSystem({
                id: Date.now().toString(),
                name: '',
                monthlyFee: 0,
                registrationFee: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 9)).toISOString().split('T')[0],
                classes: [],
                otherFees: [],
                isActive: true,
                createdAt: new Date().toISOString()
            });

            refreshData();
            loadData();

        } catch (err) {
            setFlashMessage({
                message: t("error_saving_payment_system"),
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Modifier un système existant
    const handleEditSystem = (system) => {
        setEditingSystemId(system.id);
        setNewSystem({ ...system });
        setShowNewSystemForm(true);
    };

    // Supprimer un système
    const handleDeleteSystem = (systemId) => {
        setSystemToDelete(systemId);
        setShowConfirmPopup(true);
    };

    // Fonction pour confirmer la suppression
    const handleConfirmDelete = async () => {
        if (!systemToDelete) return;

        setIsLoading(true);

        try {
            // Mettre à jour la liste des systèmes en supprimant celui dont l'id correspond à systemId
            const updatedSystems = paymentSystems.filter(system => system.id !== systemToDelete);

            // Supprimer les paiements liés à ce système
            const updatedPayments = { ...db.payments };
            Object.keys(updatedPayments).forEach(key => {
                if (key.startsWith(`students_${systemToDelete}_`)) {
                    delete updatedPayments[key];
                }
            });

            // Supprimer les frais d'inscription liés à ce système
            const updatedRegistrationFees = { ...db.registrationFees };
            Object.keys(updatedRegistrationFees).forEach(key => {
                if (key.startsWith(`registration_fee_${systemToDelete}_`)) {
                    delete updatedRegistrationFees[key];
                }
            });

            // Construire la nouvelle base de données avec la mise à jour des systèmes, des paiements et des frais d'inscription
            const updatedDb = {
                ...db,
                paymentSystems: updatedSystems,
                payments: updatedPayments,
                registrationFees: updatedRegistrationFees
            };
            await window.electron.saveDatabase(updatedDb);

            setPaymentSystems(updatedSystems);
            updateAvailableClasses(db.classes, updatedSystems);

            setFlashMessage({
                message: t("payment_system_deleted_successfully"),
                type: "success",
                duration: 5000,
            });

            refreshData();
            loadData();

        } catch (err) {
            setFlashMessage({
                message: t("error_deleting_payment_system"),
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
            setShowConfirmPopup(false);
            setSystemToDelete(null);
        }
    };


    // Vérifier si une année scolaire est terminée
    const isSchoolYearEnded = (endDate) => {
        return new Date(endDate) < new Date();
    };

    // Styles en fonction du thème
    const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    const inputTextColor = app_bg_color === gradients[1] ||
        app_bg_color === gradients[2] ||
        theme === "dark" ? text_color : "text-gray-700";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const buttonBgColor = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
    // const buttonAddColor = "bg-green-600 hover:bg-green-700";
    const dividerColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
    const pastSystemBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-200";

    // Séparer les systèmes actifs et inactifs
    const activeSystems = paymentSystems
        .filter(system => system.isActive && !isSchoolYearEnded(system.endDate))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation date (newest first)

    const pastSystems = paymentSystems
        .filter(system => !system.isActive || isSchoolYearEnded(system.endDate))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation date (newest first)

    return (
        <motion.div
            className="container mx-auto p-2 sm:p-3 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className={`text-xl sm:text-2xl font-bold ${text_color}`}>{t("payment_configuration_title")}</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:gap-8">
                {/* Partie gauche: Liste des systèmes de paiement */}
                <div>
                    <h3 className={`text-lg sm:text-xl font-semibold ${text_color} mb-3 sm:mb-4`}>{t("payment_systems")}</h3>

                    {activeSystems.length === 0 ? (
                        <div className={`${cardBgColor} rounded-lg shadow-md p-4 sm:p-6 text-center ${text_color} border ${borderColor}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">{t("no_payment_systems")}</p>
                            <p className="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">{t("create_first_payment_system")}</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {activeSystems.map(system => (
                                <motion.div
                                    key={system.id}
                                    className={`${cardBgColor} rounded-lg shadow-md border ${borderColor} overflow-hidden`}
                                    whileHover={{ y: -3 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-between items-center">
                                        <h4 className="text-base sm:text-lg font-bold">{system.name}</h4>
                                        <div className="flex space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() => {
                                                    handleEditSystem(system);
                                                    loadData();
                                                }}
                                                className="p-1 sm:p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSystem(system.id)}
                                                className="p-1 sm:p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4 md:p-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                                            <div>
                                                <p className={`text-xs sm:text-sm opacity-70 mb-0.5 sm:mb-1 ${inputTextColor}`}>Période</p>
                                                <p className={`${inputTextColor} text-xs sm:text-sm font-medium`}>
                                                    {new Date(system.startDate).toLocaleDateString()} - {new Date(system.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs sm:text-sm opacity-70 mb-0.5 sm:mb-1 ${inputTextColor}`}>Frais mensuels</p>
                                                <p className={`${inputTextColor} text-xs sm:text-sm font-medium`}>
                                                    {system.monthlyFee.toLocaleString()} FCFA
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3 sm:mb-4">
                                            <p className={`text-xs sm:text-sm opacity-70 mb-0.5 sm:mb-1 ${inputTextColor}`}>Classes concernées</p>
                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                {/* Trier par level avant le map */}
                                                {system.classes.sort((a, b) => {
                                                    const levelA = parseInt(a.split('-')[0], 10);
                                                    const levelB = parseInt(b.split('-')[0], 10);
                                                    return levelB - levelA; // Tri décroissant
                                                }).map(classId => {
                                                    const classObj = db?.classes?.find(c => c.id === classId);
                                                    return classObj ? (
                                                        <span
                                                            key={classId}
                                                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                                        >
                                                            {getClasseName(`${classObj.level} ${classObj.name}`, language)}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>

                                        <div className={`p-2 sm:p-3 rounded-lg ${inputBgColor} border ${borderColor}`}>
                                            <h4 className={`text-xs sm:text-sm font-bold ${inputTextColor} mb-1 sm:mb-2`}>Récapitulatif</h4>
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>Mensuel:</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {system.monthlyFee.toLocaleString()} FCFA
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>Annuel:</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {(system.yearlyFee || calculateYearlyFee(system.monthlyFee, system.startDate, system.endDate)).toLocaleString()} FCFA
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>Inscription:</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {system.registrationFee ? system.registrationFee.toLocaleString() : "0"} FCFA
                                                </span>
                                            </div>
                                            {system.otherFees && system.otherFees.length > 0 && (
                                                <div className="flex justify-between mt-1 pt-1 border-t border-gray-500">
                                                    <span className={`${inputTextColor} text-xs sm:text-sm`}>Supplémentaires:</span>
                                                    <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                        {system.otherFees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Systèmes de paiement passés */}
                    {pastSystems.length > 0 && (
                        <div className="mt-6 sm:mt-8">
                            <h4 className={`text-base sm:text-lg font-semibold ${text_color} mb-2 sm:mb-3`}>
                                {t("past_payment_systems")}
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                                {pastSystems.map(system => (
                                    <div
                                        key={system.id}
                                        className={`${pastSystemBgColor} rounded-lg p-3 sm:p-4 border ${borderColor}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className={`text-sm sm:text-base font-medium ${text_color}`}>{system.name}</h5>
                                                <p className={`text-xs sm:text-sm opacity-70 ${text_color}`}>
                                                    {new Date(system.startDate).toLocaleDateString(language === "Anglais" ? "en-US" : "fr-FR")} - {new Date(system.endDate).toLocaleDateString(language === "Anglais" ? "en-US" : "fr-FR")}
                                                </p>
                                            </div>
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-500 text-white`}>
                                                {isSchoolYearEnded(system.endDate) ? t("expired") : t("inactive")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Partie droite: Formulaire de création/édition */}
                <div>
                    {!showNewSystemForm ? (
                        <motion.div
                            className="flex flex-col items-center h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                onClick={() => {
                                    setShowNewSystemForm(true);
                                    loadData();
                                }}
                                className={`flex items-center justify-center w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-white ${buttonBgColor} transition-colors text-sm sm:text-base font-medium`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {t("add_payment_system")}
                            </button>

                            <p className={`mt-3 sm:mt-4 text-center ${text_color} opacity-70 max-w-md text-xs sm:text-sm`}>
                                {t("create_payment_system_description")}
                            </p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} overflow-hidden`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-3 sm:p-4 flex justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold">
                                        {editingSystemId ? t("edit_payment_system") : t("new_payment_system")}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            loadData();
                                            setShowNewSystemForm(false);
                                            setEditingSystemId(null);
                                        }}
                                        className='p-1.5 sm:p-2 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none'
                                    >
                                        <X size={14} className="text-white sm:h-4 sm:w-4" />
                                    </button>
                                </div>

                                <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                                    {/* Nom du système */}
                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-0.5 sm:mb-1`}>
                                            {t("payment_system_name")}
                                        </label>
                                        <input
                                            type="text"
                                            value={newSystem.name}
                                            onChange={(e) => handleSystemChange('name', e.target.value)}
                                            placeholder={t("payment_system_name_placeholder")}
                                            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                    </div>

                                    {/* Période de l'année scolaire */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-0.5 sm:mb-1`}>
                                                {t("school_year_start")}
                                            </label>
                                            <input
                                                type="date"
                                                min={`${DateForInputs - 1}-01-01`}
                                                max={`${DateForInputs + 1}-12-31`}
                                                value={newSystem.startDate}
                                                onChange={(e) => handleSystemChange('startDate', e.target.value)}
                                                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-0.5 sm:mb-1`}>
                                                {t("school_year_end")}
                                            </label>
                                            <input
                                                type="date"
                                                min={`${tomorrowStr}`}
                                                max={`${tomorrow.getFullYear() + 2}-12-31`}
                                                value={newSystem.endDate}
                                                onChange={(e) => handleSystemChange('endDate', e.target.value)}
                                                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>
                                    </div>

                                    {/* Frais */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-0.5 sm:mb-1`}>
                                                {t("monthly_fees")}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newSystem.monthlyFee}
                                                onChange={(e) => handleSystemChange('monthlyFee', e.target.value)}
                                                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-0.5 sm:mb-1`}>
                                                {t("registration_fees")}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newSystem.registrationFee}
                                                onChange={(e) => handleSystemChange('registrationFee', e.target.value)}
                                                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>
                                    </div>

                                    {/* Classes disponibles */}
                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium ${inputTextColor} mb-1 sm:mb-2`}>
                                            {t("concerned_classes")}
                                        </label>

                                        {availableClasses.length === 0 && newSystem.classes.length === 0 ? (
                                            <div className={`p-3 sm:p-4 rounded ${inputBgColor} border ${borderColor} text-center`}>
                                                <p className={`${inputTextColor} text-xs sm:text-sm`}>
                                                    {t("all_classes_assigned")}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className={`p-3 sm:p-4 rounded ${inputBgColor} border ${borderColor} max-h-40 sm:max-h-60 overflow-y-auto`}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                                                    {/* Classes déjà sélectionnées mais qui ne sont plus disponibles */}
                                                    {newSystem.classes.filter(classId =>
                                                        !availableClasses.some(cls => cls.id === classId) &&
                                                        db?.classes?.some(cls => cls.id === classId)
                                                    ).map(classId => {
                                                        const classObj = db?.classes?.find(c => c.id === classId);
                                                        return classObj ? (
                                                            <div
                                                                key={classId}
                                                                className={`flex items-center p-1.5 sm:p-2 rounded ${cardBgColor} border ${borderColor}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={true}
                                                                    onChange={() => toggleClassSelection(classId)}
                                                                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <label className={`ml-1.5 sm:ml-2 text-xs sm:text-sm ${inputTextColor}`}>
                                                                    {getClasseName(`${classObj.level} ${classObj.name}`, language)}
                                                                </label>
                                                            </div>
                                                        ) : null;
                                                    })}

                                                    {/* Classes disponibles */}
                                                    {availableClasses.map(classObj => (
                                                        <div
                                                            key={classObj.id}
                                                            className={`flex items-center p-1.5 sm:p-2 rounded ${cardBgColor} border ${borderColor}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={newSystem.classes.includes(classObj.id)}
                                                                onChange={() => toggleClassSelection(classObj.id)}
                                                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <label className={`ml-1.5 sm:ml-2 text-xs sm:text-sm ${inputTextColor}`}>
                                                                {getClasseName(`${classObj.level} ${classObj.name}`, language)}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Récapitulatif des frais */}
                                    <div className={`p-3 sm:p-4 rounded-lg ${inputBgColor} border ${borderColor}`}>
                                        <h4 className={`text-xs sm:text-sm font-bold ${inputTextColor} mb-2 sm:mb-3`}>{t("fees_summary")}</h4>

                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>{t("monthly")}</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {Number(newSystem.monthlyFee).toLocaleString()} FCFA
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>{t("yearly")}</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {(newSystem.yearlyFee || calculateYearlyFee(
                                                        Number(newSystem.monthlyFee),
                                                        newSystem.startDate,
                                                        newSystem.endDate
                                                    )).toLocaleString()} FCFA
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${inputTextColor} text-xs sm:text-sm`}>{t("registration")}</span>
                                                <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                    {Number(newSystem.registrationFee).toLocaleString()} FCFA
                                                </span>
                                            </div>

                                            {newSystem.otherFees.length > 0 && (
                                                <div className="flex justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-gray-500">
                                                    <span className={`${inputTextColor} text-xs sm:text-sm`}>{t("additional")}</span>
                                                    <span className={`${inputTextColor} text-xs sm:text-sm font-bold`}>
                                                        {newSystem.otherFees.reduce((sum, fee) => sum + Number(fee.amount), 0).toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="flex justify-end space-x-2 sm:space-x-3 pt-1 sm:pt-2">
                                        <motion.button
                                            type="button"
                                            onClick={() => {
                                                loadData();
                                                setShowNewSystemForm(false);
                                                setEditingSystemId(null);
                                            }}
                                            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:text-white border hover:bg-red-600 border ${borderColor} ${inputTextColor}`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isLoading}
                                        >
                                            {t("cancel")}
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            onClick={handleSaveSystem}
                                            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${buttonBgColor} text-white flex items-center space-x-1 sm:space-x-2`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>{t("in_progress")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{t("save")}</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Popup de confirmation pour la suppression */}
            <ActionConfirmePopup
                isOpen={showConfirmPopup}
                onClose={() => setShowConfirmPopup(false)}
                onConfirm={handleConfirmDelete}
                title={t("confirm_deletion")}
                message={t("confirm_delete_payment_system")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
                theme={theme}
            />
        </motion.div>
    );
};

export default PayementsConfig;
