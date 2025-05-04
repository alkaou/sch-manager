import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Briefcase } from 'lucide-react';

const StudentListNamePopup = ({
  onSave,
  onCancel,
  theme,
  textClass,
  appBgColor
}) => {
  const [name, setName] = useState('');
  const [listType, setListType] = useState('students');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, listType);
    }
  };

  // Styles based on theme
  const popupBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const buttonPrimary = 'bg-blue-600 hover:bg-blue-700 text-white';
  const buttonSecondary = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  const inputBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const typeButtonActive = theme === "dark" ? "border-blue-500 bg-blue-400 dark:bg-blue-900" : 'border-blue-500 bg-blue-100 dark:bg-blue-900';
  const typeButtonInactive = `border-gray-300 dark:border-gray-600 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} dark:hover:bg-gray-700`;
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${popupBgColor} rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${textClass}`}>Créer une nouvelle liste</h3>
            <motion.button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Fermer"
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="list-name" className={`block mb-2 ${textClass}`}>
                Nom de la liste
              </label>
              <input
                type="text"
                id="list-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${inputBorderColor} ${inputBgColor} ${textClass}`}
                placeholder="Ex: Liste des élèves de 6ème A"
                ref={inputRef}
                required
              />
            </div>

            <div className="mb-6">
              <label className={`block mb-2 ${textClass}`}>
                Type de liste
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setListType('students')}
                  className={`flex-1 p-3 rounded-lg border ${listType === 'students' ? typeButtonActive : typeButtonInactive} flex items-center justify-center ${textClass}`}
                  title="Liste d'élèves"
                >
                  <Users size={20} className="mr-2" />
                  Élèves
                </button>
                <button
                  type="button"
                  onClick={() => setListType('employees')}
                  className={`flex-1 p-3 rounded-lg border ${listType === 'employees' ? typeButtonActive : typeButtonInactive} flex items-center justify-center ${textClass}`}
                  title="Liste d'employés"
                >
                  <Briefcase size={20} className="mr-2" />
                  Employés
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={onCancel}
                className={`px-4 py-2 rounded-lg ${buttonSecondary}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Annuler"
              >
                Annuler
              </motion.button>
              <motion.button
                type="submit"
                disabled={!name.trim()}
                className={`px-4 py-2 rounded-lg text-white ${name.trim() ? buttonPrimary : 'bg-blue-400 cursor-not-allowed'}`}
                whileHover={name.trim() ? { scale: 1.05 } : {}}
                whileTap={name.trim() ? { scale: 0.95 } : {}}
                title="Créer la liste"
              >
                Créer
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentListNamePopup;