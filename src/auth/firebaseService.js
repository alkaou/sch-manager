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
  getFirestore
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
// import { useLanguage } from '../components/contexts';
import translations from './auth_translator';

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

// Helper function to get translations
const getTranslation = (key) => {
  try {
    // Try to get the current language from localStorage as a fallback
    const storedLanguage = localStorage.getItem('app_language') || 'Français';
    return translations[key][storedLanguage] || translations[key]['Français'];
  } catch (e) {
    // Fallback to French if something goes wrong
    return translations[key]['Français'];
  }
};

// Connexion avec Google via pop-up
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    alert(getTranslation('login_account_error'));
    throw error;
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(getTranslation('logout_firebase_error'));
    throw error;
  }
};

// Écoute des changements d'état d'authentification
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Optionnel : récupérer l'utilisateur actuellement authentifié
export const getCurrentUser = () => {
  return auth.currentUser;
};

export default auth;
