import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, AlertTriangle, DollarSign } from 'lucide-react';
import { useLanguage, useFlashNotification } from '../contexts';

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
  const { live_language, language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isEditMode = Boolean(expense);

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
    }
  }, [expense, isEditMode]);

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
      newErrors.name = live_language.expense_name_required || "Le nom de la dépense est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = live_language.expense_name_min_length || "Le nom doit contenir au moins 3 caractères";
    } else if (formData.name.length > 50) {
      newErrors.name = live_language.expense_name_max_length || "Le nom ne peut pas dépasser 50 caractères";
    }

    // Description validation - now mandatory with length requirements
    if (!formData.description.trim()) {
      newErrors.description = live_language.expense_description_required || "La description est requise";
    } else if (formData.description.length < 30) {
      newErrors.description = live_language.expense_description_min_length || "La description doit contenir au moins 30 caractères";
    } else if (formData.description.length > 10000) {
      newErrors.description = live_language.expense_description_max_length || "La description ne peut pas dépasser 10 000 caractères";
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = live_language.expense_amount_required || "Le montant est requis";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = live_language.expense_amount_positive || "Le montant doit être un nombre positif";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = live_language.expense_date_required || "La date est requise";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = live_language.expense_category_required || "La catégorie est requise";
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
          message: live_language.expense_updated || "Dépense mise à jour avec succès !",
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
          message: live_language.expense_created || "Dépense ajoutée avec succès !",
          type: "success",
          duration: 3000,
        });
      }
      
      onCancel();
    } catch (error) {
      console.error("Error saving expense:", error);
      setFlashMessage({
        message: live_language.error_saving || "Erreur lors de l'enregistrement de la dépense",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expense categories
  const categories = [
    { value: 'supplies', label: live_language.category_supplies || "Fournitures" },
    { value: 'equipment', label: live_language.category_equipment || "Équipement" },
    { value: 'salary', label: live_language.category_salary || "Salaires" },
    { value: 'rent', label: live_language.category_rent || "Loyer" },
    { value: 'utilities', label: live_language.category_utilities || "Services" },
    { value: 'maintenance', label: live_language.category_maintenance || "Maintenance" },
    { value: 'events', label: live_language.category_events || "Événements" },
    { value: 'other', label: live_language.category_other || "Autres" }
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
          aria-label="Retour"
          title={live_language.back || "Retour"}
        >
          <ArrowLeft size={24} className={textClass} />
        </button>
        <h2 className={`text-2xl font-bold ${textClass}`}>
          {isEditMode 
            ? (live_language.edit_expense || "Modifier la dépense") 
            : (live_language.add_expense || "Ajouter une dépense")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <div>
          <label htmlFor="name" className={`block mb-2 font-medium ${textClass}`}>
            {live_language.expense_name || "Nom de la dépense"} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.name ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={live_language.expense_name_placeholder || "Nom de la dépense"}
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
            {live_language.expense_description || "Description"} *
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.description ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder={live_language.expense_description_placeholder || "Description détaillée (30-10000 caractères)"}
            />
            <div className={`text-xs mt-1 flex justify-between ${charCount < 30 ? 'text-red-500' : charCount > 9800 ? 'text-amber-500' : 'text-gray-500'}`}>
              <span>{live_language.character_count || "Caractères"}: {charCount}</span>
              <span>{live_language.min_max_chars || "Min: 30 / Max: 10000"}</span>
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
            {live_language.expense_amount || "Montant"} *
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
            {live_language.expense_date || "Date"} *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${inputBgColor} ${errors.date ? 'border-red-500' : inputBorderColor} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Category field */}
        <div>
          <label htmlFor="category" className={`block mb-2 font-medium ${textClass}`}>
            {live_language.expense_category || "Catégorie"} *
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
            title={live_language.cancel_tooltip || "Annuler et revenir à la liste"}
          >
            <X size={20} className="mr-2" />
            {live_language.cancel || "Annuler"}
          </button>
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg text-white ${buttonPrimary} flex items-center transition-colors`}
            disabled={isSubmitting}
            title={isEditMode 
              ? (live_language.update_tooltip || "Enregistrer les modifications") 
              : (live_language.save_tooltip || "Enregistrer la nouvelle dépense")}
          >
            <Check size={20} className="mr-2" />
            {isSubmitting 
              ? (live_language.saving || "Enregistrement...") 
              : isEditMode 
                ? (live_language.update || "Mettre à jour")
                : (live_language.save || "Enregistrer")}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExpenseForm; 