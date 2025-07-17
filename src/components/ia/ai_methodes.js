/**
 * Fichier ai_methodes.js - Méthodes utilitaires pour le système IA Fatoumata
 *
 * Ce fichier contient toutes les méthodes et fonctionnalités du système IA
 * pour éviter la confusion et faciliter la lecture, les modifications et les réutilisations.
 *
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import secureLocalStorage from "react-secure-storage";
import { getRevenuePerSchoolYear } from "../statistiques/expenses_and_revenu/analysticsExpensesAndRevenuMethod";
import { getTotalExpensesPerYear } from "../statistiques/expenses/analysticsExpensesMethod";

// Configuration de l'API
const API_CONFIG = {
  development: "http://127.0.0.1:5000/chat",
  production: "https://api.schoolmanager.com/chat",
};

/**
 * Détermine l'URL de l'API selon l'environnement
 * @returns {string} URL de l'API
 */
export const getApiUrl = () => {
  const isDevelopment =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost";
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
};

/**
 * Génère un ID unique pour les messages et chats
 * @returns {string} ID unique
 */
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sauvegarde un chat dans le stockage local
 * @param {Object} chat - Objet chat à sauvegarder
 */
export const saveChatToStorage = (chat) => {
  try {
    // Ne pas sauvegarder si le chat n'a pas de messages utilisateur
    const userMessages =
      chat.messages?.filter((msg) => msg.type === "user") || [];
    if (userMessages.length === 0) {
      return; // Ne pas sauvegarder les conversations vides
    }

    const existingChats = secureLocalStorage.getItem("fatoumata_chats") || [];
    const chatIndex = existingChats.findIndex((c) => c.id === chat.id);

    // Ajouter la date de création si elle n'existe pas
    if (!chat.createdAt) {
      chat.createdAt = new Date().toISOString();
    }

    // Ajouter la date de dernière modification
    chat.updatedAt = new Date().toISOString();

    if (chatIndex >= 0) {
      existingChats[chatIndex] = chat;
    } else {
      existingChats.unshift(chat); // Ajouter au début
    }

    // Limiter à 50 chats maximum
    if (existingChats.length > 50) {
      existingChats.splice(50);
    }

    secureLocalStorage.setItem("fatoumata_chats", existingChats);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du chat:", error);
  }
};

/**
 * Récupère tous les chats sauvegardés
 * @returns {Array} Liste des chats
 */
export const getChatsFromStorage = () => {
  try {
    return secureLocalStorage.getItem("fatoumata_chats") || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des chats:", error);
    return [];
  }
};

/**
 * Supprime un chat spécifique
 * @param {string} chatId - ID du chat à supprimer
 */
export const deleteChatFromStorage = (chatId) => {
  try {
    const existingChats = secureLocalStorage.getItem("fatoumata_chats") || [];
    const filteredChats = existingChats.filter((chat) => chat.id !== chatId);
    secureLocalStorage.setItem("fatoumata_chats", filteredChats);
  } catch (error) {
    console.error("Erreur lors de la suppression du chat:", error);
  }
};

/**
 * Supprime tous les chats
 */
export const deleteAllChatsFromStorage = () => {
  try {
    secureLocalStorage.removeItem("fatoumata_chats");
  } catch (error) {
    console.error("Erreur lors de la suppression de tous les chats:", error);
  }
};

/**
 * Crée le prompt système initial pour Fatoumata avec informations par défaut
 * @param {Object} defaultData - Données par défaut de la base de données
 * @returns {string} Prompt système initial
 */
