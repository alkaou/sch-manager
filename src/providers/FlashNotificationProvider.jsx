// src/FlashNotificationProvider.js
import React, { useState, useCallback } from "react";
// Import des icônes depuis React Lucide
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { FlashNotificationContext } from "../components/contexts";

const FlashNotificationProvider = ({ children }) => {
  // État de la notification avec des paramètres personnalisables
  const [flash, setFlash] = useState({
    message: "",
    type: "info", // types possibles : 'success', 'error', 'warning', 'info'
    visible: false,
    duration: 3000, // durée par défaut en ms
  });

  // Fonction pour déclencher une notification
  const setFlashMessage = useCallback(
    ({ message, type = "info", duration = 3000 }) => {
      setFlash({ message, type, visible: true, duration });
      // Masquer la notification après la durée spécifiée
      setTimeout(() => {
        setFlash((prev) => ({ ...prev, visible: false }));
      }, duration);
    },
    []
  );

  return (
    <FlashNotificationContext.Provider value={{ setFlashMessage }}>
      {children}
      <FlashNotification flash={flash} />
    </FlashNotificationContext.Provider>
  );
};

// Fonction utilitaire pour choisir l'icône en fonction du type de notification
const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-6 h-6 mr-2" />;
    case "error":
      return <XCircle className="w-6 h-6 mr-2" />;
    case "warning":
      return <AlertTriangle className="w-6 h-6 mr-2" />;
    case "info":
    default:
      return <Info className="w-6 h-6 mr-2" />;
  }
};

// Composant affichant la notification avec des animations avancées
const FlashNotification = ({ flash }) => {
  return (
    <div
      style={{ zIndex: 999999 }}
      className={`fixed bottom-5 right-5 transition-all duration-700 ease-in-out transform 
        ${
          flash.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
    >
      <div
        className={`flex items-center px-6 py-3 rounded-lg shadow-lg text-white
          ${flash.type === "success" && "bg-green-500"}
          ${flash.type === "error" && "bg-red-500"}
          ${flash.type === "warning" && "bg-yellow-500"}
          ${flash.type === "info" && "bg-blue-500"}
          custom-animation`}
      >
        {getIcon(flash.type)}
        <span>{flash.message}</span>
      </div>
    </div>
  );
};

export default FlashNotificationProvider;
