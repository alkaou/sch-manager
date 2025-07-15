import { translate } from "../events/events_translator.js";
import secureLocalStorage from "react-secure-storage";

// Types de notifications
export const NOTIFICATION_TYPES = {
  EVENT_REMINDER: "event_reminder",
  SYSTEM: "system",
  EXTERNAL: "external",
  INFO: "info",
  WARNING: "warning",
  SUCCESS: "success",
  ERROR: "error",
};

// Gestionnaire de notifications global
class NotificationManager {
  constructor() {
    this.notifications = this.loadNotificationsFromStorage();
    this.listeners = [];
    this.nextId = this.getNextId();
    this.eventCheckInterval = null;
    this.initializeEventMonitoring();
  }

  // Charger les notifications depuis secureLocalStorage
  loadNotificationsFromStorage() {
    try {
      const storedNotifications = secureLocalStorage.getItem("notifications");
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
      return [];
    }
  }

  // Sauvegarder les notifications dans secureLocalStorage
  saveNotificationsToStorage() {
    try {
      secureLocalStorage.setItem(
        "notifications",
        JSON.stringify(this.notifications)
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notifications:", error);
    }
  }

  // Obtenir le prochain ID disponible
  getNextId() {
    try {
      const lastId = secureLocalStorage.getItem("lastNotificationId");
      return lastId ? parseInt(lastId) + 1 : 1;
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier ID:", error);
      return 1;
    }
  }

  // Sauvegarder le dernier ID utilisé
  saveLastId() {
    try {
      secureLocalStorage.setItem("lastNotificationId", this.nextId.toString());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du dernier ID:", error);
    }
  }

  // Initialiser la surveillance des événements
  initializeEventMonitoring() {
    // console.log('🔄 Initialisation de la surveillance des événements...');
    
    // Vérifier immédiatement
    this.checkUpcomingEvents();
    
    // Vérifier les événements toutes les minutes
    this.eventCheckInterval = setInterval(() => {
      this.checkUpcomingEvents();
    }, 60000); // 60 secondes
    
    // console.log('✅ Surveillance des événements activée (vérification chaque minute)');
  }

  // Vérifier les événements à venir
  async checkUpcomingEvents() {
    try {
      const events = await this.getEventsFromStorage();
      const now = new Date();
      
      // console.log(`🔍 Vérification de ${events.length} événements...`);

      let notificationsCreated = 0;
      
      // Traiter les événements séquentiellement pour éviter les conflits
      for (const event of events) {
        if (this.shouldNotifyForEvent(event, now)) {
          // console.log(`📅 Création de notification pour l'événement: ${event.title}`);
          await this.createEventNotification(event);
          notificationsCreated++;
        }
      }
      
      if (notificationsCreated > 0) {
        console.log(`✅ ${notificationsCreated} notification(s) d'événement créée(s)`);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des événements:", error);
    }
  }

  // Récupérer les événements depuis le stockage
  async getEventsFromStorage() {
    try {
      // Récupérer depuis la base de données Electron
      if (window.electron && window.electron.getDatabase) {
        const database = await window.electron.getDatabase();
        // console.log(database);
        return database.events || [];
      }
      
      // Fallback vers localStorage
      const eventsData = localStorage.getItem("events");
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      return [];
    }
  }

  // Marquer un événement comme ayant envoyé sa notification
  async markEventNotificationSent(eventId) {
    try {
      if (window.electron && window.electron.getDatabase && window.electron.saveDatabase) {
        const database = await window.electron.getDatabase();
        
        if (database.events) {
          const eventIndex = database.events.findIndex(e => e.id === eventId);
          if (eventIndex !== -1) {
            database.events[eventIndex].notificationsIsSended = true;
            await window.electron.saveDatabase(database);
            // console.log(`✅ Événement ${eventId} marqué comme notification envoyée (Electron DB)`);
          }
        }
      } else {
        // Fallback vers localStorage
        const eventsData = localStorage.getItem("events");
        if (eventsData) {
          const events = JSON.parse(eventsData);
          const eventIndex = events.findIndex(e => e.id === eventId);
          if (eventIndex !== -1) {
            events[eventIndex].notificationsIsSended = true;
            localStorage.setItem("events", JSON.stringify(events));
            console.log(`✅ Événement ${eventId} marqué comme notification envoyée (localStorage)`);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du marquage de l'événement:", error);
    }
  }

  // Vérifier si on doit notifier pour un événement
  shouldNotifyForEvent(event, now) {
    // Vérifier si l'événement a déjà envoyé sa notification
    if (event.notificationsIsSended) {
      return false;
    }

    // Vérifier si l'événement est validé (passé)
    if (event.validation) {
      return false;
    }

    // Utiliser startDate et startTime pour la nouvelle structure
    const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const timeDiff = eventDateTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Notifier UNIQUEMENT si l'événement commence dans exactement 30 minutes (±1 minute de tolérance)
    // Cela évite les notifications répétées chaque minute
    return minutesDiff >= 29 && minutesDiff <= 31;
  }

  // Créer une notification d'événement
  async createEventNotification(event) {
    const language = this.getCurrentLanguage();

    // Marquer IMMÉDIATEMENT l'événement comme ayant envoyé sa notification
    // pour éviter les doublons pendant le traitement
    await this.markEventNotificationSent(event.id);

    // Synthèse vocale avant la notification
    this.speakEventReminder(event, language);

    // Créer la notification
    const notification = {
      id: this.nextId,
      type: NOTIFICATION_TYPES.EVENT_REMINDER,
      eventId: event.id,
      title: translate("event_reminder_title", language),
      message: this.formatEventReminderMessage(event, language),
      time: new Date().toISOString(),
      read: false,
      priority: "high",
      icon: "calendar",
      actions: [
        {
          label: translate("view_event", language),
          action: "view_event",
          eventId: event.id,
        },
        {
          label: translate("dismiss", language),
          action: "dismiss",
        },
      ],
    };

    this.addNotification(notification);
  }

  // Synthèse vocale pour les rappels d'événements
  speakEventReminder(event, language) {
    if (!("speechSynthesis" in window)) {
      // console.warn("Synthèse vocale non supportée par ce navigateur");
      return;
    }

    // Ne pas parler en Bambara
    // if (language === "Bambara") {
    //   return;
    // }

    // Calculer le temps exact restant
    const eventTime = new Date(`${event.startDate}T${event.startTime}`);
    const now = new Date();
    const timeDiff = eventTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    let message = "";
    if (language === "Français" || language === "Bambara") {
      message = `Coucou, Votre événement ${event.title} va se débuter dans ${minutesDiff} minutes. Bonne chance.`;
    } else {
      message = `Hello, Your event ${event.title} will start in ${minutesDiff} minutes. Good luck.`;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === "Français" ? "fr-FR" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    speechSynthesis.speak(utterance);
  }

  // Formater le message de rappel d'événement
  formatEventReminderMessage(event, language) {
    const eventTime = new Date(`${event.startDate}T${event.startTime}`);
    const now = new Date();
    const timeDiff = eventTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    const timeString = eventTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (language === "Français") {
      return `L'événement "${event.title}" commence dans ${minutesDiff} minutes à ${timeString}.`;
    } else if (language === "Anglais") {
      return `The event "${event.title}" starts in ${minutesDiff} minutes at ${timeString}.`;
    } else {
      return `Ko kɛlen "${event.title}" bɛ daminɛ miniti ${minutesDiff} kɔnɔ ${timeString} la.`;
    }
  }

  // Obtenir la langue actuelle
  getCurrentLanguage() {
    return localStorage.getItem("selectedLanguage") || "Français";
  }

  // Ajouter une notification
  addNotification(notification) {
    this.notifications.unshift(notification);
    this.nextId++;
    this.saveLastId();
    this.saveNotificationsToStorage();
    this.notifyListeners();

    // Limiter le nombre de notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
      this.saveNotificationsToStorage();
    }
  }

  // Créer une notification système
  createSystemNotification(
    title,
    message,
    type = NOTIFICATION_TYPES.INFO,
    options = {}
  ) {
    const language = this.getCurrentLanguage();

    const notification = {
      id: this.nextId,
      type,
      title: translate(title, language) || title,
      message: translate(message, language) || message,
      time: new Date().toISOString(),
      read: false,
      priority: options.priority || "normal",
      icon: options.icon || "info",
      ...options,
    };

    this.addNotification(notification);
    return notification;
  }

  // Créer une notification externe (non traduite)
  createExternalNotification(title, message, options = {}) {
    const notification = {
      id: this.nextId,
      type: NOTIFICATION_TYPES.EXTERNAL,
      title,
      message,
      time: new Date().toISOString(),
      read: false,
      priority: options.priority || "normal",
      icon: options.icon || "mail",
      isExternal: true,
      ...options,
    };

    this.addNotification(notification);
    return notification;
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotificationsToStorage();
      this.notifyListeners();
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    let hasChanges = false;
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveNotificationsToStorage();
      this.notifyListeners();
    }
  }

  // Supprimer une notification
  removeNotification(notificationId) {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );

    if (this.notifications.length !== initialLength) {
      this.saveNotificationsToStorage();
      this.notifyListeners();
    }
  }

  // Supprimer toutes les notifications
  clearAllNotifications() {
    if (this.notifications.length > 0) {
      this.notifications = [];
      this.saveNotificationsToStorage();
      this.notifyListeners();
    }
  }

  // Obtenir toutes les notifications (triées de la plus récente à la plus ancienne)
  getAllNotifications() {
    return this.notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter((n) => !n.read);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Ajouter un écouteur
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Supprimer un écouteur
  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  // Notifier tous les écouteurs
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error("Erreur dans l'écouteur de notifications:", error);
      }
    });
  }

  // Nettoyer les ressources
  destroy() {
    if (this.eventCheckInterval) {
      clearInterval(this.eventCheckInterval);
    }
    this.listeners = [];
    this.notifications = [];
  }
}

// Instance globale du gestionnaire de notifications
export const notificationManager = new NotificationManager();

// API pour les notifications externes (via URL)
export const createExternalNotificationFromURL = (params) => {
  const { title, message, type, priority, icon } = params;

  return notificationManager.createExternalNotification(title, message, {
    type: type || NOTIFICATION_TYPES.EXTERNAL,
    priority: priority || "normal",
    icon: icon || "mail",
  });
};

// Notifications par défaut pour la compatibilité (vide par défaut)
export const all_notifications = [];

// Le gestionnaire démarre sans notifications par défaut
// Les notifications seront chargées depuis secureLocalStorage

// Exporter les fonctions utilitaires
export const createSystemNotification = (title, message, type, options) =>
  notificationManager.createSystemNotification(title, message, type, options);

export const createExternalNotification = (title, message, options) =>
  notificationManager.createExternalNotification(title, message, options);

export const markAsRead = (notificationId) => {
  if (!notificationManager) {
    console.warn("NotificationManager not initialized");
    return;
  }
  notificationManager.markAsRead(notificationId);
};

