// informations_methodes.js
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../auth/firebaseService.js';
import secureLocalStorage from "react-secure-storage";

/**
 * Récupère toutes les informations depuis Firestore
 * @returns {Promise<Array>} Liste des informations triées par date de création (plus récent en premier)
 */
export const getAllInformations = async () => {
  try {
    const informationsRef = collection(db, 'informations');
    const q = query(informationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const informations = [];
    querySnapshot.forEach((doc) => {
      informations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      });
    });
    
    return informations;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    throw error;
  }
};

/**
 * Récupère une information spécifique par son ID
 * @param {string} informationId - L'ID de l'information
 * @returns {Promise<Object|null>} L'information ou null si non trouvée
 */
export const getInformationById = async (informationId) => {
  try {
    const informationRef = doc(db, 'informations', informationId);
    const docSnap = await getDoc(informationRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'information:', error);
    throw error;
  }
};

/**
 * Écoute les changements en temps réel des informations
 * @param {Function} callback - Fonction appelée lors des changements
 * @returns {Function} Fonction pour arrêter l'écoute
 */
export const listenToInformations = (callback) => {
  try {
    const informationsRef = collection(db, 'informations');
    const q = query(informationsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const informations = [];
      querySnapshot.forEach((doc) => {
        informations.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        });
      });
      callback(informations);
    }, (error) => {
      console.error('Erreur lors de l\'écoute des informations:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Erreur lors de la configuration de l\'écoute:', error);
    return () => {};
  }
};

/**
 * Gère l'état des informations lues avec react-secure-storage
 */
const READ_INFORMATIONS_KEY = 'read_informations_ids';

/**
 * Récupère les IDs des informations déjà lues
 * @returns {Array<string>} Liste des IDs des informations lues
 */
export const getReadInformationsIds = () => {
  try {
    const readIds = secureLocalStorage.getItem(READ_INFORMATIONS_KEY);
    return readIds ? JSON.parse(readIds) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des informations lues:', error);
    return [];
  }
};

/**
 * Marque une information comme lue
 * @param {string} informationId - L'ID de l'information à marquer comme lue
 */
export const markInformationAsRead = (informationId) => {
  try {
    const readIds = getReadInformationsIds();
    if (!readIds.includes(informationId)) {
      readIds.push(informationId);
      secureLocalStorage.setItem(READ_INFORMATIONS_KEY, JSON.stringify(readIds));
    }
  } catch (error) {
    console.error('Erreur lors du marquage de l\'information comme lue:', error);
  }
};

/**
 * Marque plusieurs informations comme lues
 * @param {Array<string>} informationIds - Liste des IDs à marquer comme lus
 */
export const markMultipleInformationsAsRead = (informationIds) => {
  try {
    const readIds = getReadInformationsIds();
    const newReadIds = [...new Set([...readIds, ...informationIds])];
    secureLocalStorage.setItem(READ_INFORMATIONS_KEY, JSON.stringify(newReadIds));
  } catch (error) {
    console.error('Erreur lors du marquage multiple des informations comme lues:', error);
  }
};

/**
 * Vérifie si une information a été lue
 * @param {string} informationId - L'ID de l'information
 * @returns {boolean} True si l'information a été lue
 */
export const isInformationRead = (informationId) => {
  const readIds = getReadInformationsIds();
  return readIds.includes(informationId);
};

/**
 * Récupère les informations non lues
 * @param {Array<Object>} informations - Liste de toutes les informations
 * @returns {Array<Object>} Liste des informations non lues
 */
export const getUnreadInformations = (informations) => {
  const readIds = getReadInformationsIds();
  return informations.filter(info => !readIds.includes(info.id));
};

/**
 * Formate une date selon la locale
 * @param {Date} date - La date à formater
 * @param {string} language - La langue pour le formatage
 * @returns {string} Date formatée
 */
export const formatDate = (date, language = 'Français') => {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const locale = {
    'Français': 'fr-FR',
    'Anglais': 'en-US',
    'Bambara': 'fr-FR' // Utilise le français comme fallback pour Bambara
  };
  
  return date.toLocaleDateString(locale[language] || 'fr-FR', options);
};

/**
 * Détermine le type de média (image, vidéo, etc.)
 * @param {string} mediaUrl - URL du média
 * @returns {string} Type de média ('image', 'video', 'unknown')
 */
export const getMediaType = (mediaUrl) => {
  if (!mediaUrl) return 'unknown';
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
  
  const lowerUrl = mediaUrl.toLowerCase();
  
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'image';
  }
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'video';
  }
  
  // Vérification par type MIME si disponible
  if (lowerUrl.includes('image/')) return 'image';
  if (lowerUrl.includes('video/')) return 'video';
  
  return 'unknown';
};

/**
 * Filtre les informations par terme de recherche
 * @param {Array<Object>} informations - Liste des informations
 * @param {string} searchTerm - Terme de recherche
 * @returns {Array<Object>} Informations filtrées
 */
export const filterInformationsBySearch = (informations, searchTerm) => {
  if (!searchTerm.trim()) return informations;
  
  const term = searchTerm.toLowerCase();
  return informations.filter(info => 
    info.title?.toLowerCase().includes(term) ||
    info.descriptions?.toLowerCase().includes(term) ||
    info.contact?.toLowerCase().includes(term)
  );
};

/**
 * Trie les informations par date
 * @param {Array<Object>} informations - Liste des informations
 * @param {string} sortOrder - 'newest' ou 'oldest'
 * @returns {Array<Object>} Informations triées
 */
export const sortInformationsByDate = (informations, sortOrder = 'newest') => {
  return [...informations].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
};