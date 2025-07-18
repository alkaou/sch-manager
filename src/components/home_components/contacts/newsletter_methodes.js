/**
 * Méthodes pour la gestion de la newsletter
 * Développé pour SchoolManager (Entreprise Malienne)
 */

import { db } from '../../../auth/firebaseService';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { translate } from './contact_translator';

// Cache pour la protection anti-spam
const newsletterSpamCache = new Map();
const NEWSLETTER_SPAM_DELAY = 30000; // 30 secondes entre les tentatives

/**
 * Valide une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {Object} - Résultat de la validation
 */
export const validateNewsletterEmail = (email, language) => {
  const validation = {
    isValid: false,
    error: null
  };

  // Vérifier si l'email est fourni
  if (!email || email.trim() === '') {
    validation.error = translate('email_required', language);
    return validation;
  }

  // Nettoyer l'email
  const cleanEmail = email.trim().toLowerCase();

  // Regex pour validation email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(cleanEmail)) {
    validation.error = translate('email_invalid', language);
    return validation;
  }

  // Vérifier la longueur
  if (cleanEmail.length > 254) {
    validation.error = translate('email_invalid', language);
    return validation;
  }

  validation.isValid = true;
  return validation;
};

/**
 * Vérifie la protection anti-spam pour la newsletter
 * @param {string} email - L'adresse email
 * @returns {Object} - Résultat de la vérification
 */
export const checkNewsletterSpamProtection = (email, language) => {
  const now = Date.now();
  const lastSubmission = newsletterSpamCache.get(email, language);
  
  if (lastSubmission && (now - lastSubmission) < NEWSLETTER_SPAM_DELAY) {
    const remainingSeconds = Math.ceil((NEWSLETTER_SPAM_DELAY - (now - lastSubmission)) / 1000);
    return {
      isBlocked: true,
      error: `${translate('spam_protection', language)} (${remainingSeconds}s)`
    };
  }
  
  return { isBlocked: false };
};

/**
 * Vérifie si un email est déjà abonné à la newsletter
 * @param {string} email - L'adresse email à vérifier
 * @returns {Promise<boolean>} - True si l'email existe déjà
 */
export const checkIfEmailSubscribed = async (email) => {
  try {
    const newsletterRef = collection(db, 'newsletter');
    const q = query(newsletterRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    return false;
  }
};

/**
 * Ajoute un email à la newsletter
 * @param {string} email - L'adresse email à ajouter
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const subscribeToNewsletter = async (email, language) => {
  try {
    // Validation de l'email
    const validation = validateNewsletterEmail(email, language);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Vérification anti-spam
    const spamCheck = checkNewsletterSpamProtection(cleanEmail);
    if (spamCheck.isBlocked) {
      return {
        success: false,
        error: spamCheck.error
      };
    }

    // Vérifier si l'email est déjà abonné
    const isAlreadySubscribed = await checkIfEmailSubscribed(cleanEmail);
    if (isAlreadySubscribed) {
      return {
        success: false,
        error: translate('email_already_subscribed', language) || 'Cet email est déjà abonné à notre newsletter.'
      };
    }

    // Récupération de l'adresse IP (optionnelle)
    let userIP = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      userIP = ipData.ip;
    } catch (error) {
      console.warn('Impossible de récupérer l\'adresse IP:', error);
    }

    // Créer l'objet d'abonnement
    const subscriptionObject = {
      id: `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: cleanEmail,
      created_at: new Date().toISOString(),
      ip_address: userIP,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      status: 'active'
    };

    // Ajouter à Firestore
    const newsletterRef = collection(db, 'newsletter');
    await addDoc(newsletterRef, subscriptionObject);

    // Mettre à jour le cache anti-spam
    newsletterSpamCache.set(cleanEmail, Date.now());

    return {
      success: true,
      message: translate('newsletter_subscription_success', language) || 'Merci de votre inscription à notre newsletter !'
    };

  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    return {
      success: false,
      error: translate('sending_error', language) || 'Une erreur s\'est produite lors de l\'inscription.'
    };
  }
};

/**
 * Récupère tous les abonnés à la newsletter
 * @returns {Promise<Array>} - Liste des abonnés
 */
export const getAllNewsletterSubscribers = async () => {
  try {
    const newsletterRef = collection(db, 'newsletter');
    const q = query(newsletterRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const subscribers = [];
    querySnapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return subscribers;
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    return [];
  }
};

/**
 * Compte le nombre total d'abonnés
 * @returns {Promise<number>} - Nombre d'abonnés
 */
export const getNewsletterSubscribersCount = async () => {
  try {
    const subscribers = await getAllNewsletterSubscribers();
    return subscribers.length;
  } catch (error) {
    console.error('Erreur lors du comptage des abonnés:', error);
    return 0;
  }
};

// Export par défaut avec toutes les fonctions
export default {
  validateNewsletterEmail,
  subscribeToNewsletter,
  checkIfEmailSubscribed,
  getAllNewsletterSubscribers,
  getNewsletterSubscribersCount,
  checkNewsletterSpamProtection
};