import React, { useState, useEffect } from "react";
import { User, RefreshCcw, Trash, UserPlus, PlusSquare, Edit2, CheckCircle, XCircle } from "lucide-react";
import { gradients } from "../utils/colors";
import { useLanguage, useFlashNotification } from "./contexts";
import { getAge, getClasseName, getBornInfos } from "../utils/helpers";
import { deleteStudent, activateStudent, deactivateStudent } from "../utils/database_methods";
import ActionConfirmePopup from "./ActionConfirmePopup.jsx";

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
  const availableClasses = Array.from(new Set(students.map((s) => s.classe))).sort((a, b) =>
    a.localeCompare(b)
  );
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
    processedStudents = processedStudents.filter((s) => s.classe === filterClass);
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
    processedStudents = processedStudents.filter((s) => s.status === filterStatus);
  }
  // Filtre par matricule
  if (filterMatricule !== "All") {
    if (filterMatricule === "With") {
      processedStudents = processedStudents.filter((s) => s.matricule && s.matricule !== "");
    } else if (filterMatricule === "Without") {
      processedStudents = processedStudents.filter((s) => !s.matricule || s.matricule === "");
    }
  }
  if (sortCriterion === "last_name") {
    processedStudents.sort((a, b) => a.last_name.localeCompare(b.last_name));
  } else if (sortCriterion === "classe") {
    processedStudents.sort((a, b) => a.classe.localeCompare(b.classe));
  } else if (sortCriterion === "added_at") {
    processedStudents.sort((a, b) => new Date(a.added_at) - new Date(b.added_at));
  }
  const filteredStudents = processedStudents;

  // Définition des états pour l'affichage conditionnel des boutons d'activation/désactivation
  const selectedStudents = filteredStudents.filter((s) => selected.includes(s.id));
  const allActive = selectedStudents.length > 0 && selectedStudents.every((s) => s.status === "actif");
  const allInactive = selectedStudents.length > 0 && selectedStudents.every((s) => s.status === "desactif");

  // Rafraîchissement des données avec animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
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
        id: s.id || '',
        first_name: s.first_name || '',
        sure_name: s.sure_name || '',
        last_name: s.last_name || '',
        classe: s.classe || '',
        sexe: s.sexe || '',
        birth_date: s.birth_date || '',
        birth_place: s.birth_place || '',
        matricule: s.matricule || '',
        father_name: s.father_name || '',
        mother_name: s.mother_name || '',
        parents_contact: s.parents_contact || ''
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
    if (confirmAction === 'delete') {
      for (const id of selected) {
        try {
          await deleteStudent(id, database, setFlashMessage);
        } catch (err) {
          console.error("Erreur lors de la suppression de l'étudiant:", err);
        }
      }
    } else if (confirmAction === 'activate') {
      for (const id of selected) {
        try {
          await activateStudent(id, database, setFlashMessage);
        } catch (err) {
          console.error("Erreur lors de l'activation de l'étudiant:", err);
        }
      }
    } else if (confirmAction === 'deactivate') {
      for (const id of selected) {
        try {
          await deactivateStudent(id, database, setFlashMessage);
        } catch (err) {
          console.error("Erreur lors de la désactivation de l'étudiant:", err);
        }
      }
    }

    setSelected([]);
    await refreshData();
    setShowConfirmPopup(false);
  };

  // Suppression des élèves sélectionnés
  const handleDeleteSelected = () => {
    setConfirmAction('delete');
    setConfirmTitle(live_language.confirm_delete_title || "Confirmer la suppression");
    setConfirmMessage(live_language.confirm_delete_selected || "Êtes-vous sûr de vouloir supprimer les élèves sélectionnés ?");
    setShowConfirmPopup(true);
  };

  // Activation des élèves sélectionnés
  const handleActivateSelected = () => {
    setConfirmAction('activate');
    setConfirmTitle(live_language.confirm_activate_title || "Confirmer l'activation");
    setConfirmMessage(live_language.confirm_activate_selected || "Êtes-vous sûr de vouloir activer les élèves sélectionnés ?");
    setShowConfirmPopup(true);
  };

  // Désactivation des élèves sélectionnés
  const handleDeactivateSelected = () => {
    setConfirmAction('deactivate');
    setConfirmTitle(live_language.confirm_deactivate_title || "Confirmer la désactivation");
    setConfirmMessage(live_language.confirm_deactivate_selected || "Êtes-vous sûr de vouloir désactiver les élèves sélectionnés ?");
    setShowConfirmPopup(true);
  };

  // Couleurs et styles de base
  const _head_bg_color = app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color;
  const head_bg_color = _head_bg_color === gradients[2] ? "bg-gray-500" : _head_bg_color;
  const _text_color = app_bg_color === gradients[2] ? "text-gray-500" : text_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";

  // Enhanced styling for expert view
  const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-800" : head_bg_color;
  const table_head_text_color = app_bg_color === gradients[2] ? "text-white" : text_color;

  const controlsPanelBg = theme === "dark"
    ? `${app_bg_color} border`
    : app_bg_color === gradients[1]
      ? "bg-white bg-opacity-90 border"
      : app_bg_color === gradients[2]
        ? "bg-gray-100 border"
        : `${app_bg_color} border`;

  return (
    <div
      className="p-4 overflow-y-auto overflow-x-auto"
      style={{ height: "100vh", marginTop: "2%" }}
    >
      {students.length <= 0 ? (
        <div
          style={{ marginTop: "20%" }}
          className={`flex flex-col items-center justify-center p-6 space-y-4 ${app_bg_color} animate-fadeIn`}
        >
          {classes.length <= 0 ?
            <>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.no_student_in_data_text}
              </p>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.create_classe_in_data_text}
              </p>
            </>
            :
            <>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.no_student_in_data_text_2}
              </p>
              <p className={`${_text_color} font-medium text-center`}>
                {live_language.create_classe_in_data_text_2}
              </p>
            </>
          }
          <button
            className="flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded bg-blue-700 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
            onClick={classes.length <= 0 ? handleAddClasses : handleAddStudent}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {classes.length <= 0 ? live_language.create_classe_btn_text : live_language.create_students_btn_text}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "45%" }}>
          {/* Informations sommaires */}
          <div className={`flex flex-wrap items-center justify-between mb-4 p-3 rounded-lg shadow-sm ${controlsPanelBg} animate-fadeIn`}>
            <div className="flex items-center space-x-10">
              <p className={`${_text_color} font-bold text-base transition-transform duration-300 transform hover:scale-105`}>
                {live_language.students_number_text} : <span className={`${_text_color}`}>{filteredStudents.length}</span>
              </p>
              <span className={`${_text_color}`}>|</span>
              <p className={`${_text_color} font-bold text-base transition-transform duration-300 transform hover:scale-105`}>
                {live_language.classe_number_text} : <span className={`${_text_color}`}>{totalClassesAvailable}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Bouton refresh - Enhanced with better hover effect */}
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full border bg-blue-500 hover:bg-blue-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md`}
                title={live_language.refresh_text || "Rafraîchir"}
              >
                {isRefreshing ? (
                  <RefreshCcw className={`animate-spin text-white`} size={20} />
                ) : (
                  <RefreshCcw className={`text-white`} size={20} />
                )}
              </button>

              {/* Bouton suppression si des éléments sont sélectionnés */}
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="p-2 rounded-full border border-red-300 bg-red-500 hover:bg-red-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
                  title={live_language.delete_selected_text || "Supprimer la sélection"}
                >
                  <Trash size={20} className="text-white" />
                </button>
              )}

              {/* Boutons d'activation/désactivation - Enhanced with better hover effects */}
              {selected.length > 0 && allActive && (
                <button
                  onClick={handleDeactivateSelected}
                  className="p-2 rounded-full border border-yellow-300 bg-yellow-500 hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
                  title={live_language.deactivate_selected_text || "Désactiver la sélection"}
                >
                  <XCircle size={20} className={`text-white`} />
                </button>
              )}
              {selected.length > 0 && allInactive && (
                <button
                  onClick={handleActivateSelected}
                  className="p-2 rounded-full border border-green-300 bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
                  title={live_language.activate_selected_text || "Activer la sélection"}
                >
                  <CheckCircle size={20} className={`text-white`} />
                </button>
              )}
              {selected.length > 0 && !allActive && !allInactive && (
                <>
                  <button
                    onClick={handleDeactivateSelected}
                    className="p-2 rounded-full border border-yellow-300 bg-yellow-500 hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
                    title={live_language.deactivate_selected_text || "Désactiver la sélection"}
                  >
                    <XCircle size={20} className={`text-white`} />
                  </button>
                  <button
                    onClick={handleActivateSelected}
                    className="p-2 rounded-full border border-green-300 bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md"
                    title={live_language.activate_selected_text || "Activer la sélection"}
                  >
                    <CheckCircle size={20} className={`text-white`} />
                  </button>
                </>
              )}

              {/* Bouton ajouter un élève - Enhanced with better hover effect */}
              <button
                onClick={handleAddStudent}
                className={`p-2 rounded-full border ${tableBorderColor} bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md`}
                title={live_language.add_student_text || "Ajouter un élève"}
              >
                <UserPlus size={20} className={`text-white`} />
              </button>

              {/* Bouton ajouter une classe - Enhanced with better hover effect */}
              <button
                onClick={handleAddClasses}
                className={`p-2 rounded-full border ${tableBorderColor} bg-green-500 hover:bg-green-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md`}
                title={live_language.add_class_text || "Ajouter une classe"}
              >
                <PlusSquare size={20} className={`text-white`} />
              </button>

              {/* Bouton modifier des élèves sélectionnés - Enhanced with better hover effect */}
              {selected.length > 0 && (
                <button
                  onClick={handleEditStudentSelected}
                  className={`p-2 rounded-full border ${tableBorderColor} bg-blue-500 hover:bg-blue-600 transition-transform duration-300 transform hover:scale-150 hover:shadow-md`}
                  title={live_language.edit_selected_text || "Modifier la sélection"}
                >
                  <Edit2 size={20} className={`text-white`} />
                </button>
              )}
            </div>
          </div>

          {/* Contrôles de tri, filtrage, recherche et sélection globale */}
          <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-lg shadow-sm ${controlsPanelBg} animate-fadeIn`}>
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>
                {live_language.sort_by_text || "Trier:"}
              </label>
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value)}
                className={`px-2 py-1 ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="default">Défaut</option>
                <option value="last_name">Nom</option>
                <option value="classe">{live_language.classe_text}</option>
                <option value="added_at">{live_language.added_time_text}</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>
                {live_language.filter_by_class_text || "Filtrer par classe:"}
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className={`px-2 py-1 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>Filtrer par status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-2 py-1 ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="All">Tous</option>
                <option value="actif">Les actifs</option>
                <option value="inactif">Les inactifs</option>
              </select>
            </div>
            {/* Nouveau filtre : par matricule - Enhanced with better focus states */}
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>Filtrer par matricule:</label>
              <select
                value={filterMatricule}
                onChange={(e) => setFilterMatricule(e.target.value)}
                className={`px-2 py-1 ${inputBgColor} ${textClass} rounded border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="All">Tous</option>
                <option value="With">Avec matricule</option>
                <option value="Without">Sans matricule</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>
                {live_language.search_text}:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={live_language.recherche_text}
                className={`px-2 py-1 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`${_text_color} font-semibold`}>
                {live_language.select_all_text}
              </span>
            </div>
          </div>

          {/* Tableau des élèves avec scroll horizontal si nécessaire */}
          <div className="animate-fadeIn rounded-lg shadow-md">
            <table
              className={`min-w-full table-fixed border-collapse ${tableBorderColor}`}
              style={{
                borderWidth: "1px",
              }}
            >
              <thead
                className={`sticky -top-5 ${tableHeaderBg} ${table_head_text_color} shadow-lg`}
                style={{
                  borderWidth: "2px",
                  borderRadius: 10,
                  borderColor: theme === "dark" ? "#4b5563" : "#e9e9e9",
                  zIndex: 10,
                  margin: 0,
                  padding: 0,
                }}
              >
                <tr className={`divide-x ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
                  <th className="w-8 py-1 px-2 border-b border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={selected.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 mx-auto rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="w-12 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.profile_text}
                  </th>
                  <th className="w-1/6 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.fullname_text}
                  </th>
                  <th className="w-1/6 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.classe_text}
                  </th>
                  <th className="w-28 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.birth_text}
                  </th>
                  <th className="w-20 py-1 px-2 border-b border-gray-300 text-center">
                    &nbsp;&nbsp;&nbsp;{live_language.age_text}&nbsp;&nbsp;&nbsp;
                  </th>
                  <th className="w-16 py-1 px-2 border-b border-gray-300 text-center">
                    &nbsp;&nbsp;{live_language.sexe_text}&nbsp;&nbsp;
                  </th>
                  <th className="w-24 py-1 px-2 border-b border-gray-300 text-center">
                    Nº matricule
                  </th>
                  <th className="w-20 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.status_text}
                  </th>
                  <th className="w-1/6 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.father_text}
                  </th>
                  <th className="w-1/6 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.mother_text}
                  </th>
                  <th className="w-24 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.contact_text}
                  </th>
                  <th className="w-28 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.added_time_text}
                  </th>
                  <th className="w-28 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.updated_time_text}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filteredStudents.map((student, index) => (
                  <tr
                    title="Double Clique"
                    onDoubleClick={() => { }}
                    key={student.id}
                    className={`${_text_color} divide-x divide-gray-300 ${app_bg_color === gradients[1]
                      ? "hover:bg-white"
                      : app_bg_color === gradients[2]
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-50"
                      } hover:text-gray-700 transition-colors duration-300 cursor-pointer`}
                  >
                    <td className="py-1 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="w-5 h-5 mx-auto rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-1 px-2 text-center">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                        <User className="text-gray-500 text-xs" />
                      </div>
                    </td>
                    <td className="py-1 px-2 text-center">{student.name_complet}</td>
                    <td className="py-1 px-2 text-center">{getClasseName(student.classe, language)}</td>
                    <td className="py-1 px-2 text-center">
                      {getBornInfos(student.birth_date, student.birth_place, language)}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {getAge(student.birth_date)}
                      <div className="text-center">
                        <b style={{ fontSize: "11px" }}>{live_language.years_text}</b>
                      </div>
                    </td>
                    <td className="py-1 px-2 text-center">{student.sexe}</td>
                    <td className="py-1 px-2 text-center">
                      {!student.matricule || student.matricule === "" ? "-" : student.matricule}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {
                        language === "Français" ? student.status :
                          language === "Anglais" && student.status === "actif" ? "active" :
                            language === "Anglais" && student.status === "inactif" ? "inactive" :
                              language === "Bambara" && student.status === "actif" ? "Bɛɲin" : "Tɛɲin"
                      }
                      <div className="text-center" style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "20px",
                        borderWidth: "2px",
                        borderColor: "white",
                        backgroundColor: student.status === "actif" ? "green" : "gray",
                        alignSelf: "center",
                        marginLeft: "35%",
                      }}></div>
                    </td>
                    <td className="py-1 px-2 text-center">{student.father_name || "-"}</td>
                    <td className="py-1 px-2 text-center">{student.mother_name || "-"}</td>
                    <td className="py-1 px-2 text-center">{student.parents_contact || "-"}</td>
                    <td className="py-1 px-2 text-center">
                      {new Date(student.added_at).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-2 text-center">
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

      {/* Un seul popup de confirmation pour toutes les actions */}
      <ActionConfirmePopup
        isOpenConfirmPopup={showConfirmPopup}
        setIsOpenConfirmPopup={() => setShowConfirmPopup(false)}
        handleConfirmeAction={handleConfirmAction}
        title={confirmTitle}
        message={confirmMessage}
        actionType={confirmAction === 'delete' ? "danger" : "primary"}
      />
    </div>
  );
};

export default StudentsTable;