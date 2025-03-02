import React, { useState, useEffect } from 'react';
import { saveStudent } from '../utils/database_methods';
import { motion } from 'framer-motion';
import { useLanguage } from './contexts.js';
import { gradients } from '../utils/colors';

const AddStudent = ({ setIsAddStudentActive, app_bg_color, text_color, theme }) => {
  const [db, setDb] = useState(null);
  const { live_language } = useLanguage();

  // On charge la DB, qui doit contenir la propriété "classes" avec les classes disponibles
  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
    });
  }, []);

  // Objet initial pour un élève (toutes les infos sont vides)
  // Le champ "matricule" est ajouté et est non obligatoire
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

  // On démarre avec un seul formulaire d'élève et un objet d'erreurs associé
  const [students, setStudents] = useState([initialStudent]);
  const [errors, setErrors] = useState([{}]); // Assurez-vous que c'est un tableau !
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Déterminer les couleurs en fonction du thème
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const selectInputTextColor = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonBgColor = app_bg_color === gradients[1] ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700";
  const buttonDeleteColor = "bg-red-600 hover:bg-red-700";
  const buttonAddColor = "bg-green-600 hover:bg-green-700";
  const shinyBorderColor = theme === "dark" ? "border-blue-400" : "border-purple-400";

  // Mise à jour des champs d'un élève et effacement de l'erreur pour le champ concerné
  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);

    // Vérifier et mettre à jour l'état des erreurs pour ce champ
    const updatedErrors = [...errors]; // errors est bien un tableau
    if (updatedErrors[index] && updatedErrors[index][field]) {
      updatedErrors[index][field] = "";
      setErrors(updatedErrors);
    }
  };

  // Ajoute un nouveau formulaire d'élève et son objet d'erreurs associé
  const handleAddForm = () => {
    setStudents([...students, initialStudent]);
    setErrors([...errors, {}]);
  };

  // Supprime le formulaire de l'élève et l'objet d'erreurs correspondant
  const handleRemoveForm = (index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      setErrors(updatedErrors);
    }
  };

  // Validation locale de chaque étudiant avant soumission
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
      return err;
    });
    setErrors(newErrors);
    return valid;
  };

  // Soumission du formulaire général
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudents()) {
      // Les erreurs locales sont déjà affichées
      return;
    }
    setIsLoading(true);
    setSuccess(null);

    // Pour stocker les erreurs remontées par saveStudent pour chaque élève
    const newErrors = [...errors];

    // On itère sur chaque étudiant pour tenter de l'enregistrer
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      // Conversion de la date
      const studentData = {
        ...student,
        birth_date: new Date(student.birth_date).getTime()
      };

      try {
        await saveStudent(studentData, db);
        // Si tout va bien, on efface les erreurs pour cet élève
        newErrors[i] = {};
      } catch (err) {
        // On met à jour l'erreur pour le champ concerné de l'élève courant
        newErrors[i] = {
          ...newErrors[i],
          [err.field]: err.message
        };
      }
    }

    // Mettre à jour l'état errors pour afficher les messages à côté des inputs concernés
    setErrors(newErrors);

    // Si aucune erreur n'est survenue, on affiche le message de succès
    if (newErrors.every((errObj) => Object.keys(errObj).length === 0)) {
      setSuccess("Les élèves ont été ajoutés avec succès!");
      setTimeout(() => {
        setIsAddStudentActive(false);
      }, 2000);
    }
    setIsLoading(false);
  };

  // Pour générer les options du select à partir des classes de la DB.
  // Chaque option combine le level et le nom, par exemple "7 Terminale".
  const classOptions = db && db.classes ? db.classes.map(cls => ({
    id: cls.id,
    label: `${cls.level} ${cls.name}`,
    value: `${cls.level} ${cls.name}`
  })) : [];

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
        <button
          onClick={() => setIsAddStudentActive(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
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
          <table className="min-w-full border-collapse">
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
                    <input
                      type="text"
                      value={student.first_name}
                      onChange={(e) => handleInputChange(index, 'first_name', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : Fatoumata"
                    />
                    {errors[index]?.first_name && <span className="text-red-500 text-xs">{errors[index].first_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.sure_name}
                      onChange={(e) => handleInputChange(index, 'sure_name', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : C"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.last_name}
                      onChange={(e) => handleInputChange(index, 'last_name', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : Dembélé"
                    />
                    {errors[index]?.last_name && <span className="text-red-500 text-xs">{errors[index].last_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <select
                      value={student.classe}
                      onChange={(e) => handleInputChange(index, 'classe', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                    >
                      <option value="">Sélectionnez</option>
                      {classOptions.map(option => (
                        <option key={option.id} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors[index]?.classe && <span className="text-red-500 text-xs">{errors[index].classe}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <select
                      value={student.sexe}
                      onChange={(e) => handleInputChange(index, 'sexe', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
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
                      value={student.birth_date}
                      onChange={(e) => handleInputChange(index, 'birth_date', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                    />
                    {errors[index]?.birth_date && <span className="text-red-500 text-xs">{errors[index].birth_date}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.matricule}
                      onChange={(e) => handleInputChange(index, 'matricule', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : MAT1234"
                    />
                    {errors[index]?.matricule && <span className="text-red-500 text-xs">{errors[index].matricule}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.father_name}
                      onChange={(e) => handleInputChange(index, 'father_name', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : Mamadou Dembélé"
                    />
                    {errors[index]?.father_name && <span className="text-red-500 text-xs">{errors[index].father_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.mother_name}
                      onChange={(e) => handleInputChange(index, 'mother_name', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
                      placeholder="EX : Aminata Konaté"
                    />
                    {errors[index]?.mother_name && <span className="text-red-500 text-xs">{errors[index].mother_name}</span>}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="text"
                      value={student.parents_contact}
                      onChange={(e) => handleInputChange(index, 'parents_contact', e.target.value)}
                      className={`w-full px-2 py-1 text-sm rounded ${inputBgColor} ${inputBorderColor} ${selectInputTextColor}`}
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

        {/* Bouton pour ajouter un nouvel élève */}
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

        {/* Bouton de sauvegarde */}
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
                Sauvegarde en cours...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
                Sauvegarder tous les élèves
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStudent;
