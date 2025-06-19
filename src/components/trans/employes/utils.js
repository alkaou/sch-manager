import translations from './employes_translator';
import { useLanguage } from '../contexts';

// Translation function
export const useTranslate = () => {
  const { language } = useLanguage();
  
  const translate = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  return translate;
};

// Format employee name
export const formatEmployeeName = ({ first_name, sure_name, last_name }) => {
  return [first_name, sure_name, last_name].filter(Boolean).join(" ");
};

// Format date for display
export const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString();
};

// Get age from birth date
export const getAge = (birthDate) => {
  if (!birthDate) return "-";
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

// Specialties for professors with translation support
export const getProfessorSpecialties = (translate) => [
  { value: "Généraliste", label: translate("generalist") },
  { value: "LHG", label: translate("lhg") },
  { value: "MPC", label: translate("mpc") },
  { value: "SPNC", label: translate("spnc") },
  { value: "LDM", label: translate("ldm") },
  { value: "Autre", label: translate("other") }
];

// For backward compatibility
export const PROFESSOR_SPECIALTIES = [
  { value: "Généraliste", label: "Généraliste" },
  { value: "LHG", label: "Lettre, Histoire et Géographie (LHG)" },
  { value: "MPC", label: "Mathématiques, Physique et Chimie (MPC)" },
  { value: "SPNC", label: "Science Physique, Naturelle et Chimie (SPNC)" },
  { value: "LDM", label: "Langue, Dessin et Musique (LDM)" },
  { value: "Autre", label: "Autre" }
];

// Default employee object
export const getDefaultEmployee = (translate) => {
  // If translate function is not provided, use a fallback
  const t = translate || ((key) => {
    if (translations[key]) {
      return translations[key]["Français"];
    }
    return key;
  });
  
  return {
    first_name: "",
    sure_name: "",
    last_name: "",
    name_complet: "",
    postes: ["Professeurs"],
    sexe: "",
    proffesseur_config: {
      is_permanent: true,
      speciality: t("default_specialty"),
      salaire_monthly: parseInt(t("default_monthly_salary"), 10) || 60000,
      salaire_hourly: 0
    },
    others_employe_config: {
      salaire_monthly: 0
    },
    classes: [],
    birth_date: "",
    contact: "",
    matricule: "",
    status: t("default_status"),
    service_started_at: "",
    service_ended_at: "",
    added_at: Date.now(),
    updated_at: Date.now()
  };
};

// Validate employee data
export const validateEmployee = (employee, translate) => {
  const errors = {};
  
  // If translate function is not provided, use a fallback
  const t = translate || ((key) => {
    if (translations[key]) {
      return translations[key]["Français"];
    }
    return key;
  });
  
  // Required fields validation
  if (!employee.first_name) errors.first_name = t("first_name_required");
  if (!employee.last_name) errors.last_name = t("last_name_required");
  if (!employee.sexe) errors.sexe = t("gender_required");
  if (!employee.birth_date) errors.birth_date = t("birth_date_required");
  if (!employee.contact) errors.contact = t("contact_required");
  if (!employee.service_started_at) errors.service_started_at = t("service_start_date_required");
  if (employee.postes.length === 0) errors.postes = t("at_least_one_position_required");
  
  // For professors
  if (employee.postes.includes("Professeurs")) {
    const config = employee.proffesseur_config;
    if (config.is_permanent && (!config.salaire_monthly || config.salaire_monthly <= 0)) {
      errors.proffesseur_config = errors.proffesseur_config || {};
      errors.proffesseur_config.salaire_monthly = t("monthly_salary_must_be_positive");
    }
    if (!config.is_permanent && (!config.salaire_hourly || config.salaire_hourly <= 0)) {
      errors.proffesseur_config = errors.proffesseur_config || {};
      errors.proffesseur_config.salaire_hourly = t("hourly_rate_must_be_positive");
    }
  }
  
  // For other positions
  if (employee.postes.some(p => p !== "Professeurs")) {
    if (!employee.others_employe_config.salaire_monthly || employee.others_employe_config.salaire_monthly <= 0) {
      errors.others_employe_config = errors.others_employe_config || {};
      errors.others_employe_config.salaire_monthly = t("monthly_salary_must_be_positive");
    }
  }
  
  // Validate dates
  if (employee.service_started_at && employee.service_ended_at) {
    if (new Date(employee.service_started_at) > new Date(employee.service_ended_at)) {
      errors.service_ended_at = t("end_date_not_before_start_date");
    }
  }
  
  return errors;
};

// Sort employees
export const sortEmployees = (employees, sortBy = "name", sortOrder = "asc") => {
  return [...employees].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name_complet.localeCompare(b.name_complet);
        break;
      case "added_at":
        comparison = a.added_at - b.added_at;
        break;
      case "service_started_at":
        comparison = new Date(a.service_started_at) - new Date(b.service_started_at);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
};

// Get sort options with translations
export const getSortOptions = (translate) => [
  { value: "name", label: translate("sort_by_name") },
  { value: "added_at", label: translate("sort_by_added_date") },
  { value: "service_started_at", label: translate("sort_by_service_start") },
  { value: "status", label: translate("sort_by_status") }
];

// Filter employees
export const filterEmployees = (employees, filters) => {
  return employees.filter(employee => {
    // Filter by position
    if (filters.position && !employee.postes.includes(filters.position)) {
      return false;
    }
    
    // Filter by status
    if (filters.status && filters.status !== "All" && employee.status !== filters.status) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const searchable = [
        employee.name_complet,
        employee.matricule,
        employee.contact
      ].join(" ").toLowerCase();
      
      if (!searchable.includes(term)) {
        return false;
      }
    }
    
    return true;
  });
};

// Get status filter options with translations
export const getStatusFilterOptions = (translate) => [
  { value: "All", label: translate("all") },
  { value: "actif", label: translate("active") },
  { value: "inactif", label: translate("inactive") }
];

// Format currency based on language
export const formatCurrency = (amount, language) => {
  // Map language to locale
  const localeMap = {
    'Français': 'fr-FR',
    'Anglais': 'en-US',
    'Bambara': 'fr-ML' // Using French Mali as closest locale for Bambara
  };
  
  // Default to French if language not provided or not found
  const locale = language && localeMap[language] ? localeMap[language] : 'fr-FR';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
};