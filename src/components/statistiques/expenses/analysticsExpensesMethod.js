/**
 * Ce fichier contient toutes les méthodes de calcul et de transformation
 * des données pour les statistiques des dépenses.
 */

/**
 * Récupère et agrège les dépenses par mois pour une année scolaire donnée.
 * @param {Array} expenses - La liste de toutes les dépenses.
 * @param {Object} schoolYear - L'objet de l'année scolaire sélectionnée.
 * @returns {Array} - Un tableau d'objets { month, total, monthName, year } trié par mois.
 */
export const getMonthlyExpensesForYear = (expenses, schoolYear) => {
  if (!expenses || !schoolYear) return [];

  const yearExpenses = expenses.filter(
    (e) => e.depense_scolaire_id === schoolYear.id
  );

  const monthlyTotals = {};

  yearExpenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const monthNumber = expenseDate.getMonth() + 1; // 1-12
    const monthKey = monthNumber.toString().padStart(2, '0'); // "01", "02", etc.
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = 0;
    }
    monthlyTotals[monthKey] += parseInt(expense.amount, 10) || 0;
  });

  if (Object.keys(monthlyTotals).length === 0) return [];

  // Extraire l'année de début de l'année scolaire pour l'affichage
  const schoolYearStartDate = new Date(schoolYear.start_date);
  const schoolYearYear = schoolYearStartDate.getFullYear();

  return Object.entries(monthlyTotals)
    .map(([monthKey, total]) => {
      const monthNumber = parseInt(monthKey, 10);
      // Créer une date avec l'année scolaire pour l'affichage correct
      // const displayDate = new Date(schoolYearYear, monthNumber - 1, 1);
      
      return {
        month: `${schoolYearYear}-${monthKey}`, // Format YYYY-MM pour compatibilité
        monthKey,
        total,
        year: schoolYearYear,
        monthNumber
      };
    });
    // .sort((a, b) => a.monthNumber - b.monthNumber);
};

/**
 * Calcule le total des dépenses pour chaque année scolaire.
 * @param {Array} expenses - La liste de toutes les dépenses.
 * @param {Array} schoolYears - La liste de toutes les années scolaires.
 * @returns {Array} - Un tableau d'objets { year, total, ... } trié par année.
 */
export const getTotalExpensesPerYear = (expenses, schoolYears) => {
  if (!expenses || !schoolYears) return [];

  const sortedYears = [...schoolYears].sort((a, b) =>
    a.start_date.localeCompare(b.start_date)
  );

  return sortedYears.map((year) => {
    const yearExpenses = expenses.filter(
      (e) => e.depense_scolaire_id === year.id
    );
    const total = yearExpenses.reduce(
      (sum, e) => sum + (parseFloat(e.amount) || 0),
      0
    );
    return { ...year, total };
  });
};

/**
 * Compare les dépenses de la dernière année scolaire avec la précédente.
 * @param {Array} expenses - La liste de toutes les dépenses.
 * @param {Array} schoolYears - La liste de toutes les années scolaires.
 * @returns {Object|null} - Un objet de comparaison ou null.
 */
export const compareLastTwoYears = (expenses, schoolYears) => {
  if (!expenses || !schoolYears || schoolYears.length < 2) return null;

  const sortedYears = [...schoolYears].sort((a, b) =>
    new Date(b.start_date) - new Date(a.start_date)
  );

  const lastYear = sortedYears[0];
  const previousYear = sortedYears[1];

  const lastYearTotal = expenses
    .filter(e => e.depense_scolaire_id === lastYear.id)
    .reduce((sum, e) => sum + (parseInt(e.amount, 10) || 0), 0);

  const previousYearTotal = expenses
    .filter(e => e.depense_scolaire_id === previousYear.id)
    .reduce((sum, e) => sum + (parseInt(e.amount, 10) || 0), 0);

  const difference = lastYearTotal - previousYearTotal;
  let growthRate = 0;
  if (previousYearTotal > 0) {
    growthRate = (difference / previousYearTotal) * 100;
  } else if (lastYearTotal > 0) {
    growthRate = 100;
  }

  return {
    lastYear: { ...lastYear, total: lastYearTotal },
    previousYear: { ...previousYear, total: previousYearTotal },
    difference,
    growthRate,
  };
};

/**
 * Regroupe les dépenses par catégorie pour une année scolaire donnée.
 * @param {Array} expenses - La liste de toutes les dépenses.
 * @param {string} schoolYearId - L'ID de l'année scolaire.
 * @returns {Array} - Un tableau d'objets { name, value }.
 */
export const getExpensesByCategoryForYear = (expenses, schoolYear) => {
  if (!expenses || !schoolYear || !schoolYear.id) return [];

  const yearExpenses = expenses.filter(
    (e) => e.depense_scolaire_id === schoolYear.id
  );

  const categoryTotals = yearExpenses.reduce((acc, expense) => {
    const category = expense.category || 'uncategorized';
    const amount = parseInt(expense.amount, 10) || 0;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
};
