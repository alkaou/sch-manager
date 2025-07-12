// auth_translator.js
const translations = {
  // LoginModal.jsx
  login_to_school_manager: {
    Français: "Connexion à School Manager",
    Anglais: "Login to School Manager",
    Bambara: "Ka don School Manager kɔnɔ",
  },
  sign_in_to_access: {
    Français:
      "Connectez-vous pour accéder aux fonctionnalités premium et synchroniser vos données entre appareils",
    Anglais:
      "Sign in to access premium features and sync your data across devices",
    Bambara:
      "Ka don walasa ka premium nafa sɔrɔ ani ka i ka kunnafoniw sɛgɛsɛgɛ i ka minɛnw cɛma",
  },
  signing_in: {
    Français: "Connexion en cours...",
    Anglais: "Signing in...",
    Bambara: "Ka don kɛra...",
  },
  sign_in_with_google: {
    Français: "Se connecter avec Google",
    Anglais: "Sign in with Google",
    Bambara: "Ka don ni Google ye",
  },
  terms_agreement: {
    Français:
      "En vous connectant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité?",
    Anglais:
      "By signing in, you agree to our Terms of Service and Privacy Policy?",
    Bambara:
      "Ni i donna, i bɛ sɔn an ka Sariyaw ni Gundo Marali Sariyaw ma wa?",
  },

  // AuthProvider.jsx
  connection_error: {
    Français: "Veuillez s'il vous plaît vérifier votre connexion internet !",
    Anglais: "Please check your internet connection!",
    Bambara: "I ka internɛti sɛgɛsɛgɛ!",
  },
  login_error: {
    Français: "Erreur lors de la connexion",
    Anglais: "Error while logging in",
    Bambara: "Fili kɛra donni senfɛ",
  },
  logout_error: {
    Français: "Erreur lors de la déconnexion !",
    Anglais: "Error while logging out!",
    Bambara: "Fili kɛra bɔli senfɛ!",
  },

  // PremiumModal.jsx
  upgrade_to_premium: {
    Français: "Passer à la version Premium",
    Anglais: "Upgrade to Premium",
    Bambara: "Ka yɛlɛma ka kɛ Premium ye",
  },
  unlock_all_features: {
    Français:
      "Débloquez toutes les fonctionnalités et amenez votre gestion d'école au niveau supérieur",
    Anglais:
      "Unlock all features and take your school management to the next level",
    Bambara: "Ka nafa bɛɛ dayɛlɛ ani ka i ka lakɔli ɲɛmɔgɔya kɔrɔta",
  },
  authentication_required: {
    Français: "Authentification requise",
    Anglais: "Authentication Required",
    Bambara: "Ka i yɛrɛ jira ko nafa lo",
  },
  login_before_subscribing: {
    Français:
      "Vous devez vous connecter avant de souscrire aux fonctionnalités premium.",
    Anglais: "You need to log in before subscribing to premium features.",
    Bambara: "I ka kan ka don fɔlɔ sani ka premium nafaw sɔrɔ.",
  },
  monthly: {
    Français: "Mensuel",
    Anglais: "Monthly",
    Bambara: "Kalo kelen",
  },
  quarterly: {
    Français: "Trimestriel",
    Anglais: "Quarterly",
    Bambara: "Kalo saba",
  },
  yearly: {
    Français: "Annuel",
    Anglais: "Yearly",
    Bambara: "San kelen",
  },
  fcfa_month: {
    Français: "FCFA / mois",
    Anglais: "FCFA / month",
    Bambara: "FCFA / kalo kelen",
  },
  fcfa_3months: {
    Français: "FCFA / 3 mois",
    Anglais: "FCFA / 3 months",
    Bambara: "FCFA / kalo saba",
  },
  fcfa_year: {
    Français: "FCFA / an",
    Anglais: "FCFA / year",
    Bambara: "FCFA / san kelen",
  },
  all_premium_features: {
    Français: "Toutes les fonctionnalités premium",
    Anglais: "All premium features",
    Bambara: "Premium nafa bɛɛ",
  },
  priority_support: {
    Français: "Support prioritaire",
    Anglais: "Priority support",
    Bambara: "Dɛmɛ joona joona",
  },
  cloud_backup: {
    Français: "Sauvegarde dans le cloud",
    Anglais: "Cloud backup",
    Bambara: "Ka kunnafoniw mara sanfɛ",
  },
  advanced_analytics: {
    Français: "Analyses avancées",
    Anglais: "Advanced analytics",
    Bambara: "Sɛgɛsɛgɛli dafalen",
  },
  savings_monthly_20: {
    Français: "20% d'économie par rapport au mensuel",
    Anglais: "20% savings compared to monthly",
    Bambara: "20% dɔgɔya ka taa kalo kelen sara kan",
  },
  savings_monthly_25: {
    Français: "25% d'économie par rapport au mensuel",
    Anglais: "25% savings compared to monthly",
    Bambara: "25% dɔgɔya ka taa kalo kelen sara kan",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "Ka dabila",
  },
  subscribe_now: {
    Français: "S'abonner maintenant",
    Anglais: "Subscribe Now",
    Bambara: "Ka tɔgɔ sɛbɛn sisan",
  },
  subscription_initiated: {
    Français: "Abonnement initié",
    Anglais: "Subscription Initiated",
    Bambara: "Tɔgɔ sɛbɛnni daminɛna",
  },
  subscription_message: {
    Français:
      "Abonnement au forfait {plan} initié. Ceci se connecterait à un processeur de paiement en production.",
    Anglais:
      "Subscription to {plan} plan initiated. This would connect to a payment processor in production.",
    Bambara:
      "{plan} tɔgɔ sɛbɛnni daminɛna. Nin bɛna ɲɛsin wari sara cogoya ma baara kɛli waati.",
  },

  // UserProfile.jsx
  not_logged_in: {
    Français: "Non connecté",
    Anglais: "Not Logged In",
    Bambara: "I ma don fɔlɔ",
  },
  please_login: {
    Français: "Veuillez vous connecter pour voir votre profil",
    Anglais: "Please log in to view your profile",
    Bambara: "I ka don walasa ka i ka kunnafoni lajɛ",
  },
  back_to_home: {
    Français: "Retour à l'accueil",
    Anglais: "Back to Home",
    Bambara: "Ka segin so",
  },
  premium_member: {
    Français: "Membre Premium",
    Anglais: "Premium Member",
    Bambara: "Premium jɛkulu mɔgɔ",
  },
  email: {
    Français: "Email",
    Anglais: "Email",
    Bambara: "Imɛli",
  },
  user_id: {
    Français: "ID Utilisateur",
    Anglais: "User ID",
    Bambara: "Baara kɛla nimɛro",
  },
  logging_out: {
    Français: "Déconnexion en cours...",
    Anglais: "Logging out...",
    Bambara: "Ka bɔ kɛra...",
  },
  logout: {
    Français: "Déconnexion",
    Anglais: "Logout",
    Bambara: "Ka bɔ",
  },

  // FirebaseService.js
  login_account_error: {
    Français: "Erreur lors de la connexion à votre compte !",
    Anglais: "Error connecting to your account!",
    Bambara: "Fili kɛra i ka compte donni na!",
  },
  logout_firebase_error: {
    Français: "Erreur lors de la déconnexion !",
    Anglais: "Error while logging out!",
    Bambara: "Fili kɛra bɔli waati!",
  },
};

export default translations;
