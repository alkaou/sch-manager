import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import translations from "./depense_translator";
import { useLanguage, useFlashNotification } from "../contexts";
import EmployeeSelector from "./EmployeeSelector.jsx";
import EmployeePaymentConfig from "./EmployeePaymentConfig.jsx";
import PaymentDetailsForm from "./PaymentDetailsForm.jsx";

const PayEmployeesForm = ({
  db,
  expenses,
  setExpenses,
  schoolYearId,
  onCancel,
  text_color,
  theme
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const [step, setStep] = useState(1); // 1: Select employees, 2: Configure payments, 3: Enter details
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [paymentConfigurations, setPaymentConfigurations] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  useEffect(() => {
    // Initialize payment configurations when employees are selected
    if (selectedEmployees.length > 0 && Object.keys(paymentConfigurations).length === 0) {
      const initialConfigs = {};
      selectedEmployees.forEach(employee => {
        initialConfigs[employee.id] = {
          selectedPositions: employee.postes.reduce((acc, pos) => {
            acc[pos] = true;
            return acc;
          }, {}),
          paymentPercentages: employee.postes.reduce((acc, pos) => {
            acc[pos] = 100; // Default to 100%
            return acc;
          }, {}),
          customAmounts: employee.postes.reduce((acc, pos) => {
            acc[pos] = null; // Default to using percentage
            return acc;
          }, {}),
          workHours: employee.postes.includes("Professeurs") && 
                     !employee.proffesseur_config?.is_permanent ? {
            hours: 0,
            minutes: 0
          } : null,
        };
      });
      setPaymentConfigurations(initialConfigs);
    }
  }, [selectedEmployees]);

  const handleEmployeeSelection = (employees) => {
    setSelectedEmployees(employees);
    // Reset payment configurations if employee selection changes
    setPaymentConfigurations({});
  };

  const handlePaymentConfigChange = (employeeId, config) => {
    setPaymentConfigurations(prev => ({
      ...prev,
      [employeeId]: config
    }));
  };

  const calculateTotalPayment = () => {
    let totalToPay = 0;
    let totalOriginal = 0;

    selectedEmployees.forEach(employee => {
      const config = paymentConfigurations[employee.id];
      if (!config) return;

      Object.entries(config.selectedPositions).forEach(([position, isSelected]) => {
        if (!isSelected) return;

        let originalAmount = 0;
        let amountToPay = 0;

        if (position === "Professeurs") {
          if (employee.proffesseur_config?.is_permanent) {
            // Permanent professor with monthly salary
            originalAmount = parseFloat(employee.proffesseur_config.salaire_monthly) || 0;
          } else {
            // Non-permanent professor with hourly rate
            const hourlyRate = parseFloat(employee.proffesseur_config?.salaire_hourly) || 0;
            const hours = (config.workHours?.hours || 0) + (config.workHours?.minutes || 0) / 60;
            originalAmount = hourlyRate * hours;
          }
        } else {
          // Other positions with monthly salary
          originalAmount = parseFloat(employee.others_employe_config?.salaire_monthly) || 0;
        }

        // Calculate amount to pay based on percentage or custom amount
        if (config.customAmounts[position] !== null) {
          amountToPay = parseFloat(config.customAmounts[position]) || 0;
        } else {
          amountToPay = originalAmount * (config.paymentPercentages[position] / 100);
        }

        totalOriginal += originalAmount;
        totalToPay += amountToPay;
      });
    });

    return { 
      original: Math.round(totalOriginal), 
      toPay: Math.round(totalToPay)
    };
  };

  const nextStep = () => {
    if (step === 1) {
      if (selectedEmployees.length === 0) {
        setErrors({ employees: t('select_at_least_one_employee') });
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      // Validate that each employee has at least one position selected
      const invalidEmployees = selectedEmployees.filter(employee => {
        const config = paymentConfigurations[employee.id];
        if (!config) return true;
        
        // Check if at least one position is selected
        return !Object.values(config.selectedPositions).some(isSelected => isSelected);
      });

      if (invalidEmployees.length > 0) {
        setErrors({ 
          positions: t('select_at_least_one_position_per_employee'),
          employeeIds: invalidEmployees.map(e => e.id)
        });
        return;
      }
      
      setErrors({});
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formDetails.name.trim()) {
      newErrors.name = t('title_required');
    } else if (formDetails.name.trim().length < 10 || formDetails.name.trim().length > 150) {
      newErrors.name = t('title_length');
    }
    
    if (!formDetails.description.trim()) {
      newErrors.description = t('description_required');
    } else if (formDetails.description.trim().length < 30 || formDetails.description.trim().length > 10000) {
      newErrors.description = t('description_length');
    }
    
    if (!formDetails.date) {
      newErrors.date = t('expense_date_required');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const now = new Date();
      const { original, toPay } = calculateTotalPayment();
      
      // Create the expense object
      const newExpense = {
        id: `expense-${Date.now()}`,
        depense_scolaire_id: schoolYearId,
        name: formDetails.name.trim(),
        description: formDetails.description.trim(),
        amount_for_payed: original.toString(),
        amount: toPay.toString(),
        date: formDetails.date,
        type: "employees",
        category: "salary",
        created_at: Date.now(),
        created_time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        updated_at: Date.now(),
        updated_time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        payment_details: {
          employees: selectedEmployees.map(employee => {
            const config = paymentConfigurations[employee.id];
            return {
              employee_id: employee.id,
              employee_name: employee.name_complet,
              positions: Object.entries(config.selectedPositions)
                .filter(([_, isSelected]) => isSelected)
                .map(([position, _]) => ({
                  position_name: position,
                  original_amount: position === "Professeurs" 
                    ? employee.proffesseur_config?.is_permanent 
                      ? parseFloat(employee.proffesseur_config.salaire_monthly) || 0
                      : ((parseFloat(employee.proffesseur_config?.salaire_hourly) || 0) * 
                         ((config.workHours?.hours || 0) + (config.workHours?.minutes || 0) / 60))
                    : parseFloat(employee.others_employe_config?.salaire_monthly) || 0,
                  percentage: config.customAmounts[position] !== null ? null : config.paymentPercentages[position],
                  paid_amount: config.customAmounts[position] !== null 
                    ? parseFloat(config.customAmounts[position]) 
                    : (position === "Professeurs" 
                      ? employee.proffesseur_config?.is_permanent 
                        ? (parseFloat(employee.proffesseur_config.salaire_monthly) || 0) * (config.paymentPercentages[position] / 100)
                        : ((parseFloat(employee.proffesseur_config?.salaire_hourly) || 0) * 
                           ((config.workHours?.hours || 0) + (config.workHours?.minutes || 0) / 60)) * (config.paymentPercentages[position] / 100)
                      : (parseFloat(employee.others_employe_config?.salaire_monthly) || 0) * (config.paymentPercentages[position] / 100)),
                  work_hours: position === "Professeurs" && !employee.proffesseur_config?.is_permanent 
                    ? config.workHours 
                    : null
                }))
            };
          })
        }
      };
      
      // Récupérer la base de données actuelle pour s'assurer qu'on a toutes les dépenses
      const currentDb = await window.electron.getDatabase();
      
      // S'assurer que nous utilisons toutes les dépenses existantes de la base de données
      const allExpenses = [...(currentDb.expenses || [])];
      
      // Ajouter la nouvelle dépense
      allExpenses.push(newExpense);
      
      // Mettre à jour la base de données avec toutes les dépenses
      const updatedDb = { ...currentDb, expenses: allExpenses };
      await window.electron.saveDatabase(updatedDb);
      
      // Mettre à jour l'état local
      setExpenses(allExpenses);
      
      setFlashMessage({
        message: t('expense_added'),
        type: "success",
        duration: 5000,
      });
      
      // Reset form and close
      setIsSubmitting(false);
      setLoading(false);
      onCancel();
    } catch (error) {
      console.error("Error saving expense:", error);
      setFlashMessage({
        message: t('add_error'),
        type: "error",
        duration: 5000,
      });
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <EmployeeSelector
            db={db}
            selectedEmployees={selectedEmployees}
            onSelectEmployees={handleEmployeeSelection}
            theme={theme}
            text_color={text_color}
            error={errors.employees}
          />
        );
      case 2:
        return (
          <EmployeePaymentConfig
            employees={selectedEmployees}
            configurations={paymentConfigurations}
            onConfigChange={handlePaymentConfigChange}
            theme={theme}
            text_color={text_color}
            errors={errors}
          />
        );
      case 3:
        return (
          <PaymentDetailsForm
            formDetails={formDetails}
            setFormDetails={setFormDetails}
            errors={errors}
            theme={theme}
            text_color={text_color}
            totalPayment={calculateTotalPayment()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} ${text_color}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200`}
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold ml-2">{t('pay_employees')}</h2>
        </div>
        
        <div className="flex space-x-4">
          {/* Step indicators */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  step === stepNumber
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : step > stepNumber
                    ? theme === "dark"
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNumber ? <Check size={16} /> : stepNumber}
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {renderStepContent()}
      </motion.div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className={`px-4 py-2 rounded-lg flex items-center ${
            step === 1
              ? "opacity-50 cursor-not-allowed"
              : theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } transition-colors duration-200`}
          disabled={step === 1}
        >
          <ChevronLeft size={20} className="mr-1" />
          {t('previous')}
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className={`px-4 py-2 rounded-lg flex items-center ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors duration-200`}
          >
            {t('next')}
            <ChevronRight size={20} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg flex items-center ${
              isSubmitting
                ? "opacity-75 cursor-wait"
                : theme === "dark"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            } transition-colors duration-200`}
          >
            {isSubmitting ? t('saving') : t('save')}
            {isSubmitting ? (
              <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Check size={20} className="ml-1" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PayEmployeesForm; 