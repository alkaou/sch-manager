/**
 * Fichier command.js - Méthodes pour récupérer des données spécifiques de la base de données pour l'IA
 * 
 * Ce fichier contient toutes les méthodes que l'IA peut appeler pour obtenir des informations
 * précises sur l'établissement scolaire depuis la base de données.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import secureLocalStorage from "react-secure-storage";

/**
 * Récupère la base de données active depuis le stockage local
 * @returns {Object|null} La base de données ou null si non trouvée
 */
const getActiveDatabase = () => {
  try {
    const activeDbId = secureLocalStorage.getItem("activeDatabaseId");
    if (!activeDbId) return null;
    
    const databases = secureLocalStorage.getItem("databases") || [];
    return databases.find(db => db.id === activeDbId) || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la base de données:", error);
    return null;
  }
};

/**
 * Commandes disponibles pour l'IA - Informations générales sur l'établissement
 */
export const getSchoolInfo = () => {
  const db = getActiveDatabase();
  if (!db) return { error: "Aucune base de données active" };
  
  return {
    command: "school_info",
    data: {
      name: db.name,
      short_name: db.short_name,
      created_at: db.created_at,
      updated_at: db.updated_at,
      total_students: db.students ? db.students.length : 0,
      total_employees: db.employes ? db.employes.length : 0,
      total_classes: db.classes ? db.classes.length : 0
    }
  };
};

/**
 * Récupère la liste complète des étudiants avec leurs informations
 */
export const getStudentsList = (filters = {}) => {
  const db = getActiveDatabase();
  if (!db || !db.students) return { error: "Aucun étudiant trouvé" };
  
  let students = [...db.students];
  
  // Filtrage par classe si spécifié
  if (filters.classe) {
    students = students.filter(student => student.classe === filters.classe);
  }
  
  // Filtrage par sexe si spécifié
  if (filters.sexe) {
    students = students.filter(student => student.sexe === filters.sexe);
  }
  
  return {
    command: "students_list",
    data: {
      total: students.length,
      students: students.map(student => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        sure_name: student.sure_name,
        classe: student.classe,
        sexe: student.sexe,
        matricule: student.matricule,
        birth_date: student.birth_date,
        birth_place: student.birth_place,
        father_name: student.father_name,
        mother_name: student.mother_name,
        parents_contact: student.parents_contact
      }))
    }
  };
};

/**
 * Récupère les statistiques des étudiants par classe
 */
export const getStudentsStatsByClass = () => {
  const db = getActiveDatabase();
  if (!db || !db.students) return { error: "Aucun étudiant trouvé" };
  
  const statsByClass = {};
  
  db.students.forEach(student => {
    const classe = student.classe;
    if (!statsByClass[classe]) {
      statsByClass[classe] = { total: 0, male: 0, female: 0 };
    }
    statsByClass[classe].total++;
    if (student.sexe === 'M') statsByClass[classe].male++;
    if (student.sexe === 'F') statsByClass[classe].female++;
  });
  
  return {
    command: "students_stats_by_class",
    data: statsByClass
  };
};

/**
 * Récupère la liste des employés
 */
export const getEmployeesList = (filters = {}) => {
  const db = getActiveDatabase();
  if (!db || !db.employes) return { error: "Aucun employé trouvé" };
  
  let employees = [...db.employes];
  
  // Filtrage par poste si spécifié
  if (filters.poste) {
    employees = employees.filter(emp => emp.poste === filters.poste);
  }
  
  return {
    command: "employees_list",
    data: {
      total: employees.length,
      employees: employees.map(emp => ({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        poste: emp.poste,
        sexe: emp.sexe,
        contact: emp.contact,
        salaire: emp.salaire,
        date_embauche: emp.date_embauche
      }))
    }
  };
};

/**
 * Récupère la liste des classes disponibles
 */
export const getClassesList = () => {
  const db = getActiveDatabase();
  if (!db || !db.classes) return { error: "Aucune classe trouvée" };
  
  return {
    command: "classes_list",
    data: {
      total: db.classes.length,
      classes: db.classes.map(classe => ({
        id: classe.id,
        name: classe.name,
        niveau: classe.niveau,
        capacity: classe.capacity,
        current_students: db.students ? db.students.filter(s => s.classe === classe.name).length : 0
      }))
    }
  };
};

/**
 * Récupère les informations de paiement et finances
 */
export const getPaymentsInfo = (filters = {}) => {
  const db = getActiveDatabase();
  if (!db || !db.payments) return { error: "Aucune information de paiement trouvée" };
  
  let payments = [...db.payments];
  
  // Filtrage par année si spécifié
  if (filters.year) {
    payments = payments.filter(payment => {
      const paymentYear = new Date(payment.date).getFullYear();
      return paymentYear === parseInt(filters.year);
    });
  }
  
  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingAmount = totalAmount - paidAmount;
  
  return {
    command: "payments_info",
    data: {
      total_payments: payments.length,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      pending_amount: pendingAmount,
      payments: payments.map(payment => ({
        id: payment.id,
        student_id: payment.student_id,
        amount: payment.amount,
        date: payment.date,
        status: payment.status,
        type: payment.type
      }))
    }
  };
};

/**
 * Récupère les bulletins et notes
 */
