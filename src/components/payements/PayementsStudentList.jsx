import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClasseName, areArraysEqual } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { useFlashNotification } from "../contexts";
import { Search, CheckCircle, XCircle, RefreshCcw, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from 'lucide-react';

const PayementsStudentList = ({
	selectedClass,
	db,
	refreshData,
	theme,
	text_color,
	system,
}) => {
	const { language } = useLanguage();
	const { setFlashMessage } = useFlashNotification();
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMonth, setSelectedMonth] = useState(1); // Default to first month
	const [paymentSystem, setPaymentSystem] = useState(null);
	const [months, setMonths] = useState([]);
	const [isYearExpired, setIsYearExpired] = useState(false);
	const [validatedPayments, setValidatedPayments] = useState([]);
	const [pendingPayments, setPendingPayments] = useState([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [expandedStudent, setExpandedStudent] = useState(null);
	const [sortBy, setSortBy] = useState('name'); // 'name', 'status'
	const [sortDirection, setSortDirection] = useState('asc');
	const [studentsWithRegistrationFee, setStudentsWithRegistrationFee] = useState({});

	// Load data when component mounts or when selectedClass/db changes
	useEffect(() => {
		if (selectedClass && db) {
			loadData();
		}
	}, [selectedClass, db]);

	// Function to load all necessary data
	const loadData = async () => {
		setLoading(true);
		try {
			// Find the payment system for this class
			// const _system = db.paymentSystems.find(sys =>
			//     sys.classes && sys.classes.includes(selectedClass.id)
			// );

			if (!system) {
				setFlashMessage({
					message: "Aucun système de paiement trouvé pour cette classe",
					type: "error",
					duration: 5000,
				});
				setLoading(false);
				return;
			}

			setPaymentSystem(system);

			// Check if school year is expired
			const endDate = new Date(system.endDate);
			const currentDate = new Date();
			const isExpired = endDate < currentDate;
			setIsYearExpired(isExpired);

			// Calculate months between start and end dates
			const startDate = new Date(system.startDate);
			const monthsArray = [];
			let currentMonth = new Date(startDate);

			while (currentMonth <= endDate) {
				monthsArray.push({
					number: monthsArray.length + 1,
					name: currentMonth.toLocaleString('fr-FR', { month: 'long' }),
					year: currentMonth.getFullYear()
				});
				currentMonth.setMonth(currentMonth.getMonth() + 1);
			}

			setMonths(monthsArray);

			// Récupérer les étudiants actifs de la classe
			const classStudents = db.students.filter(
				student => student.classe === `${selectedClass.level} ${selectedClass.name}`.trim() && student.status === "actif"
			);

			// Clé unique pour les paiements de cette classe et de ce système
			const paymentKey = `students_${system.id}_${selectedClass.id}`;
			// Récupérer les données de paiement existantes (ou tableau vide si aucune)
			let paymentData = db.payments && db.payments[paymentKey] ? db.payments[paymentKey] : [];

			// Récupérer les données des frais d'inscription
			const registrationFeeKey = `registration_fee_${system.id}_${selectedClass.id}`;
			let registrationFeeData = db.registrationFees && db.registrationFees[registrationFeeKey]
				? db.registrationFees[registrationFeeKey]
				: {};

			// Initialiser l'état des frais d'inscription
			setStudentsWithRegistrationFee(registrationFeeData);

			if (!isExpired) {
				// Recréer la liste des données de paiement en comparant avec les étudiants actuels
				const newPaymentData = classStudents.map(student => {
					// Chercher un enregistrement existant pour cet étudiant
					const existingPayment = paymentData.find(p => p.id === student.id);

					// Si aucun enregistrement n'existe, initialiser une nouvelle donnée de paiement
					if (!existingPayment) {
						return {
							...student,
							schoolar_month_number: monthsArray.length,
							month_payed: []
						};
					}
					// Si l'étudiant existe mais ses informations ont été modifiées (ex: updated_at différent)
					else if (existingPayment.updated_at !== student.updated_at) {
						return {
							...student,
							schoolar_month_number: monthsArray.length,
							month_payed: existingPayment.month_payed // conserver l'historique des paiements
						};
					}
					// Si l'enregistrement est à jour, le conserver tel quel
					else {
						return existingPayment;
					}
				});

				// On met à jour paymentData avec les données reconstruites
				const arrAreSame = areArraysEqual(paymentData, newPaymentData);

				if (!arrAreSame) {
					// console.log(arrAreSame);
					paymentData = newPaymentData;
					// Si les données ne sont pas expirées, sauvegarder les mises à jour dans la base de données
					const updatedPayments = { ...db.payments || {} };
					updatedPayments[paymentKey] = paymentData;

					const updatedDb = { ...db, payments: updatedPayments };
					await window.electron.saveDatabase(updatedDb);
					await refreshData();
				}
			}

			setStudents(paymentData);
			updatePaymentLists(paymentData, selectedMonth);

		} catch (error) {
			console.error("Error loading payment data:", error);
			setFlashMessage({
				message: "Erreur lors du chargement des données de paiement",
				type: "error",
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	// Update payment lists when selected month changes
	useEffect(() => {
		if (students.length > 0) {
			updatePaymentLists(students, selectedMonth);
		}
	}, [selectedMonth, students]);

	// Function to update validated and pending payment lists
	const updatePaymentLists = (studentsList, month) => {
		const validated = studentsList.filter(student =>
			student.month_payed && student.month_payed.includes(month.toString())
		);

		const pending = studentsList.filter(student =>
			!student.month_payed || !student.month_payed.includes(month.toString())
		);

		setValidatedPayments(validated);
		setPendingPayments(pending);
	};

	// Toggle registration fee for a student
	const toggleRegistrationFee = async (studentId) => {
		if (isYearExpired) return;

		try {
			const registrationFeeKey = `registration_fee_${paymentSystem.id}_${selectedClass.id}`;
			const updatedRegistrationFees = { ...studentsWithRegistrationFee };

			// Toggle the registration fee status for this student
			updatedRegistrationFees[studentId] = !updatedRegistrationFees[studentId];

			// Update state
			setStudentsWithRegistrationFee(updatedRegistrationFees);

			// Update database
			const updatedRegistrationFeesDb = { ...db.registrationFees || {} };
			updatedRegistrationFeesDb[registrationFeeKey] = updatedRegistrationFees;

			const updatedDb = { ...db, registrationFees: updatedRegistrationFeesDb };
			await window.electron.saveDatabase(updatedDb);
			await refreshData();

			// Show feedback
			setFlashMessage({
				message: updatedRegistrationFees[studentId]
					? "Frais d'inscription activé pour cet élève"
					: "Frais d'inscription désactivé pour cet élève",
				type: "info",
				duration: 3000,
			});
		} catch (error) {
			console.error("Error toggling registration fee:", error);
			setFlashMessage({
				message: "Erreur lors de la modification des frais d'inscription",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Handle payment validation
	const handleValidatePayment = async (student) => {
		if (isYearExpired) return;

		try {
			const updatedStudents = students.map(s => {
				if (s.id === student.id) {
					const monthPayed = s.month_payed || [];
					if (!monthPayed.includes(selectedMonth.toString())) {
						return {
							...s,
							month_payed: [...monthPayed, selectedMonth.toString()]
						};
					}
				}
				return s;
			});

			setStudents(updatedStudents);

			// Update database
			const paymentKey = `students_${paymentSystem.id}_${selectedClass.id}`;
			const updatedPayments = { ...db.payments || {} };
			updatedPayments[paymentKey] = updatedStudents;

			const updatedDb = { ...db, payments: updatedPayments };
			await window.electron.saveDatabase(updatedDb);
			await refreshData();

			updatePaymentLists(updatedStudents, selectedMonth);

			setFlashMessage({
				message: `Paiement validé pour ${student.name_complet}`,
				type: "success",
				duration: 3000,
			});
		} catch (error) {
			console.error("Error validating payment:", error);
			setFlashMessage({
				message: "Erreur lors de la validation du paiement",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Handle payment invalidation
	const handleInvalidatePayment = async (student) => {
		if (isYearExpired) return;

		try {
			const updatedStudents = students.map(s => {
				if (s.id === student.id) {
					const monthPayed = s.month_payed || [];
					return {
						...s,
						month_payed: monthPayed.filter(m => m !== selectedMonth.toString())
					};
				}
				return s;
			});

			setStudents(updatedStudents);

			// Update database
			const paymentKey = `students_${paymentSystem.id}_${selectedClass.id}`;
			const updatedPayments = { ...db.payments || {} };
			updatedPayments[paymentKey] = updatedStudents;

			const updatedDb = { ...db, payments: updatedPayments };
			await window.electron.saveDatabase(updatedDb);
			await refreshData();

			updatePaymentLists(updatedStudents, selectedMonth);

			setFlashMessage({
				message: `Paiement invalidé pour ${student.name_complet}`,
				type: "info",
				duration: 3000,
			});
		} catch (error) {
			console.error("Error invalidating payment:", error);
			setFlashMessage({
				message: "Erreur lors de l'invalidation du paiement",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Handle refresh
	const handleRefresh = async () => {
		setIsRefreshing(true);
		await refreshData();
		await loadData();
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};

	// Toggle expanded student details
	const toggleExpandStudent = (studentId) => {
		setExpandedStudent(expandedStudent === studentId ? null : studentId);
	};

	// Handle sort change
	const handleSortChange = (field) => {
		if (sortBy === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(field);
			setSortDirection('asc');
		}
	};

	// Sort students
	const sortStudents = (studentsList) => {
		return [...studentsList].sort((a, b) => {
			if (sortBy === 'name') {
				const nameA = a.name_complet.toLowerCase();
				const nameB = b.name_complet.toLowerCase();
				return sortDirection === 'asc'
					? nameA.localeCompare(nameB)
					: nameB.localeCompare(nameA);
			} else if (sortBy === 'status') {
				const statusA = a.month_payed ? a.month_payed.length : 0;
				const statusB = b.month_payed ? b.month_payed.length : 0;
				return sortDirection === 'asc'
					? statusA - statusB
					: statusB - statusA;
			}
			return 0;
		});
	};

	// Filter students by search term
	const filterStudents = (studentsList) => {
		if (!searchTerm) return studentsList;

		return studentsList.filter(student =>
			student.name_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(student.matricule && student.matricule.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	};

	// Styles based on theme
	const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
	const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
	const inputTextColor = theme === "dark" ? text_color : "text-gray-700";
	const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
	const tableHeaderBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
	const tableRowHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
	const buttonBgColor = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
	const buttonRedColor = theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600";
	const buttonGreenColor = theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600";
	const buttonGrayColor = theme === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-500 hover:bg-gray-600";
	const expiredBadgeBgColor = theme === "dark" ? "bg-red-900" : "bg-red-100";
	const expiredBadgeTextColor = theme === "dark" ? "text-red-200" : "text-red-800";

	// Get filtered and sorted students
	const filteredPendingPayments = filterStudents(sortStudents(pendingPayments));
	const filteredValidatedPayments = filterStudents(sortStudents(validatedPayments));

	// Calculate total registration fees
	const calculateTotalRegistrationFees = () => {
		if (!paymentSystem?.registrationFee) return 0;

		const studentsWithFee = Object.entries(studentsWithRegistrationFee)
			.filter(([_, shouldPay]) => shouldPay)
			.length;

		return Number(paymentSystem.registrationFee) * studentsWithFee;
	};

	// Calculate registration fees for pending students
	const calculatePendingRegistrationFees = () => {
		if (!paymentSystem?.registrationFee) return 0;

		const pendingStudentsWithFee = pendingPayments
			.filter(student => studentsWithRegistrationFee[student.id])
			.length;

		return Number(paymentSystem.registrationFee) * pendingStudentsWithFee;
	};

	// Calculate registration fees for validated students
	const calculateValidatedRegistrationFees = () => {
		if (!paymentSystem?.registrationFee) return 0;

		const validatedStudentsWithFee = validatedPayments
			.filter(student => studentsWithRegistrationFee[student.id])
			.length;

		return Number(paymentSystem.registrationFee) * validatedStudentsWithFee;
	};

	return (
		<motion.div
			className="container mx-auto"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<>
					{/* Header with class info and payment system */}
					<div className={`${cardBgColor} rounded-lg shadow-md p-4 mb-6 border ${borderColor}`}>
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
							<div>
								<h2 className={`text-2xl font-bold ${inputTextColor}`}>
									Classe: {getClasseName(`${selectedClass.level} ${selectedClass.name}`, language)}
								</h2>
								<p className={`${inputTextColor} opacity-80`}>
									Système de paiement: {paymentSystem?.name}
								</p>
								<div className="flex items-center mt-1">
									<p className={`${inputTextColor} opacity-80 mr-2`}>
										Période: {new Date(paymentSystem?.startDate).toLocaleDateString()} - {new Date(paymentSystem?.endDate).toLocaleDateString()}
									</p>
									{isYearExpired && (
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${expiredBadgeBgColor} ${expiredBadgeTextColor}`}>
											Année Scolaire Expirée
										</span>
									)}
								</div>
							</div>
							<div className="flex items-center space-x-2 mt-4 md:mt-0">
								<button
									onClick={handleRefresh}
									className={`p-2 rounded-full border ${borderColor} hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300`}
									title="Rafraîchir"
								>
									<RefreshCcw className={`${inputTextColor} ${isRefreshing ? 'animate-spin' : ''}`} size={20} />
								</button>
							</div>
						</div>

						{/* Payment details */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Frais mensuels</p>
								<p className={`${inputTextColor} text-xl font-bold`}>
									{Number(paymentSystem?.monthlyFee).toLocaleString()} FCFA
								</p>
							</div>
							{selectedMonth === 1 && paymentSystem?.registrationFee > 0 && (
								<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
									<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Frais d'inscription (nouveaux élèves)</p>
									<p className={`${inputTextColor} text-xl font-bold`}>
										{Number(paymentSystem?.registrationFee).toLocaleString()} FCFA
									</p>
								</div>
							)}
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Total élèves</p>
								<p className={`${inputTextColor} text-xl font-bold`}>
									{students.length}
								</p>
							</div>
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Paiements validés</p>
								<p className={`text-green-500 text-xl font-bold`}>
									{validatedPayments.length} / {students.length}
								</p>
							</div>
						</div>

						{/* Month selector and search */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
							<div className="flex flex-wrap gap-2">
								{months.map((month, index) => (
									<button
										key={index}
										onClick={() => setSelectedMonth(month.number)}
										className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedMonth === month.number
											? `${buttonBgColor} text-white`
											: `border ${borderColor} ${inputTextColor} ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`
											}`}
									>
										{month.name} {month.year}
									</button>
								))}
							</div>
							<div className="relative w-full md:w-64">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Search className={`${inputTextColor} opacity-50`} size={18} />
								</div>
								<input
									type="text"
									placeholder="Rechercher un élève..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className={`w-full pl-10 pr-4 py-2 rounded-lg ${inputBgColor} ${inputTextColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								/>
							</div>
						</div>
					</div>

					{/* Pending payments section */}
					<div className={`${cardBgColor} rounded-lg shadow-md p-4 mb-6 border ${borderColor}`}>
						<div className="flex justify-between items-center mb-4">
							<h3 className={`text-xl font-semibold ${inputTextColor}`}>
								Paiements en attente ({filteredPendingPayments.length})
							</h3>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => handleSortChange('name')}
									className={`flex items-center px-3 py-1 rounded text-sm ${sortBy === 'name' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
								>
									Nom
									{sortBy === 'name' && (
										sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
									)}
								</button>
								<button
									onClick={() => handleSortChange('status')}
									className={`flex items-center px-3 py-1 rounded text-sm ${sortBy === 'status' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
								>
									Statut
									{sortBy === 'status' && (
										sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
									)}
								</button>
							</div>
						</div>

						{filteredPendingPayments.length === 0 ? (
							<div className="text-center py-8">
								<CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
								<p className={`${inputTextColor} font-medium`}>Tous les paiements sont validés pour ce mois!</p>
							</div>
						) : (
							<div className="overflow-x-auto scrollbar-custom">
								<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
									<thead className={`${tableHeaderBgColor}`}>
										<tr>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Élève</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Matricule</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Statut</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Montant</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Actions</th>
										</tr>
									</thead>
									<tbody className={`${tableBgColor} divide-y divide-gray-200 dark:divide-gray-700`}>
										{filteredPendingPayments.map((student) => {
											// Calculate amount to pay (monthly fee only)
											let amountToPay = Number(paymentSystem.monthlyFee);

											// Add registration fee if applicable (first month and student should pay it)
											const shouldPayRegistrationFee = selectedMonth === 1 &&
												paymentSystem.registrationFee > 0 &&
												studentsWithRegistrationFee[student.id];

											return (
												<React.Fragment key={student.id}>
													<tr className={`${tableRowHoverBgColor} cursor-pointer`} onClick={() => toggleExpandStudent(student.id)}>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${student.sexe === 'M' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'}`}>
																	{student.name_complet.charAt(0).toUpperCase()}
																</div>
																<div className="ml-4">
																	<div className={`text-sm font-medium ${inputTextColor}`}>{student.name_complet}</div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">{student.sexe === 'M' ? 'Garçon' : 'Fille'}</div>
																</div>
															</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className={`text-sm ${inputTextColor}`}>{student.matricule || 'Non défini'}</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.month_payed && student.month_payed.length > 0
																? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
																: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
																}`}>
																{student.month_payed && student.month_payed.length > 0
																	? `${student.month_payed.length}/${student.schoolar_month_number} mois payés`
																	: 'Aucun mois payé'}
															</span>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className={`text-sm font-medium ${inputTextColor}`}>
																{amountToPay.toLocaleString()} FCFA
																{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																	<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
																		{shouldPayRegistrationFee ? (
																			<span className="text-green-500 font-medium">
																				+ {Number(paymentSystem.registrationFee).toLocaleString()} FCFA (Inscription)
																			</span>
																		) : (
																			<span className="text-gray-500">
																				Frais d'inscription non applicable
																			</span>
																		)}
																	</div>
																)}
															</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
															{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		toggleRegistrationFee(student.id);
																	}}
																	disabled={isYearExpired}
																	className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${isYearExpired ? buttonGrayColor : (studentsWithRegistrationFee[student.id] ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 hover:bg-gray-600')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2`}
																	title={studentsWithRegistrationFee[student.id] ? "Désactiver les frais d'inscription" : "Activer les frais d'inscription"}
																>
																	{studentsWithRegistrationFee[student.id] ? (
																		<><ToggleRight size={16} className="mr-1" /> Inscription</>
																	) : (
																		<><ToggleLeft size={16} className="mr-1" /> Inscription</>
																	)}
																</button>
															)}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleValidatePayment(student);
																}}
																disabled={isYearExpired}
																className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${isYearExpired ? buttonGrayColor : buttonGreenColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2`}
															>
																<CheckCircle size={16} className="mr-1" /> Valider
															</button>
														</td>
													</tr>
													<AnimatePresence>
														{expandedStudent === student.id && (
															<motion.tr
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: 'auto' }}
																exit={{ opacity: 0, height: 0 }}
																transition={{ duration: 0.3 }}
															>
																<td colSpan={5} className={`px-6 py-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																		<div>
																			<h4 className={`text-sm font-bold ${inputTextColor} mb-2`}>Informations de l'élève</h4>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Nom complet:</span> {student.name_complet}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Classe:</span> {student.classe}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Matricule:</span> {student.matricule || 'Non défini'}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Sexe:</span> {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
																			</p>
																			{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																				<p className={`text-sm ${inputTextColor} mt-2`}>
																					<span className="font-medium">Frais d'inscription:</span> {studentsWithRegistrationFee[student.id] ? 'Applicable' : 'Non applicable'}
																				</p>
																			)}
																		</div>
																		<div>
																			<h4 className={`text-sm font-bold ${inputTextColor} mb-2`}>Statut des paiements</h4>
																			<div className="flex flex-wrap gap-2">
																				{months.map((month, index) => (
																					<span
																						key={index}
																						className={`px-2 py-1 rounded-full text-xs font-medium ${student.month_payed && student.month_payed.includes(month.number.toString())
																							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																							: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
																							}`}
																					>
																						{month.name}
																					</span>
																				))}
																			</div>
																		</div>
																	</div>
																</td>
															</motion.tr>
														)}
													</AnimatePresence>
												</React.Fragment>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* Validated payments section */}
					<div className={`${cardBgColor} rounded-lg shadow-md p-4 mb-6 border ${borderColor}`}>
						<div className="flex justify-between items-center mb-4">
							<h3 className={`text-xl font-semibold ${inputTextColor}`}>
								Paiements validés ({filteredValidatedPayments.length})
							</h3>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => handleSortChange('name')}
									className={`flex items-center px-3 py-1 rounded text-sm ${sortBy === 'name' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
								>
									Nom
									{sortBy === 'name' && (
										sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
									)}
								</button>
								<button
									onClick={() => handleSortChange('status')}
									className={`flex items-center px-3 py-1 rounded text-sm ${sortBy === 'status' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
								>
									Statut
									{sortBy === 'status' && (
										sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
									)}
								</button>
							</div>
						</div>

						{filteredValidatedPayments.length === 0 ? (
							<div className="text-center py-8">
								<XCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
								<p className={`${inputTextColor} font-medium`}>Aucun paiement validé pour ce mois</p>
							</div>
						) : (
							<div className="overflow-x-auto scrollbar-custom">
								<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
									<thead className={`${tableHeaderBgColor}`}>
										<tr>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Élève</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Matricule</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Statut</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Montant</th>
											<th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${inputTextColor} uppercase tracking-wider`}>Actions</th>
										</tr>
									</thead>
									<tbody className={`${tableBgColor} divide-y divide-gray-200 dark:divide-gray-700`}>
										{filteredValidatedPayments.map((student) => {
											// Calculate amount paid (monthly fee only)
											let amountPaid = Number(paymentSystem.monthlyFee);

											// Add registration fee if applicable (first month and student should pay it)
											const shouldPayRegistrationFee = selectedMonth === 1 &&
												paymentSystem.registrationFee > 0 &&
												studentsWithRegistrationFee[student.id];

											return (
												<React.Fragment key={student.id}>
													<tr className={`${tableRowHoverBgColor} cursor-pointer`} onClick={() => toggleExpandStudent(student.id)}>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${student.sexe === 'M' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'}`}>
																	{student.name_complet.charAt(0).toUpperCase()}
																</div>
																<div className="ml-4">
																	<div className={`text-sm font-medium ${inputTextColor}`}>{student.name_complet}</div>
																	<div className="text-sm text-gray-500 dark:text-gray-400">{student.sexe === 'M' ? 'Garçon' : 'Fille'}</div>
																</div>
															</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className={`text-sm ${inputTextColor}`}>{student.matricule || 'Non défini'}</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
																{student.month_payed.length}/{student.schoolar_month_number} mois payés
															</span>
														</td>
														<td className="px-5 py-4 whitespace-nowrap">
															<div className={`text-sm font-medium ${inputTextColor}`}>
																{amountPaid.toLocaleString()} FCFA
																{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																	<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
																		{shouldPayRegistrationFee ? (
																			<span className="text-green-500 font-medium">
																				+ {Number(paymentSystem.registrationFee).toLocaleString()} FCFA (Inscription)
																			</span>
																		) : (
																			<span className="text-gray-500">
																				Frais d'inscription non applicable
																			</span>
																		)}
																	</div>
																)}
															</div>
														</td>
														<td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
															{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		toggleRegistrationFee(student.id);
																	}}
																	disabled={isYearExpired}
																	className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${isYearExpired ? buttonGrayColor : (studentsWithRegistrationFee[student.id] ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 hover:bg-gray-600')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2`}
																	title={studentsWithRegistrationFee[student.id] ? "Désactiver les frais d'inscription" : "Activer les frais d'inscription"}
																>
																	{studentsWithRegistrationFee[student.id] ? (
																		<><ToggleRight size={16} className="mr-1" /> Inscription</>
																	) : (
																		<><ToggleLeft size={16} className="mr-1" /> Inscription</>
																	)}
																</button>
															)}
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleInvalidatePayment(student);
																}}
																disabled={isYearExpired}
																className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${isYearExpired ? buttonGrayColor : buttonRedColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2`}
															>
																<XCircle size={16} className="mr-1" /> Invalider
															</button>
														</td>
													</tr>
													<AnimatePresence>
														{expandedStudent === student.id && (
															<motion.tr
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: 'auto' }}
																exit={{ opacity: 0, height: 0 }}
																transition={{ duration: 0.3 }}
															>
																<td colSpan={5} className={`px-6 py-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																		<div>
																			<h4 className={`text-sm font-bold ${inputTextColor} mb-2`}>Informations de l'élève</h4>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Nom complet:</span> {student.name_complet}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Classe:</span> {student.classe}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Matricule:</span> {student.matricule || 'Non défini'}
																			</p>
																			<p className={`text-sm ${inputTextColor}`}>
																				<span className="font-medium">Sexe:</span> {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
																			</p>
																			{selectedMonth === 1 && paymentSystem.registrationFee > 0 && (
																				<p className={`text-sm ${inputTextColor} mt-2`}>
																					<span className="font-medium">Frais d'inscription:</span> {studentsWithRegistrationFee[student.id] ? 'Applicable' : 'Non applicable'}
																				</p>
																			)}
																		</div>
																		<div>
																			<h4 className={`text-sm font-bold ${inputTextColor} mb-2`}>Statut des paiements</h4>
																			<div className="flex flex-wrap gap-2">
																				{months.map((month, index) => (
																					<span
																						key={index}
																						className={`px-2 py-1 rounded-full text-xs font-medium ${student.month_payed && student.month_payed.includes(month.number.toString())
																							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																							: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
																							}`}
																					>
																						{month.name}
																					</span>
																				))}
																			</div>
																		</div>
																	</div>
																</td>
															</motion.tr>
														)}
													</AnimatePresence>
												</React.Fragment>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* Payment summary */}
					<div className={`${cardBgColor} rounded-lg shadow-md p-4 mb-6 border ${borderColor}`}>
						<h3 className={`text-xl font-semibold ${inputTextColor} mb-4`}>
							Résumé des paiements
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Total attendu (mois courant)</p>
								<p className={`${inputTextColor} text-xl font-bold`}>
									{(Number(paymentSystem?.monthlyFee) * students.length).toLocaleString()} FCFA
								</p>
							</div>
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Total perçu (mois courant)</p>
								<p className={`text-green-500 text-xl font-bold`}>
									{(Number(paymentSystem?.monthlyFee) * validatedPayments.length).toLocaleString()} FCFA
								</p>
							</div>
							<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
								<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Reste à percevoir (mois courant)</p>
								<p className={`text-red-500 text-xl font-bold`}>
									{(Number(paymentSystem?.monthlyFee) * pendingPayments.length).toLocaleString()} FCFA
								</p>
							</div>

							{selectedMonth === 1 && paymentSystem?.registrationFee > 0 && (
								<>
									<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
										<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Total frais d'inscription attendu</p>
										<p className={`${inputTextColor} text-xl font-bold`}>
											{calculateTotalRegistrationFees().toLocaleString()} FCFA
										</p>
									</div>
									<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
										<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Total frais d'inscription perçu</p>
										<p className={`text-green-500 text-xl font-bold`}>
											{calculateValidatedRegistrationFees().toLocaleString()} FCFA
										</p>
									</div>
									<div className={`p-4 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
										<p className={`text-sm opacity-70 mb-1 ${inputTextColor}`}>Reste frais d'inscription à percevoir</p>
										<p className={`text-red-500 text-xl font-bold`}>
											{calculatePendingRegistrationFees().toLocaleString()} FCFA
										</p>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Year status */}
					{isYearExpired && (
						<div className={`${expiredBadgeBgColor} rounded-lg shadow-md p-4 mb-6 border ${borderColor}`}>
							<div className="flex items-center">
								<XCircle className={`${expiredBadgeTextColor} mr-3`} size={24} />
								<div>
									<h3 className={`text-lg font-semibold ${expiredBadgeTextColor}`}>
										Année Scolaire Expirée
									</h3>
									<p className={`${expiredBadgeTextColor} opacity-80`}>
										Cette année scolaire est terminée. Les modifications ne sont plus possibles.
									</p>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</motion.div>
	);
};

export default PayementsStudentList;