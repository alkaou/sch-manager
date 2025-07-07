// Translator for partials components
const translations = {
  // SideBar navigation items
  dashboard_texte: {
    Français: "Dashboard",
    Anglais: "Dashboard",
    Bambara: "Kalandenw Yɔrɔ",
  },
  employes_texte: {
    Français: "Employés",
    Anglais: "Employees",
    Bambara: "Baara kɛlaw",
  },
  compositions_texte: {
    Français: "Compostions",
    Anglais: "Compositions",
    Bambara: "Ɲɔngɔndan labɛn yɔrɔ",
  },
  bulletins_texte: {
    Français: "Bulletins",
    Anglais: "Report Cards",
    Bambara: "Ɲɔngɔndanw kunnafoniw",
  },
  listes_texte: {
    Français: "Listes",
    Anglais: "Lists",
    Bambara: "Lisiw",
  },
  finance_texte: {
    Français: "Finance",
    Anglais: "Finance",
    Bambara: "Wari kow",
  },
  depenses_texte: {
    Français: "Depenses",
    Anglais: "Expenses",
    Bambara: "Wari bɔtaw",
  },
  analytics_texte: {
    Français: "Analytics",
    Anglais: "Analytics",
    Bambara: "Jabiw",
  },
  database_texte: {
    Français: "Database",
    Anglais: "Database",
    Bambara: "Kunnafoni marayɔrɔ",
  },
  read_texte: {
    Français: "Read",
    Anglais: "Read",
    Bambara: "Gafe Kalan",
  },
  accueil_texte: {
    Français: "Accueil",
    Anglais: "Home",
    Bambara: "So",
  },
  settings_texte: {
    Français: "Settings",
    Anglais: "Settings",
    Bambara: "Paramɛtiri",
  },
  theme_texte: {
    Français: "Theme",
    Anglais: "Theme",
    Bambara: "Tɛmu",
  },
  school_name_texte: {
    Français: "School Name",
    Anglais: "School Name",
    Bambara: "Lakɔli tɔgɔ",
  },
  short_name_texte: {
    Français: "Short Name",
    Anglais: "Short Name",
    Bambara: "Tɔgɔ surun",
  },
  save_texte: {
    Français: "Save",
    Anglais: "Save",
    Bambara: "A marayɔrɔ",
  },
  cancel_texte: {
    Français: "Cancel",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },

  // PositionForm translations
  edit_position: {
    Français: "Modifier le poste",
    Anglais: "Edit Position",
    Bambara: "Baara yɔrɔ yɛlɛma",
  },
  add_new_position: {
    Français: "Ajouter un nouveau poste",
    Anglais: "Add New Position",
    Bambara: "Baara yɔrɔ kura fara",
  },
  position_name: {
    Français: "Nom du poste",
    Anglais: "Position Name",
    Bambara: "Baara yɔrɔ tɔgɔ",
  },
  position_name_required: {
    Français: "Le nom du poste est obligatoire",
    Anglais: "Position name is required",
    Bambara: "Baara yɔrɔ tɔgɔ ka kan ka sɛbɛn",
  },
  name_min_length: {
    Français: "Le nom doit contenir au moins 3 caractères",
    Anglais: "Name must contain at least 3 characters",
    Bambara: "Tɔgɔ ka kan ka sɛbɛnni 3 dɔɔni kɛ",
  },
  name_max_length: {
    Français: "Le nom ne doit pas dépasser 60 caractères",
    Anglais: "Name must not exceed 60 characters",
    Bambara: "Tɔgɔ man kan ka tɛmɛ sɛbɛnni 60 kan",
  },
  description: {
    Français: "Description",
    Anglais: "Description",
    Bambara: "Kunnafoni",
  },
  description_max_length: {
    Français: "La description ne doit pas dépasser 1000 caractères",
    Anglais: "Description must not exceed 1000 characters",
    Bambara: "Kunnafoni man kan ka tɛmɛ sɛbɛnni 1000 kan",
  },
  professors_position_rename_error: {
    Français: "Le poste 'Professeurs' ne peut pas être renommé",
    Anglais: "The 'Professors' position cannot be renamed",
    Bambara: "'Karamɔgɔw' baara yɔrɔ tɔgɔ tɛ se ka yɛlɛma",
  },
  error_occurred: {
    Français: "Une erreur s'est produite",
    Anglais: "An error occurred",
    Bambara: "Fili dɔ kɛra",
  },
  position_description: {
    Français: "Décrivez les responsabilités et les tâches du poste",
    Anglais: "Describe the responsibilities and tasks of the position",
    Bambara: "Baara yɔrɔ dɔnniya ni a baara kɛtaw ɲɛfɔ",
  },
  preview: {
    Français: "Aperçu",
    Anglais: "Preview",
    Bambara: "Fileli",
  },
  description_limit: {
    Français: "Limite de 1000 caractères",
    Anglais: "1000 character limit",
    Bambara: "Sɛbɛnni 1000 dan",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabila",
  },
  update: {
    Français: "Mettre à jour",
    Anglais: "Update",
    Bambara: "A kɔnɔ kunnafoni kura",
  },
  add: {
    Français: "Ajouter",
    Anglais: "Add",
    Bambara: "A fara",
  },
  traitement_loading: {
    Français: "Traitement...",
    Anglais: "Processing...",
    Bambara: "Baara bɛ kɛ kan...",
  },
};

// Function to translate a key into the specified language
export const translate = (key, language) => {
  // Default to French if language is not specified
  const lang = language || "Français";

  // Check if the key exists in our translations
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }

  // If the key or language doesn't exist, return the key itself as fallback
  // or the French translation as a second fallback
  return translations[key]?.Français || key;
};
