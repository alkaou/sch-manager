import { getFormattedDateTime, getDateTime } from "./helpers";
import {
  handleStudentEnrollment,
  handleStudentUpdate,
  handleStudentDeletion,
} from "./enrollmentManager";
import { updateCurrentSnapshot } from "./snapshotManager";
import { translate } from "../components/employes/employes_translator";
import { translate as translateStudents } from "../components/students/students_translator";

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
    setError(
      live_language.error_empty_short || "Le short name ne peut pas être vide."
    );
    return;
  }

  // Vérification : le name ne doit pas être vide
  if (!name) {
    setError(live_language.error_empty || "Le nom ne peut pas être vide.");
    return;
  }

  // Vérification de la longueur du shortName (entre 2 et 10 caractères)
  if (shortName.length < 2) {
    setError(
      live_language.error_minLength_short ||
        "Le short name doit contenir au moins 2 caractères."
    );
    return;
  }
  if (shortName.length > 10) {
    setError(
      live_language.error_maxLength_short ||
        "Le short name ne peut contenir plus de 10 caractères."
    );
    return;
  }

  // Vérification de la longueur du name (maximum 45 caractères)
  if (name.length > 45) {
    setError(
      live_language.error_maxLength_name ||
        "Le nom ne peut contenir plus de 45 caractères."
    );
    return;
  }

  // Vérification des caractères valides pour name et shortName
  if (!validRegex.test(name)) {
    setError(
      live_language.error_invalidChars ||
        "Le nom contient des caractères invalides."
    );
    return;
  }
  if (!validRegex.test(shortName)) {
    setError(
      live_language.error_invalidChars ||
        "Le short name contient des caractères invalides."
    );
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
        message:
          live_language.updated_db_message || "Base de données mise à jour !",
        type: "success", // 'success', 'error', 'warning' ou 'info'
        duration: 5000, // durée d'affichage en ms
      });
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la mise à jour de la base de données :",
        err
      );
    });
};

