// Translator for expense management system
const translations = {
  // General expense system terms
  expenses_management: {
    Français: "Gestion des Dépenses",
    Anglais: "Expense Management",
    Bambara: "Wari bɔli ɲɛnabɔli",
  },
  view_help: {
    Français: "Voir l'aide",
    Anglais: "View Help",
    Bambara: "Dɛmɛ lajɛ",
  },
  refresh: {
    Français: "Rafraîchir",
    Anglais: "Refresh",
    Bambara: "A kuraya",
  },
  data_refreshed: {
    Français: "Données rafraîchies avec succès !",
    Anglais: "Data refreshed successfully!",
    Bambara: "Kunnafoniw kuraya ka ɲɛ!",
  },

  // School years
  add_school_year: {
    Français: "Ajouter une année scolaire",
    Anglais: "Add School Year",
    Bambara: "Kalan san kura labɛn",
  },
  add_school_year_tooltip: {
    Français: "Ajouter une nouvelle année scolaire",
    Anglais: "Add a new school year",
    Bambara: "Kalan san kura dɔ labɛn",
  },
  edit_school_year: {
    Français: "Modifier l'année scolaire",
    Anglais: "Edit School Year",
    Bambara: "Kalan san ladilan",
  },
  school_year_expired: {
    Français: "Année scolaire expirée",
    Anglais: "Expired School Year",
    Bambara: "Kalan san tɛmɛnen",
  },
  school_year_expired_readonly: {
    Français: "Les années scolaires expirées sont en lecture seule.",
    Anglais: "Expired school years are read-only.",
    Bambara: "Kalan san tɛmɛnen bɛ se ka kalan dɔrɔn.",
  },
  confirm_delete_year: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "A jɔsili dafa",
  },
  confirm_delete_year_msg: {
    Français:
      "Êtes-vous sûr de vouloir supprimer cette année scolaire et toutes ses dépenses associées ?",
    Anglais:
      "Are you sure you want to delete this school year and all its associated expenses?",
    Bambara:
      "I kɔni dalen don i bɛ nin kalan san in ni a ka wari bɔli bɛɛ jɔsi wa?",
  },
  school_year_deleted: {
    Français: "Année scolaire supprimée avec succès !",
    Anglais: "School year deleted successfully!",
    Bambara: "Kalan san jɔsira ka ɲɛ!",
  },
  school_year_updated: {
    Français: "Année scolaire mise à jour avec succès !",
    Anglais: "School year updated successfully!",
    Bambara: "Kalan san kɔnɔ kunnafoniw ladilanra ka ɲɛ!",
  },
  school_year_added: {
    Français: "Année scolaire ajoutée avec succès !",
    Anglais: "School year added successfully!",
    Bambara: "Kalan san dafara ka ɲɛ!",
  },
  view_school_year_description: {
    Français: "Voir la description",
    Anglais: "View Description",
    Bambara: "Ɲɛfɔli lajɛ",
  },
  school_year_description: {
    Français: "Description de l'année scolaire",
    Anglais: "School Year Description",
    Bambara: "Kalan san ɲɛfɔli",
  },
  close_description: {
    Français: "Fermer la description",
    Anglais: "Close Description",
    Bambara: "Ɲɛfɔli datugu",
  },
  year_already_exists: {
    Français:
      "Une année scolaire avec le même titre et les mêmes dates existe déjà",
    Anglais: "A school year with the same title and dates already exists",
    Bambara: "Kalan san kelen ni tɔgɔ kelen ani waati kelen bɛ yen ka ban",
  },

  // School year form fields
  title: {
    Français: "Titre",
    Anglais: "Title",
    Bambara: "Tɔgɔ",
  },
  title_required: {
    Français: "Le titre est obligatoire",
    Anglais: "Title is required",
    Bambara: "Tɔgɔ ka kan ka sɛbɛn",
  },
  title_length: {
    Français: "Le titre doit contenir entre 10 et 150 caractères",
    Anglais: "Title must be between 10 and 150 characters",
    Bambara: "Tɔgɔ ka kan ka kɛ sɛbɛnni 10 ni 150 cɛ",
  },
  description: {
    Français: "Description",
    Anglais: "Description",
    Bambara: "Ɲɛfɔli",
  },
  description_required: {
    Français: "La description est obligatoire",
    Anglais: "Description is required",
    Bambara: "Ɲɛfɔli ka kan ka sɛbɛn",
  },
  description_length: {
    Français: "La description doit contenir entre 30 et 10000 caractères",
    Anglais: "Description must be between 30 and 10000 characters",
    Bambara: "Ɲɛfɔli ka kan ka kɛ sɛbɛnni 30 ni sɛbɛnni 10000 cɛ",
  },
  start_date: {
    Français: "Date de début",
    Anglais: "Start Date",
    Bambara: "Waati daminɛ don",
  },
  start_date_required: {
    Français: "La date de début est obligatoire",
    Anglais: "Start date is required",
    Bambara: "Waati daminɛ don ka kan ka sɛbɛn",
  },
  end_date: {
    Français: "Date de fin",
    Anglais: "End Date",
    Bambara: "Waati laban don",
  },
  end_date_required: {
    Français: "La date de fin est obligatoire",
    Anglais: "End date is required",
    Bambara: "Waati laban don ka kan ka sɛbɛn",
  },
  date_range_invalid: {
    Français: "La date de fin doit être après la date de début",
    Anglais: "End date must be after start date",
    Bambara: "Waati laban don ka kan ka kɛ waati daminɛ don kɔfɛ",
  },
  date_range_limit: {
    Français:
      "Les dates sont limitées à un an avant ou après la date actuelle pour assurer une meilleure gestion.",
    Anglais:
      "Dates are limited to one year before or after the current date for better management.",
    Bambara:
      "Waatiw dalen don san kelen ɲɛfɛ walima san kelen kɔfɛ bi don na walasa ka baara ɲuman kɛ.",
  },

  // School years list
  all_years: {
    Français: "Toutes",
    Anglais: "All",
    Bambara: "A bɛɛ",
  },
  active_years: {
    Français: "Actives",
    Anglais: "Active",
    Bambara: "Minnu bɛ baara la",
  },
  expired_years: {
    Français: "Expirées",
    Anglais: "Expired",
    Bambara: "Minnu dalen banna",
  },
  search_year: {
    Français: "Rechercher une année...",
    Anglais: "Search for a year...",
    Bambara: "Kalan san dɔ ɲini...",
  },
  no_years_title: {
    Français: "Aucune année scolaire",
    Anglais: "No School Years",
    Bambara: "Kalan san si tɛ yen",
  },
  no_years_message: {
    Français:
      "Vous n'avez pas encore créé d'année scolaire. Commencez par en ajouter une.",
    Anglais: "You haven't created any school years yet. Start by adding one.",
    Bambara: "I ma kalan san si da fɔlɔ. A daminɛ ni kelen dali ye.",
  },
  no_results_title: {
    Français: "Aucun résultat",
    Anglais: "No Results",
    Bambara: "Fɛn si ma sɔrɔ",
  },
  no_results_message: {
    Français: "Aucune année scolaire ne correspond à votre recherche.",
    Anglais: "No school years match your search.",
    Bambara: "Kalan san si ma bɛn i ka ɲinini ma.",
  },
  clear_search: {
    Français: "Effacer la recherche",
    Anglais: "Clear Search",
    Bambara: "Ɲinini jɔsi",
  },
  expenses_count: {
    Français: "Dépenses",
    Anglais: "Expenses",
    Bambara: "Wari bɔ yɔrɔw",
  },
  total_amount: {
    Français: "Montant total",
    Anglais: "Total Amount",
    Bambara: "Wari bɛɛ lajɛlen",
  },
  view_details: {
    Français: "Voir les détails",
    Anglais: "View Details",
    Bambara: "A kɔnɔkow lajɛ",
  },
  edit: {
    Français: "Modifier",
    Anglais: "Edit",
    Bambara: "A yɛlɛma",
  },
  delete: {
    Français: "Supprimer",
    Anglais: "Delete",
    Bambara: "A jɔsi",
  },
  active: {
    Français: "Active",
    Anglais: "Active",
    Bambara: "A bɛ baara la",
  },
  expired: {
    Français: "Expirée",
    Anglais: "Expired",
    Bambara: "A dalen banna",
  },

  // Expenses
  pay_employees: {
    Français: "Payer Des Emplyés",
    Anglais: "To Pay Employees",
    Bambara: "Ka baarakɛlaw ka sara di",
  },
  add_expense: {
    Français: "Ajouter une dépense",
    Anglais: "Add Expense",
    Bambara: "Ka wari bɔ yɔrɔ dɔ fara a kan",
  },
  edit_expense: {
    Français: "Modifier la dépense",
    Anglais: "Edit Expense",
    Bambara: "Ka wari bɔ yɔrɔ yɛlɛma",
  },
  expense_created: {
    Français: "Dépense ajoutée avec succès !",
    Anglais: "Expense added successfully!",
    Bambara: "Wari bɔ yɔrɔ farala a kan ka ɲɛ!",
  },
  expense_updated: {
    Français: "Dépense mise à jour avec succès !",
    Anglais: "Expense updated successfully!",
    Bambara: "Wari bɔ yɔrɔ kɔnɔkow yɛlɛmana ka ɲɛ!",
  },
  expense_deleted: {
    Français: "Dépense supprimée avec succès !",
    Anglais: "Expense deleted successfully!",
    Bambara: "Wari bɔ yɔrɔ jɔsira ka ɲɛ!",
  },
  confirm_delete_expense: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "Ka jɔsili dafa",
  },
  confirm_delete_expense_msg: {
    Français: "Êtes-vous sûr de vouloir supprimer cette dépense ?",
    Anglais: "Are you sure you want to delete this expense?",
    Bambara: "I kɔni dalen don i bɛ nin wari bɔ yɔrɔ in jɔsi wa?",
  },
  expired_year: {
    Français: "Année expirée",
    Anglais: "Expired Year",
    Bambara: "San min dalen banna",
  },

  // Expense form
  expense_name: {
    Français: "Nom de la dépense",
    Anglais: "Expense Name",
    Bambara: "Wari bɔ yɔrɔ tɔgɔ",
  },
  expense_name_placeholder: {
    Français: "Nom de la dépense",
    Anglais: "Expense name",
    Bambara: "Wari bɔ yɔrɔ tɔgɔ",
  },
  expense_name_required: {
    Français: "Le nom de la dépense est requis",
    Anglais: "Expense name is required",
    Bambara: "Wari bɔ yɔrɔ tɔgɔ ka kan ka sɛbɛn",
  },
  expense_name_min_length: {
    Français: "Le nom doit contenir au moins 3 caractères",
    Anglais: "Name must contain at least 3 characters",
    Bambara: "Tɔgɔ ka kan ka kɛ sɛbɛnni 3 walima o sanfɛ",
  },
  expense_name_max_length: {
    Français: "Le nom ne peut pas dépasser 50 caractères",
    Anglais: "Name cannot exceed 50 characters",
    Bambara: "Tɔgɔ tɛ se ka tɛmɛ sɛbɛnni 50 kan",
  },
  expense_description: {
    Français: "Description",
    Anglais: "Description",
    Bambara: "Ɲɛfɔli",
  },
  expense_description_placeholder: {
    Français: "Description détaillée (30-10000 caractères)",
    Anglais: "Detailed description (30-10000 characters)",
    Bambara: "Ɲɛfɔli dafalen (sɛbɛnni 30-10000)",
  },
  expense_description_required: {
    Français: "La description est requise",
    Anglais: "Description is required",
    Bambara: "Ɲɛfɔli ka kan ka sɛbɛn",
  },
  expense_description_min_length: {
    Français: "La description doit contenir au moins 30 caractères",
    Anglais: "Description must contain at least 30 characters",
    Bambara: "Ɲɛfɔli ka kan ka kɛ sɛbɛnni 30 walima o sanfɛ",
  },
  expense_description_max_length: {
    Français: "La description ne peut pas dépasser 10 000 caractères",
    Anglais: "Description cannot exceed 10,000 characters",
    Bambara: "Ɲɛfɔli tɛ se ka tɛmɛ sɛbɛnni 10 000 kan",
  },
  expense_amount: {
    Français: "Montant",
    Anglais: "Amount",
    Bambara: "Wari hakɛ",
  },
  expense_amount_required: {
    Français: "Le montant est requis",
    Anglais: "Amount is required",
    Bambara: "Wari hakɛ ka kan ka sɛbɛn",
  },
  expense_amount_positive: {
    Français: "Le montant doit être un nombre positif",
    Anglais: "Amount must be a positive number",
    Bambara: "Wari hakɛ ka kan ka kɛ jateda ye min ka bon ni zero ye",
  },
  expense_date: {
    Français: "Date",
    Anglais: "Date",
    Bambara: "Waati",
  },
  expense_date_required: {
    Français: "La date est requise",
    Anglais: "Date is required",
    Bambara: "Waati ka kan ka sɛbɛn",
  },
  expense_date_outside_range: {
    Français:
      "La date doit être comprise entre le début et la fin de l'année scolaire",
    Anglais: "Date must be between the school year start and end dates",
    Bambara: "Waati ka kan ka kɛ kalan san daminɛ ni a laban cɛ",
  },
  expense_category: {
    Français: "Catégorie",
    Anglais: "Category",
    Bambara: "Sɛbɛn suguya",
  },
  expense_category_required: {
    Français: "La catégorie est requise",
    Anglais: "Category is required",
    Bambara: "Sɛbɛn suguya ka kan ka sɛbɛn",
  },

  // Expense categories
  employee_payments: {
    Français: "Détails des paiements des Employés",
    Anglais: "Payment details for Employees",
    Bambara: "Baarakɛlaw ka sara kunnafoniw",
  },
  employee_name: {
    Français: "Employé",
    Anglais: "Employee",
    Bambara: "Baarakɛla tɔgɔ",
  },
  employee_post: {
    Français: "Postes",
    Anglais: "Jobs",
    Bambara: "Baara cogoyaw",
  },
  paid_amount: {
    Français: "Montant payé",
    Anglais: "Amount paid",
    Bambara: "Wari hakɛ min saraw",
  },
  // Les Categories des dépenses
  category_supplies: {
    Français: "Fournitures",
    Anglais: "Supplies",
    Bambara: "Baara kɛminɛnw",
  },
  category_equipment: {
    Français: "Équipement",
    Anglais: "Equipment",
    Bambara: "Minɛnw",
  },
  category_salary: {
    Français: "Salaires",
    Anglais: "Salary",
    Bambara: "Saraw",
  },
  category_rent: {
    Français: "Loyer",
    Anglais: "Rent",
    Bambara: "Luso sara",
  },
  category_utilities: {
    Français: "Services",
    Anglais: "Utilities",
    Bambara: "Sèrivisuw",
  },
  category_maintenance: {
    Français: "Maintenance",
    Anglais: "Maintenance",
    Bambara: "Minɛnw labaara",
  },
  category_events: {
    Français: "Événements",
    Anglais: "Events",
    Bambara: "Kɛwalew",
  },
  category_other: {
    Français: "Autres",
    Anglais: "Other",
    Bambara: "Fɛn wɛrɛw",
  },

  // Expenses list
  search_expenses: {
    Français: "Rechercher une dépense...",
    Anglais: "Search expenses...",
    Bambara: "Wari bɔ yɔrɔw ɲini...",
  },
  filters: {
    Français: "Filtres",
    Anglais: "Filters",
    Bambara: "Woloma cogo",
  },
  reset_filters: {
    Français: "Réinitialiser",
    Anglais: "Reset",
    Bambara: "A daminɛ kura",
  },
  category: {
    Français: "Catégorie",
    Anglais: "Category",
    Bambara: "Sɛbɛn suguya",
  },
  all_categories: {
    Français: "Toutes les catégories",
    Anglais: "All categories",
    Bambara: "Sɛbɛn suguya bɛɛ",
  },
  expenses_found: {
    Français: "dépenses trouvées",
    Anglais: "expenses found",
    Bambara: "wari bɔ yɔrɔw sɔrɔlen",
  },
  filtered_from: {
    Français: "filtrées sur",
    Anglais: "filtered from",
    Bambara: "woloma ka bɔ",
  },
  total: {
    Français: "Total",
    Anglais: "Total",
    Bambara: "A bɛɛ lajɛlen",
  },
  date: {
    Français: "Date",
    Anglais: "Date",
    Bambara: "Tile",
  },
  amount: {
    Français: "Montant",
    Anglais: "Amount",
    Bambara: "Wari hakɛ",
  },
  created_at: {
    Français: "Créé le",
    Anglais: "Created on",
    Bambara: "A dilan don",
  },
  updated_at: {
    Français: "Modifié le",
    Anglais: "Updated on",
    Bambara: "A yɛlɛmana don",
  },
  no_matching_expenses: {
    Français: "Aucune dépense ne correspond à vos critères",
    Anglais: "No expenses match your criteria",
    Bambara: "Wari bɔ yɔrɔ si tɛ kɛɲɛ ni i ka ɲininiw ye",
  },
  no_expenses: {
    Français: "Aucune dépense enregistrée",
    Anglais: "No expenses recorded",
    Bambara: "Wari bɔ yɔrɔ si ma sɛbɛn fɔlɔ",
  },
  try_different_filters: {
    Français: "Essayez différents filtres ou effacez votre recherche",
    Anglais: "Try different filters or clear your search",
    Bambara: "Woloma cogo wɛrɛw kɛ walima i ka ɲinini jɔsi",
  },
  add_first_expense: {
    Français:
      "Ajoutez votre première dépense pour commencer à suivre vos finances",
    Anglais: "Add your first expense to start tracking your finances",
    Bambara: "I ka wari bɔ yɔrɔ fɔlɔ sɛbɛn walasa ka i ka wari kɔlɔsili daminɛ",
  },

  // Form actions
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A mara",
  },
  saving: {
    Français: "Enregistrement...",
    Anglais: "Saving...",
    Bambara: "A marali la...",
  },
  update: {
    Français: "Mettre à jour",
    Anglais: "Update",
    Bambara: "A kura don",
  },
  back: {
    Français: "Retour",
    Anglais: "Back",
    Bambara: "Kɔsegin",
  },
  cancel_tooltip: {
    Français: "Annuler et revenir à la liste",
    Anglais: "Cancel and return to list",
    Bambara: "A dabila ka segin sɛbɛn bɛɛ lajɛlen ma",
  },
  save_tooltip: {
    Français: "Enregistrer la nouvelle dépense",
    Anglais: "Save the new expense",
    Bambara: "Wari bɔ yɔrɔ kura in mara",
  },
  update_tooltip: {
    Français: "Enregistrer les modifications",
    Anglais: "Save the changes",
    Bambara: "Yɛlɛmaliw mara",
  },
  delete_error: {
    Français: "Erreur lors de la suppression",
    Anglais: "Error while deleting",
    Bambara: "Fili kɛra ka a jɔsi tuma",
  },
  error_saving: {
    Français: "Erreur lors de l'enregistrement de la dépense",
    Anglais: "Error saving expense",
    Bambara: "Fili kɛra ka wari bɔ yɔrɔ mara tuma",
  },
  character_count: {
    Français: "Caractères",
    Anglais: "Characters",
    Bambara: "Sɛbɛnni hakɛ",
  },
  min_max_chars: {
    Français: "Min: 30 / Max: 10000",
    Anglais: "Min: 30 / Max: 10000",
    Bambara: "Dɔgɔman: 30 / Caman: 10000",
  },

  // Nouvelles traductions pour le texte de l'avertissement dans le formulaire d'année scolaire
  school_year_duplicate_warning_edit: {
    Français:
      "Si vous modifiez le titre ou les dates, assurez-vous qu'il n'existe pas déjà une année scolaire avec les mêmes informations.",
    Anglais:
      "If you modify the title or dates, make sure there isn't already a school year with the same information.",
    Bambara:
      "Ni i bɛ tɔgɔ walima donw yɛlɛma, i ka janto kalansen san wɛrɛ tɛ ni kunnafoni kelenw ye.",
  },
  school_year_duplicate_warning_create: {
    Français:
      "Vous ne pouvez pas créer deux années scolaires avec le même titre, la même date de début et la même date de fin.",
    Anglais:
      "You cannot create two school years with the same title, start date, and end date.",
    Bambara:
      "I tɛ se ka kalansen san fila da ni tɔgɔ kelen, daminɛ don kelen ani laban don kelen ye.",
  },

  // Traductions des mois pour formatDate
  month_january: {
    Français: "janvier",
    Anglais: "January", 
    Bambara: "Zanwuyekalo",
  },
  month_february: {
    Français: "février",
    Anglais: "February",
    Bambara: "feburuyekalo",
  },
  month_march: {
    Français: "mars",
    Anglais: "March",
    Bambara: "Marisikalo",
  },
  month_april: {
    Français: "avril",
    Anglais: "April",
    Bambara: "Awirilikalo",
  },
  month_may: {
    Français: "mai",
    Anglais: "May",
    Bambara: "Mɛkalo",
  },
  month_june: {
    Français: "juin",
    Anglais: "June",
    Bambara: "Zuwɛnkalo",
  },
  month_july: {
    Français: "juillet",
    Anglais: "July",
    Bambara: "Zuyekalo",
  },
  month_august: {
    Français: "août",
    Anglais: "August",
    Bambara: "Utikalo",
  },
  month_september: {
    Français: "septembre",
    Anglais: "September",
    Bambara: "Sɛtanburukalo",
  },
  month_october: {
    Français: "octobre",
    Anglais: "October",
    Bambara: "Ɔkutɔburukalo",
  },
  month_november: {
    Français: "novembre",
    Anglais: "November",
    Bambara: "Nowanburukalo",
  },
  month_december: {
    Français: "décembre",
    Anglais: "December",
    Bambara: "Desanburukalo",
  },

  // Nouvelles traductions pour les textes manquants
  id: {
    Français: "ID",
    Anglais: "ID",
    Bambara: "ID",
  },
  created_on: {
    Français: "Créé le",
    Anglais: "Created on",
    Bambara: "A dilan don",
  },
  updated_on: {
    Français: "Mis à jour le",
    Anglais: "Updated on",
    Bambara: "A kuraya don",
  },
  close: {
    Français: "Fermer",
    Anglais: "Close",
    Bambara: "A datugu",
  },
  complete_guide: {
    Français: "Guide complet de gestion des dépenses",
    Anglais: "Complete Expense Management Guide",
    Bambara: "Wari bɔ cogoya bɛɛ lajɛlen ka ɲɛsin",
  },

  // InfoPopup - Sections principales
  overview: {
    Français: "Vue d'ensemble",
    Anglais: "Overview",
    Bambara: "A bɛɛ lajɛlen ɲɛfɔli",
  },
  guide_intro_content: {
    Français:
      "Le système de gestion des dépenses est conçu pour vous aider à suivre efficacement toutes les dépenses de votre établissement scolaire. Organisé par années scolaires, il vous permet de maintenir une comptabilité précise et de générer des rapports détaillés sur vos finances.",
    Anglais:
      "The expense management system is designed to help you effectively track all expenses of your school. Organized by school years, it allows you to maintain accurate accounting and generate detailed reports on your finances.",
    Bambara:
      "Wari bɔ cogoya in dabɔlen don walasa ka i dɛmɛ ka i ka lakɔli wari bɔ yɔrɔw bɛɛ kɔlɔsi ka ɲɛ. A sigilen don kalansen sanw kɔnɔ, min b'a to i ka wari jate tilennen mara ani ka sɛbɛn dakɔrɔlenw bɔ i ka wari kow kan.",
  },
  system_structure: {
    Français: "Structure du système",
    Anglais: "System Structure",
    Bambara: "Baara cogoya labɛnnen",
  },
  system_structured_levels: {
    Français:
      "Le système est structuré en deux niveaux hiérarchiques principaux :",
    Anglais: "The system is structured in two main hierarchical levels:",
    Bambara: "Baara cogoya in tilalen don fan fila ma:",
  },
  recommended_workflow: {
    Français: "Flux de travail recommandé",
    Anglais: "Recommended Workflow",
    Bambara: "Baara kɛcogo ɲuman",
  },
  main_features: {
    Français: "Fonctionnalités principales",
    Anglais: "Main Features",
    Bambara: "Baara kɛcogo fanba fɔlɔw",
  },
  best_practices: {
    Français: "Bonnes pratiques",
    Anglais: "Best Practices",
    Bambara: "Baara kɛcogo ɲumanw",
  },
  important_warnings: {
    Français: "Avertissements importants",
    Anglais: "Important Warnings",
    Bambara: "Kɔlɔsili nafama minnu ka kan ka kɛ",
  },
  practical_tips: {
    Français: "Conseils pratiques",
    Anglais: "Practical Tips",
    Bambara: "Ladilikan nafamaw",
  },

  // Structure items - School Years
  school_years_structure: {
    Français: "Années scolaires",
    Anglais: "School Years",
    Bambara: "Kalansen sanw",
  },
  school_years_desc: {
    Français:
      "Chaque année scolaire représente un cadre temporel défini par une date de début et une date de fin. Ces périodes servent de conteneurs pour toutes vos dépenses.",
    Anglais:
      "Each school year represents a time frame defined by a start date and an end date. These periods serve as containers for all your expenses.",
    Bambara:
      "Kalansen san kelen o kelen bɛɛ ye waati dɔ ye min daminɛ don ni a laban don bɛ sɛbɛn. O waatiw bɛ kɛ i ka wari bɔ yɔrɔw bɛɛ mara cogoya ye.",
  },

  // Structure items - Expenses
  expenses_structure: {
    Français: "Dépenses",
    Anglais: "Expenses",
    Bambara: "Wari bɔ yɔrɔw",
  },
  expenses_desc: {
    Français:
      "Les dépenses individuelles sont associées à une année scolaire spécifique. Chaque dépense comprend un nom, un montant, une catégorie, une date et une description détaillée.",
    Anglais:
      "Individual expenses are associated with a specific school year. Each expense includes a name, amount, category, date, and detailed description.",
    Bambara:
      "Wari bɔ yɔrɔ kelen kelen bɛɛ ye kalansen san kelen ta ye. Wari bɔ yɔrɔ kelen kelen bɛɛ kɔnɔ, tɔgɔ, wari hakɛ, sɛbɛn suguya, don ani bayɛlɛmali dakɔrɔlen bɛ sɔrɔ.",
  },

  // Workflow steps
  workflow_step1: {
    Français:
      "Créez d'abord une année scolaire avec des dates précises couvrant votre période académique.",
    Anglais:
      "First, create a school year with precise dates covering your academic period.",
    Bambara:
      "Fɔlɔ, kalan san dɔ dabɔ ni don kɛrɛnkɛrɛnnenw ye minnu bɛ i ka kalan waati bɛɛ minɛ.",
  },
  workflow_step2: {
    Français:
      "Ajoutez progressivement vos dépenses dans l'ordre chronologique au fur et à mesure qu'elles surviennent.",
    Anglais:
      "Gradually add your expenses in chronological order as they occur.",
    Bambara: "I ka musaka sɛbɛn ka tugu ɲɔgɔn kɔ ka kɛɲɛ ni u kɛ waati ye.",
  },
  workflow_step3: {
    Français:
      "Utilisez des catégories cohérentes pour faciliter le suivi et l'analyse ultérieure.",
    Anglais:
      "Use consistent categories to facilitate tracking and subsequent analysis.",
    Bambara:
      "Musaka suguya kelen-kelenw bila sen na walasa ka u kɔlɔsili ni u sɛgɛsɛgɛli nɔgɔya.",
  },
  workflow_step4: {
    Français:
      "Consultez régulièrement les totaux et les statistiques pour surveiller vos finances.",
    Anglais: "Regularly check totals and statistics to monitor your finances.",
    Bambara:
      "I ka wari hakɛw ni u jateminɛw lajɛ waati ni waati walasa ka i ka wari kɔlɔsi kosɛbɛ.",
  },
  workflow_step5: {
    Français:
      "Archivez automatiquement les années expirées tout en conservant l'accès pour référence future.",
    Anglais:
      "Automatically archive expired years while maintaining access for future reference.",
    Bambara:
      "San tɛmɛnenw mara u yɛrɛma ka sɔrɔ ka u ladon walasa ka se ka u lajɛ don nataw la.",
  },

  // Best practices
  strict_timeline: {
    Français: "Chronologie stricte",
    Anglais: "Strict Timeline",
    Bambara: "Waati sariyaw",
  },
  strict_timeline_content: {
    Français:
      "Enregistrez vos dépenses dans l'ordre chronologique pour maintenir une trace précise et cohérente. Évitez d'ajouter des dépenses en désordre, ce qui pourrait compliquer l'analyse financière.",
    Anglais:
      "Record your expenses in chronological order to maintain accurate and consistent tracking. Avoid adding expenses out of order, which could complicate financial analysis.",
    Bambara:
      "I ka musakaw sɛbɛn ka tugu ɲɔgɔn kɔ walasa ka u kɔlɔsili kɛ ka ɲɛ. I kana musakaw sɛbɛn ka ɲɔgɔn ɲagami, o bɛ se ka wari sɛgɛsɛgɛli gɛlɛya.",
  },
  consistent_categorization: {
    Français: "Catégorisation cohérente",
    Anglais: "Consistent Categorization",
    Bambara: "Musaka suguya cogoya",
  },
  consistent_categorization_content: {
    Français:
      "Utilisez systématiquement les mêmes catégories pour des dépenses similaires afin de garantir des rapports et des analyses précis.",
    Anglais:
      "Consistently use the same categories for similar expenses to ensure accurate reports and analyses.",
    Bambara:
      "Musaka suguya kelenw kɛ tuma bɛɛ musaka kɛrɛnkɛrɛnnenw ye walasa ka sɛbɛnni ni sɛgɛsɛgɛli ɲuman sɔrɔ.",
  },
  detailed_descriptions: {
    Français: "Descriptions détaillées",
    Anglais: "Detailed Descriptions",
    Bambara: "Ɲɛfɔli dafalen",
  },
  detailed_descriptions_content: {
    Français:
      "Rédigez des descriptions complètes pour chaque dépense (minimum 30 caractères) incluant le contexte, la justification et les parties prenantes concernées.",
    Anglais:
      "Write complete descriptions for each expense (minimum 30 characters) including context, justification, and relevant stakeholders.",
    Bambara:
      "Musaka kelen-kelen bɛɛ ɲɛfɔ ka ɲɛ (sɛbɛnni fitini ka kan ka kɛ 30) ka a kɛcogo, a kun ani a mɔgɔw bɛɛ fɔ.",
  },
  regular_verification: {
    Français: "Vérification régulière",
    Anglais: "Regular Verification",
    Bambara: "Lajɛli kɛ waati ni waati",
  },
  regular_verification_content: {
    Français:
      "Examinez périodiquement vos dépenses pour identifier les tendances et optimiser votre budget futur.",
    Anglais:
      "Periodically review your expenses to identify trends and optimize your future budget.",
    Bambara:
      "I ka musakaw lajɛ waati ni waati walasa ka u taabolow dɔn ani ka i ka wari kɛcogo ɲɛsin ɲɛfɛ.",
  },
  data_backup: {
    Français: "Sauvegarde des données",
    Anglais: "Data Backup",
    Bambara: "Kunnafoniw maracogo",
  },
  data_backup_content: {
    Français:
      "Effectuez régulièrement des sauvegardes de vos données financières pour éviter toute perte d'information.",
    Anglais:
      "Regularly back up your financial data to avoid any loss of information.",
    Bambara: "I ka wari kunnafoniw mara waati ni waati walasa u kana tunun.",
  },

  // Features
  advanced_filtering: {
    Français: "Filtrage avancé",
    Anglais: "Advanced Filtering",
    Bambara: "Woloma cogo kofɔlen",
  },
  advanced_filtering_desc: {
    Français:
      "Filtrez les dépenses par catégorie, date ou mot-clé pour trouver rapidement ce que vous cherchez.",
    Anglais:
      "Filter expenses by category, date, or keyword to quickly find what you're looking for.",
    Bambara:
      "Musakaw woloma u suguyaw, u donw, walima u tɔgɔw la walasa ka i bɛ min ɲini o ye joona.",
  },
  totals_visualization: {
    Français: "Visualisation des totaux",
    Anglais: "Totals Visualization",
    Bambara: "Jatew lajɛlen jirali",
  },
  totals_visualization_desc: {
    Français:
      "Consultez instantanément le total des dépenses pour chaque année scolaire et catégorie.",
    Anglais:
      "Instantly view the total expenses for each school year and category.",
    Bambara:
      "Kalansen san kelen kelen ni suguyali bɛɛ ka musaka hakɛ lajɛlen ye teliya la.",
  },
  data_protection: {
    Français: "Protection des données",
    Anglais: "Data Protection",
    Bambara: "Kunnafoniw tangali",
  },
  data_protection_desc: {
    Français:
      "Les années expirées sont automatiquement verrouillées pour préserver l'intégrité des données historiques.",
    Anglais:
      "Expired years are automatically locked to preserve the integrity of historical data.",
    Bambara:
      "San tɛmɛnenw bɛ datugu u yɛrɛma walasa ka kɔfɛ kunnafoniw lakana ka ɲɛ.",
  },
  responsive_interface: {
    Français: "Interface réactive",
    Anglais: "Responsive Interface",
    Bambara: "Ɲɛjira teliya man",
  },
  responsive_interface_desc: {
    Français:
      "Profitez d'une expérience utilisateur fluide grâce à des transitions animées et un design responsive.",
    Anglais:
      "Enjoy a smooth user experience with animated transitions and responsive design.",
    Bambara:
      "Ka baara kɛ ni nɔgɔya ye ni yɛlɛmali ɲumanw ni ɲɛjira nɔgɔman ye.",
  },

  // Warnings
  expired_school_years_warning: {
    Français: "Années scolaires expirées",
    Anglais: "Expired School Years",
    Bambara: "Kalansen san tɛmɛnenw",
  },
  expired_school_years_content: {
    Français:
      "Une année scolaire devient automatiquement en lecture seule lorsque sa date de fin est dépassée. Vous ne pourrez ni la modifier, ni la supprimer, ni ajouter ou modifier ses dépenses. Cette restriction garantit l'intégrité de vos données historiques.",
    Anglais:
      "A school year automatically becomes read-only when its end date has passed. You will not be able to modify it, delete it, or add or modify its expenses. This restriction ensures the integrity of your historical data.",
    Bambara:
      "Ni kalansen san dɔ laban don tɛmɛna, a bɛ kɛ kalan dɔrɔn ye. I tɛna se ka fɛn yɛlɛma a la, k'a jɔsi, walima ka musaka fara a kan walima k'a musakaw yɛlɛma. O dansigi bɛ kɔfɛ kunnafoniw lakana ka ɲɛ.",
  },
  mandatory_descriptions_warning: {
    Français: "Descriptions obligatoires",
    Anglais: "Mandatory Descriptions",
    Bambara: "Ɲɛfɔli wajibiyanenw",
  },
  mandatory_descriptions_content: {
    Français:
      "Chaque dépense nécessite une description détaillée entre 30 et 10 000 caractères. Cette exigence assure une documentation complète et favorise la transparence financière.",
    Anglais:
      "Each expense requires a detailed description between 30 and 10,000 characters. This requirement ensures complete documentation and promotes financial transparency.",
    Bambara:
      "Musaka bɛɛ ka kan ka ɲɛfɔ ka ɲɛ ni sɛbɛnni 30 ni 10 000 cɛ. O wajibiya bɛ kunnafoni dafalen di ani ka wari kow kɛ kɛnɛ kan.",
  },
  expense_dates_warning: {
    Français: "Dates des dépenses",
    Anglais: "Expense Dates",
    Bambara: "Musaka kɛ donw",
  },
  expense_dates_content: {
    Français:
      "La date d'une dépense doit obligatoirement se situer entre la date de début et la date de fin de son année scolaire. Toute date en dehors de cette plage sera refusée.",
    Anglais:
      "The date of an expense must be between the start date and end date of its school year. Any date outside this range will be rejected.",
    Bambara:
      "Musaka kɛ don ka kan ka kɛ kalansen san daminɛ don ni a laban don cɛ. Don min tɛ o waati kɔnɔ, o tɛna sɔn.",
  },
  duplicate_years_warning: {
    Français: "Années scolaires dupliquées",
    Anglais: "Duplicate School Years",
    Bambara: "Kalansen san ɲɔgɔnw",
  },
  duplicate_years_content: {
    Français:
      "Le système empêche la création d'années scolaires en double. Deux années ne peuvent pas avoir simultanément le même titre, la même date de début et la même date de fin.",
    Anglais:
      "The system prevents the creation of duplicate school years. Two years cannot have the same title, start date, and end date simultaneously.",
    Bambara:
      "Baara in tɛ sɔn kalansen san kelen ka kɛ siɲɛ fila ye. San fila tɛ se ka kɛ ni tɔgɔ kelen, daminɛ don kelen ani laban don kelen ye waati kelen na.",
  },

  // Tips
  advance_planning: {
    Français: "Planification préalable",
    Anglais: "Advance Planning",
    Bambara: "Labɛnni kɔfɛ",
  },
  advance_planning_content: {
    Français:
      "Créez votre nouvelle année scolaire avant la fin de l'année en cours pour assurer une transition sans heurts.",
    Anglais:
      "Create your new school year before the end of the current year to ensure a smooth transition.",
    Bambara:
      "I ka kalansen san kura da sani bi ta ka ban walasa yɛlɛmali ka kɛ ni nɔgɔya ye.",
  },
  consistent_naming: {
    Français: "Nomenclature cohérente",
    Anglais: "Consistent Naming",
    Bambara: "Tɔgɔ dali kɛcogo kelen",
  },
  consistent_naming_content: {
    Français:
      "Utilisez un système de nommage uniforme pour toutes vos dépenses afin de faciliter les recherches et le tri.",
    Anglais:
      "Use a uniform naming system for all your expenses to facilitate searches and sorting.",
    Bambara:
      "Tɔgɔ dali cogo kelen kɛ i ka musaka bɛɛ la walasa ka ɲinini ni woloma nɔgɔya.",
  },
  monthly_check: {
    Français: "Vérification mensuelle",
    Anglais: "Monthly Check",
    Bambara: "Kalo kɔnɔ sɛgɛsɛgɛli",
  },
  monthly_check_content: {
    Français:
      "Réservez du temps chaque mois pour vérifier que toutes les dépenses ont été correctement enregistrées.",
    Anglais:
      "Set aside time each month to verify that all expenses have been correctly recorded.",
    Bambara:
      "Waati bɔ kalo o kalo ka musaka bɛɛ sɛgɛsɛgɛ k'a lajɛ ni u sɛbɛnna ka ɲɛ.",
  },
  quarterly_analysis: {
    Français: "Analyse trimestrielle",
    Anglais: "Quarterly Analysis",
    Bambara: "Kalo saba o saba sɛgɛsɛgɛli",
  },
  quarterly_analysis_content: {
    Français:
      "Analysez vos dépenses par trimestre pour identifier les tendances et ajuster votre budget en conséquence.",
    Anglais:
      "Analyze your expenses quarterly to identify trends and adjust your budget accordingly.",
    Bambara:
      "I ka musakaw sɛgɛsɛgɛ kalo saba o saba walasa ka u taabolow dɔn ani ka wari kɛcogo ɲɛnabɔ o la.",
  },

  // Important chronological note
  chronological_order_title: {
    Français: "Ordre chronologique essentiel",
    Anglais: "Essential Chronological Order",
    Bambara: "Waati tugu ɲɔgɔn kɔ nafama",
  },
  chronological_order_strong: {
    Français:
      "Il est fortement recommandé de créer vos dépenses dans l'ordre chronologique.",
    Anglais:
      "It is strongly recommended to create your expenses in chronological order.",
    Bambara: "A ka kan kosɛbɛ i ka musakaw da ka tugu u kɛ waati ɲɔgɔn kɔ.",
  },
  chronological_order_content: {
    Français:
      "Cette pratique est cruciale pour maintenir une comptabilité précise et faciliter les audits financiers. La création de dépenses en désordre peut entraîner des erreurs d'analyse et compliquer la gestion budgétaire.",
    Anglais:
      "This practice is crucial for maintaining accurate accounting and facilitating financial audits. Creating expenses out of order can lead to analysis errors and complicate budget management.",
    Bambara:
      "O baara kɛcogo ka kan kosɛbɛ walasa ka wari jate tilennen mara ani ka wari sɛgɛsɛgɛli nɔgɔya. Ni musakaw ma da ka tugu u kɛ waati ɲɔgɔn kɔ, o bɛ se ka sɛgɛsɛgɛli fili ani ka wari mara gɛlɛya.",
  },

  // Footer note
  footer_note: {
    Français:
      "Une gestion rigoureuse des dépenses est essentielle pour optimiser votre budget scolaire et assurer la pérennité financière de votre établissement.",
    Anglais:
      "Rigorous expense management is essential to optimize your school budget and ensure the financial sustainability of your institution.",
    Bambara:
      "Musaka mara ɲuman ka kan kosɛbɛ walasa ka i ka kalansen wari kɛcogo ɲɛnabɔ ani ka i ka lakɔli wari sabati.",
  },

  // Nouvelles clés pour SchoolYearsList
  period: {
    Français: "Période",
    Anglais: "Period",
    Bambara: "Waati",
  },
  information: {
    Français: "Informations",
    Anglais: "Information",
    Bambara: "Kunnafoni",
  },
  expense_count: {
    Français: "Nombre de dépenses",
    Anglais: "Expense Count",
    Bambara: "Musaka hakɛ",
  },
  total_amount: {
    Français: "Montant total",
    Anglais: "Total Amount",
    Bambara: "Wari hakɛ bɛɛ lajɛlen",
  },

  // School year form templates
  school_year_title_template: {
    Français: "Année Scolaire YEAR1-YEAR2",
    Anglais: "School Year YEAR1-YEAR2",
    Bambara: "Kalansen san YEAR1-YEAR2",
  },
  school_year_description_template: {
    Français: "Année scolaire complète de septembre YEAR1 à juin YEAR2.",
    Anglais: "Complete school year from September YEAR1 to June YEAR2.",
    Bambara:
      "Kalansen san dafalen ka bɔ sɛtanburukalo YEAR1 ka se zuwɛnkalo YEAR2.",
  },
};

