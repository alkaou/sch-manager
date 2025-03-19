import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import BulletinPhysique1 from '../BulletinPhysique_1.jsx';
import BulletinPhysique2 from '../BulletinPhysique_2.jsx';

/**
 * Generate PDF for multiple bulletins
 */
export const generateMultipleBulletinsPDF = async ({
  students,
  subjects,
  composition,
  className,
  calculateSubjectAverageForStudent,
  calculateGeneralAverage,
  theme,
  textClass,
  language,
  school_name,
  school_short_name,
  school_zone_name,
  bulletinsPerPage,
  bulletinType
}) => {
  // Create a temporary container for rendering bulletins
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  document.body.appendChild(tempContainer);

  try {
    // Create PDF with appropriate orientation
    const pdf = new jsPDF({
      orientation: bulletinsPerPage === 1 ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Process students in batches based on bulletinsPerPage
    for (let i = 0; i < students.length; i += bulletinsPerPage) {
      // Clear the temporary container
      tempContainer.innerHTML = '';

      // Create a wrapper for the current page
      const pageWrapper = document.createElement('div');
      pageWrapper.style.display = 'flex';
      pageWrapper.style.flexDirection = bulletinsPerPage === 1 ? 'column' : 'row';
      pageWrapper.style.width = bulletinsPerPage === 1 ? '210mm' : '297mm';
      pageWrapper.style.height = bulletinsPerPage === 1 ? '297mm' : '210mm';
      tempContainer.appendChild(pageWrapper);

      // Add bulletins to the current page
      for (let j = 0; j < bulletinsPerPage; j++) {
        const studentIndex = i + j;
        if (studentIndex >= students.length) break;

        const student = students[studentIndex];

        // Create a container for this bulletin
        const bulletinContainer = document.createElement('div');
        bulletinContainer.style.flex = '1';
        bulletinContainer.style.padding = '5mm';
        pageWrapper.appendChild(bulletinContainer);

        // Render the appropriate bulletin component
        const BulletinComponent = bulletinType === 'type1' ? BulletinPhysique1 : BulletinPhysique2;

        // Calculate student rank
        const studentRank = calculateStudentRank(student, students, calculateGeneralAverage);

        // Calculate top average
        const topAverage = calculateTopAverage(students, calculateGeneralAverage);

        // Separate subjects
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

        // Calculate coefficients
        const totalCoefficients = subjects.reduce((total, subject) => total + subject.coefficient, 0);
        const mainCoefficients = mainSubjects.reduce((total, subject) => total + subject.coefficient, 0);

        // Calculate total points
        const calculateTotalPoints = () => {
          let total = 0;
          subjects.forEach(subject => {
            const avg = calculateSubjectAverageForStudent(student.id, subject.name);
            if (avg !== "-") {
              total += parseFloat(avg) * subject.coefficient;
            }
          });
          return total.toFixed(2);
        };

        // Calculate main points
        const calculateMainPoints = () => {
          let total = 0;
          mainSubjects.forEach(subject => {
            const avg = calculateSubjectAverageForStudent(student.id, subject.name);
            if (avg !== "-") {
              total += parseFloat(avg) * subject.coefficient;
            }
          });
          return total.toFixed(2);
        };

        // Get current school year
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

        // Get appreciation
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

        // Create a dummy ref
        const dummyRef = { current: null };

        // Render the bulletin component to HTML
        const bulletinHtml = ReactDOMServer.renderToString(
          <BulletinComponent
            student={student}
            students={students}
            className={className}
            composition={composition}
            mainSubjects={mainSubjects}
            secondarySubjects={secondarySubjects}
            printRef={dummyRef}
            tableBgColor={theme === "dark" ? "bg-gray-800" : "bg-white"}
            textClass={textClass}
            tableRowBg={theme === "dark" ? "bg-gray-800" : "bg-white"}
            tableRowAltBg={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
            mainCoefficients={mainCoefficients}
            totalCoefficients={totalCoefficients}
            topAverage={topAverage.average}
            topAverageSexe={topAverage.sexe}
            studentRank={studentRank}
            calculateSubjectAverageForStudent={(id, subject) => calculateSubjectAverageForStudent(id, subject)}
            calculateTotalPoints={calculateTotalPoints}
            calculateGeneralAverage={(id) => calculateGeneralAverage(id)}
            getAppreciation={getAppreciation}
            calculateMainPoints={calculateMainPoints}
            getCurrentSchoolYear={getCurrentSchoolYear}
            school_name={school_name}
            school_short_name={school_short_name}
            school_zone_name={school_zone_name}
            setStudentClasseLevel={() => { }}
          />
        );

        bulletinContainer.innerHTML = bulletinHtml;
      }

      // Capture the page as an image
      const canvas = await html2canvas(pageWrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff"
      });

      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');

      // Add a new page if this isn't the first page
      if (i > 0) {
        pdf.addPage();
      }

      // Add the image to the PDF, fitting it to the page
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    }

    // Save the PDF
    pdf.save(`bulletins_${composition.label.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
};

// Helper function to calculate student rank
const calculateStudentRank = (student, students, calculateGeneralAverage) => {
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

  const position = sortedStudents.findIndex(s => s.id === student.id) + 1;

  if (position <= 0) return "-";

  // Format rank with gender consideration
  const formattedPosition = position === 1
    ? student.sexe === "F" ? "1ère" : "1er"
    : `${position}ème`;

  // Check for ex-aequo
  const sameAverages = sortedStudents.filter(s =>
    parseFloat(calculateGeneralAverage(s.id)) === parseFloat(calculateGeneralAverage(student.id))
  );

  return sameAverages.length > 1 ? `${formattedPosition} EX` : formattedPosition;
};

// Helper function to calculate top average
const calculateTopAverage = (students, calculateGeneralAverage) => {
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