const validateAndCleanStudentData = (studentData, requireAllFields = true, language) => {
  const validNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-'\-\s]+$/;
  const requiredFields = [
    "first_name",
    "last_name",
    "classe",
    "sexe",
    "birth_date",
    "birth_place",
    "father_name",
    "mother_name",
    "parents_contact",
  ];
  const cleanedData = {};

  if (requireAllFields) {
    for (let field of requiredFields) {
      if (!studentData[field]) {
        const error = new Error(`${translateStudents("field_required", language)}`);
        error.field = field;
        error.step = translateStudents("validation_required_fields", language);
        throw error;
      }
    }
  }

  // Valider et nettoyer first_name
  if (studentData.first_name) {
    const val = studentData.first_name.trim();
    if (!validNameRegex.test(val)) {
      const error = new Error(
        translateStudents("name_format_error", language)
      );
      error.field = "first_name";
      error.step = translateStudents("validation_first_name_format", language);
      throw error;
    }
    if (!check_names_length(val)) {
      const error = new Error(
        translateStudents("first_name_length_error", language)
      );
      error.field = "first_name";
      error.step = translateStudents("validation_first_name_length", language);
      throw error;
    }
    cleanedData.first_name = val;
  }

  // Valider et nettoyer last_name
  if (studentData.last_name) {
    const val = studentData.last_name.trim();
    if (!validNameRegex.test(val)) {
      const error = new Error(
        translateStudents("name_format_error", language)
      );
      error.field = "last_name";
      error.step = translateStudents("validation_last_name_format", language);
      throw error;
    }
    if (!check_names_length(val)) {
      const error = new Error(
        translateStudents("last_name_length_error", language)
      );
      error.field = "last_name";
      error.step = translateStudents("validation_last_name_length", language);
      throw error;
    }
    cleanedData.last_name = val;
  }

  // Valider et nettoyer birth_place
  if (studentData.birth_place) {
    const val = studentData.birth_place.trim();
    if (!validNameRegex.test(val)) {
      const error = new Error(
        translateStudents("birth_place_format_error", language)
      );
      error.field = "birth_place";
      error.step = translateStudents("validation_birth_place_format", language);
      throw error;
    }
    if (val.length < 2 || val.length > 25) {
      const error = new Error(
        translateStudents("birth_place_length_error", language)
      );
      error.field = "birth_place";
      error.step = translateStudents("validation_birth_place_length", language);
      throw error;
    }
    cleanedData.birth_place = val;
  }

  // Valider et nettoyer sure_name (optionnel)
  if (studentData.sure_name) {
    const val = studentData.sure_name.trim();
    if (val.length > 20) {
      const error = new Error(translateStudents("sure_name_length_error", language));
      error.field = "sure_name";
      error.step = translateStudents("validation_sure_name_length", language);
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
      const error = new Error(
        translateStudents("name_format_error", language)
      );
      error.field = "father_name";
      error.step = translateStudents("validation_father_name_format", language);
      throw error;
    }
    if (!check_names_length(val)) {
      const error = new Error(
        translateStudents("father_name_length_error", language)
      );
      error.field = "father_name";
      error.step = translateStudents("validation_father_name_length", language);
      throw error;
    }
    cleanedData.father_name = val;
  }

  // Valider et nettoyer mother_name
  if (studentData.mother_name) {
    const val = studentData.mother_name.trim();
    if (!validNameRegex.test(val)) {
      const error = new Error(
        translateStudents("name_format_error", language)
      );
      error.field = "mother_name";
      error.step = translateStudents("validation_mother_name_format", language);
      throw error;
    }
    if (!check_names_length(val)) {
      const error = new Error(
        translateStudents("mother_name_length_error", language)
      );
      error.field = "mother_name";
      error.step = translateStudents("validation_mother_name_length", language);
      throw error;
    }
    cleanedData.mother_name = val;
  }

  // Valider et nettoyer parents_contact
  if (studentData.parents_contact) {
    const val = studentData.parents_contact.toString().trim();
    if (isNaN(val)) {
      const error = new Error(translateStudents("parents_contact_number_error", language));
      error.field = "parents_contact";
      error.step = translateStudents("validation_contact", language);
      throw error;
    }
    if (!check_names_length(val)) {
      const error = new Error(
        translateStudents("parents_contact_length_error", language)
      );
      error.field = "parents_contact";
      error.step = translateStudents("validation_contact_length", language);
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
      const error = new Error(translateStudents("invalid_gender", language));
      error.field = "sexe";
      error.step = translateStudents("validation_gender", language);
      throw error;
    }
    cleanedData.sexe = studentData.sexe;
  }

  // Valider birth_date
  if (studentData.birth_date) {
    if (
      typeof studentData.birth_date !== "number" ||
      studentData.birth_date > Date.now()
    ) {
      const error = new Error(translateStudents("invalid_birth_date", language));
      error.field = "birth_date";
      error.step = translateStudents("validation_birth_date", language);
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
        const error = new Error(
          translateStudents("matricule_format_error", language)
        );
        error.field = "matricule";
        error.step = translateStudents("validation_matricule_format", language);
        throw error;
      }
      if (matricule.length < 6 || matricule.length > 10) {
        const error = new Error(
          translateStudents("matricule_length_error", language)
        );
        error.field = "matricule";
        error.step = translateStudents("validation_matricule_length", language);
        throw error;
      }
      cleanedData.matricule = matricule;
    }
  }

  return cleanedData;
};

// Méthode pour ajouter un nouvel étudiant (mise à jour)
const saveStudent = async (studentData, db, language) => {
  try {
    // Validation et nettoyage
    const cleanedData = validateAndCleanStudentData(studentData, true, language);

    // Vérification de doublon sur les autres champs
    if (db.students) {
      const duplicate = db.students.find(
        (student) =>
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
        return;
      }
    }

    // Vérification de l'unicité du matricule
    if (cleanedData.matricule && db.students) {
      const duplicateMatricule = db.students.find(
        (student) => student.matricule === cleanedData.matricule
      );
      if (duplicateMatricule) {
        const error = new Error(translateStudents("matricule_already_used", language));
        error.field = "matricule";
        error.step = translateStudents("matricule_already_used", language);
        throw error;
      }
    }

    // Création de l'objet étudiant
    const timestamp = Date.now();
    const student_name_complete =
      `${cleanedData.first_name} ${cleanedData.sure_name} ${cleanedData.last_name}`.replace(
        /\s+/g,
        " "
      );

    const newStudent = {
      id: generateUniqueId(),
      name_complet: student_name_complete,
      ...cleanedData,
      status: "actif",
      added_at: timestamp,
      updated_at: timestamp,
    };

    // Assurer l'existence de la collection students
    if (!db.students) {
      db.students = [];
    }
    db.students.push(newStudent);

    // Gérer l'enrollment pour le nouvel étudiant
    await handleStudentEnrollment(newStudent, db);

    // Mettre à jour le snapshot de l'année courante
    await updateCurrentSnapshot(db);

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(db);
    // console.log("Étudiant ajouté avec succès");
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de l'étudiant :", err);
    throw err;
  }
};

