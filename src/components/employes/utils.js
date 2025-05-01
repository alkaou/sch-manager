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

// Specialties for professors
export const PROFESSOR_SPECIALTIES = [
  { value: "Généraliste", label: "Généraliste" },
  { value: "LGH", label: "Langues et Humanités (LGH)" },
  { value: "MPC", label: "Mathématiques, Physique et Chimie (MPC)" },
  { value: "SPNC", label: "Science Physique et Naturelle (SPNC)" },
  { value: "LDM", label: "Langues et Didactique Moderne (LDM)" },
  { value: "Autre", label: "Autre" }
];

// Default employee object
export const getDefaultEmployee = () => ({
  first_name: "",
  sure_name: "",
  last_name: "",
  name_complet: "",
  postes: ["Professeurs"],
  sexe: "",
  proffesseur_config: {
    is_permanent: true,
    speciality: "Généraliste",
    salaire_monthly: 60000,
    salaire_hourly: 0
  },
  others_employe_config: {
    salaire_monthly: 60000
  },
  birth_date: "",
  contact: "",
  matricule: "",
  status: "actif",
  service_started_at: "",
  service_ended_at: "",
  added_at: Date.now(),
  updated_at: Date.now()
});

// Validate employee data
export const validateEmployee = (employee) => {
  const errors = {};
  
  // Required fields validation
  if (!employee.first_name) errors.first_name = "Le prénom est obligatoire";
  if (!employee.last_name) errors.last_name = "Le nom est obligatoire";
  if (!employee.sexe) errors.sexe = "Le sexe est obligatoire";
  if (!employee.birth_date) errors.birth_date = "La date de naissance est obligatoire";
  if (!employee.contact) errors.contact = "Le contact est obligatoire";
  if (!employee.service_started_at) errors.service_started_at = "La date de début de service est obligatoire";
  if (employee.postes.length === 0) errors.postes = "Au moins un poste est obligatoire";
  
  // For professors
  if (employee.postes.includes("Professeurs")) {
    const config = employee.proffesseur_config;
    if (config.is_permanent && (!config.salaire_monthly || config.salaire_monthly <= 0)) {
      errors.proffesseur_config = errors.proffesseur_config || {};
      errors.proffesseur_config.salaire_monthly = "Le salaire mensuel doit être supérieur à 0";
    }
    if (!config.is_permanent && (!config.salaire_hourly || config.salaire_hourly <= 0)) {
      errors.proffesseur_config = errors.proffesseur_config || {};
      errors.proffesseur_config.salaire_hourly = "Le taux horaire doit être supérieur à 0";
    }
  }
  
  // For other positions
  if (employee.postes.some(p => p !== "Professeurs")) {
    if (!employee.others_employe_config.salaire_monthly || employee.others_employe_config.salaire_monthly <= 0) {
      errors.others_employe_config = errors.others_employe_config || {};
      errors.others_employe_config.salaire_monthly = "Le salaire mensuel doit être supérieur à 0";
    }
  }
  
  // Validate dates
  if (employee.service_started_at && employee.service_ended_at) {
    if (new Date(employee.service_started_at) > new Date(employee.service_ended_at)) {
      errors.service_ended_at = "La date de fin ne peut pas être antérieure à la date de début";
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

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
}; 