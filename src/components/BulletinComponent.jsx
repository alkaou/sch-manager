import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import BulletinPhysique1 from "./BulletinPhysique_1.jsx"

const BulletinComponent = ({
    student,
    subjects,
    composition,
    className,
    calculateSubjectAverageForStudent,
    calculateGeneralAverage,
    theme,
    textClass,
    language,
    students, // Ajout du paramètre students pour calculer le rang
    handleCloseBulletinPreview,
    school_name,
    school_short_name,
    school_zone_name,
}) => {
    // Styles conditionnels basés sur le thème
    const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    // const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    // const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
    const tableRowBg = theme === "dark" ? "bg-gray-800" : "bg-white";
    const tableRowAltBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

    // États pour stocker le rang et la moyenne du premier
    const [studentRank, setStudentRank] = useState("-");
    const [topAverage, setTopAverage] = useState("-");
    const [topAverageSexe, setTopAverageSexe] = useState(null);
    // const [totalStudents, setTotalStudents] = useState(0);

    // Calculer le rang et la moyenne du premier
    // Calculer le rang et la moyenne du premier
    useEffect(() => {
        if (!students || !student) return;

        // Calculer les moyennes de tous les élèves
        const averages = students.map(s => ({
            id: s.id,
            sexe: s.sexe,
            average: parseFloat(calculateGeneralAverage(s.id))
        })).filter(s => !isNaN(s.average)); // Filtrer les élèves sans moyenne

        // Trier les moyennes par ordre décroissant
        averages.sort((a, b) => b.average - a.average);

        // Trouver la meilleure moyenne
        if (averages.length > 0) {
            setTopAverage(averages[0].average.toFixed(2));
            setTopAverageSexe(averages[0].sexe);
        }

        // Calculer le nombre total d'élèves avec une moyenne
        // setTotalStudents(averages.length);

        // Trouver le rang de l'élève actuel
        const studentAverage = parseFloat(calculateGeneralAverage(student.id));
        if (isNaN(studentAverage)) {
            setStudentRank("-");
            return;
        }

        // Trouver les élèves avec la même moyenne
        const sameAverages = averages.filter(s => s.average === studentAverage);

        // Trouver la position de la moyenne dans le tableau trié
        const position = averages.findIndex(s => s.average === studentAverage) + 1;

        // Si plusieurs élèves ont la même moyenne, ajouter "EX aequo"
        const _student_position = position === 1 ? student.sexe === "F" ? "1ère" : "1er" : `${position}ème`;
        if (sameAverages.length > 1) {
            setStudentRank(`${_student_position} EX`);
        } else {
            setStudentRank(_student_position);
        }
    }, [students, student, calculateGeneralAverage]);

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

    // Calculer le total des coefficients
    const totalCoefficients = subjects.reduce((total, subject) => total + subject.coefficient, 0);

    const printRef = useRef();

    // Calculer le total des points (moyenne * coefficient)
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

    // Séparer les matières principales et secondaires (comme dans l'image)
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

    // Calculer le total des coefficients pour les matières principales
    const mainCoefficients = mainSubjects.reduce((total, subject) => total + subject.coefficient, 0);

    // Calculer le total des points pour les matières principales
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


    const handleGeneratePdf = async () => {
        const element = printRef.current;

        // Capture l'élément en image avec html2canvas
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Crée un PDF avec jsPDF au format A4 en portrait
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Récupère les dimensions de la page A4
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // console.log(`Longuer de la feuille ${pageWidth}`);
        // console.log(`Hauteur de la feuille ${pageHeight}`);

        // Calcul du ratio pour redimensionner l'image et la faire tenir sur la page
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // console.log(`Longuer de l'image ${imgWidth}`);
        // console.log(`Hauteur de l'image ${imgHeight}`);

        // Si l'image est trop haute, on peut réduire la taille en ajustant le ratio (attention à la lisibilité)
        // Ici, on force le contenu sur une seule page en plaçant l'image à 0,0
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);

        // Sauvegarde le PDF
        pdf.save('bulletin.pdf');
    };


    return (
        <div>
            {/* Zone de Bulletin Physique */}
            <BulletinPhysique1
                student={student}
                students={students}
                className={className}
                composition={composition}
                mainSubjects={mainSubjects}
                secondarySubjects={secondarySubjects}
                printRef={printRef}
                tableBgColor={tableBgColor}
                textClass={textClass}
                tableRowBg={tableRowBg}
                tableRowAltBg={tableRowAltBg}
                mainCoefficients={mainCoefficients}
                totalCoefficients={totalCoefficients}
                topAverage={topAverage}
                topAverageSexe={topAverageSexe}
                studentRank={studentRank}
                calculateSubjectAverageForStudent={calculateSubjectAverageForStudent}
                calculateTotalPoints={calculateTotalPoints}
                calculateGeneralAverage={calculateGeneralAverage}
                getAppreciation={getAppreciation}
                calculateMainPoints={calculateMainPoints}
                getCurrentSchoolYear={getCurrentSchoolYear}
                school_name={school_name}
                school_short_name={school_short_name}
                school_zone_name={school_zone_name}
            />

            {/* Bouton pour générer le PDF */}
            <button onClick={handleGeneratePdf} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Générer PDF
            </button>

            {/* Bouton pour générer le PDF */}
            <button onClick={handleCloseBulletinPreview} className="mt-4 ml-10 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Fermer
            </button>
        </div>
    );
};

export default BulletinComponent;