// API pour les notifications externes
import { createExternalNotificationFromURL } from '../components/notifications/notifications.js';

/**
 * API pour recevoir des notifications externes via URL
 * Exemple d'utilisation:
 * POST /api/notifications/external
 * {
 *   "title": "Mise à jour importante",
 *   "message": "Le système sera en maintenance demain de 14h à 16h.",
 *   "type": "warning",
 *   "priority": "high",
 *   "icon": "warning"
 * }
 */

// Simuler une API REST pour les notifications externes
export class NotificationAPI {
  static baseURL = '/api/notifications';

  // Créer une notification externe
  static async createExternalNotification(data) {
    try {
      // Validation des données
      if (!data.title || !data.message) {
        throw new Error('Title and message are required');
      }

      // Créer la notification
      const notification = createExternalNotificationFromURL({
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        priority: data.priority || 'normal',
        icon: data.icon || 'mail'
      });

      return {
        success: true,
        notification,
        message: 'Notification created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simuler l'endpoint pour recevoir des notifications via URL
  static async handleWebhook(request) {
    try {
      const data = await request.json();
      return await this.createExternalNotification(data);
    } catch (error) {
      return {
        success: false,
        error: 'Invalid JSON data'
      };
    }
  }
}

// Fonction utilitaire pour envoyer une notification de test
export const sendTestNotification = () => {
  return NotificationAPI.createExternalNotification({
    title: "Notification de test",
    message: "Ceci est une notification de test envoyée par l'administrateur.",
    type: "info",
    priority: "normal",
    icon: "mail"
  });
};

// Fonction pour envoyer une notification de mise à jour
export const sendUpdateNotification = (version, changes) => {
  return NotificationAPI.createExternalNotification({
    title: `Mise à jour ${version} disponible`,
    message: `Nouvelles fonctionnalités: ${changes}`,
    type: "info",
    priority: "high",
    icon: "system"
  });
};

// Fonction pour envoyer une notification de maintenance
export const sendMaintenanceNotification = (startTime, endTime) => {
  return NotificationAPI.createExternalNotification({
    title: "Maintenance programmée",
    message: `Le système sera en maintenance de ${startTime} à ${endTime}. Veuillez sauvegarder votre travail.`,
    type: "warning",
    priority: "high",
    icon: "warning"
  });
};

// Fonction pour envoyer une notification de politique
export const sendPolicyNotification = (policyName, description) => {
  return NotificationAPI.createExternalNotification({
    title: `Nouvelle politique: ${policyName}`,
    message: description,
    type: "info",
    priority: "normal",
    icon: "info"
  });
};

export default NotificationAPI;