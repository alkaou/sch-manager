import { getFormattedDateTime, getDateTime } from "../../utils/helpers";
import { translate } from "./events_translator";

// Fonction pour générer un identifiant unique
const generateUniqueId = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().string(36).substr(2, 16);
};

// Types d'événements disponibles
export const EVENT_TYPES = [
  "football",
  "cultural_day",
  "closing_ceremony",
  "opening_ceremony",
  "graduation",
  "sports_competition",
  "science_fair",
  "art_exhibition",
  "parent_meeting",
  "workshop",
  "conference",
  "exam_period",
  "holiday",
  "training",
  "fundraising",
  "community_service",
  "field_trip",
  "talent_show",
  "book_fair",
  "other",
];

// Statuts d'événements
export const EVENT_STATUS = {
  PENDING: "pending",
  VALIDATED: "validated",
  ONGOING: "ongoing",
  PAST: "past",
};

// Validation des données d'événement
export const validateEventData = (eventData, language) => {
  const errors = {};

  // Validation du titre
  if (!eventData.title || eventData.title.trim().length === 0) {
    errors.title = translate("title_required", language);
  } else if (eventData.title.trim().length < 5) {
    errors.title = translate("title_min_length", language);
  } else if (eventData.title.trim().length > 150) {
    errors.title = translate("title_max_length", language);
  }

  // Validation de la description
  if (!eventData.description || eventData.description.trim().length === 0) {
    errors.description = translate("description_required", language);
  } else if (eventData.description.trim().length < 100) {
    errors.description = translate("description_min_length", language);
  } else if (eventData.description.trim().length > 10000) {
    errors.description = translate("description_max_length", language);
  }

  // Validation du type
  if (!eventData.type || !EVENT_TYPES.includes(eventData.type)) {
    errors.type = "Type d'événement invalide";
  }

  // Validation des dates
  if (!eventData.startDate) {
    errors.startDate = translate("start_date_required", language);
  }
  if (!eventData.endDate) {
    errors.endDate = translate("end_date_required", language);
  }

  // Validation de la plage de dates
  if (eventData.startDate && eventData.endDate) {
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    if (endDate < startDate) {
      errors.endDate = translate("invalid_date_range", language);
    }
  }

  // Validation des heures
  if (!eventData.startTime) {
    errors.startTime = translate("start_time_required", language);
  }
  if (!eventData.endTime) {
    errors.endTime = translate("end_time_required", language);
  }

  // Validation de la plage d'heures pour le même jour
  if (
    eventData.startDate &&
    eventData.endDate &&
    eventData.startTime &&
    eventData.endTime
  ) {
    if (eventData.startDate === eventData.endDate) {
      const startTime = eventData.startTime;
      const endTime = eventData.endTime;
      if (endTime <= startTime) {
        errors.endTime = translate("invalid_time_range", language);
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validation des données de validation d'événement
export const validateEventValidationData = (validationData, language) => {
  const errors = {};

  // Validation du succès
  if (!validationData.success || validationData.success.trim().length === 0) {
    errors.success = translate("success_required", language);
  } else if (validationData.success.trim().length < 100) {
    errors.success = translate("success_min_length", language);
  } else if (validationData.success.trim().length > 10000) {
    errors.success = translate("success_max_length", language);
  }

  // Validation de l'échec
  if (!validationData.failure || validationData.failure.trim().length === 0) {
    errors.failure = translate("failure_required", language);
  } else if (validationData.failure.trim().length < 100) {
    errors.failure = translate("failure_min_length", language);
  } else if (validationData.failure.trim().length > 10000) {
    errors.failure = translate("failure_max_length", language);
  }

  // Validation des remarques
  if (!validationData.remarks || validationData.remarks.trim().length === 0) {
    errors.remarks = translate("remarks_required", language);
  } else if (validationData.remarks.trim().length < 100) {
    errors.remarks = translate("remarks_min_length", language);
  } else if (validationData.remarks.trim().length > 10000) {
    errors.remarks = translate("remarks_max_length", language);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Déterminer le statut d'un événement
export const determineEventStatus = (event) => {
  const now = new Date();
  const startDate = new Date(`${event.startDate}T${event.startTime}`);
  const endDate = new Date(`${event.endDate}T${event.endTime}`);

  if (event.status === EVENT_STATUS.VALIDATED) {
    return EVENT_STATUS.VALIDATED;
  }

  if (now < startDate) {
    return EVENT_STATUS.PENDING;
  } else if (now >= startDate && now <= endDate) {
    return EVENT_STATUS.ONGOING;
  } else {
    return EVENT_STATUS.PAST;
  }
};

// Vérifier si un événement peut être modifié
export const canEditEvent = (event) => {
  if (!event) return false;

  // Un événement peut être modifié s'il n'est pas validé et pas passé
  const status = determineEventStatus(event);
  return status !== EVENT_STATUS.PAST && !event.validation;
};

// Vérifier si un événement peut être supprimé
export const canDeleteEvent = (event) => {
  if (!event) return false;

  // Un événement peut être supprimé s'il n'est pas validé
  return !event.validation;
};

// Vérifier si un événement peut être validé
export const canValidateEvent = (event) => {
  if (!event) return false;

  // Un événement peut être validé s'il est passé ou en cours et pas encore validé
  const currentStatus = determineEventStatus(event);
  return currentStatus === EVENT_STATUS.PAST && !event.validation;
};

// Créer un nouvel événement
export const createEvent = async (
  eventData,
  database,
  setFlashMessage,
  language
) => {
  try {
    const validation = validateEventData(eventData, language);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const currentDateTime = getFormattedDateTime();
    const currentDate = getDateTime();

    const newEvent = {
      id: generateUniqueId(),
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      type: eventData.type,
      status: EVENT_STATUS.PENDING,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      createdAt: currentDate.dateTime,
      updatedAt: currentDate.dateTime,
      validation: null, // Sera rempli lors de la validation
    };

    // Initialiser le tableau events s'il n'existe pas
    if (!database.events) {
      database.events = [];
    }

    // Ajouter l'événement à la base de données
    database.events.push(newEvent);

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(database);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("event_created", language),
        duration: 3000,
      });
    }

    return newEvent;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: error.message,
        duration: 5000,
      });
    }
    throw error;
  }
};

