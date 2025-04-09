import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import {
  subscribeToAuthChanges,
  signInWithGoogle,
  logoutUser
} from './firebaseService';
import secureLocalStorage from 'react-secure-storage';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mise en place de l'abonnement aux changements d'authentification
  useEffect(() => {
    // Vérification du cache local (optionnel)
    const cachedUser = secureLocalStorage.getItem('authUser');
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    // Abonnement aux changements d'authentification
    const unsubscribe = subscribeToAuthChanges((user) => {
      setLoading(true);
      if (user) {
        // Simplification de l'objet utilisateur
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isPremium: false // Vous pouvez le mettre à jour via votre backend si nécessaire
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

  // Connexion avec Google via popup
  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      // L'appel renverra l'utilisateur authentifié via signInWithGoogle
      await signInWithGoogle();
      // Le listener onAuthStateChanged mettra à jour currentUser
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      // Le listener mettra à jour l'état de currentUser
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
