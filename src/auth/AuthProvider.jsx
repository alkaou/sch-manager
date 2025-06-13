// AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import {
  subscribeToAuthChanges,
  signInWithGoogle,
  logoutUser,
} from './firebaseService';
import { getUserPremiumData, createOrUpdateUser } from './firebaseFirestore';
import secureLocalStorage from 'react-secure-storage';
import { useLanguage } from '../components/contexts';
import translations from './auth_translator';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const { language } = useLanguage();
  
  // Translation helper function
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Fonction de vérification de la connectivité via une requête de test
  const checkInternetConnection = async () => {
    // Vérifier d'abord l'état du navigateur pour éviter un fetch inutile
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    try {
      const response = await fetch('https://example.com', {
        method: 'GET',
        // Décommentez le mode suivant si vous rencontrez des problèmes de CORS
        mode: "no-cors",
      });

      // console.log(response.status);

      // On considère que la connexion est bonne si le status est dans la plage 200-299
      if (response && response.status === 0) {
        setIsOnline(true);
        return true;
      } else {
        setIsOnline(false);
        return false;
      }
    } catch (err) {
      // L'erreur est normale si l'internet est coupé, évitant ainsi des logs trop verbeux en prod.
      // console.error('Erreur lors de la vérification de la connexion Internet :', err);
      setIsOnline(false);
      return false;
    }
  };

  useEffect(() => {
    // Vérification initiale dès le montage du composant
    checkInternetConnection();

    // Planification périodique de la vérification de la connexion (par exemple, toutes les 10 secondes)
    // const intervalId = setInterval(checkInternetConnection, 10000);

    // Nettoyage lors du démontage du composant
    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Vérification du cache local (optionnel)
    const cachedUser = secureLocalStorage.getItem('authUser');
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    // Exécuter l'abonnement aux changements d'authentification uniquement si la connexion est détectée.
    if (isOnline) {
      const unsubscribe = subscribeToAuthChanges(async (user) => {
        setLoading(true);
        // console.log(user);
        if (user) {
          // Créer ou mettre à jour le document utilisateur dans Firestore
          await createOrUpdateUser(user);
          // Récupérer les données premium stockées dans Firestore
          const firestoreUserData = await getUserPremiumData(user.uid);
          // Fusionner les informations provenant de Firebase Auth et de Firestore
          const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            isPremium: firestoreUserData?.isPremium ?? false,
            buyed_times: firestoreUserData?.buyed_times || 0,
            payment_startedAt: firestoreUserData?.payment_startedAt || null,
            payment_endedAt: firestoreUserData?.payment_endedAt || null,
          };
          setCurrentUser(userData);
          secureLocalStorage.setItem('authUser', userData);
        } else {
          setCurrentUser(null);
          secureLocalStorage.removeItem('authUser');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOnline]);

  // Fonction de connexion via Google
  const login = async () => {
    const isInternet = await checkInternetConnection();
    // console.log("internet est : " + isInternet);
    if(!isInternet) {
      alert(t('connection_error'));
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      alert(t('login_error'));
      // console.error('Erreur lors de la connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    // const isInternet = await checkInternetConnection();
    // if(!isInternet) {
      // alert("Veuillez s'il vous plaît vérifier votre connexion internet !");
      // return;
    // }
    try {
      setLoading(true);
      await logoutUser();
    } catch (err) {
      setError(err.message);
      alert(t('logout_error'));
      // console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkInternetConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
