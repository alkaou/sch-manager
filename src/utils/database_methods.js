import { getFormattedDateTime, getDateTime } from './helpers';

// Fonction pour générer un identifiant unique
const generateUniqueId = () => {
	if (crypto && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return Math.random().string(36).substr(2, 16);
};

const check_names_length = (name) => {
	return name.length >= 2 && name.length <= 20;
};

const updateDatabaseNameAndShortName = (
	newName,
	newShortName,
	setError,
	setFlashMessage,
	live_language,
	setIsEditing,
	db
) => {
	// Suppression des espaces en début/fin
	const name = newName.trim();
	const shortName = newShortName.trim();

	// Expression régulière de validation commune
	const validRegex = /^[a-zA-Z0-9-_]+$/;

	// Vérification : le shortName ne doit pas être vide
	if (!shortName) {
		setError(live_language.error_empty_short || "Le short name ne peut pas être vide.");
		return;
	}

	// Vérification : le name ne doit pas être vide
	if (!name) {
		setError(live_language.error_empty || "Le nom ne peut pas être vide.");
		return;
	}

	// Vérification de la longueur du shortName (entre 2 et 10 caractères)
	if (shortName.length < 2) {
		setError(live_language.error_minLength_short || "Le short name doit contenir au moins 2 caractères.");
		return;
	}
	if (shortName.length > 10) {
		setError(live_language.error_maxLength_short || "Le short name ne peut contenir plus de 10 caractères.");
		return;
	}

	// Vérification de la longueur du name (maximum 45 caractères)
	if (name.length > 45) {
		setError(live_language.error_maxLength_name || "Le nom ne peut contenir plus de 45 caractères.");
		return;
	}

	// Vérification des caractères valides pour name et shortName
	if (!validRegex.test(name)) {
		setError(live_language.error_invalidChars || "Le nom contient des caractères invalides.");
		return;
	}
	if (!validRegex.test(shortName)) {
		setError(live_language.error_invalidChars || "Le short name contient des caractères invalides.");
		return;
	}

	// Formatage du shortName en majuscules
	const formattedShortName = shortName.toUpperCase();

	// Suppression de l'erreur éventuelle
	setError("");

	// Récupération des dates pour la mise à jour
	const updated_hour = getFormattedDateTime();
	const updated_date = getDateTime();

	const date = updated_date.dateTime;
	const hour = updated_hour.formattedTime;

	// Préparation de l'objet mis à jour
	const updatedDb = {
		...db,
		name,
		short_name: formattedShortName,
		updated_at: date,
		updated_time: hour,
	};

	// Sauvegarde de la base de données avec feedback utilisateur
	window.electron
		.saveDatabase(updatedDb)
		.then(() => {
			setIsEditing(false);
			setFlashMessage({
				message: live_language.updated_db_message || "Base de données mise à jour !",
				type: "success", // 'success', 'error', 'warning' ou 'info'
				duration: 5000,  // durée d'affichage en ms
			});
		})
		.catch((err) => {
			console.error("Erreur lors de la mise à jour de la base de données :", err);
		});
};

const validateAndCleanStudentData = (studentData, requireAllFields = true) => {
	const validNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\-\s]+$/;
	const requiredFields = [
		"first_name",
		"last_name",
		"classe",
		"sexe",
		"birth_date",
		"birth_place",
		"father_name",
		"mother_name",
		"parents_contact"
	];
	const cleanedData = {};

	if (requireAllFields) {
		for (let field of requiredFields) {
			if (!studentData[field]) {
				const error = new Error(`Le champ ${field} est obligatoire.`);
				error.field = field;
				error.step = "Vérification des champs obligatoires";
				throw error;
			}
		}
	}

	// Valider et nettoyer first_name
	if (studentData.first_name) {
		const val = studentData.first_name.trim();
		if (!validNameRegex.test(val)) {
			const error = new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
			error.field = "first_name";
			error.step = "Validation du format du prénom";
			throw error;
		}
		if (!check_names_length(val)) {
			const error = new Error("Le prénom doit contenir entre 2 et 20 caractères.");
			error.field = "first_name";
			error.step = "Validation de la longueur du prénom";
			throw error;
		}
		cleanedData.first_name = val;
	}

	// Valider et nettoyer last_name
	if (studentData.last_name) {
		const val = studentData.last_name.trim();
		if (!validNameRegex.test(val)) {
			const error = new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
			error.field = "last_name";
			error.step = "Validation du format du nom de famille";
			throw error;
		}
		if (!check_names_length(val)) {
			const error = new Error("Le nom de famille doit contenir entre 2 et 20 caractères.");
			error.field = "last_name";
			error.step = "Validation de la longueur du nom de famille";
			throw error;
		}
		cleanedData.last_name = val;
	}

	// Valider et nettoyer birth_place
	if (studentData.birth_place) {
		const val = studentData.birth_place.trim();
		if (!validNameRegex.test(val)) {
			const error = new Error("Le lieu de naissance doit contenir uniquement des lettres, espaces ou tirets.");
			error.field = "birth_place";
			error.step = "Validation du format du lieu de naissance";
			throw error;
		}
		if (val.length < 2 || val.length > 25) {
			const error = new Error("Le lieu de naissance doit contenir entre 2 et 25 caractères.");
			error.field = "birth_place";
			error.step = "Validation de la longueur du lieu de naissance";
			throw error;
		}
		cleanedData.birth_place = val;
	}

	// Valider et nettoyer sure_name (optionnel)
	if (studentData.sure_name) {
		const val = studentData.sure_name.trim();
		if (val.length > 20) {
			const error = new Error("Le surnom ne doit pas dépasser 20 caractères.");
			error.field = "sure_name";
			error.step = "Validation de la longueur du surnom";
			throw error;
		}
		cleanedData.sure_name = val;
	} else if (requireAllFields) {
		// Pour garder la cohérence lors d'une création complète, on peut définir sure_name comme chaîne vide
		cleanedData.sure_name = "";
	}

	// Valider et nettoyer father_name
	if (studentData.father_name) {
		const val = studentData.father_name.trim();
		if (!validNameRegex.test(val)) {
			const error = new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
			error.field = "father_name";
			error.step = "Validation du format du nom du père";
			throw error;
		}
		if (!check_names_length(val)) {
			const error = new Error("Le nom du père doit contenir entre 2 et 20 caractères.");
			error.field = "father_name";
			error.step = "Validation de la longueur du nom du père";
			throw error;
		}
		cleanedData.father_name = val;
	}

	// Valider et nettoyer mother_name
	if (studentData.mother_name) {
		const val = studentData.mother_name.trim();
		if (!validNameRegex.test(val)) {
			const error = new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
			error.field = "mother_name";
			error.step = "Validation du format du nom de la mère";
			throw error;
		}
		if (!check_names_length(val)) {
			const error = new Error("Le nom de la mère doit contenir entre 2 et 20 caractères.");
			error.field = "mother_name";
			error.step = "Validation de la longueur du nom de la mère";
			throw error;
		}
		cleanedData.mother_name = val;
	}

	// Valider et nettoyer parents_contact
	if (studentData.parents_contact) {
		const val = studentData.parents_contact.toString().trim();
		if (isNaN(val)) {
			const error = new Error("Le contact des parents doit être un nombre.");
			error.field = "parents_contact";
			error.step = "Validation du contact";
			throw error;
		}
		if (!check_names_length(val)) {
			const error = new Error("Le contact des parents doit contenir entre 2 et 20 caractères.");
			error.field = "parents_contact";
			error.step = "Validation de la longueur du contact";
			throw error;
		}
		cleanedData.parents_contact = val;
	}

	// Récupérer la classe (aucune validation spécifique ici)
	if (studentData.classe) {
		cleanedData.classe = studentData.classe;
	}

	// Valider et nettoyer sexe
	if (studentData.sexe) {
		if (!["M", "F"].includes(studentData.sexe)) {
			const error = new Error("Le sexe doit être 'M' ou 'F'.");
			error.field = "sexe";
			error.step = "Validation du sexe";
			throw error;
		}
		cleanedData.sexe = studentData.sexe;
	}

	// Valider birth_date
	if (studentData.birth_date) {
		if (typeof studentData.birth_date !== "number" || studentData.birth_date > Date.now()) {
			const error = new Error("La date de naissance est invalide.");
			error.field = "birth_date";
			error.step = "Validation de la date de naissance";
			throw error;
		}
		cleanedData.birth_date = studentData.birth_date;
	}

	// Gestion du matricule (optionnel)
	if (studentData.matricule) {
		const matricule = studentData.matricule.trim();
		if (matricule !== "") {
			const validMatriculeRegex = /^[A-Za-z0-9]+$/;
			if (!validMatriculeRegex.test(matricule)) {
				const error = new Error("Le matricule doit contenir uniquement des chiffres et des lettres.");
				error.field = "matricule";
				error.step = "Validation du matricule (format)";
				throw error;
			}
			if (matricule.length < 6 || matricule.length > 10) {
				const error = new Error("Le matricule doit contenir entre 6 et 10 caractères.");
				error.field = "matricule";
				error.step = "Validation de la longueur du matricule";
				throw error;
			}
			cleanedData.matricule = matricule;
		}
	}

	return cleanedData;
};

