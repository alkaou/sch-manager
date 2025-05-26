/**
 * Utilitaires pour la gestion des années scolaires
 * L'année scolaire commence le 1er octobre
 */

/**
 * Calcule l'année scolaire actuelle basée sur la date courante
 * @returns {string} Format "YYYY-YYYY" (ex: "2024-2025")
 */
export const getCurrentSchoolYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11 (janvier = 0)
  
  // Si nous sommes avant octobre (mois 9), nous sommes encore dans l'année scolaire précédente
  if (currentMonth < 7) {
    return `${currentYear - 1}-${currentYear}`;
  } else {
    return `${currentYear}-${currentYear + 1}`;
  }
};

/**
 * Vérifie si une date donnée appartient à une année scolaire spécifique
 * @param {Date|number} date - Date à vérifier
 * @param {string} schoolYear - Année scolaire au format "YYYY-YYYY"
 * @returns {boolean}
 */
export const isDateInSchoolYear = (date, schoolYear) => {
  const dateObj = new Date(date);
  const [startYear, endYear] = schoolYear.split('-').map(Number);
  
  const schoolYearStart = new Date(startYear, 9, 1); // 1er octobre
  const schoolYearEnd = new Date(endYear, 8, 30); // 30 septembre
  
  return dateObj >= schoolYearStart && dateObj <= schoolYearEnd;
};

/**
 * Génère la liste des années scolaires disponibles
 * @param {number} yearsBack - Nombre d'années en arrière à inclure
 * @returns {string[]} Liste des années scolaires
 */
export const getAvailableSchoolYears = (yearsBack = 5) => {
  const currentSchoolYear = getCurrentSchoolYear();
  const [currentStartYear] = currentSchoolYear.split('-').map(Number);
  
  const years = [];
  for (let i = 0; i <= yearsBack; i++) {
    const startYear = currentStartYear - i;
    years.push(`${startYear}-${startYear + 1}`);
  }
  
  return years;
};