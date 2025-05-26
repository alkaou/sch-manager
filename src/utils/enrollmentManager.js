import { getCurrentSchoolYear } from './schoolYear.js';

/**
 * Gestionnaire automatisé des enrollments
 * Suit les inscriptions et changements de classe des étudiants
 */

/**
 * Génère un ID unique pour un enrollment
 * @returns {string} ID unique
 */
const generateEnrollmentId = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `enr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Crée un nouvel enrollment
 * @param {string} studentId - ID de l'étudiant
 * @param {string} studentName - Nom complet de l'étudiant
 * @param {string} classId - ID de la classe
 * @param {string} status - Statut (new-entry, class-change, re-enrollment)
 * @param {string} schoolYear - Année scolaire
 * @returns {object} Nouvel enrollment
 */
const createEnrollment = (studentId, studentName, classId, status, schoolYear = null) => {
  return {
    id: generateEnrollmentId(),
    studentId,
    studentName,
    classId,
    schoolYear: schoolYear || getCurrentSchoolYear(),
    status, // 'new-entry', 'class-change', 're-enrollment', 'withdrawal'
    timestamp: new Date().toISOString(),
    createdAt: Date.now()
  };
};

/**
 * Met à jour les enrollments lors de l'ajout d'un étudiant
 * @param {object} student - Données de l'étudiant
 * @param {object} db - Base de données
 * @returns {Promise<void>}
 */
export const handleStudentEnrollment = async (student, db) => {
  try {
    // Initialiser les enrollments si nécessaire
    if (!db.enrollments) {
      db.enrollments = [];
    }

    const currentSchoolYear = getCurrentSchoolYear();
    
    // Vérifier si l'étudiant a déjà un enrollment pour cette année
    const existingEnrollment = db.enrollments.find(
      enr => enr.studentId === student.id && enr.schoolYear === currentSchoolYear
    );

    if (!existingEnrollment) {
      // Nouvel étudiant ou première inscription cette année
      const enrollment = createEnrollment(
        student.id,
        student.name_complet,
        student.classe,
        'new-entry',
        currentSchoolYear
      );
      
      db.enrollments.push(enrollment);
      // console.log(`Enrollment créé pour ${student.name_complet} en ${student.classe}`);
    }

    // Sauvegarder la base de données
    await window.electron.saveDatabase(db);
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'enrollment:', error);
    throw error; // Propager l'erreur pour une meilleure gestion au niveau supérieur
  }
};

/**
 * Met à jour les enrollments lors de la modification d'un étudiant
 * @param {object} oldData - Anciennes données de l'étudiant
 * @param {object} newData - Nouvelles données de l'étudiant
 * @param {object} db - Base de données
 * @returns {Promise<void>}
 */
export const handleStudentUpdate = async (oldData, newData, db) => {
  try {
    if (!db.enrollments) {
      db.enrollments = [];
    }

    const currentSchoolYear = getCurrentSchoolYear();
    const studentId = newData.id;
    
    // Vérifier si la classe a changé
    if (oldData.classe !== newData.classe) {
      const enrollment = createEnrollment(
        studentId,
        newData.name_complet,
        newData.classe,
        'class-change',
        currentSchoolYear
      );
      
      db.enrollments.push(enrollment);
      // console.log(`Changement de classe enregistré: ${newData.name_complet} de ${oldData.classe} vers ${newData.classe}`);
    }

    // Vérifier si le statut a changé (réactivation)
    if (oldData.status === 'inactif' && newData.status === 'actif') {
      const enrollment = createEnrollment(
        studentId,
        newData.name_complet,
        newData.classe,
        're-enrollment',
        currentSchoolYear
      );
      
      db.enrollments.push(enrollment);
      // console.log(`Réinscription enregistrée: ${newData.name_complet}`);
    }

    // Vérifier si l'étudiant a été désactivé
    if (oldData.status === 'actif' && newData.status === 'inactif') {
      const enrollment = createEnrollment(
        studentId,
        newData.name_complet,
        newData.classe,
        'withdrawal',
        currentSchoolYear
      );
      
      db.enrollments.push(enrollment);
      // console.log(`Retrait enregistré: ${newData.name_complet}`);
    }

    await window.electron.saveDatabase(db);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'enrollment:', error);
    throw error; // Propager l'erreur pour une meilleure gestion
  }
};

/**
 * Met à jour les enrollments lors de la suppression d'un étudiant
 * @param {object} student - Données de l'étudiant supprimé
 * @param {object} db - Base de données
 * @returns {Promise<void>}
 */
export const handleStudentDeletion = async (student, db) => {
  try {
    if (!db.enrollments) {
      db.enrollments = [];
    }

    const currentSchoolYear = getCurrentSchoolYear();
    
    const enrollment = createEnrollment(
      student.id,
      student.name_complet,
      student.classe,
      'withdrawal',
      currentSchoolYear
    );
    
    db.enrollments.push(enrollment);
    // console.log(`Suppression enregistrée: ${student.name_complet}`);

    await window.electron.saveDatabase(db);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la suppression:', error);
    throw error; // Propager l'erreur pour une meilleure gestion
  }
};

/**
 * Récupère l'historique d'enrollments pour un étudiant
 * @param {string} studentId - ID de l'étudiant
 * @param {object} db - Base de données
 * @returns {Array<object>} Historique d'enrollments
 */
export const getStudentEnrollmentHistory = (studentId, db) => {
  if (!db.enrollments) return [];
  
  return db.enrollments
    .filter(enr => enr.studentId === studentId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Récupère tous les enrollments pour une année scolaire donnée
 * @param {object} db - Base de données
 * @param {string} schoolYear - Année scolaire (optionnel)
 * @returns {Array<object>} Enrollments de l'année
 */
export const getEnrollmentsByYear = (db, schoolYear = null) => {
  if (!db.enrollments) return [];
  
  const targetYear = schoolYear || getCurrentSchoolYear();
  return db.enrollments.filter(enr => enr.schoolYear === targetYear);
};

/**
 * Calcule des statistiques d'enrollement pour l'année courante
 * @param {object} db - Base de données
 * @returns {object} Statistiques d'enrollement
 */
export const calculateEnrollmentStatistics = (db) => {
  const currentYear = getCurrentSchoolYear();
  const enrollments = getEnrollmentsByYear(db, currentYear);
  
  // Compter les différents types d'enrollements
  const stats = {
    newEntries: 0,
    classChanges: 0,
    reEnrollments: 0,
    withdrawals: 0,
    total: enrollments.length
  };
  
  enrollments.forEach(enrollment => {
    switch(enrollment.status) {
      case 'new-entry':
        stats.newEntries++;
        break;
      case 'class-change':
        stats.classChanges++;
        break;
      case 're-enrollment':
        stats.reEnrollments++;
        break;
      case 'withdrawal':
        stats.withdrawals++;
        break;
    }
  });
  
  return stats;
};