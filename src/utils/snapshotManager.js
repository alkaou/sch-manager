import { getCurrentSchoolYear } from './schoolYear.js';

/**
 * Gestionnaire automatisé des snapshots d'effectifs
 * Génère des instantanés des effectifs par classe et année scolaire
 */

/**
 * Génère un snapshot des effectifs pour une année scolaire donnée
 * @param {object} db - Base de données
 * @param {string} schoolYear - Année scolaire (optionnel, par défaut l'année courante)
 * @returns {object} Snapshot des effectifs
 */
const generateSnapshot = (db, schoolYear = null) => {
  const targetSchoolYear = schoolYear || getCurrentSchoolYear();
  
  if (!db.students || !db.classes) {
    console.log("Impossible de générer un snapshot : pas d'étudiants ou de classes dans la base de données");
    return null;
  }

  // Filtrer les étudiants actifs
  const activeStudents = db.students.filter(student => student.status === 'actif');
  // console.log(`Génération du snapshot pour ${targetSchoolYear} avec ${activeStudents.length} étudiants actifs`);
  
  // Grouper par classe
  const classCounts = {};
  
  // Initialiser les compteurs pour toutes les classes
  db.classes.forEach(classe => {
    classCounts[classe.id] = {
      classId: classe.id,
      className: classe.name,
      level: classe.level,
      total: 0,
      male: 0,
      female: 0,
      students: []
    };
  });

  // Compter les étudiants par classe en utilisant la formule exacte
  activeStudents.forEach(student => {
    // Trouver la classe correspondante en utilisant la formule fournie
    const matchingClass = db.classes.find(classe => {
      const classeFullName = `${classe.level}${classe.name ? ' ' + classe.name : ''}`.trim();
      const matches = student.classe === classeFullName;
      return matches;
    });
    
    if (matchingClass && classCounts[matchingClass.id]) {
      classCounts[matchingClass.id].total++;
      if (student.sexe === 'M') {
        classCounts[matchingClass.id].male++;
      } else if (student.sexe === 'F') {
        classCounts[matchingClass.id].female++;
      }
      classCounts[matchingClass.id].students.push({
        id: student.id,
        name: student.name_complet,
        sexe: student.sexe
      });
    } else {
      // Log pour déboguer si des étudiants ne sont pas associés à une classe
      console.log(`Étudiant sans classe correspondante: ${student.name_complet}, classe: ${student.classe}`);
    }
  });

  // Calculer les totaux généraux
  const totalCounts = Object.values(classCounts).reduce(
    (acc, classData) => ({
      total: acc.total + classData.total,
      male: acc.male + classData.male,
      female: acc.female + classData.female
    }),
    { total: 0, male: 0, female: 0 }
  );

  // console.log(`Snapshot généré avec ${totalCounts.total} étudiants au total (${totalCounts.male} garçons, ${totalCounts.female} filles)`);

  return {
    id: `snapshot_${targetSchoolYear}_${Date.now()}`,
    schoolYear: targetSchoolYear,
    timestamp: new Date().toISOString(),
    createdAt: Date.now(),
    summary: {
      totalStudents: totalCounts.total,
      totalMale: totalCounts.male,
      totalFemale: totalCounts.female,
      totalClasses: Object.keys(classCounts).length
    },
    classCounts: Object.values(classCounts),
    metadata: {
      generatedBy: 'auto-snapshot',
      version: '1.0'
    }
  };
};

/**
 * Met à jour ou crée un snapshot pour l'année scolaire courante
 * @param {object} db - Base de données
 */
export const updateCurrentSnapshot = async (db) => {
  try {
    // Initialiser les snapshots si nécessaire
    if (!db.snapshots) {
      db.snapshots = [];
    }

    const currentSchoolYear = getCurrentSchoolYear();
    
    // Vérifier si un snapshot existe déjà pour l'année scolaire en cours
    const existingSnapshotIndex = db.snapshots.findIndex(
      snapshot => snapshot.schoolYear === currentSchoolYear
    );
    
    // Générer un nouveau snapshot avec les données actuelles
    const newSnapshotData = generateSnapshot(db, currentSchoolYear);
    if (!newSnapshotData) {
      return false;
    }
    
    // Si un snapshot pour cette année existe déjà, mettre à jour ses données
    // Sinon, créer un nouveau snapshot
    if (existingSnapshotIndex !== -1) {
      // Préserver l'ID et la date de création originale
      const originalSnapshot = db.snapshots[existingSnapshotIndex];
      db.snapshots[existingSnapshotIndex] = {
        ...newSnapshotData,
        id: originalSnapshot.id,
        createdAt: originalSnapshot.createdAt
      };
      // console.log(`Snapshot mis à jour pour l'année ${currentSchoolYear} le ${new Date().toLocaleDateString()}`);
    } else {
      // Créer un nouveau snapshot
      db.snapshots.push(newSnapshotData);
      // console.log(`Nouveau snapshot créé pour l'année ${currentSchoolYear} le ${new Date().toLocaleDateString()}`);
    }
    
    // Sauvegarder la base de données
    await window.electron.saveDatabase(db);
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du snapshot:', error);
    throw error;
  }
};

