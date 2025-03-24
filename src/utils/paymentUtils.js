/**
 * Gets classes that have a payment system assigned
 * @param {Array} classes - All classes in the database
 * @param {Array} paymentSystems - All payment systems in the database
 * @returns {Array} - Classes with payment systems
 */
export const getClassesWithPaymentSystems = (classes, paymentSystems) => {
  if (!classes || !paymentSystems || !Array.isArray(classes) || !Array.isArray(paymentSystems)) {
    return [];
  }
  
  // Get all class IDs that are in any payment system
  const classIdsWithPayment = new Set();
  paymentSystems.forEach(system => {
    if (system.classes && Array.isArray(system.classes)) {
      system.classes.forEach(classId => classIdsWithPayment.add(classId));
    }
  });
  
  // Filter classes to only include those with payment systems
  return classes.filter(cls => classIdsWithPayment.has(cls.id));
};

/**
 * Checks if there are any payment systems configured
 * @param {Array} paymentSystems - All payment systems in the database
 * @returns {Boolean} - True if there are payment systems
 */
export const hasPaymentSystems = (paymentSystems) => {
  return Array.isArray(paymentSystems) && paymentSystems.length > 0;
};