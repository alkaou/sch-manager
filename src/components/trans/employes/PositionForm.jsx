import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlignLeft, Info, Eye, EyeOff, Scissors } from 'lucide-react';
import { useTheme, useFlashNotification, useLanguage } from '../contexts';
import { savePosition, updatePosition } from '../../utils/database_methods';
import translations from './employes_translator';

const PositionForm = ({ 
  isOpen, 
  onClose, 
  position = null, 
  database, 
  refreshData 
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const { language } = useLanguage();
  
  const translate = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  // Reset form when opening or changing position
  useEffect(() => {
    if (position) {
      setFormData({
        name: position.name.trim(),
        description: position.description.trim() || ''
      });
      setCharCount(position.description?.length || 0);
    } else {
      setFormData({
        name: '',
        description: ''
      });
      setCharCount(0);
    }
    setErrors({});
  }, [position, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For description field, check character limit
    if (name === 'description') {
      const newValue = value.substring(0, 1000);
      setCharCount(newValue.length);
      setFormData(prev => ({ ...prev, [name]: newValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = translate("position_name_required");
    } else if (formData.name.trim().length < 3) {
      newErrors.name = translate("name_min_length");
    } else if (formData.name.trim().length > 60) {
      newErrors.name = translate("name_max_length");
    }
    
    // Description validation
    if (formData.description.trim().length > 1000) {
      newErrors.description = translate("description_max_length");
    }
    
    // Check if trying to rename Professeurs
    if (position && position.name === 'Professeurs' && formData.name !== 'Professeurs') {
      newErrors.name = translate("professors_position_rename_error");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (position) {
        // Update existing position
        await updatePosition(position.id, formData, database, setFlashMessage);
      } else {
        // Create new position
        await savePosition(formData, database, setFlashMessage);
      }
      
      refreshData();
      onClose();
    } catch (error) {
      if (error.field) {
        setErrors({ [error.field]: error.message });
      } else {
        setFlashMessage({
          type: 'error',
          message: error.message || translate("error_occurred")
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Background and text colors based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const buttonBgColor = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';
  const previewBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';

  const _text_color = app_bg_color === gradients[1] ||
        app_bg_color === gradients[2] ||
        theme === "dark" ? text_color : "text-gray-700";
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const previewVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };
  
  // Calculate character count color based on proximity to limit
  const getCharCountColor = () => {
    if (charCount > 900) {
      return 'text-red-500';
    } else if (charCount > 700) {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  // Format preview text with proper line breaks
  const formatPreviewText = (text) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className={`${_text_color} ${line.trim() ? '' : 'h-3'}`}>
        {line || '\u00A0'}
      </p>
    ));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={`${bgColor} rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh]`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${_text_color}`}>
                {position ? translate("edit_position") : translate("add_new_position")}
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
            
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${_text_color}`}>
                  {translate("position_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={position && position.name === 'Professeurs'}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 
                    focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    ${inputBgColor} ${inputBorderColor} ${_text_color}
                    ${position && position.name === 'Professeurs' ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                  placeholder={translate("position_name_example")}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${_text_color}`}>
                    {translate("description")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getCharCountColor()}`}>
                      {charCount}/1000
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full transition-colors"
                    >
                      {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute top-2 left-2 flex">
                    <Info size={16} className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 pl-10 text-sm rounded-lg transition-all duration-300 
                      focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      ${inputBgColor} ${inputBorderColor} ${_text_color}
                    `}
                    placeholder={translate("position_description")}
                  />
                </div>
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.description}
                  </motion.p>
                )}
                
                <AnimatePresence>
                  {showPreview && formData.description && (
                    <motion.div
                      variants={previewVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`mt-2 p-3 rounded-lg ${previewBgColor} border ${inputBorderColor}`}
                    >
                      <div className="flex items-center mb-2">
                        <AlignLeft size={16} className="text-blue-500 mr-2" />
                        <span className={`text-sm font-medium ${_text_color}`}>{translate("preview")}</span>
                      </div>
                      <div className="text-sm">
                        {formatPreviewText(formData.description)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Scissors size={12} className="mr-1" /> 
                    {translate("formatting_tips")}: 1000 {translate("characters")}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
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
                  disabled={loading || (position && position.name === 'Professeurs')}
                  className={`px-4 py-2 rounded-md text-white 
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : position && position.name === 'Professeurs'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : `${buttonBgColor} hover:bg-blue-600`
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translate("processing")}
                    </span>
                  ) : position ? translate("update") : translate("add")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PositionForm;