/**
 * Génère des snapshots pour toutes les années scolaires disponibles
 * @param {object} db - Base de données
 */
export const generateHistoricalSnapshots = async (db) => {
  try {
    if (!db.snapshots) {
      db.snapshots = [];
    }

    // Cette fonction peut être utilisée pour générer des snapshots historiques
    // basés sur les données d'enrollment existantes
    const currentSchoolYear = getCurrentSchoolYear();
    
    // Pour l'instant, on ne génère que le snapshot actuel
    await updateCurrentSnapshot(db);
    
    // console.log('Snapshots historiques générés');
  } catch (error) {
    console.error('Erreur lors de la génération des snapshots historiques:', error);
  }
};

/**
 * Calcule l'évolution des effectifs entre deux années scolaires
 * @param {object} db - Base de données
 * @param {string} currentYear - Année scolaire actuelle
 * @param {string} previousYear - Année scolaire précédente
 * @returns {object} Données d'évolution
 */
export const calculateEnrollmentEvolution = (db, currentYear, previousYear) => {
  if (!db.snapshots) {
    return null;
  }

  const currentSnapshot = db.snapshots.find(s => s.schoolYear === currentYear);
  const previousSnapshot = db.snapshots.find(s => s.schoolYear === previousYear);

  if (!currentSnapshot || !previousSnapshot) {
    return null;
  }

  const currentTotal = currentSnapshot.summary.totalStudents;
  const previousTotal = previousSnapshot.summary.totalStudents;
  
  const evolution = {
    currentYear,
    previousYear,
    currentTotal,
    previousTotal,
    difference: currentTotal - previousTotal,
    percentageChange: previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0,
    growth: currentTotal > previousTotal ? 'increase' : currentTotal < previousTotal ? 'decrease' : 'stable'
  };

  return evolution;
};

/**
 * Récupère les snapshots pour une année scolaire donnée
 * @param {array} snapshots - Tableau des snapshots
 * @param {string} schoolYear - Année scolaire
 * @returns {array} Snapshots filtrés
 */
export const getSnapshotsByYear = (snapshots, schoolYear) => {
  if (!snapshots || !Array.isArray(snapshots)) return [];
  return snapshots.filter(snapshot => snapshot.schoolYear === schoolYear);
};

/**
 * Calcule les statistiques d'enrollment pour une année donnée
 * @param {array} snapshots - Tableau des snapshots
 * @param {string} schoolYear - Année scolaire
 * @returns {object} Statistiques calculées
 */
export const calculateEnrollmentStats = (snapshots, schoolYear) => {
  if (!snapshots || !Array.isArray(snapshots)) {
    return {
      current: {
        total: 0,
        male: 0,
        female: 0,
      },
      previous: null,
      growthRate: 0,
      totalClasses: 0,
      averagePerClass: 0,
      genderRatio: { male: 0, female: 0 },
      classBreakdown: []
    };
  }

  const yearSnapshots = getSnapshotsByYear(snapshots, schoolYear);
  if (yearSnapshots.length === 0) {
    return {
      current: {
        total: 0,
        male: 0,
        female: 0,
      },
      previous: null,
      growthRate: 0,
      totalClasses: 0,
      averagePerClass: 0,
      genderRatio: { male: 0, female: 0 },
      classBreakdown: []
    };
  }

  // Prendre le snapshot le plus récent pour l'année demandée
  const latestSnapshot = yearSnapshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  
  const totalStudents = latestSnapshot.summary?.totalStudents || 0;
  const maleStudents = latestSnapshot.summary?.totalMale || 0;
  const femaleStudents = latestSnapshot.summary?.totalFemale || 0;
  const totalClasses = latestSnapshot.summary?.totalClasses || 0;

  // Calculer l'année scolaire précédente (au format "YYYY-YYYY")
  const [startYear, endYear] = schoolYear.split('-').map(Number);
  const previousSchoolYear = `${startYear-1}-${endYear-1}`;
  
  // Obtenir les données de l'année précédente
  const previousYearSnapshots = getSnapshotsByYear(snapshots, previousSchoolYear);
  let previousData = null;
  let growthRate = 0;
  
  if (previousYearSnapshots.length > 0) {
    const previousSnapshot = previousYearSnapshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    previousData = {
      total: previousSnapshot.summary?.totalStudents || 0,
      male: previousSnapshot.summary?.totalMale || 0,
      female: previousSnapshot.summary?.totalFemale || 0
    };
    
    // Calculer le taux de croissance
    if (previousData.total > 0) {
      growthRate = parseFloat(((totalStudents - previousData.total) / previousData.total * 100).toFixed(1));
    }
  }
  
  return {
    current: {
      total: totalStudents,
      male: maleStudents,
      female: femaleStudents
    },
    previous: previousData,
    growthRate,
    totalClasses,
    averagePerClass: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
    genderRatio: {
      male: totalStudents > 0 ? Math.round((maleStudents / totalStudents) * 100) : 0,
      female: totalStudents > 0 ? Math.round((femaleStudents / totalStudents) * 100) : 0
    },
    classBreakdown: latestSnapshot.classCounts || []
  };
};