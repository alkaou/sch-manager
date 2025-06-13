// auth_translator.js
const translations = {
  // LoginModal.jsx
  "login_to_school_manager": {
    "Français": "Connexion à School Manager",
    "Anglais": "Login to School Manager",
    "Bambara": "School Manager ka don kɛcogo"
  },
  "sign_in_to_access": {
    "Français": "Connectez-vous pour accéder aux fonctionnalités premium et synchroniser vos données entre appareils",
    "Anglais": "Sign in to access premium features and sync your data across devices",
    "Bambara": "I ka don walasa ka premium fɛɛrɛw sɔrɔ ani ka i ka kunnafoniw sabati i ka minɛnw kan"
  },
  "signing_in": {
    "Français": "Connexion en cours...",
    "Anglais": "Signing in...",
    "Bambara": "Don kɛla..."
  },
  "sign_in_with_google": {
    "Français": "Se connecter avec Google",
    "Anglais": "Sign in with Google",
    "Bambara": "I don ni Google ye"
  },
  "terms_agreement": {
    "Français": "En vous connectant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité",
    "Anglais": "By signing in, you agree to our Terms of Service and Privacy Policy",
    "Bambara": "Ni i donna, i sɔnna an ka Sariya ni an ka Gundo mara Sariyaw ma"
  },
  
  // AuthProvider.jsx
  "connection_error": {
    "Français": "Veuillez s'il vous plaît vérifier votre connexion internet !",
    "Anglais": "Please check your internet connection!",
    "Bambara": "I ka i ka internɛti josiraw lajɛ!"
  },
  "login_error": {
    "Français": "Erreur lors de la connexion",
    "Anglais": "Error while logging in",
    "Bambara": "Fili don kɛli la"
  },
  "logout_error": {
    "Français": "Erreur lors de la déconnexion !",
    "Anglais": "Error while logging out!",
    "Bambara": "Fili bɔli la!"
  },
  
  // PremiumModal.jsx
  "upgrade_to_premium": {
    "Français": "Passer à la version Premium",
    "Anglais": "Upgrade to Premium",
    "Bambara": "Premium version ka don"
  },
  "unlock_all_features": {
    "Français": "Débloquez toutes les fonctionnalités et amenez votre gestion d'école au niveau supérieur",
    "Anglais": "Unlock all features and take your school management to the next level",
    "Bambara": "Fɛɛrɛ bɛɛ dayɛlɛ ani i ka lakɔli ɲɛtaa ka se hakɛ wɛrɛ ma"
  },
  "authentication_required": {
    "Français": "Authentification requise",
    "Anglais": "Authentication Required",
    "Bambara": "Don kɛcogo nafa lo"
  },
  "login_before_subscribing": {
    "Français": "Vous devez vous connecter avant de souscrire aux fonctionnalités premium.",
    "Anglais": "You need to log in before subscribing to premium features.",
    "Bambara": "I ka kan ka i don sani i ka premium fɛɛrɛw san."
  },
  "monthly": {
    "Français": "Mensuel",
    "Anglais": "Monthly",
    "Bambara": "Kalo o kalo"
  },
  "quarterly": {
    "Français": "Trimestriel",
    "Anglais": "Quarterly",
    "Bambara": "Kalo saba o saba"
  },
  "yearly": {
    "Français": "Annuel",
    "Anglais": "Yearly",
    "Bambara": "San o san"
  },
  "fcfa_month": {
    "Français": "FCFA / mois",
    "Anglais": "FCFA / month",
    "Bambara": "FCFA / kalo"
  },
  "fcfa_3months": {
    "Français": "FCFA / 3 mois",
    "Anglais": "FCFA / 3 months",
    "Bambara": "FCFA / kalo 3"
  },
  "fcfa_year": {
    "Français": "FCFA / an",
    "Anglais": "FCFA / year",
    "Bambara": "FCFA / san"
  },
  "all_premium_features": {
    "Français": "Toutes les fonctionnalités premium",
    "Anglais": "All premium features",
    "Bambara": "Premium fɛɛrɛw bɛɛ"
  },
  "priority_support": {
    "Français": "Support prioritaire",
    "Anglais": "Priority support",
    "Bambara": "Dɛmɛ teliman"
  },
  "cloud_backup": {
    "Français": "Sauvegarde dans le cloud",
    "Anglais": "Cloud backup",
    "Bambara": "Kunnafoni marali sankolo la"
  },
  "advanced_analytics": {
    "Français": "Analyses avancées",
    "Anglais": "Advanced analytics",
    "Bambara": "Sɛgɛsɛgɛli kɔrɔtalen"
  },
  "savings_monthly_20": {
    "Français": "20% d'économie par rapport au mensuel",
    "Anglais": "20% savings compared to monthly",
    "Bambara": "20% mɔgɔyali kalo o kalo ta la"
  },
  "savings_monthly_25": {
    "Français": "25% d'économie par rapport au mensuel",
    "Anglais": "25% savings compared to monthly",
    "Bambara": "25% mɔgɔyali kalo o kalo ta la"
  },
  "cancel": {
    "Français": "Annuler",
    "Anglais": "Cancel",
    "Bambara": "A dabila"
  },
  "subscribe_now": {
    "Français": "S'abonner maintenant",
    "Anglais": "Subscribe Now",
    "Bambara": "I ka i sɛbɛn sisan"
  },
  "subscription_initiated": {
    "Français": "Abonnement initié",
    "Anglais": "Subscription Initiated",
    "Bambara": "Sɛbɛnni daminɛna"
  },
  "subscription_message": {
    "Français": "Abonnement au forfait {plan} initié. Ceci se connecterait à un processeur de paiement en production.",
    "Anglais": "Subscription to {plan} plan initiated. This would connect to a payment processor in production.",
    "Bambara": "{plan} sɛbɛnni daminɛna. Nin bɛna ɲɛsin sara kɛcogo ma yɛrɛta kɛli senfɛ."
  },
  
  // UserProfile.jsx
  "not_logged_in": {
    "Français": "Non connecté",
    "Anglais": "Not Logged In",
    "Bambara": "I ma don"
  },
  "please_login": {
    "Français": "Veuillez vous connecter pour voir votre profil",
    "Anglais": "Please log in to view your profile",
    "Bambara": "I ka don walasa ka i ka profile lajɛ"
  },
  "back_to_home": {
    "Français": "Retour à l'accueil",
    "Anglais": "Back to Home",
    "Bambara": "Segin so kɔnɔ"
  },
  "premium_member": {
    "Français": "Membre Premium",
    "Anglais": "Premium Member",
    "Bambara": "Premium tɔnden"
  },
  "email": {
    "Français": "Email",
    "Anglais": "Email",
    "Bambara": "Email"
  },
  "user_id": {
    "Français": "ID Utilisateur",
    "Anglais": "User ID",
    "Bambara": "Tɔgɔ dalen ID"
  },
  "logging_out": {
    "Français": "Déconnexion en cours...",
    "Anglais": "Logging out...",
    "Bambara": "Bɔli kɛla..."
  },
  "logout": {
    "Français": "Déconnexion",
    "Anglais": "Logout",
    "Bambara": "Bɔli kɛ"
  },
  
  // FirebaseService.js
  "login_account_error": {
    "Français": "Erreur lors de la connexion à votre compte !",
    "Anglais": "Error connecting to your account!",
    "Bambara": "Fili i ka compte donli la!"
  },
  "logout_firebase_error": {
    "Français": "Erreur lors de la déconnexion !",
    "Anglais": "Error while logging out!",
    "Bambara": "Fili bɔli la!"
  }
};

export default translations; 