export const createInitialSystemPrompt = (defaultData = {}) => {
  const {
    schoolInfo = {},
    totalStudents = 0,
    totalBoys = 0,
    totalGirls = 0,
    totalEmployees = 0,
    totalMaleEmployees = 0,
    totalFemaleEmployees = 0,
    totalClasses = 0,
    totalRevenue = 0,
    totalExpenses = 0,
    totalEvents = 0,
    totalCompositions = 0,
    totalBulletins = 0,
  } = defaultData;

  // console.log(totalExpenses);

  return `Tu es Fatoumata, une assistante IA spécialisée dans la gestion d'établissements scolaires, développée par et pour l'entreprise SchoolManager (une entreprise malienne) avec le développeur principal Alkaou Dembélé.

ÉTABLISSEMENT : ${schoolInfo.name || "Non défini"} (${
    schoolInfo.short_name || "N/A"
  })

INFORMATIONS GÉNÉRALES DISPONIBLES :
• ÉLÈVES : ${totalStudents} au total (${totalBoys} garçons, ${totalGirls} filles)
• PERSONNEL : ${totalEmployees} employés (${totalMaleEmployees} hommes, ${totalFemaleEmployees} femmes)
• CLASSES : ${totalClasses} classes disponibles
• FINANCES : Les revenus totaux pour chaque année avec toutes les informations : ${totalRevenue}. Sommes FCFA de revenus, Les dépenses totales pour chaque année avec toutes les informations : ${totalExpenses}. Sommes en FCFA de dépenses
• ACTIVITÉS : ${totalEvents} événements, ${totalCompositions} compositions, ${totalBulletins} bulletins

CAPACITÉS :
- Accès complet aux données de l'établissement (élèves, employés, finances, etc.)
- Analyse de documents fournis par l'utilisateur
- Conseils experts en gestion scolaire adaptés au contexte malien
- Réponses en français, anglais ou avec tolérance aux fautes d'orthographe

COMPORTEMENT :
- Présente-toi brièvement lors du premier message uniquement
- Sois professionnel, bienveillant et expert
- Réponds directement aux questions sans révéler les détails techniques
- Si une demande nécessite des informations très spécifiques non disponibles, informe poliment que tu n'as pas accès à toutes les ressources mais peux aider si l'utilisateur fournit les données

Tu es une experte passionnée par l'amélioration des établissements scolaires.`;
};

/**
 * Crée le prompt système pour les interactions suivantes avec informations par défaut
 * @param {Object} defaultData - Données par défaut de la base de données
 * @returns {string} Prompt système de continuation
 */
export const createContinuationPrompt = (defaultData = {}) => {
  const {
    schoolInfo = {},
    totalStudents = 0,
    totalBoys = 0,
    totalGirls = 0,
    totalEmployees = 0,
    totalMaleEmployees = 0,
    totalFemaleEmployees = 0,
    totalClasses = 0,
    totalRevenue = 0,
    totalExpenses = 0,
  } = defaultData;

  return `Tu es Fatoumata, assistante IA de ${
    schoolInfo.name || "l'établissement"
  }. Continue naturellement la conversation.

DONNÉES ACTUELLES : ${totalStudents} élèves (${totalBoys}♂ ${totalGirls}♀), ${totalEmployees} employés, ${totalClasses} classes, ${totalRevenue.toLocaleString()} FCFA revenus, ${totalExpenses.toLocaleString()} FCFA dépenses.

Réponds directement avec expertise, en français/anglais, avec tolérance aux fautes.`;
};

// Fonctions de commandes supprimées - remplacées par getContextualData()

/**
 * Exécute une commande spécifique
 * @param {string} commandName - Nom de la commande
 * @param {Object} params - Paramètres de la commande
 * @returns {Object} Résultat de l'exécution
 */
