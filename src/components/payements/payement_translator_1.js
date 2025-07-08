const translations = {
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
}

// Export the translate function
export const translate = (key, language) => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  // Default to French if the requested language is not available
  return translations[key][language] || translations[key]["Français"] || key;
};