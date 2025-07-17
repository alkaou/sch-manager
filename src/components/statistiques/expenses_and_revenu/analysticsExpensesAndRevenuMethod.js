/**
 * Ce fichier contient les méthodes de calcul pour les revenus (paiements)
 * et pour la comparaison entre les dépenses et les revenus.
 */

/**
 * Regroupe les systèmes de paiement par année scolaire unique en utilisant startDate et endDate.
 * @param {Array} paymentSystems - La liste de tous les systèmes de paiement.
 * @returns {Object} - Un objet où les clés sont des identifiants d'année scolaire uniques
 * et les valeurs sont des tableaux de systèmes de paiement correspondants.
 */
const groupPaymentSystemsBySchoolYear = (paymentSystems) => {
  if (!paymentSystems || paymentSystems.length === 0) return {};

  return paymentSystems.reduce((acc, system) => {
    const yearKey = `${system.startDate}_${system.endDate}`;
    if (!acc[yearKey]) {
      acc[yearKey] = [];
    }
    acc[yearKey].push(system);
    return acc;
  }, {});
};

/**
 * Calcule le revenu total pour une année scolaire donnée (frais de scolarité et d'inscription).
 * @param {Array} paymentSystemsForYear - Les systèmes de paiement pour une année scolaire.
 * @param {Object} allPayments - L'objet contenant tous les paiements des élèves.
 * @param {Object} allRegistrationFees - L'objet contenant tous les frais d'inscription.
 * @returns {number} - Le revenu total pour l'année.
 */
const calculateRevenueForYear = (paymentSystemsForYear, allPayments, allRegistrationFees) => {
  let totalRevenue = 0;

  paymentSystemsForYear.forEach(system => {
    const monthlyFee = parseFloat(system.monthlyFee) || 0;
    const registrationFee = parseFloat(system.registrationFee) || 0;

    system.classes.forEach(classId => {
      // Calcul des revenus des frais de scolarité
      const paymentKey = `students_${system.id}_${classId}`;
      const studentsInClass = allPayments[paymentKey] || [];
      studentsInClass.forEach(student => {
        totalRevenue += (student.month_payed?.length || 0) * monthlyFee;
      });

      // Calcul des revenus des frais d'inscription
      const registrationKey = `registration_fee_${system.id}_${classId}`;
      const registrations = allRegistrationFees[registrationKey] || {};
      Object.values(registrations).forEach(isPaid => {
        if (isPaid) {
          totalRevenue += registrationFee;
        }
      });
    });
  });

  return totalRevenue;
};

/**
 * Prépare les données de revenus pour toutes les années scolaires disponibles.
 * @param {Object} database - L'objet base de données complet.
 * @returns {Array} - Un tableau d'objets représentant chaque année scolaire avec son revenu total.
 *                   Ex: [{ yearName, startDate, endDate, totalRevenue }]
 */
export const getRevenuePerSchoolYear = (database) => {
  const { paymentSystems, payments, registrationFees } = database;

  if (!paymentSystems || paymentSystems.length === 0) return [];

  const groupedSystems = groupPaymentSystemsBySchoolYear(paymentSystems);

  return Object.entries(groupedSystems).map(([yearKey, systems]) => {
    const [startDate, endDate] = yearKey.split('_');
    // Utiliser le nom du premier système comme nom représentatif pour l'année
    let systemsNames = systems.map(system => system.name).join(', ');
    const yearName = `${systemsNames}` || `Année ${startDate} - ${endDate}`;
    const createdAt = systems[0]?.createdAt;


    const totalRevenue = calculateRevenueForYear(systems, payments, registrationFees);

    return {
      id: yearKey,
      name: yearName,
      startDate,
      endDate,
      totalRevenue,
      createdAt,
    };
  });
};
