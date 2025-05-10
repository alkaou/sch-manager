// Translator for expense management system
const translations = {
  // General expense system terms
  "expenses_management": {
    "Français": "Gestion des Dépenses",
    "Anglais": "Expense Management",
    "Bambara": "Musaka kɛcogo"
  },
  "view_help": {
    "Français": "Voir l'aide",
    "Anglais": "View Help",
    "Bambara": "Dɛmɛ ɲɛfɔli lajɛ"
  },
  "refresh": {
    "Français": "Rafraîchir",
    "Anglais": "Refresh",
    "Bambara": "Kura don"
  },
  "data_refreshed": {
    "Français": "Données rafraîchies avec succès !",
    "Anglais": "Data refreshed successfully!",
    "Bambara": "Kunnafoniw kura donnen don ni ɲɛtaa ye!"
  },
  
  // School years
  "add_school_year": {
    "Français": "Ajouter une année scolaire",
    "Anglais": "Add School Year",
    "Bambara": "Kalansen san kura fara"
  },
  "add_school_year_tooltip": {
    "Français": "Ajouter une nouvelle année scolaire",
    "Anglais": "Add a new school year",
    "Bambara": "Kalansen san kura dɔ fara"
  },
  "edit_school_year": {
    "Français": "Modifier l'année scolaire",
    "Anglais": "Edit School Year",
    "Bambara": "Kalansen san yɛlɛma"
  },
  "school_year_expired": {
    "Français": "Année scolaire expirée",
    "Anglais": "Expired School Year",
    "Bambara": "Kalansen san tɛmɛnen"
  },
  "school_year_expired_readonly": {
    "Français": "Les années scolaires expirées sont en lecture seule.",
    "Anglais": "Expired school years are read-only.",
    "Bambara": "Kalansen san tɛmɛnew bɛ kalan dɔrɔn."
  },
  "confirm_delete_year": {
    "Français": "Confirmer la suppression",
    "Anglais": "Confirm Deletion",
    "Bambara": "Jɔsili jɛtigi"
  },
  "confirm_delete_year_msg": {
    "Français": "Êtes-vous sûr de vouloir supprimer cette année scolaire et toutes ses dépenses associées ?",
    "Anglais": "Are you sure you want to delete this school year and all its associated expenses?",
    "Bambara": "I dalen don i bɛ nin kalansen san in ni a ka musaka bɛɛ jɔsi?"
  },
  "school_year_deleted": {
    "Français": "Année scolaire supprimée avec succès !",
    "Anglais": "School year deleted successfully!",
    "Bambara": "Kalansen san jɔsira ni ɲɛtaa ye!"
  },
  "school_year_updated": {
    "Français": "Année scolaire mise à jour avec succès !",
    "Anglais": "School year updated successfully!",
    "Bambara": "Kalansen san kɔnɔ kunnafoniw yɛlɛmana ni ɲɛtaa ye!"
  },
  "school_year_added": {
    "Français": "Année scolaire ajoutée avec succès !",
    "Anglais": "School year added successfully!",
    "Bambara": "Kalansen san fara ni ɲɛtaa ye!"
  },
  "view_school_year_description": {
    "Français": "Voir la description",
    "Anglais": "View Description",
    "Bambara": "Bayɛlɛmali lajɛ"
  },
  "school_year_description": {
    "Français": "Description de l'année scolaire",
    "Anglais": "School Year Description",
    "Bambara": "Kalansen san bayɛlɛmali"
  },
  "close_description": {
    "Français": "Fermer la description",
    "Anglais": "Close Description",
    "Bambara": "Bayɛlɛmali datugu"
  },
  "year_already_exists": {
    "Français": "Une année scolaire avec le même titre et les mêmes dates existe déjà",
    "Anglais": "A school year with the same title and dates already exists",
    "Bambara": "Kalansen san kelen ani tuma kelen in bɛɛ kayi dalen don ka kɔn"
  },
  
  // School year form fields
  "title": {
    "Français": "Titre",
    "Anglais": "Title",
    "Bambara": "Tɔgɔ"
  },
  "title_required": {
    "Français": "Le titre est obligatoire",
    "Anglais": "Title is required",
    "Bambara": "Tɔgɔ ka kan ka sɛbɛn"
  },
  "title_length": {
    "Français": "Le titre doit contenir entre 10 et 150 caractères",
    "Anglais": "Title must be between 10 and 150 characters",
    "Bambara": "Tɔgɔ ka kan ka kɛ sira 10 ni 150 cɛ"
  },
  "description": {
    "Français": "Description",
    "Anglais": "Description",
    "Bambara": "Bayɛlɛmali"
  },
  "description_required": {
    "Français": "La description est obligatoire",
    "Anglais": "Description is required",
    "Bambara": "Bayɛlɛmali ka kan ka sɛbɛn"
  },
  "description_length": {
    "Français": "La description doit contenir entre 30 et 10000 caractères",
    "Anglais": "Description must be between 30 and 10000 characters",
    "Bambara": "Bayɛlɛmali ka kan ka kɛ sira 30 ni 10000 cɛ"
  },
  "start_date": {
    "Français": "Date de début",
    "Anglais": "Start Date",
    "Bambara": "Daminɛ don"
  },
  "start_date_required": {
    "Français": "La date de début est obligatoire",
    "Anglais": "Start date is required",
    "Bambara": "Daminɛ don ka kan ka sɛbɛn"
  },
  "end_date": {
    "Français": "Date de fin",
    "Anglais": "End Date",
    "Bambara": "Laban don"
  },
  "end_date_required": {
    "Français": "La date de fin est obligatoire",
    "Anglais": "End date is required",
    "Bambara": "Laban don ka kan ka sɛbɛn"
  },
  "date_range_invalid": {
    "Français": "La date de fin doit être après la date de début",
    "Anglais": "End date must be after start date",
    "Bambara": "Laban don ka kan ka kɛ daminɛ don kɔfɛ"
  },
  "date_range_limit": {
    "Français": "Les dates sont limitées à un an avant ou après la date actuelle pour assurer une meilleure gestion.",
    "Anglais": "Dates are limited to one year before or after the current date for better management.",
    "Bambara": "Donw dalen dan san kelen kɔfɛ walima san kelen bi kɔfɛ walasa ladon cogo ka nɔgɔya."
  },
  
  // School years list
  "all_years": {
    "Français": "Toutes",
    "Anglais": "All",
    "Bambara": "Bɛɛ"
  },
  "active_years": {
    "Français": "Actives",
    "Anglais": "Active",
    "Bambara": "Dabɔlenw"
  },
  "expired_years": {
    "Français": "Expirées",
    "Anglais": "Expired",
    "Bambara": "Tɛmɛnenw"
  },
  "search_year": {
    "Français": "Rechercher une année...",
    "Anglais": "Search for a year...",
    "Bambara": "San dɔ ɲini..."
  },
  "no_years_title": {
    "Français": "Aucune année scolaire",
    "Anglais": "No School Years",
    "Bambara": "Kalansen san foyi tɛ"
  },
  "no_years_message": {
    "Français": "Vous n'avez pas encore créé d'année scolaire. Commencez par en ajouter une.",
    "Anglais": "You haven't created any school years yet. Start by adding one.",
    "Bambara": "I ma kalansen san foyi da fɔlɔ. Daminɛ ni kura fara ye."
  },
  "no_results_title": {
    "Français": "Aucun résultat",
    "Anglais": "No Results",
    "Bambara": "Foyi ma sɔrɔ"
  },
  "no_results_message": {
    "Français": "Aucune année scolaire ne correspond à votre recherche.",
    "Anglais": "No school years match your search.",
    "Bambara": "Kalansen san foyi ma kɛ i ka ɲinini jaabi ye."
  },
  "clear_search": {
    "Français": "Effacer la recherche",
    "Anglais": "Clear Search",
    "Bambara": "Ɲinini foroko jɔsi"
  },
  "expenses_count": {
    "Français": "Dépenses",
    "Anglais": "Expenses",
    "Bambara": "Musakaw"
  },
  "total_amount": {
    "Français": "Total",
    "Anglais": "Total",
    "Bambara": "Bɛɛ lajɛlen"
  },
  "view_details": {
    "Français": "Voir les détails",
    "Anglais": "View Details",
    "Bambara": "Kunnafoni lajɛ"
  },
  "edit": {
    "Français": "Modifier",
    "Anglais": "Edit",
    "Bambara": "Yɛlɛma"
  },
  "delete": {
    "Français": "Supprimer",
    "Anglais": "Delete",
    "Bambara": "Jɔsi"
  },
  "active": {
    "Français": "Active",
    "Anglais": "Active",
    "Bambara": "Dabɔlen"
  },
  "expired": {
    "Français": "Expirée",
    "Anglais": "Expired",
    "Bambara": "Tɛmɛnen"
  },
  
  // Expenses
  "add_expense": {
    "Français": "Ajouter une dépense",
    "Anglais": "Add Expense",
    "Bambara": "Musaka dɔ fara"
  },
  "edit_expense": {
    "Français": "Modifier la dépense",
    "Anglais": "Edit Expense",
    "Bambara": "Musaka yɛlɛma"
  },
  "expense_created": {
    "Français": "Dépense ajoutée avec succès !",
    "Anglais": "Expense added successfully!",
    "Bambara": "Musaka fara ni ɲɛtaa ye!"
  },
  "expense_updated": {
    "Français": "Dépense mise à jour avec succès !",
    "Anglais": "Expense updated successfully!",
    "Bambara": "Musaka kɔnɔ kunnafoniw yɛlɛmana ni ɲɛtaa ye!"
  },
  "expense_deleted": {
    "Français": "Dépense supprimée avec succès !",
    "Anglais": "Expense deleted successfully!",
    "Bambara": "Musaka jɔsira ni ɲɛtaa ye!"
  },
  "confirm_delete_expense": {
    "Français": "Confirmer la suppression",
    "Anglais": "Confirm Deletion",
    "Bambara": "Jɔsili jɛtigi"
  },
  "confirm_delete_expense_msg": {
    "Français": "Êtes-vous sûr de vouloir supprimer cette dépense ?",
    "Anglais": "Are you sure you want to delete this expense?",
    "Bambara": "I dalen don i bɛ nin musaka in jɔsi?"
  },
  "expired_year": {
    "Français": "Année expirée",
    "Anglais": "Expired Year",
    "Bambara": "San tɛmɛnen"
  },
  
  // Expense form
  "expense_name": {
    "Français": "Nom de la dépense",
    "Anglais": "Expense Name",
    "Bambara": "Musaka tɔgɔ"
  },
  "expense_name_placeholder": {
    "Français": "Nom de la dépense",
    "Anglais": "Expense name",
    "Bambara": "Musaka tɔgɔ"
  },
  "expense_name_required": {
    "Français": "Le nom de la dépense est requis",
    "Anglais": "Expense name is required",
    "Bambara": "Musaka tɔgɔ ka kan ka sɛbɛn"
  },
  "expense_name_min_length": {
    "Français": "Le nom doit contenir au moins 3 caractères",
    "Anglais": "Name must contain at least 3 characters",
    "Bambara": "Tɔgɔ ka kan ka kɛ sira 3 duguma"
  },
  "expense_name_max_length": {
    "Français": "Le nom ne peut pas dépasser 50 caractères",
    "Anglais": "Name cannot exceed 50 characters",
    "Bambara": "Tɔgɔ tɛ se ka tɛmɛ sira 50 kan"
  },
  "expense_description": {
    "Français": "Description",
    "Anglais": "Description",
    "Bambara": "Bayɛlɛmali"
  },
  "expense_description_placeholder": {
    "Français": "Description détaillée (30-10000 caractères)",
    "Anglais": "Detailed description (30-10000 characters)",
    "Bambara": "Bayɛlɛmali dakɔrɔlen (sira 30-10000)"
  },
  "expense_description_required": {
    "Français": "La description est requise",
    "Anglais": "Description is required",
    "Bambara": "Bayɛlɛmali ka kan ka sɛbɛn"
  },
  "expense_description_min_length": {
    "Français": "La description doit contenir au moins 30 caractères",
    "Anglais": "Description must contain at least 30 characters",
    "Bambara": "Bayɛlɛmali ka kan ka kɛ sira 30 duguma"
  },
  "expense_description_max_length": {
    "Français": "La description ne peut pas dépasser 10 000 caractères",
    "Anglais": "Description cannot exceed 10,000 characters",
    "Bambara": "Bayɛlɛmali tɛ se ka tɛmɛ sira 10 000 kan"
  },
  "expense_amount": {
    "Français": "Montant",
    "Anglais": "Amount",
    "Bambara": "Hakɛ"
  },
  "expense_amount_required": {
    "Français": "Le montant est requis",
    "Anglais": "Amount is required",
    "Bambara": "Hakɛ ka kan ka sɛbɛn"
  },
  "expense_amount_positive": {
    "Français": "Le montant doit être un nombre positif",
    "Anglais": "Amount must be a positive number",
    "Bambara": "Hakɛ ka kan ka kɛ nimɔrɔ positifi ye"
  },
  "expense_date": {
    "Français": "Date",
    "Anglais": "Date",
    "Bambara": "Don"
  },
  "expense_date_required": {
    "Français": "La date est requise",
    "Anglais": "Date is required",
    "Bambara": "Don ka kan ka sɛbɛn"
  },
  "expense_date_outside_range": {
    "Français": "La date doit être comprise entre le début et la fin de l'année scolaire",
    "Anglais": "Date must be between the school year start and end dates",
    "Bambara": "Don ka kan ka kɛ kalansen san daminɛ don ni a laban don cɛ"
  },
  "expense_category": {
    "Français": "Catégorie",
    "Anglais": "Category",
    "Bambara": "Suguyali"
  },
  "expense_category_required": {
    "Français": "La catégorie est requise",
    "Anglais": "Category is required",
    "Bambara": "Suguyali ka kan ka sɛbɛn"
  },
  
  // Expense categories
  "category_supplies": {
    "Français": "Fournitures",
    "Anglais": "Supplies",
    "Bambara": "Minfɛnw"
  },
  "category_equipment": {
    "Français": "Équipement",
    "Anglais": "Equipment",
    "Bambara": "Minanw"
  },
  "category_salary": {
    "Français": "Salaires",
    "Anglais": "Salary",
    "Bambara": "Saratiw"
  },
  "category_rent": {
    "Français": "Loyer",
    "Anglais": "Rent",
    "Bambara": "Kiri sara"
  },
  "category_utilities": {
    "Français": "Services",
    "Anglais": "Utilities",
    "Bambara": "Baarakɛ fɛnw"
  },
  "category_maintenance": {
    "Français": "Maintenance",
    "Anglais": "Maintenance",
    "Bambara": "Baarakɛ minɛn mara"
  },
  "category_events": {
    "Français": "Événements",
    "Anglais": "Events",
    "Bambara": "Kokɛtaw"
  },
  "category_other": {
    "Français": "Autres",
    "Anglais": "Other",
    "Bambara": "A tɔw"
  },
  
  // Expenses list
  "search_expenses": {
    "Français": "Rechercher une dépense...",
    "Anglais": "Search expenses...",
    "Bambara": "Musaka dɔ ɲini..."
  },
  "filters": {
    "Français": "Filtres",
    "Anglais": "Filters",
    "Bambara": "Filateren"
  },
  "reset_filters": {
    "Français": "Réinitialiser",
    "Anglais": "Reset",
    "Bambara": "Segin daminɛ ma"
  },
  "category": {
    "Français": "Catégorie",
    "Anglais": "Category",
    "Bambara": "Suguyali"
  },
  "all_categories": {
    "Français": "Toutes les catégories",
    "Anglais": "All categories",
    "Bambara": "Suguyali bɛɛ"
  },
  "expenses_found": {
    "Français": "dépenses trouvées",
    "Anglais": "expenses found",
    "Bambara": "musaka sɔrɔlen"
  },
  "filtered_from": {
    "Français": "filtrées sur",
    "Anglais": "filtered from",
    "Bambara": "filateren ka bɔ"
  },
  "total": {
    "Français": "Total",
    "Anglais": "Total",
    "Bambara": "Bɛɛ lajɛlen"
  },
  "date": {
    "Français": "Date",
    "Anglais": "Date",
    "Bambara": "Don"
  },
  "amount": {
    "Français": "Montant",
    "Anglais": "Amount",
    "Bambara": "Hakɛ"
  },
  "created_at": {
    "Français": "Créé le",
    "Anglais": "Created on",
    "Bambara": "Da don"
  },
  "updated_at": {
    "Français": "Modifié le",
    "Anglais": "Updated on",
    "Bambara": "Yɛlɛma don"
  },
  "no_matching_expenses": {
    "Français": "Aucune dépense ne correspond à vos critères",
    "Anglais": "No expenses match your criteria",
    "Bambara": "Musaka foyi ma kɛ i ka ɲinini jaabi ye"
  },
  "no_expenses": {
    "Français": "Aucune dépense enregistrée",
    "Anglais": "No expenses recorded",
    "Bambara": "Musaka foyi ma sɛbɛn"
  },
  "try_different_filters": {
    "Français": "Essayez différents filtres ou effacez votre recherche",
    "Anglais": "Try different filters or clear your search",
    "Bambara": "Filateren wɛrɛw kɛ walima i ka ɲinini jɔsi"
  },
  "add_first_expense": {
    "Français": "Ajoutez votre première dépense pour commencer à suivre vos finances",
    "Anglais": "Add your first expense to start tracking your finances",
    "Bambara": "I ka musaka fɔlɔ fara walasa ka i ka wari kɔlɔsili daminɛ"
  },
  
  // Form actions
  "cancel": {
    "Français": "Annuler",
    "Anglais": "Cancel",
    "Bambara": "A dabila"
  },
  "save": {
    "Français": "Enregistrer",
    "Anglais": "Save",
    "Bambara": "A maradon"
  },
  "saving": {
    "Français": "Enregistrement...",
    "Anglais": "Saving...",
    "Bambara": "A maradon..."
  },
  "update": {
    "Français": "Mettre à jour",
    "Anglais": "Update",
    "Bambara": "Kura don"
  },
  "back": {
    "Français": "Retour",
    "Anglais": "Back",
    "Bambara": "Kɔsɛgin"
  },
  "cancel_tooltip": {
    "Français": "Annuler et revenir à la liste",
    "Anglais": "Cancel and return to list",
    "Bambara": "A dabila ka segin lisi ma"
  },
  "save_tooltip": {
    "Français": "Enregistrer la nouvelle dépense",
    "Anglais": "Save the new expense",
    "Bambara": "Musaka kura in maradon"
  },
  "update_tooltip": {
    "Français": "Enregistrer les modifications",
    "Anglais": "Save the changes",
    "Bambara": "Yɛlɛmali maradon"
  },
  "delete_error": {
    "Français": "Erreur lors de la suppression",
    "Anglais": "Error while deleting",
    "Bambara": "Jɔsili fili"
  },
  "error_saving": {
    "Français": "Erreur lors de l'enregistrement de la dépense",
    "Anglais": "Error saving expense",
    "Bambara": "Musaka maradon fili"
  },
  "character_count": {
    "Français": "Caractères",
    "Anglais": "Characters",
    "Bambara": "Siraw"
  },
  "min_max_chars": {
    "Français": "Min: 30 / Max: 10000",
    "Anglais": "Min: 30 / Max: 10000",
    "Bambara": "Fitini: 30 / Caman: 10000"
  },

  // Nouvelles traductions pour le texte de l'avertissement dans le formulaire d'année scolaire
  "school_year_duplicate_warning_edit": {
    "Français": "Si vous modifiez le titre ou les dates, assurez-vous qu'il n'existe pas déjà une année scolaire avec les mêmes informations.",
    "Anglais": "If you modify the title or dates, make sure there isn't already a school year with the same information.",
    "Bambara": "Ni i ye tɔgɔ walima donw yɛlɛma, i ka janto kalansen san wɛrɛ tɛ ni kunnafoni kelenw ye."
  },
  "school_year_duplicate_warning_create": {
    "Français": "Vous ne pouvez pas créer deux années scolaires avec le même titre, la même date de début et la même date de fin.",
    "Anglais": "You cannot create two school years with the same title, start date, and end date.",
    "Bambara": "I tɛ se ka kalansen san fila da min tɔgɔw, daminɛ donw, ani laban donw bɛɛ ye kelen ye."
  },

  // Traductions des mois pour formatDate
  "month_january": {
    "Français": "janvier",
    "Anglais": "January",
    "Bambara": "zanwuyekalo"
  },
  "month_february": {
    "Français": "février",
    "Anglais": "February",
    "Bambara": "feburuyekalo"
  },
  "month_march": {
    "Français": "mars",
    "Anglais": "March",
    "Bambara": "marisikalo"
  },
  "month_april": {
    "Français": "avril",
    "Anglais": "April",
    "Bambara": "awirilikalo"
  },
  "month_may": {
    "Français": "mai",
    "Anglais": "May",
    "Bambara": "mɛkalo"
  },
  "month_june": {
    "Français": "juin",
    "Anglais": "June",
    "Bambara": "zuwɛnkalo"
  },
  "month_july": {
    "Français": "juillet",
    "Anglais": "July",
    "Bambara": "zuluyekalo"
  },
  "month_august": {
    "Français": "août",
    "Anglais": "August",
    "Bambara": "utikalo"
  },
  "month_september": {
    "Français": "septembre",
    "Anglais": "September",
    "Bambara": "sɛtanburukalo"
  },
  "month_october": {
    "Français": "octobre",
    "Anglais": "October",
    "Bambara": "ɔkitɔburukalo"
  },
  "month_november": {
    "Français": "novembre",
    "Anglais": "November",
    "Bambara": "nowanburukalo"
  },
  "month_december": {
    "Français": "décembre",
    "Anglais": "December",
    "Bambara": "desanburukalo"
  },

  // Nouvelles traductions pour les textes manquants
  "id": {
    "Français": "ID",
    "Anglais": "ID",
    "Bambara": "ID"
  },
  "created_on": {
    "Français": "Créé le",
    "Anglais": "Created on",
    "Bambara": "Da don"
  },
  "updated_on": {
    "Français": "Mis à jour le",
    "Anglais": "Updated on",
    "Bambara": "Yɛlɛma don"
  },
  "close": {
    "Français": "Fermer",
    "Anglais": "Close",
    "Bambara": "Datugu"
  },
  "complete_guide": {
    "Français": "Guide complet de gestion des dépenses",
    "Anglais": "Complete Expense Management Guide",
    "Bambara": "Musaka kɛcogo dafalen ɲesin"
  },
  
  // InfoPopup - Sections principales
  "overview": {
    "Français": "Vue d'ensemble",
    "Anglais": "Overview",
    "Bambara": "Jamana ɲɛfɔ"
  },
  "guide_intro_content": {
    "Français": "Le système de gestion des dépenses est conçu pour vous aider à suivre efficacement toutes les dépenses de votre établissement scolaire. Organisé par années scolaires, il vous permet de maintenir une comptabilité précise et de générer des rapports détaillés sur vos finances.",
    "Anglais": "The expense management system is designed to help you effectively track all expenses of your school. Organized by school years, it allows you to maintain accurate accounting and generate detailed reports on your finances.",
    "Bambara": "Musaka mara cogo in dabɔlen don walasa ka i dɛmɛ ka i ka lakɔli musaka bɛɛ tugun kosɛbɛ. A sigilen don kalansen sanw kɔnɔ, min b'a to i ka wari jate tilennen mara ani ka bayɛlɛmali dakɔrɔlen böra i ka wari kow kan."
  },
  "system_structure": {
    "Français": "Structure du système",
    "Anglais": "System Structure",
    "Bambara": "Baara cogo sigilama"
  },
  "system_structured_levels": {
    "Français": "Le système est structuré en deux niveaux hiérarchiques principaux :",
    "Anglais": "The system is structured in two main hierarchical levels:",
    "Bambara": "Baara cogo sigilen don cɛ sira fila kɔnɔ:"
  },
  "recommended_workflow": {
    "Français": "Flux de travail recommandé",
    "Anglais": "Recommended Workflow",
    "Bambara": "Baara kɛcogo ɲuman"
  },
  "main_features": {
    "Français": "Fonctionnalités principales",
    "Anglais": "Main Features",
    "Bambara": "Baara kɛfɛnw kunbabaw"
  },
  "best_practices": {
    "Français": "Bonnes pratiques",
    "Anglais": "Best Practices",
    "Bambara": "Baara kɛcogo ɲumanw"
  },
  "important_warnings": {
    "Français": "Avertissements importants",
    "Anglais": "Important Warnings",
    "Bambara": "Lasɔlimisɛn nafamaw"
  },
  "practical_tips": {
    "Français": "Conseils pratiques",
    "Anglais": "Practical Tips",
    "Bambara": "Ladilikan nafamaw"
  },
  
  // Structure items - School Years
  "school_years_structure": {
    "Français": "Années scolaires",
    "Anglais": "School Years",
    "Bambara": "Kalansen sanw"
  },
  "school_years_desc": {
    "Français": "Chaque année scolaire représente un cadre temporel défini par une date de début et une date de fin. Ces périodes servent de conteneurs pour toutes vos dépenses.",
    "Anglais": "Each school year represents a time frame defined by a start date and an end date. These periods serve as containers for all your expenses.",
    "Bambara": "Kalansen san kelen o kelen bɛɛ ye waati daminɛ don ni a laban don cɛ waati ye. Nin waatiw ye i ka musaka bɛɛ mara yɔrɔw ye."
  },
  
  // Structure items - Expenses
  "expenses_structure": {
    "Français": "Dépenses",
    "Anglais": "Expenses",
    "Bambara": "Musakaw"
  },
  "expenses_desc": {
    "Français": "Les dépenses individuelles sont associées à une année scolaire spécifique. Chaque dépense comprend un nom, un montant, une catégorie, une date et une description détaillée.",
    "Anglais": "Individual expenses are associated with a specific school year. Each expense includes a name, amount, category, date, and detailed description.",
    "Bambara": "Musaka kelen kelen bɛɛ ye kalansen san kelen ta ye. Musaka kelen kelen bɛɛ kɔnɔ, tɔgɔ, hakɛ, suguyali, don ani bayɛlɛmali dakɔrɔlen bɛ sɔrɔ."
  },
  
  // Workflow steps
  "workflow_step1": {
    "Français": "Créez d'abord une année scolaire avec des dates précises couvrant votre période académique.",
    "Anglais": "First, create a school year with precise dates covering your academic period.",
    "Bambara": "Fɔlɔ, kalansen san kura da min donw bɛ i ka kalansen waati bɛɛ minɛ."
  },
  "workflow_step2": {
    "Français": "Ajoutez progressivement vos dépenses dans l'ordre chronologique au fur et à mesure qu'elles surviennent.",
    "Anglais": "Gradually add your expenses in chronological order as they occur.",
    "Bambara": "I ka musakaw fara ɲɔgɔn kan tuma ni tuma ka tugu donw waatiw ma."
  },
  "workflow_step3": {
    "Français": "Utilisez des catégories cohérentes pour faciliter le suivi et l'analyse ultérieure.",
    "Anglais": "Use consistent categories to facilitate tracking and subsequent analysis.",
    "Bambara": "Suguyali kelenw kɛ walasa tugun kɔlɔsili ani sɛgɛsɛgɛli ka nɔgɔya."
  },
  "workflow_step4": {
    "Français": "Consultez régulièrement les totaux et les statistiques pour surveiller vos finances.",
    "Anglais": "Regularly check totals and statistics to monitor your finances.",
    "Bambara": "Hakɛ lajɛlenw ani jabiɲɛfɔlaw lajɛ tuma ni tuma walasa ka i ka wari kɔlɔsi."
  },
  "workflow_step5": {
    "Français": "Archivez automatiquement les années expirées tout en conservant l'accès pour référence future.",
    "Anglais": "Automatically archive expired years while maintaining access for future reference.",
    "Bambara": "San tɛmɛnenw mara u yɛrɛ ma ka sɔrɔ ka u ladon ɲinini nɔfɛ waatiw kama."
  },
  
  // Best practices
  "strict_timeline": {
    "Français": "Chronologie stricte",
    "Anglais": "Strict Timeline",
    "Bambara": "Waati tugun jɔnjɔn"
  },
  "strict_timeline_content": {
    "Français": "Enregistrez vos dépenses dans l'ordre chronologique pour maintenir une trace précise et cohérente. Évitez d'ajouter des dépenses en désordre, ce qui pourrait compliquer l'analyse financière.",
    "Anglais": "Record your expenses in chronological order to maintain accurate and consistent tracking. Avoid adding expenses out of order, which could complicate financial analysis.",
    "Bambara": "I ka musakaw sɛbɛn ka tugu donw cɛsiri ma walasa ka tugun kɔlɔsili jɔnjɔn ni tilennen kɛ. I kana musakaw sɛbɛn cɛsiri tilennen kɔfɛ, o bɛ se ka wari sɛgɛsɛgɛli gɛlɛya."
  },
  "consistent_categorization": {
    "Français": "Catégorisation cohérente",
    "Anglais": "Consistent Categorization",
    "Bambara": "Suguyali kɛcogo kelen"
  },
  "consistent_categorization_content": {
    "Français": "Utilisez systématiquement les mêmes catégories pour des dépenses similaires afin de garantir des rapports et des analyses précis.",
    "Anglais": "Consistently use the same categories for similar expenses to ensure accurate reports and analyses.",
    "Bambara": "Suguyali kelenw kɛ tuma bɛɛ musaka suguya kelenw kama walasa ka jabiɲɛfɔli ni sɛgɛsɛgɛli tilennen sɔrɔ."
  },
  "detailed_descriptions": {
    "Français": "Descriptions détaillées",
    "Anglais": "Detailed Descriptions",
    "Bambara": "Bayɛlɛmali dakɔrɔlen"
  },
  "detailed_descriptions_content": {
    "Français": "Rédigez des descriptions complètes pour chaque dépense (minimum 30 caractères) incluant le contexte, la justification et les parties prenantes concernées.",
    "Anglais": "Write complete descriptions for each expense (minimum 30 characters) including context, justification, and relevant stakeholders.",
    "Bambara": "Bayɛlɛmali dafalen sɛbɛn musaka kelen kelen bɛɛ kama (a fitini ka kan ka kɛ sira 30) min kɔnɔ a cogo, a kun ani a mɔgɔ ɲɛsinnenw bɛ fɔ."
  },
  "regular_verification": {
    "Français": "Vérification régulière",
    "Anglais": "Regular Verification",
    "Bambara": "Sɛgɛsɛgɛli tuma ni tuma"
  },
  "regular_verification_content": {
    "Français": "Examinez périodiquement vos dépenses pour identifier les tendances et optimiser votre budget futur.",
    "Anglais": "Periodically review your expenses to identify trends and optimize your future budget.",
    "Bambara": "I ka musakaw sɛgɛsɛgɛ tuma ni tuma walasa ka kow taabolo dɔn ani ka i ka wari kɛcogo ɲɛfɔlen ɲɛnafacinya."
  },
  "data_backup": {
    "Français": "Sauvegarde des données",
    "Anglais": "Data Backup",
    "Bambara": "Kunnafoni maracogo"
  },
  "data_backup_content": {
    "Français": "Effectuez régulièrement des sauvegardes de vos données financières pour éviter toute perte d'information.",
    "Anglais": "Regularly back up your financial data to avoid any loss of information.",
    "Bambara": "I ka wari kunnafoniw mara tuma ni tuma walasa u kana tunun."
  },
  
  // Features
  "advanced_filtering": {
    "Français": "Filtrage avancé",
    "Anglais": "Advanced Filtering",
    "Bambara": "Filateren dakɔrɔlen"
  },
  "advanced_filtering_desc": {
    "Français": "Filtrez les dépenses par catégorie, date ou mot-clé pour trouver rapidement ce que vous cherchez.",
    "Anglais": "Filter expenses by category, date, or keyword to quickly find what you're looking for.",
    "Bambara": "Musakaw filateren suguyali, don walima daɲɛ fɛ walasa ka i bɛ min ɲini o sɔrɔ joona."
  },
  "totals_visualization": {
    "Français": "Visualisation des totaux",
    "Anglais": "Totals Visualization",
    "Bambara": "Hakɛ lajɛlenw jirali"
  },
  "totals_visualization_desc": {
    "Français": "Consultez instantanément le total des dépenses pour chaque année scolaire et catégorie.",
    "Anglais": "Instantly view the total expenses for each school year and category.",
    "Bambara": "Musaka hakɛ lajɛlen ye kalansen san kelen kelen ni suguyali bɛɛ kama sɔrɔ joona."
  },
  "data_protection": {
    "Français": "Protection des données",
    "Anglais": "Data Protection",
    "Bambara": "Kunnafoni lakana"
  },
  "data_protection_desc": {
    "Français": "Les années expirées sont automatiquement verrouillées pour préserver l'intégrité des données historiques.",
    "Anglais": "Expired years are automatically locked to preserve the integrity of historical data.",
    "Bambara": "San tɛmɛnenw bɛ datugu u yɛrɛ ma walasa ka kɔfɛ kunnafoniw lakana."
  },
  "responsive_interface": {
    "Français": "Interface réactive",
    "Anglais": "Responsive Interface",
    "Bambara": "Ɲɛjira teliman"
  },
  "responsive_interface_desc": {
    "Français": "Profitez d'une expérience utilisateur fluide grâce à des transitions animées et un design responsive.",
    "Anglais": "Enjoy a smooth user experience with animated transitions and responsive design.",
    "Bambara": "Baara mɔgɔ kɛcogo nɔgɔman sɔrɔ ni yɛlɛmali ɲɛfinnmaw ni ɲɛjira nɔgɔman cogo ye."
  },
  
  // Warnings
  "expired_school_years_warning": {
    "Français": "Années scolaires expirées",
    "Anglais": "Expired School Years",
    "Bambara": "Kalansen san tɛmɛnenw"
  },
  "expired_school_years_content": {
    "Français": "Une année scolaire devient automatiquement en lecture seule lorsque sa date de fin est dépassée. Vous ne pourrez ni la modifier, ni la supprimer, ni ajouter ou modifier ses dépenses. Cette restriction garantit l'intégrité de vos données historiques.",
    "Anglais": "A school year automatically becomes read-only when its end date has passed. You will not be able to modify it, delete it, or add or modify its expenses. This restriction ensures the integrity of your historical data.",
    "Bambara": "Kalansen san bɛ kɛ kalan dɔrɔn ye a yɛrɛ ma n'a laban don tɛmɛna. I tɛ se k'a yɛlɛma, k'a jɔsi, walima ka musaka fara a kan walima k'a musaka yɛlɛma. Nin dansigi bɛ i ka kɔfɛ kunnafoniw lakana."
  },
  "mandatory_descriptions_warning": {
    "Français": "Descriptions obligatoires",
    "Anglais": "Mandatory Descriptions",
    "Bambara": "Bayɛlɛmali wajibiw"
  },
  "mandatory_descriptions_content": {
    "Français": "Chaque dépense nécessite une description détaillée entre 30 et 10 000 caractères. Cette exigence assure une documentation complète et favorise la transparence financière.",
    "Anglais": "Each expense requires a detailed description between 30 and 10,000 characters. This requirement ensures complete documentation and promotes financial transparency.",
    "Bambara": "Musaka kelen kelen bɛɛ mako bɛ bayɛlɛmali dakɔrɔlen na min bɛ sira 30 ni 10 000 cɛ. Nin wajibiya bɛ kunnafoni dafalen ni wari fɛɛrɛ kɛnɛyali lakana."
  },
  "expense_dates_warning": {
    "Français": "Dates des dépenses",
    "Anglais": "Expense Dates",
    "Bambara": "Musaka donw"
  },
  "expense_dates_content": {
    "Français": "La date d'une dépense doit obligatoirement se situer entre la date de début et la date de fin de son année scolaire. Toute date en dehors de cette plage sera refusée.",
    "Anglais": "The date of an expense must be between the start date and end date of its school year. Any date outside this range will be rejected.",
    "Bambara": "Musaka don ka kan ka kɛ a kalansen san daminɛ don ni a laban don cɛ. Don o don min tɛ nin cɛsiri kɔnɔ, o tɛna sɔn."
  },
  "duplicate_years_warning": {
    "Français": "Années scolaires dupliquées",
    "Anglais": "Duplicate School Years",
    "Bambara": "Kalansen san filananw"
  },
  "duplicate_years_content": {
    "Français": "Le système empêche la création d'années scolaires en double. Deux années ne peuvent pas avoir simultanément le même titre, la même date de début et la même date de fin.",
    "Anglais": "The system prevents the creation of duplicate school years. Two years cannot have the same title, start date, and end date simultaneously.",
    "Bambara": "Baara cogo tɛ sɔn kalansen san kelen fila ka da. San fila tɛ se ka kɛ ni tɔgɔ kelen, daminɛ don kelen ani laban don kelen ye."
  },
  
  // Tips
  "advance_planning": {
    "Français": "Planification préalable",
    "Anglais": "Advance Planning",
    "Bambara": "Labɛnni jona"
  },
  "advance_planning_content": {
    "Français": "Créez votre nouvelle année scolaire avant la fin de l'année en cours pour assurer une transition sans heurts.",
    "Anglais": "Create your new school year before the end of the current year to ensure a smooth transition.",
    "Bambara": "I ka kalansen san kura da sanni bi san ka ban walasa yɛlɛmali ka kɛ ni nɔgɔya ye."
  },
  "consistent_naming": {
    "Français": "Nomenclature cohérente",
    "Anglais": "Consistent Naming",
    "Bambara": "Tɔgɔ dali kɛcogo kelen"
  },
  "consistent_naming_content": {
    "Français": "Utilisez un système de nommage uniforme pour toutes vos dépenses afin de faciliter les recherches et le tri.",
    "Anglais": "Use a uniform naming system for all your expenses to facilitate searches and sorting.",
    "Bambara": "Tɔgɔ dali cogo kelen kɛ i ka musaka bɛɛ kama walasa ɲinini ni woloma ka nɔgɔya."
  },
  "monthly_check": {
    "Français": "Vérification mensuelle",
    "Anglais": "Monthly Check",
    "Bambara": "Kalo o kalo sɛgɛsɛgɛli"
  },
  "monthly_check_content": {
    "Français": "Réservez du temps chaque mois pour vérifier que toutes les dépenses ont été correctement enregistrées.",
    "Anglais": "Set aside time each month to verify that all expenses have been correctly recorded.",
    "Bambara": "Waati bɔ kalo o kalo walasa ka lajɛ ni musaka bɛɛ sɛbɛnna ka ɲɛ."
  },
  "quarterly_analysis": {
    "Français": "Analyse trimestrielle",
    "Anglais": "Quarterly Analysis",
    "Bambara": "Kalo saba o saba sɛgɛsɛgɛli"
  },
  "quarterly_analysis_content": {
    "Français": "Analysez vos dépenses par trimestre pour identifier les tendances et ajuster votre budget en conséquence.",
    "Anglais": "Analyze your expenses quarterly to identify trends and adjust your budget accordingly.",
    "Bambara": "I ka musakaw sɛgɛsɛgɛ kalo saba o saba walasa ka kow taabolo dɔn ani ka i ka wari kɛcogo ɲɛnafacinya."
  },
  
  // Important chronological note
  "chronological_order_title": {
    "Français": "Ordre chronologique essentiel",
    "Anglais": "Essential Chronological Order",
    "Bambara": "Waati cɛsirili nafama kosɛbɛ"
  },
  "chronological_order_strong": {
    "Français": "Il est fortement recommandé de créer vos dépenses dans l'ordre chronologique.",
    "Anglais": "It is strongly recommended to create your expenses in chronological order.",
    "Bambara": "A bɛ ɲini i fɛ kosɛbɛ ka i ka musakaw da ka tugu u waati cɛsiri ma."
  },
  "chronological_order_content": {
    "Français": "Cette pratique est cruciale pour maintenir une comptabilité précise et faciliter les audits financiers. La création de dépenses en désordre peut entraîner des erreurs d'analyse et compliquer la gestion budgétaire.",
    "Anglais": "This practice is crucial for maintaining accurate accounting and facilitating financial audits. Creating expenses out of order can lead to analysis errors and complicate budget management.",
    "Bambara": "Nin baara kɛcogo nafama kosɛbɛ walasa ka wari jate tilennen mara ani ka wari sɛgɛsɛgɛli nɔgɔya. Musaka dali min tɛ tugu cɛsiri ma, o bɛ se ka sɛgɛsɛgɛli filiw lase ani ka wari mara gɛlɛya."
  },
  
  // Footer note
  "footer_note": {
    "Français": "Une gestion rigoureuse des dépenses est essentielle pour optimiser votre budget scolaire et assurer la pérennité financière de votre établissement.",
    "Anglais": "Rigorous expense management is essential to optimize your school budget and ensure the financial sustainability of your institution.",
    "Bambara": "Musaka mara jɔnjɔn nafama don walasa i ka kalansen wari kɛcogo ka ɲɛnafacinya ani ka i ka lakɔli wari sabatili lakana."
  },
  
  // Nouvelles clés pour SchoolYearsList
  "period": {
    "Français": "Période",
    "Anglais": "Period",
    "Bambara": "Waati"
  },
  "information": {
    "Français": "Informations",
    "Anglais": "Information",
    "Bambara": "Kunnafoni"
  },
  "expense_count": {
    "Français": "Nombre de dépenses",
    "Anglais": "Expense Count",
    "Bambara": "Musaka hakɛ"
  },
  "total_amount": {
    "Français": "Montant total",
    "Anglais": "Total Amount",
    "Bambara": "Hakɛ lajɛlen"
  }
};

export default translations; 