// Méthode pour modifier un étudiant existant (mise à jour)
const updateStudent = async (studentId, updatedData, db, language) => {
  try {
    if (!db.students || db.students.length === 0) {
      throw new Error(translateStudents("no_student_registered", language));
    }

    const studentIndex = db.students.findIndex(
      (student) => student.id === studentId
    );
    if (studentIndex === -1) {
      throw new Error(translateStudents("student_not_found", language));
    }

    const oldStudent = { ...db.students[studentIndex] };

    // Validation des données mises à jour
    const cleanedData = validateAndCleanStudentData(updatedData, true);

    // Vérification de l'unicité du matricule
    if (
      cleanedData.matricule &&
      cleanedData.matricule !== oldStudent.matricule
    ) {
      const duplicateMatricule = db.students.find(
        (s) => s.matricule === cleanedData.matricule
      );
      if (duplicateMatricule) {
        const error = new Error(translateStudents("matricule_already_used", language));
        error.field = "matricule";
        error.step = translateStudents("matricule_already_used", language);
        throw error;
      }
    }

    // Mise à jour de l'étudiant
    const updatedStudent = {
      ...oldStudent,
      ...cleanedData,
      updated_at: Date.now(),
    };

    // Recalcul du nom complet
    if (
      cleanedData.first_name ||
      cleanedData.sure_name ||
      cleanedData.last_name
    ) {
      updatedStudent.name_complet = `${updatedStudent.first_name} ${
        updatedStudent.sure_name || ""
      } ${updatedStudent.last_name}`.replace(/\s+/g, " ");
    }

    db.students[studentIndex] = updatedStudent;

    // Gérer la mise à jour de l'enrollment si la classe a changé ou le statut a changé
    await handleStudentUpdate(oldStudent, updatedStudent, db);

    // Mettre à jour le snapshot de l'année courante
    await updateCurrentSnapshot(db);

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(db);

    return updatedStudent;
  } catch (err) {
    console.error(translateStudents("error_updating_student", language), err);
    throw err;
  }
};

// Méthode pour supprimer un étudiant (mise à jour)
const deleteStudent = async (studentId, db, setFlashMessage, language) => {
  try {
    if (!db.students || db.students.length === 0) {
      throw new Error(translateStudents("no_student_registered", language));
    }

    const studentIndex = db.students.findIndex(
      (student) => student.id === studentId
    );
    if (studentIndex === -1) {
      throw new Error(translateStudents("student_not_found", language));
    }

    const studentToDelete = db.students[studentIndex];

    // Gérer la suppression dans les enrollments
    await handleStudentDeletion(studentToDelete, db);

    // Suppression de l'étudiant du tableau
    db.students.splice(studentIndex, 1);

    // Mettre à jour le snapshot de l'année courante
    await updateCurrentSnapshot(db);

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        message: translateStudents("deletion_success", language),
        type: "success",
        duration: 5000,
      });
    }

    return true;
  } catch (err) {
    console.error(translateStudents("error_deleting_student", language), err);
    throw err;
  }
};