// Méthode pour ajouter un nouvel étudiant
const saveStudent = (studentData, db) => {
	// Validation et nettoyage
	const cleanedData = validateAndCleanStudentData(studentData, true);

	// Vérification de doublon sur les autres champs
	if (db.students) {
		const duplicate = db.students.find(student =>
			student.first_name === cleanedData.first_name &&
			student.last_name === cleanedData.last_name &&
			student.classe === cleanedData.classe &&
			student.sexe === cleanedData.sexe &&
			student.birth_date === cleanedData.birth_date &&
			student.birth_place === cleanedData.birth_place &&
			student.father_name === cleanedData.father_name &&
			student.mother_name === cleanedData.mother_name &&
			student.parents_contact === cleanedData.parents_contact
		);
		if (duplicate) {
			// Doublon détecté : on quitte silencieusement
			return;
		}
	}

	// Vérification de l'unicité du matricule (s'il est renseigné)
	if (cleanedData.matricule && db.students) {
		const duplicateMatricule = db.students.find(student => student.matricule === cleanedData.matricule);
		if (duplicateMatricule) {
			const error = new Error("Le matricule est déjà utilisé.");
			error.field = "matricule";
			error.step = "Le matricule est déjà utilisé.";
			throw error;
		}
	}

	// Création de l'objet étudiant
	const timestamp = Date.now();
	// Construction du nom complet en combinant les noms (on inclut sure_name même s'il est vide)
	const student_name_complete = `${cleanedData.first_name} ${cleanedData.sure_name} ${cleanedData.last_name}`.replace(/\s+/g, " ");

	const newStudent = {
		id: generateUniqueId(),
		name_complet: student_name_complete,
		...cleanedData,
		status: "actif",
		added_at: timestamp,
		updated_at: timestamp
	};

	// Assurer l'existence de la collection students dans la base
	if (!db.students) {
		db.students = [];
	}
	db.students.push(newStudent);

	// Sauvegarde asynchrone de la base de données
	window.electron.saveDatabase(db)
		.then(() => {
			console.log("Étudiant ajouté avec succès");
		})
		.catch((err) => {
			console.error("Erreur lors de la sauvegarde de l'étudiant :", err);
		});
};

