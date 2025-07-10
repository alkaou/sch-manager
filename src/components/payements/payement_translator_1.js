const translations = {
  payment_configuration: {
    Français: "Configuration du paiement",
    Anglais: "Payment configuration",
    Bambara: "Kalan kalosaraw ɲanabɔla",
  },
  yearly_payment_statistics: {
    Français: "Statistiques Annuelles des Paiements",
    Anglais: "Annual Payment Statistics",
    Bambara: "Sanw kelen kelen bɛ sarali kunafoniw",
  },
  school_years: {
    Français: "Années scolaires",
    Anglais: "School Years",
    Bambara: "Kalansunw",
  },
  select_at_least_one_year: {
    Français: "Veuillez sélectionner au moins une année",
    Anglais: "Please select at least one year",
    Bambara: "I ka san kelen sugandi dɔrɔn",
  },
  maximum_years_selectable: {
    Français: "Maximum 4 années sélectionnables",
    Anglais: "Maximum 4 years selectable",
    Bambara: "San 4 de bɛ se ka sugandi",
  },
  total_revenue: {
    Français: "Revenu Total",
    Anglais: "Total Revenue",
    Bambara: "Wari hakɛ bɛɛ lajɛlen",
  },
  expected_revenue: {
    Français: "Revenu Attendu",
    Anglais: "Expected Revenue",
    Bambara: "Wari hakɛ latigɛlen",
  },
  payment_rate: {
    Français: "Taux de Paiement",
    Anglais: "Payment Rate",
    Bambara: "Sarali hakɛ",
  },
  annual_growth: {
    Français: "Croissance Annuelle",
    Anglais: "Annual Growth",
    Bambara: "San kɔnɔ yɛlɛma",
  },
  school_year: {
    Français: "Année scolaire",
    Anglais: "School Year",
    Bambara: "Kalansun",
  },
  financial_target: {
    Français: "Objectif financier pour",
    Anglais: "Financial target for",
    Bambara: "Wari hakɛ latigɛlen",
  },
  financial_goal_for: {
    Français: "Objectif financier pour",
    Anglais: "Financial target for",
    Bambara: "Wari hakɛ latigɛlen",
  },
  percentage_received: {
    Français: "Pourcentage des revenus perçus",
    Anglais: "Percentage of revenue received",
    Bambara: "Wari hakɛ sɔrɔlen kɛra kɛmɛ sara joli ye",
  },
  compared_to: {
    Français: "Par rapport à",
    Anglais: "Compared to",
    Bambara: "Ka sanga ni",
  },
  select_previous_year: {
    Français: "Sélectionnez une année précédente pour comparer",
    Anglais: "Select a previous year to compare",
    Bambara: "San tɛmɛnen dɔ sugandi walasa ka sanga ɲɔgɔn ma",
  },
  comparison_by_school_year: {
    Français: "Comparaison des {metric} par Année Scolaire",
    Anglais: "Comparison of {metric} by School Year",
    Bambara: "{metric} sanga ɲɔgɔn ma kalansun o kalansun",
  },
  monthly_payment_rate_evolution: {
    Français: "Évolution Mensuelle du Taux de Paiement",
    Anglais: "Monthly Evolution of Payment Rate",
    Bambara: "Kalo o kalo sarali hakɛ yɛlɛma",
  },
  top_performing_classes: {
    Français: "Classes les Plus Performantes",
    Anglais: "Top Performing Classes",
    Bambara: "Kalanso minnu ka ɲi kosɛbɛ",
  },
  class_performance: {
    Français: "Performance des Classes",
    Anglais: "Class Performance",
    Bambara: "Kalanso baara ɲɛtaa",
  },
  classes_to_improve: {
    Français: "Classes à Améliorer",
    Anglais: "Classes to Improve",
    Bambara: "Kalanso minnu ka kan ka ɲɛnabɔ",
  },
  students: {
    Français: "élèves",
    Anglais: "students",
    Bambara: "kalandenw",
  },
  payment_rate_percentage: {
    Français: "Taux de paiement (%)",
    Anglais: "Payment rate (%)",
    Bambara: "Sarali hakɛ (%)",
  },
  no_data_available: {
    Français: "Aucune donnée disponible",
    Anglais: "No data available",
    Bambara: "Kunafoni foyi tɛ yen",
  },
  select_school_year: {
    Français: "Veuillez sélectionner au moins une année scolaire pour afficher les statistiques.",
    Anglais: "Please select at least one school year to display statistics.",
    Bambara: "I ka kalansun kelen sugandi dɔrɔn walasa ka kunafoniw jira.",
  },
  bar_chart: {
    Français: "Graphique à barres",
    Anglais: "Bar Chart",
    Bambara: "Ja jɔlen",
  },
  line_chart: {
    Français: "Graphique linéaire",
    Anglais: "Line Chart",
    Bambara: "Ja sennateliman",
  },
  polar_chart: {
    Français: "Graphique polaire",
    Anglais: "Polar Chart",
    Bambara: "Ja lamini kɔnɔna",
  },
  monthly_fees: {
    Français: "Frais Mensuels",
    Anglais: "Monthly Fees",
    Bambara: "Kalo kalosaraw",
  },
  yearly_fees: {
    Français: "Frais Annuels",
    Anglais: "Yearly Fees",
    Bambara: "San kalosaraw",
  },
  registration_fees: {
    Français: "Frais d'Inscription",
    Anglais: "Registration Fees",
    Bambara: "Tɔgɔsɛbɛn sara",
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
