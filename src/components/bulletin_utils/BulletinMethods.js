// Formater une note pour l'affichage
export const formatNote = (note) => {
  if (note === null || note === undefined) return "-";

  // Convertir en nombre si c'est une chaîne
  const numericNote = typeof note === 'string' ? parseFloat(note) : note;

  // Vérifier si c'est un nombre valide
  if (isNaN(numericNote)) return "-";

  // Formater avec 2 décimales
  return numericNote.toFixed(2);
};

// Calculer la moyenne d'une matière
export const calculateSubjectAverage = (classeNote, compoNote) => {
  // Si l'une des notes est manquante, retourner l'autre note
  if (classeNote === null && compoNote !== null) return formatNote(compoNote);
  if (classeNote !== null && compoNote === null) return formatNote(classeNote);
  if (classeNote === null && compoNote === null) return "-";

  // Calculer la moyenne (classe compte pour 1/3, composition pour 2/3)
  const average = (classeNote + (compoNote * 2)) / 3;
  return formatNote(average);
};

// Calculer la moyenne d'un élève pour une matière
export const calculateSubjectAverageForStudent = (students, studentId, subjectName) => {
  const student = students.find(s => s.id === studentId);
  if (!student || !student.notes[subjectName]) return "-";

  const classeNote = student.notes[subjectName].classe;
  const compoNote = student.notes[subjectName].composition;

  return calculateSubjectAverage(classeNote, compoNote);
};

// Calculer la moyenne générale d'un élève
export const calculateGeneralAverage = (students, studentId, subjects = []) => {
  const student = students.find(s => s.id === studentId);
  if (!student) return "-";

  let totalPoints = 0;
  let totalCoefficients = 0;

  // console.log(subjects);

  subjects.forEach(subject => {
    const subjectAvg = calculateSubjectAverageForStudent(students, studentId, subject.name);
    if (subjectAvg !== "-") {
      totalPoints += parseFloat(subjectAvg) * subject.coefficient;
      totalCoefficients += subject.coefficient;
    }
  });

  if (totalCoefficients === 0) return "-";
  const moyenneGeneral = (totalPoints / totalCoefficients).toFixed(2);
  return moyenneGeneral;
};

// Calculer le total des points (moyenne * coefficient)
export const calculateTotalPoints = (students, student, subjects = []) => {
  let total = 0;
  subjects.forEach(subject => {
    const avg = calculateSubjectAverageForStudent(students, student.id, subject.name);
    if (avg !== "-") {
      total += parseFloat(avg) * subject.coefficient;
    }
  });
  return total.toFixed(2);
};

// Calculer le total des points pour les matières principales
export const calculateMainPoints = (mainSubjects = [], students, student) => {
  let total = 0;
  mainSubjects.forEach(subject => {
    const avg = calculateSubjectAverageForStudent(students, student.id, subject.name);
    if (avg !== "-") {
      total += parseFloat(avg) * subject.coefficient;
    }
  });
  return total.toFixed(2);
};

// Fonction pour déterminer l'appréciation basée sur la note
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

// Obtenir l'année scolaire actuelle
export const getCurrentSchoolYear = () => {
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

// Trier les élèves par nom
export const sortStudentsByName = (a, b) => {
  const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
  const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
  return nameA.localeCompare(nameB);
};

// Trier les élèves par moyenne
export const sortStudentsByAverage = (a, b, students, subjects) => {
  const avgA = parseFloat(calculateGeneralAverage(students, a.id, subjects));
  const avgB = parseFloat(calculateGeneralAverage(students, b.id, subjects));
  
  if (isNaN(avgA) && isNaN(avgB)) return 0;
  if (isNaN(avgA)) return 1;
  if (isNaN(avgB)) return -1;
  
  return avgB - avgA;
};
