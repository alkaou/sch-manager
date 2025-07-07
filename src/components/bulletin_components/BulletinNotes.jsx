import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  RefreshCcw,
  X,
  UserMinus,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { useLanguage, useFlashNotification } from "../contexts";
import BulletinComponent from "./BulletinComponent.jsx";
import {
  calculateSubjectAverage,
  calculateSubjectAverageForStudent,
  formatNote,
  calculateGeneralAverage,
} from "../bulletin_utils/BulletinMethods";
import NoteWriter from "./NoteWriter.jsx";
import { translate } from "./bulletin_translator";
import { translate as Compositiontranslate } from "../compositions/compositions_translator";

const BulletinNotes = ({
  selectedComposition,
  selectedClass,
  db,
  textClass,
  app_bg_color,
  theme,
  getClasseName,
  handleCloseComponent,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();

  const [bulletin, setBulletin] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [Compo_or_Class, setCompo_or_Class] = useState("composition");
  const [theStudentSelect, setTheStudentSelect] = useState(null);
  const [theSubjectSelect, setTheSubjectSelect] = useState(null);
  const [activeCoef, setActiveCoef] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [sortType, setSortType] = useState("coef"); // 'default', 'alpha', 'coef', 'manual'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBulletinPreview, setShowBulletinPreview] = useState(false);
  const [positionHeadCursor, setPositionHeadCursor] = useState({ x: 0, y: 0 }); // La position du cursor

  // Références pour les menus déroulants
  const dropdownRef = useRef(null);
  const coefDropdownRef = useRef(null);

  // Styles conditionnels
  const tableBgColor = `${app_bg_color} ${textClass}`;
  const tableHeaderBg = `${app_bg_color} ${textClass}`;
  const tableSubHeaderBg = `${app_bg_color} ${textClass}`;
  const tableRowHoverBg = "hover:bg-opacity-80";
  const tableBorderColor =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableBorderWidth = "border-2";
  const cellActiveBgColor = "bg-green-200 text-gray-700";
  const noteCellHoverEffect =
    "hover:bg-blue-100 hover:bg-opacity-30 transition-colors duration-150";
  const dropdownBgColor =
    theme === "dark" ? tableBgColor : "bg-gray-50 text-gray-700";
  const hoverNumber = "hover:bg-blue-400 hover:text-white hover:font-bold";

  // Générer les options pour les notes
  const wholeNumberOptions = Array.from({ length: 21 }, (_, i) => i);
  const decimalOptions = ["00", "25", "50", "75"];

  // Coefficients disponibles
  const coefficients = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
    10,
  ];

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
      (bulletin) =>
        bulletin.compositionId === selectedComposition.id &&
        bulletin.classId === selectedClass
    );

    if (
      existingBulletin &&
      existingBulletin.subjects &&
      existingBulletin.subjects.length > 0
    ) {
      setBulletin(existingBulletin);

      // S'assurer que "Conduite" a toujours un coefficient de 1
      const updatedSubjects = existingBulletin.subjects.map((subject) =>
        subject.name === "Conduite" ? { ...subject, coefficient: 1 } : subject
      );

      setSubjects(updatedSubjects);

      // Préparer les données des élèves avec leurs notes
      const studentsWithNotes = existingBulletin.students.map((student) => {
        // S'assurer que chaque élève a un objet notes pour chaque matière
        const notes = { ...student.notes };

        updatedSubjects.forEach((subject) => {
          if (!notes[subject.name]) {
            notes[subject.name] = {
              classe: null,
              composition: null,
              moyenne_generale: null,
              moyenne_coef: null,
            };
          } else if (
            !notes[subject.name].moyenne_generale ||
            !notes[subject.name].moyenne_coef
          ) {
            // Calculer les moyennes si elles n'existent pas
            const classeNote = notes[subject.name].classe;
            const compoNote = notes[subject.name].composition;

            if (classeNote !== null || compoNote !== null) {
              const moyenne_generale = calculateSubjectAverage(
                classeNote,
                compoNote
              );
              const moyenne_coef =
                moyenne_generale !== "-"
                  ? parseFloat(moyenne_generale) * subject.coefficient
                  : null;

              notes[subject.name] = {
                ...notes[subject.name],
                moyenne_generale:
                  moyenne_generale !== "-"
                    ? parseFloat(moyenne_generale)
                    : null,
                moyenne_coef: moyenne_coef,
              };
            }
          }
        });

        return {
          ...student,
          notes,
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

      if (
        coefDropdownRef.current &&
        !coefDropdownRef.current.contains(event.target)
      ) {
        setActiveCoef(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Trier les matières selon le type de tri sélectionné
  useEffect(() => {
    if (!subjects.length) return;

    let sortedSubjects = [...subjects];

    switch (sortType) {
      case "alpha":
        sortedSubjects.sort((a, b) => {
          if (a.name === "Conduite") return 1;
          if (b.name === "Conduite") return -1;
          return a.name.localeCompare(b.name);
        });
        break;
      case "coef":
        sortedSubjects.sort((a, b) => {
          if (a.name === "Conduite") return 1;
          if (b.name === "Conduite") return -1;
          return b.coefficient - a.coefficient;
        });
        break;
      case "manual":
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

  // Mettre à jour une note
  const updateNote = async (studentId, subjectName, noteType, value) => {
    // Trouver l'élève
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) return;

    // Créer une copie des élèves
    const updatedStudents = [...students];

    // Mettre à jour la note
    if (!updatedStudents[studentIndex].notes[subjectName]) {
      updatedStudents[studentIndex].notes[subjectName] = {
        classe: null,
        composition: null,
        moyenne_generale: null,
        moyenne_coef: null,
      };
    }

    updatedStudents[studentIndex].notes[subjectName][noteType] = value;

    // Calculer et mettre à jour moyenne_generale et moyenne_coef
    const classeNote = updatedStudents[studentIndex].notes[subjectName].classe;
    const compoNote =
      updatedStudents[studentIndex].notes[subjectName].composition;

    if (classeNote !== null || compoNote !== null) {
      const moyenne_generale = calculateSubjectAverage(classeNote, compoNote);
      const subject = subjects.find((s) => s.name === subjectName);
      const coefficient = subject ? subject.coefficient : 1;

      const moyenne_coef =
        moyenne_generale !== "-"
          ? parseFloat(moyenne_generale) * coefficient
          : null;

      updatedStudents[studentIndex].notes[subjectName].moyenne_generale =
        moyenne_generale !== "-" ? parseFloat(moyenne_generale) : null;
      updatedStudents[studentIndex].notes[subjectName].moyenne_coef =
        moyenne_coef;
    }

    // Mettre à jour l'état
    setStudents(updatedStudents);
    setHasChanges(true);

    // S'assurer que le popup est fermé
    setActiveCell(null);

    // Mettre à jour la base de données
    await saveChangesToDatabase(updatedStudents);
  };

  // Mettre à jour un coefficient
  const updateCoefficient = async (subjectName, newCoefficient) => {
    // Ne pas permettre de changer le coefficient de "Conduite"
    if (subjectName === "Conduite") return;

    // Créer une copie des matières
    const updatedSubjects = subjects.map((subject) =>
      subject.name === subjectName
        ? { ...subject, coefficient: newCoefficient }
        : subject
    );

    // Mettre à jour l'état
    setSubjects(updatedSubjects);
    setHasChanges(true);

    // Mettre à jour les moyennes_coef pour tous les élèves
    const updatedStudents = students.map((student) => {
      const updatedNotes = { ...student.notes };

      if (
        updatedNotes[subjectName] &&
        updatedNotes[subjectName].moyenne_generale !== null
      ) {
        updatedNotes[subjectName] = {
          ...updatedNotes[subjectName],
          moyenne_coef:
            updatedNotes[subjectName].moyenne_generale * newCoefficient,
        };
      }

      return {
        ...student,
        notes: updatedNotes,
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

    const subjectIndex = subjects.findIndex((s) => s.name === subjectName);
    if (subjectIndex === -1) return;

    // Ne pas permettre de déplacer au-delà des limites
    if (direction === "up" && subjectIndex === 0) return;
    if (direction === "down" && subjectIndex === subjects.length - 2) return; // -2 car "Conduite" est toujours à la fin

    // Créer une copie des matières
    const updatedSubjects = [...subjects];

    // Échanger les positions
    const targetIndex =
      direction === "up" ? subjectIndex - 1 : subjectIndex + 1;
    [updatedSubjects[subjectIndex], updatedSubjects[targetIndex]] = [
      updatedSubjects[targetIndex],
      updatedSubjects[subjectIndex],
    ];

    // Mettre à jour l'état
    setSubjects(updatedSubjects);
    setHasChanges(true);

    // Mettre à jour la base de données
    await saveChangesToDatabase(students, updatedSubjects);
  };

  // Sauvegarder les changements dans la base de données
  const saveChangesToDatabase = async (
    updatedStudents = students,
    updatedSubjects = subjects
  ) => {
    setSaving(true);

    try {
      // Mettre à jour le bulletin
      const updatedBulletins = db.bulletins.map((b) => {
        if (b.id === bulletin.id) {
          return {
            ...b,
            students: updatedStudents,
            subjects: updatedSubjects,
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
        subjects: updatedSubjects,
      });

      setHasChanges(false);

      setFlashMessage({
        message: translate("notes_saved_success", language),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notes:", error);
      setFlashMessage({
        message: translate("error_saving_notes", language),
        type: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Supprimer un élève du bulletin
  const removeStudentFromBulletin = async (studentId) => {
    try {
      // Filtrer l'élève à supprimer
      const updatedStudents = students.filter(
        (student) => student.id !== studentId
      );

      // Mettre à jour la base de données
      await saveChangesToDatabase(updatedStudents);

      // Mettre à jour l'état local
      setStudents(updatedStudents);
      setShowRemoveConfirm(null);

      setFlashMessage({
        message: translate("student_removed_success", language),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
      setFlashMessage({
        message: translate("error_removing_student", language),
        type: "error",
        duration: 5000,
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
      const student = students.find((s) => s.id === studentId);
      const currentNote = student?.notes[subjectName]?.[noteType];
      const decimalPart =
        currentNote !== null && currentNote !== undefined
          ? Math.round((currentNote % 1) * 100) / 100
          : 0;

      // Mettre à jour avec la nouvelle partie entière et l'ancienne partie décimale
      updateNote(studentId, subjectName, noteType, value + decimalPart);
    }

    // Fermer le menu déroulant
    setActiveCell(null);
  };

  // Gérer la sélection d'une partie décimale
  const handleDecimalSelect = (
    studentId,
    subjectName,
    noteType,
    decimalStr
  ) => {
    // Récupérer la partie entière actuelle
    const student = students.find((s) => s.id === studentId);
    const currentNote = student?.notes[subjectName]?.[noteType];
    const wholePart =
      currentNote !== null && currentNote !== undefined
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
  const handleHeadMouseMove = (event) => {
    const offsetX = 0;
    const offsetY = 130;
    setPositionHeadCursor({
      x: event.clientY - offsetX,
      y: event.clientY - offsetY,
    });
  };

  // Obtenir le nom de la classe
  const className = db?.classes?.find((cls) => cls.id === selectedClass)
    ? `${db.classes.find((cls) => cls.id === selectedClass).level} ${
        db.classes.find((cls) => cls.id === selectedClass).name
      }`
    : "";

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.05, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.05, 0.1));
  };

  return (
    <motion.div
      className={`${textClass} ${app_bg_color} fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center`}
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
        <div className="sticky top-0 z-10 bg-opacity-95 p-3 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {translate("notes_entry_title", language)}
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div>
                <span className="font-medium text-sm">
                  {translate("composition_label", language)}
                </span>{" "}
                {/* {selectedComposition.label} */}
                {
                  Compositiontranslate("composition_options", language)[
                    parseInt(selectedComposition.name) - 1
                  ]["label"]
                }
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className={`p-1.5 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}
                    aria-label="Zoom out"
                  >
                    <FaSearchMinus size={14} />
                  </button>

                  <span className={`${textClass} text-sm`}>
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    onClick={handleZoomIn}
                    className={`p-1.5 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}
                    aria-label="Zoom in"
                  >
                    <FaSearchPlus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">
                  {translate("class_label", language)}
                </span>{" "}
                {getClasseName(className, language)}
              </div>
              <div>
                <span className="font-medium text-sm">
                  {translate("total_coefficients_label", language)}
                </span>{" "}
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
                className={`px-2 py-1.5 text-sm rounded border ${tableBorderColor} ${dropdownBgColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="default">
                  {translate("sort_default", language)}
                </option>
                <option value="alpha">
                  {translate("sort_alpha", language)}
                </option>
                <option value="coef">{translate("sort_coef", language)}</option>
                <option value="manual">
                  {translate("sort_manual", language)}
                </option>
              </select>
            </div>

            {/* Bouton de sauvegarde */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => saveChangesToDatabase()}
              disabled={saving || !hasChanges}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 ${
                hasChanges
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              } transition-colors duration-300`}
            >
              {saving ? (
                <RefreshCcw className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              <span>
                {saving
                  ? translate("saving", language)
                  : translate("save_changes", language)}
              </span>
            </motion.button>

            {/* Bouton de fermeture */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseComponent}
              className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Conteneur scrollable pour le tableau */}
        <div className="overflow-y-auto overflow-x-auto max-h-[calc(100vh-24%)] scrollbar-custom">
          {activeCell && theStudentSelect && theSubjectSelect ? (
            <NoteWriter
              dropdownRef={dropdownRef}
              dropdownBgColor={dropdownBgColor}
              tableBorderColor={tableBorderColor}
              hoverNumber={hoverNumber}
              setActiveCell={setActiveCell}
              activeCell={activeCell}
              student={theStudentSelect}
              subject={theSubjectSelect}
              updateNote={updateNote}
              Compo_or_Class={Compo_or_Class}
              handleWholeNumberSelect={handleWholeNumberSelect}
              handleDecimalSelect={handleDecimalSelect}
              wholeNumberOptions={wholeNumberOptions}
              decimalOptions={decimalOptions}
              translate={translate}
              language={language}
            />
          ) : null}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top left",
            }}
          >
            <table
              className={`min-w-full border ${tableBorderColor} ${tableBorderWidth} border-collapse`}
              style={{ marginBottom: "1%" }}
            >
              <thead className="sticky -top-1 z-20">
                <tr className={`${tableHeaderBg}`}>
                  <th
                    className={`px-4 py-3 text-left border ${tableBorderColor} ${tableBorderWidth}`}
                    rowSpan={2}
                  >
                    {translate("student", language)}
                  </th>
                  {subjects.map((subject) => (
                    <th
                      key={subject.name}
                      className={`px-4 py-2 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                      colSpan={3}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {sortType === "manual" &&
                          subject.name !== "Conduite" && (
                            <>
                              <button
                                onClick={() => moveSubject(subject.name, "up")}
                                className="p-1 rounded hover:bg-blue-500 hover:text-white"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  moveSubject(subject.name, "down")
                                }
                                className="p-1 rounded hover:bg-blue-500 hover:text-white"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </>
                          )}
                        <span>{subject.name}</span>
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-xs">
                          {translate("coefficient_short", language)}:{" "}
                        </span>
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
                                : () => {}
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
                                    className={`px-2 py-1 text-center rounded ${
                                      coef === subject.coefficient
                                        ? cellActiveBgColor
                                        : hoverNumber
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
                    className={`px-4 py-3 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                    rowSpan={2}
                  >
                    {translate("general_average", language)}
                  </th>
                  <th
                    className={`px-4 py-3 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                    rowSpan={2}
                  >
                    {translate("viewer", language)}
                  </th>
                  <th
                    className={`px-4 py-3 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                    rowSpan={2}
                  >
                    {translate("action", language)}
                  </th>
                </tr>
                <tr className={`${tableSubHeaderBg}`}>
                  {subjects.map((subject) => (
                    <React.Fragment key={`sub-${subject.name}`}>
                      <th
                        className={`px-2 py-1 text-center text-xs border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        {translate("class_short", language)}
                      </th>
                      <th
                        className={`px-2 py-1 text-center text-xs border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        {translate("composition_short", language)}
                      </th>
                      <th
                        className={`px-2 py-1 text-center text-xs border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        {translate("average_short", language)}
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
                      className={`px-4 py-4 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                    >
                      {translate("loading_data", language)}
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={subjects.length * 3 + 4}
                      className={`px-4 py-4 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                    >
                      {translate("no_student_found", language)}
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className={`${tableRowHoverBg} border ${tableBorderColor} ${tableBorderWidth}`}
                    >
                      <td
                        className={`px-4 py-2 border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        {student.first_name} {student.sure_name}
                        <div style={{ fontSize: 14, opacity: 0.7 }}>
                          {student.last_name}
                        </div>
                      </td>

                      {subjects.map((subject) => (
                        <React.Fragment key={`${student.id}-${subject.name}`}>
                          {/* Note de classe */}
                          <td
                            className={`text-center border ${tableBorderColor} ${tableBorderWidth} ${
                              activeCell ===
                              `${student.id}-${subject.name}-classe`
                                ? cellActiveBgColor
                                : ""
                            } ${noteCellHoverEffect}`}
                          >
                            <div
                              className="w-full h-14 cursor-pointer text-white flex items-center justify-center bg-blue-400"
                              title={`${student.first_name} ${student.sure_name} ${student.last_name}`}
                              onClick={() => {
                                setActiveCell(
                                  `${student.id}-${subject.name}-classe`
                                );
                                setCompo_or_Class("classe");
                                setTheStudentSelect(student);
                                setTheSubjectSelect(subject);
                              }}
                            >
                              {student.notes[subject.name]?.classe !== null
                                ? formatNote(
                                    student.notes[subject.name]?.classe
                                  )
                                : "-"}
                            </div>
                          </td>

                          {/* Note de composition */}
                          <td
                            className={`text-center border ${tableBorderColor} ${tableBorderWidth} ${
                              activeCell ===
                              `${student.id}-${subject.name}-composition`
                                ? cellActiveBgColor
                                : ""
                            } ${noteCellHoverEffect}`}
                          >
                            <div
                              className="w-full h-14 cursor-pointer text-white flex items-center justify-center bg-orange-400"
                              title={`${student.first_name} ${student.sure_name} ${student.last_name}`}
                              onClick={() => {
                                setActiveCell(
                                  `${student.id}-${subject.name}-composition`
                                );
                                setCompo_or_Class("composition");
                                setTheStudentSelect(student);
                                setTheSubjectSelect(subject);
                              }}
                            >
                              {student.notes[subject.name]?.composition !== null
                                ? formatNote(
                                    student.notes[subject.name]?.composition
                                  )
                                : "-"}
                            </div>
                          </td>

                          {/* Moyenne */}
                          <td
                            className={`px-2 py-2 bg-green-400 text-white text-center border ${tableBorderColor} ${tableBorderWidth} font-medium`}
                            title={`${student.first_name} ${student.sure_name} ${student.last_name}`}
                          >
                            {calculateSubjectAverageForStudent(
                              students,
                              student.id,
                              subject.name
                            )}
                          </td>
                        </React.Fragment>
                      ))}

                      {/* Moyenne générale */}
                      <td
                        className={`px-4 py-2 text-center border ${tableBorderColor} ${tableBorderWidth} font-bold`}
                        title={`${student.first_name} ${student.sure_name} ${student.last_name}`}
                      >
                        {calculateGeneralAverage(
                          students,
                          student.id,
                          subjects
                        )}
                      </td>

                      {/* Visualiseur de bulletin */}
                      <td
                        className={`px-4 py-2 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        <button
                          onClick={() => handleViewStudentBulletin(student)}
                          className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                          title={`${student.first_name} ${student.sure_name} ${student.last_name}`}
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td
                        className={`px-4 py-2 text-center border ${tableBorderColor} ${tableBorderWidth}`}
                      >
                        {showRemoveConfirm === student.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              title={translate("remove", language)}
                              onClick={() =>
                                removeStudentFromBulletin(student.id)
                              }
                              className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirm(null)}
                              title={translate("cancel", language)}
                              className="p-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-300"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowRemoveConfirm(student.id)}
                            title={translate("remove", language)}
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
                marginTop: "90%",
                marginBottom: "2%",
              }}
            >
              <div className="flex justify-between items-center mb-4 sm:mt-7">
                <h3 className="text-xl font-semibold">
                  {translate("preview_bulletin", language)}
                </h3>
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
                calculateSubjectAverageForStudent={
                  calculateSubjectAverageForStudent
                }
                calculateGeneralAverage={calculateGeneralAverage}
                theme={theme}
                textClass={textClass}
                language={language}
                students={students} // Ajout de la liste complète des étudiants
                handleCloseBulletinPreview={handleCloseBulletinPreview}
                school_name={school_name}
                school_short_name={school_short_name}
                school_zone_name={school_zone_name}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default BulletinNotes;
