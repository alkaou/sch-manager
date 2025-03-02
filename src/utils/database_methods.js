// Méthode pour ajouter un nouvel étudiant
// Fonction utilitaire pour générer un identifiant unique
const generateUniqueId = () => {
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substr(2, 16);
};

const check_names_length = (name) => {
    return name.length >= 2 && name.length <= 20;
};


const saveStudent = (studentData, db) => {
    // Vérification de la présence des champs obligatoires
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
    for (let field of requiredFields) {
        if (!studentData[field]) {
            const error = new Error(`Le champ ${field} est obligatoire.`);
            error.field = field;
            error.step = "Vérification des champs obligatoires";
            throw error;
        }
    }

    // Vérification de la validité des noms (lettres, espaces et tirets autorisés, y compris les accents)
    const validNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\-\s]+$/;
    if (
        !validNameRegex.test(studentData.first_name) ||
        !validNameRegex.test(studentData.last_name)
    ) {
        const error = new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
        error.field = "first_name/last_name";
        error.step = "Validation du format des noms";
        throw error;
    }

    // Vérification du sexe (autorisé "M" ou "F")
    if (!["M", "F"].includes(studentData.sexe)) {
        const error = new Error("Le sexe doit être 'M' ou 'F'.");
        error.field = "sexe";
        error.step = "Validation du sexe";
        throw error;
    }

    // Vérification du numéro de contact des parents (doit être numérique)
    if (isNaN(studentData.parents_contact)) {
        const error = new Error("Le contact des parents doit être un nombre.");
        error.field = "parents_contact";
        error.step = "Validation du contact";
        throw error;
    }

    // Vérification de la date de naissance (doit être un timestamp valide et pas dans le futur)
    if (typeof studentData.birth_date !== "number" || studentData.birth_date > Date.now()) {
        const error = new Error("La date de naissance est invalide.");
        error.field = "birth_date";
        error.step = "Validation de la date de naissance";
        throw error;
    }

    // Vérification de la taille des noms et du contact
    let student_first_name = studentData.first_name.trim();
    let student_last_name = studentData.last_name.trim();
    let student_sure_name = studentData.sure_name.trim();
    let student_father_name = studentData.father_name.trim();
    let student_mother_name = studentData.mother_name.trim();
    let student_parents_contact = studentData.parents_contact.trim();

    if (!check_names_length(student_first_name)) {
        const error = new Error("Le prénom doit contenir entre 2 et 20 caractères.");
        error.field = "first_name";
        error.step = "Validation de la longueur du prénom";
        throw error;
    }

    if (!check_names_length(student_last_name)) {
        const error = new Error("Le nom de famille doit contenir entre 2 et 20 caractères.");
        error.field = "last_name";
        error.step = "Validation de la longueur du nom de famille";
        throw error;
    }

    if (!check_names_length(student_father_name)) {
        const error = new Error("Le nom du père doit contenir entre 2 et 20 caractères.");
        error.field = "father_name";
        error.step = "Validation de la longueur du nom du père";
        throw error;
    }

    if (!check_names_length(student_mother_name)) {
        const error = new Error("Le nom de la mère doit contenir entre 2 et 20 caractères.");
        error.field = "mother_name";
        error.step = "Validation de la longueur du nom de la mère";
        throw error;
    }

    if (!check_names_length(student_parents_contact)) {
        const error = new Error("Le contact des parents doit contenir entre 2 et 20 caractères.");
        error.field = "parents_contact";
        error.step = "Validation de la longueur du contact";
        throw error;
    }

    if (student_sure_name.length > 20) {
        const error = new Error("Le surnom ne doit pas dépasser 20 caractères.");
        error.field = "sure_name";
        error.step = "Validation de la longueur du surnom";
        throw error;
    }

    // --- Gestion du matricule (champ non obligatoire) ---
    // S'il est fourni, il doit être composé uniquement de lettres et chiffres,
    // avoir une longueur comprise entre 6 et 10 caractères, et être unique dans la base.
    let matricule = "";
    if (studentData.matricule && studentData.matricule.trim() !== "") {
        matricule = studentData.matricule.trim();
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
        // Vérifier l'unicité dans la base
        if (db.students) {
            const duplicate = db.students.find(student => student.matricule === matricule);
            if (duplicate) {
                const error = new Error("Ce matricule existe déjà.");
                error.field = "matricule";
                error.step = "Validation d'unicité du matricule";
                throw error;
            }
        }
    }

    // Création de l'objet étudiant
    const timestamp = Date.now();
    const student_first_name_clean = student_first_name;
    const student_last_name_clean = student_last_name;
    const student_sure_name_clean = student_sure_name;
    const student_name_complete = `${student_first_name_clean} ${student_sure_name_clean} ${student_last_name_clean}`.replace(/\s+/g, " ");

    const newStudent = {
        id: generateUniqueId(),
        name_complet: student_name_complete,
        first_name: student_first_name_clean,
        sure_name: student_sure_name_clean,
        last_name: student_last_name_clean,
        classe: studentData.classe,
        sexe: studentData.sexe,
        birth_date: studentData.birth_date,
        father_name: student_father_name,
        mother_name: student_mother_name,
        parents_contact: student_parents_contact,
        matricule: matricule, // champ matricule ajouté ici (vide si non fourni)
        status: "actif",
        added_at: timestamp,
        updated_at: timestamp
    };

    // S'assurer que la propriété "students" existe dans la base de données
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

    // Exemple de validations sur les champs modifiables
    if (updatedData.first_name && !/^[a-zA-ZÀ-ÖØ-öø-ÿ\-\s]+$/.test(updatedData.first_name)) {
        throw new Error("Le prénom est invalide.");
    }
    if (updatedData.sure_name && !/^[a-zA-ZÀ-ÖØ-öø-ÿ\-\s]+$/.test(updatedData.sure_name)) {
        throw new Error("Le nom est invalide.");
    }
    if (updatedData.sexe && !["M", "F"].includes(updatedData.sexe)) {
        throw new Error("Le sexe doit être 'M' ou 'F'.");
    }
    if (updatedData.parents_contact && isNaN(updatedData.parents_contact)) {
        throw new Error("Le contact des parents doit être un nombre.");
    }
    if (updatedData.birth_date && (typeof updatedData.birth_date !== "number" || updatedData.birth_date > Date.now())) {
        throw new Error("La date de naissance est invalide.");
    }

    // Mise à jour de l'étudiant
    const updatedStudent = {
        ...student,
        ...updatedData,
        updated_at: Date.now()
    };

    // Recalculer le nom complet si l'un des noms a été mis à jour
    if (updatedData.first_name || updatedData.sure_name) {
        updatedStudent.name_complet = `${updatedStudent.first_name} ${updatedStudent.sure_name}`;
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
const activateStudent = (studentId, db) => {
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
        })
        .catch((err) => {
            console.error("Erreur lors de l'activation de l'étudiant :", err);
        });
};

// Méthode pour désactiver un étudiant (passer son status à "inactif")
const deactivateStudent = (studentId) => {
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
        })
        .catch((err) => {
            console.error("Erreur lors de la désactivation de l'étudiant :", err);
        });
};

// Méthode pour supprimer un étudiant
const deleteStudent = (studentId) => {
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
        })
        .catch((err) => {
            console.error("Erreur lors de la suppression de l'étudiant :", err);
        });
};

export { generateUniqueId, saveStudent, updateStudent, activateStudent, deactivateStudent, deleteStudent };