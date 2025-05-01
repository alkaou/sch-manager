import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme, useFlashNotification } from '../contexts';
import { savePosition, updatePosition } from '../../utils/database_methods';

const PositionForm = ({ 
  isOpen, 
  onClose, 
  position = null, 
  database, 
  refreshData 
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Reset form when opening or changing position
  useEffect(() => {
    if (position) {
      setFormData({
        name: position.name,
        description: position.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
    setErrors({});
  }, [position, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du poste est obligatoire";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    } else if (formData.name.trim().length > 60) {
      newErrors.name = "Le nom ne peut pas dépasser 60 caractères";
    }
    
    // Check if trying to rename Professeurs
    if (position && position.name === 'Professeurs' && formData.name !== 'Professeurs') {
      newErrors.name = "Le poste 'Professeurs' ne peut pas être renommé";
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
          message: error.message || 'Une erreur est survenue'
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
            className={`${bgColor} rounded-lg shadow-xl w-full max-w-md overflow-hidden`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${_text_color}`}>
                {position ? 'Modifier un poste' : 'Ajouter un nouveau poste'}
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
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${_text_color}`}>
                  Nom du poste <span className="text-red-500">*</span>
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
                  placeholder="Ex: Directeur"
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
                <label className={`block mb-2 text-sm font-medium ${_text_color}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 
                    focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    ${inputBgColor} ${inputBorderColor} ${_text_color}
                  `}
                  placeholder="Description du poste (optionnel)"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${_text_color}`}
                >
                  Annuler
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
                      Traitement...
                    </span>
                  ) : position ? 'Mettre à jour' : 'Ajouter'}
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