// Méthode pour modifier un étudiant existant
const updateStudent = (studentId, updatedData, db) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	const student = db.students[studentIndex];

	// Validation des données mises à jour
	const cleanedData = validateAndCleanStudentData(updatedData, true);

	// Vérification de l'unicité du matricule en cas de modification
	if (cleanedData.matricule && cleanedData.matricule !== student.matricule) {
		const duplicateMatricule = db.students.find(s => s.matricule === cleanedData.matricule);
		if (duplicateMatricule) {
			const error = new Error("Le matricule est déjà utilisé.");
			error.field = "matricule";
			error.step = "Le matricule est déjà utilisé.";
			throw error;
		}
	}

	// Mise à jour de l'étudiant en fusionnant les données existantes et les données mises à jour
	const updatedStudent = {
		...student,
		...cleanedData,
		updated_at: Date.now()
	};

	// Recalcul du nom complet si l'un des éléments de nom a été modifié
	if (cleanedData.first_name || cleanedData.sure_name || cleanedData.last_name) {
		updatedStudent.name_complet = `${updatedStudent.first_name} ${updatedStudent.sure_name || ""} ${updatedStudent.last_name}`.replace(/\s+/g, " ");
	}

	db.students[studentIndex] = updatedStudent;

	window.electron.saveDatabase(db)
		.then(() => {
			// console.log("Étudiant mis à jour avec succès :", updatedStudent);
			// console.log("Étudiant mis à jour avec succès.");
		})
		.catch((err) => {
			console.error("Erreur lors de la mise à jour de l'étudiant :", err);
		});
};

// Méthode pour activer un étudiant (passer son status à "actif")
const activateStudent = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	db.students[studentIndex].status = "actif";
	db.students[studentIndex].updated_at = Date.now();

	window.electron.saveDatabase(db)
		.then(() => {
			// console.log("Étudiant activé avec succès :", db.students[studentIndex]);
			// console.log("Étudiant activé avec succès.");
			setFlashMessage({
				message: "Étudiant activé avec succès.",
				type: "success", // 'success', 'error', 'warning' ou 'info'
				duration: 5000,  // durée d'affichage en ms
			});
		})
		.catch((err) => {
			console.error("Erreur lors de l'activation de l'étudiant :", err);
		});
};

// Méthode pour désactiver un étudiant (passer son status à "inactif")
const deactivateStudent = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	db.students[studentIndex].status = "inactif";
	db.students[studentIndex].updated_at = Date.now();

	window.electron.saveDatabase(db)
		.then(() => {
			// console.log("Étudiant désactivé avec succès :", db.students[studentIndex]);
			// console.log("Étudiant désactivé avec succès.");
			setFlashMessage({
				message: "Étudiant désactivé avec succès.",
				type: "success", // 'success', 'error', 'warning' ou 'info'
				duration: 5000,  // durée d'affichage en ms
			});
		})
		.catch((err) => {
			console.error("Erreur lors de la désactivation de l'étudiant :", err);
		});
};

