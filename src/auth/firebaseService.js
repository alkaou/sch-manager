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
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force l'affichage du popup pour sélectionner un compte
});

// Connexion avec Google via pop-up
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    alert("Erreur lors de la connexion à votre compte !");
    throw error;
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert("Erreur lors de la déconnexion !");
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
