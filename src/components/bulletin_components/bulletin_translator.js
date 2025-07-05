const translations = {
  success_bulletin_success: {
    Français: "Bulletin supprimé avec succès !",
    Anglais: "Bulletin deleted successfully !",
    Bambara: "ɲɔngɔndan sɛbɛn jɔsila ni ɲɛtaa ye !",
  },
};

// Translation helper
export const translate = (key, language) => {
  if (!translations[key]) return key;
  return translations[key][language] || translations[key]["Français"];
};
export default translations;