// Méthode pour supprimer un étudiant
const deleteStudent = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	// Suppression de l'étudiant du tableau
	const removedStudent = db.students.splice(studentIndex, 1)[0];

	window.electron.saveDatabase(db)
		.then(() => {
			// console.log("Étudiant supprimé avec succès :", removedStudent);
			// console.log("Étudiant supprimé avec succès.");
			setFlashMessage({
				message: "La suppression a été passée avec succès.",
				type: "success", // 'success', 'error', 'warning' ou 'info'
				duration: 5000,  // durée d'affichage en ms
			});

		})
		.catch((err) => {
			console.error("Erreur lors de la suppression de l'étudiant :", err);
		});
};

// Employee Management Methods
export const savePosition = async (positionData, db, setFlashMessage = null) => {
	try {
		// If positions array doesn't exist yet, create it
		if (!db.positions) {
			db.positions = [];
		}
		
		// Check if position already exists by name
		const positionExists = db.positions.some(
			pos => pos.name.toLowerCase() === positionData.name.toLowerCase()
		);
		
		if (positionExists) {
			throw { field: "name", message: "Ce poste existe déjà" };
		}
		
		// Add the new position
		const newPosition = {
			...positionData,
			id: `pos-${Date.now()}`,
			created_at: Date.now(),
			updated_at: Date.now()
		};
		
		db.positions.push(newPosition);
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Poste ajouté avec succès",
			});
		}
		
		return newPosition;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de l'ajout du poste",
			});
		}
		throw error;
	}
};

export const updatePosition = async (positionId, positionData, db, setFlashMessage = null) => {
	try {
		// Prevent modification of Professeurs position
		const position = db.positions.find(pos => pos.id === positionId);
		if (position.name === "Professeurs" && positionData.name !== "Professeurs") {
			throw { field: "name", message: "Le poste 'Professeurs' ne peut pas être modifié" };
		}
		
		// Check if new name conflicts with existing position
		const nameConflict = db.positions.some(
			pos => pos.id !== positionId && pos.name.toLowerCase() === positionData.name.toLowerCase()
		);
		
		if (nameConflict) {
			throw { field: "name", message: "Ce nom de poste est déjà utilisé" };
		}
		
		const oldName = position.name;
		const newName = positionData.name;
		
		// Update the position
		const updatedPositions = db.positions.map(pos => {
			if (pos.id === positionId) {
				return {
					...pos,
					...positionData,
					updated_at: Date.now()
				};
			}
			return pos;
		});
		
		db.positions = updatedPositions;
		
		// Update all employees with this position to have the new position name
		if (db.employees && db.employees.length > 0 && oldName !== newName) {
			db.employees = db.employees.map(emp => {
				if (emp.postes.includes(oldName)) {
					// Replace old position name with new position name
					return {
						...emp,
						postes: emp.postes.map(poste => poste === oldName ? newName : poste),
						updated_at: Date.now()
					};
				}
				return emp;
			});
		}
		
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Poste mis à jour avec succès",
			});
		}
		
		return db.positions.find(pos => pos.id === positionId);
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de la mise à jour du poste",
			});
		}
		throw error;
	}
};

export const deletePosition = async (positionId, db, setFlashMessage = null) => {
	try {
		const position = db.positions.find(pos => pos.id === positionId);
		
		// Prevent deletion of Professeurs position
		if (position.name === "Professeurs") {
			throw { message: "Le poste 'Professeurs' ne peut pas être supprimé" };
		}
		
		// Check if any employees have this position
		// const hasEmployees = db.employees && db.employees.some(
		// 	emp => emp.postes.includes(position.name)
		// );
		
		// Update employees with this position
		if (db.employees && db.employees.length > 0) {
			// Get a list of employees to delete (those with only this position)
			// const employeesToDelete = db.employees.filter(emp => 
			// 	emp.postes.length === 1 && emp.postes[0] === position.name
			// );
			
			// Remove the position from employees with multiple positions
			db.employees = db.employees.map(emp => {
				if (emp.postes.includes(position.name) && emp.postes.length > 1) {
					// Remove this position from the employee's positions
					return {
						...emp,
						postes: emp.postes.filter(poste => poste !== position.name),
						updated_at: Date.now()
					};
				}
				return emp;
			}).filter(emp => 
				// Keep only employees that don't have only this position
				!(emp.postes.length === 1 && emp.postes[0] === position.name)
			);
		}
		
		// Delete the position
		db.positions = db.positions.filter(pos => pos.id !== positionId);
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Poste supprimé avec succès",
			});
		}
		
		return true;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de la suppression du poste",
			});
		}
		throw error;
	}
};