const executeCommand = async (commandName, params = {}) => {
  try {
    const database = await window.electron.getDatabase();

    switch (commandName) {
      case "GET_SCHOOL_INFO":
        return {
          success: true,
          data: {
            name: database.name || "Non défini",
            short_name: database.short_name || "Non défini",
            version: database.version || "Non défini",
            created_at: database.created_at || "Non défini",
            updated_at: database.updated_at || "Non défini",
          },
        };

      case "GET_STUDENTS_LIST":
        const students = database.students || [];
        let filteredStudents = students;

        if (params.classe) {
          filteredStudents = filteredStudents.filter(
            (s) => s.classe === params.classe
          );
        }
        if (params.sexe) {
          filteredStudents = filteredStudents.filter(
            (s) => s.sexe === params.sexe
          );
        }

        return {
          success: true,
          data: {
            total: filteredStudents.length,
            students: filteredStudents.map((s) => ({
              id: s.id,
              first_name: s.first_name,
              last_name: s.last_name,
              classe: s.classe,
              sexe: s.sexe,
              matricule: s.matricule,
            })),
          },
        };

      case "GET_STUDENTS_STATS_BY_CLASS":
        const allStudents = database.students || [];
        const statsByClass = {};

        allStudents.forEach((student) => {
          const classe = student.classe || "Non défini";
          if (!statsByClass[classe]) {
            statsByClass[classe] = { total: 0, garcons: 0, filles: 0 };
          }
          statsByClass[classe].total++;
          if (student.sexe === "M") statsByClass[classe].garcons++;
          if (student.sexe === "F") statsByClass[classe].filles++;
        });

        return {
          success: true,
          data: statsByClass,
        };

      case "GET_EMPLOYEES_LIST":
        const employees = database.employees || [];
        let filteredEmployees = employees;

        if (params.poste) {
          filteredEmployees = filteredEmployees.filter(
            (e) => e.poste === params.poste
          );
        }

        return {
          success: true,
          data: {
            total: filteredEmployees.length,
            employees: filteredEmployees.map((e) => ({
              id: e.id,
              first_name: e.first_name,
              last_name: e.last_name,
              poste: e.poste,
              contact: e.contact,
            })),
          },
        };

      case "GET_CLASSES_LIST":
        const classes = database.classes || [];
        return {
          success: true,
          data: {
            total: classes.length,
            classes: classes.map((c) => ({
              id: c.id,
              name: c.name,
              niveau: c.niveau,
              effectif: c.effectif || 0,
            })),
          },
        };

      case "GET_PAYMENTS_INFO":
        const revenuData = getRevenuePerSchoolYear(database);

        const totalAmount = revenuData.totalRevenue;

        return {
          success: true,
          data: {
            total_payments: database.paymentSystems?.length || 0,
            total_amount: totalAmount,
            payments: revenuData,
          },
        };

      case "GET_EXPENSES_INFO":
        const expenses = database.expenses || [];
        let filteredExpenses = expenses;

        if (params.year) {
          filteredExpenses = filteredExpenses.filter((e) => {
            const expenseYear = new Date(e.date).getFullYear();
            return expenseYear === params.year;
          });
        }

        const totalExpenseAmount = getTotalExpensesPerYear(
          expenses,
          database.schoolYears
        ).total;

        return {
          success: true,
          data: {
            total_expenses: filteredExpenses.length,
            total_amount: totalExpenseAmount,
            expenses: filteredExpenses.slice(0, 10),
          },
        };

      case "SEARCH_STUDENT":
        const searchQuery = params.query || "";
        const searchResults = (database.students || []).filter(
          (s) =>
            s.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.matricule?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          success: true,
          data: {
            query: searchQuery,
            results: searchResults.length,
            students: searchResults.slice(0, 5),
          },
        };

      case "GET_GENERAL_STATS":
        return {
          success: true,
          data: {
            total_students: (database.students || []).length,
            total_employees: (database.employees || []).length,
            total_classes: (database.classes || []).length,
            total_payments: (database.paymentSystems || []).length,
            total_expenses: (database.expenses || []).length,
            total_events: (database.events || []).length,
            total_compositions: (database.compositions || []).length,
            total_bulletins: (database.bulletins || []).length,
            school_name: database.name || "Non défini",
            school_short_name: database.short_name || "Non défini",
            school_academie: database.academie || "Non défini",
            school_cap: database.zone || "Non défini",
          },
        };

      case "GET_EVENTS_INFO":
        const events = database.events || [];
        return {
          success: true,
          data: {
            total_events: events.length,
            events: events.slice(0, 10).map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              date: e.date,
              type: e.type,
              status: e.status,
            })),
          },
        };

      case "GET_COMPOSITIONS_INFO":
        const compositions = database.compositions || [];
        return {
          success: true,
          data: {
            total_compositions: compositions.length,
            compositions: compositions.slice(0, 10).map((c) => ({
              id: c.id,
              title: c.title,
              subject: c.subject,
              classe: c.classe,
              date: c.date,
              total_points: c.total_points,
            })),
          },
        };

      case "GET_BULLETINS_INFO":
        const bulletins = database.bulletins || [];
        return {
          success: true,
          data: {
            total_bulletins: bulletins.length,
            bulletins: bulletins.slice(0, 10).map((b) => ({
              id: b.id,
              student_id: b.student_id,
              classe: b.classe,
              period: b.period,
              year: b.year,
              average: b.average,
            })),
          },
        };

      default:
        return {
          success: false,
          error: `Commande inconnue: ${commandName}`,
        };
    }
  } catch (error) {
    console.error(
      `Erreur lors de l'exécution de la commande ${commandName}:`,
      error
    );
    return {
      success: false,
      error: `Erreur lors de l'exécution: ${error.message}`,
    };
  }
};