// Méthode pour activer un étudiant (passer son status à "actif")
const activateStudent = async (studentId, db, setFlashMessage, language) => {
  try {
    if (!db.students || db.students.length === 0) {
      throw new Error(translateStudents("no_student_registered", language));
    }

    const studentIndex = db.students.findIndex(
      (student) => student.id === studentId
    );
    if (studentIndex === -1) {
      throw new Error(translateStudents("student_not_found", language));
    }

    // Récupérer l'ancien état pour l'enrollment
    const oldStudent = { ...db.students[studentIndex] };

    // Mise à jour de l'étudiant
    db.students[studentIndex].status = "actif";
    db.students[studentIndex].updated_at = Date.now();

    // Nouvel état pour l'enrollment
    const updatedStudent = db.students[studentIndex];

    // Gérer la mise à jour de l'enrollment
    await handleStudentUpdate(oldStudent, updatedStudent, db);

    // Mettre à jour le snapshot - s'assurer que cette fonction est appelée correctement
    await updateCurrentSnapshot(db);

    // Sauvegarder la base de données
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        message: translateStudents("activation_success", language),
        type: "success",
        duration: 5000,
      });
    }

    return true;
  } catch (err) {
    console.error(translateStudents("error_activating_student", language), err);
    throw err;
  }
};

// Méthode pour désactiver un étudiant (passer son status à "inactif")
const deactivateStudent = async (studentId, db, setFlashMessage, language) => {
  try {
    if (!db.students || db.students.length === 0) {
      throw new Error(translateStudents("no_student_registered", language));
    }

    const studentIndex = db.students.findIndex(
      (student) => student.id === studentId
    );
    if (studentIndex === -1) {
      throw new Error(translateStudents("student_not_found", language));
    }

    // Récupérer l'ancien état pour l'enrollment
    const oldStudent = { ...db.students[studentIndex] };

    // Mise à jour de l'étudiant
    db.students[studentIndex].status = "inactif";
    db.students[studentIndex].updated_at = Date.now();

    // Nouvel état pour l'enrollment
    const updatedStudent = db.students[studentIndex];

    // Gérer la mise à jour de l'enrollment
    await handleStudentUpdate(oldStudent, updatedStudent, db);

    // Mettre à jour le snapshot - s'assurer que cette fonction est appelée correctement
    await updateCurrentSnapshot(db);

    // Sauvegarder la base de données
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        message: translateStudents("deactivation_success", language),
        type: "success",
        duration: 5000,
      });
    }

    return true;
  } catch (err) {
    console.error(translateStudents("error_deactivating_student", language), err);
    throw err;
  }
};

