import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Save, X,
  Info, ArrowLeft, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useLanguage, useFlashNotification } from '../contexts';
import translations from './depense_translator';

const SchoolYearForm = ({
  db,
  schoolYears,
  setSchoolYears,
  schoolYear,
  onCancel,
  text_color,
  theme
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  const isEditMode = Boolean(schoolYear);

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Date constraints - limit to within 1 year before/after today
  const today = new Date();
  const oneYearBefore = new Date(today);
  oneYearBefore.setFullYear(today.getFullYear() - 1);
  const oneYearAfter = new Date(today);
  oneYearAfter.setFullYear(today.getFullYear() + 1);

  const minDate = oneYearBefore.toISOString().split('T')[0];
  const maxDate = oneYearAfter.toISOString().split('T')[0];

  // Initialize form with existing data if editing
  useEffect(() => {
    if (isEditMode && schoolYear) {
      setFormData({
        title: schoolYear.title || '',
        description: schoolYear.description || '',
        start_date: schoolYear.start_date || '',
        end_date: schoolYear.end_date || ''
      });
    } else {
      // Default for new school year - current academic year
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;
      const startMonth = 9; // September
      const endMonth = 6; // June

      let startDate = new Date(currentYear, startMonth - 1, 1); // Sept 1st of current year
      if (today.getMonth() >= 8) { // If we're already in September or later
        startDate = new Date(currentYear, startMonth - 1, 1);
      } else {
        startDate = new Date(currentYear - 1, startMonth - 1, 1);
      }

      let endDate = new Date(nextYear, endMonth - 1, 30); // June 30th of next year
      if (today.getMonth() >= 8) { // If we're already in September or later
        endDate = new Date(nextYear, endMonth - 1, 30);
      } else {
        endDate = new Date(currentYear, endMonth - 1, 30);
      }

      setFormData({
        title: `${t("school_year_title_template").replace("YEAR1", startDate.getFullYear()).replace("YEAR2", endDate.getFullYear())}`,
        description: `${t("school_year_description_template").replace("YEAR1", startDate.getFullYear()).replace("YEAR2", endDate.getFullYear())}`,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
    }
  }, [schoolYear, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormTouched(true);

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = t('title_required');
    } else if (formData.title.trim().length < 10 || formData.title.trim().length > 150) {
      newErrors.title = t('title_length');
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = t('description_required');
    } else if (formData.description.trim().length < 30 || formData.description.trim().length > 10000) {
      newErrors.description = t('description_length');
    }

    // Start date validation
    if (!formData.start_date) {
      newErrors.start_date = t('start_date_required');
    }

    // End date validation
    if (!formData.end_date) {
      newErrors.end_date = t('end_date_required');
    } else if (formData.start_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = t('date_range_invalid');
    }

    // Check if dates are within allowed range (±1 year from today)
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate < oneYearBefore || startDate > oneYearAfter) {
      newErrors.start_date = t('date_range_limit');
    }

    if (endDate < oneYearBefore || endDate > oneYearAfter) {
      newErrors.end_date = t('date_range_limit');
    }

    // Check for duplicate school years (same title, start_date and end_date)
    // Improved to check for all three fields together
    const duplicateCheck = schoolYears.find(year =>
      year.title === formData.title &&
      year.start_date === formData.start_date &&
      year.end_date === formData.end_date &&
      (!isEditMode || (isEditMode && year.id !== schoolYear.id)) // Exclude current year when editing
    );

    if (duplicateCheck) {
      newErrors.title = t('year_already_exists');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = Date.now();

      if (isEditMode) {
        // Update existing school year
        const updatedSchoolYear = {
          ...schoolYear,
          title: formData.title.trim(),
          description: formData.description.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          updated_at: timestamp
        };

        const updatedSchoolYears = schoolYears.map(year =>
          year.id === schoolYear.id ? updatedSchoolYear : year
        );

        const updatedDb = {
          ...db,
          schoolYears: updatedSchoolYears
        };

        await window.electron.saveDatabase(updatedDb);
        setSchoolYears(updatedSchoolYears);

        setFlashMessage({
          message: t('school_year_updated'),
          type: "success",
          duration: 3000,
        });
      } else {
        // Create new school year
        const newSchoolYear = {
          id: `school-year-${timestamp}`,
          title: formData.title.trim(),
          description: formData.description.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          created_at: timestamp,
          updated_at: timestamp
        };

        const updatedSchoolYears = [...schoolYears, newSchoolYear];

        // Sort school years from newest to oldest by start date
        updatedSchoolYears.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

        const updatedDb = {
          ...db,
          schoolYears: updatedSchoolYears
        };

        await window.electron.saveDatabase(updatedDb);
        setSchoolYears(updatedSchoolYears);

        setFlashMessage({
          message: t('school_year_added'),
          type: "success",
          duration: 3000,
        });
      }

      onCancel();
    } catch (error) {
      console.error("Error saving school year:", error);
      setFlashMessage({
        message: isEditMode
          ? t('error_saving')
          : t('error_saving'),
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.07
      }
    }
  };

  const controlVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Theme-based styling
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const inputFocusBorderColor = theme === 'dark' ? 'focus:border-blue-500' : 'focus:border-blue-500';
  const labelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const cancelButtonColor = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const errorColor = 'text-red-500';

  return (
    <motion.div
      className={`${cardBgColor} ${text_color} rounded-xl shadow-xl overflow-hidden border ${borderColor}`}
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="mr-2" size={24} />
            <h2 className="text-2xl font-bold">
              {isEditMode
                ? t('edit_school_year')
                : t('add_school_year')
              }
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
            title={t('cancel')}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title field */}
          <motion.div variants={controlVariants}>
            <div className="flex justify-between">
              <label htmlFor="title" className={`block text-sm font-medium ${labelColor} mb-1`}>
                {t('title')} *
              </label>
              <span className={`text-sm ${mutedTextColor}`}>
                {formData.title.length}/150
              </span>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg ${inputBgColor} ${inputBorderColor} border ${inputFocusBorderColor} focus:ring-2 focus:ring-blue-500 transition-colors ${errors.title ? 'border-red-500' : ''}`}
              placeholder={t('title')}
            />
            {errors.title && (
              <p className={`mt-1 text-sm ${errorColor} flex items-center`}>
                <AlertTriangle size={14} className="mr-1" />
                {errors.title}
              </p>
            )}
          </motion.div>

          {/* Description field */}
          <motion.div variants={controlVariants}>
            <div className="flex justify-between">
              <label htmlFor="description" className={`block text-sm font-medium ${labelColor} mb-1`}>
                {t('description')} *
              </label>
              <span className={`text-sm ${mutedTextColor}`}>
                {formData.description.length}/10000
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg ${inputBgColor} ${inputBorderColor} border ${inputFocusBorderColor} focus:ring-2 focus:ring-blue-500 transition-colors ${errors.description ? 'border-red-500' : ''}`}
              placeholder={t('description')}
              rows="4"
            />
            {errors.description && (
              <p className={`mt-1 text-sm ${errorColor} flex items-center`}>
                <AlertTriangle size={14} className="mr-1" />
                {errors.description}
              </p>
            )}
          </motion.div>

          {/* Dates row */}
          <motion.div variants={controlVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start date field */}
            <div>
              <label htmlFor="start_date" className={`block text-sm font-medium ${labelColor} mb-1`}>
                {t('start_date')} *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${inputBgColor} ${inputBorderColor} border ${inputFocusBorderColor} focus:ring-2 focus:ring-blue-500 transition-colors ${errors.start_date ? 'border-red-500' : ''}`}
                min={minDate}
                max={maxDate}
              />
              {errors.start_date && (
                <p className={`mt-1 text-sm ${errorColor} flex items-center`}>
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.start_date}
                </p>
              )}
            </div>

            {/* End date field */}
            <div>
              <label htmlFor="end_date" className={`block text-sm font-medium ${labelColor} mb-1`}>
                {t('end_date')} *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${inputBgColor} ${inputBorderColor} border ${inputFocusBorderColor} focus:ring-2 focus:ring-blue-500 transition-colors ${errors.end_date ? 'border-red-500' : ''}`}
                min={formData.start_date || minDate}
                max={maxDate}
              />
              {errors.end_date && (
                <p className={`mt-1 text-sm ${errorColor} flex items-center`}>
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.end_date}
                </p>
              )}
            </div>
          </motion.div>

          {/* Note about dates */}
          <motion.div
            variants={controlVariants}
            className={`flex items-start rounded-lg p-4 ${inputBgColor} border ${borderColor}`}
          >
            <Info size={18} className={`${mutedTextColor} flex-shrink-0 mt-0.5 mr-3`} />
            <p className={`text-sm ${mutedTextColor}`}>
              {t('date_range_limit')}
            </p>
          </motion.div>

          {/* Warning about duplicate school years */}
          <motion.div
            variants={controlVariants}
            className={`flex items-start rounded-lg p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50`}
          >
            <AlertTriangle size={18} className={`text-amber-500 flex-shrink-0 mt-0.5 mr-3`} />
            <p className={`text-sm text-amber-700 dark:text-amber-300`}>
              {isEditMode
                ? t('school_year_duplicate_warning_edit')
                : t('school_year_duplicate_warning_create')}
            </p>
          </motion.div>
        </div>

        {/* Form actions */}
        <motion.div
          variants={controlVariants}
          className="mt-8 flex justify-between"
        >
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2 rounded-lg flex items-center ${cancelButtonColor} transition-colors`}
            title={t('cancel')}
          >
            <ArrowLeft size={18} className="mr-2" />
            {t('cancel')}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || (!formTouched && isEditMode)}
            className={`px-5 py-2 rounded-lg flex items-center text-white ${buttonColor} transition-colors ${(isSubmitting || (!formTouched && isEditMode)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            title={t('save')}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving')}
              </>
            ) : (
              <>
                {isEditMode ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                {t('save')}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SchoolYearForm; 