const translations = {
  // Titres du menu des statistiques
  stats_title: {
    Français: "Statistiques",
    Anglais: "Statistics",
    Bambara: "Jatebɔlanw",
  },
  students_stats: {
    Français: "Élèves",
    Anglais: "Students",
    Bambara: "Kalandenw",
  },
  staff_stats: {
    Français: "Personnel",
    Anglais: "Staff",
    Bambara: "Baarakɛlaw",
  },
  finance_stats: {
    Français: "Finances",
    Anglais: "Finances",
    Bambara: "Wariko",
  },
  classes_stats: {
    Français: "Classes",
    Anglais: "Classes",
    Bambara: "Kalasow",
  },
  exams_stats: {
    Français: "Examens",
    Anglais: "Exams",
    Bambara: "Kɔnɔkow",
  },

  // Contenu principal
  no_stats_available: {
    Français: "Aucune statistique disponible pour l'option choisie pour l'instant.",
    Anglais: "No statistics available for the selected option at the moment.",
    Bambara: "Jatebɔlan si tɛ yen nin sugandili in na sisan.",
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

export default translations;
