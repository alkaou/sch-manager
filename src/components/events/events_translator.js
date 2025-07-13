// Translator for events components
const translations = {
  // Page titles and navigation
  events_manager: {
    Français: "Gestionnaire d'Événements",
    Anglais: "Events Manager",
    Bambara: "Wakati Kow Ɲɛnabɔ",
  },
  events_title: {
    Français: "Événements",
    Anglais: "Events",
    Bambara: "Wakati Kow",
  },
  events_manager_description: {
    Français: "Gérez tous vos événements scolaires en un seul endroit",
    Anglais: "Manage all your school events in one place",
    Bambara: "I ka lakɔli wakati bɛɛ ɲɛnabɔ yɔrɔ kelen na",
  },
  total_events: {
    Français: "Total événements",
    Anglais: "Total Events",
    Bambara: "Wakati bɛɛ",
  },
  refresh: {
    Français: "Actualiser",
    Anglais: "Refresh",
    Bambara: "Kura",
  },
  
  // Event status
  pending: {
    Français: "En attente",
    Anglais: "Pending",
    Bambara: "Ka makɔnɔ",
  },
  validated: {
    Français: "Validé",
    Anglais: "Validated",
    Bambara: "Dafalen",
  },
  ongoing: {
    Français: "En cours",
    Anglais: "Ongoing",
    Bambara: "Ka kɛ sisan",
  },
  past: {
    Français: "Passé",
    Anglais: "Past",
    Bambara: "Tɛmɛnen",
  },
  
  // Actions
  add_event: {
    Français: "Ajouter un événement",
    Anglais: "Add Event",
    Bambara: "Wakati kura fara",
  },
  edit_event: {
    Français: "Modifier l'événement",
    Anglais: "Edit Event",
    Bambara: "Wakati yɛlɛma",
  },
  delete_event: {
    Français: "Supprimer l'événement",
    Anglais: "Delete Event",
    Bambara: "Wakati bɔ",
  },
  validate_event: {
    Français: "Valider l'événement",
    Anglais: "Validate Event",
    Bambara: "Wakati dafali",
  },
  view_details: {
    Français: "Voir les détails",
    Anglais: "View Details",
    Bambara: "Kunnafoniw lajɛ",
  },
  
  // Form fields
  title: {
    Français: "Titre",
    Anglais: "Title",
    Bambara: "Tɔgɔ",
  },
  description: {
    Français: "Description",
    Anglais: "Description",
    Bambara: "Ɲɛfɔli",
  },
  type: {
    Français: "Type",
    Anglais: "Type",
    Bambara: "Cogoya",
  },
  start_date: {
    Français: "Date de début",
    Anglais: "Start Date",
    Bambara: "Daminɛ don",
  },
  end_date: {
    Français: "Date de fin",
    Anglais: "End Date",
    Bambara: "Laban don",
  },
  start_time: {
    Français: "Heure de début",
    Anglais: "Start Time",
    Bambara: "Daminɛ lɛrɛ",
  },
  end_time: {
    Français: "Heure de fin",
    Anglais: "End Time",
    Bambara: "Laban lɛrɛ",
  },
  
  // Event types
  football: {
    Français: "Football",
    Anglais: "Football",
    Bambara: "Nɛgɛso",
  },
  cultural_day: {
    Français: "Journée Culturelle",
    Anglais: "Cultural Day",
    Bambara: "Laada Don",
  },
  closing_ceremony: {
    Français: "Fête de Fermeture",
    Anglais: "Closing Ceremony",
    Bambara: "Datugu Seli",
  },
  opening_ceremony: {
    Français: "Cérémonie d'Ouverture",
    Anglais: "Opening Ceremony",
    Bambara: "Dayɛlɛma Seli",
  },
  graduation: {
    Français: "Remise de Diplômes",
    Anglais: "Graduation",
    Bambara: "Diplomu Di",
  },
  sports_competition: {
    Français: "Compétition Sportive",
    Anglais: "Sports Competition",
    Bambara: "Farikoloɲɛnajɛ",
  },
  science_fair: {
    Français: "Foire Scientifique",
    Anglais: "Science Fair",
    Bambara: "Dɔnniya Fɛn Jira",
  },
  art_exhibition: {
    Français: "Exposition d'Art",
    Anglais: "Art Exhibition",
    Bambara: "Seko Jira",
  },
  parent_meeting: {
    Français: "Réunion des Parents",
    Anglais: "Parent Meeting",
    Bambara: "Badenya Ɲɔgɔn",
  },
  workshop: {
    Français: "Atelier",
    Anglais: "Workshop",
    Bambara: "Kalan Yɔrɔ",
  },
  conference: {
    Français: "Conférence",
    Anglais: "Conference",
    Bambara: "Baro Kɛyɔrɔ",
  },
  exam_period: {
    Français: "Période d'Examens",
    Anglais: "Exam Period",
    Bambara: "Sɛgɛsɛgɛli Waati",
  },
  holiday: {
    Français: "Vacances",
    Anglais: "Holiday",
    Bambara: "Lafiɲɛ",
  },
  training: {
    Français: "Formation",
    Anglais: "Training",
    Bambara: "Dege",
  },
  fundraising: {
    Français: "Collecte de Fonds",
    Anglais: "Fundraising",
    Bambara: "Wari Lajɛ",
  },
  community_service: {
    Français: "Service Communautaire",
    Anglais: "Community Service",
    Bambara: "Sigida Baarakɛ",
  },
  field_trip: {
    Français: "Sortie Éducative",
    Anglais: "Field Trip",
    Bambara: "Kalan Taama",
  },
  talent_show: {
    Français: "Spectacle de Talents",
    Anglais: "Talent Show",
    Bambara: "Sekow Jira",
  },
  book_fair: {
    Français: "Foire aux Livres",
    Anglais: "Book Fair",
    Bambara: "Gafe Feerekɛ",
  },
  other: {
    Français: "Autre",
    Anglais: "Other",
    Bambara: "Wɛrɛ",
  },
  
  // Validation fields
  success: {
    Français: "Succès",
    Anglais: "Success",
    Bambara: "Ɲɛtaa",
  },
  failure: {
    Français: "Échec",
    Anglais: "Failure",
    Bambara: "Tiɲɛ",
  },
  remarks: {
    Français: "Remarques",
    Anglais: "Remarks",
    Bambara: "Kɔrɔfɔliw",
  },
  
  // Filters and search
  search_events: {
    Français: "Rechercher des événements...",
    Anglais: "Search events...",
    Bambara: "Wakati kow ɲini...",
  },
  filter_by_status: {
    Français: "Filtrer par statut",
    Anglais: "Filter by status",
    Bambara: "Ka ɲini cogoya la",
  },
  filter_by_type: {
    Français: "Filtrer par type",
    Anglais: "Filter by type",
    Bambara: "Ka ɲini suguya la",
  },
  filter_by_date: {
    Français: "Filtrer par date",
    Anglais: "Filter by date",
    Bambara: "Ka ɲini don la",
  },
  all: {
    Français: "Tous",
    Anglais: "All",
    Bambara: "Bɛɛ",
  },
  
  // Messages
  event_created: {
    Français: "Événement créé avec succès",
    Anglais: "Event created successfully",
    Bambara: "Wakati dabɔra ka ɲɛ",
  },
  event_updated: {
    Français: "Événement mis à jour avec succès",
    Anglais: "Event updated successfully",
    Bambara: "Wakati kɔrɔlen ka ɲɛ",
  },
  event_deleted: {
    Français: "Événement supprimé avec succès",
    Anglais: "Event deleted successfully",
    Bambara: "Wakati bɔlen ka ɲɛ",
  },
  event_validated: {
    Français: "Événement validé avec succès",
    Anglais: "Event validated successfully",
    Bambara: "Wakati dafalen ka ɲɛ",
  },
  
  // Errors
  title_required: {
    Français: "Le titre est requis",
    Anglais: "Title is required",
    Bambara: "Tɔgɔ ka kan ka kɛ",
  },
  title_min_length: {
    Français: "Le titre doit contenir au moins 5 caractères",
    Anglais: "Title must be at least 5 characters",
    Bambara: "Tɔgɔ ka kan ka kɛ sɛbɛnni 5 ye walima ka ca a kan",
  },
  title_max_length: {
    Français: "Le titre ne peut pas dépasser 150 caractères",
    Anglais: "Title cannot exceed 150 characters",
    Bambara: "Tɔgɔ tɛ se ka tɛmɛ sɛbɛnni 150 kan",
  },
  description_required: {
    Français: "La description est requise",
    Anglais: "Description is required",
    Bambara: "Ɲɛfɔli ka kan ka kɛ",
  },
  description_min_length: {
    Français: "La description doit contenir au moins 100 caractères",
    Anglais: "Description must be at least 100 characters",
    Bambara: "Ɲɛfɔli ka kan ka kɛ sɛbɛnni 100 ye walima ka ca a kan",
  },
  description_max_length: {
    Français: "La description ne peut pas dépasser 10000 caractères",
    Anglais: "Description cannot exceed 10000 characters",
    Bambara: "Ɲɛfɔli tɛ se ka tɛmɛ sɛbɛnni 10000 kan",
  },
  start_date_required: {
    Français: "La date de début est requise",
    Anglais: "Start date is required",
    Bambara: "Daminɛ don ka kan ka kɛ",
  },
  end_date_required: {
    Français: "La date de fin est requise",
    Anglais: "End date is required",
    Bambara: "Laban don ka kan ka kɛ",
  },
  invalid_date_range: {
    Français: "La date de fin doit être après la date de début",
    Anglais: "End date must be after start date",
    Bambara: "Laban don ka kan ka kɛ daminɛ don kɔfɛ",
  },
  start_time_required: {
    Français: "L'heure de début est requise",
    Anglais: "Start time is required",
    Bambara: "Daminɛ lɛrɛ ka kan ka kɛ",
  },
  end_time_required: {
    Français: "L'heure de fin est requise",
    Anglais: "End time is required",
    Bambara: "Laban lɛrɛ ka kan ka kɛ",
  },
  invalid_time_range: {
    Français: "L'heure de fin doit être après l'heure de début",
    Anglais: "End time must be after start time",
    Bambara: "Laban lɛrɛ ka kan ka kɛ daminɛ lɛrɛ kɔfɛ",
  },
  data_refreshed_success: {
    Français: "Les données ont été actualisées avec succès",
    Anglais: "Data refreshed successfully",
    Bambara: "Kunnafoniw kuralen ka ɲɛ",
  },
  data_refresh_error: {
    Français: "Erreur lors de l'actualisation des données",
    Anglais: "Error refreshing data",
    Bambara: "Fili kɛra kunnafoniw kurani na",
  },
  cannot_edit_past_event: {
    Français: "Impossible de modifier un événement passé",
    Anglais: "Cannot edit past event",
    Bambara: "Wakati tɛmɛnen tɛ se ka yɛlɛma",
  },
  cannot_delete_validated_event: {
    Français: "Impossible de supprimer un événement validé",
    Anglais: "Cannot delete validated event",
    Bambara: "Wakati dafalen tɛ se ka bɔ",
  },
  cannot_validate_future_event: {
    Français: "Impossible de valider un événement futur",
    Anglais: "Cannot validate future event",
    Bambara: "Wakati nata tɛ se ka dafali",
  },
  
  // Confirmation messages
  confirm_delete_event: {
    Français: "Êtes-vous sûr de vouloir supprimer cet événement ?",
    Anglais: "Are you sure you want to delete this event?",
    Bambara: "I b'a fɛ tiɲɛ na ko i bɛ nin wakati bɔ?",
  },
  delete_event_title: {
    Français: "Supprimer l'événement",
    Anglais: "Delete Event",
    Bambara: "Wakati Bɔ",
  },
  
  // Common actions
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "Mara",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "Segin kɔ",
  },
  close: {
    Français: "Fermer",
    Anglais: "Close",
    Bambara: "Datugu",
  },
  loading: {
    Français: "Chargement...",
    Anglais: "Loading...",
    Bambara: "Ka doni...",
  },
  no_events: {
    Français: "Aucun événement trouvé",
    Anglais: "No events found",
    Bambara: "Wakati si ma sɔrɔ",
  },
  
  // Date and time
  created_at: {
    Français: "Créé le",
    Anglais: "Created at",
    Bambara: "Dabɔlen",
  },
  updated_at: {
    Français: "Mis à jour le",
    Anglais: "Updated at",
    Bambara: "Kɔrɔlen",
  },
  duration: {
    Français: "Durée",
    Anglais: "Duration",
    Bambara: "Waati janya",
  },
  
  // Status indicators
  days_remaining: {
    Français: "jours restants",
    Anglais: "days remaining",
    Bambara: "don tɔw sigilen",
  },
  days_ago: {
    Français: "il y a",
    Anglais: "ago",
    Bambara: "tɛmɛnen",
  },
  today: {
    Français: "Aujourd'hui",
    Anglais: "Today",
    Bambara: "Bi",
  },
  tomorrow: {
    Français: "Demain",
    Anglais: "Tomorrow",
    Bambara: "Sini",
  },
  yesterday: {
    Français: "Hier",
    Anglais: "Yesterday",
    Bambara: "Kunu",
  },
};

export const translate = (key, language) => {
  return translations[key]?.[language] || translations[key]?.Français || key;
};

export default translate;
