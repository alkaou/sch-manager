// Translator for informations components
const translations = {
  // Page titles
  informations_title: {
    Français: "Informations",
    Anglais: "News & Updates",
    Bambara: "Kunafoniw",
  },
  back_button: {
    Français: "Retour",
    Anglais: "Back",
    Bambara: "Segin",
  },
  
  // Loading and empty states
  loading_informations: {
    Français: "Chargement des informations...",
    Anglais: "Loading informations...",
    Bambara: "Kunafoniw ka don...",
  },
  no_informations_available: {
    Français: "Aucune information disponible pour le moment. Revenez plus tard pour découvrir les dernières actualités et mises à jour.",
    Anglais: "No information available at the moment. Come back later to discover the latest news and updates.",
    Bambara: "Kunafoni si tɛ yen sisan. Segin kɔfɛ walasa ka kunnafoni kuraw ye.",
  },
  
  // Information card elements
  published_on: {
    Français: "Publié le",
    Anglais: "Published on",
    Bambara: "A bɔra",
  },
  contact_info: {
    Français: "Contact",
    Anglais: "Contact",
    Bambara: "Joginni",
  },
  read_more: {
    Français: "Lire plus",
    Anglais: "Read more",
    Bambara: "Kalan ka tɛmɛ",
  },
  read_less: {
    Français: "Lire moins",
    Anglais: "Read less",
    Bambara: "Kalan dɔgɔya",
  },
  
  // Media elements
  image_alt: {
    Français: "Image de l'information",
    Anglais: "Information image",
    Bambara: "Kunafoni ja",
  },
  video_not_supported: {
    Français: "Votre navigateur ne supporte pas la lecture vidéo.",
    Anglais: "Your browser does not support video playback.",
    Bambara: "I ka navigateur tɛ video lajɛ dɛmɛ.",
  },
  
  // Error messages
  error_loading: {
    Français: "Erreur lors du chargement des informations",
    Anglais: "Error loading informations",
    Bambara: "Fili ye kɛ kunafoniw ka don na",
  },
  retry_button: {
    Français: "Réessayer",
    Anglais: "Retry",
    Bambara: "Segin kɛ",
  },
  
  // Notification messages
  new_information_available: {
    Français: "Nouvelle information disponible",
    Anglais: "New information available",
    Bambara: "Kunafoni kura bɛ yen",
  },
  view_new_information: {
    Français: "Voir les nouvelles informations",
    Anglais: "View new information",
    Bambara: "Kunafoni kuraw lajɛ",
  },
  
  // Date formatting
  date_format: {
    Français: "dd/MM/yyyy",
    Anglais: "MM/dd/yyyy",
    Bambara: "dd/MM/yyyy",
  },
  
  // Search and filter
  search_placeholder: {
    Français: "Rechercher dans les informations...",
    Anglais: "Search in informations...",
    Bambara: "Ɲini kunafoniw kɔnɔ...",
  },
  filter_by_date: {
    Français: "Filtrer par date",
    Anglais: "Filter by date",
    Bambara: "Ɲɛnabɔ don ma",
  },
  sort_newest_first: {
    Français: "Plus récent d'abord",
    Anglais: "Newest first",
    Bambara: "Kura fɔlɔ",
  },
  sort_oldest_first: {
    Français: "Plus ancien d'abord",
    Anglais: "Oldest first",
    Bambara: "Kɔrɔ fɔlɔ",
  },
};

// Function to get translation
export const translate = (key, language = "Français") => {
  return translations[key]?.[language] || translations[key]?.["Français"] || key;
};

export default translations;