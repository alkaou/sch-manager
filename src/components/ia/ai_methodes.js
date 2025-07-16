/**
 * Fichier ai_methodes.js - Méthodes utilitaires pour le système IA Fatoumata
 * 
 * Ce fichier contient toutes les méthodes et fonctionnalités du système IA
 * pour éviter la confusion et faciliter la lecture, les modifications et les réutilisations.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

import secureLocalStorage from "react-secure-storage";
import { executeCommand, parseAICommands } from "./command.js";

// Configuration de l'API
const API_CONFIG = {
  development: "http://127.0.0.1:5000/chat",
  production: "https://api.schoolmanager.com/chat"
};

/**
 * Détermine l'URL de l'API selon l'environnement
 * @returns {string} URL de l'API
 */
export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
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
    const userMessages = chat.messages?.filter(msg => msg.type === 'user') || [];
    if (userMessages.length === 0) {
      return; // Ne pas sauvegarder les conversations vides
    }
    
    const existingChats = secureLocalStorage.getItem("fatoumata_chats") || [];
    const chatIndex = existingChats.findIndex(c => c.id === chat.id);
    
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
    const filteredChats = existingChats.filter(chat => chat.id !== chatId);
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
 * Crée le prompt système personnalisé pour Fatoumata
 * @returns {string} Prompt système
 */
export const createSystemPrompt = () => {
  return `Tu es Fatoumata, une assistante IA spécialisée dans la gestion d'établissements scolaires, développée par et pour l'entreprise SchoolManager (une entreprise malienne) avec le développeur principal Alkaou Dembélé.

Ton rôle est d'aider les utilisateurs dans la gestion de leur établissement de manière très pertinente et professionnelle.

CAPACITÉS SPÉCIALES :
- Tu peux accéder aux données de la base de données de l'établissement en utilisant des commandes spécifiques
- Tu peux analyser des documents (PDF, DOCX, images) fournis par l'utilisateur
- Tu fournis des conseils experts en gestion scolaire

COMMANDES DISPONIBLES :
Pour accéder aux données de l'établissement, utilise ces commandes dans tes réponses :
- [COMMAND:GET_SCHOOL_INFO] - Informations générales sur l'établissement
- [COMMAND:GET_STUDENTS_LIST {"classe":"6ème","sexe":"M"}] - Liste des étudiants (avec filtres optionnels)
- [COMMAND:GET_STUDENTS_STATS_BY_CLASS] - Statistiques des étudiants par classe
- [COMMAND:GET_EMPLOYEES_LIST {"poste":"Professeur"}] - Liste des employés (avec filtres optionnels)
- [COMMAND:GET_CLASSES_LIST] - Liste des classes
- [COMMAND:GET_PAYMENTS_INFO {"year":2024}] - Informations sur les paiements (avec filtres optionnels)
- [COMMAND:GET_BULLETINS_INFO {"classe":"6ème","periode":"1er trimestre"}] - Informations sur les bulletins
- [COMMAND:SEARCH_STUDENT "nom ou matricule"] - Rechercher un étudiant spécifique
- [COMMAND:GET_GENERAL_STATS] - Statistiques générales de l'établissement
- [COMMAND:GET_EXPENSES_INFO {"year":2024}] - Informations sur les dépenses

INSTRUCTIONS IMPORTANTES :
1. Utilise les commandes UNIQUEMENT quand tu as besoin de données spécifiques de l'établissement
2. Place les commandes dans tes réponses là où tu as besoin des données
3. Continue ta réponse normalement après les commandes
4. Sois toujours professionnel, bienveillant et expert
5. Adapte tes réponses au contexte malien et aux spécificités locales
6. Fournis des conseils pratiques et actionables
7. Utilise un langage clair et accessible

EXEMPLE D'UTILISATION :
"Pour vous donner des statistiques précises sur votre établissement, laissez-moi consulter les données.

[COMMAND:GET_GENERAL_STATS]

Basé sur ces informations, je peux vous conseiller..."

Tu es une experte en gestion scolaire et tu aides avec passion les établissements à améliorer leur fonctionnement.`;
};

/**
 * Traite la réponse de l'IA en exécutant les commandes détectées
 * @param {string} aiResponse - Réponse brute de l'IA
 * @returns {Object} Réponse traitée avec données
 */
