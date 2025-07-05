import React, { useState, useEffect } from "react";
import {
  User,
  RefreshCcw,
  Trash,
  UserPlus,
  PlusSquare,
  Edit2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { gradients } from "../../utils/colors";
import { useLanguage, useFlashNotification } from "../contexts";
import { getAge, getClasseName, getBornInfos } from "../../utils/helpers";
import {
  deleteStudent,
  activateStudent,
  deactivateStudent,
} from "../../utils/database_methods";
import ActionConfirmePopup from "../popups/ActionConfirmePopup.jsx";
import { translate } from "../students/students_translator";

const StudentsTable = ({
  students,
  classes,
  app_bg_color,
  text_color,
  theme,
  setIsAddStudentActive,
  setIsManageClassesActive,
  refreshData, // Fonction de rafraîchissement des données depuis la database
  database,
  setStudentsForUpdate,
}) => {
  const { live_language, language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  // États de gestion
  const [selected, setSelected] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("last_name"); // last_name, default
  const [filterClass, setFilterClass] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Nouveaux états pour les filtres
  const [filterStatus, setFilterStatus] = useState("actif"); // "All", "actif", "desactif"
  const [filterMatricule, setFilterMatricule] = useState("All"); // "All", "With", "Without"

  // État pour la popup de confirmation
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'delete', 'activate', 'deactivate'
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // Calcul des classes disponibles (uniques et triées ASC)
  const availableClasses = Array.from(
    new Set(students.map((s) => s.classe))
  ).sort((a, b) => a.localeCompare(b));
  const totalClassesAvailable = availableClasses.length;

  // Sélection globale
  const toggleSelectAll = () => {
    if (selected.length === filteredStudents.length) {
      setSelected([]);
    } else {
      setSelected(filteredStudents.map((s) => s.id));
    }
  };

  // Sélection d'un élève
  const toggleSelectStudent = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Filtrage et tri des élèves
  let processedStudents = [...students];
  if (filterClass !== "All") {
    processedStudents = processedStudents.filter(
      (s) => s.classe === filterClass
    );
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    processedStudents = processedStudents.filter(
      (s) =>
        s.name_complet.toLowerCase().includes(term) ||
        s.last_name.toLowerCase().includes(term)
    );
  }
  // Filtre par status
  if (filterStatus !== "All") {
    processedStudents = processedStudents.filter(
      (s) => s.status === filterStatus
    );
  }
  // Filtre par matricule
  if (filterMatricule !== "All") {
    if (filterMatricule === "With") {
      processedStudents = processedStudents.filter(
        (s) => s.matricule && s.matricule !== ""
      );
    } else if (filterMatricule === "Without") {
      processedStudents = processedStudents.filter(
        (s) => !s.matricule || s.matricule === ""
      );
    }
  }
  if (sortCriterion === "last_name") {
    processedStudents.sort((a, b) => a.last_name.localeCompare(b.last_name));
  } else if (sortCriterion === "classe") {
    processedStudents.sort((a, b) => a.classe.localeCompare(b.classe));
  } else if (sortCriterion === "added_at") {
    processedStudents.sort(
      (a, b) => new Date(a.added_at) - new Date(b.added_at)
    );
  }
  const filteredStudents = processedStudents;

  // Définition des états pour l'affichage conditionnel des boutons d'activation/désactivation
  const selectedStudents = filteredStudents.filter((s) =>
    selected.includes(s.id)
  );
  const allActive =
    selectedStudents.length > 0 &&
    selectedStudents.every((s) => s.status === "actif");
  const allInactive =
    selectedStudents.length > 0 &&
    selectedStudents.every((s) => s.status === "desactif");

  // Rafraîchissement des données avec animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      setFlashMessage({
        message: translate("refresh_data_success", language),
        type: "success",
        duration: 5000,
      });
    }, 2000);
  };

  // Rafrîchir la data à render
  useEffect(() => {
    async function fetchData() {
      await refreshData();
    }
    fetchData();
    // console.log(classes);
  }, []);

  // Activation du formulaire d'ajout d'élève
  const handleAddStudent = () => {
    setStudentsForUpdate([]);
    setIsAddStudentActive(true);
  };

  // Activation du formulaire de modification d'élève
  const handleEditStudentSelected = () => {
    const selectedStudentsForEdit = filteredStudents
      .filter((s) => selected.includes(s.id))
      .map((s) => ({
        id: s.id || "",
        first_name: s.first_name || "",
        sure_name: s.sure_name || "",
        last_name: s.last_name || "",
        classe: s.classe || "",
        sexe: s.sexe || "",
        birth_date: s.birth_date || "",
        birth_place: s.birth_place || "",
        matricule: s.matricule || "",
        father_name: s.father_name || "",
        mother_name: s.mother_name || "",
        parents_contact: s.parents_contact || "",
      }));

    setStudentsForUpdate(selectedStudentsForEdit);
    setIsAddStudentActive(true);
  };

  // Activation du formulaire d'ajout d'élève
  const handleAddClasses = () => {
    setStudentsForUpdate([]);
    setIsManageClassesActive(true);
  };

  // Fonction pour gérer les confirmations
  const handleConfirmAction = async () => {
    if (confirmAction === "delete") {
      for (const id of selected) {
        try {
          await deleteStudent(id, database, setFlashMessage, language);
        } catch (err) {
          console.error(translate("error_deleting_student", language), err);
        }
      }
    } else if (confirmAction === "activate") {
      for (const id of selected) {
        try {
          await activateStudent(id, database, setFlashMessage, language);
        } catch (err) {
          console.error(translate("error_activating_student", language), err);
        }
      }
    } else if (confirmAction === "deactivate") {
      for (const id of selected) {
        try {
          await deactivateStudent(id, database, setFlashMessage, language);
        } catch (err) {
          console.error(translate("error_deactivating_student", language), err);
        }
      }
    }

    setSelected([]);
    await refreshData();
    setShowConfirmPopup(false);
  };

  // Suppression des élèves sélectionnés
  const handleDeleteSelected = () => {
    setConfirmAction("delete");
    setConfirmTitle(
      live_language.confirm_delete_title || "Confirmer la suppression"
    );
    setConfirmMessage(
      live_language.confirm_delete_selected ||
        "Êtes-vous sûr de vouloir supprimer les élèves sélectionnés ?"
    );
    setShowConfirmPopup(true);
  };

  // Activation des élèves sélectionnés
  const handleActivateSelected = () => {
    setConfirmAction("activate");
    setConfirmTitle(
      live_language.confirm_activate_title || "Confirmer l'activation"
    );
    setConfirmMessage(
      live_language.confirm_activate_selected ||
        "Êtes-vous sûr de vouloir activer les élèves sélectionnés ?"
    );
    setShowConfirmPopup(true);
  };

  // Désactivation des élèves sélectionnés
  const handleDeactivateSelected = () => {
    setConfirmAction("deactivate");
    setConfirmTitle(
      live_language.confirm_deactivate_title || "Confirmer la désactivation"
    );
    setConfirmMessage(
      live_language.confirm_deactivate_selected ||
        "Êtes-vous sûr de vouloir désactiver les élèves sélectionnés ?"
    );
    setShowConfirmPopup(true);
  };

  // Couleurs et styles de base
  const _head_bg_color =
    app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color;
  const head_bg_color =
    _head_bg_color === gradients[2] ? "bg-gray-500" : _head_bg_color;
  const _text_color =
    app_bg_color === gradients[2] ? "text-gray-500" : text_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";

  // Enhanced styling for expert view
  const tableBorderColor =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-800" : head_bg_color;
  const table_head_text_color =
    app_bg_color === gradients[2] ? "text-white" : text_color;

  const controlsPanelBg = `${app_bg_color} border border-2`;

  return (
    <div className="p-2 sm:p-3 md:p-4 scrollbar-custom overflow-y-hidden overflow-x-auto w-full h-full">
      {students.length <= 0 ? (
        <div
          className={`flex flex-col items-center justify-center p-4 md:p-6 space-y-4 ${app_bg_color} animate-fadeIn mt-8 md:mt-20`}
        >
          {classes.length <= 0 ? (
            <>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.no_student_in_data_text}
              </p>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.create_classe_in_data_text}
              </p>
            </>
          ) : (
            <>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.no_student_in_data_text_2}
              </p>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.create_classe_in_data_text_2}
              </p>
            </>
          )}
          <button
            className="flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded bg-blue-700 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
            onClick={classes.length <= 0 ? handleAddClasses : handleAddStudent}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
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
            {classes.length <= 0
              ? live_language.create_classe_btn_text
              : live_language.create_students_btn_text}
          </button>
        </div>
      ) : (
        <div>
          {/* Informations sommaires */}
          <div
            className={`flex flex-wrap items-center justify-between mb-3 md:mb-4 p-2 md:p-3 rounded-lg shadow-sm ${controlsPanelBg} animate-fadeIn`}
          >
            <div className="flex items-center space-x-4 md:space-x-10 flex-wrap">
              <p
                className={`${_text_color} font-bold text-sm md:text-base transition-transform duration-300 transform hover:scale-105`}
              >
                {live_language.students_number_text} :{" "}
                <span className={`${_text_color}`}>
                  {filteredStudents.length}
                </span>
              </p>
              <span className={`${_text_color} hidden md:inline`}>|</span>
              <p
                className={`${_text_color} font-bold text-sm md:text-base transition-transform duration-300 transform hover:scale-105`}
              >
                {live_language.classe_number_text} :{" "}
                <span className={`${_text_color}`}>
                  {totalClassesAvailable}
                </span>
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-1 md:gap-2 mt-2 md:mt-0">
              {/* Bouton refresh - Enhanced with better hover effect */}
              <button
                onClick={handleRefresh}
                className={`p-1 md:p-2 rounded-full border bg-blue-500 hover:bg-blue-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md`}
                title={live_language.refresh_text || "Rafraîchir"}
              >
                {isRefreshing ? (
                  <RefreshCcw
                    className={`animate-spin text-white w-4 h-4 md:w-5 md:h-5`}
                  />
                ) : (
                  <RefreshCcw className={`text-white w-4 h-4 md:w-5 md:h-5`} />
                )}
              </button>

              {/* Bouton suppression si des éléments sont sélectionnés */}
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="p-1 md:p-2 rounded-full border border-red-300 bg-red-500 hover:bg-red-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
                  title={
                    live_language.delete_selected_text ||
                    "Supprimer la sélection"
                  }
                >
                  <Trash className="text-white w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}

              {/* Boutons d'activation/désactivation - Enhanced with better hover effects */}
              {selected.length > 0 && allActive && (
                <button
                  onClick={handleDeactivateSelected}
                  className="p-1 md:p-2 rounded-full border border-yellow-300 bg-yellow-500 hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
                  title={
                    live_language.deactivate_selected_text ||
                    "Désactiver la sélection"
                  }
                >
                  <XCircle className={`text-white w-4 h-4 md:w-5 md:h-5`} />
                </button>
              )}
              {selected.length > 0 && allInactive && (
                <button
                  onClick={handleActivateSelected}
                  className="p-1 md:p-2 rounded-full border border-green-300 bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
                  title={
                    live_language.activate_selected_text ||
                    "Activer la sélection"
                  }
                >
                  <CheckCircle className={`text-white w-4 h-4 md:w-5 md:h-5`} />
                </button>
              )}
              {selected.length > 0 && !allActive && !allInactive && (
                <>
                  <button
                    onClick={handleDeactivateSelected}
                    className="p-1 md:p-2 rounded-full border border-yellow-300 bg-yellow-500 hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
                    title={
                      live_language.deactivate_selected_text ||
                      "Désactiver la sélection"
                    }
                  >
                    <XCircle className={`text-white w-4 h-4 md:w-5 md:h-5`} />
                  </button>
                  <button
                    onClick={handleActivateSelected}
                    className="p-1 md:p-2 rounded-full border border-green-300 bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md"
                    title={
                      live_language.activate_selected_text ||
                      "Activer la sélection"
                    }
                  >
                    <CheckCircle
                      className={`text-white w-4 h-4 md:w-5 md:h-5`}
                    />
                  </button>
                </>
              )}

              {/* Bouton ajouter un élève - Enhanced with better hover effect */}
              <button
                onClick={handleAddStudent}
                className={`p-1 md:p-2 rounded-full border ${tableBorderColor} bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md`}
                title={live_language.add_student_text || "Ajouter un élève"}
              >
                <UserPlus className={`text-white w-4 h-4 md:w-5 md:h-5`} />
              </button>

              {/* Bouton ajouter une classe - Enhanced with better hover effect */}
              <button
                onClick={handleAddClasses}
                className={`p-1 md:p-2 rounded-full border ${tableBorderColor} bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md`}
                title={live_language.add_class_text || "Ajouter une classe"}
              >
                <PlusSquare className={`text-white w-4 h-4 md:w-5 md:h-5`} />
              </button>

              {/* Bouton modifier des élèves sélectionnés - Enhanced with better hover effect */}
              {selected.length > 0 && (
                <button
                  onClick={handleEditStudentSelected}
                  className={`p-1 md:p-2 rounded-full border ${tableBorderColor} bg-blue-500 hover:bg-blue-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-md`}
                  title={
                    live_language.edit_selected_text || "Modifier la sélection"
                  }
                >
                  <Edit2 className={`text-white w-4 h-4 md:w-5 md:h-5`} />
                </button>
              )}
            </div>
          </div>

          {/* Contrôles de tri, filtrage, recherche et sélection globale */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4 p-2 md:p-3 rounded-lg shadow-sm ${controlsPanelBg} animate-fadeIn`}
          >
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
              <label
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {live_language.sort_by_text || "Trier:"}
              </label>
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value)}
                className={`px-1 md:px-2 py-1 text-xs md:text-sm ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="default">
                  {translate("default_option", language)}
                </option>
                <option value="last_name">
                  {translate("last_name_option", language)}
                </option>
                <option value="classe">{live_language.classe_text}</option>
                <option value="added_at">
                  {live_language.added_time_text}
                </option>
              </select>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
              <label
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {live_language.filter_by_class_text || "Filtrer par classe:"}
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className={`px-1 md:px-2 py-1 text-xs md:text-sm rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="All">{live_language.all_text}</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {getClasseName(cls, language)}
                  </option>
                ))}
              </select>
            </div>
            {/* Nouveau filtre : par status - Enhanced with better focus states */}
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
              <label
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {translate("status", language)}:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-1 md:px-2 py-1 text-xs md:text-sm ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="All">{translate("all", language)}</option>
                <option value="actif">{translate("active", language)}</option>
                <option value="inactif">
                  {translate("inactive", language)}
                </option>
              </select>
            </div>
            {/* Nouveau filtre : par matricule */}
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
              <label
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {translate("matricule", language)}:
              </label>
              <select
                value={filterMatricule}
                onChange={(e) => setFilterMatricule(e.target.value)}
                className={`px-1 md:px-2 py-1 text-xs md:text-sm ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="All">{translate("all", language)}</option>
                <option value="With">
                  {translate("with_matricule_option", language)}
                </option>
                <option value="Without">
                  {translate("without_matricule_option", language)}
                </option>
              </select>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto mb-2 md:mb-0">
              <label
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {live_language.search_text}:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={live_language.recherche_text}
                className={`px-1 md:px-2 py-1 text-xs md:text-sm rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 w-full md:w-auto">
              <input
                type="checkbox"
                checked={
                  selected.length === filteredStudents.length &&
                  filteredStudents.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`${_text_color} font-semibold text-xs md:text-sm`}
              >
                {live_language.select_all_text}
              </span>
            </div>
          </div>

          {/* Tableau des élèves avec scroll horizontal si nécessaire */}
          <div className="animate-fadeIn rounded-lg shadow-md scrollbar-custom overflow-x-auto">
            <table
              className={`min-w-full border-collapse ${tableBorderColor} text-xs md:text-sm`}
              style={{
                borderWidth: "1px",
                tableLayout: "auto",
              }}
            >
              <thead
                className={`sticky top-0 ${tableHeaderBg} ${table_head_text_color} shadow-lg`}
                style={{
                  borderWidth: "2px",
                  borderRadius: 10,
                  borderColor: theme === "dark" ? "#4b5563" : "#e9e9e9",
                  zIndex: 10,
                  margin: 0,
                  padding: 0,
                }}
              >
                <tr
                  className={`divide-x ${
                    theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filteredStudents.length &&
                        filteredStudents.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-3 h-3 md:w-4 md:h-4 mx-auto rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.profile_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.fullname_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.classe_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.birth_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.age_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.sexe_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {translate("matricule", language)}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.status_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.father_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.mother_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.contact_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.added_time_text}
                  </th>
                  <th className="py-1 px-1 md:px-2 border-b border-gray-300 text-center">
                    {live_language.updated_time_text}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filteredStudents.map((student, index) => (
                  <tr
                    title={student.name_complet}
                    // onDoubleClick={() => {}}
                    key={student.id}
                    id={index}
                    className={`${_text_color} divide-x divide-gray-300 transition-colors duration-300 cursor-pointer
                      ${
                        app_bg_color === gradients[1]
                          ? "hover:bg-white hover:text-gray-700"
                          : app_bg_color === gradients[2]
                          ? "hover:bg-gray-200 hover:text-gray-700"
                          : theme === "dark"
                          ? "hover:bg-gray-700 hover:text-white"
                          : "hover:bg-gray-600 hover:bg-opacity-30 hover:text-white"
                      }`}
                  >
                    <td className="py-1 px-1 md:px-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="w-3 h-3 md:w-4 md:h-4 mx-auto rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 ${
                          student.sexe === "F" ? "bg-red-100" : "bg-green-100"
                        } border border-gray-200 rounded-full flex items-center justify-center mx-auto`}
                      >
                        <p
                          className={`w-4 h-4 md:w-5 md:h-5 ${
                            student.sexe === "F"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {student.last_name[0]}
                        </p>
                      </div>
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {student.name_complet}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {getClasseName(student.classe, language)}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {getBornInfos(
                        student.birth_date,
                        student.birth_place,
                        language
                      )}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {getAge(student.birth_date)}
                      <div className="text-center">
                        <b className="text-[9px] md:text-[11px]">
                          {live_language.years_text}
                        </b>
                      </div>
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {language !== "Bambara"
                        ? student.sexe
                        : student.sexe === "F"
                        ? "M"
                        : "C"}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {!student.matricule || student.matricule === ""
                        ? "-"
                        : student.matricule}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {language === "Français"
                        ? student.status
                        : language === "Anglais" && student.status === "actif"
                        ? "active"
                        : language === "Anglais" && student.status === "inactif"
                        ? "inactive"
                        : language === "Bambara" && student.status === "actif"
                        ? "Bɛɲin"
                        : "Tɛɲin"}
                      <div
                        className="text-center mx-auto"
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "10px",
                          borderWidth: "2px",
                          borderColor: "white",
                          backgroundColor:
                            student.status === "actif" ? "green" : "gray",
                          marginTop: "2px",
                        }}
                      ></div>
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {student.father_name || "-"}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {student.mother_name || "-"}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {student.parents_contact || "-"}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {new Date(student.added_at).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-1 md:px-2 text-center">
                      {student.updated_at
                        ? new Date(student.updated_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div
            className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-bounce-subtle hover:scale-105 text-xs md:text-sm"
            style={{
              borderWidth: "2px",
              borderColor: "#FFF",
            }}
          >
            <p>
              {language === "Français"
                ? `${selected.length} élève(s) sélectionné(s)`
                : language === "Anglais"
                ? `${selected.length} student(s) selected`
                : `Kalanden sugandilen : ${selected.length}`}
            </p>
          </div>
        </div>
      )}

      {/* Un seul popup de confirmation pour toutes les actions */}
      <ActionConfirmePopup
        isOpenConfirmPopup={showConfirmPopup}
        setIsOpenConfirmPopup={() => setShowConfirmPopup(false)}
        handleConfirmeAction={handleConfirmAction}
        title={confirmTitle}
        message={confirmMessage}
        actionType={confirmAction === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};

export default StudentsTable;
