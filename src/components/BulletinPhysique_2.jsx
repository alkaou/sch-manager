import React, { useEffect, useState } from "react";


const BulletinPhysique2 = ({
    student,
    students,
    className,
    composition,
    subjects,
    mainSubjects,
    secondarySubjects,
    printRef,
    tableBgColor,
    textClass,
    tableRowBg,
    tableRowAltBg,
    topAverage,
    topAverageSexe,
    studentRank,
    calculateSubjectAverageForStudent,
    calculateGeneralAverage,
    getAppreciation,
    getCurrentSchoolYear,
    school_name,
    school_short_name,
    school_zone_name,
    setStudentClasseLevel,
}) => {

    const [centerType, setCenterType] = useState(null);
    const [allSubjects, setAllSubjects] = useState([]);

    useEffect(() => {
        const regex = /^(\d+)\s*(.*)$/;
        const result = className.match(regex);
        const number = result[1];
        setStudentClasseLevel(number);
        setAllSubjects([...mainSubjects, ...secondarySubjects]);
        if (number === "6" || number === "7" || number === "8" || number === "9") {
            // console.log(number);
            setCenterType("CAP");
            // console.log(composition.helper);
        } else if (
            (number === "1" || number === "2" || number === "3" || number === "4" || number === "5") &&
            composition.helper === "comp"
        ) {
            // console.log(number);
            setCenterType("CAP");
            // console.log(composition.helper);
        } else if (number === "10" || number === "11" || number === "12" || composition.helper === "Trim" || composition.helper === "Bac") {
            // console.log(number);
            setCenterType("ACADEMIE");
            // console.log(composition.helper);
        }
    }, []);

    return (
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

                    {centerType ?
                        (
                            <>
                                <div className="ml-2 uppercase font-bold">
                                    {centerType === "CAP" ?
                                        "Direction nationale de l'enseignement fondamental" :
                                        "CENTRE NATIONAL DES EXAMENS ET CONCOURS DE L'EDUCATION"
                                    }
                                </div>
                                <div className="ml-20">************</div>
                                <div className="ml-2 uppercase font-bold">
                                    {centerType === "CAP" ?
                                        "Centre d'animation pédagogique de" :
                                        "ACADEMIE D'ENSEIGNEMENT DE"
                                    } {school_zone_name}
                                </div>
                                <div className="ml-20">************</div>
                            </>
                        )
                        : null
                    }

                    <div className="pl-2 pr-2 flex justify-between">
                        <div className="uppercase font-bold">{school_name}</div>
                        <div className="uppercase font-bold">=== {school_short_name} ===</div>
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
                        {allSubjects.map((subject, index) => {
                            const classeNote = student.notes[subject.name]?.classe !== null
                                ? student.notes[subject.name]?.classe
                                : "-";
                            const compoNote = student.notes[subject.name]?.composition !== null
                                ? student.notes[subject.name]?.composition
                                : "-";
                            const moyenne = calculateSubjectAverageForStudent(students, student.id, subject.name);
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

                    </tbody>
                </table>

                {/* Pied de page du bulletin */}
                <div className="grid grid-cols-3 border-t-2 border-black">
                    <div className="p-2 border-r-2 border-black">
                        <div className="font-bold mb-2">MOY. GÉNÉRALE :</div>
                        <div className="text-xl font-bold">{calculateGeneralAverage(students, student.id, subjects)}</div>
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
                            {topAverageSexe === "F" ? "MOY. DE LA PREMIERE :" : "MOY. DU PREMIER :"}
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
                            {parseFloat(calculateGeneralAverage(students, student.id, subjects)) >= 16 ? "Excellent Travail" :
                                parseFloat(calculateGeneralAverage(students, student.id, subjects)) >= 14 ? "Très Bon Travail" :
                                    parseFloat(calculateGeneralAverage(students, student.id, subjects)) >= 12 ? "Bon Travail" :
                                        parseFloat(calculateGeneralAverage(students, student.id, subjects)) >= 10 ? "Travail Passable" :
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
    );
}

export default BulletinPhysique2;