// Mettre à jour un événement
export const updateEvent = async (
  eventId,
  eventData,
  database,
  setFlashMessage,
  language
) => {
  try {
    if (!database.events || database.events.length === 0) {
      throw new Error("Aucun événement enregistré");
    }

    const eventIndex = database.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      throw new Error("Événement non trouvé");
    }

    const existingEvent = database.events[eventIndex];

    // Vérifier si l'événement peut être modifié
    if (!canEditEvent(existingEvent)) {
      throw new Error(translate("cannot_edit_past_event", language));
    }

    const validation = validateEventData(eventData, language);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const currentDate = getDateTime();

    // Mise à jour directe de l'événement dans la base de données
    database.events[eventIndex] = {
      ...existingEvent,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      type: eventData.type,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      updatedAt: currentDate.dateTime,
    };

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(database);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("event_updated", language),
        duration: 3000,
      });
    }

    return database.events[eventIndex];
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: error.message,
        duration: 5000,
      });
    }
    throw error;
  }
};

// Supprimer un événement
export const deleteEvent = async (
  eventId,
  database,
  setFlashMessage,
  language
) => {
  try {
    if (!database.events || database.events.length === 0) {
      throw new Error("Aucun événement enregistré");
    }

    const eventIndex = database.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      throw new Error("Événement non trouvé");
    }

    const eventToDelete = database.events[eventIndex];

    // Vérifier si l'événement peut être supprimé
    if (!canDeleteEvent(eventToDelete)) {
      throw new Error(translate("cannot_delete_validated_event", language));
    }

    // Suppression de l'événement du tableau
    database.events.splice(eventIndex, 1);

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(database);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("event_deleted", language),
        duration: 3000,
      });
    }

    return true;
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: error.message,
        duration: 5000,
      });
    }
    throw error;
  }
};

// Valider un événement
export const validateEvent = async (
  eventId,
  validationData,
  database,
  setFlashMessage,
  language
) => {
  try {
    if (!database.events || database.events.length === 0) {
      throw new Error("Aucun événement enregistré");
    }

    const eventIndex = database.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      throw new Error("Événement non trouvé");
    }

    const existingEvent = database.events[eventIndex];

    // Vérifier si l'événement peut être validé
    if (!canValidateEvent(existingEvent)) {
      throw new Error(translate("cannot_validate_future_event", language));
    }

    const validation = validateEventValidationData(validationData, language);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const currentDate = getDateTime();

    // Mise à jour directe de l'événement dans la base de données
    database.events[eventIndex] = {
      ...existingEvent,
      status: EVENT_STATUS.VALIDATED,
      validation: {
        success: validationData.success.trim(),
        failure: validationData.failure.trim(),
        remarks: validationData.remarks.trim(),
        validatedAt: currentDate.dateTime,
      },
      updatedAt: currentDate.dateTime,
    };

    // Sauvegarde de la base de données
    await window.electron.saveDatabase(database);

    if (setFlashMessage) {
      setFlashMessage({
        type: "success",
        message: translate("event_validated", language),
        duration: 3000,
      });
    }

    return database.events[eventIndex];
  } catch (error) {
    if (setFlashMessage) {
      setFlashMessage({
        type: "error",
        message: error.message,
        duration: 5000,
      });
    }
    throw error;
  }
};

// Obtenir tous les événements avec leur statut mis à jour
export const getAllEvents = (database) => {
  const events = database.events || [];
  return events.map((event) => ({
    ...event,
    currentStatus: determineEventStatus(event),
  }));
};

// Filtrer les événements
export const filterEvents = (events, filters) => {
  let filteredEvents = [...events];

  // Filtrer par statut
  if (filters.status && filters.status !== "all") {
    filteredEvents = filteredEvents.filter((event) => {
      const currentStatus = determineEventStatus(event);
      return currentStatus === filters.status;
    });
  }

  // Filtrer par type
  if (filters.type && filters.type !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.type === filters.type
    );
  }

  // Filtrer par recherche textuelle
  if (filters.search && filters.search.trim() !== "") {
    const searchTerm = filters.search.toLowerCase().trim();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrer par plage de dates
  if (filters.startDate) {
    filteredEvents = filteredEvents.filter(
      (event) => new Date(event.startDate) >= new Date(filters.startDate)
    );
  }

  if (filters.endDate) {
    filteredEvents = filteredEvents.filter(
      (event) => new Date(event.endDate) <= new Date(filters.endDate)
    );
  }

  return filteredEvents;
};

// Trier les événements
export const sortEvents = (events, sortBy = "startDate", sortOrder = "asc") => {
  return [...events].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "type":
        aValue = a.type;
        bValue = b.type;
        break;
      case "startDate":
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case "endDate":
        aValue = new Date(a.endDate);
        bValue = new Date(b.endDate);
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.startDate;
        bValue = b.startDate;
    }

    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Calculer les statistiques des événements
export const getEventStatistics = (events) => {
  const stats = {
    total: events.length,
    pending: 0,
    ongoing: 0,
    past: 0,
    validated: 0,
    byType: {},
  };

  events.forEach((event) => {
    const status = determineEventStatus(event);

    switch (status) {
      case EVENT_STATUS.PENDING:
        stats.pending++;
        break;
      case EVENT_STATUS.ONGOING:
        stats.ongoing++;
        break;
      case EVENT_STATUS.PAST:
        stats.past++;
        break;
      case EVENT_STATUS.VALIDATED:
        stats.validated++;
        break;
    }

    // Statistiques par type
    if (!stats.byType[event.type]) {
      stats.byType[event.type] = 0;
    }
    stats.byType[event.type]++;
  });

  return stats;
};

// Obtenir les événements à venir (dans les 7 prochains jours)
export const getUpcomingEvents = (events, days = 7) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return events.filter((event) => {
    const eventStart = new Date(event.startDate);
    return eventStart >= now && eventStart <= futureDate;
  });
};

// Formater la durée d'un événement
export const formatEventDuration = (event) => {
  const start = new Date(`${event.startDate}T${event.startTime}`);
  const end = new Date(`${event.endDate}T${event.endTime}`);

  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} jour(s) ${diffHours}h ${diffMinutes}min`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}min`;
  } else {
    return `${diffMinutes}min`;
  }
};

export default {
  EVENT_TYPES,
  EVENT_STATUS,
  validateEventData,
  validateEventValidationData,
  determineEventStatus,
  canEditEvent,
  canDeleteEvent,
  canValidateEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  validateEvent,
  getAllEvents,
  filterEvents,
  sortEvents,
  getEventStatistics,
  getUpcomingEvents,
  formatEventDuration,
};
