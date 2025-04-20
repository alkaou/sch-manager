import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Settings, Download, Printer, Check, Globe } from 'lucide-react';
import { translations } from '../utils/bulletin_translation';
import BulletinCard from './bulletin_components/BulletinCard.jsx';
import BulletinSettings from './bulletin_components/BulletinSettings.jsx';
import BulletinFilters from './bulletin_components/BulletinFilters.jsx';
import BulletinPagination from './bulletin_components/BulletinPagination.jsx';
import { generateMultipleBulletinsPDF } from './bulletin_utils/BulletinPDFGenerator';
import { sortStudentsByAverage, sortStudentsByName } from './bulletin_utils/BulletinMethods';
import { getClasseName } from "../utils/helpers";
import { useLanguage } from "./contexts";
import { gradients } from '../utils/colors';

const ShowAllBulletin = ({
  selectedComposition,
  selectedClass,
  db,
  theme,
  textClass,
  app_bg_color,
  handleCloseComponent,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  // States
  // const [bulletin, setBulletin] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rank'); // 'rank', 'name', 'average'
  const [bulletinsPerPage, setBulletinsPerPage] = useState(2); // 1 or 2 bulletins per page
  const [bulletinLanguage, setBulletinLanguage] = useState('Français');
  const [bulletinType, setBulletinType] = useState('type1');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [className, setClassName] = useState('');
  const [allStudentBulletinRefs, setallStudentBulletinRefs] = useState([]);

  // Refs
  const containerRef = useRef(null);
  const { language } = useLanguage();

  // Styles based on theme
  const opacity = theme === "dark" || app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "bg-opacity-30" : "bg-opacity-50";
  const bgColor = `${app_bg_color} ${textClass}`;
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700";
  const buttonDanger = "bg-red-600 hover:bg-red-700";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700";

  // Get translations based on selected language
  // const t = translations[bulletinLanguage] || translations.Français;
  const live_language = translations[language] || translations.Français;

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
      setStudents(existingBulletin.students);
    }

    // Get class name
    const classObj = db.classes?.find(cls => cls.id === selectedClass);
    if (classObj) {
      setClassName(`${classObj.level} ${classObj.name}`.trim());
    }

    setLoading(false);
  }, [db, selectedClass, selectedComposition]);

  // Filter and sort students
  const filteredStudents = students
    .filter(student =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return sortStudentsByName(a, b);
      } else if (sortOption === 'average') {
        // Utiliser directement la fonction sans inverser les paramètres
        return sortStudentsByAverage(a, b, students, subjects);
      } else {
        // Default: sort by rank (average descending)
        return sortStudentsByAverage(a, b, students, subjects);
      }
    });

  // Pagination
  const studentsPerPage = 20;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Obtenir les ref des bullettin de tous les students
  const getStudentBulletinRef = (studentId, studentBulletinRef) => {
    // console.log({ studentId, studentBulletinRef });
    if (studentBulletinRef !== null) {
      setallStudentBulletinRefs(prevRefs => [
        ...prevRefs,
        { studentId, studentBulletinRef }
      ]);
    }
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

    try {
      // Get students to include in PDF
      const studentsToInclude = selectedStudents.length > 0
        ? students.filter(student => selectedStudents.includes(student.id))
        : filteredStudents;

      // Generate PDF
      await generateMultipleBulletinsPDF({
        students: studentsToInclude,
        composition: selectedComposition,
        className,
        bulletinsPerPage,
        allStudentBulletinRefs: allStudentBulletinRefs,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
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
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${bgColor} overflow-hidden flex flex-col`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      ref={containerRef}
    >
      {/* Header */}
      <motion.div
        className={`sticky top-0 z-10 ${bgColor} shadow-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b ${borderColor}`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleCloseComponent}
            className={`p-2 rounded-full ${buttonDanger} text-white transition-all duration-300 hover:scale-105`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className={`text-2xl font-bold ${textClass}`}>{live_language.title}</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
            {selectedComposition?.label} - {getClasseName(className)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className={`flex items-center bg-gray-700 px-3 py-2 rounded-lg border ${opacity} border-radius-10 ${borderColor}`}>
            <Search size={18} className={textClass} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={live_language.search}
              className={`ml-2 bg-transparent outline-none ${textClass} w-40 md:w-60`}
            />
          </div>

          {/* Filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${buttonSecondary} flex items-center gap-2 transition-all duration-300 hover:scale-105`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">{live_language.filters}</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${buttonSecondary} flex items-center gap-2 transition-all duration-300 hover:scale-105`}
          >
            <Settings size={18} />
            <span className="hidden sm:inline">{live_language.settings}</span>
          </button>

          {/* Generate PDF button */}
          <button
            onClick={handleGeneratePDF}
            disabled={generating}
            className={`p-2 rounded-lg ${buttonPrimary} border border-2 border-white text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 ${generating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>{live_language.generating}</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>{live_language.generatePDF}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <BulletinSettings
            theme={theme}
            textClass={textClass}
            cardBgColor={app_bg_color}
            borderColor={borderColor}
            bulletinsPerPage={bulletinsPerPage}
            setBulletinsPerPage={setBulletinsPerPage}
            bulletinLanguage={bulletinLanguage}
            setBulletinLanguage={setBulletinLanguage}
            bulletinType={bulletinType}
            setBulletinType={setBulletinType}
            t={live_language}
          />
        )}
      </AnimatePresence>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <BulletinFilters
            theme={theme}
            textClass={textClass}
            cardBgColor={app_bg_color}
            borderColor={borderColor}
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedStudents={selectedStudents}
            filteredStudents={filteredStudents}
            selectAllStudents={selectAllStudents}
            t={live_language}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 scrollbar-custom">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className={`ml-3 ${textClass} text-lg`}>{live_language.loading}</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className={`text-center ${textClass} p-10`}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun élève trouvé</h3>
            <p>Veuillez modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {currentStudents.map((student, index) => (
              <motion.div
                key={student.id}
                variants={itemVariants}
                className="relative"
              >
                <div
                  className={`absolute -top-3 -left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${selectedStudents.includes(student.id)
                    ? 'bg-blue-600 text-white'
                    : `${cardBgColor} border ${borderColor} ${textClass}`
                    }`}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  {selectedStudents.includes(student.id) && <Check size={16} />}
                </div>
                <BulletinCard
                  student={student}
                  students={students}
                  subjects={subjects}
                  composition={selectedComposition}
                  className={className}
                  theme={theme}
                  textClass={textClass}
                  language={bulletinLanguage}
                  school_name={school_name}
                  school_short_name={school_short_name}
                  school_zone_name={school_zone_name}
                  getStudentBulletinRef={getStudentBulletinRef}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredStudents.length > 0 && (
        <BulletinPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          theme={theme}
          textClass={textClass}
          borderColor={borderColor}
          buttonSecondary={buttonSecondary}
          buttonPrimary={buttonPrimary}
        />
      )}

      {/* Status bar */}
      <div className={`${bgColor} border-t ${borderColor} px-6 py-3 flex justify-between items-center`}>
        <div className={textClass}>
          <span className="font-medium">{filteredStudents.length}</span> {live_language.studentsFound}
          {selectedStudents.length > 0 && (
            <span className="ml-2">• <span className="font-medium">{selectedStudents.length}</span> {live_language.selected}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${textClass}`}>
            <Globe size={16} />
            <span>{bulletinLanguage}</span>
          </div>
          <div className={`flex items-center gap-2 ${textClass}`}>
            <Printer size={16} />
            <span>{bulletinsPerPage === 1 ? '1 bulletin/page' : '2 bulletins/page'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShowAllBulletin;