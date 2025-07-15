// Script pour créer des notifications de test
import {
  createSystemNotification,
  createExternalNotification,
  getAllNotifications,
  clearAllNotifications,
} from "../components/notifications/notifications.js";

// Créer des notifications de test avec des timestamps différents
export function createTestNotifications() {
  console.log("Création de notifications de test...");
  
  // Nettoyer d'abord
  clearAllNotifications();
  
  // Créer des notifications avec des délais pour tester le tri
  setTimeout(() => {
    createSystemNotification(
      "Première notification",
      "Cette notification a été créée en premier",
      "info",
      { priority: "normal", icon: "info" }
    );
  }, 100);
  
  setTimeout(() => {
    createSystemNotification(
      "Deuxième notification",
      "Cette notification a été créée en deuxième",
      "success",
      { priority: "normal", icon: "success" }
    );
  }, 200);
  
  setTimeout(() => {
    createExternalNotification(
      "Notification externe",
      "Cette notification vient de l'extérieur",
      { priority: "high", icon: "mail" }
    );
  }, 300);
  
  setTimeout(() => {
    createSystemNotification(
      "Notification urgente",
      "Cette notification est urgente",
      "warning",
      { priority: "high", icon: "warning" }
    );
  }, 400);
  
  setTimeout(() => {
    createSystemNotification(
      "Dernière notification",
      "Cette notification a été créée en dernier (devrait être en premier dans la liste)",
      "error",
      { priority: "high", icon: "error" }
    );
  }, 500);
  
  // Afficher les résultats après création
  setTimeout(() => {
    const notifications = getAllNotifications();
    console.log("Notifications créées (triées par date):");
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. [ID: ${notif.id}] ${notif.title} - ${new Date(notif.time).toLocaleTimeString()}`);
    });
  }, 1000);
}

// Auto-exécution si dans le navigateur
if (typeof window !== 'undefined') {
  window.createTestNotifications = createTestNotifications;
  
  // Créer automatiquement les notifications de test
  setTimeout(() => {
    createTestNotifications();
  }, 2000);
}