/**
 * Récupère les données par défaut de la base de données
 * @returns {Promise<Object>} Données par défaut
 */
export const getDefaultDatabaseInfo = async () => {
  try {
    const database = await window.electron.getDatabase();
    const students = database.students || [];
    const employees = database.employees || [];
    const classes = database.classes || [];
    // const payments = database.paymentSystems || [];
    const expenses = database.expenses || [];
    const events = database.events || [];
    const compositions = database.compositions || [];
    const bulletins = database.bulletins || [];

    // Calculs des statistiques
    const totalStudents = students.length;
    const totalBoys = students.filter((s) => s.sexe === "M").length;
    const totalGirls = students.filter((s) => s.sexe === "F").length;
    const totalEmployees = employees.length;
    const totalMaleEmployees = employees.filter((e) => e.sexe === "M").length;
    const totalFemaleEmployees = employees.filter((e) => e.sexe === "F").length;
    const totalClasses = classes.length;
    const totalRevenue = getRevenuePerSchoolYear(database);
    const totalEvents = events.length;
    const totalCompositions = compositions.length;
    const totalBulletins = bulletins.length;
    // console.log(getRevenuePerSchoolYear(database));

    const Expensestableau = getTotalExpensesPerYear(
      expenses,
      database.schoolYears
    );
    const depenseArray = Expensestableau.map((item) => ({
      schoolYear: `${item.start_date} - ${item.end_date}`,
      depenseTotal: item.total,
    }));

    const totalExpenses =
      "Voici le résumé des dépenses par année scolaire : " +
      depenseArray
        .map(
          (item) =>
            `Pour l'année scolaire ${item.schoolYear}, la dépense totale est de ${item.depenseTotal} FCFA.`
        )
        .join(" ");

    // console.log(totalExpenses);

    return {
      schoolInfo: {
        name: database.name || "Non défini",
        short_name: database.short_name || "N/A",
        version: database.version || "N/A",
      },
      totalStudents,
      totalBoys,
      totalGirls,
      totalEmployees,
      totalMaleEmployees,
      totalFemaleEmployees,
      totalClasses,
      totalRevenue,
      totalExpenses,
      totalEvents,
      totalCompositions,
      totalBulletins,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données par défaut:",
      error
    );
    return {};
  }
};

/**
 * Analyse intelligemment la question et récupère les données pertinentes
 * @param {string} userMessage - Message de l'utilisateur
 * @returns {Promise<Object>} Données contextuelles
 */
