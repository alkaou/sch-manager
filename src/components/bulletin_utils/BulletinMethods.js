/**
 * Utility functions for bulletin operations
 */

// Sort students by average (highest to lowest)
export const sortStudentsByAverage = (students) => {
  return [...students].sort((a, b) => {
    const avgA = parseFloat(a.average) || 0;
    const avgB = parseFloat(b.average) || 0;
    return avgB - avgA;
  });
};

// Sort students by name (alphabetically)
export const sortStudentsByName = (students) => {
  return [...students].sort((a, b) => {
    let nameA, nameB;

    // Handle different student object structures
    if (a.firstName && a.lastName) {
      nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
    } else if (a.name) {
      nameA = a.name.toLowerCase();
    } else {
      nameA = '';
    }

    if (b.firstName && b.lastName) {
      nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
    } else if (b.name) {
      nameB = b.name.toLowerCase();
    } else {
      nameB = '';
    }

    return nameA.localeCompare(nameB);
  });
};

// Filter students by search term
export const filterStudentsBySearch = (students, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return students;
  }

  const term = searchTerm.toLowerCase().trim();

  return students.filter(student => {
    // Check if student has firstName and lastName properties
    if (student.firstName && student.lastName) {
      const fullName = `${student.lastName} ${student.firstName}`.toLowerCase();
      return fullName.includes(term);
    }
    // If not, check if student has name property
    else if (student.name) {
      return student.name.toLowerCase().includes(term);
    }
    // If neither, try to match against any string property
    else {
      // Try to find any property that might contain the student's name
      for (const key in student) {
        if (typeof student[key] === 'string' &&
          !['id', 'sexe', 'average', 'rank'].includes(key) &&
          student[key].toLowerCase().includes(term)) {
          return true;
        }
      }
      return false;
    }
  });
};

// Calculate subject average for a student
export const calculateSubjectAverage = (student, subjectName, notes) => {
  if (!student || !notes || !notes[subjectName]) return "-";

  const classeNote = notes[subjectName].classe;
  const compoNote = notes[subjectName].composition;

  if (classeNote === null && compoNote === null) return "-";
  if (classeNote === null) return compoNote.toFixed(2);
  if (compoNote === null) return classeNote.toFixed(2);

  const average = (parseFloat(classeNote) + parseFloat(compoNote)) / 2;
  return average.toFixed(2);
};

// Get appreciation based on grade
export const getAppreciation = (note) => {
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

// Get current school year
export const getCurrentSchoolYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (month >= 8) { // September to December
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

// Separate subjects into main and secondary
export const separateSubjects = (subjects) => {
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

  return { mainSubjects, secondarySubjects };
};

// Calculate total coefficients
export const calculateCoefficients = (subjects) => {
  const { mainSubjects } = separateSubjects(subjects);

  const totalCoefficients = subjects.reduce((total, subject) => total + subject.coefficient, 0);
  const mainCoefficients = mainSubjects.reduce((total, subject) => total + subject.coefficient, 0);

  return { totalCoefficients, mainCoefficients };
};