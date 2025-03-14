
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCcw, ChevronDown, X, UserMinus, AlertTriangle, Check, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage, useFlashNotification } from './contexts.js';
import BulletinComponent from './BulletinComponent.jsx';

const BulletinNotes = ({
  selectedComposition,
  selectedClass,
  db,
  textClass,
  theme,
  getClasseName,
  handleCloseComponent,
  refreshData
}) => {
  const { live_language, language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  const [bulletin, setBulletin] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [activeCoef, setActiveCoef] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [sortType, setSortType] = useState("coef"); // 'default', 'alpha', 'coef', 'manual'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBulletinPreview, setShowBulletinPreview] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // La position du cursor
  const [positionHeadCursor, setPositionHeadCursor] = useState({ x: 0, y: 0 }); // La position du cursor

  // Références pour les menus déroulants
  const dropdownRef = useRef(null);
  const coefDropdownRef = useRef(null);

  // Styles conditionnels
  const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-blue-50";
  const tableSubHeaderBg = theme === "dark" ? "bg-gray-600" : "bg-blue-100";
  const tableRowHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";
  const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const cellBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const cellActiveBgColor = theme === "dark" ? "bg-blue-700" : "bg-blue-100";
  const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";

  // Générer les options pour les notes
  const wholeNumberOptions = Array.from({ length: 21 }, (_, i) => i);
  const decimalOptions = ["00", "25", "50", "75"];

  // Coefficients disponibles
  const coefficients = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

  // Calculer la somme totale des coefficients
  const calculateTotalCoefficients = useCallback(() => {
    return subjects.reduce((total, subject) => total + subject.coefficient, 0);
  }, [subjects]);

  // Récupérer le bulletin et initialiser les données
  useEffect(() => {
    if (!db || !selectedClass || !selectedComposition) return;

    setLoading(true);

    // Trouver le bulletin correspondant
    const existingBulletin = db.bulletins?.find(
      bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
    );

    if (existingBulletin) {
      setBulletin(existingBulletin);

      // S'assurer que "Conduite" a toujours un coefficient de 1
      const updatedSubjects = existingBulletin.subjects.map(subject =>
        subject.name === "Conduite" ? { ...subject, coefficient: 1 } : subject
      );

      setSubjects(updatedSubjects);

      // Préparer les données des élèves avec leurs notes
      const studentsWithNotes = existingBulletin.students.map(student => {
        // S'assurer que chaque élève a un objet notes pour chaque matière
        const notes = { ...student.notes };

        updatedSubjects.forEach(subject => {
          if (!notes[subject.name]) {
            notes[subject.name] = {
              classe: null,
              composition: null,
              moyenne_generale: null,
              moyenne_coef: null
            };
          } else if (!notes[subject.name].moyenne_generale || !notes[subject.name].moyenne_coef) {
            // Calculer les moyennes si elles n'existent pas
            const classeNote = notes[subject.name].classe;
            const compoNote = notes[subject.name].composition;

            if (classeNote !== null || compoNote !== null) {
              const moyenne_generale = calculateSubjectAverage(classeNote, compoNote);
              const moyenne_coef = moyenne_generale !== "-"
                ? parseFloat(moyenne_generale) * subject.coefficient
                : null;

              notes[subject.name] = {
                ...notes[subject.name],
                moyenne_generale: moyenne_generale !== "-" ? parseFloat(moyenne_generale) : null,
                moyenne_coef: moyenne_coef
              };
            }
          }
        });

        return {
          ...student,
          notes
        };
      });

      setStudents(studentsWithNotes);
    }

    setLoading(false);
  }, [db, selectedClass, selectedComposition]);

  // Fermer les menus déroulants lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCell(null);
      }

      if (coefDropdownRef.current && !coefDropdownRef.current.contains(event.target)) {
        setActiveCoef(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Trier les matières selon le type de tri sélectionné
  useEffect(() => {
    if (!subjects.length) return;

    let sortedSubjects = [...subjects];

    switch (sortType) {
      case 'alpha':
        sortedSubjects.sort((a, b) => {
          if (a.name === "Conduite") return 1;
          if (b.name === "Conduite") return -1;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'coef':
        sortedSubjects.sort((a, b) => {
          if (a.name === "Conduite") return 1;
          if (b.name === "Conduite") return -1;
          return b.coefficient - a.coefficient;
        });
        break;
      case 'manual':
        break;
      default:
        sortedSubjects.sort((a, b) => {
          if (a.name === "Conduite") return 1;
          if (b.name === "Conduite") return -1;
          return 0;
        });
        break;
    }

    setSubjects(sortedSubjects);
  }, [sortType, subjects.length]); // 👈 Ajoute "subjects.length" pour s'assurer qu'on trie dès qu'ils sont disponibles


  // Calculer la moyenne d'une matière
  const calculateSubjectAverage = (classeNote, compoNote) => {
    // Si l'une des notes est manquante, retourner l'autre note
    if (classeNote === null && compoNote !== null) return formatNote(compoNote);
    if (classeNote !== null && compoNote === null) return formatNote(classeNote);
    if (classeNote === null && compoNote === null) return "-";

    // Calculer la moyenne (classe compte pour 1/3, composition pour 2/3)
    const average = (classeNote + (compoNote * 2)) / 3;
    return formatNote(average);
  };

  // Formater une note pour l'affichage
  const formatNote = (note) => {
    if (note === null || note === undefined) return "-";

    // Convertir en nombre si c'est une chaîne
    const numericNote = typeof note === 'string' ? parseFloat(note) : note;

    // Vérifier si c'est un nombre valide
    if (isNaN(numericNote)) return "-";

    // Formater avec 2 décimales
    return numericNote.toFixed(2);
  };

  // Calculer la moyenne d'un élève pour une matière
  const calculateSubjectAverageForStudent = (studentId, subjectName) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.notes[subjectName]) return "-";

    const classeNote = student.notes[subjectName].classe;
    const compoNote = student.notes[subjectName].composition;

    return calculateSubjectAverage(classeNote, compoNote);
  };

  // Calculer la moyenne générale d'un élève
  const calculateGeneralAverage = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return "-";

    let totalPoints = 0;
    let totalCoefficients = 0;

    subjects.forEach(subject => {
      const subjectAvg = calculateSubjectAverageForStudent(studentId, subject.name);
      if (subjectAvg !== "-") {
        totalPoints += parseFloat(subjectAvg) * subject.coefficient;
        totalCoefficients += subject.coefficient;
      }
    });

    if (totalCoefficients === 0) return "-";
    return (totalPoints / totalCoefficients).toFixed(2);
  };

  // Mettre à jour une note
  const updateNote = async (studentId, subjectName, noteType, value) => {
    // Trouver l'élève
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;

    // Créer une copie des élèves
    const updatedStudents = [...students];

    // Mettre à jour la note
    if (!updatedStudents[studentIndex].notes[subjectName]) {
      updatedStudents[studentIndex].notes[subjectName] = {
        classe: null,
        composition: null,
        moyenne_generale: null,
        moyenne_coef: null
      };
    }

    updatedStudents[studentIndex].notes[subjectName][noteType] = value;

    // Calculer et mettre à jour moyenne_generale et moyenne_coef
    const classeNote = updatedStudents[studentIndex].notes[subjectName].classe;
    const compoNote = updatedStudents[studentIndex].notes[subjectName].composition;

    if (classeNote !== null || compoNote !== null) {
      const moyenne_generale = calculateSubjectAverage(classeNote, compoNote);
      const subject = subjects.find(s => s.name === subjectName);
      const coefficient = subject ? subject.coefficient : 1;

      const moyenne_coef = moyenne_generale !== "-"
        ? parseFloat(moyenne_generale) * coefficient
        : null;

      updatedStudents[studentIndex].notes[subjectName].moyenne_generale =
        moyenne_generale !== "-" ? parseFloat(moyenne_generale) : null;
      updatedStudents[studentIndex].notes[subjectName].moyenne_coef = moyenne_coef;
    }

    // Mettre à jour l'état
    setStudents(updatedStudents);
    setHasChanges(true);

    // Mettre à jour la base de données
    await saveChangesToDatabase(updatedStudents);
  };

  // Mettre à jour un coefficient
  const updateCoefficient = async (subjectName, newCoefficient) => {
    // Ne pas permettre de changer le coefficient de "Conduite"
    if (subjectName === "Conduite") return;

    // Créer une copie des matières
    const updatedSubjects = subjects.map(subject =>
      subject.name === subjectName
        ? { ...subject, coefficient: newCoefficient }
        : subject
    );

    // Mettre à jour l'état
    setSubjects(updatedSubjects);
    setHasChanges(true);

    // Mettre à jour les moyennes_coef pour tous les élèves
    const updatedStudents = students.map(student => {
      const updatedNotes = { ...student.notes };

      if (updatedNotes[subjectName] && updatedNotes[subjectName].moyenne_generale !== null) {
        updatedNotes[subjectName] = {
          ...updatedNotes[subjectName],
          moyenne_coef: updatedNotes[subjectName].moyenne_generale * newCoefficient
        };
      }

      return {
        ...student,
        notes: updatedNotes
      };
    });

    setStudents(updatedStudents);

    // Mettre à jour la base de données
    await saveChangesToDatabase(updatedStudents, updatedSubjects);
  };

  // Déplacer une matière vers le haut ou le bas (tri manuel)
  const moveSubject = async (subjectName, direction) => {
    // Ne pas permettre de déplacer "Conduite"
    if (subjectName === "Conduite") return;

    const subjectIndex = subjects.findIndex(s => s.name === subjectName);
    if (subjectIndex === -1) return;

    // Ne pas permettre de déplacer au-delà des limites
    if (direction === 'up' && subjectIndex === 0) return;
    if (direction === 'down' && subjectIndex === subjects.length - 2) return; // -2 car "Conduite" est toujours à la fin

    // Créer une copie des matières
    const updatedSubjects = [...subjects];

    // Échanger les positions
    const targetIndex = direction === 'up' ? subjectIndex - 1 : subjectIndex + 1;
    [updatedSubjects[subjectIndex], updatedSubjects[targetIndex]] =
      [updatedSubjects[targetIndex], updatedSubjects[subjectIndex]];

    // Mettre à jour l'état
    setSubjects(updatedSubjects);
    setHasChanges(true);

    // Mettre à jour la base de données
    await saveChangesToDatabase(students, updatedSubjects);
  };

  // Sauvegarder les changements dans la base de données
  const saveChangesToDatabase = async (updatedStudents = students, updatedSubjects = subjects) => {
    setSaving(true);

    try {
      // Mettre à jour le bulletin
      const updatedBulletins = db.bulletins.map(b => {
        if (b.id === bulletin.id) {
          return {
            ...b,
            students: updatedStudents,
            subjects: updatedSubjects
          };
        }
        return b;
      });

      // Mettre à jour la base de données
      const updatedDB = { ...db, bulletins: updatedBulletins };
      await window.electron.saveDatabase(updatedDB);

      // Mettre à jour le bulletin local
      setBulletin({
        ...bulletin,
        students: updatedStudents,
        subjects: updatedSubjects
      });

      setHasChanges(false);

      setFlashMessage({
        message: "Les notes ont été enregistrées avec succès !",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notes:", error);
      setFlashMessage({
        message: "Une erreur est survenue lors de la sauvegarde des notes.",
        type: "error",
        duration: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  // Supprimer un élève du bulletin
  const removeStudentFromBulletin = async (studentId) => {
    try {
      // Filtrer l'élève à supprimer
      const updatedStudents = students.filter(student => student.id !== studentId);

      // Mettre à jour la base de données
      await saveChangesToDatabase(updatedStudents);

      // Mettre à jour l'état local
      setStudents(updatedStudents);
      setShowRemoveConfirm(null);

      setFlashMessage({
        message: "L'élève a été retiré du bulletin avec succès !",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
      setFlashMessage({
        message: "Une erreur est survenue lors de la suppression de l'élève.",
        type: "error",
        duration: 5000
      });
    }
  };

  // Gérer la sélection d'une note entière
  const handleWholeNumberSelect = (studentId, subjectName, noteType, value) => {
    // Si la valeur est 20, on met automatiquement la partie décimale à 0
    if (value === 20) {
      updateNote(studentId, subjectName, noteType, 20);
    } else {
      // Récupérer la partie décimale actuelle
      const student = students.find(s => s.id === studentId);
      const currentNote = student?.notes[subjectName]?.[noteType];
      const decimalPart = currentNote !== null && currentNote !== undefined
        ? Math.round((currentNote % 1) * 100) / 100
        : 0;

      // Mettre à jour avec la nouvelle partie entière et l'ancienne partie décimale
      updateNote(studentId, subjectName, noteType, value + decimalPart);
    }

    // Fermer le menu déroulant
    setActiveCell(null);
  };

  // Gérer la sélection d'une partie décimale
  const handleDecimalSelect = (studentId, subjectName, noteType, decimalStr) => {
    // Récupérer la partie entière actuelle
    const student = students.find(s => s.id === studentId);
    const currentNote = student?.notes[subjectName]?.[noteType];
    const wholePart = currentNote !== null && currentNote !== undefined
      ? Math.floor(currentNote)
      : 0;

    // Convertir la partie décimale en nombre
    const decimalPart = parseInt(decimalStr) / 100;

    // Mettre à jour avec la partie entière actuelle et la nouvelle partie décimale
    updateNote(studentId, subjectName, noteType, wholePart + decimalPart);

    // Fermer le menu déroulant
    setActiveCell(null);
  };

  // Afficher le bulletin d'un élève
  const handleViewStudentBulletin = (student) => {
    setSelectedStudent(student);
    setShowBulletinPreview(true);
  };

  // Fermer la prévisualisation du bulletin
  const handleCloseBulletinPreview = () => {
    setShowBulletinPreview(false);
    setSelectedStudent(null);
  };

  // Calculer et mettre à jours toujours la position du cursor
  const handleMouseMove = (event) => {
    const offsetY = 5;
    setPosition({
      x: event.clientX,
      y: event.clientY + offsetY,
    });
  };

  // Calculer et mettre à jours toujours la position du cursor
  const handleHeadMouseMove = (event) => {
    const offsetX = 0;
    const offsetY = 130;
    setPositionHeadCursor({
      x: event.clientY - offsetX,
      y: event.clientY - offsetY,
    });
  };

  // Obtenir le nom de la classe
  const className = db?.classes?.find(cls => cls.id === selectedClass)
    ? getClasseName(`${db.classes.find(cls => cls.id === selectedClass).level} ${db.classes.find(cls => cls.id === selectedClass).name}`, language)
    : "";

  return (
    <motion.div
      className={`${textClass} fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Passage de overflow-hidden à overflow-auto dans ce conteneur */}
      <motion.div
        className={`w-full h-full p-4 ${tableBgColor} overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* En-tête global */}
        <div
          className="sticky top-0 z-10 bg-opacity-95 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
          }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Saisie des notes pour le bulletin :
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div>
                <span className="font-medium">Composition :</span>{" "}
                {selectedComposition.label}
              </div>
              <div>
                <span className="font-medium">Classe :</span> {className}
              </div>
              <div>
                <span className="font-medium">Total coefficients :</span>{" "}
                {calculateTotalCoefficients()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Options de tri */}
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className={`px-3 py-2 rounded border ${tableBorderColor} ${cellBgColor} ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="default">Tri par défaut</option>
                <option value="alpha">Tri alphabétique</option>
                <option value="coef">Tri par coefficient</option>
                <option value="manual">Tri manuel</option>
              </select>
            </div>

            {/* Bouton de sauvegarde */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => saveChangesToDatabase()}
              disabled={saving || !hasChanges}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${hasChanges
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                } transition-colors duration-300`}
            >
              {saving ? (
                <RefreshCcw className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>Enregistrer</span>
            </motion.button>

            {/* Bouton de fermeture */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseComponent}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Conteneur scrollable pour le tableau */}
        <div className="overflow-auto max-h-[calc(100vh-20%)]">
          <table
            className={`min-w-full border ${tableBorderColor} border-collapse`}
            style={{ marginBottom: "40%" }}
          >
            <thead className="sticky -top-1 z-20">
              <tr className={`${tableHeaderBg}`}>
                <th
                  className={`px-4 py-3 text-left border ${tableBorderColor}`}
                  rowSpan={2}
                >
                  Élève
                </th>
                {subjects.map((subject) => (
                  <th
                    key={subject.name}
                    className={`px-4 py-2 text-center border ${tableBorderColor}`}
                    colSpan={3}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {sortType === "manual" && subject.name !== "Conduite" && (
                        <>
                          <button
                            onClick={() => moveSubject(subject.name, "up")}
                            className="p-1 rounded hover:bg-blue-500 hover:text-white"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveSubject(subject.name, "down")}
                            className="p-1 rounded hover:bg-blue-500 hover:text-white"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </>
                      )}
                      <span>{subject.name}</span>
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      <span className="text-xs">Coef: </span>
                      {subject.name === "Conduite" ? (
                        <span className="ml-1 text-xs font-medium">1</span>
                      ) : (
                        <button
                          onClick={(event) => {
                            setActiveCoef(subject.name);
                            handleHeadMouseMove(event);
                          }}
                          onMouseMove={
                            activeCoef === null
                              ? handleHeadMouseMove
                              : activeCoef === subject.name
                                ? handleHeadMouseMove
                                : () => { }
                          }
                          className="ml-1 text-xs font-medium underline hover:text-blue-500"
                        >
                          {subject.coefficient}
                        </button>
                      )}

                      {/* Menu déroulant pour les coefficients */}
                      {activeCoef === subject.name && (
                        <div style={{ marginRight: "2%" }}>
                          <div
                            ref={coefDropdownRef}
                            className={`absolute z-20 mt-1 py-1 rounded-md shadow-lg ${dropdownBgColor} border ${tableBorderColor} max-h-60 overflow-auto`}
                            style={{
                              right: `${positionHeadCursor.x}`,
                              top: `${positionHeadCursor.y}px`,
                              transform: "translate(-50%, 0)",
                            }}
                          >
                            <div className="grid grid-cols-5 gap-1 p-2">
                              {coefficients.map((coef) => (
                                <button
                                  key={coef}
                                  onClick={() => {
                                    updateCoefficient(subject.name, coef);
                                    setActiveCoef(null);
                                  }}
                                  className={`px-2 py-1 text-center rounded ${coef === subject.coefficient
                                      ? cellActiveBgColor
                                      : dropdownHoverBgColor
                                    }`}
                                >
                                  {coef}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th
                  className={`px-4 py-3 text-center border ${tableBorderColor}`}
                  rowSpan={2}
                >
                  Générale
                </th>
                <th
                  className={`px-4 py-3 text-center border ${tableBorderColor}`}
                  rowSpan={2}
                >
                  Visualiseur
                </th>
                <th
                  className={`px-4 py-3 text-center border ${tableBorderColor}`}
                  rowSpan={2}
                >
                  Action
                </th>
              </tr>
              <tr className={`${tableSubHeaderBg}`}>
                {subjects.map((subject) => (
                  <React.Fragment key={`sub-${subject.name}`}>
                    <th className={`px-2 py-1 text-center text-xs border ${tableBorderColor}`}>
                      Classe
                    </th>
                    <th className={`px-2 py-1 text-center text-xs border ${tableBorderColor}`}>
                      Compo
                    </th>
                    <th className={`px-2 py-1 text-center text-xs border ${tableBorderColor}`}>
                      Moy
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={subjects.length * 3 + 4}
                    className={`px-4 py-4 text-center border ${tableBorderColor}`}
                  >
                    Chargement des données...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan={subjects.length * 3 + 4}
                    className={`px-4 py-4 text-center border ${tableBorderColor}`}
                  >
                    Aucun élève trouvé pour cette classe.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className={`${tableRowHoverBg} border ${tableBorderColor}`}
                  >
                    <td className={`px-4 py-2 border ${tableBorderColor}`}>
                      {student.first_name} {student.sure_name}
                      <div style={{ fontSize: 14, opacity: 0.7 }}>
                        {student.last_name}
                      </div>
                    </td>

                    {subjects.map((subject) => (
                      <React.Fragment key={`${student.id}-${subject.name}`}>
                        {/* Note de classe */}
                        <td
                          className={`px-2 py-2 text-center border ${tableBorderColor} ${activeCell === `${student.id}-${subject.name}-classe`
                              ? cellActiveBgColor
                              : ""
                            } cursor-pointer`}
                          onClick={(event) => {
                            setActiveCell(`${student.id}-${subject.name}-classe`);
                            if (activeCell !== `${student.id}-${subject.name}-classe`) {
                              handleMouseMove(event);
                            }
                          }}
                        >
                          {student.notes[subject.name]?.classe !== null
                            ? formatNote(student.notes[subject.name]?.classe)
                            : "-"}
                          {/* Menu déroulant pour la note de classe */}
                          {activeCell === `${student.id}-${subject.name}-classe` && (
                            <div
                              ref={dropdownRef}
                              className={`absolute z-20 mt-1 py-1 rounded-md shadow-lg ${dropdownBgColor} border ${tableBorderColor}`}
                              style={{
                                minWidth: "200px",
                                top: `${position.y}px`,
                                left: `${position.x}px`,
                                transform: "translate(-50%, 0)",
                              }}
                            >
                              <div className="p-2">
                                <div className="mb-2">
                                  <button
                                    onClick={() => {
                                      updateNote(student.id, subject.name, "classe", null);
                                      setActiveCell(null);
                                    }}
                                    className={`w-full px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                  >
                                    Effacer
                                  </button>
                                </div>
                                <div className="grid grid-cols-5 gap-1 mb-2">
                                  {wholeNumberOptions.map((num) => (
                                    <button
                                      key={num}
                                      onClick={() =>
                                        handleWholeNumberSelect(student.id, subject.name, "classe", num)
                                      }
                                      className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                    >
                                      {num}
                                    </button>
                                  ))}
                                </div>
                                {student?.notes[subject.name]?.["classe"] === 20 ? null :
                                  <div className="grid grid-cols-4 gap-1">
                                    {decimalOptions.map((decimal) => (
                                      <button
                                        key={decimal}
                                        onClick={() => {
                                          // console.log(student?.notes[subject.name]?.["classe"]);
                                          handleDecimalSelect(student.id, subject.name, "classe", decimal)
                                        }}
                                        className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                      >
                                        0.{decimal}
                                      </button>
                                    ))}
                                  </div>
                                }
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Note de composition */}
                        <td
                          className={`px-2 py-2 text-center border ${tableBorderColor} ${activeCell === `${student.id}-${subject.name}-composition`
                              ? cellActiveBgColor
                              : ""
                            } cursor-pointer`}
                          onClick={(event) => {
                            setActiveCell(`${student.id}-${subject.name}-composition`);
                            if (activeCell !== `${student.id}-${subject.name}-composition`) {
                              handleMouseMove(event);
                            }
                          }}
                        >
                          {student.notes[subject.name]?.composition !== null
                            ? formatNote(student.notes[subject.name]?.composition)
                            : "-"}
                          {/* Menu déroulant pour la note de composition */}
                          {activeCell === `${student.id}-${subject.name}-composition` && (
                            <div
                              ref={dropdownRef}
                              className={`absolute z-20 mt-1 py-1 rounded-md shadow-lg ${dropdownBgColor} border ${tableBorderColor}`}
                              style={{
                                minWidth: "200px",
                                top: `${position.y}px`,
                                left: `${position.x}px`,
                                transform: "translate(-50%, 0)",
                              }}
                            >
                              <div className="p-2">
                                <div className="mb-2">
                                  <button
                                    onClick={() => {
                                      updateNote(student.id, subject.name, "composition", null);
                                      setActiveCell(null);
                                    }}
                                    className={`w-full px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                  >
                                    Effacer
                                  </button>
                                </div>
                                <div className="grid grid-cols-5 gap-1 mb-2">
                                  {wholeNumberOptions.map((num) => (
                                    <button
                                      key={num}
                                      onClick={() =>
                                        handleWholeNumberSelect(student.id, subject.name, "composition", num)
                                      }
                                      className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                    >
                                      {num}
                                    </button>
                                  ))}
                                </div>
                                {student?.notes[subject.name]?.["composition"] === 20 ? null :
                                  <div className="grid grid-cols-4 gap-1">
                                    {decimalOptions.map((decimal) => (
                                      <button
                                        key={decimal}
                                        onClick={() =>
                                          handleDecimalSelect(student.id, subject.name, "composition", decimal)
                                        }
                                        className={`px-2 py-1 text-center rounded ${dropdownHoverBgColor}`}
                                      >
                                        0.{decimal}
                                      </button>
                                    ))}
                                  </div>
                                }
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Moyenne */}
                        <td className={`px-2 py-2 text-center border ${tableBorderColor} font-medium`}>
                          {calculateSubjectAverageForStudent(student.id, subject.name)}
                        </td>
                      </React.Fragment>
                    ))}

                    {/* Moyenne générale */}
                    <td className={`px-4 py-2 text-center border ${tableBorderColor} font-bold`}>
                      {calculateGeneralAverage(student.id)}
                    </td>

                    {/* Visualiseur de bulletin */}
                    <td className={`px-4 py-2 text-center border ${tableBorderColor}`}>
                      <button
                        onClick={() => handleViewStudentBulletin(student)}
                        className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                      >
                        <Eye size={18} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className={`px-4 py-2 text-center border ${tableBorderColor}`}>
                      {showRemoveConfirm === student.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeStudentFromBulletin(student.id)}
                            className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setShowRemoveConfirm(null)}
                            className="p-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-300"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowRemoveConfirm(student.id)}
                          className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Prévisualisation du bulletin */}
      <AnimatePresence>
        {showBulletinPreview && selectedStudent && (
          <motion.div
            className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-full max-w-4xl p-6 ${tableBgColor} rounded-lg shadow-xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
              width: "60%",
              height: "60%",
              maxHeight: "60%",
              minWidth: "60%",
              marginTop: "5%",
            }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Prévisualisation du bulletin</h3>
                <button
                  onClick={handleCloseBulletinPreview}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              <BulletinComponent
                student={selectedStudent}
                subjects={subjects}
                composition={selectedComposition}
                className={className}
                calculateSubjectAverageForStudent={calculateSubjectAverageForStudent}
                calculateGeneralAverage={calculateGeneralAverage}
                theme={theme}
                textClass={textClass}
                language={language}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

  );
};
export default BulletinNotes;