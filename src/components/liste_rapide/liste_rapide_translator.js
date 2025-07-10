// Translator for quick list management system
const translations = {
  // General list management terms
  list_management: {
    Français: "Gestion des Listes",
    Anglais: "List Management",
    Bambara: "Lisiw Ladon Cogo",
  },
  student_lists_count: {
    Français: "listes d'élèves",
    Anglais: "student lists",
    Bambara: "kalandenw lisiw",
  },
  employee_lists_count: {
    Français: "listes d'employés",
    Anglais: "employee lists",
    Bambara: "baarakɛlaw lisiw",
  },

  // Filter buttons
  all_lists: {
    Français: "Toutes les listes",
    Anglais: "All Lists",
    Bambara: "Lisi bɛɛ",
  },
  show_all_lists: {
    Français: "Afficher toutes les listes",
    Anglais: "Show All Lists",
    Bambara: "Lisi bɛɛ jira",
  },
  students: {
    Français: "Élèves",
    Anglais: "Students",
    Bambara: "Kalandenw",
  },
  show_student_lists: {
    Français: "Afficher les listes d'élèves",
    Anglais: "Show Student Lists",
    Bambara: "Kalandenw lisiw jira",
  },
  employees: {
    Français: "Employés",
    Anglais: "Employees",
    Bambara: "Baarakɛlaw",
  },
  show_employee_lists: {
    Français: "Afficher les listes d'employés",
    Anglais: "Show Employee Lists",
    Bambara: "Baarakɛlaw lisiw jira",
  },

  // List types
  student_list: {
    Français: "Liste d'élèves",
    Anglais: "Student list",
    Bambara: "Kalandenw lisi",
  },
  employee_list: {
    Français: "Liste d'employés",
    Anglais: "Employee list",
    Bambara: "Baarakɛlaw lisi",
  },

  // List actions
  create_new_list: {
    Français: "Créer une nouvelle liste",
    Anglais: "Create New List",
    Bambara: "Lisi kura dilan",
  },
  create_list: {
    Français: "Créer la liste",
    Anglais: "Create the List",
    Bambara: "Lisi dilan",
  },
  edit_list: {
    Français: "Modifier la liste",
    Anglais: "Edit List",
    Bambara: "Lisi labɛn",
  },
  delete_list: {
    Français: "Supprimer la liste",
    Anglais: "Delete List",
    Bambara: "Lisi jɔsi",
  },
  return_to_menu: {
    Français: "Retourner au menu",
    Anglais: "Return to menu",
    Bambara: "Segin menu ma",
  },
  change_list_type: {
    Français: "Changer le type de liste",
    Anglais: "Change list type",
    Bambara: "Lisi suguyali yɛlɛma",
  },
  type: {
    Français: "Type",
    Anglais: "Type",
    Bambara: "Suguya",
  },

  // List editing
  list_name: {
    Français: "Nom de la liste",
    Anglais: "List Name",
    Bambara: "Lisi tɔgɔ",
  },
  empty_name_error: {
    Français: "Le nom ne peut pas être vide",
    Anglais: "Name cannot be empty",
    Bambara: "Tɔgɔ tɛ se ka kɛ lankolon ye",
  },
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A mara",
  },
  save_new_name: {
    Français: "Enregistrer le nouveau nom",
    Anglais: "Save New Name",
    Bambara: "Tɔgɔ kura a mara",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },
  cancel_and_close: {
    Français: "Annuler et fermer",
    Anglais: "Cancel and close",
    Bambara: "A dabila ni ka datugu",
  },
  cancel_rename: {
    Français: "Annuler le renommage",
    Anglais: "Cancel Renaming",
    Bambara: "Tɔgɔ yɛlɛmani dabila",
  },

  // Time formatting
  modified: {
    Français: "Modifié",
    Anglais: "Modified",
    Bambara: "A yɛlɛmana",
  },
  created_on: {
    Français: "Créé le",
    Anglais: "Created on",
    Bambara: "A dilanna",
  },
  unknown_date: {
    Français: "Date inconnue",
    Anglais: "Unknown date",
    Bambara: "Don dɔngabali",
  },

  // List content
  students_count: {
    Français: "élèves",
    Anglais: "students",
    Bambara: "kalandenw",
  },
  employees_count: {
    Français: "employés",
    Anglais: "employees",
    Bambara: "baarakɛlaw",
  },
  no_students: {
    Français: "Aucune liste d'élèves",
    Anglais: "No Student Lists",
    Bambara: "Kalandenw lisi foyi tɛ",
  },
  no_employees: {
    Français: "Aucune liste d'employés",
    Anglais: "No Employee Lists",
    Bambara: "Baarakɛlaw lisi foyi tɛ",
  },
  no_list_available: {
    Français: "Aucune liste disponible",
    Anglais: "No lists available",
    Bambara: "Lisi foyi tɛɲin",
  },
  add_students_button: {
    Français: "Ajouter des élèves",
    Anglais: "Add students",
    Bambara: "Kalandenw fara",
  },
  add: {
    Français: "Ajouter",
    Anglais: "Add",
    Bambara: "A Fara",
  },
  add_employees_button: {
    Français: "Ajouter des employés",
    Anglais: "Add employees",
    Bambara: "Baarakɛlaw fara",
  },
  add_employees_indication_msg: {
    Français: `Créez une nouvelle liste en cliquant sur le bouton "Nouvelle liste"`,
    Anglais: `Create a new list by clicking on the "New list" button`,
    Bambara: `"Lisi kura" Butɔn digi walasa ka lisi kura dɔ labɛn`,
  },
  add_employees_text: {
    Français: "Ajouter des employés à la liste",
    Anglais: "Add employees to list",
    Bambara: "Baarakɛlaw fara lisi kan",
  },
  click_to_add_students: {
    Français: 'Cliquez sur le bouton "Ajouter des élèves" pour commencer',
    Anglais: 'Click on the "Add students" button to get started',
    Bambara: 'A digi butɔn kan ka "Kalandenw fara" walasa ka daminɛ',
  },
  click_to_add_employees: {
    Français: 'Cliquez sur le bouton "Ajouter des employés" pour commencer',
    Anglais: 'Click on the "Add employees" button to get started',
    Bambara: 'A digi butɔn kan ka "Baarakɛlaw fara" walasa ka daminɛ',
  },

  // Selection actions
  select_all: {
    Français: "Sélectionner tout",
    Anglais: "Select all",
    Bambara: "Bɛɛ sugandi",
  },
  deselect_all: {
    Français: "Désélectionner tout",
    Anglais: "Deselect all",
    Bambara: "Bɛɛ sugandili bɔ",
  },
  students_selected: {
    Français: "élève(s) sélectionné(s) sur",
    Anglais: "student(s) selected out of",
    Bambara: "kalanden(w) sugandila ka bɔ",
  },
  displayed: {
    Français: "affiché(s)",
    Anglais: "displayed",
    Bambara: "jiralen(w) na",
  },
  employees_selected: {
    Français: "employé(s) sélectionné(s) sur",
    Anglais: "employee(s) selected out of",
    Bambara: "baarakɛla(w) sugandila ka bɔ",
  },
  employees_or_employee: {
    Français: "employé(s)",
    Anglais: "employee(s)",
    Bambara: "baarakɛla(w)",
  },
  active_employees: {
    Français: "Employés actifs",
    Anglais: "Active Employees",
    Bambara: "Baarakɛla minnu bɛ baara la",
  },
  inactive_employees: {
    Français: "Employés inactifs",
    Anglais: "Inactive Employees",
    Bambara: "Baarakɛla minnu ye baara bila",
  },
  active: {
    Français: "Actif",
    Anglais: "Active",
    Bambara: "A bɛ baara la",
  },
  inactive: {
    Français: "Inactif",
    Anglais: "Inactive",
    Bambara: "A ye baara jɔ",
  },
  male: {
    Français: "Homme",
    Anglais: "Male",
    Bambara: "Cɛ",
  },
  female: {
    Français: "Femme",
    Anglais: "Female",
    Bambara: "Muso",
  },
  month: {
    Français: "mois",
    Anglais: "month",
    Bambara: "kalo",
  },
  hour: {
    Français: "heure",
    Anglais: "hour",
    Bambara: "nɛkɛ kaɲɛ",
  },

  // Confirmation dialog
  confirm_deletion: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "Jɔsili Yamaruya",
  },
  confirm_delete_list_message_1: {
    Français: "Êtes-vous sûr de vouloir supprimer la liste",
    Anglais: "Are you sure you want to delete the list",
    Bambara: "I b'a fɛ ka ni lisi jɔsi sɛbɛ yɛrɛ la wa",
  },
  confirm_delete_list_message_2: {
    Français: "Cette action ne peut pas être annulée.",
    Anglais: "This action cannot be undone.",
    Bambara: "Nin baara tɛ se ka sɛgɛn kɔ.",
  },

  // Additional keys
  open: {
    Français: "Ouvrir",
    Anglais: "Open",
    Bambara: "A dayɛlɛ",
  },
  open_liste: {
    Français: "Ouvrir la liste",
    Anglais: "Open the list",
    Bambara: "lisi dayɛlɛ",
  },
  rename_list: {
    Français: "Renommer la liste",
    Anglais: "Rename List",
    Bambara: "Lisi tɔgɔ yɛlɛma",
  },
  modified_date: {
    Français: "Modifié {date}",
    Anglais: "Modified {date}",
    Bambara: "Yɛlɛmanen {date}",
  },
  created_date: {
    Français: "Créé le {date}",
    Anglais: "Created on {date}",
    Bambara: "Da don {date}",
  },
  new_list: {
    Français: "Nouvelle liste",
    Anglais: "New List",
    Bambara: "Lisi kura",
  },
  no_lists: {
    Français: "Aucune liste",
    Anglais: "No Lists",
    Bambara: "Lisi foyi tɛ",
  },

  // StudentListNamePopup.jsx
  create: {
    Français: "Créer",
    Anglais: "Create",
    Bambara: "Dilan",
  },
  student_list_placeholder: {
    Français: "Ex: Liste des élèves de 6ème A",
    Anglais: "Ex: 6th Grade A Student List",
    Bambara: "Mi: 6 nan A kalandenw lisi",
  },
  employee_list_placeholder: {
    Français: "Ex: Liste du personnel enseignant",
    Anglais: "Ex: Teaching Staff List",
    Bambara: "Mi: Karamɔgɔw lisi",
  },
  list_type: {
    Français: "Type de liste",
    Anglais: "List type",
    Bambara: "Lisi suguyya",
  },

  // StudentListAddStudents.jsx
  add_students_to_list: {
    Français: "Ajouter des élèves à la liste",
    Anglais: "Add Students to List",
    Bambara: "Kalandenw fara lisi kan",
  },
  search_student: {
    Français: "Rechercher un élève...",
    Anglais: "Search student...",
    Bambara: "Kalanden ɲini...",
  },
  all_levels: {
    Français: "Tous les niveaux",
    Anglais: "All Levels",
    Bambara: "Kalanjɛ bɛɛ",
  },
  level: {
    Français: "Niveau",
    Anglais: "Level",
    Bambara: "Kalanjɛ",
  },
  deselect_all: {
    Français: "Tout désélectionner",
    Anglais: "Deselect All",
    Bambara: "Bɛɛ sugandili bɔ",
  },
  students_selected: {
    Français: "élèves sélectionnés sur",
    Anglais: "students selected of",
    Bambara: "kalanden(w) sugandilen ka bɔ",
  },
  no_assigned_class: {
    Français: "Pas de classe assignée",
    Anglais: "No assigned class",
    Bambara: "A tɛ kilasi kɔnɔ",
  },
  matricule: {
    Français: "Matricule",
    Anglais: "ID Number",
    Bambara: "Matirikili",
  },
  add_count_students: {
    Français: "Ajouter {count} élève(s)",
    Anglais: "Add {count} student(s)",
    Bambara: "Kalanden {count} fara",
  },
  students_or_student: {
    Français: "élève(s)",
    Anglais: "student(s)",
    Bambara: "kalanden(w)",
  },

  // Textes généraux de la liste rapide
  quick_list: {
    Français: "Liste Rapide",
    Anglais: "Quick List",
    Bambara: "Lisi Teliman",
  },
  student_list: {
    Français: "Liste d'Élèves",
    Anglais: "Students List",
    Bambara: "Kalandenw Lisi",
  },
  employee_list: {
    Français: "Liste d'Employés",
    Anglais: "Employee List",
    Bambara: "Baarakɛlaw Lisi",
  },
  preview: {
    Français: "Aperçu",
    Anglais: "Preview",
    Bambara: "Fileli",
  },
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A mara",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },
  delete: {
    Français: "Supprimer",
    Anglais: "Delete",
    Bambara: "Jɔsi",
  },
  print: {
    Français: "Imprimer",
    Anglais: "Print",
    Bambara: "Sɛbɛnni kɛ",
  },
  export_pdf: {
    Français: "Exporter PDF",
    Anglais: "Export PDF",
    Bambara: "PDF labɔ",
  },
  export_excel: {
    Français: "Exporter Excel",
    Anglais: "Export Excel",
    Bambara: "Excel labɔ",
  },
  add_students: {
    Français: "Ajouter des élèves",
    Anglais: "Add students",
    Bambara: "Kalandenw fara",
  },
  add_employees: {
    Français: "Ajouter des employés",
    Anglais: "Add employees",
    Bambara: "Baarakɛlaw fara",
  },

  // Éléments du menu
  list_details: {
    Français: "Détails de la liste",
    Anglais: "List Details",
    Bambara: "Lisi kunnafoni",
  },
  list_options: {
    Français: "Options de la liste",
    Anglais: "List Options",
    Bambara: "Lisi sugandiliw",
  },
  share: {
    Français: "Partager",
    Anglais: "Share",
    Bambara: "K'a di",
  },
  rename_list: {
    Français: "Renommer la liste",
    Anglais: "Rename List",
    Bambara: "Lisi tɔgɔ yɛlɛma",
  },
  duplicate_list: {
    Français: "Dupliquer la liste",
    Anglais: "Duplicate List",
    Bambara: "Lisi suguyya kelen dilan",
  },
  delete_list: {
    Français: "Supprimer la liste",
    Anglais: "Delete List",
    Bambara: "Lisi jɔsi",
  },

  // Formulaire d'ajout et modification de liste
  list_name: {
    Français: "Nom de la liste",
    Anglais: "List Name",
    Bambara: "Lisi tɔgɔ",
  },
  list_description: {
    Français: "Description de la liste",
    Anglais: "List Description",
    Bambara: "Lisi kunnafoni dafalen",
  },
  list_type: {
    Français: "Type de liste",
    Anglais: "List Type",
    Bambara: "Lisi suguyya",
  },
  color_scheme: {
    Français: "Thème de couleur",
    Anglais: "Color Scheme",
    Bambara: "Ɲɛ cogoya",
  },
  header_style: {
    Français: "Style d'en-tête",
    Anglais: "Header Style",
    Bambara: "Kunfɛla cogoya",
  },
  show_numbers: {
    Français: "Afficher les numéros",
    Anglais: "Show Numbers",
    Bambara: "Jatew jira",
  },
  show_grid: {
    Français: "Afficher la grille",
    Anglais: "Show Grid",
    Bambara: "Cɛcibɛnni jira",
  },

  // Ajout d'élèves/employés
  search: {
    Français: "Rechercher",
    Anglais: "Search",
    Bambara: "Ɲini",
  },
  search_students: {
    Français: "Rechercher des élèves",
    Anglais: "Search Students",
    Bambara: "Kalandenw ɲini",
  },
  search_employees: {
    Français: "Rechercher des employés...",
    Anglais: "Search Employees...",
    Bambara: "Baarakɛlaw ɲini...",
  },
  filter_by: {
    Français: "Filtrer par",
    Anglais: "Filter By",
    Bambara: "Woloma ni",
  },
  filter_by_poste: {
    Français: "Filtrer par poste",
    Anglais: "Filter by position",
    Bambara: "Woloma ni baara ye",
  },
  filter_by_status: {
    Français: "Filtrer par Statut",
    Anglais: "Filter by Status",
    Bambara: "Woloma ni Cogoya ye",
  },
  all_postes: {
    Français: "Tous les postes",
    Anglais: "All positions",
    Bambara: "Baaraw bɛɛ lajɛlen",
  },
  class: {
    Français: "Classe",
    Anglais: "Class",
    Bambara: "Kalankɔnɔna",
  },
  grade: {
    Français: "Niveau",
    Anglais: "Grade",
    Bambara: "Kalanjɛ",
  },
  all_classes: {
    Français: "Toutes les classes",
    Anglais: "All Classes",
    Bambara: "Kilasiw bɛɛ",
  },
  all: {
    Français: "Toutes",
    Anglais: "All",
    Bambara: "A bɛɛ",
  },
  all_grades: {
    Français: "Tous les niveaux",
    Anglais: "All Grades",
    Bambara: "Kalanjɛ bɛɛ",
  },
  select_all: {
    Français: "Sélectionner tout",
    Anglais: "Select All",
    Bambara: "A bɛɛ sugandi",
  },
  clear_selection: {
    Français: "Effacer la sélection",
    Anglais: "Clear Selection",
    Bambara: "Sugandili faran",
  },
  selected_students: {
    Français: "Élèves sélectionnés",
    Anglais: "Selected Students",
    Bambara: "Kalandenw sugandilen",
  },
  selected_employees: {
    Français: "Employés sélectionnés",
    Anglais: "Selected Employees",
    Bambara: "Baarakɛlaw sugandilen",
  },
  add_to_list: {
    Français: "Ajouter à la liste",
    Anglais: "Add to List",
    Bambara: "A fara lisi kan",
  },
  no_results: {
    Français: "Aucun résultat",
    Anglais: "No Results",
    Bambara: "Foyi ma sɔrɔ",
  },
  no_students_found: {
    Français: "Aucun élève trouvé",
    Anglais: "No Students Found",
    Bambara: "Kalanden si ma sɔrɔ",
  },
  no_employees_found: {
    Français: "Aucun employé trouvé",
    Anglais: "No Employees Found",
    Bambara: "Baarakɛla si ma sɔrɔ",
  },
  try_modify_filters: {
    Français: "Essayez de modifier vos filtres de recherche",
    Anglais: "Try to modify your filters of search",
    Bambara: "A filɛ tan i ka wolomali cogo falen tan",
  },

  // Éditeur de liste
  drag_to_reorder: {
    Français: "Glisser pour réorganiser",
    Anglais: "Drag to Reorder",
    Bambara: "Sam walasa ka cogo yɛlɛma",
  },
  click_to_edit: {
    Français: "Cliquer pour modifier",
    Anglais: "Click to Edit",
    Bambara: "A digi walasa ka yɛlɛma",
  },
  name: {
    Français: "Nom",
    Anglais: "Name",
    Bambara: "Tɔgɔ",
  },
  first_name: {
    Français: "Prénom",
    Anglais: "First Name",
    Bambara: "Tɔgɔ fɔlɔ",
  },
  last_name: {
    Français: "Nom de famille",
    Anglais: "Last Name",
    Bambara: "Jamu",
  },
  id_number: {
    Français: "Numéro ID",
    Anglais: "ID Number",
    Bambara: "ID nimɔrɔ",
  },
  email: {
    Français: "Email",
    Anglais: "Email",
    Bambara: "Imɛli",
  },
  phone: {
    Français: "Téléphone",
    Anglais: "Phone",
    Bambara: "Telefɔni",
  },
  action: {
    Français: "Action",
    Anglais: "Action",
    Bambara: "Baara",
  },
  remove: {
    Français: "Retirer",
    Anglais: "Remove",
    Bambara: "A bɔ",
  },
  remove_from_list: {
    Français: "Retirer de la liste",
    Anglais: "Remove from List",
    Bambara: "A bɔ lisi la",
  },
  confirm_remove: {
    Français: "Confirmer le retrait",
    Anglais: "Confirm Removal",
    Bambara: "A bɔli jɛtagɛ",
  },
  are_you_sure_remove: {
    Français: "Êtes-vous sûr de vouloir retirer cet élément de la liste ?",
    Anglais: "Are you sure you want to remove this item from the list?",
    Bambara: "I dalen don i bɛ nin fɛn in bɔ lisi la?",
  },

  // Aperçu et partage
  list_preview: {
    Français: "Aperçu de la liste",
    Anglais: "List Preview",
    Bambara: "Lisi fileli",
  },
  generated_on: {
    Français: "Généré le",
    Anglais: "Generated on",
    Bambara: "Dilanna",
  },
  share_list: {
    Français: "Partager la liste",
    Anglais: "Share List",
    Bambara: "Lisi di",
  },
  share_via: {
    Français: "Partager via",
    Anglais: "Share via",
    Bambara: "K'a di ni",
  },
  copy_link: {
    Français: "Copier le lien",
    Anglais: "Copy Link",
    Bambara: "Cɛsiri copy kɛ",
  },
  link_copied: {
    Français: "Lien copié !",
    Anglais: "Link Copied!",
    Bambara: "Cɛsiri copy kɛra!",
  },

  // Messages d'erreur et de confirmation
  error: {
    Français: "Erreur",
    Anglais: "Error",
    Bambara: "Fili",
  },
  success: {
    Français: "Succès",
    Anglais: "Success",
    Bambara: "A ɲɛna",
  },
  list_created: {
    Français: "Liste créée avec succès",
    Anglais: "List created successfully",
    Bambara: "Lisi dilanna ka ɲɛ",
  },
  list_updated: {
    Français: "Liste mise à jour avec succès",
    Anglais: "List updated successfully",
    Bambara: "Lisi kura donnen don ni ɲɛtaa ye",
  },
  list_deleted: {
    Français: "Liste supprimée avec succès",
    Anglais: "List deleted successfully",
    Bambara: "Lisi jɔsira ni ɲɛtaa ye",
  },
  confirm_delete_message: {
    Français:
      "Êtes-vous sûr de vouloir supprimer cette liste ? Cette action ne peut pas être annulée.",
    Anglais:
      "Are you sure you want to delete this list? This action cannot be undone.",
    Bambara: "I dalen don i bɛ nin lisi in jɔsi? Nin baara tɛ se ka sɛgɛn kɔ.",
  },
  confirm_delete_title: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "Jɔsili yamaruya",
  },
  required_field: {
    Français: "Ce champ est obligatoire",
    Anglais: "This field is required",
    Bambara: "Nin yɔrɔ ka kan ka fa",
  },

  // Modification des noms
  edit_student_name: {
    Français: "Modifier le nom de l'élève",
    Anglais: "Edit Student Name",
    Bambara: "Kalanden tɔgɔ labɛn",
  },
  edit_employee_name: {
    Français: "Modifier le nom de l'employé",
    Anglais: "Edit Employee Name",
    Bambara: "Baarakɛla tɔgɔ labɛn",
  },
  name_cant_be_empty: {
    Français: "Le nom ne peut pas être vide",
    Anglais: "Name cannot be empty",
    Bambara: "Tɔgɔ tɛ se ka kɛ lankolon ye",
  },

  // Couleurs et styles
  color_themes: {
    Français: "Thèmes de couleurs",
    Anglais: "Color Themes",
    Bambara: "Ɲɛ cogoyaw",
  },
  custom_colors: {
    Français: "Couleurs personnalisées",
    Anglais: "Custom Colors",
    Bambara: "Ɲɛ sugandilen",
  },
  primary_color: {
    Français: "Couleur principale",
    Anglais: "Primary Color",
    Bambara: "Ɲɛ fɔlɔ",
  },
  secondary_color: {
    Français: "Couleur secondaire",
    Anglais: "Secondary Color",
    Bambara: "Ɲɛ filanan",
  },
  accent_color: {
    Français: "Couleur d'accent",
    Anglais: "Accent Color",
    Bambara: "Ɲɛ nɔnabila",
  },
  font_style: {
    Français: "Style de police",
    Anglais: "Font Style",
    Bambara: "Sɛbɛnni cogoya",
  },
  simple: {
    Français: "Simple",
    Anglais: "Simple",
    Bambara: "Nɔgɔ",
  },
  modern: {
    Français: "Moderne",
    Anglais: "Modern",
    Bambara: "Kisɛ",
  },
  classic: {
    Français: "Classique",
    Anglais: "Classic",
    Bambara: "Lakɔrɔkow",
  },
  elegant: {
    Français: "Élégant",
    Anglais: "Elegant",
    Bambara: "Cɛcimanba",
  },
  bold: {
    Français: "Gras",
    Anglais: "Bold",
    Bambara: "Ɲɛ Bonya",
  },
  loading: {
    Français: "Chargement...",
    Anglais: "Loading...",
    Bambara: "A bɛ ta...",
  },

  // Barre latérale et options
  general_settings: {
    Français: "Paramètres généraux",
    Anglais: "General Settings",
    Bambara: "Labaara labɛnw",
  },
  display_options: {
    Français: "Options d'affichage",
    Anglais: "Display Options",
    Bambara: "Jirali sugandiliw",
  },
  column_settings: {
    Français: "Paramètres des colonnes",
    Anglais: "Column Settings",
    Bambara: "Kolonni labɛnw",
  },
  enabled: {
    Français: "Activé",
    Anglais: "Enabled",
    Bambara: "A dayɛlɛlen",
  },
  disabled: {
    Français: "Désactivé",
    Anglais: "Disabled",
    Bambara: "A datugulun",
  },

  // Éléments spécifiques
  student_count: {
    Français: "Nombre d'élèves",
    Anglais: "Student Count",
    Bambara: "Kalandenw jatɛ",
  },
  employee_count: {
    Français: "Nombre d'employés",
    Anglais: "Employee Count",
    Bambara: "Baarakɛlaw jatɛ",
  },
  created_on: {
    Français: "Créé le",
    Anglais: "Created on",
    Bambara: "A dilanna",
  },
  modified_on: {
    Français: "Modifié le",
    Anglais: "Modified on",
    Bambara: "A labɛnna",
  },
  close: {
    Français: "Fermer",
    Anglais: "Close",
    Bambara: "A datugu",
  },
  apply: {
    Français: "Appliquer",
    Anglais: "Apply",
    Bambara: "A kɛ",
  },
  reset: {
    Français: "Réinitialiser",
    Anglais: "Reset",
    Bambara: "A dafa kura",
  },

  // Messages liés aux actions sur les listes
  error_loading_data: {
    Français: "Erreur lors du chargement des données",
    Anglais: "Error loading data",
    Bambara: "Kunnafoniw ladonni la fili kɛra",
  },
  list_saved_successfully: {
    Français: "Liste sauvegardée avec succès",
    Anglais: "List saved successfully",
    Bambara: "Lisi mara la ni ɲɛtaa ye",
  },
  list_deleted_successfully: {
    Français: "Liste supprimée avec succès",
    Anglais: "List deleted successfully",
    Bambara: "Lisi jɔsira ni ɲɛtaa ye",
  },
  error_saving_list: {
    Français: "Erreur lors de la sauvegarde de la liste",
    Anglais: "Error saving list",
    Bambara: "Lisi marali la fili kɛra",
  },
  error_deleting_list: {
    Français: "Erreur lors de la suppression de la liste",
    Anglais: "Error deleting list",
    Bambara: "Lisi jɔsili la filɛli kɛra",
  },
  director: {
    Français: "Le Directeur",
    Anglais: "The Director",
    Bambara: "Kalan so Kuntigi",
  },

  // Traductions pour StudentListEditor.jsx
  pdf_generated_successfully: {
    Français: "PDF généré avec succès",
    Anglais: "PDF generated successfully",
    Bambara: "PDF dialanna ka ɲɛ",
  },
  error_generating_pdf: {
    Français: "Erreur lors de la génération du PDF.",
    Anglais: "Error generating PDF.",
    Bambara: "PDF dilantɔla gɛlɛya dɔw sɔrɔ la, segin a kan.",
  },
  students_added_to_list: {
    Français: "élève(s) ajouté(s) à la liste",
    Anglais: "student(s) added to the list",
    Bambara: "kalanden(w) farala lisi kan",
  },
  no_new_students_added: {
    Français: "Aucun nouvel élève ajouté à la liste",
    Anglais: "No new students added to the list",
    Bambara: "Kalanden kura foyi ma fara lisi kan",
  },
  employees_added_to_list: {
    Français: "employé(s) ajouté(s) à la liste",
    Anglais: "employee(s) added to the list",
    Bambara: "baarakɛla(w) farala lisi kan",
  },
  no_new_employees_added: {
    Français: "Aucun nouvel employé ajouté à la liste",
    Anglais: "No new employees added to the list",
    Bambara: "Baarakɛla kura foyi ma fara lisi kan",
  },
  student_removed_from_list: {
    Français: "Élève retiré de la liste",
    Anglais: "Student removed from the list",
    Bambara: "Kalanden bɔra lisi kan",
  },
  employee_removed_from_list: {
    Français: "Employé retiré de la liste",
    Anglais: "Employee removed from the list",
    Bambara: "Baarakɛla bɔra lisi kan",
  },
  header_already_exists: {
    Français: "Cet en-tête existe déjà",
    Anglais: "This header already exists",
    Bambara: "Nin kunfɛla in bɛ yen ka ban",
  },
  custom_header_added: {
    Français: "En-tête personnalisé ajouté",
    Anglais: "Custom header added",
    Bambara: "Kunfɛla kɛrɛnkɛrɛnnen farala",
  },
  first_last_name_required: {
    Français: "Les en-têtes Prénom et Nom sont obligatoires",
    Anglais: "First name and Last name headers are required",
    Bambara: "Tɔgɔ fɔlɔ ani Jamu kunfɛlaw ka kan ka kɛ wajibila",
  },
  max_10_headers: {
    Français: "Vous ne pouvez pas sélectionner plus de 10 en-têtes",
    Anglais: "You cannot select more than 10 headers",
    Bambara: "I tɛ se ka kunfɛla 10 tɛmɛ sugandi",
  },
  orientation_changed: {
    Français: "Orientation changée en",
    Anglais: "Orientation changed to",
    Bambara: "Cogoya yɛlɛmana ka kɛ",
  },
  portrait: {
    Français: "portrait",
    Anglais: "portrait",
    Bambara: "jɔlen",
  },
  landscape: {
    Français: "paysage",
    Anglais: "landscape",
    Bambara: "dalen",
  },
  cannot_change_list_type_1: {
    Français: "Cette liste contient déjà des",
    Anglais: "This list already contains",
    Bambara: "Nin lisi in kɔnɔ dɔw bɛɲin ka ban",
  },
  cannot_change_list_type_2: {
    Français: "Veuillez les supprimer avant de changer le type.",
    Anglais: "Please remove them before changing the type.",
    Bambara: "I k'olu bɔ lisi in na sani i ka suguyali yɛlɛma.",
  },
  list_type_changed: {
    Français: "Type de liste changé en",
    Anglais: "List type changed to",
    Bambara: "Lisi suguyali yɛlɛmana ka kɛ",
  },
  change_language: {
    Français: "Changer la langue",
    Anglais: "Change language",
    Bambara: "Kan yɛlɛma",
  },
  settings: {
    Français: "Paramètres",
    Anglais: "Settings",
    Bambara: "Paramɛtiri",
  },
  add_employees: {
    Français: "Ajouter des employés",
    Anglais: "Add employees",
    Bambara: "Baarakɛlaw fara",
  },
  save_list: {
    Français: "Sauvegarder la liste",
    Anglais: "Save list",
    Bambara: "Lisi mara la",
  },
  download_pdf: {
    Français: "Télécharger la liste en PDF",
    Anglais: "Download list as PDF",
    Bambara: "Lisi lajɛ PDF la",
  },
  language_changed: {
    Français: "Langue changée en",
    Anglais: "Language changed to",
    Bambara: "Kan yɛlɛmana ka kɛ",
  },

  // Traductions pour StudentListSidebar.jsx
  parameters_title: {
    Français: "Paramètres de la liste",
    Anglais: "List Parameters",
    Bambara: "Lisi labɛnw",
  },
  title_style: {
    Français: "Style du titre",
    Anglais: "Title Style",
    Bambara: "Kun dilalan ka cɛɲɛ",
  },
  title_text: {
    Français: "Texte du titre",
    Anglais: "Title Text",
    Bambara: "Kun sɛbɛnni tɔgɔ",
  },
  font: {
    Français: "Police",
    Anglais: "Font",
    Bambara: "Sɛbɛnni suguya",
  },
  size: {
    Français: "Taille",
    Anglais: "Size",
    Bambara: "Bonya",
  },
  number_sign: {
    Français: "N°",
    Anglais: "#",
    Bambara: "N°",
  },
  registration_number: {
    Français: "Matricule",
    Anglais: "Registration Number",
    Bambara: "Tɔgɔ sɛbɛnni nimɔrɔ",
  },
  birth_date_place: {
    Français: "Date & Lieu de naissance",
    Anglais: "Birth Date & Place",
    Bambara: "Bangeli don & yɔrɔ",
  },
  birth_date: {
    Français: "Date de naissance",
    Anglais: "Birth Date",
    Bambara: "Bangeli don",
  },
  start_date: {
    Français: "Date de début",
    Anglais: "Start Date",
    Bambara: "Daminɛ don",
  },
  positions: {
    Français: "Postes",
    Anglais: "Positions",
    Bambara: "Baaraw",
  },
  salary: {
    Français: "Salaire",
    Anglais: "Salary",
    Bambara: "Sara",
  },
  specialty: {
    Français: "Spécialité",
    Anglais: "Specialty",
    Bambara: "Dɔnniya kɛrɛnkɛrɛnnen",
  },
  classes: {
    Français: "Classes",
    Anglais: "Classes",
    Bambara: "Kalanw",
  },
  status: {
    Français: "Statut",
    Anglais: "Status",
    Bambara: "Cogoya",
  },
  father: {
    Français: "Père",
    Anglais: "Father",
    Bambara: "Fa",
  },
  mother: {
    Français: "Mère",
    Anglais: "Mother",
    Bambara: "Ba",
  },
  average: {
    Français: "Moyenne",
    Anglais: "Average",
    Bambara: "Hakɛ cɛmancɛ",
  },
  text_style: {
    Français: "Style du texte",
    Anglais: "Text Style",
    Bambara: "Sɛbɛnni cogoya",
  },
  text_of_style: {
    Français: "Style de texte",
    Anglais: "Style of text",
    Bambara: "Sɛbɛnni cogoya dilan kaɲɛ",
  },
  italic: {
    Français: "Italique",
    Anglais: "Italic",
    Bambara: "Jɛgɛnen",
  },
  underline: {
    Français: "Souligné",
    Anglais: "Underline",
    Bambara: "Kalaman",
  },
  alignment: {
    Français: "Alignement",
    Anglais: "Alignment",
    Bambara: "Sinsinni",
  },
  left: {
    Français: "Gauche",
    Anglais: "Left",
    Bambara: "Numanyanfan",
  },
  center: {
    Français: "Centre",
    Anglais: "Center",
    Bambara: "Cɛmancɛ",
  },
  right: {
    Français: "Droite",
    Anglais: "Right",
    Bambara: "Kininyanfan",
  },
  encadrement: {
    Français: "Encadrement du titre",
    Anglais: "Title framing",
    Bambara: "Tɔgɔ lamunumunu",
  },
  title_border: {
    Français: "Bordure du titre",
    Anglais: "Title Border",
    Bambara: "Kunfɛ dankun",
  },
  full_frame: {
    Français: "Cadre complet",
    Anglais: "Full Frame",
    Bambara: "Kɛrɛnkɛrɛnnen dafalen",
  },
  underlined: {
    Français: "Souligné",
    Anglais: "Underlined",
    Bambara: "Duguma Tiri",
  },
  top_line: {
    Français: "Ligne du haut",
    Anglais: "Top Line",
    Bambara: "Sanfɛ Tiri",
  },
  shadow: {
    Français: "Ombre",
    Anglais: "Shadow",
    Bambara: "Suma",
  },
  rounded: {
    Français: "Arrondi",
    Anglais: "Rounded",
    Bambara: "Korilen",
  },
  colored_background: {
    Français: "Fond coloré",
    Anglais: "Colored Background",
    Bambara: "Kɔnɔna Kulɛri",
  },
  double_line: {
    Français: "Double ligne",
    Anglais: "Double Line",
    Bambara: "Tiri fila",
  },
  gradient: {
    Français: "Dégradé",
    Anglais: "Gradient",
    Bambara: "Ɲɛ yɛlɛmayɛlɛma",
  },
  border_style: {
    Français: "Style de bordure",
    Anglais: "Border Style",
    Bambara: "Dankun cogoya",
  },
  thickness: {
    Français: "Épaisseur",
    Anglais: "Thickness",
    Bambara: "Bonya",
  },
  style: {
    Français: "Style",
    Anglais: "Style",
    Bambara: "Cogoya",
  },
  solid: {
    Français: "Plein",
    Anglais: "Solid",
    Bambara: "Tilennen",
  },
  dashed: {
    Français: "Tirets",
    Anglais: "Dashed",
    Bambara: "Tigɛtigɛlen",
  },
  dotted: {
    Français: "Pointillés",
    Anglais: "Dotted",
    Bambara: "Tomiw",
  },
  double: {
    Français: "Double",
    Anglais: "Double",
    Bambara: "Fila",
  },
  shadow_intensity: {
    Français: "Intensité de l'ombre",
    Anglais: "Shadow Intensity",
    Bambara: "Suma bonya",
  },
  color: {
    Français: "Couleur",
    Anglais: "Color",
    Bambara: "Kulɛri",
  },
  advanced_options: {
    Français: "Options avancées",
    Anglais: "Advanced Options",
    Bambara: "Ɲɛfɛ sugandiliw",
  },
  text_shadow: {
    Français: "Ombre du texte",
    Anglais: "Text Shadow",
    Bambara: "Sɛbɛnni suma",
  },
  uppercase: {
    Français: "Majuscules",
    Anglais: "Uppercase",
    Bambara: "Daɲɛ bamanw",
  },
  letter_spacing: {
    Français: "Espacement des lettres",
    Anglais: "Letter Spacing",
    Bambara: "Furancɛ Sɛbɛnniw cɛ",
  },
  outline: {
    Français: "Contour",
    Anglais: "Outline",
    Bambara: "Lamini",
  },
  standard_headers: {
    Français: "En-têtes standards",
    Anglais: "Standard Headers",
    Bambara: "Kunfɛ ɲɛsinnenw",
  },
  select_up_to_10_headers: {
    Français: "Sélectionnez jusqu'à 10 en-têtes",
    Anglais: "Select up to 10 headers",
    Bambara: "Kunfɛ 10 sugandi",
  },
  custom_headers: {
    Français: "En-têtes personnalisés",
    Anglais: "Custom Headers",
    Bambara: "Kunfɛ kɛrɛnkɛrɛnnenw",
  },
  new_header: {
    Français: "Nouvel en-tête...",
    Anglais: "New header...",
    Bambara: "Kunfɛ kura...",
  },
  no_custom_headers: {
    Français: "Aucun en-tête personnalisé",
    Anglais: "No custom headers",
    Bambara: "Kunfɛ kɛrɛnkɛrɛnnen foyi tɛ",
  },
  page_orientation: {
    Français: "Orientation de la page",
    Anglais: "Page Orientation",
    Bambara: "Gafe cogoya",
  },
  custom_message: {
    Français: "Message personnalisé",
    Anglais: "Custom Message",
    Bambara: "Kibaru kɛrɛnkɛrɛnnen",
  },
  show_custom_message: {
    Français: "Afficher un message personnalisé",
    Anglais: "Show custom message",
    Bambara: "Kibaru kɛrɛnkɛrɛnnen jira",
  },
  message_text: {
    Français: "Texte du message",
    Anglais: "Message text",
    Bambara: "Kibaru sɛbɛnni",
  },
  example_message: {
    Français: "Ex: Le Directeur",
    Anglais: "Ex: The Director",
    Bambara: "Mi: Kalan so Kuntigi",
  },
  your_name: {
    Français: "Votre nom",
    Anglais: "Your name",
    Bambara: "I tɔgɔ",
  },
  example_name: {
    Français: "Ex: Mamadou Dembélé",
    Anglais: "Ex: Mamadou Dembele",
    Bambara: "Mi: Mamadu Danbele",
  },
  date: {
    Français: "Date",
    Anglais: "Date",
    Bambara: "Don",
  },
  country_header: {
    Français: "En-tête Pays",
    Anglais: "Country Header",
    Bambara: "Jamana kunfɛ",
  },
  show_country_header: {
    Français: "Afficher l'en-tête pays",
    Anglais: "Show country header",
    Bambara: "Jamana kunfɛ jira",
  },
  cap_instead_of_academy: {
    Français: "CAP au lieu d'Académie",
    Anglais: "CAP instead of Academy",
    Bambara: "Ka bɔ 'CAP' la ka kɛ 'Academi' ye",
  },

  // Traductions pour StudentListPreview.jsx
  no_students_in_list: {
    Français: "Aucun élève dans cette liste",
    Anglais: "No students in this list",
    Bambara: "Kalanden foyi tɛ nin lisi in na",
  },
  no_employees_in_list: {
    Français: "Aucun employé dans cette liste",
    Anglais: "No employees in this list",
    Bambara: "Baarakɛla foyi tɛ nin lisi in na",
  },
  click_button_to_start: {
    Français: "Cliquez sur le bouton pour commencer",
    Anglais: "Click the button to start",
    Bambara: "Butɔn digi walasa ka daminɛ",
  },
  remove_student: {
    Français: "Retirer l'élève",
    Anglais: "Remove student",
    Bambara: "Kalanden bɔ",
  },
  remove_employee: {
    Français: "Retirer l'employé",
    Anglais: "Remove employee",
    Bambara: "Baarakɛla bɔ",
  },
  actions: {
    Français: "Actions",
    Anglais: "Actions",
    Bambara: "Yεlεma",
  },
};

// Translation helper
export const translate = (key, language) => {
  if (!translations[key]) return key;
  return translations[key][language] || translations[key]["Français"];
};

export default translations;
