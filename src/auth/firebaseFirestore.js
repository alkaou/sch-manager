// firebaseFirestore.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseService';


/**
 * Crée ou met à jour l'utilisateur dans Firestore.
 * Par défaut, isPremium est défini sur false pour un nouvel utilisateur.
 */
export const createOrUpdateUser = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  const userData = {
    displayName: user.displayName,
    email: user.email,
    // Pour les nouveaux utilisateurs, on définit isPremium à false
    isPremium: false,
    ...additionalData,
  };

  if (!snapshot.exists()) {
    // Création du document
    await setDoc(userRef, userData);
  } else {
    // On peut fusionner les données existantes
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
export const updatePremiumStatus = async (uid, isPremium, paymentStartedAt, paymentEndedAt) => {
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    isPremium,
    payment_startedAt: paymentStartedAt || null,
    payment_endedAt: paymentEndedAt || null
  });
};

/**
* // Exemple d'appel lors d'une confirmation de paiement
* const uid = currentUser.uid;
* const now = new Date();
* const premiumDurationDays = 30; // par exemple, 30 jours d'abonnement
* const expirationDate = new Date(now.getTime() + premiumDurationDays * 24 * 60 * 60 * 1000);
* await updatePremiumStatus(uid, true, now, expirationDate);
*/