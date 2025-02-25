// Fonction utilitaire pour générer un identifiant unique
const generateUniqueId = () => {
    // Utilisation de crypto.randomUUID si disponible (retourne un UUID v4)
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Sinon, on peut utiliser une autre méthode (par exemple, un simple générateur de chaîne aléatoire)
    return Math.random().toString(36).substr(2, 16);
};

// Méthode pour ajouter un nouvel étudiant
const saveStudent = (studentData, db) => {
    // Vérification de la présence des champs obligatoires
    const requiredFields = [
        "first_name",
        "sure_name",
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
            throw new Error(`Le champ ${field} est obligatoire.`);
        }
    }

    // Vérification de la validité des noms (lettres, espaces et tirets autorisés, y compris les accents)
    const validNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\-\s]+$/;
    if (
        !validNameRegex.test(studentData.first_name) ||
        !validNameRegex.test(studentData.sure_name) ||
        !validNameRegex.test(studentData.last_name)
    ) {
        throw new Error("Les noms doivent contenir uniquement des lettres, espaces ou tirets.");
    }

    // Vérification du sexe (ici autorisé "M" ou "F")
    if (!["M", "F"].includes(studentData.sexe)) {
        throw new Error("Le sexe doit être 'M' ou 'F'.");
    }

    // Vérification du numéro de contact des parents (doit être numérique)
    if (isNaN(studentData.parents_contact)) {
        throw new Error("Le contact des parents doit être un nombre.");
    }

    // Vérification de la date de naissance (timestamp en millisecondes et ne doit pas être dans le futur)
    if (typeof studentData.birth_date !== "number" || studentData.birth_date > Date.now()) {
        throw new Error("La date de naissance est invalide.");
    }

    // Création de l'objet étudiant
    const timestamp = Date.now();
    const newStudent = {
        id: generateUniqueId(),
        // Le nom complet est constitué du prénom et du nom (vous pouvez ajuster selon votre logique)
        name_complet: `${studentData.first_name} ${studentData.sure_name}`,
        first_name: studentData.first_name,
        sure_name: studentData.sure_name,
        last_name: studentData.last_name,
        classe: studentData.classe,
        sexe: studentData.sexe,
        birth_date: studentData.birth_date,
        father_name: studentData.father_name,
        mother_name: studentData.mother_name,
        parents_contact: studentData.parents_contact,
        status: "actif", // Par défaut, un nouvel étudiant est actif
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
            // console.log("Étudiant ajouté avec succès :", newStudent);
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