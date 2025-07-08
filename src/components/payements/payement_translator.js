// Translator for Payements management system
const translations = {
  // General
  new_payment_system: {
    Français: "Nouveau Système de Paiement",
    Anglais: "New Payment System",
    Bambara: "Kalan Kalosaraw Ɲanabɔla Kura", //ɲ
  },
  edit_payment_system: {
    Français: "Modifier le système de paiement",
    Anglais: "Edit Payment System",
    Bambara: "Kalan kalosaraw ɲanabɔla yɛlɛma",
  },
  system_name: {
    Français: "Nom du système",
    Anglais: "System Name",
    Bambara: "Ɲanabɔla tɔgɔ",
  },
  monthly_fees: {
    Français: "Frais mensuels",
    Anglais: "Monthly Fees",
    Bambara: "Kalo kalosaraw",
  },
  registration_fees: {
    Français: "Frais d'inscription",
    Anglais: "Registration Fees",
    Bambara: "Tɔgɔsɛbɛn sara",
  },
  start_date: {
    Français: "Date de début",
    Anglais: "Start Date",
    Bambara: "Daminɛ tuma",
  },
  end_date: {
    Français: "Date de fin",
    Anglais: "End Date",
    Bambara: "Laban tuma",
  },
  associated_classes: {
    Français: "Classes associées",
    Anglais: "Associated Classes",
    Bambara: "Kalanso sugandilen",
  },
  classes_concerned: {
    Français: "Classes concernées",
    Anglais: "Classes Concerned",
    Bambara: "Kalanso sugandilen",
  },
  select_classes: {
    Français: "Sélectionner les classes",
    Anglais: "Select Classes",
    Bambara: "Kalanso sugandi",
  },
  no_class_available: {
    Français: "Aucune classe disponible",
    Anglais: "No class available",
    Bambara: "Kalanso si tɛ yen",
  },
  additional_fees: {
    Français: "Frais supplémentaires",
    Anglais: "Additional Fees",
    Bambara: "Sara wɛrɛw",
  },
  fee_name: {
    Français: "Nom du frais",
    Anglais: "Fee Name",
    Bambara: "Sara tɔgɔ",
  },
  fee_amount: {
    Français: "Montant du frais",
    Anglais: "Fee Amount",
    Bambara: "Sara hakɛ",
  },
  currency_unit: {
    Français: "FCFA",
    Anglais: "FCFA",
    Bambara: "FCFA",
  },
  add_fee: {
    Français: "Ajouter un frais",
    Anglais: "Add Fee",
    Bambara: "Sara dɔ fara a kan",
  },
  estimated_annual_fee: {
    Français: "Frais annuel estimé",
    Anglais: "Estimated Annual Fee",
    Bambara: "San kɔnɔ sara hakɛ",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A dabla",
  },
  in_progress: {
    Français: "En cours...",
    Anglais: "In Progress...",
    Bambara: "A bɛ taama...",
  },
  save: {
    Français: "Enregistrer",
    Anglais: "Save",
    Bambara: "A mara",
  },
  payment_systems: {
    Français: "Systèmes de paiement",
    Anglais: "Payment Systems",
    Bambara: "Kalan kalosaraw ɲanabɔlaw",
  },
  add_new_system: {
    Français: "Ajouter un nouveau système",
    Anglais: "Add New System",
    Bambara: "Ɲanabɔla kura dɔ fara a kan",
  },
  active: {
    Français: "Actif",
    Anglais: "Active",
    Bambara: "A bɛ baara la",
  },
  inactive: {
    Français: "Inactif",
    Anglais: "Inactive",
    Bambara: "A tɛ baara la",
  },
  edit: {
    Français: "Modifier",
    Anglais: "Edit",
    Bambara: "A yɛlɛma",
  },
  delete: {
    Français: "Supprimer",
    Anglais: "Delete",
    Bambara: "A bin",
  },
  confirm_delete_title: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "A bin kɔlɔsili",
  },
  confirm_deletion: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm Deletion",
    Bambara: "A bin kɔlɔsili",
  },
  confirm_delete_payment_system_message: {
    Français:
      "Êtes-vous sûr de vouloir supprimer ce système de paiement ? Cette action est irréversible et supprimera également tous les paiements et frais d'inscription associés.",
    Anglais:
      "Are you sure you want to delete this payment system? This action is irreversible and will also delete all associated payments and registration fees.",
    Bambara:
      "I kɔnɔna ka jɛya ka kalan kalosaraw ɲanabɔla in bin wa? Nin tɛ se ka yɛlɛma tuguni, a bɛna kalosaraw ni tɔgɔsɛbɛn saraw bɛɛ bin.",
  },
  payment_configuration: {
    Français: "Configuration des Paiements",
    Anglais: "Payment Configuration",
    Bambara: "Kalosaraw ɲanabɔli",
  },
  system_name_placeholder: {
    Français: "Ex: Tarif standard 2024-2025",
    English: "Ex: Standard Rate 2024-2025",
    Bambara: "Misali: Saraw hakɛ 2024-2025",
  },
  end_date_before_start_date_error: {
    Français: "La date de fin ne peut pas être antérieure à la date de début.",
    Anglais: "End date cannot be earlier than start date.",
    Bambara: "Laban tuma tɛ se ka kɛ daminɛ tuma ɲɛ.",
  },
  start_date_range_error: {
    Français:
      "La date de début doit être comprise entre {startMin} et {startMax}.",
    Anglais: "Start date must be between {startMin} and {startMax}.",
    Bambara: "Daminɛ tuma ka kan ka kɛ {startMin} ni {startMax} cɛ.",
  },
  end_date_range_error: {
    Français: "La date de fin doit être comprise entre {endMin} et {endMax}.",
    Anglais: "End date must be between {endMin} and {endMax}.",
    Bambara: "Laban tuma ka kan ka kɛ {endMin} ni {endMax} cɛ.",
  },
  system_name_required: {
    Français: "Veuillez donner un nom au système de paiement",
    Anglais: "Please provide a name for the payment system",
    Bambara: "I ka kalan kalosaraw ɲanabɔla tɔgɔ di",
  },
  select_at_least_one_class: {
    Français: "Veuillez sélectionner au moins une classe",
    Anglais: "Please select at least one class",
    Bambara: "I ka kalanso kelen sugandi dɔrɔn",
  },
  payment_system_updated_success: {
    Français: "Système de paiement mis à jour avec succès!",
    Anglais: "Payment system updated successfully!",
    Bambara: "Kalan kalosaraw ɲanabɔla kɔsɛginna ka ɲɛ!",
  },
  new_payment_system_created_success: {
    Français: "Nouveau système de paiement créé avec succès!",
    Anglais: "New payment system created successfully!",
    Bambara: "Kalan kalosaraw ɲanabɔla kura dara ka ɲɛ!",
  },
  save_payment_system_error: {
    Français: "Erreur lors de la sauvegarde du système de paiement.",
    Anglais: "Error saving payment system.",
    Bambara: "Fili kɛra kalan kalosaraw ɲanabɔla maralila.",
  },
  payment_configuration: {
    Français: "Configuration des Paiements",
    Anglais: "Payments Configuration",
    Bambara: "Sarali labɛnni",
  },
  month_not_selected: {
    Français: "Mois non sélectionné",
    Anglais: "Month not selected",
    Bambara: "Kalo ma sugandi fɔlɔ",
  },
  select_payment_period: {
    Français: "Sélectionner une période de paiement",
    Anglais: "Select a payment period",
    Bambara: "Sarali waati dɔ sugandi",
  },
  from: {
    Français: "Du",
    Anglais: "From",
    Bambara: "K'a ta",
  },
  to: {
    Français: "au",
    Anglais: "to",
    Bambara: "Ka se",
  },
  current_period: {
    Français: "Période actuelle:",
    Anglais: "Current period:",
    Bambara: "Sisan waati:",
  },
  monthly_budget_by_class: {
    Français: "Budget Mensuel par Classe",
    Anglais: "Monthly Budget by Class",
    Bambara: "Kalo kɔnɔ wari hakɛ kilasi o kilasi",
  },
  month: {
    Français: "Mois",
    Anglais: "Month",
    Bambara: "Kalo",
  },
  total_expected_budget: {
    Français: "Budget Total Prévu",
    Anglais: "Total Expected Budget",
    Bambara: "Wari hakɛ latigɛlen bɛɛ lajɛlen",
  },
  total_amount_expected_this_month: {
    Français: "Montant total attendu pour ce mois",
    Anglais: "Total amount expected for this month",
    Bambara: "Nin kalo kɔnɔ wari hakɛ latigɛlen",
  },
  total_amount_received: {
    Français: "Montant Total Reçu",
    Anglais: "Total Amount Received",
    Bambara: "Wari hakɛ sɔrɔlen bɛɛ lajɛlen",
  },
  payments_already_made: {
    Français: "Paiements déjà effectués",
    Anglais: "Payments already made",
    Bambara: "Sara minnu dilen ka ban",
  },
  pending_budget: {
    Français: "Budget en Attente",
    Anglais: "Pending Budget",
    Bambara: "Wari hakɛ min tɛ dilen fɔlɔ",
  },
  remaining_amount_to_be_collected: {
    Français: "Montant restant à percevoir",
    Anglais: "Remaining amount to be collected",
    Bambara: "Wari hakɛ min tɔ ka sɔrɔ",
  },
  recovery_rate: {
    Français: "Taux de Recouvrement",
    Anglais: "Recovery Rate",
    Bambara: "Sara minnu dilen kɛra kɛmɛ sara joli ye",
  },
  percentage_of_payments_received: {
    Français: "Pourcentage des paiements reçus",
    Anglais: "Percentage of payments received",
    Bambara: "Sara minnu dilen kɛra kɛmɛ sara joli ye",
  },
  no_data_available: {
    Français: "Aucune donnée disponible",
    Anglais: "No data available",
    Bambara: "Kunnafoni si tɛ yen",
  },
  no_active_payment_system_found: {
    Français: "Aucun système de paiement actif n'a été trouvé pour ce mois.",
    Anglais: "No active payment system found for this month.",
    Bambara: "Sarali cogo si ma sigi nin kalo in kɔnɔ.",
  },
  students_have_paid: {
    Français: "élèves ont payé",
    Anglais: "students have paid",
    Bambara: "kalandenw ye sara di",
  },
  payment_progress: {
    Français: "Progression des paiements",
    Anglais: "Payment progress",
    Bambara: "Sarali taabolo",
  },
  monthly_fees: {
    Français: "Frais mensuels",
    Anglais: "Monthly fees",
    Bambara: "Kalo sara",
  },
  registration_fees: {
    Français: "Frais d'inscription",
    Anglais: "Registration fees",
    Bambara: "Tɔgɔsɛbɛn sara",
  },
  new_students_short: {
    Français: "nouveaux",
    Anglais: "new",
    Bambara: "kuraw",
  },
  enrolled_students: {
    Français: "Élèves inscrits",
    Anglais: "Enrolled students",
    Bambara: "Kalandenw tɔgɔsɛbɛnnen",
  },
  expected: {
    Français: "Prévu:",
    Anglais: "Expected:",
    Bambara: "Min latigɛla:",
  },
  received: {
    Français: "Reçu:",
    Anglais: "Received:",
    Bambara: "Min sɔrɔla:",
  },
  remaining: {
    Français: "Restant:",
    Anglais: "Remaining:",
    Bambara: "A tɔ:",
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
