import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Clock, Check, AlertCircle, Percent, ToggleLeft, ToggleRight } from "lucide-react";
import translations from "./depense_translator";
import { useLanguage } from "../contexts";
import { getPostNameTrans } from "../../utils/helpers";

const EmployeePaymentConfig = ({
  employees,
  configurations,
  onConfigChange,
  theme,
  text_color,
  errors
}) => {
  const { language } = useLanguage();
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  const handlePositionToggle = (employeeId, position) => {
    if (!configurations[employeeId]) return;
    
    const updatedConfig = {
      ...configurations[employeeId],
      selectedPositions: {
        ...configurations[employeeId].selectedPositions,
        [position]: !configurations[employeeId].selectedPositions[position]
      }
    };
    
    // Ensure at least one position is selected
    if (Object.values(updatedConfig.selectedPositions).some(isSelected => isSelected)) {
      onConfigChange(employeeId, updatedConfig);
    }
  };

  const handlePercentageChange = (employeeId, position, value) => {
    if (!configurations[employeeId]) return;
    
    onConfigChange(employeeId, {
      ...configurations[employeeId],
      paymentPercentages: {
        ...configurations[employeeId].paymentPercentages,
        [position]: value
      }
    });
  };

  const toggleCustomAmount = (employeeId, position) => {
    if (!configurations[employeeId]) return;
    
    const currentCustomAmount = configurations[employeeId].customAmounts[position];
    const updatedCustomAmounts = {
      ...configurations[employeeId].customAmounts,
    };
    
    if (currentCustomAmount === null) {
      // Calculate the amount based on percentage
      let baseAmount = 0;
      const employee = employees.find(e => e.id === employeeId);
      
      if (position === "Professeurs") {
        if (employee.proffesseur_config?.is_permanent) {
          baseAmount = parseFloat(employee.proffesseur_config.salaire_monthly) || 0;
        } else {
          const hourlyRate = parseFloat(employee.proffesseur_config?.salaire_hourly) || 0;
          const hours = (configurations[employeeId].workHours?.hours || 0) + 
                       (configurations[employeeId].workHours?.minutes || 0) / 60;
          baseAmount = hourlyRate * hours;
        }
      } else {
        baseAmount = parseFloat(employee.others_employe_config?.salaire_monthly) || 0;
      }
      
      const percentage = configurations[employeeId].paymentPercentages[position];
      updatedCustomAmounts[position] = Math.round(baseAmount * (percentage / 100));
    } else {
      // Switch back to percentage
      updatedCustomAmounts[position] = null;
    }
    
    onConfigChange(employeeId, {
      ...configurations[employeeId],
      customAmounts: updatedCustomAmounts
    });
  };

  const handleCustomAmountChange = (employeeId, position, value) => {
    if (!configurations[employeeId]) return;
    
    // Ensure value is at least 500 FCFA
    const numValue = parseFloat(value) || 0;
    const minValue = position === "Professeurs" ? 
      calculateMinProfessorAmount(employeeId) : 500;
    
    const validValue = Math.max(numValue, minValue);
    
    onConfigChange(employeeId, {
      ...configurations[employeeId],
      customAmounts: {
        ...configurations[employeeId].customAmounts,
        [position]: validValue.toString()
      }
    });
  };

  const calculateMinProfessorAmount = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee || !employee.proffesseur_config) return 500;
    
    if (!employee.proffesseur_config.is_permanent) {
      // For non-permanent professors, minimum is 1 hour of work
      return parseFloat(employee.proffesseur_config.salaire_hourly) || 500;
    }
    
    return 500; // Minimum for permanent professors
  };

  const handleWorkHoursChange = (employeeId, field, value) => {
    if (!configurations[employeeId]) return;
    
    const numValue = parseInt(value) || 0;
    let validValue = numValue;
    
    // Ensure minutes are between 0 and 59
    if (field === "minutes") {
      validValue = Math.min(Math.max(numValue, 0), 59);
    } else {
      validValue = Math.max(numValue, 0);
    }
    
    onConfigChange(employeeId, {
      ...configurations[employeeId],
      workHours: {
        ...configurations[employeeId].workHours,
        [field]: validValue
      }
    });
  };

  const calculatePositionAmount = (employee, position, config) => {
    if (!config) return 0;
    
    let baseAmount = 0;
    
    if (position === "Professeurs") {
      if (employee.proffesseur_config?.is_permanent) {
        baseAmount = parseFloat(employee.proffesseur_config.salaire_monthly) || 0;
      } else {
        const hourlyRate = parseFloat(employee.proffesseur_config?.salaire_hourly) || 0;
        const hours = (config.workHours?.hours || 0) + (config.workHours?.minutes || 0) / 60;
        baseAmount = hourlyRate * hours;
      }
    } else {
      baseAmount = parseFloat(employee.others_employe_config?.salaire_monthly) || 0;
    }
    
    const percentage = config.paymentPercentages[position];
    let finalAmount = baseAmount * (percentage / 100);
    
    if (config.customAmounts[position] !== null) {
      finalAmount = parseFloat(config.customAmounts[position]) || 0;
    }
    
    return {
      baseAmount: Math.round(baseAmount),
      finalAmount: Math.round(finalAmount)
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "Anglais" ? "en-US" : "fr-FR").format(amount);
  };

  const isEmployeeInvalid = (employeeId) => {
    return errors?.employeeIds?.includes(employeeId);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{t('configure_payments')}</h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {t('configure_payments_instruction')}
        </p>
        {errors?.positions && (
          <div className="mt-2 p-3 rounded-lg bg-red-100 text-red-800 flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{errors.positions}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {employees.map(employee => {
          const config = configurations[employee.id];
          if (!config) return null;
          
          const isExpanded = expandedEmployee === employee.id;
          const hasError = isEmployeeInvalid(employee.id);
          
          return (
            <motion.div 
              key={employee.id}
              layout
              className={`rounded-lg shadow-md overflow-hidden ${
                hasError 
                  ? "border-2 border-red-500" 
                  : theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Employee header */}
              <div 
                className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
                onClick={() => setExpandedEmployee(isExpanded ? null : employee.id)}
              >
                <div>
                  <h4 className="font-medium text-lg">{employee.name_complet}</h4>
                  <div className="text-sm mt-1 flex flex-wrap gap-2">
                    {employee.postes.map(poste => (
                      <span 
                        key={poste}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          config.selectedPositions[poste]
                            ? poste === "Professeurs"
                              ? `${theme === "dark" ? "bg-indigo-900 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`
                              : `${theme === "dark" ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"}`
                            : `${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`
                        }`}
                      >
                        {getPostNameTrans(poste, language)}
                        {config.selectedPositions[poste] && (
                          <Check size={12} className="ml-1" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`text-xl font-semibold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                  {formatCurrency(
                    Object.entries(config.selectedPositions)
                      .filter(([_, isSelected]) => isSelected)
                      .reduce((sum, [position]) => {
                        const { finalAmount } = calculatePositionAmount(employee, position, config);
                        return sum + finalAmount;
                      }, 0)
                  )} FCFA
                </div>
              </div>
              
              {/* Positions configuration */}
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 divide-y divide-gray-200">
                  {/* Position checkboxes */}
                  <div className="py-4">
                    <h5 className="font-medium mb-3">{t('select_positions_to_pay')}</h5>
                    <div className="flex flex-wrap gap-3">
                      {employee.postes.map(position => (
                        <button
                          key={position}
                          onClick={() => handlePositionToggle(employee.id, position)}
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            config.selectedPositions[position]
                              ? theme === "dark"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-500 text-white"
                              : theme === "dark"
                              ? "bg-gray-700 text-gray-300 border border-gray-600"
                              : "bg-white text-gray-700 border border-gray-300"
                          } transition-colors duration-200`}
                        >
                          {getPostNameTrans(position, language)}
                          <div className="ml-2">
                            {config.selectedPositions[position] ? (
                              <Check size={16} />
                            ) : null}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Professor work hours input (only for non-permanent professors) */}
                  {employee.postes.includes("Professeurs") && 
                   config.selectedPositions["Professeurs"] && 
                   !employee.proffesseur_config?.is_permanent && (
                    <div className="py-4">
                      <h5 className="font-medium mb-3">
                        {t('work_hours')} ({t('hourly_rate')}: {formatCurrency(parseFloat(employee.proffesseur_config?.salaire_hourly) || 0)} FCFA)
                      </h5>
                      <div className="flex items-center space-x-2">
                        <Clock size={20} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            value={config.workHours?.hours || 0}
                            onChange={(e) => handleWorkHoursChange(employee.id, "hours", e.target.value)}
                            className={`w-16 px-3 py-2 rounded-lg text-center ${
                              theme === "dark" 
                                ? "bg-gray-700 text-white border-gray-600" 
                                : "bg-white text-gray-900 border-gray-300"
                            } border focus:ring-2 ${
                              theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
                            } focus:outline-none`}
                          />
                          <span className="mx-2">{t('hours')}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={config.workHours?.minutes || 0}
                            onChange={(e) => handleWorkHoursChange(employee.id, "minutes", e.target.value)}
                            className={`w-16 px-3 py-2 rounded-lg text-center ${
                              theme === "dark" 
                                ? "bg-gray-700 text-white border-gray-600" 
                                : "bg-white text-gray-900 border-gray-300"
                            } border focus:ring-2 ${
                              theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
                            } focus:outline-none`}
                          />
                          <span className="mx-2">{t('minutes')}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        {config.workHours && (
                          <div className={`text-sm ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                            {t('total_salary_for_hours')}: 
                            {formatCurrency(
                              (parseFloat(employee.proffesseur_config?.salaire_hourly) || 0) * 
                              ((config.workHours.hours || 0) + (config.workHours.minutes || 0) / 60)
                            )} FCFA
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Payment configuration for each selected position */}
                  {Object.entries(config.selectedPositions)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([position]) => {
                      const { baseAmount, finalAmount } = calculatePositionAmount(employee, position, config);
                      const isCustomAmount = config.customAmounts[position] !== null;
                      
                      return (
                        <div key={position} className="py-4">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium">{t('payment_for')} {getPostNameTrans(position, language)}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                {isCustomAmount ? t('custom_amount') : t('percentage')}
                              </span>
                              <button 
                                onClick={() => toggleCustomAmount(employee.id, position)}
                                className="text-blue-500 hover:text-blue-700"
                                title={isCustomAmount ? t('switch_to_percentage') : t('switch_to_custom_amount')}
                              >
                                {isCustomAmount ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                              </button>
                            </div>
                          </div>
                          
                          {!isCustomAmount ? (
                            // Percentage slider
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="mr-3 w-10 text-center">{config.paymentPercentages[position]}%</span>
                                <input
                                  type="range"
                                  min="25"
                                  max="100"
                                  step="5"
                                  value={config.paymentPercentages[position]}
                                  onChange={(e) => handlePercentageChange(employee.id, position, parseInt(e.target.value))}
                                  className={`flex-1 h-2 ${
                                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                                  } rounded-lg appearance-none cursor-pointer`}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mb-4">
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          ) : (
                            // Custom amount input
                            <div className="mb-4">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <DollarSign size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                                </div>
                                <input
                                  type="number"
                                  value={config.customAmounts[position] || ""}
                                  onChange={(e) => handleCustomAmountChange(employee.id, position, e.target.value)}
                                  min={position === "Professeurs" ? calculateMinProfessorAmount(employee.id) : 500}
                                  className={`block w-full pl-10 pr-12 py-2 ${
                                    theme === "dark" 
                                      ? "bg-gray-700 text-white border-gray-600" 
                                      : "bg-white text-gray-900 border-gray-300"
                                  } border rounded-lg focus:ring-2 ${
                                    theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"
                                  } focus:outline-none`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>FCFA</span>
                                </div>
                              </div>
                              <div className="mt-1">
                                <span className={`text-xs ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
                                  {t('minimum_amount')}: {formatCurrency(position === "Professeurs" ? calculateMinProfessorAmount(employee.id) : 500)} FCFA
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Payment summary */}
                          <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            <div className="flex justify-between mb-1">
                              <span>{t('base_salary')}:</span>
                              <span>{formatCurrency(baseAmount)} FCFA</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>{t('amount_to_pay')}:</span>
                              <span className={theme === "dark" ? "text-green-400" : "text-green-600"}>
                                {formatCurrency(finalAmount)} FCFA 
                                {!isCustomAmount && (
                                  <span className="ml-1">({config.paymentPercentages[position]}%)</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeePaymentConfig; 