import React from 'react';

const BulletinComponent = ({
    student,
    subjects,
    composition,
    className,
    calculateSubjectAverageForStudent,
    calculateGeneralAverage,
    theme,
    textClass,
    language
}) => {
    // Styles conditionnels basés sur le thème
    const tableBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
    const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const tableHeaderBg = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
    const tableRowBg = theme === "dark" ? "bg-gray-800" : "bg-white";
    const tableRowAltBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
    
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
    
    return (
        <div className={`${tableBgColor} ${textClass} p-4 rounded-lg shadow-lg`}>
            {/* En-tête du bulletin */}
            <div className="border-2 border-black">
                <div className="text-center p-2">
                    <div className="uppercase font-bold">Ministère de l'éducation nationale</div>
                    <div className="uppercase font-bold">République du Mali</div>
                    <div className="text-sm">Un peuple-un but-une foi</div>
                </div>
                
                <div className="text-center p-2 border-t-2 border-black">
                    <div className="uppercase font-bold">Direction nationale de l'enseignement fondamental</div>
                    <div className="uppercase font-bold">Centre d'animation pédagogique</div>
                    <div className="uppercase font-bold">Groupe scolaire</div>
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
                        <span className="font-bold">ANNÉE SCOLAIRE: </span>
                        {getCurrentSchoolYear()}
                    </div>
                </div>
                
                <div className="p-2 border-t-2 border-black">
                    <span className="font-bold">CLASSE: </span>
                    {className}
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
                        <div className="font-bold mb-2">MOY. GÉNÉRALE:</div>
                        <div className="text-xl font-bold">{calculateGeneralAverage(student.id)}</div>
                    </div>
                    <div className="p-2 border-r-2 border-black">
                        <div className="font-bold mb-2">RANG:</div>
                        <div className="text-xl font-bold">-</div>
                    </div>
                    <div className="p-2">
                        <div className="font-bold mb-2">/</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 border-t-2 border-black">
                    <div className="p-2 border-r-2 border-black">
                        <div className="font-bold mb-2">MOY. DU PREMIER:</div>
                        <div className="text-xl font-bold">{calculateGeneralAverage(student.id)}</div>
                    </div>
                    <div className="p-2 border-r-2 border-black"></div>
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
            
            {/* Boutons d'action */}
            <div className="mt-4 flex justify-end gap-2">
                <button 
                    onClick={() => window.print()} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Imprimer
                </button>
            </div>
        </div>
    );
};

export default BulletinComponent;