export const getContextualData = async (userMessage) => {
  // Normalisation du message pour gérer les variations linguistiques
  const normalizedMessage = userMessage
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n");

  const contextData = {};

  try {
    // Mots-clés étendus pour une meilleure détection
    const schoolKeywords = [
      "ecole",
      "etablissement",
      "nom",
      "school",
      "name",
      "institution",
    ];
    const studentKeywords = [
      "etudiant",
      "eleve",
      "student",
      "pupil",
      "apprenant",
      "classe",
      "class",
    ];
    const employeeKeywords = [
      "employe",
      "employee",
      "professeur",
      "teacher",
      "personnel",
      "staff",
      "enseignant",
    ];
    const financeKeywords = [
      "paiement",
      "payment",
      "finance",
      "argent",
      "money",
      "budget",
      "revenu",
      "revenue",
    ];
    const expenseKeywords = ["depense", "expense", "cout", "cost", "charge"];
    const statsKeywords = [
      "statistique",
      "statistic",
      "general",
      "total",
      "nombre",
      "number",
      "combien",
      "how many",
    ];
    const classKeywords = ["classe", "class", "niveau", "level"];
    const eventKeywords = ["evenement", "event", "activite", "activity"];
    const compositionKeywords = [
      "composition",
      "examen",
      "exam",
      "test",
      "evaluation",
    ];
    const bulletinKeywords = ["bulletin", "note", "grade", "rapport", "report"];

    // Fonction helper pour vérifier la présence de mots-clés
    const containsKeywords = (keywords) => {
      return keywords.some((keyword) => normalizedMessage.includes(keyword));
    };

    // Récupération des données selon les mots-clés détectés
    if (containsKeywords(schoolKeywords)) {
      const schoolInfo = await executeCommand("GET_SCHOOL_INFO", {});
      if (schoolInfo.success) contextData.schoolInfo = schoolInfo.data;
    }

    if (containsKeywords(studentKeywords)) {
      const students = await executeCommand("GET_STUDENTS_LIST", {});
      if (students.success) contextData.students = students.data;

      const statsClass = await executeCommand(
        "GET_STUDENTS_STATS_BY_CLASS",
        {}
      );
      if (statsClass.success) contextData.studentStats = statsClass.data;
    }

    if (containsKeywords(employeeKeywords)) {
      const employees = await executeCommand("GET_EMPLOYEES_LIST", {});
      if (employees.success) contextData.employees = employees.data;
    }

    if (containsKeywords(financeKeywords)) {
      const payments = await executeCommand("GET_PAYMENTS_INFO", {});
      if (payments.success) contextData.payments = payments.data;
    }

    if (containsKeywords(expenseKeywords)) {
      const expenses = await executeCommand("GET_EXPENSES_INFO", {});
      if (expenses.success) contextData.expenses = expenses.data;
    }

    if (containsKeywords(statsKeywords)) {
      const generalStats = await executeCommand("GET_GENERAL_STATS", {});
      if (generalStats.success) contextData.generalStats = generalStats.data;
    }

    if (containsKeywords(classKeywords)) {
      const classes = await executeCommand("GET_CLASSES_LIST", {});
      if (classes.success) contextData.classes = classes.data;
    }

    // Nouvelles détections pour événements, compositions et bulletins
    if (containsKeywords(eventKeywords)) {
      const events = await executeCommand("GET_EVENTS_INFO", {});
      if (events.success) contextData.events = events.data;
    }

    if (containsKeywords(compositionKeywords)) {
      const compositions = await executeCommand("GET_COMPOSITIONS_INFO", {});
      if (compositions.success) contextData.compositions = compositions.data;
    }

    if (containsKeywords(bulletinKeywords)) {
      const bulletins = await executeCommand("GET_BULLETINS_INFO", {});
      if (bulletins.success) contextData.bulletins = bulletins.data;
    }

    return contextData;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données contextuelles:",
      error
    );
    return {};
  }
};

/**
 * Envoie un message à l'API IA avec gestion intelligente du contexte
 * @param {string} message - Message à envoyer
 * @param {File|null} file - Fichier joint (optionnel)
 * @param {Array} conversationHistory - Historique de la conversation
 * @param {boolean} isFirstMessage - Si c'est le premier message de la conversation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const sendMessageToAI = async (
  message,
  file = null,
  conversationHistory = [],
  isFirstMessage = false
) => {
  try {
    const apiUrl = getApiUrl();
    const formData = new FormData();

    // Récupérer les données par défaut et contextuelles
    const defaultData = await getDefaultDatabaseInfo();
    const contextData = await getContextualData(message);

    // Choisir le prompt approprié avec les données par défaut
    const systemPrompt = isFirstMessage
      ? createInitialSystemPrompt(defaultData)
      : createContinuationPrompt(defaultData);

    // Construire le contexte de conversation
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\nCONTEXTE DE LA CONVERSATION:\n";
      conversationHistory.slice(-6).forEach((msg, index) => {
        conversationContext += `${
          msg.type === "user" ? "Utilisateur" : "Fatoumata"
        }: ${msg.content}\n`;
      });
    }

    // Construire le contexte des données spécifiques
    let dataContext = "";
    if (Object.keys(contextData).length > 0) {
      dataContext =
        "\n\nDONNÉES SPÉCIFIQUES À LA QUESTION:\n" +
        JSON.stringify(contextData, null, 2);
    }

    // Message complet avec contexte amélioré
    const fullMessage = `${systemPrompt}${conversationContext}${dataContext}\n\nQUESTION ACTUELLE: ${message}\n\nINSTRUCTIONS:\n- Réponds directement à la question en utilisant les données disponibles\n- Ne mentionne jamais les détails techniques ou la structure des données\n- Sois naturel et conversationnel\n- Accepte les messages en français, anglais ou avec des fautes d'orthographe\n- Si la demande nécessite des informations très spécifiques non disponibles, informe poliment que tu n'as pas accès à toutes les ressources\n- ${
      isFirstMessage
        ? "Présente-toi brièvement"
        : "Continue la conversation naturellement"
    }`;

    formData.append("message", fullMessage);
    formData.append("user_id", "school_manager_user");

    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Extraire la réponse du format retourné par le serveur Python
    const aiResponse = data.reply || data.response || data.message || "";

    return {
      success: true,
      response: aiResponse,
      contextData: contextData,
      defaultData: defaultData,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message à l'IA:", error);
    return {
      success: false,
      error: error.message,
      response: null,
    };
  }
};

/**
 * Valide un fichier avant l'upload
 * @param {File} file - Fichier à valider
 * @returns {Object} Résultat de la validation
 */
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "file_too_large",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "unsupported_file",
    };
  }

  return {
    valid: true,
    error: null,
  };
};

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
    return false;
  }
};

