const translations = {
    // Interface générale
    fatoumata_title: {
        Français: "Fatoumata - Assistant IA",
        Anglais: "Fatoumata - AI Assistant",
        Bambara: "Fatoumata - IA Dɛmɛbaga",
    },
    welcome_message: {
        Français: "Bonjour ! Je suis Fatoumata, votre assistante IA spécialisée dans la gestion d'établissements scolaires. Comment puis-je vous aider aujourd'hui ?",
        Anglais: "Hello! I'm Fatoumata, your AI assistant specialized in school management. How can I help you today?",
        Bambara: "I ni ce! N ye Fatoumata ye, i ka IA dɛmɛbaga min bɛ lakɔli jɔyɔrɔ ɲɛnabɔli la. N bɛ se ka i dɛmɛ cogo min na bi?",
    },
    
    // Sidebar
    new_chat: {
        Français: "Nouveau chat",
        Anglais: "New chat",
        Bambara: "Kuma kura",
    },
    ephemeral_chat: {
        Français: "Chat éphémère",
        Anglais: "Ephemeral chat",
        Bambara: "Kuma teliya",
    },
    chat_history: {
        Français: "Historique des chats",
        Anglais: "Chat history",
        Bambara: "Kuma tariku",
    },
    delete_chat: {
        Français: "Supprimer ce chat",
        Anglais: "Delete this chat",
        Bambara: "Nin kuma bɔ",
    },
    delete_all_chats: {
        Français: "Supprimer tous les chats",
        Anglais: "Delete all chats",
        Bambara: "Kuma bɛɛ bɔ",
    },
    confirm_delete: {
        Français: "Êtes-vous sûr de vouloir supprimer ?",
        Anglais: "Are you sure you want to delete?",
        Bambara: "I da a la ko i b'a fɛ ka bɔ?",
    },
    
    // Input et actions
    input_placeholder: {
        Français: "Tapez votre message... (Entrée pour envoyer, Ctrl+Entrée pour nouvelle ligne)",
        Anglais: "Type your message... (Enter to send, Ctrl+Enter for new line)",
        Bambara: "I ka bataki sɛbɛn... (Enter walasa ka ci, Ctrl+Enter walasa ka layini kura kɛ)",
    },
    send_message: {
        Français: "Envoyer le message",
        Anglais: "Send message",
        Bambara: "Bataki ci",
    },
    stop_generation: {
        Français: "Arrêter la génération",
        Anglais: "Stop generation",
        Bambara: "Dabɔli jɔ",
    },
    attach_file: {
        Français: "Joindre un fichier",
        Anglais: "Attach file",
        Bambara: "Sɛbɛn fara a kan",
    },
    
    // Actions sur les messages
    copy_message: {
        Français: "Copier le message",
        Anglais: "Copy message",
        Bambara: "Bataki kopi kɛ",
    },
    read_aloud: {
        Français: "Lire à haute voix",
        Anglais: "Read aloud",
        Bambara: "Kalan ka kɔrɔ",
    },
    regenerate_response: {
        Français: "Régénérer la réponse",
        Anglais: "Regenerate response",
        Bambara: "Jaabi kura dabɔ",
    },
    message_copied: {
        Français: "Message copié !",
        Anglais: "Message copied!",
        Bambara: "Bataki kopi kɛra!",
    },
    
    // États et messages système
    thinking: {
        Français: "Fatoumata réfléchit...",
        Anglais: "Fatoumata is thinking...",
        Bambara: "Fatoumata bɛ miiri la...",
    },
    analyzing_file: {
        Français: "Analyse du fichier en cours...",
        Anglais: "Analyzing file...",
        Bambara: "Sɛbɛn sɛgɛsɛgɛli bɛ kɛ...",
    },
    fetching_data: {
        Français: "Récupération des données...",
        Anglais: "Fetching data...",
        Bambara: "Kunnafoniw bɛ ta...",
    },
    processing_request: {
        Français: "Traitement de votre demande...",
        Anglais: "Processing your request...",
        Bambara: "I ka ɲinini bɛ baara la...",
    },
    
    // Erreurs
    error_occurred: {
        Français: "Une erreur s'est produite",
        Anglais: "An error occurred",
        Bambara: "Fili dɔ kɛra",
    },
    network_error: {
        Français: "Erreur de connexion réseau",
        Anglais: "Network connection error",
        Bambara: "Rezɔ jɔli fili",
    },
    file_too_large: {
        Français: "Le fichier est trop volumineux",
        Anglais: "File is too large",
        Bambara: "Sɛbɛn ka bon kosɛbɛ",
    },
    unsupported_file: {
        Français: "Type de fichier non supporté",
        Anglais: "Unsupported file type",
        Bambara: "Sɛbɛn suguya min tɛ dɛmɛ",
    },
    
    // Aide
    help: {
        Français: "Aide",
        Anglais: "Help",
        Bambara: "Dɛmɛ",
    },
    help_title: {
        Français: "Comment utiliser Fatoumata ?",
        Anglais: "How to use Fatoumata?",
        Bambara: "Fatoumata bɛ baara kɛ cogo min na?",
    },
    help_intro: {
        Français: "Fatoumata est votre assistante IA spécialisée dans la gestion d'établissements scolaires. Elle peut vous aider avec :",
        Anglais: "Fatoumata is your AI assistant specialized in school management. She can help you with:",
        Bambara: "Fatoumata ye i ka IA dɛmɛbaga ye min bɛ lakɔli jɔyɔrɔ ɲɛnabɔli la. A bɛ se ka i dɛmɛ ninnu na:",
    },
    help_features: {
        Français: [
            "📊 Analyse des données de votre établissement",
            "👥 Gestion des étudiants et du personnel",
            "📈 Statistiques et rapports",
            "💰 Suivi des paiements et finances",
            "📋 Création de listes et bulletins",
            "📁 Analyse de documents (PDF, DOCX, images)",
            "🔍 Recherche d'informations spécifiques",
            "💡 Conseils et recommandations"
        ],
        Anglais: [
            "📊 Analysis of your institution's data",
            "👥 Student and staff management",
            "📈 Statistics and reports",
            "💰 Payment and finance tracking",
            "📋 Creating lists and bulletins",
            "📁 Document analysis (PDF, DOCX, images)",
            "🔍 Searching for specific information",
            "💡 Tips and recommendations"
        ],
        Bambara: [
            "📊 I ka jɔyɔrɔ kunnafoniw sɛgɛsɛgɛli",
            "👥 Kalandenw ni baarakɛlaw ɲɛnabɔli",
            "📈 Jatebɔsɛbɛnw ni rapɔrw",
            "💰 Sarali ni wariko nɔfɛkɔlɔli",
            "📋 Lisɛriw ni bɔlɛtɛnw dabɔli",
            "📁 Sɛbɛnw sɛgɛsɛgɛli (PDF, DOCX, ja)",
            "🔍 Kunnafoni kɛrɛnkɛrɛnnenw ɲinini",
            "💡 Ladilikanw ni laadilikanw"
        ],
    },
    help_shortcuts: {
        Français: "Raccourcis clavier :",
        Anglais: "Keyboard shortcuts:",
        Bambara: "Bɔlɔkɛnɛma surunw:",
    },
    help_shortcuts_list: {
        Français: [
            "Entrée : Envoyer le message",
            "Ctrl + Entrée : Nouvelle ligne",
            "Échap : Fermer les popups"
        ],
        Anglais: [
            "Enter: Send message",
            "Ctrl + Enter: New line",
            "Escape: Close popups"
        ],
        Bambara: [
            "Enter: Bataki ci",
            "Ctrl + Enter: Layini kura",
            "Escape: Popup datugu"
        ],
    },
    close: {
        Français: "Fermer",
        Anglais: "Close",
        Bambara: "Datugu",
    },
    
    // Fichiers supportés
    supported_files: {
        Français: "Fichiers supportés : PDF, DOCX, DOC, TXT, Images (PNG, JPG, JPEG)",
        Anglais: "Supported files: PDF, DOCX, DOC, TXT, Images (PNG, JPG, JPEG)",
        Bambara: "Sɛbɛn minnu bɛ dɛmɛ: PDF, DOCX, DOC, TXT, Jaw (PNG, JPG, JPEG)",
    },
    
    // Messages de confirmation
    yes: {
        Français: "Oui",
        Anglais: "Yes",
        Bambara: "Awɔ",
    },
    no: {
        Français: "Non",
        Anglais: "No",
        Bambara: "Ayi",
    },
    cancel: {
        Français: "Annuler",
        Anglais: "Cancel",
        Bambara: "Bɔli",
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
