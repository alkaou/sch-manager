/**
 * Traductions pour le système de contact
 * Développé pour SchoolManager (Entreprise Malienne)
 */

const translations = {
  // Messages de validation
  name_required: {
    Français: "Le nom est requis",
    Anglais: "Name is required",
    Bambara: "Tɔgɔ ka kan",
  },
  name_invalid: {
    Français: "Le nom doit contenir uniquement des lettres (3-50 caractères)",
    Anglais: "Name must contain only letters (3-50 characters)",
    Bambara: "Tɔgɔ ka kan ka kɛ ni sɛbɛnni dɔrɔn ye (3-50 sɛbɛnni)",
  },
  email_required: {
    Français: "L'adresse e-mail est requise",
    Anglais: "Email address is required",
    Bambara: "Email adirɛsi ka kan",
  },
  email_invalid: {
    Français: "Veuillez saisir une adresse e-mail valide",
    Anglais: "Please enter a valid email address",
    Bambara: "Email adirɛsi ɲuman dɔ sɛbɛn",
  },
  subject_required: {
    Français: "Le sujet est requis",
    Anglais: "Subject is required",
    Bambara: "Barokun ka kan",
  },
  subject_invalid: {
    Français: "Le sujet doit contenir entre 3 et 255 caractères",
    Anglais: "Subject must be between 3 and 255 characters",
    Bambara: "Barokun ka kan ka kɛ sɛbɛnni 3 ni 255 cɛ",
  },
  message_required: {
    Français: "Le message est requis",
    Anglais: "Message is required",
    Bambara: "Bataki ka kan",
  },
  message_too_short: {
    Français: "Le message doit contenir au moins 30 caractères",
    Anglais: "Message must be at least 30 characters long",
    Bambara: "Bataki ka kan ka kɛ sɛbɛnni 30 ye ka tɛmɛ",
  },
  message_too_long: {
    Français: "Le message ne peut pas dépasser 10 000 caractères",
    Anglais: "Message cannot exceed 10,000 characters",
    Bambara: "Bataki tɛ se ka tɛmɛ sɛbɛnni 10,000 kan",
  },

  // Messages de succès
  message_sent_success: {
    Français:
      "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
    Anglais:
      "Your message has been sent successfully! We will respond to you as soon as possible.",
    Bambara: "I ka bataki ci ka ɲɛ! An bɛna i jaabi joona.",
  },

  // Messages d'erreur système
  sending_error: {
    Français: "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
    Anglais: "An error occurred while sending. Please try again.",
    Bambara: "Fili dɔ kɛra ci waati. Aw ye a lajɛ kokura.",
  },
  network_error: {
    Français: "Erreur de connexion. Vérifiez votre connexion internet.",
    Anglais: "Connection error. Check your internet connection.",
    Bambara: "Jɔli fili. Aw ye aw ka ɛntɛrinɛti jɔli lajɛ.",
  },
  spam_protection: {
    Français: "Veuillez attendre avant d'envoyer un autre message.",
    Anglais: "Please wait before sending another message.",
    Bambara: "Aw ye makɔnɔ sani aw ka bataki wɛrɛ ci.",
  },

  // Messages d'interface
  sending: {
    Français: "Envoi en cours...",
    Anglais: "Sending...",
    Bambara: "Ci bɛ kɛ...",
  },
  send_message_btn: {
    Français: "Envoyer le message",
    Anglais: "Send message",
    Bambara: "Bataki ci",
  },

  // Validation en temps réel
  field_valid: {
    Français: "Valide",
    Anglais: "Valid",
    Bambara: "A bɛ ɲɛ",
  },
  field_invalid: {
    Français: "Invalide",
    Anglais: "Invalid",
    Bambara: "A tɛ ɲɛ",
  },

  // Compteurs de caractères
  characters_remaining: {
    Français: "caractères restants",
    Anglais: "characters remaining",
    Bambara: "sɛbɛnni tɔlen",
  },
  characters_over_limit: {
    Français: "caractères en trop",
    Anglais: "characters over limit",
    Bambara: "sɛbɛnni caman",
  },
  message_sended_info: {
    Français: "Message envoyé !",
    Anglais: "Message sent !",
    Bambara: "I ka cikan lase la !",
  },

  // Messages pour la newsletter
  email_already_subscribed: {
    Français: "Cet email est déjà abonné à notre newsletter.",
    Anglais: "This email is already subscribed to our newsletter.",
    Bambara: "Nin email in donna ka ban.",
  },
  newsletter_subscription_success: {
    Français:
      "Merci de votre inscription à notre newsletter ! Vous recevrez nos dernières actualités.",
    Anglais:
      "Thank you for subscribing to our newsletter! You will receive our latest updates.",
    Bambara:
      "I ni ce an ka kunnafonidilanw la ! I bɛna an ka kunnafoni koraw sɔrɔ i ka email fɛ.",
  },
  newsletter_subscription_error: {
    Français:
      "Une erreur s'est produite lors de l'inscription à la newsletter.",
    Anglais: "An error occurred while subscribing to the newsletter.",
    Bambara: "Fili dɔ kɛra kunnafonidilanw la don waati.",
  },
  newsletter_invalid_email: {
    Français: "Veuillez entrer une adresse email valide pour vous abonner.",
    Anglais: "Please enter a valid email address to subscribe.",
    Bambara: "Email adirɛsi ɲuman dɔ sɛbɛn ka don.",
  },
  newsletter_subscribing: {
    Français: "Inscription en cours...",
    Anglais: "Subscribing...",
    Bambara: "Don bɛ kɛ...",
  },
};

/**
 * Fonction pour traduire une clé dans la langue spécifiée
 * @param {string} key - Clé de traduction
 * @param {string} language - Langue cible (Français, Anglais, Bambara)
 * @returns {string} - Texte traduit
 */
export const translate = (key, language) => {
  const lang = language || "Français";

  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }

  // Fallback vers le français puis la clé elle-même
  return translations[key]?.Français || key;
};

export default translations;
