// Translator for Payements management system
const translations = {
  // General
  payment_configuration: {
    Français: "Configuration des Paiements",
    Anglais: "Payments Configuration",
    Bambara: "Kalosarakow ka Labɛnni",
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
