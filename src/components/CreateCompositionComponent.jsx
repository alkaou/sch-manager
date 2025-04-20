import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gradients } from "../utils/colors";

const CreateCompositionComponent = ({
  compositions,
  isCreateMode,
  setIsCreateMode,
  sortMethod,
  setSortMethod,
  inputBgColor,
  textClass,
  app_bg_color,
  inputBorderColor,
  buttonAdd,
  setCompositionToDelete,
  buttonDelete,
  editingCompositionId,
  newComposition,
  setNewComposition,
  compositionOptions,
  handleCompositionChange,
  db,
  getCurrentMonthEnd,
  handleClassToggle,
  getClasseName,
  getClassesNames,
  formatDate,
  handleEditComposition,
  buttonPrimary,
  handleSaveComposition,
  language,
  sortedCompositions,
}) => {
  // Animation variants for the form
  const formVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 1.5
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const _text_color = app_bg_color !== gradients[1] && app_bg_color !== gradients[2] ? "text-white" : textClass;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isCreateMode ? (
          <motion.div
            key="list-view"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            {/* Section de liste des compositions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${_text_color}`}>Liste des Compositions</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <label htmlFor="sort" className={`mr-2 ${_text_color}`}>Trier par :</label>
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

              {/* Rest of the list view code remains unchanged */}
              {compositions.length === 0 ? (
                <div className={`p-8 text-center ${_text_color} border ${inputBorderColor} rounded-lg`}>
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
                        <th className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}>Nom</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}>Date</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}>Classes</th>
                        <th className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCompositions.map((composition) => {
                        // Check if this composition has more than 2 bulletins and all are locked
                        const compositionBulletins = db?.bulletins?.filter(bulletin =>
                          bulletin.compositionId === composition.id
                        ) || [];

                        const isFullyLocked = compositionBulletins.length > 2 &&
                          compositionBulletins.every(bulletin => bulletin.isLocked === true);

                        return (
                          <tr key={composition.id} className={`hover:bg-gray-50 hover:text-gray-500 ${_text_color}`}>
                            <td className="px-2 py-1 border text-center">{composition.label}</td>
                            <td className="px-2 py-1 border text-center">{formatDate(composition.date)}</td>
                            <td className="px-2 py-1 border text-center">{getClassesNames(composition.classes)}</td>
                            <td className="px-2 py-1 border text-center">
                              {isFullyLocked ? (
                                <div className="flex items-center justify-center text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  Locked
                                </div>
                              ) : (
                                <>
                                  <motion.button
                                    type="button"
                                    onClick={() => handleEditComposition(composition)}
                                    className={`text-white px-3 py-1 rounded ${buttonPrimary} mr-2 mb-1`}
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
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-view"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="relative"
          >
            {/* Formulaire de création/édition de composition */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${_text_color}`}>
                  {editingCompositionId ? "Modifier la composition" : "Nouvelle composition"}
                </h3>
                {/* <motion.button
                  type="button"
                  onClick={() => setIsCreateMode(false)}
                  className={`text-white px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 flex items-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Retour
                </motion.button> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-2 ${_text_color}`}>Numéro de composition</label>
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
                  <label className={`block mb-2 ${_text_color}`}>Date de la composition</label>
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
                <label className={`block mb-2 ${_text_color}`}>Classes concernées</label>
                {db && db.classes && db.classes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[...db.classes]
                      .sort((a, b) => a.level - b.level)
                      .map((cls) => {
                        // Check if this class has a locked bulletin for this composition
                        const hasLockedBulletin = editingCompositionId && db.bulletins && db.bulletins.some(
                          bulletin => bulletin.compositionId === editingCompositionId &&
                            bulletin.classId === cls.id &&
                            bulletin.isLocked === true
                        );

                        return (
                          <div key={cls.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`class-${cls.id}`}
                              checked={newComposition.classes.includes(cls.id)}
                              onChange={() => handleClassToggle(cls.id)}
                              disabled={hasLockedBulletin}
                              className={`mr-2 h-5 w-5 ${hasLockedBulletin ? 'opacity-60 cursor-not-allowed' : ''}`}
                            />
                            <label
                              htmlFor={`class-${cls.id}`}
                              className={`${_text_color} ${hasLockedBulletin ? 'opacity-60' : ''}`}
                              title={hasLockedBulletin ? "Bulletin verrouillé - impossible de retirer cette classe" : ""}
                            >
                              {getClasseName(`${cls.level} ${cls.name}`, language)}
                              {hasLockedBulletin && " 🔒"}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className={`${_text_color} italic`}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateCompositionComponent;