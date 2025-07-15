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
    Bambara: "Balon tan",
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

  // Nouvelles traductions manquantes
  period: {
    Français: "Période",
    Anglais: "Period",
    Bambara: "Waati",
  },
  time: {
    Français: "Heure",
    Anglais: "Time",
    Bambara: "Lɛrɛ",
  },
  success_placeholder: {
    Français:
      "Décrivez les aspects positifs et les réussites de l'événement...",
    Anglais: "Describe the positive aspects and successes of the event...",
    Bambara: "Wakati ɲɛtaaw ni fɛn ɲumanw ɲɛfɔ...",
  },
  failure_placeholder: {
    Français:
      "Décrivez les difficultés rencontrées et les points d'amélioration...",
    Anglais:
      "Describe the difficulties encountered and areas for improvement...",
    Bambara: "Gɛlɛyaw ni ɲɛtaa yɔrɔw ɲɛfɔ...",
  },
  remarks_placeholder: {
    Français: "Ajoutez vos observations générales et recommandations...",
    Anglais: "Add your general observations and recommendations...",
    Bambara: "I ka lajɛliw ni laadiliw fara a kan...",
  },
  general_information: {
    Français: "Informations générales",
    Anglais: "General information",
    Bambara: "Kunnafoni jiginw",
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
  pending_events: {
    Français: "Événements en attente",
    Anglais: "Pending events",
    Bambara: "Wakati makɔnɔw",
  },
  validated_events: {
    Français: "Événements validés",
    Anglais: "Validated events",
    Bambara: "Wakati Dafalenw",
  },
  filters: {
    Français: "Filtres",
    Anglais: "Filters",
    Bambara: "Wolomali",
  },
  confirm_delete: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm delete",
    Bambara: "Jɔsili Waleya",
  },
  ongoing_events: {
    Français: "Événements en cours",
    Anglais: "Ongoing events",
    Bambara: "Wakati kɛlenw",
  },
  upcoming_events: {
    Français: "Événements à venir",
    Anglais: "Upcoming events",
    Bambara: "Wakati naanaw",
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
  cannot_delete_validated_event: {
    Français: "Impossible de supprimer un événement validé",
    Anglais: "Cannot delete a validated event",
    Bambara: "Wakati dafalen tɛ se ka bɔ",
  },
  error_loading_events: {
    Français: "Erreur lors du chargement des événements",
    Anglais: "Error loading events",
    Bambara: "Fili kɛra wakatiw doni na",
  },
  cannot_validate_future_event: {
    Français: "Impossible de valider un événement futur",
    Anglais: "Cannot validate a future event",
    Bambara: "Wakati nata tɛ se ka dafali",
  },
  cannot_edit_past_event: {
    Français: "Impossible de modifier un événement passé ou validé",
    Anglais: "Cannot edit a past or validated event",
    Bambara: "Wakati tɛmɛnen walima dafalen tɛ se ka ladamu",
  },

  // Messages d'erreur de validation
  success_required: {
    Français: "Le rapport de succès est requis",
    Anglais: "Success report is required",
    Bambara: "Ɲɛtaa rapɔɔri ka kan ka kɛ",
  },
  failure_required: {
    Français: "Le rapport d'échec est requis",
    Anglais: "Failure report is required",
    Bambara: "Tiɲɛ rapɔɔri ka kan ka kɛ",
  },
  remarks_required: {
    Français: "Les remarques sont requises",
    Anglais: "Remarks are required",
    Bambara: "Kɔrɔfɔliw ka kan ka kɛ",
  },
  success_min_length: {
    Français: "Le rapport de succès doit contenir au moins 100 caractères",
    Anglais: "Success report must be at least 100 characters",
    Bambara: "Ɲɛtaa rapɔɔri ka kan ka kɛ sɛbɛnni 100 ye walima ka ca a kan",
  },
  success_max_length: {
    Français: "Le rapport de succès ne peut pas dépasser 10000 caractères",
    Anglais: "Success report cannot exceed 10000 characters",
    Bambara: "Ɲɛtaa rapɔɔri tɛ se ka tɛmɛ sɛbɛnni 10000 kan",
  },
  failure_min_length: {
    Français: "Le rapport d'échec doit contenir au moins 100 caractères",
    Anglais: "Failure report must be at least 100 characters",
    Bambara: "Tiɲɛ rapɔɔri ka kan ka kɛ sɛbɛnni 100 ye walima ka ca a kan",
  },
  failure_max_length: {
    Français: "Le rapport d'échec ne peut pas dépasser 10000 caractères",
    Anglais: "Failure report cannot exceed 10000 characters",
    Bambara: "Tiɲɛ rapɔɔri tɛ se ka tɛmɛ sɛbɛnni 10000 kan",
  },
  remarks_min_length: {
    Français: "Les remarques doivent contenir au moins 100 caractères",
    Anglais: "Remarks must be at least 100 characters",
    Bambara: "Kɔrɔfɔliw ka kan ka kɛ sɛbɛnni 100 ye walima ka ca a kan",
  },
  remarks_max_length: {
    Français: "Les remarques ne peuvent pas dépasser 10000 caractères",
    Anglais: "Remarks cannot exceed 10000 characters",
    Bambara: "Kɔrɔfɔliw tɛ se ka tɛmɛ sɛbɛnni 10000 kan",
  },

  // Traductions manquantes
  all_events: {
    Français: "Tous les événements",
    Anglais: "All events",
    Bambara: "Wakati bɛɛ",
  },

  // Events Info Popup translations
  events_overview: {
    Français: "Vue d'ensemble",
    Anglais: "Overview",
    Bambara: "Kɔlɔsili",
  },
  events_features: {
    Français: "Fonctionnalités",
    Anglais: "Features",
    Bambara: "Baarakɛcogo",
  },
  events_workflow: {
    Français: "Processus",
    Anglais: "Workflow",
    Bambara: "Baara taabolo",
  },
  events_notifications: {
    Français: "Notifications",
    Anglais: "Notifications",
    Bambara: "Kunnafoniw",
  },
  events_tips: {
    Français: "Conseils",
    Anglais: "Tips",
    Bambara: "Ladilikanw",
  },
  events_system_title: {
    Français: "Système de Gestion d'Événements",
    Anglais: "Event Management System",
    Bambara: "Ko kɛlenw ɲɛnabɔ siratigɛ",
  },
  events_system_description: {
    Français: "Une solution complète pour organiser, suivre et gérer tous vos événements avec intelligence et efficacité.",
    Anglais: "A comprehensive solution to organize, track and manage all your events with intelligence and efficiency.",
    Bambara: "Fɛɛrɛ dafalen min bɛ i ka ko kɛlenw labɛn, kɔlɔsi ani ɲɛnabɔ ni hakili ni baarakɛcogo ye.",
  },
  events_management: {
    Français: "Gestion Complète",
    Anglais: "Complete Management",
    Bambara: "Ɲɛnabɔ dafalen",
  },
  events_management_desc: {
    Français: "Créez, modifiez et organisez vos événements avec une interface intuitive et moderne.",
    Anglais: "Create, edit and organize your events with an intuitive and modern interface.",
    Bambara: "I ka ko kɛlenw dilan, ladamu ani labɛn ni ɲɛnabɔyɔrɔ nɔgɔman ni kɔrɔlen ye.",
  },
  smart_notifications: {
    Français: "Notifications Intelligentes",
    Anglais: "Smart Notifications",
    Bambara: "Kunnafoni hakilitigiw",
  },
  smart_notifications_desc: {
    Français: "Recevez des alertes automatiques 30 minutes avant le début de vos événements.",
    Anglais: "Receive automatic alerts 30 minutes before your events start.",
    Bambara: "Kunnafoni otomatiki sɔrɔ miniti 30 ka taa i ka ko kɛlenw daminɛ kɔn.",
  },
  voice_alerts: {
    Français: "Alertes Vocales",
    Anglais: "Voice Alerts",
    Bambara: "Kumakan kunnafoniw",
  },
  voice_alerts_desc: {
    Français: "Écoutez des annonces vocales personnalisées en français ou en anglais.",
    Anglais: "Listen to personalized voice announcements in French or English.",
    Bambara: "Kumakan kunnafoni kɛlenw mɛn faransekan walima angilɛkan na.",
  },
  event_validation: {
    Français: "Validation d'Événements",
    Anglais: "Event Validation",
    Bambara: "Ko kɛlenw tiɲɛni",
  },
  event_validation_desc: {
    Français: "Validez la réalisation de vos événements pour un suivi précis et professionnel.",
    Anglais: "Validate the completion of your events for accurate and professional tracking.",
    Bambara: "I ka ko kɛlenw tiɲɛ walasa ka kɔlɔsili tiɲɛnen ni baarakɛla cogo kɛ.",
  },
  key_features: {
    Français: "Fonctionnalités Clés",
    Anglais: "Key Features",
    Bambara: "Baarakɛcogo kunba",
  },
  comprehensive_planning: {
    Français: "Planification Complète",
    Anglais: "Comprehensive Planning",
    Bambara: "Labɛnni dafalen",
  },
  comprehensive_planning_desc: {
    Français: "Organisez vos événements avec tous les détails nécessaires : date, heure, lieu, description et participants.",
    Anglais: "Organize your events with all necessary details: date, time, location, description and participants.",
    Bambara: "I ka ko kɛlenw labɛn ni kunnafoni bɛɛ ye: don, waati, yɔrɔ, ɲɛfɔli ani bɔlenw.",
  },
  real_time_tracking: {
    Français: "Suivi en Temps Réel",
    Anglais: "Real-time Tracking",
    Bambara: "Kɔlɔsili waati yɛrɛ la",
  },
  real_time_tracking_desc: {
    Français: "Surveillez automatiquement le statut de vos événements : à venir, en cours, passés ou validés.",
    Anglais: "Automatically monitor the status of your events: upcoming, ongoing, past or validated.",
    Bambara: "I ka ko kɛlenw cogoya kɔlɔsi otomatikiman: nata, ka kɛ, tɛmɛnen walima tiɲɛnen.",
  },
  intelligent_reminders: {
    Français: "Rappels Intelligents",
    Anglais: "Intelligent Reminders",
    Bambara: "Hakamaw hakilitigiw",
  },
  intelligent_reminders_desc: {
    Français: "Système de notifications avancé avec alertes vocales et messages personnalisés selon votre langue.",
    Anglais: "Advanced notification system with voice alerts and personalized messages according to your language.",
    Bambara: "Kunnafoni siratigɛ kɔrɔlen ni kumakan kunnafoniw ani bataki kɛlenw i ka kan kɔrɔ.",
  },
  validation_system: {
    Français: "Système de Validation",
    Anglais: "Validation System",
    Bambara: "Tiɲɛni siratigɛ",
  },
  validation_system_desc: {
    Français: "Confirmez la réalisation de vos événements avec un système de validation professionnel et traçable.",
    Anglais: "Confirm the completion of your events with a professional and traceable validation system.",
    Bambara: "I ka ko kɛlenw dafali tiɲɛ ni tiɲɛni siratigɛ baarakɛla ani kɔlɔsibaga ye.",
  },
  event_workflow: {
    Français: "Flux de Travail",
    Anglais: "Event Workflow",
    Bambara: "Baara taabolo",
  },
  create_event: {
    Français: "Créer un Événement",
    Anglais: "Create Event",
    Bambara: "Ko kɛlen dilan",
  },
  create_event_desc: {
    Français: "Commencez par créer votre événement avec tous les détails importants.",
    Anglais: "Start by creating your event with all the important details.",
    Bambara: "A daminɛ ni i ka ko kɛlen dilanni ye ni kunnafoni nafamaw bɛɛ ye.",
  },
  monitor_progress: {
    Français: "Surveiller le Progrès",
    Anglais: "Monitor Progress",
    Bambara: "Ɲɛtaa kɔlɔsi",
  },
  monitor_progress_desc: {
    Français: "Suivez l'évolution de votre événement en temps réel selon son statut.",
    Anglais: "Track your event's progress in real-time according to its status.",
    Bambara: "I ka ko kɛlen ɲɛtaa kɔlɔsi waati yɛrɛ la a ka cogoya kɔrɔ.",
  },
  receive_notifications: {
    Français: "Recevoir les Notifications",
    Anglais: "Receive Notifications",
    Bambara: "Kunnafoniw sɔrɔ",
  },
  receive_notifications_desc: {
    Français: "Soyez alerté automatiquement 30 minutes avant le début de votre événement.",
    Anglais: "Be automatically alerted 30 minutes before your event starts.",
    Bambara: "Kunnafoni sɔrɔ otomatikiman miniti 30 ka taa i ka ko kɛlen daminɛ kɔn.",
  },
  validate_completion: {
    Français: "Valider la Réalisation",
    Anglais: "Validate Completion",
    Bambara: "Dafali tiɲɛ",
  },
  validate_completion_desc: {
    Français: "Confirmez que votre événement s'est bien déroulé avec le système de validation.",
    Anglais: "Confirm that your event went well with the validation system.",
    Bambara: "I ka ko kɛlen kɛcogo ɲuman tiɲɛ ni tiɲɛni siratigɛ ye.",
  },
  notification_system: {
    Français: "Système de Notifications",
    Anglais: "Notification System",
    Bambara: "Kunnafoni siratigɛ",
  },
  automatic_reminders: {
    Français: "Rappels Automatiques",
    Anglais: "Automatic Reminders",
    Bambara: "Hakamaw otomatikiw",
  },
  automatic_reminders_desc: {
    Français: "Le système surveille automatiquement vos événements et vous envoie des notifications intelligentes.",
    Anglais: "The system automatically monitors your events and sends you intelligent notifications.",
    Bambara: "Siratigɛ bɛ i ka ko kɛlenw kɔlɔsi otomatikiman ka kunnafoni hakilitigiw ci i ma.",
  },
  reminder_timing: {
    Français: "Notification 30 minutes avant le début",
    Anglais: "Notification 30 minutes before start",
    Bambara: "Kunnafoni miniti 30 ka taa daminɛ kɔn",
  },
  voice_announcements: {
    Français: "Annonces Vocales",
    Anglais: "Voice Announcements",
    Bambara: "Kumakan kɔfɔliw",
  },
  voice_announcements_desc: {
    Français: "Écoutez des messages vocaux personnalisés qui annoncent le début prochain de vos événements.",
    Anglais: "Listen to personalized voice messages that announce the upcoming start of your events.",
    Bambara: "Kumakan batakiw mɛn minnu bɛ i ka ko kɛlenw daminɛ nata kɔfɔ.",
  },
  voice_languages: {
    Français: "Disponible en français et anglais uniquement",
    Anglais: "Available in French and English only",
    Bambara: "A bɛ sɔrɔ faransekan ni angilɛkan dɔrɔn na",
  },
  dynamic_notifications: {
    Français: "Notifications Dynamiques",
    Anglais: "Dynamic Notifications",
    Bambara: "Kunnafoni yɛlɛmaniw",
  },
  dynamic_notifications_desc: {
    Français: "Recevez des notifications depuis l'application ou des messages externes envoyés par l'administrateur.",
    Anglais: "Receive notifications from the application or external messages sent by the administrator.",
    Bambara: "Kunnafoniw sɔrɔ porogaramu kɔnɔ walima kɛnɛma batakiw minnu bɛ ci ka bɔ ɲɛnabɔla fɛ.",
  },
  expert_tips: {
    Français: "Conseils d'Expert",
    Anglais: "Expert Tips",
    Bambara: "Dɔnnikɛla ladilikanw",
  },
  tip_planning: {
    Français: "Planification Efficace",
    Anglais: "Effective Planning",
    Bambara: "Labɛnni ɲuman",
  },
  tip_planning_desc: {
    Français: "Créez vos événements à l'avance et définissez des heures précises pour optimiser votre organisation.",
    Anglais: "Create your events in advance and set precise times to optimize your organization.",
    Bambara: "I ka ko kɛlenw dilan ka taa a ɲɛ ka waatiw tiɲɛ walasa ka i ka labɛnni ɲɛ.",
  },
  tip_notifications: {
    Français: "Gestion des Notifications",
    Anglais: "Notification Management",
    Bambara: "Kunnafoniw ɲɛnabɔ",
  },
  tip_notifications_desc: {
    Français: "Activez les notifications pour ne jamais manquer un événement important et restez toujours informé.",
    Anglais: "Enable notifications to never miss an important event and stay always informed.",
    Bambara: "Kunnafoniw baara la walasa ko kɛlen nafama kana bɔnɛ ka to kunnafoni sɔrɔla tuma bɛɛ.",
  },
  tip_validation: {
    Français: "Validation Systématique",
    Anglais: "Systematic Validation",
    Bambara: "Tiɲɛni siratigɛla",
  },
  tip_validation_desc: {
    Français: "Validez toujours vos événements terminés pour maintenir un historique précis et professionnel.",
    Anglais: "Always validate your completed events to maintain an accurate and professional history.",
    Bambara: "I ka ko kɛlen bannenw tiɲɛ tuma bɛɛ walasa ka tariku tiɲɛnen ni baarakɛla marala.",
  },
  events_help_center: {
    Français: "Centre d'Aide - Événements",
    Anglais: "Help Center - Events",
    Bambara: "Dɛmɛ yɔrɔ - Ko kɛlenw",
  },
  events_help_subtitle: {
    Français: "Tout ce que vous devez savoir sur la gestion d'événements",
    Anglais: "Everything you need to know about event management",
    Bambara: "Fɛn bɛɛ min ka kan ka dɔn ko kɛlenw ɲɛnabɔ kan",
  },
  sections: {
    Français: "Sections",
    Anglais: "Sections",
    Bambara: "Yɔrɔw",
  },
  validation_indication_message: {
    Français:
      'Cliquez sur "Voir détails" pour consulter le rapport de validation.',
    Anglais: 'Click on "View details" to see the validation report.',
    Bambara: 'Ɲɛden Butɔn digi walasa ka nin "Wakati" kunafoniw bɛɛ lajɛ.',
  },
  past_events: {
    Français: "Événements passés",
    Anglais: "Past events",
    Bambara: "Wakati tɛmɛnenw",
  },
  edit_validation_messages: {
    Français: "Modifier les messages de validation",
    Anglais: "Edit validation messages",
    Bambara: "Dafali kunnafoniw ladamu",
  },
  validation_information: {
    Français: "Informations de validation",
    Anglais: "Validation information",
    Bambara: "Dafali kunnafoniw",
  },
  validated_on: {
    Français: "Validé le",
    Anglais: "Validated on",
    Bambara: "A dafala",
  },
  no_actions_available: {
    Français: "Aucune action disponible",
    Anglais: "No actions available",
    Bambara: "Baara si tɛ yen",
  },
  view_details: {
    Français: "Voir détails",
    Anglais: "View details",
    Bambara: "Kunnafoniw lajɛ",
  },
  edit_event: {
    Français: "Modifier l'événement",
    Anglais: "Edit event",
    Bambara: "Wakati ladamu",
  },
  delete_event: {
    Français: "Supprimer l'événement",
    Anglais: "Delete event",
    Bambara: "Wakati bɔ",
  },
  validate_event: {
    Français: "Valider l'événement",
    Anglais: "Validate event",
    Bambara: "Wakati dafali",
  },
  general_information: {
    Français: "Informations générales",
    Anglais: "General information",
    Bambara: "Kunnafoni jiginw",
  },
  actions: {
    Français: "Actions",
    Anglais: "Actions",
    Bambara: "Baaraw",
  },
  period: {
    Français: "Période",
    Anglais: "Period",
    Bambara: "Waati",
  },
  time: {
    Français: "Heure",
    Anglais: "Time",
    Bambara: "Lɛrɛ",
  },
  duration: {
    Français: "Durée",
    Anglais: "Duration",
    Bambara: "Waati hakɛ",
  },
  status: {
    Français: "Statut",
    Anglais: "Status",
    Bambara: "Cogoya",
  },
  from_date: {
    Français: "Date de début",
    Anglais: "From date",
    Bambara: "Daminɛ don",
  },
  from: {
    Français: "Du",
    Anglais: "From",
    Bambara: "Ka daminɛ",
  },
  to: {
    Français: "Au",
    Anglais: "To",
    Bambara: "Ka t'a bila",
  },
  to_date: {
    Français: "Date de fin",
    Anglais: "To date",
    Bambara: "Laban don",
  },
  sort_by: {
    Français: "Trier par",
    Anglais: "Sort by",
    Bambara: "Ka ɲɛnabɔ",
  },
  sort_order: {
    Français: "Ordre de tri",
    Anglais: "Sort order",
    Bambara: "Ɲɛnabɔ cogo",
  },
  all_status: {
    Français: "Tous les statuts",
    Anglais: "All statuses",
    Bambara: "Cogoya bɛɛ",
  },
  all_types: {
    Français: "Tous les types",
    Anglais: "All types",
    Bambara: "Suguya bɛɛ",
  },
  ascending: {
    Français: "Croissant",
    Anglais: "Ascending",
    Bambara: "Ka jigin",
  },
  descending: {
    Français: "Décroissant",
    Anglais: "Descending",
    Bambara: "Ka jigin kɔrɔ",
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
    Français: "Êtes-vous sûr de vouloir supprimer cet événement",
    Anglais: "Are you sure you want to delete this event",
    Bambara: "I b'a fɛ tiɲɛ na ka nin wakati jɔsi wa",
  },
  delete_event_title: {
    Français: "Supprimer l'événement",
    Anglais: "Delete Event",
    Bambara: "Wakati Jɔsi",
  },

  // Common actions
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A Mara",
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
  no_events_description: {
    Français: "Il n'y a aucun événement dans cette catégorie pour le moment.",
    Anglais: "There are no events in this category at the moment.",
    Bambara: "Wakati si tɛ nin suguya kɔnɔ sisan.",
  },
  no_pending_events: {
    Français: "Aucun événement en attente",
    Anglais: "No pending events",
    Bambara: "Wakati makɔnɔnen si tɛ",
  },
  no_ongoing_events: {
    Français: "Aucun événement en cours",
    Anglais: "No ongoing events",
    Bambara: "Wakati kɛlen si tɛ ka kɛ sisan",
  },
  no_past_events: {
    Français: "Aucun événement passé",
    Anglais: "No past events",
    Bambara: "Wakati tɛmɛnen si tɛ",
  },
  no_validated_events: {
    Français: "Aucun événement validé",
    Anglais: "No validated events",
    Bambara: "Wakati dafalen si tɛ",
  },
  no_pending_events_description: {
    Français: "Aucun événement n'est actuellement en attente de réalisation.",
    Anglais: "No events are currently pending.",
    Bambara: "Wakati si tɛ makɔnɔ sisan.",
  },
  no_ongoing_events_description: {
    Français: "Aucun événement n'est actuellement en cours.",
    Anglais: "No events are currently ongoing.",
    Bambara: "Wakati si tɛ ka kɛ sisan.",
  },
  no_past_events_description: {
    Français: "Aucun événement passé n'a été enregistré.",
    Anglais: "No past events have been recorded.",
    Bambara: "Wakati tɛmɛnen si ma sɛbɛn.",
  },
  no_validated_events_description: {
    Français: "Aucun événement n'a encore été validé.",
    Anglais: "No events have been validated yet.",
    Bambara: "Wakati si ma dafali fɔlɔ.",
  },

  // Date and time
  created_at: {
    Français: "Créé le",
    Anglais: "Created at",
    Bambara: "A dilan don",
  },
  updated_at: {
    Français: "Mis à jour le",
    Anglais: "Updated at",
    Bambara: "A yɛlɛma don",
  },
  active_filters: {
    Français: "Filtres actifs",
    Anglais: "Active filters",
    Bambara: "Ka Woloma",
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

  // Actions de validation
  validate: {
    Français: "Valider",
    Anglais: "Validate",
    Bambara: "Dafali",
  },
  validating: {
    Français: "Validation en cours...",
    Anglais: "Validating...",
    Bambara: "Ka dafali...",
  },
  validation_information: {
    Français: "Informations de validation",
    Anglais: "Validation information",
    Bambara: "Dafali kunnafoniw",
  },
  actions: {
    Français: "Actions",
    Anglais: "Actions",
    Bambara: "Baaraw",
  },
  no_actions_available: {
    Français: "Aucune action disponible",
    Anglais: "No actions available",
    Bambara: "Baara si tɛ yen",
  },
  edit_validation_messages: {
    Français: "Modifier les messages de validation",
    Anglais: "Edit validation messages",
    Bambara: "Dafali cikanw yɛlɛma",
  },

  // Notifications
  event_reminder_title: {
    Français: "Rappel d'événement",
    Anglais: "Event Reminder",
    Bambara: "Wakati hakili"
  },
  view_event: {
    Français: "Voir l'événement",
    Anglais: "View Event",
    Bambara: "Wakati lajɛ"
  },
  dismiss: {
    Français: "Ignorer",
    Anglais: "Dismiss",
    Bambara: "Bɔ"
  },
  notification_system_title: {
    Français: "Système de notifications",
    Anglais: "Notification System",
    Bambara: "Kunnafoni sira"
  },
  notification_system_desc: {
    Français: "Recevez des alertes intelligentes pour vos événements et activités importantes.",
    Anglais: "Receive smart alerts for your events and important activities.",
    Bambara: "I bɛ kunnafoni ɲuman sɔrɔ i ka wakatiw ni baara kunba ye."
  },
  voice_alerts_title: {
    Français: "Alertes vocales",
    Anglais: "Voice Alerts",
    Bambara: "Kumakan kunnafoniw"
  },
  voice_alerts_desc: {
    Français: "Messages vocaux automatiques 30 minutes avant vos événements (français/anglais).",
    Anglais: "Automatic voice messages 30 minutes before your events (French/English).",
    Bambara: "Kumakan kunnafoniw bɛ kɛ miniti 30 sisan i ka wakatiw la."
  },
  smart_notifications_title: {
    Français: "Notifications intelligentes",
    Anglais: "Smart Notifications",
    Bambara: "Kunnafoni hakilitigiw"
  },
  smart_notifications_desc: {
    Français: "Rappels automatiques basés sur la date et l'heure réelles de vos événements.",
    Anglais: "Automatic reminders based on the actual date and time of your events.",
    Bambara: "Hakili kunnafoniw bɛ kɛ i ka wakatiw waati ni don ma."
  },
  external_notifications: {
    Français: "Notifications externes",
    Anglais: "External Notifications",
    Bambara: "Kunnafoni kɛnɛmaw"
  },
  external_notifications_desc: {
    Français: "Recevez des notifications importantes de l'administration via URL.",
    Anglais: "Receive important notifications from administration via URL.",
    Bambara: "I bɛ kunnafoni kunba sɔrɔ marali la URL fɛ."
  },
  admin_integration: {
    Français: "Intégration administrative",
    Anglais: "Administrative integration",
    Bambara: "Marali ka jɛkafɔ"
  },
};

export const translate = (key, language) => {
  return translations[key]?.[language] || translations[key]?.Français || key;
};

export default translate;
