import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const StudentListNamePopup = ({ onSave, onCancel, theme }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate name length
    if (name.length < 6) {
      setError('Le nom doit contenir au moins 6 caractères');
      return;
    }
    
    if (name.length > 60) {
      setError('Le nom ne peut pas dépasser 60 caractères');
      return;
    }
    
    onSave(name);
  };

  // Styles based on theme
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700";

  const popupBgColor = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700';
  const inputBgColor = popupBgColor;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${popupBgColor} rounded-lg shadow-xl w-full max-w-md p-6 ${borderColor} border`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold`}>Nouvelle liste d'élèves</h2>
          <motion.button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="listName" className={`block mb-2`}>
              Nom de la liste
            </label>
            <input
              type="text"
              id="listName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBgColor}`}
              placeholder="Entrez un nom pour votre liste (6-60 caractères)"
              minLength={6}
              maxLength={60}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {name.length}/60 caractères
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              type="button"
              onClick={onCancel}
              className={`${buttonSecondary} px-4 py-2 rounded-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              disabled={name.length < 6}
              className={`${name.length >= 6 ? buttonPrimary : "bg-blue-400"} text-white px-4 py-2 rounded-lg`}
              whileHover={name.length >= 6 ? { scale: 1.05 } : {}}
              whileTap={name.length >= 6 ? { scale: 0.95 } : {}}
            >
              Créer
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StudentListNamePopup;