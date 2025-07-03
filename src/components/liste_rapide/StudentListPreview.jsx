import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trash, Check, X } from "lucide-react";
import {
  getClasseName,
  getBornInfos,
  getClasseById,
} from "../../utils/helpers";
import { useLanguage, useTheme } from "../contexts";
import CountryInfosHeader from "../CountryInfosHeader.jsx";
import { getHeaderNameByLang } from "./utils";
import { translate } from "./liste_rapide_translator";
import { return_prof_trans, return_speciality_trans } from "../employes/utils";
import { translate as employes_translator } from "../employes/employes_translator";

const StudentListPreview = ({
  list,
  onRemoveStudent,
  onUpdateStudentCustomData,
  isEmployeeList = false,
  db = { db },
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  const { language, Translator } = useLanguage();
  const { text_color } = useTheme();
  const list_lang = list.langue ? list.langue : "Français";
  // console.log(list_lang);

  const translate_postes = (postes = []) => {
    let poste_trans = [];
    postes.forEach((poste) => {
      if (!poste_trans.includes(poste)) {
        const _post = return_prof_trans(poste, list_lang);
        poste_trans.push(_post);
      }
    });
    return poste_trans;
  };
  const translate_speciality = (speciality = null) => {
    const _speciality = return_speciality_trans(
      employes_translator,
      speciality,
      list_lang
    );
    // console.log(_speciality);
    return _speciality;
  };

  const made_text =
    list_lang === "Français"
      ? "Fait, le"
      : list_lang === "Anglais"
      ? "Done,"
      : "Kɛra,";

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editingCell &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCell]);

  // Get all headers (standard + custom)
  const allHeaders = [...list.headers, ...list.customHeaders];

  // Always ensure Prénom and Nom are included
  if (!allHeaders.includes("Prénom")) allHeaders.unshift("Prénom");
  if (!allHeaders.includes("Nom") && allHeaders.includes("Prénom"))
    allHeaders.splice(1, 0, "Nom");

  // If N° is selected, move it to the first position
  if (allHeaders.includes("N°")) {
    const index = allHeaders.indexOf("N°");
    allHeaders.splice(index, 1);
    allHeaders.unshift("N°");
  }

  // Determine which array to use (students or employees)
  const listItems = isEmployeeList ? list.employees || [] : list.students || [];

  // Get data for a specific header
  const getItemData = (item, header, index) => {
    if (header === "N°") {
      return index + 1;
    }

    if (isEmployeeList) {
      // Employee data
      if (header === "Prénom")
        return `${item?.first_name} ${item?.sure_name}`.trim() || "";
      if (header === "Nom") return item.last_name || "";
      if (header === "Matricule") return item.matricule || item.Matricule || "";
      if (header === "Contact") return item.contact || "";
      if (header === "Date de naissance")
        return item.birth_date
          ? new Date(item.birth_date).toLocaleDateString()
          : "";
      if (header === "Date de début")
        return item.service_started_at
          ? new Date(item.service_started_at).toLocaleDateString()
          : "";
      if (header === "Postes")
        return translate_postes(item.postes)?.join(", ") || "";
      if (header === "Sexe")
        return item.sexe === "M"
          ? translate("male", list_lang)
          : translate("female", list_lang);
      if (header === "Statut")
        return item.status === "actif"
          ? translate("active", list_lang)
          : translate("inactive", list_lang);
      if (header === "Signature") return "";
      if (header === "Salaire") {
        if (item.postes?.includes("Professeurs")) {
          return item.proffesseur_config?.is_permanent
            ? `${item.proffesseur_config?.salaire_monthly?.toLocaleString()} XOF/${translate(
                "month",
                list_lang
              )}`
            : `${item.proffesseur_config?.salaire_hourly?.toLocaleString()} XOF/${translate(
                "hour",
                list_lang
              )}`;
        } else {
          return `${item.others_employe_config?.salaire_monthly?.toLocaleString()} XOF/${translate(
            "month",
            list_lang
          )}`;
        }
      }
      if (header === "Spécialité")
        return item.postes?.includes("Professeurs")
          ? translate_speciality(item.proffesseur_config?.speciality)
          : "";
      if (
        (header === "classes" || header === "Classes") &&
        item.classes &&
        Array.isArray(item.classes) &&
        item.classes.length > 0
      ) {
        let prof_classes = [];
        for (let i = 0; i < item.classes.length; i++) {
          const classe = getClasseById(db.classes, item.classes[i], list_lang);
          const _name = `${classe.level} ${classe.name}`.trim();
          const classeName = getClasseName(_name, list_lang);
          prof_classes.push(classeName);
        }
        console.log(prof_classes);
        return prof_classes.join(", ");
      }
    } else {
      // Student data
      if (header === "Prénom")
        return `${item?.first_name} ${item?.sure_name}`.trim() || "";
      if (header === "Nom") return item.last_name || "";
      if (header === "Matricule") return item.matricule || item.Matricule || "";
      if (header === "Père") return item.father_name || "";
      if (header === "Mère") return item.mother_name || "";
      if (header === "Contact") return item.parents_contact || "";
      if (header === "Date & Lieu de naissance") {
        // const _birth_date = new Date(student.birth_date).toLocaleDateString() || '';
        return `${getBornInfos(
          item.birth_date,
          item.birth_place,
          list_lang
        )}`.trim();
      }
      if (header === "Moyenne") return item.Moyenne || "";
      if (header === "Classe")
        return getClasseName(item.classe, list_lang) || "";
      if (header === "Âge") {
        if (!item.birth_date) return "";
        const birthDate = new Date(item.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        const student_age =
          list_lang === "Bambara"
            ? `${Translator[list_lang].years_text} ${age.toString()}`
            : `${age.toString()} ${Translator[list_lang].years_text}`;
        return student_age;
      }
      if (header === "Sexe")
        return list_lang === "Bambara"
          ? item.sexe === "F"
            ? "M"
            : "C"
          : item.sexe || "";
      if (header === "Signature") return "";
    }

    // Custom header
    // console.log(item);
    // console.log(header);
    // console.log(item[header]);
    return item[header] && item[header] !== undefined ? item[header] : "";
  };

  // Handle cell click for custom data
  const handleCellClick = (item, header, index) => {
    // Only allow editing custom headers or empty standard fields
    const isCustomHeader = list.customHeaders.includes(header);
    const value = getItemData(item, header, index);

    if (isCustomHeader || value === "") {
      setEditingCell({ itemId: item.id, header });
      setEditValue(value);
    }
  };

  // Handle save edited cell
  const handleSaveCell = (e) => {
    // Stop event propagation to prevent cell click
    if (e) e.stopPropagation();

    if (editingCell) {
      // Call the appropriate update function based on list type
      onUpdateStudentCustomData(
        editingCell.itemId,
        editingCell.header,
        editValue
      );

      // Close the editor after saving
      setEditingCell(null);
      setEditValue("");
    }
  };

  // Handle cancel editing
  const handleCancelEdit = (e) => {
    // Stop event propagation to prevent cell click
    if (e) e.stopPropagation();

    setEditingCell(null);
    setEditValue("");
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveCell();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Calculate page dimensions based on orientation
  const pageWidth = list.orientation === "portrait" ? "210mm" : "297mm";

  // Number of items to display per page
  const FIRST_PAGE_COUNT = list.orientation === "portrait" ? 15 : 12;
  const OTHER_PAGE_COUNT = 20;

  const totalItems = listItems.length;

  // Calculate number of additional pages after the first page
  const remainingItems = Math.max(0, totalItems - FIRST_PAGE_COUNT);
  const additionalPages = Math.ceil(remainingItems / OTHER_PAGE_COUNT);

  // Total number of pages = 1 (for the first page) + additional pages
  const totalPages = 1 + additionalPages;

  const itemPages = [];

  // First page: FIRST_PAGE_COUNT items (or fewer if the total is less)
  itemPages.push(listItems.slice(0, FIRST_PAGE_COUNT));

  // Subsequent pages: OTHER_PAGE_COUNT items per page
  for (let i = 0; i < additionalPages; i++) {
    const startIndex = FIRST_PAGE_COUNT + i * OTHER_PAGE_COUNT;
    const endIndex = Math.min(startIndex + OTHER_PAGE_COUNT, totalItems);
    itemPages.push(listItems.slice(startIndex, endIndex));
  }

  // Styles based on theme
  const tableBorderColor = "border-gray-300";
  const tableHeaderBgColor = "bg-gray-100";
  const tableRowBgColor = "bg-white";
  const tableRowAltBgColor = "bg-gray-50";
  const buttonDanger = "bg-red-600 hover:bg-red-700 text-white";

  return (
    <div className="flex flex-col items-center text-gray-700">
      {itemPages.map((pageItems, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="mb-8 shadow-lg bg-white student-list-preview-container"
          style={{
            width: pageWidth,
            padding: "10mm",
            position: "relative",
            overflow: "hidden",
            breakInside: "avoid",
            pageBreakAfter: "always",
          }}
          data-page={pageIndex + 1}
          data-total-pages={totalPages}
        >
          {/* Title - Only on first page */}
          {pageIndex === 0 && (
            <>
              {list.countryInfosHeader.show && (
                <div className="mb-10">
                  <CountryInfosHeader
                    Head_language={list_lang}
                    centerType={
                      list.countryInfosHeader.isCAP ? "CAP" : "ACADEMIE"
                    }
                    school_name={db.name}
                    school_short_name={db.short_name}
                    school_zone_name={db.zone}
                    padding=""
                    margLeft=""
                  />
                </div>
              )}

              <div
                style={{
                  ...list.title.style,
                  marginBottom: "10mm",
                }}
              >
                {list.title.text}
              </div>
            </>
          )}

          {/* Table */}
          {pageItems.length > 0 && (
            <table
              className={`w-full border-collapse ${tableBorderColor} border`}
            >
              <thead>
                <tr className={`${tableHeaderBgColor}`}>
                  {allHeaders.map((header) => (
                    <th
                      key={header}
                      className={`border ${tableBorderColor} p-2 text-left`}
                      style={{
                        minWidth: header === "N°" ? "50px" : "auto",
                        maxWidth:
                          header === "Prénom" || header === "Nom"
                            ? "150px"
                            : "auto",
                      }}
                    >
                      {getHeaderNameByLang(header, list_lang)}
                    </th>
                  ))}
                  <th
                    className={`border ${tableBorderColor} p-2 text-center w-12 no-print`}
                  >
                    {list_lang === "Bambara" ? "Yεlεma" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, index) => {
                  // Calculate the actual item index across all pages
                  const globalIndex =
                    pageIndex === 0
                      ? index
                      : FIRST_PAGE_COUNT +
                        OTHER_PAGE_COUNT * (pageIndex - 1) +
                        index;

                  return (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? tableRowBgColor : tableRowAltBgColor
                      }`}
                    >
                      {allHeaders.map((header) => (
                        <td
                          key={`${item.id}-${header}`}
                          className={`
                            border p-2 
                            ${tableBorderColor} 
                            ${
                              header === "Sexe" ||
                              header === "Classe" ||
                              header === "Moyenne" ||
                              header === "Date de naissance" ||
                              header === "Date & Lieu de naissance" ||
                              header === "Âge" ||
                              header === "Contact" ||
                              header === "Matricule" ||
                              header === "Statut" ||
                              header === "Salaire" ||
                              (header === "Prénom" && item.sure_name !== "")
                                ? "text-center"
                                : ""
                            }
                          `}
                          onClick={() => {
                            if (
                              header === "Signature" ||
                              header === "signature"
                            )
                              return;
                            handleCellClick(item, header, globalIndex);
                          }}
                          style={{
                            cursor:
                              list.customHeaders.includes(header) ||
                              getItemData(item, header, globalIndex) === ""
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {editingCell &&
                          editingCell.itemId === item.id &&
                          editingCell.header === header &&
                          header !== "Signature" &&
                          header !== "signature" ? (
                            <div
                              className="flex items-center"
                              ref={inputRef}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className={`flex-1 p-1 border border-gray-300 bg-white rounded`}
                                autoFocus
                              />
                              <div className="flex ml-1">
                                <motion.button
                                  onClick={(e) => handleSaveCell(e)}
                                  className="p-1 bg-green-600 text-white rounded mr-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title={translate("save", language)}
                                >
                                  <Check size={16} />
                                </motion.button>
                                <motion.button
                                  onClick={(e) => handleCancelEdit(e)}
                                  className="p-1 bg-red-600 text-white rounded"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title={translate("cancel", language)}
                                >
                                  <X size={16} />
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            getItemData(item, header, globalIndex)
                          )}
                        </td>
                      ))}
                      <td
                        className={`border ${tableBorderColor} p-2 text-center no-print`}
                      >
                        <motion.button
                          onClick={() => onRemoveStudent(item.id)}
                          className={`${buttonDanger} p-1 rounded`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={
                            isEmployeeList
                              ? translate("remove_employee", language)
                              : translate("remove_student", language)
                          }
                        >
                          <Trash size={16} />
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Custom message (only on the last page) */}
          {list.customMessage.show && (
            <>
              {pageIndex === totalPages - 1 && (
                <div className="mt-5 text-right">
                  <div
                    style={{
                      textDecoration: "underline",
                      textDecorationThickness: "3px",
                      textDecorationStyle: "solid",
                    }}
                    className="text-lg font-bold mb-1"
                  >
                    {list.customMessage.text} :{" "}
                  </div>
                  <div
                    className="text-small italic font-medium"
                    style={{ marginBottom: "20%" }}
                  >
                    {list.customMessage.name}
                  </div>
                  <div className="mb-10">
                    {made_text}{" "}
                    {new Date(list.customMessage.date).toLocaleDateString()}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Page number */}
          <div className="text-center text-sm mt-4">
            {/* Page {pageIndex + 1} / {totalPages} */}
          </div>
        </div>
      ))}

      {listItems.length === 0 && (
        <div className="text-center p-8">
          <p className={`text-lg ${text_color}`}>
            {isEmployeeList
              ? translate("no_employees_in_list", language)
              : translate("no_students_in_list", language)}
          </p>
          <p className={`${text_color} opacity-75`}>
            {isEmployeeList
              ? translate("click_to_add_employees", language)
              : translate("click_to_add_students", language)}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentListPreview;