// Employee Management Methods
export const savePosition = async (
  positionData,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    // If positions array doesn't exist yet, create it
    if (!db.positions) {
      db.positions = [];
    }

    // Check if position already exists by name
    const positionExists = db.positions.some(
      (pos) => pos.name.toLowerCase() === positionData.name.toLowerCase()
    );

    const postName = positionData.name.toLowerCase();
    const isExist =
      postName === "karamɔgɔw" || postName === "professors" ? true : false;

    if (positionExists || isExist) {
      throw {
        field: "name",
        message: translate("position_existe_yet", language),
      };
    }

    // Add the new position
    const newPosition = {
      ...positionData,
      id: `pos-${Date.now()}`,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    db.positions.push(newPosition);
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("position_added", language),
      });
    }

    return newPosition;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const updatePosition = async (
  positionId,
  positionData,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    // Prevent modification of Professeurs position
    const position = db.positions.find((pos) => pos.id === positionId);
    if (
      position.name === "Professeurs" &&
      positionData.name !== "Professeurs"
    ) {
      throw {
        field: "name",
        message: translate("professors_position_rename_error", language),
      };
    }

    // Check if new name conflicts with existing position
    const nameConflict = db.positions.some(
      (pos) =>
        pos.id !== positionId &&
        pos.name.toLowerCase() === positionData.name.toLowerCase()
    );

    if (nameConflict) {
      throw {
        field: "name",
        message: translate("position_already_exists", language),
      };
    }

    const oldName = position.name;
    const newName = positionData.name;

    // Update the position
    const updatedPositions = db.positions.map((pos) => {
      if (pos.id === positionId) {
        return {
          ...pos,
          ...positionData,
          updated_at: Date.now(),
        };
      }
      return pos;
    });

    db.positions = updatedPositions;

    // Update all employees with this position to have the new position name
    if (db.employees && db.employees.length > 0 && oldName !== newName) {
      db.employees = db.employees.map((emp) => {
        if (emp.postes.includes(oldName)) {
          // Replace old position name with new position name
          return {
            ...emp,
            postes: emp.postes.map((poste) =>
              poste === oldName ? newName : poste
            ),
            updated_at: Date.now(),
          };
        }
        return emp;
      });
    }

    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("position_updated", language),
      });
    }

    return db.positions.find((pos) => pos.id === positionId);
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const deletePosition = async (
  positionId,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    const position = db.positions.find((pos) => pos.id === positionId);

    // Prevent deletion of Professeurs position
    if (position.name === "Professeurs") {
      throw {
        message: translate("professors_position_delete_error", language),
      };
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
      db.employees = db.employees
        .map((emp) => {
          if (emp.postes.includes(position.name) && emp.postes.length > 1) {
            // Remove this position from the employee's positions
            return {
              ...emp,
              postes: emp.postes.filter((poste) => poste !== position.name),
              updated_at: Date.now(),
            };
          }
          return emp;
        })
        .filter(
          (emp) =>
            // Keep only employees that don't have only this position
            !(emp.postes.length === 1 && emp.postes[0] === position.name)
        );
    }

    // Delete the position
    db.positions = db.positions.filter((pos) => pos.id !== positionId);
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("position_deleted", language),
      });
    }

    return true;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const saveEmployee = async (
  employeeData,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    // If employees array doesn't exist yet, create it
    if (!db.employees) {
      db.employees = [];
    }

    // Generate the name_complet field
    const first_name = employeeData.first_name.trim();
    const sure_name = employeeData.sure_name?.trim() || "";
    const last_name = employeeData.last_name.trim();
    const nameComplet = [first_name, sure_name, last_name]
      .filter(Boolean)
      .join(" ");

    // Create new employee object
    const newEmployee = {
      ...employeeData,
      id: `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name_complet: nameComplet,
      status: employeeData.status || "actif",
      added_at: Date.now(),
      updated_at: Date.now(),
    };

    db.employees.push(newEmployee);
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("employee_added", language),
      });
    }

    return newEmployee;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const updateEmployee = async (
  employeeId,
  employeeData,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    // Generate the name_complet field
    const first_name = employeeData.first_name.trim();
    const sure_name = employeeData.sure_name?.trim() || "";
    const last_name = employeeData.last_name.trim();
    const nameComplet = [first_name, sure_name, last_name]
      .filter(Boolean)
      .join(" ");

    // Update the employee
    const updatedEmployees = db.employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          ...employeeData,
          name_complet: nameComplet,
          updated_at: Date.now(),
        };
      }
      return emp;
    });

    db.employees = updatedEmployees;
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("employee_updated", language),
      });
    }

    return db.employees.find((emp) => emp.id === employeeId);
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const deleteEmployee = async (
  employeeId,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    db.employees = db.employees.filter((emp) => emp.id !== employeeId);
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("employee_deleted", language),
      });
    }

    return true;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const activateEmployee = async (
  employeeId,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    const updatedEmployees = db.employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: "actif",
          updated_at: Date.now(),
        };
      }
      return emp;
    });

    db.employees = updatedEmployees;
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("employees_activated", language),
      });
    }

    return true;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const deactivateEmployee = async (
  employeeId,
  db,
  setFlashMessage = null,
  language
) => {
  try {
    const updatedEmployees = db.employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: "inactif",
          updated_at: Date.now(),
        };
      }
      return emp;
    });

    db.employees = updatedEmployees;
    await window.electron.saveDatabase(db);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("employees_deactivated", language),
      });
    }

    return true;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: translate("error_occurred", language),
      });
    }
    throw error;
  }
};

export const initializePositions = async (db) => {
  if (!db || !db.version || !db.name || (db.short_name && !db.created_at))
    return;
  try {
    // If positions array doesn't exist yet, create it
    if (!db.positions) {
      db.positions = [];
    }

    // Check if Professeurs position already exists
    const professorsExists = db.positions.some(
      (pos) => pos.name.toLowerCase() === "professeurs"
    );

    // If not, add it
    if (!professorsExists) {
      db.positions.push({
        id: `pos-${Date.now()}`,
        name: "Professeurs",
        description: "Enseignants de l'établissement.",
        created_at: Date.now(),
        updated_at: Date.now(),
      });

      await window.electron.saveDatabase(db);
    }

    return db.positions;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des postes:", error);
    throw error;
  }
};

export {
  generateUniqueId,
  saveStudent,
  updateStudent,
  activateStudent,
  deactivateStudent,
  deleteStudent,
  updateDatabaseNameAndShortName,
};
