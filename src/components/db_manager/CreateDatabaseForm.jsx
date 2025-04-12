import React, { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../auth/firebaseService";
import { FaTimes, FaDatabase, FaExclamationTriangle } from "react-icons/fa";
// import { getLocalDatabase } from "./databaseUtils";

const CreateDatabaseForm = ({ onClose, onDatabaseCreated, theme, textColor, user }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name.trim().length < 6) {
      setError("Le nom doit contenir au moins 6 caractères.");
      return;
    }

    if (name.trim().length > 100) {
      setError("Le nom ne peut pas dépasser 100 caractères.");
      return;
    }

    if (description.length > 1000) {
      setError("La description ne peut pas dépasser 1000 caractères.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      
      // Get local database
      // const localData = await getLocalDatabase();
      const localData = null;
      
      // Create new database document in the user's subcollection
      // This matches the path used in getUserDatabases function in firebaseFirestore.js
      const dbRef = collection(db, "users", user.uid, "databases");
      const now = new Date();
      
      await addDoc(dbRef, {
        name: name.trim(),
        description: description.trim(),
        createdAt: now,
        updatedAt: now,
        data: localData || {}
      });
      
      onDatabaseCreated();
    } catch (error) {
      console.error("Error creating database:", error);
      setError("Erreur lors de la création de la base de données.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative w-full max-w-lg rounded-xl shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaDatabase className={`mr-3 text-xl ${textColor}`} />
              <h2 className={`text-xl font-bold ${textColor}`}>
                Nouvelle Base de Données
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"
              }`}
            >
              <FaTimes className={textColor} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded ${
                isDark ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
              } flex items-center`}
            >
              <FaExclamationTriangle className="mr-2" />
              {error}
            </motion.div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className={`block mb-2 font-medium ${textColor}`}>
              Nom de la base de données *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded ${
                isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              } border ${isDark ? "border-gray-600" : "border-gray-300"}`}
              placeholder="Entrez un nom (min 6, max 100 caractères)"
              required
            />
            <p className={`mt-1 text-xs ${textColor} opacity-70`}>
              {name.length}/100 caractères
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className={`block mb-2 font-medium ${textColor}`}>
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded ${
                isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              } border ${isDark ? "border-gray-600" : "border-gray-300"}`}
              placeholder="Entrez une description (max 1000 caractères)"
              rows={4}
            />
            <p className={`mt-1 text-xs ${textColor} opacity-70`}>
              {description.length}/1000 caractères
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDark
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-300 hover:bg-gray-400"
              } ${textColor}`}
            >
              Annuler
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isCreating}
              className={`px-4 py-2 rounded ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white flex items-center`}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                "Créer"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateDatabaseForm;