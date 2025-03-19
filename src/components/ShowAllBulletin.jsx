import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { X, Search, Filter, Download, Settings, ChevronDown, Check, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from './contexts.js';
import { translations } from '../utils/bulletin_translation';
import BulletinGrid from './bulletin_components/BulletinGrid.jsx';
import BulletinHeader from './bulletin_components/BulletinHeader.jsx';
import BulletinSettings from './bulletin_components/BulletinSettings.jsx';
import BulletinFilters from './bulletin_components/BulletinFilters.jsx';
import { generateMultipleBulletinsPDF } from './bulletin_utils/BulletinPdfGenerator';
import { sortStudentsByAverage, sortStudentsByName, filterStudentsBySearch } from './bulletin_utils/BulletinMethods';

const ShowAllBulletin = ({
  selectedComposition,
  selectedClass,
  db,
  theme,
  textClass,
  handleCloseComponent,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  const { language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rank'); // 'rank', 'name', 'average'
  const [bulletinsPerPage, setBulletinsPerPage] = useState(1); // 1 or 2 bulletins per page
  const [selectedBulletinType, setSelectedBulletinType] = useState('type1'); // 'type1' or 'type2'
  const [bulletinLanguage, setBulletinLanguage] = useState(language);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Refs for components
  const containerRef = useRef(null);

  // Styles based on theme
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const buttonPrimary = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300";

  // Load bulletin data
  useEffect(() => {
    if (!db || !selectedClass || !selectedComposition) return;

    setLoading(true);

    // Find the bulletin
    const existingBulletin = db.bulletins?.find(
      bulletin => bulletin.compositionId === selectedComposition.id && bulletin.classId === selectedClass
    );

    if (existingBulletin) {
      // setBulletin(existingBulletin);
      setSubjects(existingBulletin.subjects);

      // Get students with notes
      const studentsWithNotes = existingBulletin.students.map(student => {
        return {
          ...student,
          average: calculateGeneralAverage(student.id),
          rank: 0 // Will be calculated below
        };
      });

      // Calculate ranks
      const sortedStudents = [...studentsWithNotes].sort((a, b) => {
        const avgA = parseFloat(a.average) || 0;
        const avgB = parseFloat(b.average) || 0;
        return avgB - avgA;
      });

      // Assign ranks
      sortedStudents.forEach((student, index) => {
        const studentToUpdate = studentsWithNotes.find(s => s.id === student.id);
        if (studentToUpdate) {
          studentToUpdate.rank = index + 1;
        }
      });

      setStudents(studentsWithNotes);
      setFilteredStudents(studentsWithNotes);
    }

    setLoading(false);
  }, [db, selectedClass, selectedComposition]);

  // Update filtered students when search or sort changes
  // Update filtered students when search or sort changes
  useEffect(() => {
    if (!students.length) return;

    console.log("Filtering students. Search term:", searchTerm, "Sort order:", sortOrder);

    let result = [...students]; // Copy students

    // Apply search filter
    if (searchTerm) {
      const beforeFilter = result.length;
      result = filterStudentsBySearch(result, searchTerm);
      console.log(`Search filter applied: ${beforeFilter} -> ${result.length} students`);
    }

    // Apply sort
    if (sortOrder === 'rank') {
      result.sort((a, b) => a.rank - b.rank);
      console.log("Sorted by rank");
    } else if (sortOrder === 'name') {
      result = sortStudentsByName(result);
      console.log("Sorted by name");
    } else if (sortOrder === 'average') {
      result = sortStudentsByAverage(result);
      console.log("Sorted by average");
    }

    setFilteredStudents(result);
    console.log("Filtered students updated:", result.length);
  }, [students, searchTerm, sortOrder]);

  // Calculate subject average for a student
  const calculateSubjectAverageForStudent = (studentId, subjectName) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.notes || !student.notes[subjectName]) return "-";

    const classeNote = student.notes[subjectName].classe;
    const compoNote = student.notes[subjectName].composition;

    if (classeNote === null && compoNote === null) return "-";
    if (classeNote === null) return compoNote.toFixed(2);
    if (compoNote === null) return classeNote.toFixed(2);

    const average = (parseFloat(classeNote) + parseFloat(compoNote)) / 2;
    return average.toFixed(2);
  };

  // Calculate general average for a student
  const calculateGeneralAverage = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return "-";

    let totalPoints = 0;
    let totalCoefficients = 0;

    subjects.forEach(subject => {
      const average = calculateSubjectAverageForStudent(studentId, subject.name);
      if (average !== "-") {
        totalPoints += parseFloat(average) * subject.coefficient;
        totalCoefficients += subject.coefficient;
      }
    });

    if (totalCoefficients === 0) return "-";
    return (totalPoints / totalCoefficients).toFixed(2);
  };

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Select all students
  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  // Generate PDF for selected students
  const handleGeneratePDF = async () => {
    setGenerating(true);

    // Get selected students data
    const studentsToExport = selectedStudents.length > 0
      ? students.filter(student => selectedStudents.includes(student.id))
      : filteredStudents;

    try {
      await generateMultipleBulletinsPDF({
        students: studentsToExport,
        subjects,
        composition: selectedComposition,
        className: db.classes.find(c => c.id === selectedClass)?.level + " " +
          db.classes.find(c => c.id === selectedClass)?.name,
        calculateSubjectAverageForStudent,
        calculateGeneralAverage,
        theme,
        textClass,
        language: bulletinLanguage,
        school_name,
        school_short_name,
        school_zone_name,
        bulletinsPerPage,
        bulletinType: selectedBulletinType
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  if (loading) {
    return (
      <div className={`fixed inset-0 ${bgColor} ${textClass} z-50 flex items-center justify-center`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">{translations[language].loading}</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-0 ${bgColor} ${textClass} z-50 overflow-hidden flex flex-col`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header with controls */}
      <BulletinHeader
        handleCloseComponent={handleCloseComponent}
        selectedComposition={selectedComposition}
        className={db.classes.find(c => c.id === selectedClass)?.level + " " +
          db.classes.find(c => c.id === selectedClass)?.name}
        theme={theme}
        textClass={textClass}
        buttonPrimary={buttonPrimary}
        buttonSecondary={buttonSecondary}
        setShowSettings={() => setShowSettings(!showSettings)}
        setShowFilters={() => setShowFilters(!showFilters)}
        handleGeneratePDF={handleGeneratePDF}
        generating={generating}
        selectedStudents={selectedStudents}
        filteredStudents={filteredStudents}
        language={language}
      />

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <BulletinSettings
            theme={theme}
            cardBgColor={cardBgColor}
            textClass={textClass}
            buttonPrimary={buttonPrimary}
            buttonSecondary={buttonSecondary}
            bulletinsPerPage={bulletinsPerPage}
            setBulletinsPerPage={setBulletinsPerPage}
            selectedBulletinType={selectedBulletinType}
            setSelectedBulletinType={setSelectedBulletinType}
            bulletinLanguage={bulletinLanguage}
            setBulletinLanguage={setBulletinLanguage}
            language={language}
            closeSettings={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <BulletinFilters
            theme={theme}
            cardBgColor={cardBgColor}
            textClass={textClass}
            buttonPrimary={buttonPrimary}
            buttonSecondary={buttonSecondary}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            selectAllStudents={selectAllStudents}
            selectedStudents={selectedStudents}
            filteredStudents={filteredStudents}
            language={language}
            closeFilters={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Bulletin Grid */}
      <div className="flex-1 overflow-auto p-4">
        <BulletinGrid
          filteredStudents={filteredStudents}
          subjects={subjects}
          composition={selectedComposition}
          className={db.classes.find(c => c.id === selectedClass)?.level + " " +
            db.classes.find(c => c.id === selectedClass)?.name}
          calculateSubjectAverageForStudent={calculateSubjectAverageForStudent}
          calculateGeneralAverage={calculateGeneralAverage}
          theme={theme}
          textClass={textClass}
          language={bulletinLanguage}
          students={students}
          school_name={school_name}
          school_short_name={school_short_name}
          school_zone_name={school_zone_name}
          selectedBulletinType={selectedBulletinType}
          selectedStudents={selectedStudents}
          toggleStudentSelection={toggleStudentSelection}
          cardBgColor={cardBgColor}
        />
      </div>
    </motion.div>
  );
};

export default ShowAllBulletin;