export const markAllAsRead = () => {
  if (!notificationManager) {
    console.warn("NotificationManager not initialized");
    return;
  }
  notificationManager.markAllAsRead();
};

export const removeNotification = (notificationId) =>
  notificationManager.removeNotification(notificationId);

export const clearAllNotifications = () =>
  notificationManager.clearAllNotifications();

export const getAllNotifications = () => {
  if (!notificationManager || !notificationManager.notifications) {
    return [];
  }
  return notificationManager.getAllNotifications();
};

export const getUnreadNotifications = () => {
  if (!notificationManager || !notificationManager.notifications) {
    return [];
  }
  return notificationManager.getUnreadNotifications();
};

export const getUnreadCount = () => {
  if (!notificationManager || !notificationManager.notifications) {
    return 0;
  }
  return notificationManager.getUnreadCount();
};

export const addListener = (callback) => {
  if (!notificationManager) {
    console.warn("NotificationManager not initialized");
    return;
  }
  notificationManager.addListener(callback);
};

export const removeListener = (callback) => {
  if (!notificationManager) {
    console.warn("NotificationManager not initialized");
    return;
  }
  notificationManager.removeListener(callback);
};

// Fonctions utilitaires pour les événements
export const createEventReminder = (event, language) =>
  notificationManager.createEventReminder(event, language);

export const speakEventReminder = (event, language) =>
  notificationManager.speakEventReminder(event, language);

export const checkUpcomingEvents = (events) =>
  notificationManager.checkUpcomingEvents(events);

export const startEventMonitoring = (events) =>
  notificationManager.startEventMonitoring(events);

export const stopEventMonitoring = () =>
  notificationManager.stopEventMonitoring();