// Add employee payment translations
const newTranslations = {
  // School year form default texts
  school_year_title_template: {
    Français: "Année Scolaire YEAR1-YEAR2",
    Anglais: "School Year YEAR1-YEAR2",
    Bambara: "Kalansen san YEAR1-YEAR2",
  },
  school_year_description_template: {
    Français: "Année scolaire complète de septembre YEAR1 à juin YEAR2.",
    Anglais: "Complete school year from September YEAR1 to June YEAR2.",
    Bambara:
      "Kalansen san dafalen ka bɔ sɛtanburukalo YEAR1 ka se zuwɛnkalo YEAR2.",
  },
  pay_employees: {
    Français: "Année Scolaire YEAR1-YEAR2",
    Anglais: "School Year YEAR1-YEAR2",
    Bambara: "Kalansen san YEAR1-YEAR2",
  },
  school_year_description_template: {
    Français: "Année scolaire complète de septembre YEAR1 à juin YEAR2.",
    Anglais: "Complete school year from September YEAR1 to June YEAR2.",
    Bambara:
      "Kalansen san dafalen ka bɔ sɛtanburukalo YEAR1 ka se zuwɛnkalo YEAR2.",
  },

  // Employee payment form
  pay_employees: {
    Français: "Payer les employés",
    Anglais: "Pay employees",
    Bambara: "Baarakɛlaw ka sara",
  },
  select_employees_to_pay: {
    Français: "Sélectionner les employés à payer",
    Anglais: "Select employees to pay",
    Bambara: "Baarakɛlaw ɲanata ka sara",
  },
  select_employees_instruction: {
    Français:
      "Sélectionnez les employés que vous souhaitez payer. Vous pouvez utiliser les filtres pour affiner votre recherche.",
    Anglais:
      "Select the employees you want to pay. You can use filters to refine your search.",
    Bambara:
      "I b'a fɛ ka baarakɛlaw minw sara, olu sugandi. I bɛ se ka taamasiɲɛw kɛ ka i ka ɲinini teliya.",
  },
  search_employees: {
    Français: "Rechercher des employés...",
    Anglais: "Search employees...",
    Bambara: "Baarakɛlaw ɲinini...",
  },
  toggle_filters: {
    Français: "Afficher/masquer les filtres",
    Anglais: "Toggle filters",
    Bambara: "Taamasiɲɛw yira/dogo",
  },
  filter_by_status: {
    Français: "Filtrer par statut",
    Anglais: "Filter by status",
    Bambara: "Ka taamasiɲɛ kɛ ka kɛcogo kɔrɔbɔ",
  },
  filter_by_type: {
    Français: "Filtrer par type",
    Anglais: "Filter by type",
    Bambara: "Ka taamasiɲɛ kɛ ka suguya kɔrɔbɔ",
  },
  all_employees: {
    Français: "Tous les employés",
    Anglais: "All employees",
    Bambara: "Baarakɛlaw bɛɛ",
  },
  active_employees: {
    Français: "Employés actifs",
    Anglais: "Active employees",
    Bambara: "Baarakɛlaw minw bɛ baara la",
  },
  inactive_employees: {
    Français: "Employés inactifs",
    Anglais: "Inactive employees",
    Bambara: "Baarakɛlaw minw tɛ baara la",
  },
  all_positions: {
    Français: "Tous les postes",
    Anglais: "All positions",
    Bambara: "Baara cogoya bɛɛ",
  },
  professors_only: {
    Français: "Professeurs uniquement",
    Anglais: "Professors only",
    Bambara: "Karamɔgɔw dɔrɔn",
  },
  other_staff: {
    Français: "Autres personnels",
    Anglais: "Other staff",
    Bambara: "Baarakɛla suguya wɛrɛw",
  },
  employees_found: {
    Français: "employés trouvés",
    Anglais: "employees found",
    Bambara: "baarakɛla sɔrɔlen",
  },
  employees_selected: {
    Français: "employés sélectionnés",
    Anglais: "employees selected",
    Bambara: "baarakɛla sugandilen",
  },
  select_all: {
    Français: "Tout sélectionner",
    Anglais: "Select all",
    Bambara: "Ka bɛɛ sugandi",
  },
  deselect_all: {
    Français: "Tout désélectionner",
    Anglais: "Deselect all",
    Bambara: "Ka bɛɛ sugandili bɔ",
  },
  active_status: {
    Français: "Actif",
    Anglais: "Active",
    Bambara: "A bɛ baara la",
  },
  inactive_status: {
    Français: "Inactif",
    Anglais: "Inactive",
    Bambara: "A tɛ baara la",
  },
  no_employees_found: {
    Français: "Aucun employé trouvé",
    Anglais: "No employees found",
    Bambara: "Baarakɛla si ma sɔrɔ",
  },
  try_different_filters: {
    Français: "Essayez différents filtres ou critères de recherche",
    Anglais: "Try different filters or search criteria",
    Bambara: "Taamasiɲɛ wɛrɛw walima ɲinini cogoya wɛrɛw kɛ",
  },
  select_at_least_one_employee: {
    Français: "Veuillez sélectionner au moins un employé",
    Anglais: "Please select at least one employee",
    Bambara: "I ka kan ka baarakɛla kelen sugandi dɔɔni-dɔɔni",
  },

  // Payment configuration
  configure_payments: {
    Français: "Configurer les paiements",
    Anglais: "Configure payments",
    Bambara: "Ka saraw labɛn",
  },
  configure_payments_instruction: {
    Français:
      "Pour chaque employé, sélectionnez les postes pour lesquels vous souhaitez effectuer un paiement et définissez les montants.",
    Anglais:
      "For each employee, select the positions you want to pay for and set the amounts.",
    Bambara:
      "Baarakɛla kelen-kelen bɛɛ kama, i b'a fɛ ka baara minw sara, olu sugandi ani ka sara hakɛw sɛbɛn.",
  },
  select_positions_to_pay: {
    Français: "Sélectionner les postes à payer",
    Anglais: "Select positions to pay",
    Bambara: "Baara cogoya minw ka kan ka sara sugandi",
  },
  work_hours: {
    Français: "Heures de travail",
    Anglais: "Work hours",
    Bambara: "Baara waatiw",
  },
  hourly_rate: {
    Français: "Taux horaire",
    Anglais: "Hourly rate",
    Bambara: "Waati kelen sara",
  },
  hours: {
    Français: "heures",
    Anglais: "hours",
    Bambara: "waatiw",
  },
  minutes: {
    Français: "minutes",
    Anglais: "minutes",
    Bambara: "miniti",
  },
  total_salary_for_hours: {
    Français: "Salaire total pour les heures",
    Anglais: "Total salary for hours",
    Bambara: "Waatiw bɛɛ lajɛlen sara",
  },
  payment_for: {
    Français: "Paiement pour",
    Anglais: "Payment for",
    Bambara: "Sara min bɛ di",
  },
  custom_amount: {
    Français: "Montant personnalisé",
    Anglais: "Custom amount",
    Bambara: "Sara hakɛ kɛrɛnkɛrɛnnen",
  },
  percentage: {
    Français: "Pourcentage %",
    Anglais: "Percentage %",
    Bambara: "Kɛmɛ kɔnɔ %",
  },
  switch_to_percentage: {
    Français: "Passer au pourcentage",
    Anglais: "Switch to percentage",
    Bambara: "Kɛmɛ kɔnɔ jateli fɛ taa",
  },
  switch_to_custom_amount: {
    Français: "Passer au montant personnalisé",
    Anglais: "Switch to custom amount",
    Bambara: "Wari hakɛ sugandilen fɛ taa",
  },
  minimum_amount: {
    Français: "Montant minimum",
    Anglais: "Minimum amount",
    Bambara: "Wari hakɛ fitini",
  },
  base_salary: {
    Français: "Salaire de base",
    Anglais: "Base salary",
    Bambara: "Sariya kɔnɔ sara",
  },
  amount_to_pay: {
    Français: "Montant à payer",
    Anglais: "Amount to pay",
    Bambara: "Wari min ka kan ka sara",
  },
  select_at_least_one_position_per_employee: {
    Français: "Veuillez sélectionner au moins un poste pour chaque employé",
    Anglais: "Please select at least one position for each employee",
    Bambara: "I ka baara kelen sugandi baarakɛla kelen kelen bɛɛ ye",
  },

  // Payment details
  payment_details: {
    Français: "Détails du paiement",
    Anglais: "Payment details",
    Bambara: "Saralicogo ɲɛfɔli",
  },
  payment_details_instruction: {
    Français:
      "Veuillez fournir les informations générales concernant ce paiement.",
    Anglais: "Please provide general information about this payment.",
    Bambara: "Sara in ka kunnafoni bɛɛ lajɛlen di.",
  },
  payment_summary: {
    Français: "Récapitulatif du paiement",
    Anglais: "Payment summary",
    Bambara: "Sara kunnafoni kunbabaw",
  },
  please_review_details: {
    Français: "Veuillez vérifier les détails avant de confirmer",
    Anglais: "Please review details before confirming",
    Bambara: "I ka kunnafoniw bɛɛ lajɛ ka ɲɛ sani ka son a ma",
  },
  original_amount: {
    Français: "Montant initial",
    Anglais: "Original amount",
    Bambara: "Fɔlɔ wari hakɛ",
  },
  total_to_pay: {
    Français: "Total à payer",
    Anglais: "Total to pay",
    Bambara: "Wari hakɛ min bɛɛ ka kan ka sara",
  },
  saving: {
    Français: "Économie",
    Anglais: "Saving",
    Bambara: "Wari mara",
  },
  payment_title: {
    Français: "Titre du paiement",
    Anglais: "Payment title",
    Bambara: "Sara tɔgɔ",
  },
  payment_title_placeholder: {
    Français: "Ex: Paiement des salaires - Mai 2024",
    Anglais: "Ex: Salary payment - May 2024",
    Bambara: "Misali: Saraw saralicogo - Mɛkalo 2024",
  },
  payment_title_help: {
    Français: "Entre 10 et 150 caractères",
    Anglais: "Between 10 and 150 characters",
    Bambara: "Sɛbɛnni hakɛ ka kɛ 10 ni 150 cɛ",
  },
  payment_date: {
    Français: "Date du paiement",
    Anglais: "Payment date",
    Bambara: "Sara don",
  },
  payment_description: {
    Français: "Description du paiement",
    Anglais: "Payment description",
    Bambara: "Sara ɲɛfɔli",
  },
  payment_description_placeholder: {
    Français:
      "Décrivez les détails de ce paiement (personnes concernées, raison, etc.)",
    Anglais:
      "Describe the details of this payment (people involved, reason, etc.)",
    Bambara: "Sara in kunnafoni bɛɛ ɲɛfɔ (mɔgɔ minnu bɛ a la, kun, ani tɔw)",
  },
  payment_description_help: {
    Français: "Entre 30 et 10000 caractères",
    Anglais: "Between 30 and 10000 characters",
    Bambara: "Sɛbɛnni hakɛ ka kɛ 30 ni 10000 cɛ",
  },

  // Navigation
  previous: {
    Français: "Précédent",
    Anglais: "Previous",
    Bambara: "Kɔfɛ",
  },
  next: {
    Français: "Suivant",
    Anglais: "Next",
    Bambara: "Ɲɛfɛ",
  },
  saving: {
    Français: "Enregistrement...",
    Anglais: "Saving...",
    Bambara: "Bɛ mara...",
  },

  // Error messages
  add_error: {
    Français: "Erreur lors de l'ajout de la dépense",
    Anglais: "Error adding the expense",
    Bambara: "Fili kɛra musaka farali la",
  },
};

// Merge new translations with existing ones
export default {
  ...translations,
  ...newTranslations,
};
