import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  Search, Filter, Download, Printer, Settings, ChevronDown,
  CheckCircle, Circle, ArrowUpDown, SlidersHorizontal, Languages,
  FileText, Layers, Eye, X, ArrowLeft, ArrowRight, RefreshCcw,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useLanguage } from "./contexts.js";
import BulletinPhysique1 from "./BulletinPhysique_1.jsx";
import BulletinPhysique2 from "./BulletinPhysique_2.jsx";

const ShowAllBulletin = ({
  selectedComposition,
  selectedClass,
  db,
  textClass,
  theme,
  getClasseName,
  handleCloseComponent,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  const { live_language, language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("rank"); // rank, name, average
  const [bulletinsPerPage, setBulletinsPerPage] = useState(1); // 1 ou 2
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulletinLanguage, setBulletinLanguage] = useState("Français");
  const [bulletinType, setBulletinType] = useState("type1"); // type1 ou type2
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showSortSelector, setShowSortSelector] = useState(false);
  const [className, setClassName] = useState("");
  const [bulletin, setBulletin] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [studentRanks, setStudentRanks] = useState({});
  const [topAverage, setTopAverage] = useState("-");
  const [topAverageSexe, setTopAverageSexe] = useState(null);
  const [studentClasseLevel, setStudentClasseLevel] = useState("1");

  // Références pour les bulletins
  const bulletinRefs = useRef([]);
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  // Styles conditionnels
  const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-blue-50";
  const tableRowHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50";
  const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonPrimary = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
  const buttonSecondary = theme === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300";
  const buttonSuccess = theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600";
  const buttonDanger = theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const dropdownBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownHoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const shadowColor = theme === "dark" ? "shadow-blue-900/20" : "shadow-purple-500/20";

  // Traductions
  const translations = {
    Français: {
      title: "Tous les Bulletins",
      search: "Rechercher un élève...",
      settings: "Paramètres",
      bulletinsPerPage: "Bulletins par page",
      bulletinLanguage: "Langue des bulletins",
      bulletinType: "Type de bulletin",
      sortBy: "Trier par",
      rank: "Rang",
      name: "Nom",
      average: "Moyenne",
      generatePDF: "Générer PDF",
      selectAll: "Tout sélectionner",
      selected: "sélectionné(s)",
      loading: "Chargement...",
      refreshing: "Actualisation...",
      type1: "Bulletin avec moyennes DEF",
      type2: "Bulletin standard",
      previous: "Précédent",
      next: "Suivant",
      page: "Page",
      of: "sur",
      noResults: "Aucun résultat trouvé",
      generating: "Génération en cours...",
    },
    English: {
      title: "All Report Cards",
      search: "Search for a student...",
      settings: "Settings",
      bulletinsPerPage: "Report cards per page",
      bulletinLanguage: "Report card language",
      bulletinType: "Report card type",
      sortBy: "Sort by",
      rank: "Rank",
      name: "Name",
      average: "Average",
      generatePDF: "Generate PDF",
      selectAll: "Select all",
      selected: "selected",
      loading: "Loading...",
      refreshing: "Refreshing...",
      type1: "Report card with DEF averages",
      type2: "Standard report card",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      noResults: "No results found",
      generating: "Generating...",
    },
    Bambara: {
      title: "Gafe Bɛɛ",
      search: "Kalandenw ɲini...",
      settings: "Labɛnw",
      bulletinsPerPage: "Gafe hakɛ",
      bulletinLanguage: "Gafe kan",
      bulletinType: "Gafe suguya",
      sortBy: "Woloma ka kɔn",
      rank: "Yɔrɔ",
      name: "Tɔgɔ",
      average: "Hakɛ caman",
      generatePDF: "PDF dilan",
      selectAll: "Bɛɛ sugandi",
      selected: "sugandilen",
      loading: "A bɛ lajɛ...",
      refreshing: "A bɛ kura...",
      type1: "Gafe ni DEF hakɛ caman",
      type2: "Gafe kɔrɔ",
      previous: "Kɔfɛ",
      next: "Ɲɛfɛ",
      page: "Gafe",
      of: "ka bɔ",
      noResults: "Foyi ma sɔrɔ",
      generating: "A bɛ dilan...",
    }
  };

  // Récupérer les traductions en fonction de la langue
  const t = translations[language] || translations.Français;

  // Récupérer le bulletin et initialiser les données
  useEffect(() => {
    if (!db || !selectedClass || !selectedComposition) return;

    setLoading(true);
    setIsRefreshing(true);

    // Trouver le bulletin correspondant
    const existingBulletin = db.bulletins?.find(
      bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
    );

    if (existingBulletin) {
      setBulletin(existingBulletin);
      setSubjects(existingBulletin.subjects);
      setStudents(existingBulletin.students);

      // Récupérer le nom de la classe
      const classObj = db.classes.find(cls => cls.id === selectedClass);
      if (classObj) {
        setClassName(`${classObj.level} ${classObj.name}`);
      }

      // Calculer les rangs des élèves
      calculateStudentRanks(existingBulletin.students);
    }

    setTimeout(() => {
      setLoading(false);
      setIsRefreshing(false);
    }, 1000);


  }, [db, selectedClass, selectedComposition]);

  // Calculer les rangs des élèves
  const calculateStudentRanks = (studentsList) => {
    // Calculer les moyennes de tous les élèves
    const averages = studentsList.map(s => ({
      id: s.id,
      sexe: s.sexe,
      average: parseFloat(calculateGeneralAverage(s.id, studentsList))
    })).filter(s => !isNaN(s.average)); // Filtrer les élèves sans moyenne

    // Trier les moyennes par ordre décroissant
    averages.sort((a, b) => b.average - a.average);

    // Trouver la meilleure moyenne
    if (averages.length > 0) {
      setTopAverage(averages[0].average.toFixed(2));
      setTopAverageSexe(averages[0].sexe);
    }

    // Calculer le rang de chaque élève
    const ranks = {};
    averages.forEach((student, index) => {
      const position = index + 1;
      const _student_position = position === 1
        ? student.sexe === "F" ? "1ère" : "1er"
        : `${position}ème`;

      // Vérifier si plusieurs élèves ont la même moyenne
      const sameAverages = averages.filter(s => s.average === student.average);
      ranks[student.id] = sameAverages.length > 1
        ? `${_student_position} EX`
        : _student_position;
    });

    setStudentRanks(ranks);
  };

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
  const calculateSubjectAverageForStudent = (studentId, subjectName, studentsList = students) => {
    const student = studentsList.find(s => s.id === studentId);
    if (!student || !student.notes[subjectName]) return "-";

    const classeNote = student.notes[subjectName].classe;
    const compoNote = student.notes[subjectName].composition;

    return calculateSubjectAverage(classeNote, compoNote);
  };

  // Calculer la moyenne générale d'un élève
  const calculateGeneralAverage = (studentId, studentsList = students) => {
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return "-";

    let totalPoints = 0;
    let totalCoefficients = 0;

    subjects.forEach(subject => {
      const subjectAvg = calculateSubjectAverageForStudent(studentId, subject.name, studentsList);
      if (subjectAvg !== "-") {
        totalPoints += parseFloat(subjectAvg) * subject.coefficient;
        totalCoefficients += subject.coefficient;
      }
    });

    if (totalCoefficients === 0) return "-";
    return (totalPoints / totalCoefficients).toFixed(2);
  };

  // Calculer le total des points (moyenne * coefficient)
  const calculateTotalPoints = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return "-";

    let total = 0;
    subjects.forEach(subject => {
      const avg = calculateSubjectAverageForStudent(studentId, subject.name);
      if (avg !== "-") {
        total += parseFloat(avg) * subject.coefficient;
      }
    });
    return total.toFixed(2);
  };

  // Calculer le total des coefficients pour les matières principales
  const calculateMainCoefficients = () => {
    const mainSubjects = subjects.filter(subject =>
      subject.name !== "Dessin" &&
      subject.name !== "Musique" &&
      subject.name !== "Lecture" &&
      subject.name !== "Récitation" &&
      subject.name !== "Conduite"
    );
    return mainSubjects.reduce((total, subject) => total + subject.coefficient, 0);
  };

  // Calculer le total des points pour les matières principales
  const calculateMainPoints = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return "-";

    const mainSubjects = subjects.filter(subject =>
      subject.name !== "Dessin" &&
      subject.name !== "Musique" &&
      subject.name !== "Lecture" &&
      subject.name !== "Récitation" &&
      subject.name !== "Conduite"
    );

    let total = 0;
    mainSubjects.forEach(subject => {
      const avg = calculateSubjectAverageForStudent(studentId, subject.name);
      if (avg !== "-") {
        total += parseFloat(avg) * subject.coefficient;
      }
    });
    return total.toFixed(2);
  };

  // Fonction pour déterminer l'appréciation basée sur la note
  const getAppreciation = (note) => {
    if (note === "-") return "-";
    const numNote = parseFloat(note);
    if (numNote >= 18) return "Excellent";
    if (numNote >= 16) return "Très-Bien";
    if (numNote >= 14) return "Bien";
    if (numNote >= 12) return "Assez-Bien";
    if (numNote >= 10) return "Passable";
    if (numNote >= 5) return "Insuffisant";
    return "Très-Faible";
  };

  // Obtenir l'année scolaire actuelle
  const getCurrentSchoolYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Si nous sommes entre septembre et décembre, l'année scolaire est année-année+1
    // Sinon, c'est année-1-année
    if (month >= 8) { // Septembre à décembre
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // Séparer les matières principales et secondaires
  const getMainSubjects = () => {
    return subjects.filter(subject =>
      subject.name !== "Dessin" &&
      subject.name !== "Musique" &&
      subject.name !== "Lecture" &&
      subject.name !== "Récitation" &&
      subject.name !== "Conduite"
    );
  };

  const getSecondarySubjects = () => {
    return subjects.filter(subject =>
      subject.name === "Dessin" ||
      subject.name === "Musique" ||
      subject.name === "Lecture" ||
      subject.name === "Récitation" ||
      subject.name === "Conduite"
    );
  };

  // Filtrer et trier les élèves
  const filteredStudents = students
    .filter(student => {
      const fullName = `${student.first_name} ${student.sure_name || ''} ${student.last_name || ''}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === "rank") {
        // Extraire le numérique du rang (1er -> 1, 2ème -> 2)
        const rankA = studentRanks[a.id] ? parseInt(studentRanks[a.id].match(/\d+/)?.[0] || "999") : 999;
        const rankB = studentRanks[b.id] ? parseInt(studentRanks[b.id].match(/\d+/)?.[0] || "999") : 999;
        return rankA - rankB;
      } else if (sortOrder === "name") {
        const nameA = `${a.first_name} ${a.sure_name || ''} ${a.last_name || ''}`.toLowerCase();
        const nameB = `${b.first_name} ${b.sure_name || ''} ${b.last_name || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else if (sortOrder === "average") {
        const avgA = parseFloat(calculateGeneralAverage(a.id)) || 0;
        const avgB = parseFloat(calculateGeneralAverage(b.id)) || 0;
        return avgB - avgA; // Ordre décroissant
      }
      return 0;
    });

  // Pagination
  const studentsPerPage = bulletinsPerPage === 1 ? 20 : 20; // 20 bulletins par ligne
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    currentPage * studentsPerPage,
    (currentPage + 1) * studentsPerPage
  );

  // Gérer la sélection d'un élève
  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Gérer la sélection de tous les élèves
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };

  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Générer le PDF
  const handleGeneratePDF = async () => {
    if (selectedStudents.length === 0) return;

    setIsGeneratingPDF(true);

    try {
      // Créer un nouveau document PDF
      const pdf = new jsPDF({
        orientation: bulletinsPerPage === 1 ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Dimensions de la page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Sélectionner les élèves à inclure dans le PDF
      const studentsToInclude = selectedStudents.length > 0
        ? students.filter(student => selectedStudents.includes(student.id))
        : students;

      // Générer les bulletins
      for (let i = 0; i < studentsToInclude.length; i += bulletinsPerPage) {
        if (i > 0) {
          pdf.addPage();
        }

        // Créer un conteneur temporaire pour les bulletins
        const tempContainer = document.createElement('div');
        tempContainer.style.width = bulletinsPerPage === 1 ? '210mm' : '297mm';
        tempContainer.style.height = bulletinsPerPage === 1 ? '297mm' : '210mm';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);

        // Ajouter les bulletins au conteneur
        const bulletinsToRender = [];
        for (let j = 0; j < bulletinsPerPage && i + j < studentsToInclude.length; j++) {
          const student = studentsToInclude[i + j];

          // Créer un élément pour le bulletin
          const bulletinElement = document.createElement('div');
          bulletinElement.style.width = bulletinsPerPage === 1 ? '100%' : '50%';
          bulletinElement.style.float = 'left';
          bulletinElement.style.boxSizing = 'border-box';
          bulletinElement.style.padding = '5mm';

          // Ajouter le bulletin à la liste
          bulletinsToRender.push({
            element: bulletinElement,
            student: student
          });

          tempContainer.appendChild(bulletinElement);
        }

        // Rendre les bulletins avec React
        for (const bulletinInfo of bulletinsToRender) {
          const BulletinComponent = bulletinType === 'type1' ? BulletinPhysique1 : BulletinPhysique2;

          // Créer une référence pour le bulletin
          const bulletinRef = React.createRef();

          // Rendre le bulletin
          ReactDOM.render(
            <BulletinComponent
              ref={bulletinRef}
              student={bulletinInfo.student}
              students={students}
              className={className}
              composition={selectedComposition}
              mainSubjects={getMainSubjects()}
              secondarySubjects={getSecondarySubjects()}
              printRef={bulletinRef}
              tableBgColor={tableBgColor}
              textClass={textClass}
              tableRowBg={theme === "dark" ? "bg-gray-800" : "bg-white"}
              tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
              mainCoefficients={calculateMainCoefficients()}
              totalCoefficients={subjects.reduce((total, subject) => total + subject.coefficient, 0)}
              topAverage={topAverage}
              topAverageSexe={topAverageSexe}
              studentRank={studentRanks[bulletinInfo.student.id] || "-"}
              calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
              calculateTotalPoints={() => calculateTotalPoints(bulletinInfo.student.id)}
              calculateGeneralAverage={() => calculateGeneralAverage(bulletinInfo.student.id)}
              getAppreciation={getAppreciation}
              calculateMainPoints={() => calculateMainPoints(bulletinInfo.student.id)}
              getCurrentSchoolYear={getCurrentSchoolYear}
              school_name={school_name}
              school_short_name={school_short_name}
              school_zone_name={school_zone_name}
              setStudentClasseLevel={() => { }}
            />,
            bulletinInfo.element
          );
        }

        // Attendre que les bulletins soient rendus
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capturer les bulletins en image
        const canvas = await html2canvas(tempContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

        // Nettoyer
        document.body.removeChild(tempContainer);
      }

      // Enregistrer le PDF
      pdf.save(`Bulletins_${className}_${selectedComposition.label}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Rafraîchir les données
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (db && selectedClass && selectedComposition) {
        const existingBulletin = db.bulletins?.find(
          bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
        );

        if (existingBulletin) {
          setBulletin(existingBulletin);
          setSubjects(existingBulletin.subjects);
          setStudents(existingBulletin.students);
          calculateStudentRanks(existingBulletin.students);
        }
      }
      setIsRefreshing(false);
    }, 1000);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Rendu du composant
  return (
    <div className={`${textClass} scrollbar-custom overflow-auto fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center`}>
      {/* Overlay de chargement */}
      <AnimatePresence>
        {(loading || isGeneratingPDF) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={`${cardBg} p-8 rounded-lg shadow-xl flex flex-col items-center`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <RefreshCcw size={40} className="text-blue-500" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2">
                {isGeneratingPDF ? t.generating : (isRefreshing ? t.refreshing : t.loading)}
              </h2>
              <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-blue-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <motion.div
        // variants={containerVariants}
        ref={popupRef}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4"
        style={{
          marginTop: "80em",
          // marginBottom: "5em",
        }}
      >
        {/* En-tête */}
        <motion.div
          // variants={itemVariants}
          className={`${cardBg} rounded-lg shadow-lg ${shadowColor} p-6 mb-6`}
          style={{
            marginTop: showSettings ? "44%" : "15%",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <motion.h1
              className="text-3xl font-bold mb-4 md:mb-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t.title} - {className}
            </motion.h1>

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleRefresh}
                className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
                disabled={isRefreshing}
              >
                <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? t.refreshing : ""}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <Settings size={16} />
                {t.settings}
              </button>

              <button
                onClick={handleGeneratePDF}
                disabled={selectedStudents.length === 0 || isGeneratingPDF}
                className={`${buttonSuccess} text-white px-4 py-2 rounded-lg flex items-center gap-2 ${selectedStudents.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Download size={16} />
                {t.generatePDF} ({selectedStudents.length} {t.selected})
              </button>

              <button
                onClick={handleCloseComponent}
                className={`${buttonDanger} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <X size={16} />
              </button>
            </motion.div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-grow">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className={`${inputBg} border ${tableBorderColor} rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortSelector(!showSortSelector)}
                className={`${buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center`}
              >
                <ArrowUpDown size={16} />
                {t.sortBy}: {t[sortOrder]}
                <ChevronDown size={16} className={`transition-transform ${showSortSelector ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showSortSelector && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`absolute right-0 mt-2 w-48 ${dropdownBg} border ${tableBorderColor} rounded-lg shadow-lg z-10`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortOrder("rank");
                          setShowSortSelector(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${sortOrder === "rank" ? "font-bold" : ""}`}
                      >
                        {sortOrder === "rank" ? <CheckCircle size={16} /> : <Circle size={16} />}
                        {t.rank}
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("name");
                          setShowSortSelector(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${sortOrder === "name" ? "font-bold" : ""}`}
                      >
                        {sortOrder === "name" ? <CheckCircle size={16} /> : <Circle size={16} />}
                        {t.name}
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("average");
                          setShowSortSelector(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${sortOrder === "average" ? "font-bold" : ""}`}
                      >
                        {sortOrder === "average" ? <CheckCircle size={16} /> : <Circle size={16} />}
                        {t.average}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleSelectAll}
                className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                {selectAll ? <CheckCircle size={16} /> : <Circle size={16} />}
                {t.selectAll}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Panneau de paramètres */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`${cardBg} rounded-lg shadow-lg ${shadowColor} p-6 mb-6 overflow-hidden`}
            >
              <h2 className="text-xl font-bold mb-4">{t.settings}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bulletins par page */}
                <div
                  // style={{
                  //   marginBottom: "10em"
                  // }}
                >
                  <h3 className="font-semibold mb-2">{t.bulletinsPerPage}</h3>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="1"
                      value={bulletinsPerPage}
                      onChange={(e) => setBulletinsPerPage(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-2 font-bold">{bulletinsPerPage}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>1 (Portrait)</span>
                    <span>2 (Landscape)</span>
                  </div>
                  
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                      marginTop: "40%",
                      // marginLeft: "70em",
                    }}
                    className={`${buttonDanger} text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center`}
                  >Fermer</button>
                </div>

                {/* Type de bulletin */}
                <div>
                  <h3 className="font-semibold mb-2">{t.bulletinType}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowTypeSelector(!showTypeSelector)}
                      className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        {bulletinType === "type1" ? t.type1 : t.type2}
                      </div>
                      <ChevronDown size={16} className={`transition-transform ${showTypeSelector ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showTypeSelector && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`absolute left-0 right-0 mt-2 ${dropdownBg} border ${tableBorderColor} rounded-lg shadow-lg z-10`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setBulletinType("type1");
                                setShowTypeSelector(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${bulletinType === "type1" ? "font-bold" : ""}`}
                            >
                              {bulletinType === "type1" ? <CheckCircle size={16} /> : <Circle size={16} />}
                              {t.type1}
                            </button>
                            <button
                              onClick={() => {
                                setBulletinType("type2");
                                setShowTypeSelector(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${bulletinType === "type2" ? "font-bold" : ""}`}
                            >
                              {bulletinType === "type2" ? <CheckCircle size={16} /> : <Circle size={16} />}
                              {t.type2}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Langue des bulletins */}
                <div>
                  <h3 className="font-semibold mb-2">{t.bulletinLanguage}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                      className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        <Languages size={16} />
                        {bulletinLanguage}
                      </div>
                      <ChevronDown size={16} className={`transition-transform ${showLanguageSelector ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showLanguageSelector && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`absolute left-0 right-0 mt-2 ${dropdownBg} border ${tableBorderColor} rounded-lg shadow-lg z-10`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setBulletinLanguage("Français");
                                setShowLanguageSelector(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${bulletinLanguage === "Français" ? "font-bold" : ""}`}
                            >
                              {bulletinLanguage === "Français" ? <CheckCircle size={16} /> : <Circle size={16} />}
                              Français
                            </button>
                            <button
                              onClick={() => {
                                setBulletinLanguage("English");
                                setShowLanguageSelector(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${bulletinLanguage === "English" ? "font-bold" : ""}`}
                            >
                              {bulletinLanguage === "English" ? <CheckCircle size={16} /> : <Circle size={16} />}
                              English
                            </button>
                            <button
                              onClick={() => {
                                setBulletinLanguage("Bambara");
                                setShowLanguageSelector(false);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${dropdownHoverBg} ${bulletinLanguage === "Bambara" ? "font-bold" : ""}`}
                            >
                              {bulletinLanguage === "Bambara" ? <CheckCircle size={16} /> : <Circle size={16} />}
                              Bambara
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille des bulletins */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student, index) => (
              <motion.div
                key={student.id}
                variants={itemVariants}
                className={`${cardBg} rounded-lg shadow-lg ${shadowColor} overflow-hidden relative`}
              >
                {/* Checkbox de sélection */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleSelectStudent(student.id)}
                    className={`${selectedStudents.includes(student.id) ? buttonSuccess : buttonSecondary} text-white p-2 rounded-full`}
                  >
                    {selectedStudents.includes(student.id) ? <CheckCircle size={16} /> : <Circle size={16} />}
                  </button>
                </div>

                {/* Aperçu du bulletin */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {student.first_name} {student.sure_name || ''} {student.last_name || ''}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{t.rank}: {studentRanks[student.id] || "-"}</span>
                        <span className="font-semibold">{t.average}: {calculateGeneralAverage(student.id)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aperçu miniature du bulletin */}
                  <div className="relative h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center transform scale-[0.25] origin-top-left" style={{ width: '400%', height: '400%' }}>
                      {bulletinType === "type1" ? (
                        <BulletinPhysique1
                          student={student}
                          students={students}
                          className={className}
                          composition={selectedComposition}
                          mainSubjects={getMainSubjects()}
                          secondarySubjects={getSecondarySubjects()}
                          printRef={el => bulletinRefs.current[index] = el}
                          tableBgColor={tableBgColor}
                          textClass={textClass}
                          tableRowBg={tableRowHoverBg}
                          tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                          mainCoefficients={calculateMainCoefficients()}
                          totalCoefficients={subjects.reduce((total, subject) => total + subject.coefficient, 0)}
                          topAverage={topAverage}
                          topAverageSexe={topAverageSexe}
                          studentRank={studentRanks[student.id] || "-"}
                          calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
                          calculateTotalPoints={() => calculateTotalPoints(student.id)}
                          calculateGeneralAverage={() => calculateGeneralAverage(student.id)}
                          getAppreciation={getAppreciation}
                          calculateMainPoints={() => calculateMainPoints(student.id)}
                          getCurrentSchoolYear={getCurrentSchoolYear}
                          school_name={school_name}
                          school_short_name={school_short_name}
                          school_zone_name={school_zone_name}
                          setStudentClasseLevel={setStudentClasseLevel}
                        />
                      ) : (
                        <BulletinPhysique2
                          student={student}
                          students={students}
                          className={className}
                          composition={selectedComposition}
                          mainSubjects={getMainSubjects()}
                          secondarySubjects={getSecondarySubjects()}
                          printRef={el => bulletinRefs.current[index] = el}
                          tableBgColor={tableBgColor}
                          textClass={textClass}
                          tableRowBg={tableRowHoverBg}
                          tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                          mainCoefficients={calculateMainCoefficients()}
                          totalCoefficients={subjects.reduce((total, subject) => total + subject.coefficient, 0)}
                          topAverage={topAverage}
                          topAverageSexe={topAverageSexe}
                          studentRank={studentRanks[student.id] || "-"}
                          calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
                          calculateTotalPoints={() => calculateTotalPoints(student.id)}
                          calculateGeneralAverage={() => calculateGeneralAverage(student.id)}
                          getAppreciation={getAppreciation}
                          calculateMainPoints={() => calculateMainPoints(student.id)}
                          getCurrentSchoolYear={getCurrentSchoolYear}
                          school_name={school_name}
                          school_short_name={school_short_name}
                          school_zone_name={school_zone_name}
                          setStudentClasseLevel={setStudentClasseLevel}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className={`${cardBg} rounded-lg shadow-lg ${shadowColor} p-6 col-span-2 flex flex-col items-center justify-center`}
            >
              <Search size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-center">{t.noResults}</h3>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-6"
          >
            <div className={`${cardBg} rounded-lg shadow-lg ${shadowColor} p-4 flex items-center gap-4`}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2 ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <ChevronLeft size={16} />
                {t.previous}
              </button>

              <div className="flex items-center gap-2">
                <span>{t.page}</span>
                <span className="font-bold">{currentPage + 1}</span>
                <span>{t.of}</span>
                <span className="font-bold">{totalPages}</span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`${buttonSecondary} text-white px-4 py-2 rounded-lg flex items-center gap-2 ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {t.next}
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ShowAllBulletin;