import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, AlertTriangle, DollarSign } from 'lucide-react';
import { useLanguage, useFlashNotification } from '../contexts';
import translations from './depense_translator';

const ExpenseForm = ({
  db,
  expenses,
  setExpenses,
  expense,
  schoolYearId,
  onCancel,
  app_bg_color,
  text_color,
  theme
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isEditMode = Boolean(expense);

  // Find the active school year for date validation
  const [schoolYear, setSchoolYear] = useState(null);

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Get school year data for date validation
  useEffect(() => {
    if (schoolYearId && db && db.schoolYears) {
      const year = db.schoolYears.find(y => y.id === schoolYearId);
      if (year) {
        setSchoolYear(year);
      }
    }
  }, [schoolYearId, db]);

  // Initialize form with expense data if in edit mode
  useEffect(() => {
    if (isEditMode && expense) {
      setFormData({
        name: expense.name || '',
        description: expense.description || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || 'other'
      });
      setCharCount(expense.description ? expense.description.length : 0);
    } else if (schoolYear) {
      // For new expenses, default to today's date if within school year, otherwise use school year start date
      const today = new Date().toISOString().split('T')[0];
      const startDate = schoolYear.start_date;
      const endDate = schoolYear.end_date;
      
      // Check if today is within the school year date range
      if (today >= startDate && today <= endDate) {
        setFormData(prev => ({ ...prev, date: today }));
      } else {
        // Default to school year start date if today is outside range
        setFormData(prev => ({ ...prev, date: startDate }));
      }
    }
  }, [expense, isEditMode, schoolYear]);

  // Form styling based on theme
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonCancel = "bg-gray-500 hover:bg-gray-600";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update character count for description
    if (name === 'description') {
      setCharCount(value.length);
    }
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('expense_name_required');
    } else if (formData.name.length < 3) {
      newErrors.name = t('expense_name_min_length');
    } else if (formData.name.length > 50) {
      newErrors.name = t('expense_name_max_length');
    }

    // Description validation - now mandatory with length requirements
    if (!formData.description.trim()) {
      newErrors.description = t('expense_description_required');
    } else if (formData.description.length < 30) {
      newErrors.description = t('expense_description_min_length');
    } else if (formData.description.length > 10000) {
      newErrors.description = t('expense_description_max_length');
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = t('expense_amount_required');
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('expense_amount_positive');
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = t('expense_date_required');
    }
    
    // Validate that date is within school year range
    if (formData.date && schoolYear) {
      const expenseDate = new Date(formData.date);
      const startDate = new Date(schoolYear.start_date);
      const endDate = new Date(schoolYear.end_date);
      
      // Set time to midnight for accurate date comparison
      expenseDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (expenseDate < startDate || expenseDate > endDate) {
        newErrors.date = t('expense_date_outside_range');
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = t('expense_category_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const timestamp = Date.now();
      const formattedTime = new Date().toLocaleTimeString();
      
      if (isEditMode) {
        // Update existing expense
        const updatedExpenses = expenses.map(exp => 
          exp.id === expense.id 
            ? {
                ...exp,
                name: formData.name,
                description: formData.description,
                amount: formData.amount,
                date: formData.date,
                category: formData.category,
                updated_at: timestamp,
                updated_time: formattedTime
              }
            : exp
        );
        
        const updatedDb = { ...db, expenses: updatedExpenses };
        await window.electron.saveDatabase(updatedDb);
        setExpenses(updatedExpenses);
        
        setFlashMessage({
          message: t('expense_updated'),
          type: "success",
          duration: 3000,
        });
      } else {
        // Create new expense
        const newExpense = {
          id: `expense-${timestamp}`,
          depense_scolaire_id: schoolYearId,
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          date: formData.date,
          category: formData.category,
          created_at: timestamp,
          created_time: formattedTime,
          updated_at: timestamp,
          updated_time: formattedTime
        };
        
        const updatedExpenses = [...expenses, newExpense];
        const updatedDb = { ...db, expenses: updatedExpenses };
        await window.electron.saveDatabase(updatedDb);
        setExpenses(updatedExpenses);
        
        setFlashMessage({
          message: t('expense_created'),
          type: "success",
          duration: 3000,
        });
      }
      
      onCancel();
    } catch (error) {
      console.error("Error saving expense:", error);
      setFlashMessage({
        message: t('error_saving'),
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expense categories
  const categories = [
    { value: 'supplies', label: t('category_supplies') },
    { value: 'equipment', label: t('category_equipment') },
    { value: 'salary', label: t('category_salary') },
    { value: 'rent', label: t('category_rent') },
    { value: 'utilities', label: t('category_utilities') },
    { value: 'maintenance', label: t('category_maintenance') },
    { value: 'events', label: t('category_events') },
    { value: 'other', label: t('category_other') }
  ];
  
  // Get category label from value
  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('back')}
          title={t('back')}
        >
          <ArrowLeft size={24} className={textClass} />
        </button>
        <h2 className={`text-2xl font-bold ${textClass}`}>
          {isEditMode ? t('edit_expense') : t('add_expense')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <div>
          <label htmlFor="name" className={`block mb-2 font-medium ${textClass}`}>
            {t('expense_name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.name ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={t('expense_name_placeholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description" className={`block mb-2 font-medium ${textClass}`}>
            {t('expense_description')} *
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.description ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder={t('expense_description_placeholder')}
            />
            <div className={`text-xs mt-1 flex justify-between ${charCount < 30 ? 'text-red-500' : charCount > 9800 ? 'text-amber-500' : 'text-gray-500'}`}>
              <span>{t('character_count')}: {charCount}</span>
              <span>{t('min_max_chars')}</span>
            </div>
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Amount field */}
        <div>
          <label htmlFor="amount" className={`block mb-2 font-medium ${textClass}`}>
            {t('expense_amount')} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DollarSign size={18} className={textClass} />
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full p-3 pl-10 rounded-lg ${inputBgColor} ${errors.amount ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Date field */}
        <div>
          <label htmlFor="date" className={`block mb-2 font-medium ${textClass}`}>
            {t('expense_date')} *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.date ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            min={schoolYear ? schoolYear.start_date : ''}
            max={schoolYear ? schoolYear.end_date : ''}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.date}
            </p>
          )}
          
          {/* School year date range hint */}
          {schoolYear && (
            <p className="mt-1 text-xs text-blue-500 flex items-center">
              <span>
                {t('start_date')}: {schoolYear.start_date} — {t('end_date')}: {schoolYear.end_date}
              </span>
            </p>
          )}
        </div>

        {/* Category field */}
        <div>
          <label htmlFor="category" className={`block mb-2 font-medium ${textClass}`}>
            {t('expense_category')} *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.category ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Form buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg text-white ${buttonCancel} flex items-center transition-colors`}
            disabled={isSubmitting}
            title={t('cancel_tooltip')}
          >
            <X size={20} className="mr-2" />
            {t('cancel')}
          </button>
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg text-white ${buttonPrimary} flex items-center transition-colors`}
            disabled={isSubmitting}
            title={isEditMode ? t('update_tooltip') : t('save_tooltip')}
          >
            <Check size={20} className="mr-2" />
            {isSubmitting 
              ? t('saving')
              : isEditMode 
                ? t('update')
                : t('save')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExpenseForm; 