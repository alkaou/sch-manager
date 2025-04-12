// firebaseFirestore.js
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseService';


/**
 * Crée ou met à jour l'utilisateur dans Firestore.
 * Par défaut, isPremium est défini sur false pour un nouvel utilisateur.
*/
// Fonction pour créer ou mettre à jour l'utilisateur dans Firestore
export const createOrUpdateUser = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  const userData = {
    displayName: user.displayName,
    email: user.email,
    isPremium: false,
    ...additionalData,
  };

  if (!snapshot.exists()) {
    await setDoc(userRef, userData);
  } else {
    await updateDoc(userRef, userData);
  }
};

/**
 * Récupère les données premium (et autres) de l'utilisateur stockées dans Firestore.
 */
export const getUserPremiumData = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

/**
* Met à jour le statut premium d'un utilisateur dans Firestore.
*
* @param {string} uid - L'uid de l'utilisateur.
* @param {boolean} isPremium - Statut premium.
* @param {Date} paymentStartedAt - Date de début du paiement.
* @param {Date} paymentEndedAt - Date d'expiration de l'abonnement.
*/
export const updatePremiumStatus = async (uid, isPremium, buyed_times, paymentStartedAt, paymentEndedAt) => {
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    isPremium,
    buyed_times: buyed_times || 0,
    payment_startedAt: paymentStartedAt || null,
    payment_endedAt: paymentEndedAt || null
  });
};

/**
 * Récupère les bases de données de l'utilisateur.
 * @param {string} uid - L'uid de l'utilisateur.
 * @returns {Promise<Array>} - Liste des bases de données.
 */
export const getUserDatabases = async (uid) => {
  if (!uid) return [];
  
  try {
    const databasesRef = collection(db, 'users', uid, 'databases');
    const snapshot = await getDocs(databasesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching user databases:", error);
    return [];
  }
};

/**
* // Exemple d'appel lors d'une confirmation de paiement
* const uid = currentUser.uid;
* const now = new Date();
* const premiumDurationDays = 30; // par exemple, 30 jours d'abonnement
* const expirationDate = new Date(now.getTime() + premiumDurationDays * 24 * 60 * 60 * 1000);
* await updatePremiumStatus(uid, true, now, expirationDate);
*/