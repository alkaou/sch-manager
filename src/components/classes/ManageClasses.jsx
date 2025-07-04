import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gradients } from "../../utils/colors";
import { getClasseName } from "../../utils/helpers";
import { useLanguage } from "./../contexts";
import { translate } from "./classes_translator";

const ManageClasses = ({
  setIsManageClassesActive,
  app_bg_color,
  text_color,
  theme,
}) => {
  const { language } = useLanguage();
  const [db, setDb] = useState(null);
  const [classes, setClasses] = useState([]); // classes existantes dans la DB
  const [newClasses, setNewClasses] = useState([{ level: "", name: "" }]); // classes à ajouter
  const [errors, setErrors] = useState({}); // erreurs pour le formulaire d'ajout
  const [globalError, setGlobalError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null); // id de la classe en édition
  const [editedClass, setEditedClass] = useState({}); // valeurs éditées
  const [classToDelete, setClassToDelete] = useState(null); // classe dont la suppression est demandée
  const [sortMethod, setSortMethod] = useState("asc"); // default, asc, desc

  // Couleurs et styles
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor =
    theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonPrimary =
    app_bg_color === gradients[1]
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-blue-600 hover:bg-blue-700";
  const buttonDelete = "bg-red-600 hover:bg-red-700";
  const buttonAdd = "bg-green-600 hover:bg-green-700";
  const shinyBorderColor =
    theme === "dark" ? "border-blue-400" : "border-purple-400";
  const hoverClass =
    app_bg_color === gradients[1]
      ? "hover:bg-white hover:text-gray-700"
      : app_bg_color === gradients[2]
        ? "hover:bg-gray-200 hover:text-gray-700"
        : theme === "dark"
          ? "hover:bg-gray-700 hover:text-white"
          : "hover:bg-gray-600 hover:bg-opacity-30 hover:text-white";

  const loadDatabase = async () => {
    try {
      await window.electron.getDatabase().then((data) => {
        setDb(data);
        if (!data.classes) {
          data.classes = [];
        }
        setClasses(data.classes);
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la base de données:", error);
    }
  };

  // Charger la DB et initialiser classes
  useEffect(() => {
    loadDatabase();
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

  // Calculer le nombre d'élèves par classe (supposant que db.students existe)
  const getStudentCount = (className) => {
    if (db && db.students) {
      return db.students.filter((student) => student.classe === className)
        .length;
    }
    return 0;
  };

  // Gestion de l'ajout de nouvelles classes
  const handleNewClassChange = (index, field, value) => {
    const updated = [...newClasses];
    updated[index][field] = value;
    setNewClasses(updated);
    if (errors[`${index}-${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`${index}-${field}`];
      setErrors(updatedErrors);
    }
  };

  const handleAddNewClassRow = () => {
    setNewClasses([...newClasses, { level: "", name: "" }]);
  };

  const handleRemoveNewClassRow = (index) => {
    if (newClasses.length > 1) {
      const updated = newClasses.filter((_, i) => i !== index);
      setNewClasses(updated);
    }
  };

  // Validation des classes à ajouter
  const validateNewClasses = () => {
    let valid = true;
    const newErr = {};
    newClasses.forEach((cls, index) => {
      if (!cls.level) {
        newErr[`${index}-level`] = translate("level_required", language);
        valid = false;
      } else if (isNaN(cls.level) || cls.level < 1 || cls.level > 12) {
        newErr[`${index}-level`] = translate(
          "level_between_1_and_12",
          language
        );
        valid = false;
      }
      const duplicateInDB = classes.find(
        (c) =>
          Number(c.level) === Number(cls.level) &&
          c.name.trim().toLowerCase() === cls.name.trim().toLowerCase()
      );
      if (duplicateInDB) {
        newErr[`${index}-name`] = translate("class_already_exists", language);
        valid = false;
      }
      // Vérification dans la liste des nouvelles classes
      const duplicateInNew = newClasses.filter(
        (c, i) =>
          i !== index &&
          Number(c.level) === Number(cls.level) &&
          c.name.trim().toLowerCase() === cls.name.trim().toLowerCase()
      );
      if (duplicateInNew.length > 0) {
        newErr[`${index}-name`] = translate("class_already_added", language);
        valid = false;
      }
    });
    setErrors(newErr);
    return valid;
  };

  const handleSaveNewClasses = async (e) => {
    e.preventDefault();
    setGlobalError(null);
    if (!validateNewClasses()) return;
    const updatedClasses = [...classes];
    newClasses.forEach((cls) => {
      updatedClasses.push({
        id: `${cls.level}-${cls.name.trim().toLowerCase()}-${Date.now()}`,
        level: Number(cls.level),
        name: cls.name.trim(),
      });
    });
    const updatedDB = { ...db, classes: updatedClasses };

    try {
      await window.electron.saveDatabase(updatedDB);
      setClasses(updatedClasses);
      setNewClasses([{ level: "", name: "" }]);
      setSuccess(translate("new_classes_added_successfully", language));
    } catch (error) {
      setGlobalError(translate("error_saving_classes", language));
    }
  };

  // Popup de confirmation pour suppression
  const confirmDeleteClass = async () => {
    if (!classToDelete) return;
    const updatedClasses = classes.filter((cls) => cls.id !== classToDelete.id);
    const updatedDB = { ...db, classes: updatedClasses };

    try {
      await window.electron.saveDatabase(updatedDB);
      setClasses(updatedClasses);
      setSuccess(translate("class_deleted_successfully", language));
      setClassToDelete(null);
    } catch (error) {
      setGlobalError(translate("error_deleting_class", language));
    }
  };

  // Gestion de l'édition d'une classe existante
  const handleEditClass = (cls) => {
    setEditingClassId(cls.id);
    setEditedClass({ level: cls.level, name: cls.name });
  };

  const handleEditedClassChange = (field, value) => {
    setEditedClass({ ...editedClass, [field]: value });
  };

  const handleUpdateClass = async () => {
    if (
      !editedClass.level ||
      isNaN(editedClass.level) ||
      editedClass.level < 1 ||
      editedClass.level > 12
    ) {
      setGlobalError(translate("level_between_1_and_12", language));
      return;
    }

    // Vérification de la duplication sur la combinaison niveau + nom pour l'édition
    const duplicate = classes.find(
      (cls) =>
        cls.id !== editingClassId &&
        Number(cls.level) === Number(editedClass.level) &&
        cls.name.trim().toLowerCase() === editedClass.name.trim().toLowerCase()
    );
    if (duplicate) {
      setGlobalError(translate("class_already_exists", language));
      return;
    }

    // Trouver la classe originale avant modification
    const originalClass = classes.find((cls) => cls.id === editingClassId);
    const originalClassName =
      `${originalClass.level} ${originalClass.name}`.trim();
    const newClassName = `${editedClass.level} ${editedClass.name}`.trim();

    const updatedClasses = classes.map((cls) => {
      if (cls.id === editingClassId) {
        return {
          ...cls,
          level: Number(editedClass.level),
          name: editedClass.name.trim(),
        };
      }
      return cls;
    });

    // Mettre à jour les élèves associés à cette classe
    let updatedStudents = [];
    if (db.students && originalClassName !== newClassName) {
      updatedStudents = db.students.map((student) => {
        if (student.classe === originalClassName) {
          return { ...student, classe: newClassName, updated_at: Date.now() };
        }
        return student;
      });
    } else {
      updatedStudents = db.students || [];
    }

    const updatedDB = {
      ...db,
      classes: updatedClasses,
      students: updatedStudents,
    };

    try {
      await window.electron.saveDatabase(updatedDB);
      setClasses(updatedClasses);
      setEditingClassId(null);
      setEditedClass({});
      setSuccess(translate("class_updated_successfully", language));
      setGlobalError(null);
      loadDatabase();
    } catch (error) {
      setGlobalError(translate("error_updating_class", language));
    }
  };

  // Tri des classes selon le mode sélectionné
  const sortedClasses = [...classes];
  if (sortMethod === "asc") {
    sortedClasses.sort((a, b) => a.level - b.level);
  } else if (sortMethod === "desc") {
    sortedClasses.sort((a, b) => b.level - a.level);
  }

  return (
    <motion.div
      className={`mx-auto p-6 ${formBgColor} mt-2 mb-5 rounded-lg shadow-2xl border-2 ${shinyBorderColor} shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        boxShadow:
          theme === "dark"
            ? "0 0 15px rgba(66, 153, 225, 0.5)"
            : "0 0 15px rgba(159, 122, 234, 0.5)",
        width: "90%",
      }}
    >
      <div
        className="
        flex justify-between items-center mb-6"
      >
        <h2 className={`text-2xl font-bold ${text_color}`}>
          {translate("manage_classes", language)}
        </h2>
        <button
          onClick={() => setIsManageClassesActive(false)}
          className={`text-white transition-colors
            border border-2 w-10 h-10 bg-red-500/80
            justify-between items-center text-center
            hover:bg-red-700/80
          `}
          style={{ borderRadius: "100%" }}
          title={translate("close", language)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
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

      {/* Section de tri des classes */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${text_color}`}>
          {translate("existing_classes", language)}
        </h3>
        <div>
          <label htmlFor="sort" className={`mr-2 ${text_color}`}>
            {translate("sort_by_level", language)}
          </label>
          <select
            id="sort"
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className={`px-2 py-1 rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
          >
            <option value="default">{translate("default", language)}</option>
            <option value="asc">{translate("ascending", language)}</option>
            <option value="desc">{translate("descending", language)}</option>
          </select>
        </div>
      </div>

      {/* Liste des classes existantes */}
      <div className="mb-8">
        {classes.length === 0 ? (
          <p className={text_color}>
            {translate("no_class_recorded", language)}
          </p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th
                  className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
                >
                  {translate("level", language)}
                </th>
                <th
                  className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
                >
                  {translate("class_name", language)}
                </th>
                <th
                  className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
                >
                  {translate("student_count", language)}
                </th>
                <th
                  className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
                >
                  {translate("actions", language)}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedClasses.map((cls) => (
                <tr key={cls.id} className={`${text_color} ${hoverClass}`}>
                  <td className="px-2 py-1 border text-center">{cls.level}</td>
                  <td className="px-2 py-1 border text-center">
                    {editingClassId === cls.id ? (
                      <input
                        type="text"
                        value={editedClass.name}
                        onChange={(e) =>
                          handleEditedClassChange("name", e.target.value)
                        }
                        className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                      />
                    ) : (
                      getClasseName(`${cls.level} ${cls.name}`.trim(), language)
                    )}
                  </td>
                  <td className="px-2 py-1 border text-center">
                    {getStudentCount(`${cls.level} ${cls.name}`.trim())}
                  </td>
                  <td className="px-2 py-1 border text-center">
                    {editingClassId === cls.id ? (
                      <>
                        <motion.button
                          type="button"
                          onClick={handleUpdateClass}
                          className={`text-white px-3 py-1 rounded ${buttonPrimary} mr-2`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={translate("validate", language)}
                        >
                          {translate("validate", language)}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setEditingClassId(null)}
                          className="text-white px-3 py-1 rounded bg-gray-500 hover:bg-gray-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={translate("cancel", language)}
                        >
                          {translate("cancel", language)}
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          type="button"
                          onClick={() => handleEditClass(cls)}
                          className={`text-white px-3 py-1 rounded ${buttonPrimary} mr-2`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={translate("edit", language)}
                        >
                          {translate("edit", language)}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setClassToDelete(cls)}
                          className={`text-white px-3 py-1 rounded ${buttonDelete}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={translate("delete", language)}
                        >
                          {translate("delete", language)}
                        </motion.button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulaire d'ajout de nouvelles classes */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-2 ${text_color}`}>
          {translate("add_new_classes", language)}
        </h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th
                className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
              >
                {translate("level_1_12", language)}
              </th>
              <th
                className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
              >
                {translate("class_name", language)}
              </th>
              <th
                className={`px-2 py-2 border ${inputBorderColor} ${text_color}`}
              >
                {translate("actions", language)}
              </th>
            </tr>
          </thead>
          <tbody>
            {newClasses.map((cls, index) => (
              <tr key={index} className={`${hoverClass}`}>
                <td className="px-2 py-1 border">
                  <select
                    value={cls.level}
                    onChange={(e) =>
                      handleNewClassChange(index, "level", e.target.value)
                    }
                    className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                  >
                    <option value="">{translate("select", language)}</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  {errors[`${index}-level`] && (
                    <span className="text-red-500 text-xs">
                      {errors[`${index}-level`]}
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 border">
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) =>
                      handleNewClassChange(index, "name", e.target.value)
                    }
                    className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${textClass}`}
                    placeholder={translate("class_name_placeholder", language)}
                  />
                  {errors[`${index}-name`] && (
                    <span className="text-red-500 text-xs">
                      {errors[`${index}-name`]}
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 border text-center">
                  {newClasses.length > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => handleRemoveNewClassRow(index)}
                      className={`text-white px-3 py-1 rounded ${buttonDelete}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={translate("delete", language)}
                    >
                      {translate("delete", language)}
                    </motion.button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <motion.button
            type="button"
            onClick={handleAddNewClassRow}
            className={`text-white px-4 py-2 rounded ${buttonAdd}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={translate("add_row", language)}
          >
            {translate("add_row", language)}
          </motion.button>
        </div>
        <div className="flex justify-center mt-6">
          <motion.button
            type="button"
            onClick={handleSaveNewClasses}
            className={`${buttonPrimary} text-white px-6 py-3 rounded flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={translate("save_classes", language)}
          >
            {translate("save_classes", language)}
          </motion.button>
        </div>
      </div>

      {/* Popup de confirmation de suppression */}
      <AnimatePresence>
        {classToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${app_bg_color} ${text_color} p-6 rounded-lg shadow-xl ${inputBorderColor} border`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                {translate("confirm_delete", language)}
              </h3>
              <p className="mb-6 text-center">
                {translate("confirm_delete_class_message", language)}{" "}
                <span className="font-bold">
                  {getClasseName(
                    `${classToDelete.level} ${classToDelete.name}`,
                    language
                  )}
                </span>{" "}
                ?
              </p>
              <div className="flex justify-around">
                <motion.button
                  type="button"
                  onClick={confirmDeleteClass}
                  className={`text-white px-4 py-2 rounded ${buttonDelete}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={translate("confirm", language)}
                >
                  {translate("confirm", language)}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setClassToDelete(null)}
                  className="text-white px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={translate("cancel", language)}
                >
                  {translate("cancel", language)}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageClasses;
