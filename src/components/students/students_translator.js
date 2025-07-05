// Translator for student management system
const translations = {
  // General student management terms
  add_students: {
    Français: "Ajouter des élèves",
    Anglais: "Add Students",
    Bambara: "Kalandenw kura fara",
  },
  edit_students: {
    Français: "Modifier les élèves",
    Anglais: "Edit Students",
    Bambara: "Kalanden yɛlɛma",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A marayɔrɔ",
  },
  update: {
    Français: "Mettre à jour",
    Anglais: "Update",
    Bambara: "A kɔnɔ kunnafoni kura",
  },
  processing: {
    Français: "Traitement en cours...",
    Anglais: "Processing...",
    Bambara: "Baara bɛ kɛ kan...",
  },
  add_another_student: {
    Français: "Ajouter un autre élève",
    Anglais: "Add Another Student",
    Bambara: "Kalanden wɛrɛ fara",
  },
  delete_this_student: {
    Français: "Supprimer cet élève",
    Anglais: "Delete This Student",
    Bambara: "Nin kalanden in jɔsi",
  },
  student: {
    Français: "Élève",
    Anglais: "Student",
    Bambara: "Kalanden",
  },
  delete_student: {
    Français: "Supprimer l'élève",
    Anglais: "Delete Student",
    Bambara: "Kalanden jɔsi",
  },

  // Form field labels
  first_name: {
    Français: "Prénom",
    Anglais: "First Name",
    Bambara: "Tɔgɔ",
  },
  sure_name: {
    Français: "Surnom",
    Anglais: "Nickname",
    Bambara: "Tɔgɔ filanan",
  },
  last_name: {
    Français: "Nom de famille",
    Anglais: "Last Name",
    Bambara: "Jamu",
  },
  classe: {
    Français: "Classe",
    Anglais: "Class",
    Bambara: "Kalasi",
  },
  select_class: {
    Français: "Sélectionnez une classe",
    Anglais: "Select a class",
    Bambara: "Kalasi dɔ sugandi",
  },
  gender: {
    Français: "Sexe",
    Anglais: "Gender",
    Bambara: "Cɛya walima musoya",
  },
  select: {
    Français: "Sélectionnez",
    Anglais: "Select",
    Bambara: "Sugandi",
  },
  male: {
    Français: "Masculin",
    Anglais: "Male",
    Bambara: "Cɛ",
  },
  female: {
    Français: "Féminin",
    Anglais: "Female",
    Bambara: "Muso",
  },
  birth_date: {
    Français: "Date de naissance",
    Anglais: "Date of Birth",
    Bambara: "Bangeli don",
  },
  birth_place: {
    Français: "Lieu de naissance",
    Anglais: "Place of Birth",
    Bambara: "Bangeli yɔrɔ",
  },
  matricule: {
    Français: "Matricule",
    Anglais: "Registration",
    Bambara: "Matirikili",
  },
  father_name: {
    Français: "Nom du père",
    Anglais: "Father's Name",
    Bambara: "Fa tɔgɔ",
  },
  mother_name: {
    Français: "Nom de la mère",
    Anglais: "Mother's Name",
    Bambara: "Ba tɔgɔ",
  },
  parents_contact: {
    Français: "Contact parents",
    Anglais: "Parents Contact",
    Bambara: "Somɔgɔw ka sɛbɛnni",
  },

  // Validation error messages
  first_name_required: {
    Français: "Le prénom est obligatoire.",
    Anglais: "First name is required.",
    Bambara: "Tɔgɔ ka kan ka sɛbɛn.",
  },
  last_name_required: {
    Français: "Le nom de famille est obligatoire.",
    Anglais: "Last name is required.",
    Bambara: "Jamu ka kan ka sɛbɛn.",
  },
  sure_name_too_long: {
    Français: "Le surnom est ne doit pas dépasser 30 lettres.",
    Anglais: "Nickname should not exceed 30 characters.",
    Bambara: "Tɔgɔ filanan man kan ka tɛmɛ sɛbɛnni 30 kan.",
  },
  class_required: {
    Français: "La classe est obligatoire.",
    Anglais: "Class is required.",
    Bambara: "Kalasi ka kan ka sugandi.",
  },
  gender_required: {
    Français: "Le sexe est obligatoire.",
    Anglais: "Gender is required.",
    Bambara: "Cɛya walima musoya ka kan ka sugandi.",
  },
  birth_date_required: {
    Français: "La date de naissance est obligatoire.",
    Anglais: "Birth date is required.",
    Bambara: "Bangeli don ka kan ka sɛbɛn.",
  },
  birth_place_required: {
    Français: "Le lieu de naissance est obligatoire.",
    Anglais: "Birth place is required.",
    Bambara: "Bangeli yɔrɔ ka kan ka sɛbɛn.",
  },
  birth_place_min_length: {
    Français: "Le lieu de naissance doit contenir au moins 2 caractères.",
    Anglais: "Birth place must contain at least 2 characters.",
    Bambara: "Bangeli yɔrɔ ka kan ka sɛbɛnni 2 dɔɔni kɛ.",
  },
  birth_place_max_length: {
    Français: "Le lieu de naissance ne peut pas dépasser 25 caractères.",
    Anglais: "Birth place cannot exceed 25 characters.",
    Bambara: "Bangeli yɔrɔ man kan ka tɛmɛ sɛbɛnni 25 kan.",
  },
  father_name_required: {
    Français: "Le nom du père est obligatoire.",
    Anglais: "Father's name is required.",
    Bambara: "Fa tɔgɔ ka kan ka sɛbɛn.",
  },
  mother_name_required: {
    Français: "Le nom de la mère est obligatoire.",
    Anglais: "Mother's name is required.",
    Bambara: "Ba tɔgɔ ka kan ka sɛbɛn.",
  },
  parents_contact_required: {
    Français: "Le contact des parents est obligatoire.",
    Anglais: "Parents contact is required.",
    Bambara: "Somɔgɔw ka sɛbɛnni ka kan ka sɛbɛn.",
  },
  student_too_young: {
    Français: "L'élève est trop jeune pour la classe",
    Anglais: "The student is too young for the class",
    Bambara: "Kalanden fitini kojugu nin kalasi in kama",
  },
  check_student_info: {
    Français: "Veuillez Vérifier les informations de l'élève",
    Anglais: "Please check the student information",
    Bambara: "Kalanden kunnafoni lajɛ",
  },
  students_updated_success: {
    Français: "Les élèves ont été mis à jour avec succès !",
    Anglais: "Students have been updated successfully!",
    Bambara: "Kalandenw kunnafoni kɔnɔ kura kɛra ni ɲɛtaa ye!",
  },
  students_added_success: {
    Français: "Les élèves ont été ajoutés avec succès!",
    Anglais: "Students have been added successfully!",
    Bambara: "Kalandenw farala ni ɲɛtaa ye!",
  },

  // Error messages
  error_deleting_student: {
    Français: "Erreur lors de la suppression de l'étudiant:",
    Anglais: "Error deleting student:",
    Bambara: "Kalanden jɔsi laɲini kɛra ni fɔli ye:",
  },
  error_activating_student: {
    Français: "Erreur lors de l'activation de l'étudiant:",
    Anglais: "Error activating student:",
    Bambara: "Kalanden labɛn laɲini kɛra ni fɔli ye:",
  },
  error_deactivating_student: {
    Français: "Erreur lors de la désactivation de l'étudiant:",
    Anglais: "Error deactivating student:",
    Bambara: "Kalanden dabali laɲini kɛra ni fɔli ye:",
  },

  // Database methods messages
  field_required: {
    Français: "Le champ est obligatoire.",
    Anglais: "The field is required.",
    Bambara: "Fɔɲɔn ka kan ka sɛbɛn.",
  },
  name_format_error: {
    Français:
      "Les noms doivent contenir uniquement des lettres, espaces ou tirets.",
    Anglais: "Names must contain only letters, spaces, or hyphens.",
    Bambara: "Tɔgɔw ka kan ka sɛbɛnni, yɔrɔ, walima dash dɔrɔn kɔnɔ.",
  },
  first_name_length_error: {
    Français: "Le prénom doit contenir entre 2 et 20 caractères.",
    Anglais: "First name must contain between 2 and 20 characters.",
    Bambara: "Tɔgɔ ka kan ka sɛbɛnni 2 ni 20 cɛ kɔnɔ.",
  },
  last_name_length_error: {
    Français: "Le nom de famille doit contenir entre 2 et 20 caractères.",
    Anglais: "Last name must contain between 2 and 20 characters.",
    Bambara: "Jamu ka kan ka sɛbɛnni 2 ni 20 cɛ kɔnɔ.",
  },
  birth_place_format_error: {
    Français:
      "Le lieu de naissance doit contenir uniquement des lettres, espaces ou tirets.",
    Anglais: "Birth place must contain only letters, spaces, or hyphens.",
    Bambara: "Bangeli yɔrɔ ka kan ka sɛbɛnni, yɔrɔ, walima dash dɔrɔn kɔnɔ.",
  },
  birth_place_length_error: {
    Français: "Le lieu de naissance doit contenir entre 2 et 25 caractères.",
    Anglais: "Birth place must contain between 2 and 25 characters.",
    Bambara: "Bangeli yɔrɔ ka kan ka sɛbɛnni 2 ni 25 cɛ kɔnɔ.",
  },
  sure_name_length_error: {
    Français: "Le surnom ne doit pas dépasser 20 caractères.",
    Anglais: "Nickname must not exceed 20 characters.",
    Bambara: "Tɔgɔ filanan man kan ka tɛmɛ sɛbɛnni 20 kan.",
  },
  father_name_length_error: {
    Français: "Le nom du père doit contenir entre 2 et 20 caractères.",
    Anglais: "Father's name must contain between 2 and 20 characters.",
    Bambara: "Fa tɔgɔ ka kan ka sɛbɛnni 2 ni 20 cɛ kɔnɔ.",
  },
  mother_name_length_error: {
    Français: "Le nom de la mère doit contenir entre 2 et 20 caractères.",
    Anglais: "Mother's name must contain between 2 and 20 characters.",
    Bambara: "Ba tɔgɔ ka kan ka sɛbɛnni 2 ni 20 cɛ kɔnɔ.",
  },
  parents_contact_number_error: {
    Français: "Le contact des parents doit être un nombre.",
    Anglais: "Parents contact must be a number.",
    Bambara: "Somɔgɔw ka sɛbɛnni ka kan ka nimɔrɔ ye.",
  },
  parents_contact_length_error: {
    Français: "Le contact des parents doit contenir entre 2 et 20 caractères.",
    Anglais: "Parents contact must contain between 2 and 20 characters.",
    Bambara: "Somɔgɔw ka sɛbɛnni ka kan ka sɛbɛnni 2 ni 20 cɛ kɔnɔ.",
  },
  invalid_gender: {
    Français: "Le sexe doit être 'M' ou 'F'.",
    Anglais: "Gender must be 'M' or 'F'.",
    Bambara: "Cɛya walima musoya ka kan ka 'M' walima 'F' ye.",
  },
  invalid_birth_date: {
    Français: "La date de naissance est invalide.",
    Anglais: "Birth date is invalid.",
    Bambara: "Bangeli don tɛ tiɲɛ ye.",
  },
  matricule_format_error: {
    Français:
      "Le matricule doit contenir uniquement des chiffres et des lettres.",
    Anglais: "Matricule must contain only numbers and letters.",
    Bambara: "Matirikili ka kan ka nimɔrɔw ni sɛbɛnni dɔrɔn kɔnɔ.",
  },
  matricule_length_error: {
    Français: "Le matricule doit contenir entre 6 et 10 caractères.",
    Anglais: "Matricule must contain between 6 and 10 characters.",
    Bambara: "Matirikili ka kan ka sɛbɛnni 6 ni 10 cɛ kɔnɔ.",
  },
  matricule_already_used: {
    Français: "Le matricule est déjà utilisé.",
    Anglais: "Matricule is already used.",
    Bambara: "Matirikili bɛ baara la ka kɔn.",
  },
  no_student_registered: {
    Français: "Aucun étudiant n'est enregistré.",
    Anglais: "No student is registered.",
    Bambara: "Kalanden si ma sɛbɛn.",
  },
  student_not_found: {
    Français: "Étudiant non trouvé.",
    Anglais: "Student not found.",
    Bambara: "Kalanden ma sɔrɔ.",
  },
  deletion_success: {
    Français: "La suppression a été passée avec succès.",
    Anglais: "Deletion was successful.",
    Bambara: "Jɔsi kɛra ni ɲɛtaa ye.",
  },
  activation_success: {
    Français: "Étudiant activé avec succès.",
    Anglais: "Student activated successfully.",
    Bambara: "Kalanden labɛnna ni ɲɛtaa ye.",
  },
  deactivation_success: {
    Français: "Étudiant désactivé avec succès.",
    Anglais: "Student deactivated successfully.",
    Bambara: "Kalanden dabila ni ɲɛtaa ye.",
  },
  error_saving_student: {
    Français: "Erreur lors de la sauvegarde de l'étudiant :",
    Anglais: "Error saving student:",
    Bambara: "Kalanden marali laɲini kɛra ni fɔli ye:",
  },
  error_updating_student: {
    Français: "Erreur lors de la mise à jour de l'étudiant :",
    Anglais: "Error updating student:",
    Bambara: "Kalanden kunnafoni kɔnɔ kura laɲini kɛra ni fɔli ye:",
  },
  no_student_registered: {
    Français: "Aucun étudiant n'est enregistré.",
    Anglais: "No student is registered.",
    Bambara: "Kalanden si ma sɛbɛn.",
  },
  matricule_already_used: {
    Français: "Le matricule est déjà utilisé.",
    Anglais: "The registration number is already in use.",
    Bambara: "Matirikili in bɛ baara la ka kɔn.",
  },
  student_not_found: {
    Français: "Étudiant non trouvé.",
    Anglais: "Student not found.",
    Bambara: "Kalanden ma sɔrɔ.",
  },

  // Table related translations
  default: {
    Français: "Défaut",
    Anglais: "Default",
    Bambara: "Kɔrɔlen",
  },
  name: {
    Français: "Nom",
    Anglais: "Name",
    Bambara: "Tɔgɔ",
  },
  all: {
    Français: "Tous",
    Anglais: "All",
    Bambara: "Bɛɛ",
  },
  default_option: {
    Français: "Défaut",
    Anglais: "Default",
    Bambara: "A yɛrɛ ma",
  },
  last_name_option: {
    Français: "Nom",
    Anglais: "Last Name",
    Bambara: "Jamu",
  },
  with_matricule_option: {
    Français: "Avec matricule",
    Anglais: "With registration number",
    Bambara: "Ni matirikili ye",
  },
  without_matricule_option: {
    Français: "Sans matricule",
    Anglais: "Without registration number",
    Bambara: "Matirikili tɛ minnu la",
  },
  active: {
    Français: "Les actifs",
    Anglais: "Active",
    Bambara: "Minnu bɛ kalan la",
  },
  inactive: {
    Français: "Les inactifs",
    Anglais: "Inactive",
    Bambara: "Minnu tɛ kalan la tugun",
  },
  with: {
    Français: "Avec",
    Anglais: "With",
    Bambara: "Ni a ye",
  },
  without: {
    Français: "Sans",
    Anglais: "Without",
    Bambara: "Ni a tɛ",
  },
  years_text: {
    Français: "ans",
    Anglais: "years",
    Bambara: "san",
  },
  add_student: {
    Français: "Ajouter un élève",
    Anglais: "Add Student",
    Bambara: "Kalanden fara",
  },
  manage_classes: {
    Français: "Gérer les classes",
    Anglais: "Manage Classes",
    Bambara: "Kalasiw labɛn",
  },
  refresh_data: {
    Français: "Rafraîchir les données",
    Anglais: "Refresh Data",
    Bambara: "Kunnawoloma kura",
  },
  refresh_data_success: {
    Français: "Données rafraîchies avec succès.",
    Anglais: "Data refreshed successfully.",
    Bambara: "Kunafoni kɛra kura ye ka ɲɛ.",
  },
  delete_selected: {
    Français: "Supprimer les sélectionnés",
    Anglais: "Delete Selected",
    Bambara: "Sugandilenw jɔsi",
  },
  edit_selected: {
    Français: "Modifier les sélectionnés",
    Anglais: "Edit Selected",
    Bambara: "Sugandilenw yɛlɛma",
  },
  activate_selected: {
    Français: "Activer les sélectionnés",
    Anglais: "Activate Selected",
    Bambara: "Sugandilenw labɛn",
  },
  deactivate_selected: {
    Français: "Désactiver les sélectionnés",
    Anglais: "Deactivate Selected",
    Bambara: "Sugandilenw dabila",
  },
  search_student: {
    Français: "Rechercher un élève...",
    Anglais: "Search student...",
    Bambara: "Kalanden dɔnniya...",
  },
  sort_by: {
    Français: "Trier par",
    Anglais: "Sort by",
    Bambara: "A lajɛ",
  },
  filter_by_class: {
    Français: "Filtrer par classe",
    Anglais: "Filter by class",
    Bambara: "Kalasi lajɛ",
  },
  all_classes: {
    Français: "Toutes les classes",
    Anglais: "All Classes",
    Bambara: "Kalasi bɛɛ",
  },
  filter_by_status: {
    Français: "Filtrer par statut",
    Anglais: "Filter by status",
    Bambara: "Sisan lajɛ",
  },
  filter_by_registration_number: {
    Français: "Filtrer par N° matricule",
    Anglais: "Filter by Registration No.",
    Bambara: "Kalanden nimɔrɔ lajɛ",
  },
  with_registration_number: {
    Français: "Avec N° matricule",
    Anglais: "With Registration No.",
    Bambara: "Ni kalanden nimɔrɔ ye",
  },
  without_registration_number: {
    Français: "Sans N° matricule",
    Anglais: "Without Registration No.",
    Bambara: "Ni kalanden nimɔrɔ tɛ",
  },
  select_all: {
    Français: "Tout sélectionner",
    Anglais: "Select All",
    Bambara: "Bɛɛ sugandi",
  },
  id: {
    Français: "ID",
    Anglais: "ID",
    Bambara: "ID",
  },
  full_name: {
    Français: "Nom complet",
    Anglais: "Full Name",
    Bambara: "Tɔgɔ dafalen",
  },
  birth_info: {
    Français: "Infos de naissance",
    Anglais: "Birth Info",
    Bambara: "Bangeli kunnafoni",
  },
  age: {
    Français: "Âge",
    Anglais: "Age",
    Bambara: "San",
  },
  status: {
    Français: "Statut",
    Anglais: "Status",
    Bambara: "Cogoya",
  },
  added_on: {
    Français: "Ajouté le",
    Anglais: "Added On",
    Bambara: "Fara don",
  },
  last_updated: {
    Français: "Dernière mise à jour",
    Anglais: "Last Updated",
    Bambara: "Kunnafoni kura kɛra",
  },
  confirm_delete_title: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "Jɔsi kɔnɔna",
  },
  confirm_delete_message: {
    Français:
      "Êtes-vous sûr de vouloir supprimer les élèves sélectionnés ? Cette action est irréversible.",
    Anglais:
      "Are you sure you want to delete the selected students? This action is irreversible.",
    Bambara: "Kalanden sugandilenw jɔsi ye dɔn? Nin baara in tɛ se ka yɛlɛma.",
  },
  confirm_activate_title: {
    Français: "Confirmer l'activation",
    Anglais: "Confirm Activation",
    Bambara: "Labɛn kɔnɔna",
  },
  confirm_activate_message: {
    Français: "Êtes-vous sûr de vouloir activer les élèves sélectionnés ?",
    Anglais: "Are you sure you want to activate the selected students?",
    Bambara: "Kalanden sugandilenw labɛn ye dɔn?",
  },
  confirm_deactivate_title: {
    Français: "Confirmer la désactivation",
    Anglais: "Confirm Deactivation",
    Bambara: "Dabila kɔnɔna",
  },
  confirm_deactivate_message: {
    Français: "Êtes-vous sûr de vouloir désactiver les élèves sélectionnés ?",
    Anglais: "Are you sure you want to deactivate the selected students?",
    Bambara: "Kalanden sugandilenw dabila ye dɔn?",
  },
  // Placeholders for form fields
  placeholder_first_name: {
    Français: "Ex: Fatoumata",
    Anglais: "Ex: Sarah",
    Bambara: "Misali: Fatumata",
  },
  placeholder_sure_name: {
    Français: "Ex: C",
    Anglais: "Ex: S",
    Bambara: "Misali: C",
  },
  placeholder_last_name: {
    Français: "Ex: Dembélé",
    Anglais: "Ex: Dembele",
    Bambara: "Misali: Danbele",
  },
  placeholder_birth_place: {
    Français: "Ex: Bamako",
    Anglais: "Ex: Bamako",
    Bambara: "Misali: Bamako",
  },
  placeholder_matricule: {
    Français: "Ex: MAT1234",
    Anglais: "Ex: REG1234",
    Bambara: "Misali: MAT1234",
  },
  placeholder_father_name: {
    Français: "Ex: Mamadou Dembélé",
    Anglais: "Ex: Mamadou Dembele",
    Bambara: "Misali: Mamadu Danbele",
  },
  placeholder_mother_name: {
    Français: "Ex: Aminata Konaté",
    Anglais: "Ex: Aminata Konaté",
    Bambara: "Misali: Aminata Konatɛ",
  },
  placeholder_parents_contact: {
    Français: "Ex: +223 70 00 00 00",
    Anglais: "Ex: +223 70 00 00 00",
    Bambara: "Misali: +223 70 00 00 00",
  },

  // Validation steps messages
  validation_required_fields: {
    Français: "Vérification des champs obligatoires",
    Anglais: "Checking required fields",
    Bambara: "Fɔɲɔn nafamaw lajɛli",
  },
  validation_first_name_format: {
    Français: "Validation du format du prénom",
    Anglais: "Validating first name format",
    Bambara: "Tɔgɔ cogoya lajɛli",
  },
  validation_first_name_length: {
    Français: "Validation de la longueur du prénom",
    Anglais: "Validating first name length",
    Bambara: "Tɔgɔ janya lajɛli",
  },
  validation_last_name_format: {
    Français: "Validation du format du nom de famille",
    Anglais: "Validating last name format",
    Bambara: "Jamu cogoya lajɛli",
  },
  validation_last_name_length: {
    Français: "Validation de la longueur du nom de famille",
    Anglais: "Validating last name length",
    Bambara: "Jamu janya lajɛli",
  },
  validation_birth_place_format: {
    Français: "Validation du format du lieu de naissance",
    Anglais: "Validating birth place format",
    Bambara: "Bangeli yɔrɔ cogoya lajɛli",
  },
  validation_birth_place_length: {
    Français: "Validation de la longueur du lieu de naissance",
    Anglais: "Validating birth place length",
    Bambara: "Bangeli yɔrɔ janya lajɛli",
  },
  validation_sure_name_length: {
    Français: "Validation de la longueur du surnom",
    Anglais: "Validating nickname length",
    Bambara: "Tɔgɔ filanan janya lajɛli",
  },
  validation_father_name_format: {
    Français: "Validation du format du nom du père",
    Anglais: "Validating father's name format",
    Bambara: "Fa tɔgɔ cogoya lajɛli",
  },
  validation_father_name_length: {
    Français: "Validation de la longueur du nom du père",
    Anglais: "Validating father's name length",
    Bambara: "Fa tɔgɔ janya lajɛli",
  },
  validation_mother_name_format: {
    Français: "Validation du format du nom de la mère",
    Anglais: "Validating mother's name format",
    Bambara: "Ba tɔgɔ cogoya lajɛli",
  },
  validation_mother_name_length: {
    Français: "Validation de la longueur du nom de la mère",
    Anglais: "Validating mother's name length",
    Bambara: "Ba tɔgɔ janya lajɛli",
  },
  validation_contact: {
    Français: "Validation du contact",
    Anglais: "Validating contact",
    Bambara: "Sɛbɛnni lajɛli",
  },
  validation_contact_length: {
    Français: "Validation de la longueur du contact",
    Anglais: "Validating contact length",
    Bambara: "Sɛbɛnni janya lajɛli",
  },
  validation_gender: {
    Français: "Validation du sexe",
    Anglais: "Validating gender",
    Bambara: "Cɛya walima musoya lajɛli",
  },
  validation_birth_date: {
    Français: "Validation de la date de naissance",
    Anglais: "Validating birth date",
    Bambara: "Bangeli don lajɛli",
  },
  validation_matricule_format: {
    Français: "Validation du matricule (format)",
    Anglais: "Validating registration number (format)",
    Bambara: "Matirikili cogoya lajɛli",
  },
  validation_matricule_length: {
    Français: "Validation de la longueur du matricule",
    Anglais: "Validating registration number length",
    Bambara: "Matirikili janya lajɛli",
  },

  // Flash messages
  deletion_success: {
    Français: "La suppression a été passée avec succès.",
    Anglais: "Deletion was successful.",
    Bambara: "Jɔsi kɛra ni ɲɛtaa ye.",
  },
  activation_success: {
    Français: "Étudiant activé avec succès.",
    Anglais: "Student activated successfully.",
    Bambara: "Kalanden labɛnna ni ɲɛtaa ye.",
  },
  deactivation_success: {
    Français: "Étudiant désactivé avec succès.",
    Anglais: "Student deactivated successfully.",
    Bambara: "Kalanden dabila ni ɲɛtaa ye.",
  },
};

// Export the translate function
export const translate = (key, language) => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  // Default to French if the requested language is not available
  return translations[key][language] || translations[key]["Français"] || key;
};
