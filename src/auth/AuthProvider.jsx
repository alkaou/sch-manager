// AuthProvider.js
import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import {
  subscribeToAuthChanges,
  createOrUpdateUser,
  signInWithGoogle,
  logoutUser
} from './firebaseService';
import { getUserPremiumData } from './firebaseFirestore';
import secureLocalStorage from 'react-secure-storage';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérification du cache local (optionnel)
    const cachedUser = secureLocalStorage.getItem('authUser');
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    // Abonnement aux changements d'authentification
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setLoading(true);
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
  }, []);

  // Fonction de connexion via Google
  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      // L'appel à signInWithGoogle déclenche la redirection vers Google et,
      // le callback de subscribeToAuthChanges prendra ensuite le relais
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la déconnexion:", err);
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
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
