import React, { useState } from "react";
import { MoreVertical, User, RefreshCcw, Trash } from "lucide-react";
import { gradients } from "../utils/colors";
import { useLanguage } from "./contexts.js";
import { getAge, getClasseName } from "../utils/helpers.js";
import { deleteStudent } from "../utils/database_methods";

const StudentsTable = ({
  students,
  openDropdown,
  setOpenDropdown,
  app_bg_color,
  text_color,
  theme,
  setIsAddStudentActive,
  OpenThePopup,
  refreshData, // Fonction de rafraîchissement des données depuis la DB
}) => {
  const { live_language, language } = useLanguage();

  // États de gestion
  const [selected, setSelected] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("default");
  const [filterClass, setFilterClass] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  if (sortCriterion === "last_name") {
    processedStudents.sort((a, b) => a.last_name.localeCompare(b.last_name));
  } else if (sortCriterion === "classe") {
    processedStudents.sort((a, b) => a.classe.localeCompare(b.classe));
  } else if (sortCriterion === "added_at") {
    processedStudents.sort((a, b) => new Date(a.added_at) - new Date(b.added_at));
  }
  const filteredStudents = processedStudents;

  // Rafraîchissement des données avec animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // Activation du formulaire d'ajout d'élève
  const AddStudent = () => {
    setIsAddStudentActive(true);
  };

  // Gestion du dropdown (menu d'options) sur chaque ligne
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Suppression des élèves sélectionnés via la méthode deleteStudent importée
  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        live_language.confirm_delete_selected ||
          "Êtes-vous sûr de vouloir supprimer les élèves sélectionnés ?"
      )
    ) {
      for (const id of selected) {
        try {
          await deleteStudent(id);
        } catch (err) {
          console.error("Erreur lors de la suppression de l'étudiant:", err);
        }
      }
      setSelected([]);
      await refreshData();
    }
  };

  // Couleurs et styles de base
  const popup_bg_hover_color =
    app_bg_color === gradients[1] || theme === "dark"
      ? "hover:bg-gray-500"
      : "hover:bg-blue-400";
  const _head_bg_color = app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color;
  const head_bg_color = _head_bg_color === gradients[2] ? "bg-gray-500" : _head_bg_color;
  const _text_color = app_bg_color === gradients[2] ? "text-gray-500" : text_color;

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
          <p className={`${_text_color} font-medium text-center`}>
            {live_language.no_student_in_data_text}
          </p>
          <p className={`${_text_color} font-medium text-center`}>
            {live_language.create_classe_in_data_text}
          </p>
          <button
            className="flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            onClick={AddStudent}
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
            {live_language.create_classe_btn_text}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "40%" }}>
          {/* Informations sommaires */}
          <div style={{ marginLeft: "1.5%" }} className="flex flex-wrap items-center justify-between mb-2 animate-fadeIn">
            <div className="flex items-center space-x-10">
              <p className={`${_text_color} font-bold text-base transition-transform duration-300 transform hover:scale-105`}>
                {live_language.students_number_text} : {filteredStudents.length}
              </p>
              <p> | </p>
              <p className={`${_text_color} font-bold text-base transition-transform duration-300 transform hover:scale-105`}>
                {live_language.classe_number_text} : {totalClassesAvailable}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full border ${_text_color} ${app_bg_color} border-gray-300 hover:bg-gray-200 transition-colors duration-300`}
              >
                {isRefreshing ? (
                  <RefreshCcw className="animate-spin" size={20} />
                ) : (
                  <RefreshCcw size={20} />
                )}
              </button>
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="p-2 rounded-full border border-gray-300 hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash size={20} className="text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Contrôles de tri, filtrage, recherche et sélection globale */}
          <div className="flex flex-wrap items-center justify-between mb-2 space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>
                {live_language.sort_by_text}:
              </label>
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value)}
                className={`px-2 py-1 rounded border border-gray-300`}
              >
                <option value="default">{/*live_language.default_text*/}Par défaut</option>
                <option value="last_name">{/*live_language.last_name_text*/}Par nom</option>
                <option value="classe">{live_language.classe_text}</option>
                <option value="added_at">{live_language.added_time_text}</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className={`${_text_color} font-semibold`}>
                {live_language.filter_by_class_text}:
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className={`px-2 py-1 rounded border border-gray-300`}
              >
                <option value="All">{live_language.all_text}</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {getClasseName(cls, language)}
                  </option>
                ))}
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
                placeholder={live_language.search_placeholder_text}
                className={`px-2 py-1 rounded ${app_bg_color === gradients[1] ? "bg-gray-300" : app_bg_color} ${_text_color} border border-gray-300`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5"
              />
              <span className={`${_text_color} font-semibold`}>
                {live_language.select_all_text}
              </span>
            </div>
          </div>

          {/* Tableau des élèves avec scroll horizontal si nécessaire */}
          <div className="animate-fadeIn">
            <table
              className="min-w-full table-fixed border-collapse"
              style={{
                borderWidth: "2px",
                borderColor: app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "#e9e9e9" : "white",
              }}
            >
              <thead
                className={`sticky -top-5 ${head_bg_color} ${text_color} shadow-lg`}
                style={{
                    borderWidth: "2px",
                    borderColor: app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "#e9e9e9" : "white",
                    zIndex: 10,
                    margin: 0,
                    padding: 0,
                }}
              >
                <tr className="divide-x divide-white">
                  <th className="w-8 py-1 px-2 border-b border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={selected.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 mx-auto"
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
                    {live_language.age_text}
                  </th>
                  <th className="w-16 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.sexe_text}
                  </th>
                  <th className="w-24 py-1 px-2 border-b border-gray-300 text-center">
                    No matricule
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
                  <th className="w-16 py-1 px-2 border-b border-gray-300 text-center">
                    {live_language.option_text}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${_text_color} divide-x divide-gray-300 ${
                      app_bg_color === gradients[1]
                        ? "hover:bg-white"
                        : app_bg_color === gradients[2]
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-50"
                    } hover:text-gray-700 transition-colors duration-300`}
                  >
                    <td className="py-1 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="w-5 h-5 mx-auto"
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
                      {new Date(student.birth_date).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {getAge(student.birth_date)}
                      <div className="text-center">
                        <b style={{ fontSize: "11px" }}>{live_language.years_text}</b>
                      </div>
                    </td>
                    <td className="py-1 px-2 text-center">{student.sexe}</td>
                    <td className="py-1 px-2 text-center">{student.matricule}</td>
                    <td className="py-1 px-2 text-center">{student.status}</td>
                    <td className="py-1 px-2 text-center">{student.father_name}</td>
                    <td className="py-1 px-2 text-center">{student.mother_name}</td>
                    <td className="py-1 px-2 text-center">{student.parents_contact}</td>
                    <td className="py-1 px-2 text-center">
                      {new Date(student.added_at).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {new Date(student.updated_at).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-2 relative text-center">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="p-2 rounded hover:bg-gray-200 transition-colors duration-200"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openDropdown === index && (
                        <div
                          className={`${app_bg_color} ${_text_color} absolute right-0 top-full -mt-10 w-40 border border-gray-200 rounded shadow-lg z-50 animate-fadeIn`}
                        >
                          <ul>
                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}>
                              {live_language.update_student_text}
                            </li>
                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}>
                              {live_language.see_detail_student_text}
                            </li>
                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}>
                              {live_language.deactive_student_text}
                            </li>
                            <li className={`hover:text-white px-4 py-2 ${popup_bg_hover_color} cursor-pointer transition-colors duration-200`}>
                              {live_language.delete_student_text}
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;
