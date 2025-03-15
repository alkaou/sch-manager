import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

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
    const [totalStudents, setTotalStudents] = useState(0);

    // Calculer le rang et la moyenne du premier
    useEffect(() => {
        if (!students || !student) return;

        // Calculer les moyennes de tous les élèves
        const averages = students.map(s => ({
            id: s.id,
            average: parseFloat(calculateGeneralAverage(s.id))
        })).filter(s => !isNaN(s.average)); // Filtrer les élèves sans moyenne

        // Trier les moyennes par ordre décroissant
        averages.sort((a, b) => b.average - a.average);

        console.log(averages);

        // Trouver la meilleure moyenne
        if (averages.length > 0) {
            setTopAverage(averages[0].average.toFixed(2));
        }

        // Calculer le nombre total d'élèves avec une moyenne
        setTotalStudents(averages.length);

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

        // Si plusieurs élèves ont la même moyenne, ajouter "EX"
        const _student_position = position === 1 ? student.sexe === "F" ? "1ère" : "1er" : `${position}ème`;
        if (sameAverages.length > 1) {
            setStudentRank(`${_student_position} EX`);
        } else {
            setStudentRank(_student_position);
        }
        // console.log(student);
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
        return "Insuffisant";
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
            {/* Zone à capturer */}
            <div
                ref={printRef}
                className={`${tableBgColor} ${textClass} p-4 rounded-lg shadow-lg print:shadow-none print:p-0`}
            >
                {/* En-tête du bulletin */}
                <div className="border-2 border-black">
                    <div className="flex justify-between text-center p-2">
                        <div className="uppercase font-bold">Ministère de l'éducation nationale</div>
                        <div>
                            <div className="uppercase font-bold">République du Mali</div>
                            <div className="text-sm">Un peuple-un but-une foi</div>
                        </div>
                    </div>

                    <div className="-mt-2">
                        <div className="ml-20">************</div>
                        <div className="ml-2 uppercase font-bold">Direction nationale de l'enseignement fondamental</div>
                        <div className="ml-20">************</div>
                        <div className="ml-2 uppercase font-bold">Centre d'animation pédagogique</div>
                        <div className="ml-20">************</div>
                        <div className="pl-2 pr-2 flex justify-between">
                            <div className="uppercase font-bold">Groupe scolaire</div>
                            <div className="uppercase font-bold mr-">=== GSAD ===</div>
                        </div>
                    </div>

                    <div className="flex justify-between p-2 border-t-2 border-black">
                        <div className="font-bold">BULLETIN DE NOTES</div>
                        <div className="font-bold">{composition.label}</div>
                    </div>

                    <div className="flex justify-between p-2 border-t-2 border-black">
                        <div>
                            <span className="font-bold">De: </span>
                            {student.first_name} {student.sure_name} {student.last_name}
                        </div>
                        <div>
                            <span className="font-bold uppercase">Matricule: </span>
                            {student.matricule && student.matricule !== "" ? student.matricule : "invalid"}
                        </div>
                    </div>

                    <div className="flex justify-between p-2 border-t-2 border-black">
                        <div>
                            <span className="font-bold">CLASSE: </span>
                            {className}
                        </div>
                        <div>
                            <span className="font-bold">ANNÉE SCOLAIRE: </span>
                            {getCurrentSchoolYear()}
                        </div>
                    </div>


                    {/* Tableau des notes - Matières principales */}
                    <table className="w-full border-t-2 border-black">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="border-r border-black p-2 text-left">MATIÈRES</th>
                                <th className="border-r border-black p-2 text-center">MOY. CL</th>
                                <th className="border-r border-black p-2 text-center">N. COMP</th>
                                <th className="border-r border-black p-2 text-center">MOY.G</th>
                                <th className="border-r border-black p-2 text-center">COEF</th>
                                <th className="border-r border-black p-2 text-center">MOY. COEF</th>
                                <th className="p-2 text-center">OBSERVATIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainSubjects.map((subject, index) => {
                                const classeNote = student.notes[subject.name]?.classe !== null
                                    ? student.notes[subject.name]?.classe
                                    : "-";
                                const compoNote = student.notes[subject.name]?.composition !== null
                                    ? student.notes[subject.name]?.composition
                                    : "-";
                                const moyenne = calculateSubjectAverageForStudent(student.id, subject.name);
                                const moyenneCoef = moyenne !== "-"
                                    ? (parseFloat(moyenne) * subject.coefficient).toFixed(2)
                                    : "-";
                                const appreciation = getAppreciation(moyenne);

                                return (
                                    <tr key={subject.name} className={`border-b border-black ${index % 2 === 0 ? tableRowBg : tableRowAltBg}`}>
                                        <td className="border-r border-black p-2 text-left">{subject.name}</td>
                                        <td className="border-r border-black p-2 text-center">{classeNote !== "-" ? parseFloat(classeNote).toFixed(2) : "-"}</td>
                                        <td className="border-r border-black p-2 text-center">{compoNote !== "-" ? parseFloat(compoNote).toFixed(2) : "-"}</td>
                                        <td className="border-r border-black p-2 text-center">{moyenne}</td>
                                        <td className="border-r border-black p-2 text-center">{subject.coefficient}</td>
                                        <td className="border-r border-black p-2 text-center">{moyenneCoef}</td>
                                        <td className="p-2 text-center">{appreciation}</td>
                                    </tr>
                                );
                            })}

                            {/* Total partiel */}
                            <tr className="border-b-2 border-t-2 border-black bg-gray-200 font-bold">
                                <td colSpan="4" className="border-r border-black p-2 text-center">TOTAL PARTIEL</td>
                                <td className="border-r border-black p-2 text-center">{mainCoefficients}</td>
                                <td className="border-r border-black p-2 text-center">{calculateMainPoints()}</td>
                                <td className="p-2"></td>
                            </tr>

                            {/* Moyenne dans les matières */}
                            <tr className="border-b-2 border-black bg-gray-300 font-bold">
                                <td colSpan="6" className="border-r border-black p-2 text-center">MOYENNE DANS LES MATIÈRES AU DEF</td>
                                <td className="p-2"></td>
                            </tr>

                            <tr className="border-b-2 border-black bg-gray-300 font-bold">
                                <td colSpan="3" className="border-r border-black p-2 text-right">MOYENNE</td>
                                <td colSpan="3" className="border-r border-black p-2 text-center">
                                    {calculateGeneralAverage(student.id)}
                                </td>
                                <td className="p-2"></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tableau des notes - Matières secondaires */}
                    <table className="w-full">
                        <tbody>
                            {secondarySubjects.map((subject, index) => {
                                const classeNote = student.notes[subject.name]?.classe !== null
                                    ? student.notes[subject.name]?.classe
                                    : "-";
                                const compoNote = student.notes[subject.name]?.composition !== null
                                    ? student.notes[subject.name]?.composition
                                    : "-";
                                const moyenne = calculateSubjectAverageForStudent(student.id, subject.name);
                                const moyenneCoef = moyenne !== "-"
                                    ? (parseFloat(moyenne) * subject.coefficient).toFixed(2)
                                    : "-";
                                const appreciation = getAppreciation(moyenne);

                                return (
                                    <tr key={subject.name} className={`border-b border-black ${index % 2 === 0 ? tableRowBg : tableRowAltBg}`}>
                                        <td className="border-r border-black p-2 text-left">{subject.name}</td>
                                        <td className="border-r border-black p-2 text-center">{classeNote !== "-" ? parseFloat(classeNote).toFixed(2) : "-"}</td>
                                        <td className="border-r border-black p-2 text-center">{compoNote !== "-" ? parseFloat(compoNote).toFixed(2) : "-"}</td>
                                        <td className="border-r border-black p-2 text-center">{moyenne}</td>
                                        <td className="border-r border-black p-2 text-center">{subject.coefficient}</td>
                                        <td className="border-r border-black p-2 text-center">{moyenneCoef}</td>
                                        <td className="p-2 text-center">{appreciation}</td>
                                    </tr>
                                );
                            })}

                            {/* Total général */}
                            <tr className="border-b-2 border-t-2 border-black bg-gray-200 font-bold">
                                <td colSpan="4" className="border-r border-black p-2 text-center">TOTAL GÉNÉRAL</td>
                                <td className="border-r border-black p-2 text-center">{totalCoefficients}</td>
                                <td className="border-r border-black p-2 text-center">{calculateTotalPoints()}</td>
                                <td className="p-2"></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Pied de page du bulletin */}
                    <div className="grid grid-cols-3 border-t-2 border-black">
                        <div className="p-2 border-r-2 border-black">
                            <div className="font-bold mb-2">MOY. GÉNÉRALE :</div>
                            <div className="text-xl font-bold">{calculateGeneralAverage(student.id)}</div>
                        </div>
                        <div className="p-2 border-r-2 border-black">
                            <div className="font-bold mb-2">RANG :</div>
                            <div className="text-xl font-bold">
                                {studentRank}
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="font-bold mb-2">EFFECTIFS :</div>
                            <div className="text-xl font-bold">{students.length} élèves</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 border-t-2 border-black">
                        <div className="p-2 border-r-2 border-black">
                            <div className="font-bold mb-2">
                                {student.sexe === "F" ? "MOY. DE LA PREMIERE :" : "MOY. DU PREMIER :"}
                            </div>
                            <div className="text-xl font-bold">{topAverage}</div>
                        </div>
                        <div className="p-2 border-r-2 border-black">
                            <div className="font-bold mb-2">CONTACT :</div>
                            <div className="text-xl font-bold">
                                {student.parents_contact}
                            </div>
                        </div>
                        <div className="p-2"></div>
                    </div>

                    <div className="grid grid-cols-2 border-t-2 border-black">
                        <div className="p-2 border-r-2 border-black">
                            <div className="font-bold mb-2">APPRÉCIATION DU DIRECTEUR</div>
                            <div className="h-20 flex items-center justify-center">
                                {parseFloat(calculateGeneralAverage(student.id)) >= 16 ? "Excellent Travail" :
                                    parseFloat(calculateGeneralAverage(student.id)) >= 14 ? "Très Bon Travail" :
                                        parseFloat(calculateGeneralAverage(student.id)) >= 12 ? "Bon Travail" :
                                            parseFloat(calculateGeneralAverage(student.id)) >= 10 ? "Travail Passable" :
                                                "Travail Insuffisant"}
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="font-bold mb-2">VISA DES PARENTS</div>
                            <div className="h-20"></div>
                        </div>
                    </div>
                </div>
            </div>

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