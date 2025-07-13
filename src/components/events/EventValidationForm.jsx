import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
  Save,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { translate } from './events_translator';
import {
  validateEventValidationData,
  validateEvent
} from './EventsMethodes';

const EventValidationForm = ({
  isOpen,
  onClose,
  event,
  database,
  setFlashMessage,
  onEventValidated,
  theme,
  app_bg_color,
  text_color
}) => {
  const { language } = useLanguage();
  
  if (!event) return null;
  
  const currentStatus = determineEventStatus(event);

  const [formData, setFormData] = useState({
    success: '',
    failure: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = validateEventValidationData(formData, language);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      const validatedEvent = await validateEvent(event.id, formData, database, setFlashMessage, language);
      onEventValidated(validatedEvent);
      onClose();
      
      // Réinitialiser le formulaire
      setFormData({
        success: '',
        failure: '',
        remarks: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      success: '',
      failure: '',
      remarks: ''
    });
    setErrors({});
    onClose();
  };

  const getTextareaClasses = (hasError = false) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none";
    const themeClasses = theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
    const errorClasses = hasError ? 'border-red-500 focus:ring-red-500' : '';
    
    return `${baseClasses} ${themeClasses} ${errorClasses}`;
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { scale: 0.8, opacity: 0 }
  };

  const fieldVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          variants={formVariants}
          className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } ${text_color}`}
        >
          {/* En-tête */}
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <CheckCircle className="text-green-500" size={28} />
                {translate('validate_event', language)}
              </h2>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {event.title}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Informations de l'événement */}
          <div className={`p-6 border-b ${
            theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {translate('type', language)}:
                </span>
                <span className="ml-2">{translate(event.type, language)}</span>
              </div>
              <div>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {translate('period', language)}:
                </span>
                <span className="ml-2">
                  {event.startDate} - {event.endDate}
                </span>
              </div>
              <div>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {translate('time', language)}:
                </span>
                <span className="ml-2">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div>
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {translate('status', language)}:
                </span>
                <span className="ml-2">{translate(currentStatus, language)}</span>
              </div>
            </div>
          </div>

          {/* Formulaire de validation */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Succès */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {translate('success', language)} *
                </label>
                <textarea
                  value={formData.success}
                  onChange={(e) => handleInputChange('success', e.target.value)}
                  className={getTextareaClasses(errors.success)}
                  rows={4}
                  placeholder={translate('success_placeholder', language)}
                  maxLength={10000}
                />
                <div className="flex justify-between mt-1">
                  {errors.success && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.success}
                    </span>
                  )}
                  <span className={`text-xs ml-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formData.success.length}/10000
                  </span>
                </div>
              </motion.div>

              {/* Échecs */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  {translate('failure', language)} *
                </label>
                <textarea
                  value={formData.failure}
                  onChange={(e) => handleInputChange('failure', e.target.value)}
                  className={getTextareaClasses(errors.failure)}
                  rows={4}
                  placeholder={translate('failure_placeholder', language)}
                  maxLength={10000}
                />
                <div className="flex justify-between mt-1">
                  {errors.failure && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.failure}
                    </span>
                  )}
                  <span className={`text-xs ml-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formData.failure.length}/10000
                  </span>
                </div>
              </motion.div>

              {/* Remarques */}
              <motion.div variants={fieldVariants}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-500" />
                  {translate('remarks', language)} *
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className={getTextareaClasses(errors.remarks)}
                  rows={4}
                  placeholder={translate('remarks_placeholder', language)}
                  maxLength={10000}
                />
                <div className="flex justify-between mt-1">
                  {errors.remarks && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.remarks}
                    </span>
                  )}
                  <span className={`text-xs ml-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formData.remarks.length}/10000
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div 
              variants={fieldVariants}
              className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={isSubmitting}
              >
                {translate('cancel', language)}
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {translate('validating', language)}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {translate('validate', language)}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventValidationForm;