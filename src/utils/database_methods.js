import { getFormattedDateTime, getDateTime } from './helpers.js';

// Fonction pour générer un identifiant unique
const generateUniqueId = () => {
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substr(2, 16);
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
                duration: 5000,  // durée d’affichage en ms
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
            console.log("Étudiant mis à jour avec succès :", updatedStudent);
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
            console.log("Étudiant activé avec succès :", db.students[studentIndex]);
            setFlashMessage({
                message: "Étudiant activé avec succès.",
                type: "success", // 'success', 'error', 'warning' ou 'info'
                duration: 5000,  // durée d’affichage en ms
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
            console.log("Étudiant désactivé avec succès :", db.students[studentIndex]);
            setFlashMessage({
                message: "Étudiant désactivé avec succès.",
                type: "success", // 'success', 'error', 'warning' ou 'info'
                duration: 5000,  // durée d’affichage en ms
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
            console.log("Étudiant supprimé avec succès :", removedStudent);
            setFlashMessage({
                message: "La suppression a été passée avec succès.",
                type: "success", // 'success', 'error', 'warning' ou 'info'
                duration: 5000,  // durée d’affichage en ms
            });

        })
        .catch((err) => {
            console.error("Erreur lors de la suppression de l'étudiant :", err);
        });
};

export { generateUniqueId, saveStudent, updateStudent, activateStudent, deactivateStudent, deleteStudent, updateDatabaseNameAndShortName };
