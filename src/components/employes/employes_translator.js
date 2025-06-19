// Translator for employee management system
const translations = {
  // Utils.js translations
  "first_name_required": {
    "Français": "Le prénom est obligatoire",
    "Anglais": "First name is required",
    "Bambara": "Tɔgɔ ka kan ka sɛbɛn"
  },
  "last_name_required": {
    "Français": "Le nom est obligatoire",
    "Anglais": "Last name is required",
    "Bambara": "Jamu ka kan ka sɛbɛn"
  },
  "gender_required": {
    "Français": "Le sexe est obligatoire",
    "Anglais": "Gender is required",
    "Bambara": "Cɛya walima musoya ka kan ka sɛbɛn"
  },
  "birth_date_required": {
    "Français": "La date de naissance est obligatoire",
    "Anglais": "Birth date is required",
    "Bambara": "Wololi don ka kan ka sɛbɛn"
  },
  "contact_required": {
    "Français": "Le contact est obligatoire",
    "Anglais": "Contact is required",
    "Bambara": "Sɛbɛnni ka kan ka sɛbɛn"
  },
  "service_start_date_required": {
    "Français": "La date de début de service est obligatoire",
    "Anglais": "Service start date is required",
    "Bambara": "Baara daminɛ don ka kan ka sɛbɛn"
  },
  "at_least_one_position_required": {
    "Français": "Au moins un poste est obligatoire",
    "Anglais": "At least one position is required",
    "Bambara": "Baara yɔrɔ kelen sugandi dɔɔni"
  },
  "monthly_salary_must_be_positive": {
    "Français": "Le salaire mensuel doit être supérieur à 0",
    "Anglais": "Monthly salary must be greater than 0",
    "Bambara": "Kalo sara ka kan ka kɛ fɛn ye min ka bon ni 0 ye"
  },
  "hourly_rate_must_be_positive": {
    "Français": "Le taux horaire doit être supérieur à 0",
    "Anglais": "Hourly rate must be greater than 0",
    "Bambara": "Lɛri kelen sara ka kan ka kɛ fɛn ye min ka bon ni 0 ye"
  },
  "end_date_not_before_start_date": {
    "Français": "La date de fin ne peut pas être antérieure à la date de début",
    "Anglais": "End date cannot be before start date",
    "Bambara": "Baara ban don tɛ se ka kɛ daminɛ don ɲɛ"
  },
  
  // Professor specialties
  "generalist": {
    "Français": "Généraliste",
    "Anglais": "Generalist",
    "Bambara": "Bɛɛ lajɛlen"
  },
  "lhg": {
    "Français": "Lettre, Histoire et Géographie (LHG)",
    "Anglais": "Literature, History and Geography (LHG)",
    "Bambara": "Sɛbɛnni, Tariku ani Dugukolo (LHG)"
  },
  "mpc": {
    "Français": "Mathématiques, Physique et Chimie (MPC)",
    "Anglais": "Mathematics, Physics and Chemistry (MPC)",
    "Bambara": "Jatew, Fiziki ani Simi (MPC)"
  },
  "spnc": {
    "Français": "Science Physique, Naturelle et Chimie (SPNC)",
    "Anglais": "Physical Science, Natural Science and Chemistry (SPNC)",
    "Bambara": "Fiziki, Bangebaga ani Simi (SPNC)"
  },
  "ldm": {
    "Français": "Langue, Dessin et Musique (LDM)",
    "Anglais": "Language, Drawing and Music (LDM)",
    "Bambara": "Kan, Ja ani Donkili (LDM)"
  },
  
  // Sort options
  "sort_by_name": {
    "Français": "nom",
    "Anglais": "name",
    "Bambara": "tɔgɔ"
  },
  "sort_by_added_date": {
    "Français": "date d'ajout",
    "Anglais": "added date",
    "Bambara": "don min fara"
  },
  "sort_by_service_start": {
    "Français": "date de début de service",
    "Anglais": "service start date",
    "Bambara": "baara daminɛ don"
  },
  "sort_by_status": {
    "Français": "statut",
    "Anglais": "status",
    "Bambara": "cogoya"
  },
  
  // Filter terms
  "all": {
    "Français": "Tous",
    "Anglais": "All",
    "Bambara": "Bɛɛ"
  },
  
  // Default values
  "default_professor_type": {
    "Français": "Permanent",
    "Anglais": "Permanent",
    "Bambara": "Tuma bɛɛ"
  },
  "default_specialty": {
    "Français": "Généraliste",
    "Anglais": "Generalist",
    "Bambara": "Bɛɛ lajɛlen"
  },
  "default_status": {
    "Français": "actif",
    "Anglais": "active",
    "Bambara": "baara kan"
  },
  "default_monthly_salary": {
    "Français": "60000",
    "Anglais": "60000",
    "Bambara": "60000"
  },
  // General employee management terms
  "employees_management": {
    "Français": "Gestion des employés",
    "Anglais": "Employee Management",
    "Bambara": "Baara kɛlaw kɛcogo"
  },
  "add_employee": {
    "Français": "Ajouter un employé",
    "Anglais": "Add Employee",
    "Bambara": "Baara kɛla kura fara"
  },
  "add_new_employee": {
    "Français": "Ajouter un nouvel employé",
    "Anglais": "Add New Employee",
    "Bambara": "Baara kɛla kura dɔ fara"
  },
  "edit_employee": {
    "Français": "Modifier un employé",
    "Anglais": "Edit Employee",
    "Bambara": "Baara kɛla yɛlɛma"
  },
  "delete_employee": {
    "Français": "Supprimer l'employé",
    "Anglais": "Delete Employee",
    "Bambara": "Baara kɛla jɔsi"
  },
  "delete_employees": {
    "Français": "Supprimer les employés",
    "Anglais": "Delete Employees",
    "Bambara": "Baara kɛlaw jɔsi"
  },
  "deactivate_employees": {
    "Français": "Désactiver les employés",
    "Anglais": "Deactivate Employees",
    "Bambara": "Baara kɛlaw dabila"
  },
  "activate_employees": {
    "Français": "Activer les employés",
    "Anglais": "Activate Employees",
    "Bambara": "Baara kɛlaw daminɛ"
  },
  "refresh_data": {
    "Français": "Actualiser les données",
    "Anglais": "Refresh Data",
    "Bambara": "Kunnafoniw kura don"
  },
  
  // Employee form tabs
  "general_information": {
    "Français": "Informations générales",
    "Anglais": "General Information",
    "Bambara": "Kunnafoni fɔlɔw"
  },
  "professor_configuration": {
    "Français": "Configuration Professeur",
    "Anglais": "Professor Configuration",
    "Bambara": "Karamɔgɔ labɛnni"
  },
  "other_positions_configuration": {
    "Français": "Configuration Autres Postes",
    "Anglais": "Other Positions Configuration",
    "Bambara": "Baara wɛrɛw labɛnni"
  },
  
  // Employee form fields
  "positions": {
    "Français": "Poste(s)",
    "Anglais": "Position(s)",
    "Bambara": "Baara yɔrɔ"
  },
  "first_name": {
    "Français": "Prénom",
    "Anglais": "First Name",
    "Bambara": "Tɔgɔ"
  },
  "last_name": {
    "Français": "Nom",
    "Anglais": "Last Name",
    "Bambara": "Jamu"
  },
  "phone": {
    "Français": "Téléphone",
    "Anglais": "Phone",
    "Bambara": "Telefɔni"
  },
  "email": {
    "Français": "Email",
    "Anglais": "Email",
    "Bambara": "Imeeli"
  },
  "address": {
    "Français": "Adresse",
    "Anglais": "Address",
    "Bambara": "Adirɛsi"
  },
  "date_of_birth": {
    "Français": "Date de naissance",
    "Anglais": "Date of Birth",
    "Bambara": "Wololi don"
  },
  "gender": {
    "Français": "Genre",
    "Anglais": "Gender",
    "Bambara": "Cɛya walima musoya"
  },
  "male": {
    "Français": "Homme",
    "Anglais": "Male",
    "Bambara": "Cɛ"
  },
  "female": {
    "Français": "Femme",
    "Anglais": "Female",
    "Bambara": "Muso"
  },
  "other": {
    "Français": "Autre",
    "Anglais": "Other",
    "Bambara": "Wɛrɛ"
  },
  "hire_date": {
    "Français": "Date d'embauche",
    "Anglais": "Hire Date",
    "Bambara": "Baara daminɛ don"
  },
  "emergency_contact": {
    "Français": "Contact d'urgence",
    "Anglais": "Emergency Contact",
    "Bambara": "Gɛlɛya waati sɛbɛnni"
  },
  "emergency_contact_name": {
    "Français": "Nom du contact d'urgence",
    "Anglais": "Emergency Contact Name",
    "Bambara": "Gɛlɛya waati sɛbɛnni tɔgɔ"
  },
  "emergency_contact_phone": {
    "Français": "Téléphone du contact d'urgence",
    "Anglais": "Emergency Contact Phone",
    "Bambara": "Gɛlɛya waati sɛbɛnni telefɔni"
  },
  "emergency_contact_relationship": {
    "Français": "Relation avec le contact d'urgence",
    "Anglais": "Emergency Contact Relationship",
    "Bambara": "Gɛlɛya waati sɛbɛnni ni aw cɛ terimaɲɔgɔnya"
  },
  
  // Professor specific fields
  "professor_type": {
    "Français": "Type de professeur",
    "Anglais": "Professor Type",
    "Bambara": "Karamɔgɔ suguya"
  },
  "permanent": {
    "Français": "Permanent",
    "Anglais": "Permanent",
    "Bambara": "Tuma bɛɛ"
  },
  "vacataire": {
    "Français": "Vacataire",
    "Anglais": "Part-time",
    "Bambara": "Tuma dɔw"
  },
  "monthly_salary": {
    "Français": "Salaire mensuel",
    "Anglais": "Monthly Salary",
    "Bambara": "Kalo sara"
  },
  "hourly_rate": {
    "Français": "Taux horaire",
    "Anglais": "Hourly Rate",
    "Bambara": "Lɛri kelen sara"
  },
  "specialties": {
    "Français": "Spécialités",
    "Anglais": "Specialties",
    "Bambara": "Dɔnniya kɛrɛnkɛrɛnnenw"
  },
  "add_specialty": {
    "Français": "Ajouter une spécialité",
    "Anglais": "Add Specialty",
    "Bambara": "Dɔnniya kɛrɛnkɛrɛnnen fara"
  },
  
  // Other positions specific fields
  "position_salary": {
    "Français": "Salaire du poste",
    "Anglais": "Position Salary",
    "Bambara": "Baara yɔrɔ sara"
  },
  
  // Position management
  "positions_management": {
    "Français": "Gestion des postes",
    "Anglais": "Positions Management",
    "Bambara": "Baara yɔrɔw kɛcogo"
  },
  "add_position": {
    "Français": "Ajouter un poste",
    "Anglais": "Add Position",
    "Bambara": "Baara yɔrɔ kura fara"
  },
  "edit_position": {
    "Français": "Modifier le poste",
    "Anglais": "Edit Position",
    "Bambara": "Baara yɔrɔ yɛlɛma"
  },
  "delete_position": {
    "Français": "Supprimer le poste",
    "Anglais": "Delete Position",
    "Bambara": "Baara yɔrɔ jɔsi"
  },
  "position_name": {
    "Français": "Nom du poste",
    "Anglais": "Position Name",
    "Bambara": "Baara yɔrɔ tɔgɔ"
  },
  "position_description": {
    "Français": "Description du poste",
    "Anglais": "Position Description",
    "Bambara": "Baara yɔrɔ bayɛlɛmali"
  },
  
  // Statistics
  "active_employees": {
    "Français": "Employés actifs",
    "Anglais": "Active Employees",
    "Bambara": "Baara kɛla baara kanw"
  },
  "total_active_employees": {
    "Français": "Total des employés actifs",
    "Anglais": "Total Active Employees",
    "Bambara": "Baara kɛla baara kanw bɛɛ lajɛlen"
  },
  "total_positions": {
    "Français": "Total des postes",
    "Anglais": "Total Positions",
    "Bambara": "Baara yɔrɔw bɛɛ lajɛlen"
  },
  
  // Confirmation messages
  "confirm_delete": {
    "Français": "Confirmer la suppression",
    "Anglais": "Confirm Deletion",
    "Bambara": "Jɔsili jɛtigi"
  },
  "confirm_delete_employee_msg": {
    "Français": "Voulez-vous supprimer définitivement cet employé ?",
    "Anglais": "Do you want to permanently delete this employee?",
    "Bambara": "I b'a fɛ ka nin baara kɛla in jɔsi pewu wa?"
  },
  "confirm_delete_selected_msg": {
    "Français": "Voulez-vous supprimer définitivement les employés sélectionnés ?",
    "Anglais": "Do you want to permanently delete the selected employees?",
    "Bambara": "I b'a fɛ ka baara kɛla sugandilen ninnu jɔsi pewu wa?"
  },
  "confirm_deactivate_selected_msg": {
    "Français": "Voulez-vous désactiver les employés sélectionnés ?",
    "Anglais": "Do you want to deactivate the selected employees?",
    "Bambara": "I b'a fɛ ka baara kɛla sugandilen ninnu dabila wa?"
  },
  "confirm_activate_selected_msg": {
    "Français": "Voulez-vous activer les employés sélectionnés ?",
    "Anglais": "Do you want to activate the selected employees?",
    "Bambara": "I b'a fɛ ka baara kɛla sugandilen ninnu daminɛ wa?"
  },
  "confirm_delete_position_msg": {
    "Français": "Voulez-vous supprimer définitivement ce poste ?",
    "Anglais": "Do you want to permanently delete this position?",
    "Bambara": "I b'a fɛ ka nin baara yɔrɔ in jɔsi pewu wa?"
  },
  
  // Success messages
  "employee_added": {
    "Français": "Employé ajouté avec succès !",
    "Anglais": "Employee added successfully!",
    "Bambara": "Baara kɛla fara ni ɲɛtaa ye!"
  },
  "employee_updated": {
    "Français": "Employé mis à jour avec succès !",
    "Anglais": "Employee updated successfully!",
    "Bambara": "Baara kɛla kɔnɔ kunnafoniw yɛlɛmana ni ɲɛtaa ye!"
  },
  "employee_deleted": {
    "Français": "Employé supprimé avec succès !",
    "Anglais": "Employee deleted successfully!",
    "Bambara": "Baara kɛla jɔsira ni ɲɛtaa ye!"
  },
  "employees_deleted": {
    "Français": "Employés supprimés avec succès !",
    "Anglais": "Employees deleted successfully!",
    "Bambara": "Baara kɛlaw jɔsira ni ɲɛtaa ye!"
  },
  "employees_deactivated": {
    "Français": "Employés désactivés avec succès !",
    "Anglais": "Employees deactivated successfully!",
    "Bambara": "Baara kɛlaw dabilara ni ɲɛtaa ye!"
  },
  "employees_activated": {
    "Français": "Employés activés avec succès !",
    "Anglais": "Employees activated successfully!",
    "Bambara": "Baara kɛlaw daminɛna ni ɲɛtaa ye!"
  },
  "position_added": {
    "Français": "Poste ajouté avec succès !",
    "Anglais": "Position added successfully!",
    "Bambara": "Baara yɔrɔ fara ni ɲɛtaa ye!"
  },
  "position_updated": {
    "Français": "Poste mis à jour avec succès !",
    "Anglais": "Position updated successfully!",
    "Bambara": "Baara yɔrɔ kɔnɔ kunnafoniw yɛlɛmana ni ɲɛtaa ye!"
  },
  "position_deleted": {
    "Français": "Poste supprimé avec succès !",
    "Anglais": "Position deleted successfully!",
    "Bambara": "Baara yɔrɔ jɔsira ni ɲɛtaa ye!"
  },
  
  // Error messages
  "error_occurred": {
    "Français": "Une erreur est survenue",
    "Anglais": "An error occurred",
    "Bambara": "Fili dɔ kɛra"
  },
  "required_field": {
    "Français": "Ce champ est requis",
    "Anglais": "This field is required",
    "Bambara": "Nin yɔrɔ ka kan ka fa"
  },
  "invalid_email": {
    "Français": "Email invalide",
    "Anglais": "Invalid email",
    "Bambara": "Imeeli tɛ bɛn"
  },
  "invalid_phone": {
    "Français": "Numéro de téléphone invalide",
    "Anglais": "Invalid phone number",
    "Bambara": "Telefɔni nimɔrɔ tɛ bɛn"
  },
  "select_at_least_one_position": {
    "Français": "Sélectionnez au moins un poste",
    "Anglais": "Select at least one position",
    "Bambara": "Baara yɔrɔ kelen sugandi dɔɔni"
  },
  "position_already_exists": {
    "Français": "Un poste avec ce nom existe déjà",
    "Anglais": "A position with this name already exists",
    "Bambara": "Baara yɔrɔ nin tɔgɔ in bɛ kɔrɔ"
  },
  
  // Filter options
  "filter_by_position": {
    "Français": "Filtrer par poste",
    "Anglais": "Filter by position",
    "Bambara": "Baara yɔrɔ ka filteri kɛ"
  },
  "filter_by_status": {
    "Français": "Filtrer par statut",
    "Anglais": "Filter by status",
    "Bambara": "Cogoya ka filteri kɛ"
  },
  "all_positions": {
    "Français": "Tous les postes",
    "Anglais": "All positions",
    "Bambara": "Baara yɔrɔw bɛɛ"
  },
  "all_statuses": {
    "Français": "Tous les statuts",
    "Anglais": "All statuses",
    "Bambara": "Cogoyaw bɛɛ"
  },
  "active": {
    "Français": "Actif",
    "Anglais": "Active",
    "Bambara": "Baara kan"
  },
  "inactive": {
    "Français": "Inactif",
    "Anglais": "Inactive",
    "Bambara": "Dabila la"
  },
  "search_employees": {
    "Français": "Rechercher des employés...",
    "Anglais": "Search employees...",
    "Bambara": "Baara kɛlaw ɲini..."
  },

  "search": {
    "Français": "Rechercher des postes...",
    "Anglais": "Search posts...",
    "Bambara": "Baara dɔw ɲini..."
  },
  
  // Table headers
  "name": {
    "Français": "Nom",
    "Anglais": "Name",
    "Bambara": "Tɔgɔ"
  },
  "contact": {
    "Français": "Contact",
    "Anglais": "Contact",
    "Bambara": "Sɛbɛnni"
  },
  "position": {
    "Français": "Poste",
    "Anglais": "Position",
    "Bambara": "Baara yɔrɔ"
  },
  "status": {
    "Français": "Statut",
    "Anglais": "Status",
    "Bambara": "Cogoya"
  },
  "actions": {
    "Français": "Actions",
    "Anglais": "Actions",
    "Bambara": "Baaraw"
  },
  
  // Button labels
  "save": {
    "Français": "Enregistrer",
    "Anglais": "Save",
    "Bambara": "A mara"
  },
  "cancel": {
    "Français": "Annuler",
    "Anglais": "Cancel",
    "Bambara": "A dabila"
  },
  "close": {
    "Français": "Fermer",
    "Anglais": "Close",
    "Bambara": "A datugu"
  },
  "add": {
    "Français": "Ajouter",
    "Anglais": "Add",
    "Bambara": "A fara"
  },
  "edit": {
    "Français": "Modifier",
    "Anglais": "Edit",
    "Bambara": "A yɛlɛma"
  },
  "delete": {
    "Français": "Supprimer",
    "Anglais": "Delete",
    "Bambara": "A jɔsi"
  },
  "activate": {
    "Français": "Activer",
    "Anglais": "Activate",
    "Bambara": "A daminɛ"
  },
  "deactivate": {
    "Français": "Désactiver",
    "Anglais": "Deactivate",
    "Bambara": "A dabila"
  },
  
  // Clés pour PositionForm.jsx
  "position_name_required": {
    "Français": "Le nom du poste est obligatoire",
    "Anglais": "Position name is required",
    "Bambara": "Baara yɔrɔ tɔgɔ ka kan ka sɔrɔ"
  },
  
  // EmployesPage.jsx translations
  "error_loading_data": {
    "Français": "Erreur lors du chargement des données",
    "Anglais": "Error loading data",
    "Bambara": "Kunnafoniw ladonni la fili kɛra"
  },
  "error_refreshing_data": {
    "Français": "Erreur lors du rafraîchissement des données",
    "Anglais": "Error refreshing data",
    "Bambara": "Kunnafoniw kurayali la fili kɛra"
  },
  "employee_management_title": {
    "Français": "Gestion des employés",
    "Anglais": "Employee Management",
    "Bambara": "Baara kɛlaw kɛcogo"
  },
  "select_position_instruction": {
    "Français": "Sélectionnez un poste dans le panneau de gauche pour voir les employés associés, ou ajoutez un nouveau poste en cliquant sur le bouton +.",
    "Anglais": "Select a position in the left panel to view associated employees, or add a new position by clicking the + button.",
    "Bambara": "Baara yɔrɔ dɔ sugandi numan kɔrɔ ka baara kɛlaw ye, walima baara yɔrɔ kura fara ni + butɔni digi ye."
  },
  "add_position_button": {
    "Français": "Ajouter un poste",
    "Anglais": "Add Position",
    "Bambara": "Baara yɔrɔ kura fara"
  },
  "teachers_position": {
    "Français": "Professeurs",
    "Anglais": "Teachers",
    "Bambara": "Karamɔgɔw"
  },
  "name_min_length": {
    "Français": "Le nom doit contenir au moins 3 caractères",
    "Anglais": "Name must contain at least 3 characters",
    "Bambara": "Tɔgɔ ka kan ka sɛbɛn 3 bɔ a la"
  },
  "name_max_length": {
    "Français": "Le nom ne peut pas dépasser 60 caractères",
    "Anglais": "Name cannot exceed 60 characters",
    "Bambara": "Tɔgɔ man kan ka tɛmɛ sɛbɛn 60 kan"
  },
  "description_max_length": {
    "Français": "La description ne peut pas dépasser 1000 caractères",
    "Anglais": "Description cannot exceed 1000 characters",
    "Bambara": "Bayɛlɛmali man kan ka tɛmɛ sɛbɛn 1000 kan"
  },
  "professors_position_rename_error": {
    "Français": "Le poste 'Professeurs' ne peut pas être renommé",
    "Anglais": "The 'Professors' position cannot be renamed",
    "Bambara": "'Karamɔgɔw' baara yɔrɔ tɔgɔ tɛ se ka yɛlɛma"
  },
  "error_occurred": {
    "Français": "Une erreur est survenue",
    "Anglais": "An error occurred",
    "Bambara": "Fili dɔ kɛra"
  },
  "edit_position": {
    "Français": "Modifier un poste",
    "Anglais": "Edit Position",
    "Bambara": "Baara yɔrɔ yɛlɛma"
  },
  "add_new_position": {
    "Français": "Ajouter un nouveau poste",
    "Anglais": "Add New Position",
    "Bambara": "Baara yɔrɔ kura fara a kan"
  },
  "position_name": {
    "Français": "Nom du poste",
    "Anglais": "Position Name",
    "Bambara": "Baara yɔrɔ tɔgɔ"
  },
  "position_name_example": {
    "Français": "Ex: Directeur",
    "Anglais": "Ex: Director",
    "Bambara": "Misali: Kuntigi"
  },
  "position_description": {
    "Français": "Description du poste (optionnel)",
    "Anglais": "Position Description (optional)",
    "Bambara": "Baara yɔrɔ bayɛlɛmali (a tɛ wajibiya)"
  },
  "preview": {
    "Français": "Aperçu",
    "Anglais": "Preview",
    "Bambara": "Filɛli"
  },
  "formatting_tips": {
    "Français": "Astuces de formatage",
    "Anglais": "Formatting Tips",
    "Bambara": "Labɛnni hakilinanw"
  },
  "update": {
    "Français": "Mettre à jour",
    "Anglais": "Update",
    "Bambara": "A kura don"
  },
  "characters": {
    "Français": "caractères",
    "Anglais": "characters",
    "Bambara": "sɛbɛnw"
  }
};

export default translations;