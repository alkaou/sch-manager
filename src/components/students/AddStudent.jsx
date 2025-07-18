import React, { useState, useEffect } from "react";
import { saveStudent, updateStudent } from "../../utils/database_methods";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, useFlashNotification } from "../contexts";
import { getClasseName, getAge } from "../../utils/helpers";
import {
  suggestNames,
  suggestLastNames,
  suggNameComplete,
  suggCitiesNames,
} from "../../utils/suggestionNames";
import AutocompleteInput from "../partials/AutocompleteInput.jsx";
import { translate } from "./students_translator.js";

const AddStudent = ({
  setIsAddStudentActive,
  app_bg_color,
  text_color,
  theme,
  studentsForUpdate,
}) => {
  const [db, setDb] = useState(null);
  const { language } = useLanguage();

  // Objet initial pour un élève
  const initialStudent = {
    first_name: "",
    sure_name: "",
    last_name: "",
    classe: "",
    sexe: "",
    birth_date: "",
    birth_place: "",
    matricule: "",
    father_name: "",
    mother_name: "",
    parents_contact: "",
  };

  const [students, setStudents] = useState([initialStudent]);
  const [errors, setErrors] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [particuleError, setParticuleError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const { setFlashMessage } = useFlashNotification();

  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
      if (studentsForUpdate.length > 0) {
        setStudents(studentsForUpdate);
      }
    });
  }, []);

  // Couleurs et classes en fonction du thème
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const selectInputTextColor = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor =
    theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonBgColor = "bg-blue-600 hover:bg-blue-700";
  const buttonDeleteColor = "bg-red-600 hover:bg-red-700";
  const buttonAddColor = "bg-green-600 hover:bg-green-700";
  const shinyBorderColor =
    theme === "dark" ? "border-blue-400" : "border-purple-400";
  const cardBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const tabActiveBgColor = theme === "dark" ? "bg-blue-600" : "bg-purple-500";
  const tabInactiveBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-500";

  // Mise à jour d'un champ pour un élève
  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);

    const updatedErrors = [...errors];
    if (updatedErrors[index] && updatedErrors[index][field]) {
      updatedErrors[index][field] = "";
      setErrors(updatedErrors);
    }
  };

  const handleAddForm = () => {
    setStudents([...students, initialStudent]);
    setErrors([...errors, {}]);
    // Passer au nouvel onglet
    setActiveTab(students.length);
  };

  const handleRemoveForm = (index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      setErrors(updatedErrors);
      // Ajuster l'onglet actif si nécessaire
      if (activeTab >= updatedStudents.length) {
        setActiveTab(updatedStudents.length - 1);
      }
    }
  };

  const validateStudents = async () => {
    let valid = true;
    let st_id = 0;
    const newErrors = students.map((student, index) => {
      let err = {};
      if (!student.first_name.trim()) {
        err.first_name = translate("first_name_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.last_name.trim()) {
        err.last_name = translate("last_name_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (student.sure_name.trim() !== "") {
        const st_surename = student.sure_name.trim();
        if (st_surename.length > 30) {
          err.sure_name = translate("sure_name_too_long", language);
          valid = false;
          st_id = index + 1;
        }
      }
      if (!student.classe) {
        err.classe = translate("class_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.sexe) {
        err.sexe = translate("gender_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.birth_date) {
        err.birth_date = translate("birth_date_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.birth_place || student.birth_place.trim() === "") {
        err.birth_place = translate("birth_place_required", language);
        valid = false;
        st_id = index + 1;
      } else if (student.birth_place.trim().length < 2) {
        err.birth_place = translate("birth_place_min_length", language);
        valid = false;
        st_id = index + 1;
      } else if (student.birth_place.trim().length > 25) {
        err.birth_place = translate("birth_place_max_length", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.father_name.trim()) {
        err.father_name = translate("father_name_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.mother_name.trim()) {
        err.mother_name = translate("mother_name_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (!student.parents_contact.trim()) {
        err.parents_contact = translate("parents_contact_required", language);
        valid = false;
        st_id = index + 1;
      }
      if (student.classe && student.birth_date) {
        const match = student.classe.match(/\d+/);
        const student_level = match ? parseInt(match[0], 10) : null;
        if (student_level + 3 > getAge(student.birth_date)) {
          const classeName = `${student.classe} ${student_level}`.trim();
          err.birth_date =
            translate("student_too_young", language) +
            " " +
            getClasseName(classeName, language);
          err.classe =
            translate("student_too_young", language) +
            " " +
            getClasseName(classeName, language);
          valid = false;
          st_id = index + 1;
        }
      }
      return err;
    });
    setErrors(newErrors);
    return { valid, st_id };
  };

  const handleSubmit = async (e) => {
    setParticuleError(null);
    setSuccess(null);
    e.preventDefault();
    const valid_response = await validateStudents();
    if (!valid_response.valid) {
      const startParticuleErrorText = `${translate(
        "check_student_info",
        language
      )} ${students.length > 1 || studentsForUpdate.length > 1
          ? valid_response.st_id
          : ""
        }`.trim();
      // console.log(startParticuleErrorText);
      setParticuleError(startParticuleErrorText);
      return;
    }

    setIsLoading(true);
    setSuccess(null);
    setParticuleError(null);
    const newErrors = [...errors];

    if (studentsForUpdate.length > 0) {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const updatedData = {
          ...student,
          birth_date: new Date(student.birth_date).getTime(),
        };
        try {
          await updateStudent(student.id, updatedData, db, language);
          newErrors[i] = {};
        } catch (err) {
          newErrors[i] = { ...newErrors[i], [err.field]: err.message };
        }
      }
      if (newErrors.every((errObj) => Object.keys(errObj).length === 0)) {
        setSuccess(translate("students_updated_success", language));
        setFlashMessage({
          message: translate("students_updated_success", language),
          type: "success",
          duration: 8000,
        });
        setTimeout(() => setIsAddStudentActive(false), 2000);
      }
    } else {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentData = {
          ...student,
          birth_date: new Date(student.birth_date).getTime(),
        };
        try {
          await saveStudent(studentData, db, language);
          newErrors[i] = {};
        } catch (err) {
          newErrors[i] = { ...newErrors[i], [err.field]: err.message };
        }
      }
      if (newErrors.every((errObj) => Object.keys(errObj).length === 0)) {
        setSuccess(translate("students_added_success", language));
        setFlashMessage({
          message: translate("students_added_success", language),
          type: "success",
          duration: 8000,
        });
        setTimeout(() => setIsAddStudentActive(false), 2000);
      }
    }

    setErrors(newErrors);
    setIsLoading(false);
  };

  const classOptions =
    db && db.classes
      ? [...db.classes]
        .sort((a, b) => a.level - b.level)
        .map((cls) => ({
          id: cls.id,
          label: `${cls.level} ${cls.name}`.trim(),
          value: `${cls.level} ${cls.name}`.trim(),
        }))
      : [];

  // Styles améliorés pour les inputs
  const commonInputClass = `w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 focus:ring-2 focus:ring-opacity-50 ${theme === "dark" ? "focus:ring-blue-500" : "focus:ring-purple-500"
    } ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`;

  // Animation variants pour les éléments
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  // Rendu du formulaire pour un étudiant spécifique
  const renderStudentForm = (student, index) => {
    return (
      <motion.div
        key={index}
        className={`p-6 rounded-lg shadow-lg ${cardBgColor} mb-6`}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Prénom */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("first_name", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              suggestions={suggestNames}
              value={student.first_name}
              placeholder={translate("placeholder_first_name", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "first_name", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.first_name && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].first_name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Surnom */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("sure_name", language)}
            </label>
            <AutocompleteInput
              suggestions={suggestNames}
              value={student.sure_name}
              placeholder={translate("placeholder_sure_name", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "sure_name", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.sure_name && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].sure_name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Nom de famille */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("last_name", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              suggestions={suggestLastNames}
              value={student.last_name}
              placeholder={translate("placeholder_last_name", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "last_name", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.last_name && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].last_name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Classe */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("classe", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={student.classe}
              onChange={(e) =>
                handleInputChange(index, "classe", e.target.value)
              }
              className={`${commonInputClass} cursor-pointer`}
            >
              <option value="">{translate("select_class", language)}</option>
              {classOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.value}
                  style={{ fontWeight: "bold" }}
                >
                  {getClasseName(option.label, language)}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors[index]?.classe && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].classe}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sexe */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("gender", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={student.sexe}
              onChange={(e) => handleInputChange(index, "sexe", e.target.value)}
              className={`${commonInputClass} cursor-pointer`}
            >
              <option value="">{translate("select", language)}</option>
              <option value="M">{translate("male", language)}</option>
              <option value="F">{translate("female", language)}</option>
            </select>
            <AnimatePresence>
              {errors[index]?.sexe && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].sexe}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Date de naissance */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("birth_date", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={
                student.birth_date
                  ? new Date(student.birth_date).toISOString().substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleInputChange(index, "birth_date", e.target.value)
              }
              className={commonInputClass}
            />
            <AnimatePresence>
              {errors[index]?.birth_date && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].birth_date}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Lieu de naissance - NOUVEAU CHAMP */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("birth_place", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              suggestions={suggCitiesNames}
              value={student.birth_place || ""}
              placeholder={translate("placeholder_birth_place", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "birth_place", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.birth_place && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].birth_place}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Matricule */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("matricule", language)}
            </label>
            <input
              type="text"
              value={student.matricule || ""}
              onChange={(e) =>
                handleInputChange(index, "matricule", e.target.value)
              }
              className={commonInputClass}
              placeholder={translate("placeholder_matricule", language)}
            />
            <AnimatePresence>
              {errors[index]?.matricule && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].matricule}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Nom du père */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("father_name", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              suggestions={suggNameComplete}
              value={student.father_name}
              placeholder={translate("placeholder_father_name", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "father_name", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.father_name && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].father_name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Nom de la mère */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("mother_name", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              suggestions={suggNameComplete}
              value={student.mother_name}
              placeholder={translate("placeholder_mother_name", language)}
              inputClass={commonInputClass}
              onChange={(e) =>
                handleInputChange(index, "mother_name", e.target.value)
              }
            />
            <AnimatePresence>
              {errors[index]?.mother_name && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].mother_name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact parents */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label
              className={`block mb-2 text-sm font-medium ${selectInputTextColor}`}
            >
              {translate("parents_contact", language)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={student.parents_contact}
              onChange={(e) =>
                handleInputChange(index, "parents_contact", e.target.value)
              }
              className={commonInputClass}
              placeholder={translate("placeholder_parents_contact", language)}
            />
            <AnimatePresence>
              {errors[index]?.parents_contact && (
                <motion.div
                  className="text-red-500 text-xs mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors[index].parents_contact}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bouton de suppression */}
        {students.length > 1 && (
          <div className="flex justify-end mt-4">
            <motion.button
              type="button"
              onClick={() => handleRemoveForm(index)}
              className={`text-white px-3 py-2 rounded-lg flex items-center ${buttonDeleteColor}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {translate("delete_this_student", language)}
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`mx-auto p-6 ${formBgColor} mt-10 rounded-xl shadow-2xl border-2 ${shinyBorderColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: "2em",
        marginBottom: "2em",
        boxShadow:
          theme === "dark"
            ? "0 0 25px rgba(66, 153, 225, 0.6)"
            : "0 0 25px rgba(159, 122, 234, 0.6)",
        width: "90%",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className={`text-2xl font-bold ${text_color}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {studentsForUpdate.length > 0
            ? translate("edit_students", language)
            : translate("add_students", language)}
        </motion.h2>
        <motion.button
          onClick={() => setIsAddStudentActive(false)}
          className={`${text_color} hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>

      <AnimatePresence>
        {success || particuleError ? (
          <motion.div
            className={`
              ${success
                ? "bg-green-100 border-l-4 border-green-500 text-green-700 "
                : "bg-red-100 border-l-4 border-red-500 text-red-700 "
              }
              p-4 mb-6 rounded-lg`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              {particuleError ? (
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}
              {success ? success : particuleError}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        {/* Onglets pour plusieurs élèves */}
        {students.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {students.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${activeTab === index ? tabActiveBgColor : tabInactiveBgColor
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translate("student", language)} {index + 1}
              </motion.button>
            ))}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStudentForm(students[activeTab], activeTab)}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Boutons d'action */}
        <div className="flex justify-between mt-5">
          <motion.button
            type="button"
            onClick={() => setIsAddStudentActive(false)}
            className={`text-gray-700 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {translate("cancel", language)}
          </motion.button>

          <motion.button
            type="submit"
            disabled={isLoading}
            className={`text-white px-6 py-3 rounded-lg font-medium flex items-center ${buttonBgColor} ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {translate("processing", language)}
              </>
            ) : (
              <>
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
                {studentsForUpdate.length > 0
                  ? translate("update", language)
                  : translate("save", language)}
              </>
            )}
          </motion.button>

          {/* Bouton pour ajouter un nouvel élève */}
          {studentsForUpdate.length === 0 && (
            <motion.button
              type="button"
              onClick={handleAddForm}
              className={`text-white px-4 py-2 rounded-lg flex items-center ${buttonAddColor}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {translate("add_another_student", language)}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AddStudent;
