// firebaseService.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
// Initialiser Auth
const auth = getAuth(app);
// Initialiser Firestore
export const db = getFirestore(app);

// Provider Google
const googleProvider = new GoogleAuthProvider();

// Connexion avec Google via pop-up
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erreur lors du signInWithPopup:", error);
    throw error;
  }
};

// Fonction pour créer ou mettre à jour l'utilisateur dans Firestore
export const createOrUpdateUser = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  const userData = {
    displayName: user.displayName,
    email: user.email,
    // Par défaut, isPremium est false ; cette valeur pourra être mise à jour ultérieurement (ex. via un paiement validé)
    isPremium: false,
    ...additionalData,
  };

  if (!snapshot.exists()) {
    // Création du document utilisateur
    await setDoc(userRef, userData);
  } else {
    // Mise à jour (merge) du document utilisateur
    await updateDoc(userRef, userData);
  }
};


// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Écoute des changements d’état d’authentification
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Optionnel : récupérer l'utilisateur actuellement authentifié
export const getCurrentUser = () => {
  return auth.currentUser;
};

export default auth;
