import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import BulletinPhysique1 from '../BulletinPhysique_1.jsx';
import BulletinPhysique2 from '../BulletinPhysique_2.jsx';

const BulletinGrid = ({
  filteredStudents,
  subjects,
  composition,
  className,
  calculateSubjectAverageForStudent,
  calculateGeneralAverage,
  theme,
  textClass,
  // language,
  students,
  school_name,
  school_short_name,
  school_zone_name,
  selectedBulletinType,
  selectedStudents,
  toggleStudentSelection,
  cardBgColor
}) => {
  // Animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Styles
  const checkboxStyle = theme === "dark"
    ? "absolute top-2 right-2 w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
    : "absolute top-2 right-2 w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors";

  const checkboxActiveStyle = theme === "dark"
    ? "absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
    : "absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors";

  // Function to get student rank
  const getStudentRank = (studentId) => {
    const sortedStudents = [...students]
      .filter(s => {
        const avg = calculateGeneralAverage(s.id);
        return avg !== "-" && !isNaN(parseFloat(avg));
      })
      .sort((a, b) => {
        const avgA = parseFloat(calculateGeneralAverage(a.id));
        const avgB = parseFloat(calculateGeneralAverage(b.id));
        return avgB - avgA;
      });

    const position = sortedStudents.findIndex(s => s.id === studentId) + 1;
    const student = students.find(s => s.id === studentId);

    if (position <= 0) return "-";

    // Format rank with gender consideration
    const formattedPosition = position === 1
      ? student.sexe === "F" ? "1ère" : "1er"
      : `${position}ème`;

    // Check for ex-aequo
    const sameAverages = sortedStudents.filter(s =>
      parseFloat(calculateGeneralAverage(s.id)) === parseFloat(calculateGeneralAverage(studentId))
    );

    return sameAverages.length > 1 ? `${formattedPosition} EX` : formattedPosition;
  };

  // Function to get top average
  const getTopAverage = () => {
    const averages = students
      .map(s => ({
        id: s.id,
        sexe: s.sexe,
        average: parseFloat(calculateGeneralAverage(s.id))
      }))
      .filter(s => !isNaN(s.average));

    averages.sort((a, b) => b.average - a.average);

    return averages.length > 0 ? {
      average: averages[0].average.toFixed(2),
      sexe: averages[0].sexe
    } : { average: "-", sexe: null };
  };

  const topAverage = getTopAverage();

  // Separate subjects into main and secondary
  const mainSubjects = subjects.filter(subject =>
    subject.name !== "Dessin" &&
    subject.name !== "Musique" &&
    subject.name !== "Lecture" &&
    subject.name !== "Récitation" &&
    subject.name !== "Conduite"
  );

  const secondarySubjects = subjects.filter(subject =>
    subject.name === "Dessin" ||
    subject.name === "Musique" ||
    subject.name === "Lecture" ||
    subject.name === "Récitation" ||
    subject.name === "Conduite"
  );

  // Calculate total coefficients
  const totalCoefficients = subjects.reduce((total, subject) => total + subject.coefficient, 0);
  const mainCoefficients = mainSubjects.reduce((total, subject) => total + subject.coefficient, 0);

  // Function to calculate total points
  const calculateTotalPoints = (studentId) => {
    let total = 0;
    subjects.forEach(subject => {
      const avg = calculateSubjectAverageForStudent(studentId, subject.name);
      if (avg !== "-") {
        total += parseFloat(avg) * subject.coefficient;
      }
    });
    return total.toFixed(2);
  };

  // Function to calculate main points
  const calculateMainPoints = (studentId) => {
    let total = 0;
    mainSubjects.forEach(subject => {
      const avg = calculateSubjectAverageForStudent(studentId, subject.name);
      if (avg !== "-") {
        total += parseFloat(avg) * subject.coefficient;
      }
    });
    return total.toFixed(2);
  };

  // Function to get appreciation
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

  // Function to get current school year
  const getCurrentSchoolYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (month >= 8) { // September to December
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // Create a dummy ref for the bulletin preview
  const dummyRef = React.useRef();

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredStudents.map(student => (
        <motion.div
          key={student.id}
          className={`relative ${cardBgColor} rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl scale-95 hover:scale-100`}
          variants={itemVariants}
        >
          {/* Selection checkbox */}
          <div
            className={selectedStudents.includes(student.id) ? checkboxActiveStyle : checkboxStyle}
            onClick={(e) => {
              e.stopPropagation();
              toggleStudentSelection(student.id);
              console.log("Student selected:", student.id); // Ajout de log pour déboguer
            }}
          >
            {selectedStudents.includes(student.id) && <Check size={16} color="white" />}
          </div>

          {/* Student rank badge */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            {getStudentRank(student.id)}
          </div>

          {/* Bulletin content */}
          <div className="transform scale-[0.65] origin-top mt-[-80px]">
            {selectedBulletinType === 'type1' ? (
              <BulletinPhysique1
                student={student}
                students={students}
                className={className}
                composition={composition}
                mainSubjects={mainSubjects}
                secondarySubjects={secondarySubjects}
                printRef={dummyRef}
                tableBgColor={cardBgColor}
                textClass={textClass}
                tableRowBg={theme === "dark" ? "bg-gray-800" : "bg-white"}
                tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                mainCoefficients={mainCoefficients}
                totalCoefficients={totalCoefficients}
                topAverage={topAverage.average}
                topAverageSexe={topAverage.sexe}
                studentRank={getStudentRank(student.id)}
                calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
                calculateTotalPoints={() => calculateTotalPoints(student.id)}
                calculateGeneralAverage={(id) => calculateGeneralAverage(id)}
                getAppreciation={getAppreciation}
                calculateMainPoints={() => calculateMainPoints(student.id)}
                getCurrentSchoolYear={getCurrentSchoolYear}
                school_name={school_name}
                school_short_name={school_short_name}
                school_zone_name={school_zone_name}
                setStudentClasseLevel={() => { }}
              />
            ) : (
              <BulletinPhysique2
                student={student}
                students={students}
                className={className}
                composition={composition}
                mainSubjects={mainSubjects}
                secondarySubjects={secondarySubjects}
                printRef={dummyRef}
                tableBgColor={cardBgColor}
                textClass={textClass}
                tableRowBg={theme === "dark" ? "bg-gray-800" : "bg-white"}
                tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                mainCoefficients={mainCoefficients}
                totalCoefficients={totalCoefficients}
                topAverage={topAverage.average}
                topAverageSexe={topAverage.sexe}
                studentRank={getStudentRank(student.id)}
                calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
                calculateTotalPoints={() => calculateTotalPoints(student.id)}
                calculateGeneralAverage={(id) => calculateGeneralAverage(id)}
                getAppreciation={getAppreciation}
                calculateMainPoints={() => calculateMainPoints(student.id)}
                getCurrentSchoolYear={getCurrentSchoolYear}
                school_name={school_name}
                school_short_name={school_short_name}
                school_zone_name={school_zone_name}
                setStudentClasseLevel={() => { }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BulletinGrid;