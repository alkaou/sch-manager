/**
 * Système de gestion des contacts avec Firebase Firestore
 * Développé pour SchoolManager (Entreprise Malienne)
 *
 * Ce module centralise toute la logique métier pour :
 * - Validation des données de contact
 * - Enregistrement dans Firestore
 * - Gestion des messages groupés par email
 * - Protection anti-spam
 */

import {
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  addDoc
} from "firebase/firestore";
import { db } from "../../../auth/firebaseService";
import { translate } from "./contact_translator";

// Configuration
const COLLECTION_NAME = "contacts_emails";
const SPAM_PROTECTION_DELAY = 60000; // 1 minute en millisecondes

// Cache pour la protection anti-spam
const lastSubmissionTimes = new Map();

/**
 * Validation stricte des données d'entrée du formulaire de contact
 * @param {Object} data - Données du formulaire
 * @param {string} data.name - Nom complet
 * @param {string} data.email - Adresse email
 * @param {string} data.subject - Sujet du message
 * @param {string} data.message - Contenu du message
 * @param {string} language - Langue pour les messages d'erreur
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateContactInput = (data, language = "Français") => {
  const errors = {};
  let isValid = true;

  // Validation du nom
  if (!data.name || !data.name.trim()) {
    errors.name = translate("name_required", language);
    isValid = false;
  } else {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;
    const trimmedName = data.name.trim();
    if (!nameRegex.test(trimmedName)) {
      errors.name = translate("name_invalid", language);
      isValid = false;
    }
  }

  // Validation de l'email (RFC 5322 standard)
  if (!data.email || !data.email.trim()) {
    errors.email = translate("email_required", language);
    isValid = false;
  } else {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = translate("email_invalid", language);
      isValid = false;
    }
  }

  // Validation du sujet
  if (!data.subject || !data.subject.trim()) {
    errors.subject = translate("subject_required", language);
    isValid = false;
  } else {
    const trimmedSubject = data.subject.trim();
    if (trimmedSubject.length < 3 || trimmedSubject.length > 255) {
      errors.subject = translate("subject_invalid", language);
      isValid = false;
    }
  }

  // Validation du message
  if (!data.message || !data.message.trim()) {
    errors.message = translate("message_required", language);
    isValid = false;
  } else {
    const trimmedMessage = data.message.trim();
    if (trimmedMessage.length < 30) {
      errors.message = translate("message_too_short", language);
      isValid = false;
    } else if (trimmedMessage.length > 10000) {
      errors.message = translate("message_too_long", language);
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Fonction anti-XSS pour nettoyer les données
 * @param {string} input - Texte à nettoyer
 * @returns {string} - Texte nettoyé
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return input.trim().replace(/[<>"'&]/g, (match) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    };
    return entities[match];
  });
};

/**
 * Vérification anti-spam basée sur l'email et le timestamp
 * @param {string} email - Adresse email
 * @param {string} language - Langue pour les messages d'erreur
 * @returns {Object} - { canSubmit: boolean, error?: string }
 */
export const checkSpamProtection = (email, language = "Français") => {
  const now = Date.now();
  const lastSubmission = lastSubmissionTimes.get(email.toLowerCase());

  if (lastSubmission) {
    const timeDiff = now - lastSubmission;

    if (timeDiff < SPAM_PROTECTION_DELAY) {
      const remainingSeconds = Math.ceil((SPAM_PROTECTION_DELAY - timeDiff) / 1000);
      return {
        canSubmit: false,
        error: translate("spam_protection", language).replace('{time}', remainingSeconds),
      };
    }
  }

  return { canSubmit: true };
};

// Fonctions utilitaires supprimées car intégrées directement dans saveContactMessage

/**
 * Enregistrer un message de contact dans Firestore
 * @param {Object} data - Données du formulaire validées
 * @param {string} language - Langue pour les messages d'erreur
 * @returns {Promise<Object>} - { success: boolean, message?: string, error?: string }
 */
export const saveContactMessage = async (data, language = "Français") => {
  try {
    // Validation des données
    const validation = validateContactInput(data, language);
    if (!validation.isValid) {
      return {
        success: false,
        error: "Données invalides",
        validationErrors: validation.errors,
      };
    }

    // Vérification anti-spam
    const spamCheck = checkSpamProtection(data.email, language);
    if (!spamCheck.canSubmit) {
      return {
        success: false,
        error: spamCheck.error,
      };
    }

    // Créer l'objet message avec toutes les données nécessaires
    // Récupération de l'adresse IP (approximative via API publique)
    let userIP = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      userIP = ipData.ip;
    } catch (error) {
      console.warn('Impossible de récupérer l\'adresse IP:', error);
    }

    const messageObject = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email.toLowerCase()),
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
      created_at: new Date().toISOString(),
      read: false,
      ip_address: userIP,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    };
    
    // Ajouter le message directement à la collection contacts_emails
    const docRef = await addDoc(collection(db, COLLECTION_NAME), messageObject);
    
    // console.log('Message sauvegardé avec l\'ID:', docRef.id);
    
    // Mettre à jour le cache anti-spam
    lastSubmissionTimes.set(data.email.toLowerCase(), Date.now());
    
    return {
      success: true,
      message: translate('message_sent_success', language),
      messageId: docRef.id
    };
    
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message:", error);

    // Gestion des erreurs spécifiques
    if (error.code === "permission-denied") {
      return {
        success: false,
        error: "Permissions insuffisantes pour enregistrer le message",
      };
    } else if (error.code === "unavailable") {
      return {
        success: false,
        error: translate("network_error", language),
      };
    }

    return {
      success: false,
      error: translate("sending_error", language),
    };
  }
};

/**
 * Récupère les messages groupés par email
 * @param {string} email - Email spécifique (optionnel)
 * @returns {Promise<Array>} - Liste des messages
 */
export const groupMessagesByEmail = async (email = null) => {
  try {
    const contactsRef = collection(db, COLLECTION_NAME);
    let q;
    
    if (email) {
      // Récupérer les messages pour un email spécifique
      q = query(contactsRef, where('email', '==', email.toLowerCase()), orderBy('created_at', 'desc'));
    } else {
      // Récupérer tous les messages, triés par date de création
      q = query(contactsRef, orderBy('created_at', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data
      });
    });
    
    return messages;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

/**
 * Marque un message comme lu
 * @param {string} messageId - ID du document message
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const messageDocRef = doc(db, COLLECTION_NAME, messageId);
    
    await updateDoc(messageDocRef, {
      read: true
    });
    
    return true;
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de lecture:', error);
    return false;
  }
};

/**
 * Obtenir le nombre de messages non lus
 * @returns {Promise<number>} - Nombre de messages non lus
 */
export const getUnreadMessagesCount = async () => {
  try {
    const unreadQuery = query(
      collection(db, COLLECTION_NAME),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(unreadQuery);
    
    return querySnapshot.size;
    
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    return 0;
  }
};

// Export par défaut avec toutes les fonctions
export default {
  validateContactInput,
  saveContactMessage,
  groupMessagesByEmail,
  markMessageAsRead,
  getUnreadMessagesCount,
  checkSpamProtection,
};
