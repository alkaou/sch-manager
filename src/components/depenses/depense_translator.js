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
  "description": {
    "Français": "Description",
    "Anglais": "Description",
    "Bambara": "Bayɛlɛmali"
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
  }
};

export default translations; 