/**
 * Lecture à haute voix d'un texte
 * @param {string} text - Texte à lire
 * @param {string} language - Langue (fr, en, etc.)
 */
export const readTextAloud = (text, language = "fr") => {
  try {
    if ("speechSynthesis" in window) {
      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "Français"
          ? "fr-FR"
          : language === "Anglais"
          ? "en-US"
          : "fr-FR";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la lecture:", error);
    return false;
  }
};

/**
 * Arrête la lecture en cours
 */
export const stopReading = () => {
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch (error) {
    console.error("Erreur lors de l'arrêt de la lecture:", error);
  }
};

/**
 * Formate un message pour l'affichage avec support markdown
 * @param {string} text - Texte à formater
 * @returns {string} Texte formaté
 */
export const formatMessage = (text) => {
  if (!text) return "";

  // Nettoyer le texte des commandes restantes
  let cleanText = text.replace(/\[COMMAND:[^\]]+\]/g, "");

  // Nettoyer les espaces multiples
  cleanText = cleanText.replace(/\n\s*\n\s*\n/g, "\n\n");

  return cleanText.trim();
};

/**
 * Génère un titre pour un chat basé sur le premier message
 * @param {string} message - Premier message du chat
 * @returns {string} Titre généré
 */
export const generateChatTitle = (message) => {
  if (!message) return "Nouveau chat";

  // Prendre les premiers mots et limiter la longueur
  const words = message.trim().split(" ").slice(0, 6);
  let title = words.join(" ");

  if (title.length > 50) {
    title = title.substring(0, 47) + "...";
  }

  return title || "Nouveau chat";
};

/**
 * Gère les raccourcis clavier
 * @param {KeyboardEvent} event - Événement clavier
 * @param {Object} handlers - Gestionnaires d'événements
 */
export const handleKeyboardShortcuts = (event, handlers) => {
  // Échap pour fermer les popups
  if (event.key === "Escape" && handlers.onEscape) {
    handlers.onEscape();
  }

  // Ctrl+Enter pour nouvelle ligne (géré dans le composant input)
  // Enter pour envoyer (géré dans le composant input)
};

/**
 * Utilitaires pour la gestion des animations de typing
 */
export const createTypingAnimation = (
  text,
  callback,
  onComplete,
  speed = 0.1
) => {
  return new Promise((resolve) => {
    if (!text || typeof text !== "string") {
      if (onComplete) onComplete();
      resolve();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
        resolve();
      }
    }, speed);
  });
};

export default {
  getApiUrl,
  generateUniqueId,
  saveChatToStorage,
  getChatsFromStorage,
  deleteChatFromStorage,
  deleteAllChatsFromStorage,
  sendMessageToAI,
  validateFile,
  copyToClipboard,
  readTextAloud,
  stopReading,
  formatMessage,
  generateChatTitle,
  handleKeyboardShortcuts,
  createTypingAnimation,
};
