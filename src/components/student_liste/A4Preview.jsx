import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getAge } from "../../utils/helpers";

const A4Preview = ({
  listData,
  theme,
  text_color
}) => {
  // Get selected headers in order
  const selectedHeaders = [...listData.headers, ...listData.customHeaders]
    .filter(h => h.selected)
    .sort((a, b) => {
      // Ensure "numero" is always first if selected
      if (a.id === "numero") return -1;
      if (b.id === "numero") return 1;
      
      // Then sort by the order they were selected (using priority as a proxy)
      return a.priority - b.priority;
    });
  
  // Get page dimensions based on orientation
  const isPortrait = listData.orientation === "portrait";
  const pageWidth = isPortrait ? "210mm" : "297mm";
  const pageHeight = isPortrait ? "297mm" : "210mm";
  
  // Calculate how many students fit per page
  const studentsPerPage = isPortrait ? 25 : 20;
  
  // Split students into pages
  const pages = [];
  for (let i = 0; i < listData.students.length; i += studentsPerPage) {
    pages.push(listData.students.slice(i, i + studentsPerPage));
  }
  
  // If no pages (no students), create an empty page
  if (pages.length === 0) {
    pages.push([]);
  }
  
  // Get title style classes
  const getTitleClasses = () => {
    let classes = "";
    
    // Position
    if (listData.title.position === "center") classes += "text-center ";
    else if (listData.title.position === "right") classes += "text-right ";
    else classes += "text-left ";
    
    // Style classes based on selected style
    switch (listData.title.style) {
      case "style2":
        classes += "border-b-2 pb-2 ";
        break;
      case "style3":
        classes += "bg-gray-100 p-2 rounded ";
        break;
      case "style4":
        classes += "border-b-2 border-t-2 py-2 ";
        break;
      case "style5":
        classes += "uppercase tracking-wider ";
        break;
      case "style6":
        classes += "border-2 border-dashed p-2 ";
        break;
      default:
        break;
    }
    
    return classes;
  };
  
  // Get title inline styles
  const getTitleStyles = () => {
    return {
      fontFamily: listData.title.fontFamily,
      fontSize: listData.title.fontSize,
      color: listData.title.color,
      fontWeight: listData.title.bold ? "bold" : "normal",
      fontStyle: listData.title.italic ? "italic" : "normal",
      textDecoration: listData.title.underline ? "underline" : "none"
    };
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "dd/MM/yyyy", { locale: fr });
  };
  
  // Get cell value based on header id
  const getCellValue = (student, headerId) => {
    switch (headerId) {
      case "numero":
        return listData.students.indexOf(student) + 1;
      case "first_name":
        return student.first_name || "";
      case "last_name":
        return student.last_name || "";
      case "matricule":
        return student.matricule || "";
      case "father_name":
        return student.father_name || "";
      case "mother_name":
        return student.mother_name || "";
      case "parents_contact":
        return student.parents_contact || "";
      case "birth_date":
        return formatDate(student.birth_date);
      case "classe":
        return student.classe || "";
      case "age":
        return student.birth_date ? getAge(student.birth_date) : "";
      case "sexe":
        return student.sexe || "";
      case "signature":
        return "";
      case "moyenne":
        return "";
      default:
        // For custom headers, return empty string or custom value if exists
        return student[headerId] || "";
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {pages.map((pageStudents, pageIndex) => (
        <div 
          key={pageIndex}
          className="mb-8 bg-white shadow-lg a4-page page-container"
          style={{
            width: pageWidth,
            height: pageHeight,
            padding: "10mm",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Page number */}
          <div 
            style={{ 
              position: "absolute", 
              bottom: "5mm", 
              right: "5mm",
              fontSize: "8pt",
              color: "#888"
            }}
          >
            Page {pageIndex + 1}/{pages.length}
          </div>
          
          {/* Title */}
          <div className="mb-4">
            <h1 
              className={getTitleClasses()}
              style={getTitleStyles()}
            >
              {listData.title.text}
            </h1>
          </div>
          
          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {selectedHeaders.map(header => (
                  <th 
                    key={header.id}
                    className="border border-gray-300 px-2 py-1 text-sm font-semibold text-gray-700"
                    style={{ 
                      width: header.id === "numero" ? "40px" : "auto",
                      textAlign: header.id === "numero" ? "center" : "left"
                    }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageStudents.map((student, index) => (
                <tr 
                  key={student.id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {selectedHeaders.map(header => (
                    <td 
                      key={`${student.id}-${header.id}`}
                      className="border border-gray-300 px-2 py-1 text-sm text-gray-700"
                      style={{ 
                        textAlign: header.id === "numero" ? "center" : "left"
                      }}
                    >
                      {getCellValue(student, header.id)}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Empty rows to fill the page */}
              {Array.from({ length: Math.max(0, studentsPerPage - pageStudents.length) }).map((_, index) => (
                <tr key={`empty-${index}`}>
                  {selectedHeaders.map((header, headerIndex) => (
                    <td 
                      key={`empty-${index}-${headerIndex}`}
                      className="border border-gray-300 px-2 py-1 text-sm"
                      style={{ height: "24px" }}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Date at bottom */}
          <div className="mt-4 text-sm text-gray-500">
            Généré le {format(new Date(), "d MMMM yyyy", { locale: fr })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default A4Preview;