export const processAIResponse = async (aiResponse) => {
  try {
    // Détecter les commandes dans la réponse
    const commands = parseAICommands(aiResponse);
    let processedResponse = aiResponse;
    const executedCommands = [];
    
    // Exécuter chaque commande détectée
    for (const { commandName, params } of commands) {
      const result = executeCommand(commandName, params);
      executedCommands.push({ command: commandName, result });
      
      // Remplacer la commande par les données dans la réponse
      const commandPattern = new RegExp(`\\[COMMAND:${commandName}(?:\\s+[^\\]]+)?\\]`, 'g');
      const dataText = result.error ? `Erreur: ${result.error}` : JSON.stringify(result.data, null, 2);
      processedResponse = processedResponse.replace(commandPattern, `\n\n**Données récupérées:**\n\`\`\`json\n${dataText}\n\`\`\`\n`);
    }
    
    return {
      originalResponse: aiResponse,
      processedResponse,
      executedCommands,
      hasCommands: commands.length > 0
    };
  } catch (error) {
    console.error("Erreur lors du traitement de la réponse IA:", error);
    return {
      originalResponse: aiResponse,
      processedResponse: aiResponse,
      executedCommands: [],
      hasCommands: false,
      error: error.message
    };
  }
};

/**
 * Envoie un message à l'API IA avec gestion des fichiers
 * @param {string} message - Message à envoyer
 * @param {File|null} file - Fichier joint (optionnel)
 * @param {Object} config - Configuration additionnelle
 * @returns {Promise<Object>} Réponse de l'API
 */
export const sendMessageToAI = async (message, file = null, config = {}) => {
  try {
    const apiUrl = getApiUrl();
    const formData = new FormData();
    
    // Ajouter le prompt système au message
    const systemPrompt = createSystemPrompt();
    const fullMessage = `${systemPrompt}\n\nUtilisateur: ${message}`;
    
    formData.append('message', fullMessage);
    formData.append('user_id', config.userId || 'default_user');
    
    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Extraire la réponse du format retourné par le serveur Python
    const aiResponse = data.reply || data.response || data.message || '';
    
    // Traiter la réponse pour exécuter les commandes
    const processedData = await processAIResponse(aiResponse);
    
    return {
      success: true,
      response: processedData.processedResponse,
      originalResponse: processedData.originalResponse,
      executedCommands: processedData.executedCommands,
      hasCommands: processedData.hasCommands,
      usage: data.usage // Inclure les informations d'usage si disponibles
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message à l'IA:", error);
    return {
      success: false,
      error: error.message,
      response: null
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
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'file_too_large'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'unsupported_file'
    };
  }
  
  return {
    valid: true,
    error: null
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
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
    return false;
  }
};

/**
 * Lecture à haute voix d'un texte
 * @param {string} text - Texte à lire
 * @param {string} language - Langue (fr, en, etc.)
 */
export const readTextAloud = (text, language = 'fr') => {
  try {
    if ('speechSynthesis' in window) {
      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Français' ? 'fr-FR' : language === 'Anglais' ? 'en-US' : 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    return false;
  }
};

/**
 * Arrête la lecture en cours
 */
export const stopReading = () => {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (error) {
    console.error('Erreur lors de l\'arrêt de la lecture:', error);
  }
};

/**
 * Formate un message pour l'affichage avec support markdown
 * @param {string} text - Texte à formater
 * @returns {string} Texte formaté
 */
export const formatMessage = (text) => {
  if (!text) return '';
  
  // Nettoyer le texte des commandes restantes
  let cleanText = text.replace(/\[COMMAND:[^\]]+\]/g, '');
  
  // Nettoyer les espaces multiples
  cleanText = cleanText.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return cleanText.trim();
};

/**
 * Génère un titre pour un chat basé sur le premier message
 * @param {string} message - Premier message du chat
 * @returns {string} Titre généré
 */
export const generateChatTitle = (message) => {
  if (!message) return 'Nouveau chat';
  
  // Prendre les premiers mots et limiter la longueur
  const words = message.trim().split(' ').slice(0, 6);
  let title = words.join(' ');
  
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title || 'Nouveau chat';
};

/**
 * Gère les raccourcis clavier
 * @param {KeyboardEvent} event - Événement clavier
 * @param {Object} handlers - Gestionnaires d'événements
 */
export const handleKeyboardShortcuts = (event, handlers) => {
  // Échap pour fermer les popups
  if (event.key === 'Escape' && handlers.onEscape) {
    handlers.onEscape();
  }
  
  // Ctrl+Enter pour nouvelle ligne (géré dans le composant input)
  // Enter pour envoyer (géré dans le composant input)
};

/**
 * Utilitaires pour la gestion des animations de typing
 */
export const createTypingAnimation = (text, callback, speed = 30) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      callback(text.substring(0, index + 1));
      index++;
    } else {
      clearInterval(interval);
    }
  }, speed);
  
  return interval;
};

export default {
  getApiUrl,
  generateUniqueId,
  saveChatToStorage,
  getChatsFromStorage,
  deleteChatFromStorage,
  deleteAllChatsFromStorage,
  createSystemPrompt,
  processAIResponse,
  sendMessageToAI,
  validateFile,
  copyToClipboard,
  readTextAloud,
  stopReading,
  formatMessage,
  generateChatTitle,
  handleKeyboardShortcuts,
  createTypingAnimation
};