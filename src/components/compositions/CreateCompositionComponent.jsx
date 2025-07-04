import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gradients } from "../../utils/colors";
import { translate } from "./compositions_translator";

const CreateCompositionComponent = ({
  compositions,
  isCreateMode,
  setIsCreateMode,
  sortMethod,
  setSortMethod,
  inputBgColor,
  textClass,
  app_bg_color,
  theme,
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
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 1.5,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const _text_color =
    app_bg_color !== gradients[1] && app_bg_color !== gradients[2]
      ? "text-white"
      : textClass;
  const hoverClass =
    app_bg_color === gradients[1]
      ? "hover:bg-white hover:text-gray-700"
      : app_bg_color === gradients[2]
        ? "hover:bg-gray-200 hover:text-gray-700"
        : theme === "dark"
          ? "hover:bg-gray-700 hover:text-white"
          : "hover:bg-gray-600 hover:bg-opacity-30 hover:text-white";

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
                <h3 className={`text-xl font-semibold ${_text_color}`}>
                  {translate("list_of_compositions", language)}
                </h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <label htmlFor="sort" className={`mr-2 ${_text_color}`}>
                      {translate("sort_by", language)}
                    </label>
                    <select
                      id="sort"
                      value={sortMethod}
                      onChange={(e) => setSortMethod(e.target.value)}
                      className={`px-2 py-1 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                    >
                      <option value="date_desc">
                        {translate("date_desc", language)}
                      </option>
                      <option value="date_asc">
                        {translate("date_asc", language)}
                      </option>
                      <option value="name_asc">
                        {translate("name_asc", language)}
                      </option>
                      <option value="name_desc">
                        {translate("name_desc", language)}
                      </option>
                      <option value="created_at_desc">
                        {translate("created_at_desc", language)}
                      </option>
                      <option value="created_at_asc">
                        {translate("created_at_asc", language)}
                      </option>
                    </select>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setIsCreateMode(true)}
                    className={`text-white px-4 py-2 rounded ${buttonAdd} flex items-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={translate("new_composition", language)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {translate("new_composition", language)}
                  </motion.button>
                </div>
              </div>

              {/* Rest of the list view code remains unchanged */}
              {compositions.length === 0 ? (
                <div
                  className={`p-8 text-center ${_text_color} border ${inputBorderColor} rounded-lg`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    {translate("no_composition_recorded", language)}
                  </p>
                  <p className="mt-2">
                    {translate("click_new_composition_to_start", language)}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}
                        >
                          {translate("name", language)}
                        </th>
                        <th
                          className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}
                        >
                          {translate("date", language)}
                        </th>
                        <th
                          className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}
                        >
                          {translate("classes", language)}
                        </th>
                        <th
                          className={`px-2 py-2 border ${inputBorderColor} ${_text_color}`}
                        >
                          {translate("actions", language)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCompositions.map((composition) => {
                        // Check if this composition has more than 2 bulletins and all are locked
                        const compositionBulletins =
                          db?.bulletins?.filter(
                            (bulletin) =>
                              bulletin.compositionId === composition.id
                          ) || [];

                        const isFullyLocked =
                          compositionBulletins.length > 2 &&
                          compositionBulletins.every(
                            (bulletin) => bulletin.isLocked === true
                          );

                        const someBulletinsAreLocked =
                          compositionBulletins.length > 1 &&
                          compositionBulletins.every(
                            (bulletin) => bulletin.isLocked === true
                          );

                        return (
                          <tr
                            key={composition.id}
                            className={`${hoverClass} ${_text_color}`}
                          >
                            <td className="px-2 py-1 border text-center">
                              {composition.label}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {formatDate(composition.date)}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {getClassesNames(composition.classes)}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {isFullyLocked ? (
                                <div
                                  className={`flex items-center justify-center ${_text_color}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                  {translate("locked", language)}
                                </div>
                              ) : (
                                <>
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      handleEditComposition(composition)
                                    }
                                    className={`text-white px-3 py-1 rounded ${buttonPrimary} mr-2 mb-1`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={translate("edit", language)}
                                  >
                                    {translate("edit", language)}
                                  </motion.button>
                                  {!someBulletinsAreLocked && (
                                    <motion.button
                                      type="button"
                                      onClick={() =>
                                        setCompositionToDelete(composition)
                                      }
                                      className={`text-white px-3 py-1 rounded ${buttonDelete}`}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      title={translate("delete", language)}
                                    >
                                      {translate("delete", language)}
                                    </motion.button>
                                  )}
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
                  {editingCompositionId
                    ? translate("edit_composition", language)
                    : translate("new_composition", language)}
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
                  <label className={`block mb-2 ${_text_color}`}>
                    {translate("composition_number", language)}
                  </label>
                  <select
                    value={newComposition.name}
                    onChange={(e) => {
                      const selectedOption = compositionOptions.find(
                        (option) => option.value === e.target.value
                      );
                      setNewComposition({
                        ...newComposition,
                        name: selectedOption.value,
                        helper: selectedOption.helper,
                        label: selectedOption.label,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                  >
                    {compositionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 ${_text_color}`}>
                    {translate("composition_date", language)}
                  </label>
                  <input
                    type="date"
                    value={newComposition.date}
                    onChange={(e) =>
                      handleCompositionChange("date", e.target.value)
                    }
                    max={getCurrentMonthEnd()}
                    className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block mb-2 ${_text_color}`}>
                  {translate("concerned_classes", language)}
                </label>
                {db && db.classes && db.classes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[...db.classes]
                      .sort((a, b) => a.level - b.level)
                      .map((cls) => {
                        // Check if this class has a locked bulletin for this composition
                        const hasLockedBulletin =
                          editingCompositionId &&
                          db.bulletins &&
                          db.bulletins.some(
                            (bulletin) =>
                              bulletin.compositionId === editingCompositionId &&
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
                              className={`mr-2 h-5 w-5 ${hasLockedBulletin
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                                }`}
                            />
                            <label
                              htmlFor={`class-${cls.id}`}
                              className={`${_text_color} ${hasLockedBulletin ? "opacity-60" : ""
                                }`}
                              title={
                                hasLockedBulletin
                                  ? translate(
                                    "locked_bulletin_tooltip",
                                    language
                                  )
                                  : ""
                              }
                            >
                              {getClasseName(`${cls.level} ${cls.name}`)}
                              {hasLockedBulletin && " 🔒"}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className={`${_text_color} italic`}>
                    {translate("no_classes_available", language)}
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
                  title={editingCompositionId
                    ? translate("update_composition", language)
                    : translate("create_composition", language)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {editingCompositionId
                    ? translate("update_composition", language)
                    : translate("create_composition", language)}
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
