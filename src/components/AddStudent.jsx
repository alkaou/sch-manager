import React, { useState, useEffect } from 'react';
import { saveStudent, updateStudent } from '../utils/database_methods';
import { motion } from 'framer-motion';
import { useLanguage } from './contexts.js';
import { gradients } from '../utils/colors';
import { getClasseName, getAge } from "../utils/helpers.js";
import { suggestNames, suggestLastNames, suggNameComplete } from "../utils/suggestionNames.js";
import AutocompleteInput from "./AutocompleteInput.jsx";


const AddStudent = ({
  setIsAddStudentActive,
  app_bg_color,
  text_color,
  theme,
  studentsForUpdate,
  setStudentsForUpdate,
}) => {
  const [db, setDb] = useState(null);
  const { live_language, language } = useLanguage();

  // Objet initial pour un élève
  const initialStudent = {
    first_name: '',
    sure_name: '',
    last_name: '',
    classe: '',
    sexe: '',
    birth_date: '',
    matricule: '',
    father_name: '',
    mother_name: '',
    parents_contact: ''
  };

  const [students, setStudents] = useState([initialStudent]);
  const [errors, setErrors] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

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
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonBgColor = app_bg_color === gradients[1] ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700";
  const buttonDeleteColor = "bg-red-600 hover:bg-red-700";
  const buttonAddColor = "bg-green-600 hover:bg-green-700";
  const shinyBorderColor = theme === "dark" ? "border-blue-400" : "border-purple-400";

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
  };

  const handleRemoveForm = (index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      setErrors(updatedErrors);
    }
  };

  const validateStudents = () => {
    let valid = true;
    const newErrors = students.map((student) => {
      let err = {};
      if (!student.first_name.trim()) {
        err.first_name = "Le prénom est obligatoire.";
        valid = false;
      }
      if (!student.last_name.trim()) {
        err.last_name = "Le nom de famille est obligatoire.";
        valid = false;
      }
      if (student.sure_name.trim() !== "") {
        const st_surename = student.sure_name.trim();
        if (st_surename.length > 30) {
          err.sure_name = "Le surnom est ne doit pas dépasser 30 lettres.";
          valid = false;
        }
      }
      if (!student.classe) {
        err.classe = "La classe est obligatoire.";
        valid = false;
      }
      if (!student.sexe) {
        err.sexe = "Le sexe est obligatoire.";
        valid = false;
      }
      if (!student.birth_date) {
        err.birth_date = "La date de naissance est obligatoire.";
        valid = false;
      }
      if (!student.father_name.trim()) {
        err.father_name = "Le nom du père est obligatoire.";
        valid = false;
      }
      if (!student.mother_name.trim()) {
        err.mother_name = "Le nom de la mère est obligatoire.";
        valid = false;
      }
      if (!student.parents_contact.trim()) {
        err.parents_contact = "Le contact des parents est obligatoire.";
        valid = false;
      }
      if (student.classe && student.birth_date) {
        const match = student.classe.match(/\d+/);
        const student_level = match ? parseInt(match[0], 10) : null;
        if (student_level + 3 > getAge(student.birth_date)) {
          err.birth_date = `L'élève est trop jeune pour la classe ${getClasseName(student.classe)}.`;
          err.classe = `L'élève est trop jeune pour la classe ${getClasseName(student.classe)}.`;
          valid = false;
        }
      }
      return err;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudents()) return;
    setIsLoading(true);
    setSuccess(null);
    const newErrors = [...errors];

    if (studentsForUpdate.length > 0) {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const updatedData = {
          ...student,
          birth_date: new Date(student.birth_date).getTime()
        };
        try {
          await updateStudent(student.id, updatedData, db);
          newErrors[i] = {};
        } catch (err) {
          newErrors[i] = { ...newErrors[i], [err.field]: err.message };
        }
      }
      if (newErrors.every(errObj => Object.keys(errObj).length === 0)) {
        setSuccess("Les élèves ont été mis à jour avec succès !");
        setTimeout(() => setIsAddStudentActive(false), 2000);
      }
    } else {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentData = {
          ...student,
          birth_date: new Date(student.birth_date).getTime()
        };
        try {
          await saveStudent(studentData, db);
          newErrors[i] = {};
        } catch (err) {
          newErrors[i] = { ...newErrors[i], [err.field]: err.message };
        }
      }
      if (newErrors.every(errObj => Object.keys(errObj).length === 0)) {
        setSuccess("Les élèves ont été ajoutés avec succès!");
        setTimeout(() => setIsAddStudentActive(false), 2000);
      }
    }

    setErrors(newErrors);
    setIsLoading(false);
  };

  const classOptions = db && db.classes
    ? [...db.classes]
      .sort((a, b) => a.level - b.level)
      .map(cls => ({
        id: cls.id,
        label: `${cls.level} ${cls.name}`,
        value: `${cls.level} ${cls.name}`
      }))
    : [];

  const commonInputClass = `w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`;

  return (
    <motion.div
      className={`max-w-7xl mx-auto p-2 ${formBgColor} mt-20 rounded-lg shadow-2xl border-2 ${shinyBorderColor} shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ boxShadow: theme === "dark" ? "0 0 15px rgba(66, 153, 225, 0.5)" : "0 0 15px rgba(159, 122, 234, 0.5)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${selectInputTextColor}`}>Ajouter plusieurs élèves</h2>
        <button onClick={() => setIsAddStudentActive(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

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

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse mb-40">
            <thead>
              <tr>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Prénom</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Surnom</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Nom de famille</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Classe</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Sexe</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Date de naissance</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Matricule</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Nom du père</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Nom de la mère</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Contact parents</th>
                <th className={`px-2 py-2 border ${inputBorderColor} ${selectInputTextColor}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-1 border">
                    <AutocompleteInput
                      suggestions={suggestNames}
                      value={student.first_name}
                      placeholder="EX : Fatoumata"
                      inputClass={commonInputClass}
                      onChange={(e) => handleInputChange(index, 'first_name', e.target.value)}
                    />
                    {errors[index]?.first_name && <span className="text-red-500 text-xs">{errors[index].first_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <AutocompleteInput
                      suggestions={suggestNames}
                      value={student.sure_name}
                      placeholder="EX : C"
                      inputClass={commonInputClass}
                      onChange={(e) => handleInputChange(index, 'sure_name', e.target.value)}
                    />
                    {errors[index]?.sure_name && <span className="text-red-500 text-xs">{errors[index].sure_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <AutocompleteInput
                      suggestions={suggestLastNames}
                      value={student.last_name}
                      placeholder="EX : Dembélé"
                      inputClass={commonInputClass}
                      onChange={(e) => handleInputChange(index, 'last_name', e.target.value)}
                    />
                    {errors[index]?.last_name && <span className="text-red-500 text-xs">{errors[index].last_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <select
                      value={student.classe}
                      onChange={(e) => handleInputChange(index, 'classe', e.target.value)}
                      className={commonInputClass}
                    >
                      <option value="">Sélectionnez</option>
                      {classOptions.map(option => (
                        <option key={option.id} value={option.value} style={{ fontWeight: "bold" }}>
                          {getClasseName(option.label, language)}
                        </option>
                      ))}
                    </select>
                    {errors[index]?.classe && <span className="text-red-500 text-xs">{errors[index].classe}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <select
                      value={student.sexe}
                      onChange={(e) => handleInputChange(index, 'sexe', e.target.value)}
                      className={commonInputClass}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                    {errors[index]?.sexe && <span className="text-red-500 text-xs">{errors[index].sexe}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="date"
                      value={
                        student.birth_date
                          ? new Date(student.birth_date).toISOString().substring(0, 10)
                          : ""
                      }
                      onChange={(e) => handleInputChange(index, 'birth_date', e.target.value)}
                      className={commonInputClass}
                    />
                    {errors[index]?.birth_date && <span className="text-red-500 text-xs">{errors[index].birth_date}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.matricule}
                      onChange={(e) => handleInputChange(index, 'matricule', e.target.value)}
                      className={commonInputClass}
                      placeholder="EX : MAT1234"
                    />
                    {errors[index]?.matricule && <span className="text-red-500 text-xs">{errors[index].matricule}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <AutocompleteInput
                      suggestions={suggNameComplete}
                      value={student.father_name}
                      placeholder="EX : Mamadou Dembélé"
                      inputClass={commonInputClass}
                      onChange={(e) => handleInputChange(index, 'father_name', e.target.value)}
                    />
                    {errors[index]?.father_name && <span className="text-red-500 text-xs">{errors[index].father_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <AutocompleteInput
                      suggestions={suggNameComplete}
                      value={student.mother_name}
                      placeholder="EX : Aminata Konaté"
                      inputClass={commonInputClass}
                      onChange={(e) => handleInputChange(index, 'mother_name', e.target.value)}
                    />
                    {errors[index]?.mother_name && <span className="text-red-500 text-xs">{errors[index].mother_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.parents_contact}
                      onChange={(e) => handleInputChange(index, 'parents_contact', e.target.value)}
                      className={commonInputClass}
                      placeholder="EX : +223 76 12 34 56"
                    />
                    {errors[index]?.parents_contact && <span className="text-red-500 text-xs">{errors[index].parents_contact}</span>}
                  </td>
                  <td className="px-2 py-1 border text-center">
                    {students.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => handleRemoveForm(index)}
                        className={`text-white px-2 py-1 rounded ${buttonDeleteColor}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </motion.button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {studentsForUpdate.length > 0 ? null : (
          <div className="flex justify-end mt-4">
            <motion.button
              type="button"
              onClick={handleAddForm}
              className={`text-white px-4 py-2 rounded ${buttonAddColor}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un élève
              </div>
            </motion.button>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`${buttonBgColor} text-white px-6 py-3 rounded flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {studentsForUpdate.length > 0 ? "Mis à jour en cours..." : "Sauvegarde en cours..."}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
                {studentsForUpdate.length > 0 ? "Mettre à jour les informations" : "Sauvegarder tous les élèves"}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStudent;