export const getBulletinsInfo = (filters = {}) => {
  const db = getActiveDatabase();
  if (!db || !db.bulletins) return { error: "Aucun bulletin trouvé" };
  
  let bulletins = [...db.bulletins];
  
  // Filtrage par classe si spécifié
  if (filters.classe) {
    bulletins = bulletins.filter(bulletin => bulletin.classe === filters.classe);
  }
  
  // Filtrage par période si spécifié
  if (filters.periode) {
    bulletins = bulletins.filter(bulletin => bulletin.periode === filters.periode);
  }
  
  return {
    command: "bulletins_info",
    data: {
      total_bulletins: bulletins.length,
      bulletins: bulletins.map(bulletin => ({
        id: bulletin.id,
        student_id: bulletin.student_id,
        classe: bulletin.classe,
        periode: bulletin.periode,
        moyenne_generale: bulletin.moyenne_generale,
        rang: bulletin.rang,
        observations: bulletin.observations
      }))
    }
  };
};

/**
 * Recherche un étudiant spécifique par nom, matricule ou ID
 */
export const searchStudent = (query) => {
  const db = getActiveDatabase();
  if (!db || !db.students) return { error: "Aucun étudiant trouvé" };
  
  const searchTerm = query.toLowerCase();
  const foundStudents = db.students.filter(student => 
    student.first_name.toLowerCase().includes(searchTerm) ||
    student.last_name.toLowerCase().includes(searchTerm) ||
    (student.matricule && student.matricule.toLowerCase().includes(searchTerm)) ||
    student.id === query
  );
  
  return {
    command: "search_student",
    data: {
      query: query,
      found: foundStudents.length,
      students: foundStudents
    }
  };
};

/**
 * Récupère les statistiques générales de l'établissement
 */
export const getGeneralStats = () => {
  const db = getActiveDatabase();
  if (!db) return { error: "Aucune base de données active" };
  
  const totalStudents = db.students ? db.students.length : 0;
  const totalEmployees = db.employes ? db.employes.length : 0;
  const totalClasses = db.classes ? db.classes.length : 0;
  const maleStudents = db.students ? db.students.filter(s => s.sexe === 'M').length : 0;
  const femaleStudents = db.students ? db.students.filter(s => s.sexe === 'F').length : 0;
  
  return {
    command: "general_stats",
    data: {
      school_name: db.name,
      total_students: totalStudents,
      male_students: maleStudents,
      female_students: femaleStudents,
      total_employees: totalEmployees,
      total_classes: totalClasses,
      database_created: db.created_at,
      last_updated: db.updated_at
    }
  };
};

/**
 * Récupère les dépenses et budget
 */
export const getExpensesInfo = (filters = {}) => {
  const db = getActiveDatabase();
  if (!db || !db.expenses) return { error: "Aucune information de dépense trouvée" };
  
  let expenses = [...db.expenses];
  
  // Filtrage par année si spécifié
  if (filters.year) {
    expenses = expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear === parseInt(filters.year);
    });
  }
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  return {
    command: "expenses_info",
    data: {
      total_expenses: expenses.length,
      total_amount: totalExpenses,
      expenses: expenses.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category
      }))
    }
  };
};

/**
 * Map des commandes disponibles pour l'IA
 * Cette map permet à l'IA de savoir quelles commandes elle peut utiliser
 */
export const AVAILABLE_COMMANDS = {
  'GET_SCHOOL_INFO': getSchoolInfo,
  'GET_STUDENTS_LIST': getStudentsList,
  'GET_STUDENTS_STATS_BY_CLASS': getStudentsStatsByClass,
  'GET_EMPLOYEES_LIST': getEmployeesList,
  'GET_CLASSES_LIST': getClassesList,
  'GET_PAYMENTS_INFO': getPaymentsInfo,
  'GET_BULLETINS_INFO': getBulletinsInfo,
  'SEARCH_STUDENT': searchStudent,
  'GET_GENERAL_STATS': getGeneralStats,
  'GET_EXPENSES_INFO': getExpensesInfo
};

/**
 * Exécute une commande spécifique avec des paramètres
 * @param {string} commandName - Nom de la commande à exécuter
 * @param {Object} params - Paramètres pour la commande
 * @returns {Object} Résultat de la commande
 */
export const executeCommand = (commandName, params = {}) => {
  const command = AVAILABLE_COMMANDS[commandName];
  if (!command) {
    return { error: `Commande '${commandName}' non trouvée` };
  }
  
  try {
    return command(params);
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
    return { error: `Erreur lors de l'exécution de la commande: ${error.message}` };
  }
};

/**
 * Analyse le texte de réponse de l'IA pour détecter les commandes à exécuter
 * @param {string} aiResponse - Réponse de l'IA
 * @returns {Array} Liste des commandes détectées
 */
export const parseAICommands = (aiResponse) => {
  const commandPattern = /\[COMMAND:(\w+)(?:\s+(.+?))?\]/g;
  const commands = [];
  let match;
  
  while ((match = commandPattern.exec(aiResponse)) !== null) {
    const commandName = match[1];
    const paramsStr = match[2];
    let params = {};
    
    if (paramsStr) {
      try {
        params = JSON.parse(paramsStr);
      } catch (error) {
        console.warn(`Erreur lors du parsing des paramètres pour ${commandName}:`, error);
      }
    }
    
    commands.push({ commandName, params });
  }
  
  return commands;
};

export default {
  getSchoolInfo,
  getStudentsList,
  getStudentsStatsByClass,
  getEmployeesList,
  getClassesList,
  getPaymentsInfo,
  getBulletinsInfo,
  searchStudent,
  getGeneralStats,
  getExpensesInfo,
  AVAILABLE_COMMANDS,
  executeCommand,
  // parseAICommands
};