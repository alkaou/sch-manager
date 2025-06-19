import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { useTheme, useFlashNotification, useLanguage } from '../contexts';
import { saveEmployee, updateEmployee } from '../../utils/database_methods';
import { getDefaultEmployee, validateEmployee, PROFESSOR_SPECIALTIES } from './utils';
import AutocompleteInput from "../AutocompleteInput.jsx";
import { suggestNames, suggestLastNames } from "../../utils/suggestionNames";
import { getClasseName } from "../../utils/helpers";
import translations from "./employes_translator";

const EmployeeForm = ({
  isOpen,
  onClose,
  employee = null,
  database,
  positions = [],
  refreshData
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const { language } = useLanguage();
  
  // Translation helper
  const translate = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  const [formData, setFormData] = useState(getDefaultEmployee());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("general"); // general, professor, other
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: true,
    salary: true
  });
  
  // Reset form when opening or changing employee
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee
      });
    } else {
      setFormData(getDefaultEmployee());
    }
    setErrors({});
  }, [employee, isOpen]);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (errors[parent]?.[child]) {
        setErrors(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: null
          }
        }));
      }
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleProfessorTypeChange = (e) => {
    const isPermanent = e.target.value === 'permanent';
    setFormData(prev => ({
      ...prev,
      proffesseur_config: {
        ...prev.proffesseur_config,
        is_permanent: isPermanent,
        salaire_monthly: isPermanent ? 100000 : 0,
        salaire_hourly: isPermanent ? 0 : 1000
      }
    }));
  };
  
  const handlePositionToggle = (positionName) => {
    const currentPositions = formData.postes || [];
    let newPositions;
    
    if (currentPositions.includes(positionName)) {
      // If Professeurs is being removed, we need special handling
      if (positionName === 'Professeurs') {
        setActiveSection('general');
      }
      newPositions = currentPositions.filter(pos => pos !== positionName);
    } else {
      newPositions = [...currentPositions, positionName];
      // If Professeurs is added, switch to professor config tab
      if (positionName === 'Professeurs') {
        setActiveSection('professor');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      postes: newPositions
    }));
    
    // Clear position error if it exists
    if (errors.postes) {
      setErrors(prev => ({ ...prev, postes: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update name_complet
    const first_name = formData.first_name.trim();
    const sure_name = formData.sure_name?.trim() || "";
    const last_name = formData.last_name.trim();
    const nameComplet = [first_name, sure_name, last_name].filter(Boolean).join(" ");
    
    const dataToSubmit = {
      ...formData,
      name_complet: nameComplet
    };
    
    // Validate the form
    const validationErrors = validateEmployee(dataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      if (employee) {
        // Update existing employee
        await updateEmployee(employee.id, dataToSubmit, database, setFlashMessage);
      } else {
        // Create new employee
        await saveEmployee(dataToSubmit, database, setFlashMessage);
      }
      
      refreshData();
      onClose();
    } catch (error) {
      setFlashMessage({
        type: 'error',
        message: error.message || 'Une erreur est survenue'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Background and text colors based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const buttonPrimaryColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const tabActiveBg = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';
  const tabInactiveBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';

  const _text_color = app_bg_color === gradients[1] ||
        app_bg_color === gradients[2] ||
        theme === "dark" ? text_color : "text-gray-700";
  
  // Input style
  const inputClass = `w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${inputBgColor} ${inputBorderColor} ${_text_color}`;
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };
  
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto scrollbar-custom py-10"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={`${bgColor} rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${_text_color}`}>
                {employee ? 'Modifier un employé' : 'Ajouter un nouvel employé'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveSection("general")}
                className={`px-4 py-2 font-medium ${activeSection === "general" ? `${tabActiveBg} text-white` : `${tabInactiveBg} ${_text_color}`}`}
              >
                Informations générales
              </button>
              {formData.postes.includes("Professeurs") && (
                <button
                  onClick={() => setActiveSection("professor")}
                  className={`px-4 py-2 font-medium ${activeSection === "professor" ? `${tabActiveBg} text-white` : `${tabInactiveBg} ${_text_color}`}`}
                >
                  Configuration Professeur
                </button>
              )}
              {formData.postes.some(pos => pos !== "Professeurs") && (
                <button
                  onClick={() => setActiveSection("other")}
                  className={`px-4 py-2 font-medium ${activeSection === "other" ? `${tabActiveBg} text-white` : `${tabInactiveBg} ${_text_color}`}`}
                >
                  Configuration Autres Postes
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="px-4 py-6 max-h-[70vh] overflow-y-auto scrollbar-custom">
              {/* General Information */}
              {activeSection === "general" && (
                <div className="space-y-6">
                  {/* Position Selection */}
                  <div>
                    <h4 className={`text-md font-semibold mb-2 ${_text_color}`}>Poste(s)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {positions.map((position) => (
                        <div key={position.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`position-${position.id}`}
                            checked={formData.postes.includes(position.name)}
                            onChange={() => handlePositionToggle(position.name)}
                            className="w-4 h-4 mr-2 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`position-${position.id}`}
                            className={`${_text_color} cursor-pointer`}
                          >
                            {position.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.postes && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.postes}
                      </motion.p>
                    )}
                  </div>
                  
                  {/* Personal Information Section */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className={`${sectionHeaderBg} px-4 py-2 flex justify-between items-center cursor-pointer`}
                      onClick={() => toggleSection('personal')}
                    >
                      <h4 className={`font-medium ${_text_color}`}>{translate("personal_information")}</h4>
                      {expandedSections.personal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    {expandedSections.personal && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("first_name")} <span className="text-red-500">*</span>
                          </label>
                          <AutocompleteInput
                            suggestions={suggestNames}
                            value={formData.first_name}
                            placeholder="Ex: Jean"
                            inputClass={inputClass}
                            onChange={(e) => handleChange({ target: { name: 'first_name', value: e.target.value } })}
                          />
                          {errors.first_name && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.first_name}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Surename */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("nickname")}
                          </label>
                          <AutocompleteInput
                            suggestions={suggestNames}
                            value={formData.sure_name || ''}
                            placeholder="Ex: Junior"
                            inputClass={inputClass}
                            onChange={(e) => handleChange({ target: { name: 'sure_name', value: e.target.value } })}
                          />
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("last_name")} <span className="text-red-500">*</span>
                          </label>
                          <AutocompleteInput
                            suggestions={suggestLastNames}
                            value={formData.last_name}
                            placeholder="Ex: Dupont"
                            inputClass={inputClass}
                            onChange={(e) => handleChange({ target: { name: 'last_name', value: e.target.value } })}
                          />
                          {errors.last_name && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.last_name}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Sex */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("gender")} <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="sexe"
                            value={formData.sexe}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="">Sélectionner</option>
                            <option value="M">{translate("male")}</option>
                            <option value="F">{translate("female")}</option>
                          </select>
                          {errors.sexe && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.sexe}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Birth Date */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("date_of_birth")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date ? new Date(formData.birth_date).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            className={inputClass}
                          />
                          {errors.birth_date && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.birth_date}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Contact */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("phone")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Ex: +123 456 7890"
                            className={inputClass}
                          />
                          {errors.contact && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.contact}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Matricule */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("registration_number")}
                          </label>
                          <input
                            type="text"
                            name="matricule"
                            value={formData.matricule || ''}
                            onChange={handleChange}
                            placeholder="Ex: MAT123"
                            className={inputClass}
                          />
                        </div>
                        
                        {/* Status */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("status")}
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="actif">{translate("active")}</option>
                            <option value="inactif">{translate("inactive")}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Professional Information Section */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className={`${sectionHeaderBg} px-4 py-2 flex justify-between items-center cursor-pointer`}
                      onClick={() => toggleSection('professional')}
                    >
                      <h4 className={`font-medium ${_text_color}`}>{translate("professional_information")}</h4>
                      {expandedSections.professional ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    {expandedSections.professional && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Service Started */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("service_start_date")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="service_started_at"
                            value={formData.service_started_at ? new Date(formData.service_started_at).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            className={inputClass}
                          />
                          {errors.service_started_at && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.service_started_at}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Service Ended */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("service_end_date")}
                          </label>
                          <input
                            type="date"
                            name="service_ended_at"
                            value={formData.service_ended_at ? new Date(formData.service_ended_at).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            className={inputClass}
                          />
                          {errors.service_ended_at && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="mt-1 text-sm text-red-500"
                            >
                              {errors.service_ended_at}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Professor Configuration */}
              {activeSection === "professor" && (
                <div className="space-y-6">
                  <h4 className={`text-md font-semibold mb-4 ${_text_color}`}>{translate("professor_configuration")}</h4>
                  
                  {/* Classes enseignées */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                    <div className={`${sectionHeaderBg} px-4 py-2 flex justify-between items-center`}>
                      <h4 className={`font-medium ${_text_color}`}>{translate("taught_classes")}</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p className={`text-sm ${_text_color}`}>{translate("select_taught_classes")}:</p>
                      
                      {database?.classes && database.classes.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {database.classes.sort((a, b) => a.level - b.level).map(classe => {
                            const classId = classe.id;
                            const classDisplayName = getClasseName(`${classe.level} ${classe.name}`.trim(), language);
                            const isSelected = formData.classes?.includes(classId);
                            
                            return (
                              <div key={classId} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`class-${classId}`}
                                  checked={isSelected}
                                  onChange={() => {
                                    const currentClasses = formData.classes || [];
                                    const newClasses = isSelected
                                      ? currentClasses.filter(id => id !== classId)
                                      : [...currentClasses, classId];
                                    
                                    setFormData(prev => ({
                                      ...prev,
                                      classes: newClasses
                                    }));
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                  htmlFor={`class-${classId}`}
                                  className={`ml-2 text-sm font-medium ${_text_color}`}
                                >
                                  {classDisplayName}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{translate("no_classes_available")}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className={`${sectionHeaderBg} px-4 py-2 flex justify-between items-center cursor-pointer`}
                      onClick={() => toggleSection('salary')}
                    >
                      <h4 className={`font-medium ${_text_color}`}>{translate("employment_type_and_salary")}</h4>
                      {expandedSections.salary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    {expandedSections.salary && (
                      <div className="p-4 space-y-4">
                        {/* Type of Employment */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("employment_type")}
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="employmentType"
                                value="permanent"
                                checked={formData.proffesseur_config.is_permanent}
                                onChange={handleProfessorTypeChange}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={_text_color}>{translate("permanent")}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="employmentType"
                                value="vacataire"
                                checked={!formData.proffesseur_config.is_permanent}
                                onChange={handleProfessorTypeChange}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={_text_color}>{translate("temporary")}</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Specialty */}
                        <div>
                          <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                            {translate("specialty")}
                          </label>
                          <select
                            name="proffesseur_config.speciality"
                            value={formData.proffesseur_config.speciality}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            {PROFESSOR_SPECIALTIES.map(specialty => (
                              <option key={specialty.value} value={specialty.value}>
                                {specialty.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Salary based on employment type */}
                        {formData.proffesseur_config.is_permanent ? (
                          <div>
                            <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                              {translate("monthly_salary")} (XOF)
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <DollarSign size={16} className="text-gray-400" />
                              </div>
                              <input
                                type="number"
                                name="proffesseur_config.salaire_monthly"
                                value={formData.proffesseur_config.salaire_monthly}
                                onChange={handleChange}
                                min="0"
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            {errors.proffesseur_config?.salaire_monthly && (
                              <motion.p
                                variants={errorVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-1 text-sm text-red-500"
                              >
                                {errors.proffesseur_config.salaire_monthly}
                              </motion.p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                              {translate("hourly_rate")} (XOF)
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <DollarSign size={16} className="text-gray-400" />
                              </div>
                              <input
                                type="number"
                                name="proffesseur_config.salaire_hourly"
                                value={formData.proffesseur_config.salaire_hourly}
                                onChange={handleChange}
                                min="0"
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            {errors.proffesseur_config?.salaire_hourly && (
                              <motion.p
                                variants={errorVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-1 text-sm text-red-500"
                              >
                                {errors.proffesseur_config.salaire_hourly}
                              </motion.p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Other Positions Configuration */}
              {activeSection === "other" && (
                <div className="space-y-6">
                  <h4 className={`text-md font-semibold mb-4 ${_text_color}`}>
                    {translate("other_positions_configuration")}: {formData.postes.filter(p => p !== 'Professeurs').join(', ')}
                  </h4>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div>
                      <label className={`block mb-1 text-sm font-medium ${_text_color}`}>
                        {translate("monthly_salary")} (XOF)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="others_employe_config.salaire_monthly"
                          value={formData.others_employe_config.salaire_monthly}
                          onChange={handleChange}
                          min="0"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                      {errors.others_employe_config?.salaire_monthly && (
                        <motion.p
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          className="mt-1 text-sm text-red-500"
                        >
                          {errors.others_employe_config.salaire_monthly}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${_text_color}`}
                >
                  {translate("cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : buttonPrimaryColor}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translate("processing")}
                    </span>
                  ) : employee ? translate("update") : translate("add")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeForm;