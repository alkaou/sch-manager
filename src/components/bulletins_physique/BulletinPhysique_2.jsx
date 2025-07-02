import React, { useEffect, useState } from "react";
import { getClasseName } from "../../utils/helpers";
import CountryInfosHeader from "../CountryInfosHeader.jsx";
import { checkMoyenneGeneralToReturnStudentMention } from "../bulletin_utils/bullettin_methods";

const BulletinPhysique2 = ({
  student,
  students,
  className,
  composition,
  subjects,
  mainSubjects,
  secondarySubjects,
  printRef,
  topAverage,
  topAverageSexe,
  studentRank,
  calculateSubjectAverageForStudent,
  calculateGeneralAverage,
  getAppreciation,
  calculateTotalPoints,
  totalCoefficients,
  getCurrentSchoolYear,
  school_name,
  school_short_name,
  school_zone_name,
  setStudentClasseLevel,
  language,
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
      (number === "1" ||
        number === "2" ||
        number === "3" ||
        number === "4" ||
        number === "5") &&
      composition.helper === "comp"
    ) {
      // console.log(number);
      setCenterType("CAP");
      // console.log(composition.helper);
    } else if (
      number === "10" ||
      number === "11" ||
      number === "12" ||
      composition.helper === "Trim" ||
      composition.helper === "Bac"
    ) {
      // console.log(number);
      setCenterType("ACADEMIE");
      // console.log(composition.helper);
    }
  }, []);

  return (
    <div
      ref={printRef}
      className={`bg-white text-black p-4 rounded-lg shadow-lg print:shadow-none print:p-0`}
    >
      {/* En-tête du bulletin */}
      <div className="border-2 border-black">
        <CountryInfosHeader
          Head_language={language}
          centerType={centerType}
          school_name={school_name}
          school_short_name={school_short_name}
          school_zone_name={school_zone_name}
        />

        <div className="flex justify-between p-2 border-t-2 border-black">
          <div className="font-bold">
            {language === "Français"
              ? "BULLETIN DE NOTES"
              : language === "Anglais"
              ? "REPORT CARD"
              : "KALANSƐBƐN"}
          </div>
          <div className="font-bold">{composition.label}</div>
        </div>

        <div className="flex justify-between p-2 border-t-2 border-black">
          <div>
            <span className="font-bold">
              {language === "Français"
                ? "De: "
                : language === "Anglais"
                ? "Name: "
                : "Tɔgɔ: "}
            </span>
            {student.first_name} {student.sure_name} {student.last_name}
          </div>
          <div>
            <span className="font-bold uppercase">
              {language === "Français"
                ? "Matricule: "
                : language === "Anglais"
                ? "ID Number: "
                : "Kalanden Nimɔrɔ: "}
            </span>
            {student.matricule && student.matricule !== ""
              ? student.matricule
              : language === "Français"
              ? "Invalide"
              : language === "Anglais"
              ? "Invalid"
              : "Fosin-ten"}
          </div>
        </div>

        <div className="flex justify-between p-2 border-t-2 border-black">
          <div>
            <span className="font-bold">
              {language === "Français"
                ? "CLASSE: "
                : language === "Anglais"
                ? "CLASS: "
                : "KALANSO: "}
            </span>
            {getClasseName(className)}
          </div>
          <div>
            <span className="font-bold">
              {language === "Français"
                ? "ANNÉE SCOLAIRE: "
                : language === "Anglais"
                ? "SCHOOL YEAR: "
                : "KALAN SAN: "}
            </span>
            {getCurrentSchoolYear()}
          </div>
        </div>

        {/* Tableau des notes - Matières principales */}
        <table className="w-full border-t-2 border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black p-2 text-left">
                {language === "Français"
                  ? "MATIÈRES"
                  : language === "Anglais"
                  ? "SUBJECTS"
                  : "KUNNAFONIW"}
              </th>
              <th className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "MOY. CL"
                  : language === "Anglais"
                  ? "CLASS AVG"
                  : "K. HAKƐ"}
              </th>
              <th className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "N. COMP"
                  : language === "Anglais"
                  ? "EXAM MARK"
                  : "C. HAKƐ"}
              </th>
              <th className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "MOY.G"
                  : language === "Anglais"
                  ? "GEN.AVG"
                  : "HAKƐ BƐƐ"}
              </th>
              <th className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "COEF"
                  : language === "Anglais"
                  ? "COEF"
                  : "BONYA"}
              </th>
              <th className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "MOY. COEF"
                  : language === "Anglais"
                  ? "WEIGHTED AVG"
                  : "HAKƐ & BONYA"}
              </th>
              <th className="p-2 text-center">
                {language === "Français"
                  ? "OBSERVATIONS"
                  : language === "Anglais"
                  ? "REMARKS"
                  : "KƆLƆSILI"}
              </th>
            </tr>
          </thead>
          <tbody>
            {allSubjects.map((subject, index) => {
              const classeNote =
                student.notes[subject.name]?.classe !== null
                  ? student.notes[subject.name]?.classe
                  : "-";
              const compoNote =
                student.notes[subject.name]?.composition !== null
                  ? student.notes[subject.name]?.composition
                  : "-";
              const moyenne = calculateSubjectAverageForStudent(
                students,
                student.id,
                subject.name
              );
              const moyenneCoef =
                moyenne !== "-"
                  ? (parseFloat(moyenne) * subject.coefficient).toFixed(2)
                  : "-";
              const appreciation = getAppreciation(moyenne, language);

              return (
                <tr
                  key={subject.name}
                  className={`border-b border-black ${
                    index % 2 === 0 ? "bg-ray-100" : "bg-gray-200"
                  }`}
                >
                  <td className="border-r border-black p-2 text-left">
                    {subject.name}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {classeNote !== "-" && classeNote !== undefined
                      ? parseFloat(classeNote).toFixed(2)
                      : "-"}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {compoNote !== "-" && compoNote !== undefined
                      ? parseFloat(compoNote).toFixed(2)
                      : "-"}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {moyenne}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {subject.coefficient}
                  </td>
                  <td className="border-r border-black p-2 text-center">
                    {moyenneCoef}
                  </td>
                  <td className="p-2 text-center">{appreciation}</td>
                </tr>
              );
            })}

            {/* Total général */}
            <tr className="border-b-2 border-t-2 border-black bg-gray-200 font-bold">
              <td colSpan="4" className="border-r border-black p-2 text-center">
                {language === "Français"
                  ? "TOTAL GÉNÉRAL"
                  : language === "Anglais"
                  ? "GRAND TOTAL"
                  : "HAKƐ BƐƐ LAJƐLEN"}
              </td>
              <td className="border-r border-black p-2 text-center">
                {totalCoefficients}
              </td>
              <td className="border-r border-black p-2 text-center">
                {calculateTotalPoints(students, student, subjects)}
              </td>
              <td className="p-2"></td>
            </tr>
          </tbody>
        </table>

        {/* Pied de page du bulletin */}
        <div className="grid grid-cols-3 border-t-2 border-black">
          <div className="p-2 border-r-2 border-black">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "MOY. GÉNÉRALE :"
                : language === "Anglais"
                ? "GENERAL AVERAGE:"
                : "HAKƐ BƐƐ LAJƐLEN:"}
            </div>
            <div className="text-xl font-bold">
              {calculateGeneralAverage(students, student.id, subjects)}
            </div>
          </div>
          <div className="p-2 border-r-2 border-black">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "RANG :"
                : language === "Anglais"
                ? "RANK:"
                : "JƆYƆRƆ:"}
            </div>
            <div className="text-xl font-bold">{studentRank}</div>
          </div>
          <div className="p-2">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "EFFECTIFS :"
                : language === "Anglais"
                ? "CLASS SIZE:"
                : "KALANDENW HAKƐ:"}
            </div>
            <div className="text-xl font-bold">
              {students.length}
              {language === "Français"
                ? " élèves"
                : language === "Anglais"
                ? " students"
                : " kalandenw"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t-2 border-black">
          <div className="p-2 border-r-2 border-black">
            <div className="font-bold mb-2">
              {topAverageSexe === "F"
                ? language === "Français"
                  ? "MOY. DE LA PREMIERE :"
                  : language === "Anglais"
                  ? "TOP STUDENT AVERAGE:"
                  : "KALANDENFƆLƆ KA HAKƐ:"
                : language === "Français"
                ? "MOY. DU PREMIER :"
                : language === "Anglais"
                ? "TOP STUDENT AVERAGE:"
                : "KALANDENFƆLƆ KA HAKƐ:"}
            </div>
            <div className="text-xl font-bold">{topAverage}</div>
          </div>
          <div className="p-2 border-r-2 border-black">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "CONTACT :"
                : language === "Anglais"
                ? "CONTACT:"
                : "NƐKƐJURUSIRA:"}
            </div>
            <div className="text-xl font-bold">{student.parents_contact}</div>
          </div>
          <div className="p-2">
            <div className="font-bold mb-2">Mention :</div>
            <div className="text-xl font-bold">
              {getAppreciation(
                parseFloat(
                  calculateGeneralAverage(students, student.id, subjects)
                ),
                language
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t-2 border-black">
          <div className="p-2 border-r-2 border-black">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "APPRÉCIATION DU DIRECTEUR"
                : language === "Anglais"
                ? "PRINCIPAL'S REMARKS"
                : "KALANSO KUNTIGI KA KƆLƆSILI"}
            </div>
            <div className="h-20 flex items-center justify-center">
              {checkMoyenneGeneralToReturnStudentMention(
                calculateGeneralAverage(students, student.id, subjects),
                language
              )}
            </div>
          </div>
          <div className="p-2">
            <div className="font-bold mb-2">
              {language === "Français"
                ? "VISA DES PARENTS"
                : language === "Anglais"
                ? "PARENT'S SIGNATURE"
                : "SOMƆGƆW KA SEERE"}
            </div>
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinPhysique2;
