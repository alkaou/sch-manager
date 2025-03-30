import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CreateListPopup = ({ onSubmit, onCancel, theme, text_color }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name.length < 6) {
      setError("Le nom doit contenir au moins 6 caractères");
      return;
    }
    
    if (name.length > 60) {
      setError("Le nom ne doit pas dépasser 60 caractères");
      return;
    }
    
    onSubmit(name);
  };

  // Styles based on theme
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          className={`${bgColor} rounded-lg shadow-xl p-6 w-full max-w-md border ${borderColor}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${textClass}`}>Créer une nouvelle liste</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="list-name" className={`block mb-2 text-sm font-medium ${textClass}`}>
                Nom de la liste
              </label>
              <input
                type="text"
                id="list-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full px-3 py-2 rounded-md border ${borderColor} ${inputBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Entrez le nom de votre liste (6-60 caractères)"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {name.length}/60 caractères
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Annuler
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Créer
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateListPopup;