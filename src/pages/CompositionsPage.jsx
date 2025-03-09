import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { gradients } from '../utils/colors';
import { getClasseName } from '../utils/helpers';
import { useLanguage } from '../components/contexts.js';

const CompositionsPageContent = ({
  app_bg_color,
  text_color,
  theme,
}) => {
  const { live_language, language } = useLanguage();
  const [db, setDb] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingCompositionId, setEditingCompositionId] = useState(null);
  const [compositionToDelete, setCompositionToDelete] = useState(null);
  const [success, setSuccess] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const [sortMethod, setSortMethod] = useState("created_at_desc");

  // Nouvelle composition avec helper et label
  const [newComposition, setNewComposition] = useState({
    name: "1",
    helper: "comp",
    label: "1ère Composition",
    date: new Date().toISOString().split('T')[0],
    classes: []
  });

  // Couleurs et styles
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonPrimary = app_bg_color === gradients[1] ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700";
  const buttonDelete = "bg-red-600 hover:bg-red-700";
  const buttonAdd = "bg-green-600 hover:bg-green-700";
  const shinyBorderColor = theme === "dark" ? "border-blue-400" : "border-purple-400";

  // Charger la DB et initialiser compositions
  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
      if (!data.compositions) {
        data.compositions = [];
      }
      setCompositions(data.compositions);
    });
  }, []);

  // Disparition automatique des messages de succès et d'erreur après 5 secondes
  useEffect(() => {
    if (success || globalError) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setGlobalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, globalError]);

  // Gestion des compositions
  const handleCompositionChange = (field, value) => {
    setNewComposition({ ...newComposition, [field]: value });
  };

  const handleClassToggle = (classId) => {
    const updatedClasses = [...newComposition.classes];
    const index = updatedClasses.indexOf(classId);

    if (index === -1) {
      updatedClasses.push(classId);
    } else {
      updatedClasses.splice(index, 1);
    }

    setNewComposition({ ...newComposition, classes: updatedClasses });
  };

  const validateComposition = () => {
    if (!newComposition.name) {
      setGlobalError("Veuillez sélectionner un numéro de composition.");
      return false;
    }

    if (!newComposition.date) {
      setGlobalError("Veuillez sélectionner une date pour la composition.");
      return false;
    }

    if (newComposition.classes.length === 0) {
      setGlobalError("Veuillez sélectionner au moins une classe pour la composition.");
      return false;
    }

    // Fonction pour comparer deux tableaux (ordre sans importance)
    const arraysAreEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      const sorted1 = [...arr1].sort();
      const sorted2 = [...arr2].sort();
      return sorted1.every((value, index) => value === sorted2[index]);
    };

    // Vérifier la duplication, en excluant la composition en édition (si applicable)
    const duplicate = compositions.find(comp => {
      if (editingCompositionId && comp.id === editingCompositionId) return false;
      return comp.name === newComposition.name &&
             new Date(comp.date).getFullYear() === new Date(newComposition.date).getFullYear() &&
             arraysAreEqual(comp.classes, newComposition.classes);
    });

    if (duplicate) {
      setGlobalError(`La composition ${newComposition.name} existe déjà pour cette année.`);
      return false;
    }

    return true;
  };

  const handleSaveComposition = async () => {
    if (!validateComposition()) return;

    try {
      let updatedCompositions = [...compositions];

      if (editingCompositionId) {
        // Mise à jour d'une composition existante (ne pas modifier created_at)
        updatedCompositions = updatedCompositions.map(comp =>
          comp.id === editingCompositionId
            ? {
                ...comp,
                name: newComposition.name,
                helper: newComposition.helper,
                label: newComposition.label,
                date: newComposition.date,
                classes: newComposition.classes
              }
            : comp
        );
        setSuccess("La composition a été mise à jour avec succès!");
      } else {
        // Ajout d'une nouvelle composition avec created_at
        const newComp = {
          id: `composition-${Date.now()}`,
          name: newComposition.name,
          helper: newComposition.helper,
          label: newComposition.label,
          date: newComposition.date,
          classes: newComposition.classes,
          created_at: new Date().toISOString() // Date de création
        };
        updatedCompositions.push(newComp);
        setSuccess("La composition a été créée avec succès!");
      }

      const updatedDB = { ...db, compositions: updatedCompositions };
      await window.electron.saveDatabase(updatedDB);

      setCompositions(updatedCompositions);
      resetForm();
    } catch (error) {
      setGlobalError("Erreur lors de la sauvegarde de la composition.");
    }
  };

  const handleEditComposition = (composition) => {
    setEditingCompositionId(composition.id);
    setNewComposition({
      name: composition.name,
      helper: composition.helper,
      label: composition.label,
      date: composition.date,
      classes: [...composition.classes]
    });
    setIsCreateMode(true);
  };

  const confirmDeleteComposition = async () => {
    if (!compositionToDelete) return;

    try {
      const updatedCompositions = compositions.filter(comp => comp.id !== compositionToDelete.id);
      const updatedDB = { ...db, compositions: updatedCompositions };

      await window.electron.saveDatabase(updatedDB);
      setCompositions(updatedCompositions);
      setSuccess("La composition a été supprimée avec succès!");
      setCompositionToDelete(null);
    } catch (error) {
      setGlobalError("Erreur lors de la suppression de la composition.");
    }
  };

  const resetForm = () => {
    setNewComposition({
      name: "1",
      helper: "comp",
      label: "1ère Composition",
      date: new Date().toISOString().split('T')[0],
      classes: []
    });
    setEditingCompositionId(null);
    setIsCreateMode(false);
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'Français' ? 'fr-FR' : 'en-US', options);
  };

  // Obtenir le nom des classes pour l'affichage
  const getClassesNames = (classIds) => {
    if (!db || !db.classes) return "";

    return classIds.map(id => {
      const classObj = db.classes.find(cls => cls.id === id);
      return classObj ? getClasseName(`${classObj.level} ${classObj.name}`, language) : "";
    }).filter(Boolean).join(", ");
  };

  // Tri des compositions
  const sortedCompositions = [...compositions];
  if (sortMethod === "date_asc") {
    sortedCompositions.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortMethod === "date_desc") {
    sortedCompositions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortMethod === "name_asc") {
    sortedCompositions.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    );
  } else if (sortMethod === "name_desc") {
    sortedCompositions.sort((a, b) =>
      b.name.localeCompare(a.name, undefined, { numeric: true })
    );
  } else if (sortMethod === "created_at_asc") {
    sortedCompositions.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortMethod === "created_at_desc") {
    sortedCompositions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Obtenir la date maximale (mois en cours)
  const getCurrentMonthEnd = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  // Options pour le numéro de composition avec helper et label
  const compositionOptions = [
    { value: "1", helper: "comp", label: "1ère Composition" },
    { value: "2", helper: "comp", label: "2ème Composition" },
    { value: "3", helper: "comp", label: "3ème Composition" },
    { value: "4", helper: "comp", label: "4ème Composition" },
    { value: "5", helper: "comp", label: "5ème Composition" },
    { value: "6", helper: "comp", label: "6ème Composition" },
    { value: "7", helper: "comp", label: "7ème Composition" },
    { value: "8", helper: "comp", label: "8ème Composition" },
    { value: "9", helper: "comp", label: "9ème Composition" },
    { value: "10", helper: "Trim", label: "1er Trimestre" },
    { value: "11", helper: "Trim", label: "2ème Trimestre" },
    { value: "12", helper: "Trim", label: "3ème Trimestre" },
    { value: "13", helper: "Seme", label: "1er Semestre" },
    { value: "14", helper: "Seme", label: "2ème Semestre" },
    { value: "15", helper: "Seme", label: "3ème Semestre" },
    { value: "16", helper: "Seme", label: "4ème Semestre" },
    { value: "17", helper: "Seme", label: "5ème Semestre" },
    { value: "18", helper: "Seme", label: "6ème Semestre" },
    { value: "19", helper: "Trim", label: "Mini Trimestre" },
    { value: "20", helper: "Def", label: "DEF Blanc" },
    { value: "21", helper: "Bac", label: "BAC Blanc" },
  ];

  return (
    <div className="p-4 mt-20 ml-20">
      <motion.div
        className={`max-w-7xl mx-auto p-6 ${formBgColor} rounded-lg shadow-2xl border-2 ${shinyBorderColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: theme === "dark" ? "0 0 15px rgba(66, 153, 225, 0.5)" : "0 0 15px rgba(159, 122, 234, 0.5)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textClass}`}>Gestion des Compositions</h2>
          {isCreateMode && (
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {globalError && (
          <motion.div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {globalError}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {success}
          </motion.div>
        )}

        {!isCreateMode ? (
          <>
            {/* Section de liste des compositions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${textClass}`}>Liste des Compositions</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <label htmlFor="sort" className={`mr-2 ${textClass}`}>Trier par :</label>
                    <select
                      id="sort"
                      value={sortMethod}
                      onChange={(e) => setSortMethod(e.target.value)}
                      className={`px-2 py-1 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                    >
                      <option value="date_desc">Date (récent → ancien)</option>
                      <option value="date_asc">Date (ancien → récent)</option>
                      <option value="name_asc">Numéro (croissant)</option>
                      <option value="name_desc">Numéro (décroissant)</option>
                      <option value="created_at_desc">Créé (récent → ancien)</option>
                      <option value="created_at_asc">Créé (ancien → récent)</option>
                    </select>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setIsCreateMode(true)}
                    className={`text-white px-4 py-2 rounded ${buttonAdd} flex items-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Composition
                  </motion.button>
                </div>
              </div>

              {compositions.length === 0 ? (
                <div className={`p-8 text-center ${textClass} border ${inputBorderColor} rounded-lg`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">Aucune composition enregistrée</p>
                  <p className="mt-2">Cliquez sur "Nouvelle Composition" pour commencer</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${textClass}`}>Nom</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${textClass}`}>Date</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${textClass}`}>Classes</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${textClass}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCompositions.map((composition) => (
                        <tr key={composition.id} className={`hover:bg-gray-50 hover:text-gray-500 ${textClass}`}>
                          <td className="px-2 py-1 border text-center">{composition.label}</td>
                          <td className="px-2 py-1 border text-center">{formatDate(composition.date)}</td>
                          <td className="px-2 py-1 border text-center">{getClassesNames(composition.classes)}</td>
                          <td className="px-2 py-1 border text-center">
                            <motion.button
                              type="button"
                              onClick={() => handleEditComposition(composition)}
                              className={`text-white px-3 py-1 rounded ${buttonPrimary} mr-2`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Modifier
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => setCompositionToDelete(composition)}
                              className={`text-white px-3 py-1 rounded ${buttonDelete}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Supprimer
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Formulaire de création/édition de composition */}
            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-4 ${textClass}`}>
                {editingCompositionId ? "Modifier la composition" : "Nouvelle composition"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-2 ${textClass}`}>Numéro de composition</label>
                  <select
                    value={newComposition.name}
                    onChange={(e) => {
                      const selectedOption = compositionOptions.find(option => option.value === e.target.value);
                      setNewComposition({
                        ...newComposition,
                        name: selectedOption.value,
                        helper: selectedOption.helper,
                        label: selectedOption.label
                      });
                    }}
                    className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                  >
                    {compositionOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 ${textClass}`}>Date de la composition</label>
                  <input
                    type="date"
                    value={newComposition.date}
                    onChange={(e) => handleCompositionChange('date', e.target.value)}
                    max={getCurrentMonthEnd()}
                    className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block mb-2 ${textClass}`}>Classes concernées</label>
                {db && db.classes && db.classes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {db.classes.map((cls) => (
                      <div key={cls.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`class-${cls.id}`}
                          checked={newComposition.classes.includes(cls.id)}
                          onChange={() => handleClassToggle(cls.id)}
                          className="mr-2 h-5 w-5"
                        />
                        <label htmlFor={`class-${cls.id}`} className={`${textClass}`}>
                          {getClasseName(`${cls.level} ${cls.name}`, language)}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${textClass} italic`}>
                    Aucune classe disponible. Veuillez d'abord créer des classes.
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-8">
                <motion.button
                  type="button"
                  onClick={handleSaveComposition}
                  className={`${buttonPrimary} text-white px-6 py-3 rounded flex items-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!db || !db.classes || db.classes.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingCompositionId ? "Mettre à jour la composition" : "Créer la composition"}
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Popup de confirmation de suppression */}
      <AnimatePresence>
        {compositionToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ${inputBorderColor} border`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center">Confirmer la suppression</h3>
              <p className="mb-6 text-center">
                Voulez-vous vraiment supprimer la composition <span className="font-bold">{compositionToDelete.name}</span> du <span className="font-bold">{formatDate(compositionToDelete.date)}</span> ?
              </p>
              <div className="flex justify-around">
                <motion.button
                  type="button"
                  onClick={confirmDeleteComposition}
                  className={`text-white px-4 py-2 rounded ${buttonDelete}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirmer
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setCompositionToDelete(null)}
                  className="text-white px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrapper component to get context props
const CompositionsPage = () => {
  const context = useOutletContext();
  return <CompositionsPageContent {...context} />;
};

export default CompositionsPage;
