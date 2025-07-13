const translations = {
    help: {
        Français: "Aide",
        Anglais: "Help",
        Bambara: "Dɛmɛ",
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