export const saveEmployee = async (employeeData, db, setFlashMessage = null) => {
	try {
		// If employees array doesn't exist yet, create it
		if (!db.employees) {
			db.employees = [];
		}
		
		// Generate the name_complet field
		const first_name = employeeData.first_name.trim();
		const sure_name = employeeData.sure_name?.trim() || "";
		const last_name = employeeData.last_name.trim();
		const nameComplet = [first_name, sure_name, last_name].filter(Boolean).join(" ");
		
		// Create new employee object
		const newEmployee = {
			...employeeData,
			id: `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			name_complet: nameComplet,
			status: employeeData.status || "actif",
			added_at: Date.now(),
			updated_at: Date.now()
		};
		
		db.employees.push(newEmployee);
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Employé ajouté avec succès",
			});
		}
		
		return newEmployee;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de l'ajout de l'employé",
			});
		}
		throw error;
	}
};

export const updateEmployee = async (employeeId, employeeData, db, setFlashMessage = null) => {
	try {
		// Generate the name_complet field
		const first_name = employeeData.first_name.trim();
		const sure_name = employeeData.sure_name?.trim() || "";
		const last_name = employeeData.last_name.trim();
		const nameComplet = [first_name, sure_name, last_name].filter(Boolean).join(" ");
		
		// Update the employee
		const updatedEmployees = db.employees.map(emp => {
			if (emp.id === employeeId) {
				return {
					...emp,
					...employeeData,
					name_complet: nameComplet,
					updated_at: Date.now()
				};
			}
			return emp;
		});
		
		db.employees = updatedEmployees;
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Employé mis à jour avec succès",
			});
		}
		
		return db.employees.find(emp => emp.id === employeeId);
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de la mise à jour de l'employé",
			});
		}
		throw error;
	}
};

export const deleteEmployee = async (employeeId, db, setFlashMessage = null) => {
	try {
		db.employees = db.employees.filter(emp => emp.id !== employeeId);
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Employé supprimé avec succès",
			});
		}
		
		return true;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de la suppression de l'employé",
			});
		}
		throw error;
	}
};

export const activateEmployee = async (employeeId, db, setFlashMessage = null) => {
	try {
		const updatedEmployees = db.employees.map(emp => {
			if (emp.id === employeeId) {
				return {
					...emp,
					status: "actif",
					updated_at: Date.now()
				};
			}
			return emp;
		});
		
		db.employees = updatedEmployees;
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Employé activé avec succès",
			});
		}
		
		return true;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de l'activation de l'employé",
			});
		}
		throw error;
	}
};

export const deactivateEmployee = async (employeeId, db, setFlashMessage = null) => {
	try {
		const updatedEmployees = db.employees.map(emp => {
			if (emp.id === employeeId) {
				return {
					...emp,
					status: "inactif",
					updated_at: Date.now()
				};
			}
			return emp;
		});
		
		db.employees = updatedEmployees;
		await window.electron.saveDatabase(db);
		
		if (setFlashMessage) {
			setFlashMessage({
				type: "success",
				message: "Employé désactivé avec succès",
			});
		}
		
		return true;
	} catch (error) {
		if (setFlashMessage) {
			setFlashMessage({
				type: "error",
				message: error.message || "Erreur lors de la désactivation de l'employé",
			});
		}
		throw error;
	}
};

export const initializePositions = async (db) => {
	if(!db || !db.version || !db.name || db.short_name && !db.created_at) return;
	try {
		// If positions array doesn't exist yet, create it
		if (!db.positions) {
			db.positions = [];
		}
		
		// Check if Professeurs position already exists
		const professorsExists = db.positions.some(
			pos => pos.name.toLowerCase() === "professeurs"
		);
		
		// If not, add it
		if (!professorsExists) {
			db.positions.push({
				id: `pos-${Date.now()}`,
				name: "Professeurs",
				description: "Enseignants de l'établissement.",
				created_at: Date.now(),
				updated_at: Date.now()
			});
			
			await window.electron.saveDatabase(db);
		}
		
		return db.positions;
	} catch (error) {
		console.error("Erreur lors de l'initialisation des postes:", error);
		throw error;
	}
};

// Fonctions pour gérer les snapshots et enrollments

/**
 * Détermine l'année scolaire en cours basé sur la date actuelle
 * L'année scolaire commence le 1er Octobre
 * @returns {string} - Année scolaire au format "2024-2025"
 */
const getCurrentSchoolYear = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1; // Les mois commencent à 0

	// Si on est avant Octobre, on est dans l'année scolaire précédente
	if (month < 6) {
		return `${year-1}-${year}`;
	} else {
		return `${year}-${year+1}`;
	}
};

/**
 * Crée ou met à jour le snapshot pour l'année scolaire en cours
 * @param {Object} db - La base de données
 * @returns {Object} - La base de données mise à jour
 */
const updateCurrentSnapshot = (db) => {
	if (!db.students || !db.classes) {
		return db;
	}

	const currentYear = getCurrentSchoolYear();
	
	// Initialiser les snapshots s'ils n'existent pas
	if (!db.snapshots) {
		db.snapshots = [];
	}

	// Calculer le nombre d'élèves actifs par classe, séparés par sexe
	const classCounts = {};
	let totalMalesStudents = 0;
	let totalFemalesStudents = 0;
	
	// Pour chaque classe existante dans la DB, initialiser les compteurs
	db.classes.forEach(cls => {
		const classKey = cls.name ? `${cls.level} ${cls.name}`.trim() : `${cls.level}`;
		classCounts[classKey] = {
			total: 0,
			males: 0,
			females: 0
		};
	});

	// Compter les élèves actifs par classe et par sexe
	db.students.forEach(student => {
		if (student.status === "actif") {
			const classKey = student.classe;
			
			// Si la classe n'existe pas encore dans classCounts, l'initialiser
			if (!classCounts[classKey]) {
				classCounts[classKey] = {
					total: 0,
					males: 0,
					females: 0
				};
			}
			
			// Incrémenter le total pour cette classe
			classCounts[classKey].total += 1;
			
			// Incrémenter le compteur par sexe pour cette classe
			if (student.sexe === "M") {
				classCounts[classKey].males += 1;
				totalMalesStudents += 1;
			} else if (student.sexe === "F") {
				classCounts[classKey].females += 1;
				totalFemalesStudents += 1;
			}
		}
	});

	const totalStudents = totalMalesStudents + totalFemalesStudents;

	// Vérifier si un snapshot pour l'année en cours existe déjà
	const existingSnapshotIndex = db.snapshots.findIndex(
		snapshot => snapshot.schoolYear === currentYear
	);

	if (existingSnapshotIndex >= 0) {
		// Mettre à jour le snapshot existant
		db.snapshots[existingSnapshotIndex].classCounts = classCounts;
		db.snapshots[existingSnapshotIndex].updatedAt = Date.now();
		db.snapshots[existingSnapshotIndex].totalStudents = totalStudents;
		db.snapshots[existingSnapshotIndex].totalMalesStudents = totalMalesStudents;
		db.snapshots[existingSnapshotIndex].totalFemalesStudents = totalFemalesStudents;
	} else {
		// Créer un nouveau snapshot
		db.snapshots.push({
			schoolYear: currentYear,
			classCounts: classCounts,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			totalStudents: totalStudents,
			totalMalesStudents: totalMalesStudents,
			totalFemalesStudents: totalFemalesStudents
		});
	}

	return db;
};

/**
 * Met à jour les inscriptions (enrollments) des élèves
 * @param {Object} db - La base de données
 * @param {string} actionType - Type d'action: "add", "update", "delete"
 * @param {Object} studentData - Données de l'élève concerné
 * @param {Object|null} oldData - Anciennes données en cas de mise à jour
 * @returns {Object} - La base de données mise à jour
 */
const updateEnrollments = (db, actionType, studentData, oldData = null) => {
	if (!db.enrollments) {
		db.enrollments = [];
	}

	const currentYear = getCurrentSchoolYear();
	const timestamp = new Date().toISOString();
	
	// Déterminer le status en fonction de l'action
	let status = "";
	switch (actionType) {
		case "add":
			status = "new-entry"; // Nouvelle inscription
			break;
		case "update":
			// Si la classe a changé, c'est un changement de classe
			if (oldData && oldData.classe !== studentData.classe) {
				status = "class-change";
			} 
			// Si le statut a changé de inactif à actif
			else if (oldData && oldData.status !== studentData.status && studentData.status === "actif") {
				status = "reactivated";
			}
			// Si le statut a changé d'actif à inactif
			else if (oldData && oldData.status !== studentData.status && studentData.status === "inactif") {
				status = "deactivated";
			} else {
				// Si c'est juste une mise à jour sans changement significatif pour l'inscription
				return db;
			}
			break;
		case "delete":
			status = "removed"; // Suppression de l'élève
			break;
		default:
			return db; // Si le type d'action n'est pas reconnu, ne rien faire
	}

	// Ajouter l'enrollment
	db.enrollments.push({
		studentId: studentData.id,
		studentName: studentData.name_complet,
		classId: studentData.classe,
		schoolYear: currentYear,
		status: status,
		timestamp: timestamp
	});

	// Après avoir mis à jour les enrollments, mettre à jour le snapshot
	return updateCurrentSnapshot(db);
};

// Modification des fonctions existantes pour intégrer les snapshots et enrollments

// Modification de la fonction saveStudent pour mettre à jour les enrollments et snapshots
const saveStudentWithEnrollment = (studentData, db) => {
	// Validation et nettoyage (code existant)
	const cleanedData = validateAndCleanStudentData(studentData, true);

	// Vérification de doublon sur les autres champs (code existant)
	if (db.students) {
		const duplicate = db.students.find(student =>
			student.first_name === cleanedData.first_name &&
			student.last_name === cleanedData.last_name &&
			student.classe === cleanedData.classe &&
			student.sexe === cleanedData.sexe &&
			student.birth_date === cleanedData.birth_date &&
			student.birth_place === cleanedData.birth_place &&
			student.father_name === cleanedData.father_name &&
			student.mother_name === cleanedData.mother_name &&
			student.parents_contact === cleanedData.parents_contact
		);
		if (duplicate) {
			// Doublon détecté : on quitte silencieusement
			return;
		}
	}

	// Vérification de l'unicité du matricule (code existant)
	if (cleanedData.matricule && db.students) {
		const duplicateMatricule = db.students.find(student => student.matricule === cleanedData.matricule);
		if (duplicateMatricule) {
			const error = new Error("Le matricule est déjà utilisé.");
			error.field = "matricule";
			error.step = "Le matricule est déjà utilisé.";
			throw error;
		}
	}

	// Création de l'objet étudiant (code existant)
	const timestamp = Date.now();
	const student_name_complete = `${cleanedData.first_name} ${cleanedData.sure_name} ${cleanedData.last_name}`.replace(/\s+/g, " ");

	const newStudent = {
		id: generateUniqueId(),
		name_complet: student_name_complete,
		...cleanedData,
		status: "actif",
		added_at: timestamp,
		updated_at: timestamp
	};

	// Assurer l'existence de la collection students dans la base
	if (!db.students) {
		db.students = [];
	}
	db.students.push(newStudent);

	// Mise à jour des enrollments et snapshots
	updateEnrollments(db, "add", newStudent);

	// Sauvegarde asynchrone de la base de données
	window.electron.saveDatabase(db)
		.then(() => {
			console.log("Étudiant ajouté avec succès");
		})
		.catch((err) => {
			console.error("Erreur lors de la sauvegarde de l'étudiant :", err);
		});
};

// Modification de la fonction updateStudent pour mettre à jour les enrollments et snapshots
const updateStudentWithEnrollment = (studentId, updatedData, db) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	const oldStudent = { ...db.students[studentIndex] };
	const student = db.students[studentIndex];

	// Validation des données mises à jour (code existant)
	const cleanedData = validateAndCleanStudentData(updatedData, true);

	// Vérification de l'unicité du matricule (code existant)
	if (cleanedData.matricule && cleanedData.matricule !== student.matricule) {
		const duplicateMatricule = db.students.find(s => s.matricule === cleanedData.matricule);
		if (duplicateMatricule) {
			const error = new Error("Le matricule est déjà utilisé.");
			error.field = "matricule";
			error.step = "Le matricule est déjà utilisé.";
			throw error;
		}
	}

	// Mise à jour de l'étudiant (code existant)
	const updatedStudent = {
		...student,
		...cleanedData,
		updated_at: Date.now()
	};

	// Recalcul du nom complet (code existant)
	if (cleanedData.first_name || cleanedData.sure_name || cleanedData.last_name) {
		updatedStudent.name_complet = `${updatedStudent.first_name} ${updatedStudent.sure_name || ""} ${updatedStudent.last_name}`.replace(/\s+/g, " ");
	}

	db.students[studentIndex] = updatedStudent;

	// Mise à jour des enrollments et snapshots
	updateEnrollments(db, "update", updatedStudent, oldStudent);

	window.electron.saveDatabase(db)
		.then(() => {
			// console.log("Étudiant mis à jour avec succès");
		})
		.catch((err) => {
			console.error("Erreur lors de la mise à jour de l'étudiant :", err);
		});
};

// Modification de la fonction activateStudent pour mettre à jour les enrollments et snapshots
const activateStudentWithEnrollment = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	const oldStudent = { ...db.students[studentIndex] };
	db.students[studentIndex].status = "actif";
	db.students[studentIndex].updated_at = Date.now();

	// Mise à jour des enrollments et snapshots
	updateEnrollments(db, "update", db.students[studentIndex], oldStudent);

	window.electron.saveDatabase(db)
		.then(() => {
			setFlashMessage({
				message: "Étudiant activé avec succès.",
				type: "success",
				duration: 5000,
			});
		})
		.catch((err) => {
			console.error("Erreur lors de l'activation de l'étudiant :", err);
		});
};

// Modification de la fonction deactivateStudent pour mettre à jour les enrollments et snapshots
const deactivateStudentWithEnrollment = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	const oldStudent = { ...db.students[studentIndex] };
	db.students[studentIndex].status = "inactif";
	db.students[studentIndex].updated_at = Date.now();

	// Mise à jour des enrollments et snapshots
	updateEnrollments(db, "update", db.students[studentIndex], oldStudent);

	window.electron.saveDatabase(db)
		.then(() => {
			setFlashMessage({
				message: "Étudiant désactivé avec succès.",
				type: "success",
				duration: 5000,
			});
		})
		.catch((err) => {
			console.error("Erreur lors de la désactivation de l'étudiant :", err);
		});
};

// Modification de la fonction deleteStudent pour mettre à jour les enrollments et snapshots
const deleteStudentWithEnrollment = (studentId, db, setFlashMessage) => {
	if (!db.students || db.students.length === 0) {
		throw new Error("Aucun étudiant n'est enregistré.");
	}

	const studentIndex = db.students.findIndex(student => student.id === studentId);
	if (studentIndex === -1) {
		throw new Error("Étudiant non trouvé.");
	}

	// Garder une copie de l'étudiant avant suppression
	const removedStudent = { ...db.students[studentIndex] };
	
	// Suppression de l'étudiant du tableau
	db.students.splice(studentIndex, 1);

	// Mise à jour des enrollments et snapshots
	updateEnrollments(db, "delete", removedStudent);

	window.electron.saveDatabase(db)
		.then(() => {
			setFlashMessage({
				message: "La suppression a été passée avec succès.",
				type: "success",
				duration: 5000,
			});
		})
		.catch((err) => {
			console.error("Erreur lors de la suppression de l'étudiant :", err);
		});
};

// Générer un rapport d'évolution des effectifs par année scolaire
const generateEnrollmentReport = (db) => {
	if (!db.snapshots || db.snapshots.length === 0) {
		return {
			years: [],
			totalsByYear: {},
			malesByYear: {},
			femalesByYear: {},
			classesByYear: {},
			evolution: { 
				absolute: 0, 
				percentage: 0,
				males: { absolute: 0, percentage: 0 },
				females: { absolute: 0, percentage: 0 }
			},
			genderRatio: {}
		};
	}

	// Trier les snapshots par année scolaire
	const sortedSnapshots = [...db.snapshots].sort((a, b) => {
		const yearA = parseInt(a.schoolYear.split('-')[0]);
		const yearB = parseInt(b.schoolYear.split('-')[0]);
		return yearA - yearB;
	});

	// Extraire les années scolaires
	const years = sortedSnapshots.map(snapshot => snapshot.schoolYear);
	
	// Calculer les totaux par année
	const totalsByYear = {};
	const malesByYear = {};
	const femalesByYear = {};
	const genderRatio = {};

	sortedSnapshots.forEach(snapshot => {
		totalsByYear[snapshot.schoolYear] = snapshot.totalStudents;
		malesByYear[snapshot.schoolYear] = snapshot.totalMalesStudents || 0;
		femalesByYear[snapshot.schoolYear] = snapshot.totalFemalesStudents || 0;
		
		// Calculer le ratio filles/garçons pour chaque année
		const total = snapshot.totalStudents > 0 ? snapshot.totalStudents : 1; // Éviter division par zéro
		genderRatio[snapshot.schoolYear] = {
			males: Math.round((snapshot.totalMalesStudents || 0) / total * 100),
			females: Math.round((snapshot.totalFemalesStudents || 0) / total * 100)
		};
	});

	// Organiser les données de classe par année
	const classesByYear = {};
	sortedSnapshots.forEach(snapshot => {
		classesByYear[snapshot.schoolYear] = snapshot.classCounts;
	});

	// Calculer l'évolution entre la première et la dernière année
	let evolution = { 
		absolute: 0, 
		percentage: 0,
		males: { absolute: 0, percentage: 0 },
		females: { absolute: 0, percentage: 0 }
	};
	
	if (sortedSnapshots.length >= 2) {
		const firstYear = sortedSnapshots[0];
		const lastYear = sortedSnapshots[sortedSnapshots.length - 1];
		
		// Évolution globale
		evolution.absolute = lastYear.totalStudents - firstYear.totalStudents;
		evolution.percentage = firstYear.totalStudents > 0 
			? Math.round((evolution.absolute / firstYear.totalStudents) * 100) 
			: 0;
		
		// Évolution garçons
		const firstYearMales = firstYear.totalMalesStudents || 0;
		const lastYearMales = lastYear.totalMalesStudents || 0;
		evolution.males.absolute = lastYearMales - firstYearMales;
		evolution.males.percentage = firstYearMales > 0
			? Math.round((evolution.males.absolute / firstYearMales) * 100)
			: 0;
		
		// Évolution filles
		const firstYearFemales = firstYear.totalFemalesStudents || 0;
		const lastYearFemales = lastYear.totalFemalesStudents || 0;
		evolution.females.absolute = lastYearFemales - firstYearFemales;
		evolution.females.percentage = firstYearFemales > 0
			? Math.round((evolution.females.absolute / firstYearFemales) * 100)
			: 0;
	}

	return {
		years,
		totalsByYear,
		malesByYear,
		femalesByYear,
		classesByYear,
		evolution,
		genderRatio
	};
};

export { 
	generateUniqueId, 
	saveStudent, updateStudent, activateStudent, deactivateStudent, deleteStudent, 
	updateDatabaseNameAndShortName,
	// Nouvelles fonctions
	getCurrentSchoolYear,
	updateCurrentSnapshot,
	updateEnrollments,
	saveStudentWithEnrollment,
	updateStudentWithEnrollment,
	activateStudentWithEnrollment,
	deactivateStudentWithEnrollment,
	deleteStudentWithEnrollment,
	generateEnrollmentReport
};