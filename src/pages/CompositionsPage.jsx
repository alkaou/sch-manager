import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { gradients } from "../utils/colors";
import { getClasseName } from "../utils/helpers";
import { useLanguage } from "../components/contexts";
import ActionConfirmePopup from "../components/popups/ActionConfirmePopup.jsx";
import CreateCompositionComponent from "../components/compositions/CreateCompositionComponent.jsx";
import PageLoading from "../components/partials/PageLoading.jsx";
import { translate } from "../components/compositions/compositions_translator";

const CompositionsPageContent = ({
  app_bg_color,
  text_color,
  theme,
  database,
}) => {
  const { language } = useLanguage();
  const [db, setDb] = useState(database);
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
    label: translate("composition_options", language)
      ? translate("composition_options", language)[0].label
      : "1ère Composition",
    date: new Date().toISOString().split("T")[0],
    classes: [],
  });

  // Couleurs et styles
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  const gestion_text_color =
    app_bg_color !== gradients[1] && app_bg_color !== gradients[2]
      ? "text-white"
      : textClass;
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
    // Check if this class has a locked bulletin for this composition
    const hasLockedBulletin =
      editingCompositionId &&
      db.bulletins &&
      db.bulletins.some(
        (bulletin) =>
          bulletin.compositionId === editingCompositionId &&
          bulletin.classId === classId &&
          bulletin.isLocked === true
      );

    // If the bulletin is locked and the class is already selected, don't allow removal
    if (hasLockedBulletin && newComposition.classes.includes(classId)) {
      return; // Prevent toggling
    }

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
      setGlobalError(translate("error_select_composition_number", language));
      return false;
    }

    if (!newComposition.date) {
      setGlobalError(translate("error_select_composition_date", language));
      return false;
    }

    if (newComposition.classes.length === 0) {
      setGlobalError(translate("error_select_one_class", language));
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
    const duplicate = compositions.find((comp) => {
      if (editingCompositionId && comp.id === editingCompositionId)
        return false;
      return (
        comp.name === newComposition.name &&
        new Date(comp.date).getFullYear() ===
          new Date(newComposition.date).getFullYear() &&
        arraysAreEqual(comp.classes, newComposition.classes)
      );
    });

    if (duplicate) {
      setGlobalError(
        translate("error_composition_already_exists", language).replace(
          "{name}",
          newComposition.name
        )
      );
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
        updatedCompositions = updatedCompositions.map((comp) =>
          comp.id === editingCompositionId
            ? {
                ...comp,
                name: newComposition.name,
                helper: newComposition.helper,
                label: newComposition.label,
                date: newComposition.date,
                classes: newComposition.classes,
              }
            : comp
        );
        setSuccess(translate("success_composition_updated", language));
      } else {
        // Ajout d'une nouvelle composition avec created_at
        const newComp = {
          id: `composition-${Date.now()}`,
          name: newComposition.name,
          helper: newComposition.helper,
          label: newComposition.label,
          date: newComposition.date,
          classes: newComposition.classes,
          created_at: new Date().toISOString(), // Date de création
        };
        updatedCompositions.push(newComp);
        setSuccess(translate("success_composition_created", language));
      }

      const updatedDB = { ...db, compositions: updatedCompositions };
      await window.electron.saveDatabase(updatedDB);

      setCompositions(updatedCompositions);
      resetForm();
    } catch (error) {
      setGlobalError(translate("error_saving_composition", language));
    }
  };

  const handleEditComposition = (composition) => {
    // Check if this composition has more than 2 bulletins and all are locked
    const compositionBulletins =
      db?.bulletins?.filter(
        (bulletin) => bulletin.compositionId === composition.id
      ) || [];

    const isFullyLocked =
      compositionBulletins.length > 2 &&
      compositionBulletins.every((bulletin) => bulletin.isLocked === true);

    // If fully locked, don't allow editing
    if (isFullyLocked) {
      return;
    }

    setEditingCompositionId(composition.id);
    setNewComposition({
      name: composition.name,
      helper: composition.helper,
      label: composition.label,
      date: composition.date,
      classes: [...composition.classes],
    });
    setIsCreateMode(true);
  };

  const compostionBuelletinsAreLocked = async (my_compostion) => {
    const compositionBulletins =
      db?.bulletins?.filter(
        (bulletin) => bulletin.compositionId === my_compostion.id
      ) || [];

    // console.log(compositionBulletins);

    const isFullyLocked =
      compositionBulletins.length > 1 &&
      compositionBulletins.every((bulletin) => bulletin.isLocked === true);

    return isFullyLocked;
  };

  const confirmDeleteComposition = async () => {
    if (!compositionToDelete) return;

    try {
      // Check if this composition has more than 2 bulletins and all are locked
      const isFullyLocked = await compostionBuelletinsAreLocked(
        compositionToDelete
      );

      // If fully locked, don't allow deletion
      if (isFullyLocked) {
        setGlobalError(translate("error_delete_locked_composition", language));
        setCompositionToDelete(null);
        return;
      }

      // Filter out the composition to delete
      const updatedCompositions = compositions.filter(
        (comp) => comp.id !== compositionToDelete.id
      );

      // Also filter out all bulletins related to this composition
      const updatedBulletins = db?.bulletins?.filter(
        (bulletin) => bulletin.compositionId !== compositionToDelete.id
      );

      // console.log(updatedBulletins);

      // Update the database with both changes
      let updatedDB;

      if (db.bulletins && db.bulletins.length > 0 && updatedBulletins) {
        updatedDB = {
          ...db,
          compositions: updatedCompositions,
          bulletins: updatedBulletins,
        };
      } else {
        updatedDB = {
          ...db,
          compositions: updatedCompositions,
        };
      }

      await window.electron.saveDatabase(updatedDB);
      setCompositions(updatedCompositions);
      setSuccess(translate("success_composition_deleted", language));
      setCompositionToDelete(null);
    } catch (error) {
      setGlobalError(translate("error_deleting_composition", language));
      setCompositionToDelete(null);
    }
  };

  const resetForm = () => {
    setNewComposition({
      name: "1",
      helper: "comp",
      label: translate("composition_options", language)
        ? translate("composition_options", language)[0].label
        : "1ère Composition",
      date: new Date().toISOString().split("T")[0],
      classes: [],
    });
    setEditingCompositionId(null);
    setIsCreateMode(false);
  };

  // Formatage de la date pour l'affichage
  // Tableau des mois en bambara
  const bambara_month_array = [
    { Janvier: "Zanwuyekalo" },
    { Février: "Feburuyekalo" },
    { Mars: "Marsikalo" },
    { Avril: "Awirilikalo" },
    { Mai: "Mɛkalo" },
    { Juin: "Zuwenkalo" },
    { Juillet: "Zuyekalo" },
    { Août: "Utikalo" },
    { Septembre: "Sɛtanburukalo" },
    { Octobre: "Ɔkutɔburukalo" },
    { Novembre: "Nowanburukalo" },
    { Décembre: "Desanburukalo" },
  ];

  // On transforme le tableau en simple tableau de chaînes, indexé 0→Janvier, …, 11→Décembre
  const bambaraMonths = bambara_month_array.map((obj) => Object.values(obj)[0]);

  const formatDate = (dateString, language) => {
    const date = new Date(dateString);
    // Pour Français ou Anglais on utilise toLocaleDateString
    if (language === "Français" || language === "Anglais") {
      const locale = language === "Français" ? "fr-FR" : "en-US";
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Sinon on reconstruit la date à la main avec le mois en bambara
    const day = date.getDate(); // jour du mois, 1–31
    const year = date.getFullYear(); // année sur 4 chiffres
    const monthIndex = date.getMonth(); // 0–11
    const monthName = bambaraMonths[monthIndex];

    // Ex. "zanwuyekalo tile 4 2025"
    return `${monthName} tile ${day} san ${year}`;
  };

  // Obtenir le nom des classes pour l'affichage
  const getClassesNames = (classIds) => {
    if (!db || !db.classes) return "";

    return classIds
      .map((id) => {
        const classObj = db.classes.find((cls) => cls.id === id);
        return classObj
          ? getClasseName(`${classObj.level} ${classObj.name}`, language)
          : "";
      })
      .filter(Boolean)
      .join(", ");
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
    sortedCompositions.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  } else if (sortMethod === "created_at_desc") {
    sortedCompositions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  // Obtenir la date maximale (mois en cours)
  const getCurrentMonthEnd = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  const compositionOptions = translate("composition_options", language) || [];

  if (!db) {
    return <PageLoading />;
  }

  return (
    <div
      className="p-4 overflow-auto scrollbar-custom"
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
    >
      <motion.div
        className={`max-w-7xl mx-auto p-6 mt-5 ${formBgColor} rounded-lg shadow-2xl border-2 ${shinyBorderColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow:
            theme === "dark"
              ? "0 0 15px rgba(66, 153, 225, 0.5)"
              : "0 0 15px rgba(159, 122, 234, 0.5)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${gestion_text_color}`}>
            {translate("compositions_management", language)}
          </h2>
          {isCreateMode && (
            <button
              onClick={resetForm}
              title={translate("close", language)}
              className="text-red-700 bg-red-400 p-2 rounded-full justify-center border-2 border items-center hover:text-red-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

        <CreateCompositionComponent
          compositions={compositions}
          isCreateMode={isCreateMode}
          setIsCreateMode={setIsCreateMode}
          sortMethod={sortMethod}
          setSortMethod={setSortMethod}
          inputBgColor={inputBgColor}
          textClass={textClass}
          app_bg_color={app_bg_color}
          theme={theme}
          inputBorderColor={inputBorderColor}
          buttonAdd={buttonAdd}
          setCompositionToDelete={setCompositionToDelete}
          buttonDelete={buttonDelete}
          editingCompositionId={editingCompositionId}
          newComposition={newComposition}
          setNewComposition={setNewComposition}
          compositionOptions={compositionOptions}
          handleCompositionChange={handleCompositionChange}
          db={db}
          getCurrentMonthEnd={getCurrentMonthEnd}
          handleClassToggle={handleClassToggle}
          getClasseName={getClasseName}
          getClassesNames={getClassesNames}
          formatDate={formatDate}
          handleEditComposition={handleEditComposition}
          buttonPrimary={buttonPrimary}
          handleSaveComposition={handleSaveComposition}
          language={language}
          sortedCompositions={sortedCompositions}
          compostionBuelletinsAreLocked={compostionBuelletinsAreLocked}
        />
      </motion.div>

      {/* Popup de confirmation de suppression */}
      <ActionConfirmePopup
        isOpenConfirmPopup={compositionToDelete}
        setIsOpenConfirmPopup={() => setCompositionToDelete(null)}
        handleConfirmeAction={confirmDeleteComposition}
        title={translate("confirm_delete_title", language)}
        message={translate("confirm_delete_message", language)}
        element_info={
          <>
            <span className="font-bold">{compositionToDelete?.name}</span>{" "}
            {translate("of_date", language)}{" "}
            <span className="font-bold">
              {formatDate(compositionToDelete?.date)} ?
            </span>
          </>
        }
      />
    </div>
  );
};

// Wrapper component to get context props
const CompositionsPage = () => {
  const context = useOutletContext();
  return <CompositionsPageContent {...context} />;
};

export default CompositionsPage;
