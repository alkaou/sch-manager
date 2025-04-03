import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash, Check, X } from 'lucide-react';
import { getClasseName } from "../../utils/helpers";

const StudentListPreview = ({
  list,
  onRemoveStudent,
  onUpdateStudentCustomData,
  theme,
  textClass
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingCell && inputRef.current && !inputRef.current.contains(event.target)) {
        handleCancelEdit();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell]);

  // Get all headers (standard + custom)
  const allHeaders = [...list.headers, ...list.customHeaders];

  // Always ensure Prénom and Nom are included
  if (!allHeaders.includes('Prénom')) allHeaders.unshift('Prénom');
  if (!allHeaders.includes('Nom') && allHeaders.includes('Prénom')) allHeaders.splice(1, 0, 'Nom');

  // If N° is selected, move it to the first position
  if (allHeaders.includes('N°')) {
    const index = allHeaders.indexOf('N°');
    allHeaders.splice(index, 1);
    allHeaders.unshift('N°');
  }

  // Get student data for a specific header
  const getStudentData = (student, header, index) => {
    // console.log(student.first_name + ' ' student.last_name + ' ' + index);
    if (header === 'N°') {
      return index + 1;
    }

    if (header === 'Prénom') return student.first_name || '';
    if (header === 'Nom') return student.last_name || '';
    if (header === 'Matricule') return student.matricule || '';
    if (header === 'Père') return student.father_name || '';
    if (header === 'Mère') return student.mother_name || '';
    if (header === 'Contact') return student.parents_contact || '';
    if (header === 'Date de naissance') return new Date(student.birth_date).toLocaleDateString() || '';
    if (header === 'Moyenne') return student.Moyenne || '';
    if (header === 'Classe') return getClasseName(student.classe) || '';
    if (header === 'Âge') {
      if (!student.birth_date) return '';
      const birthDate = new Date(student.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    }
    if (header === 'Sexe') return student.sexe || '';
    if (header === 'Signature') return '';

    // Custom header - Modifié pour mieux gérer les données personnalisées
    return student.header && student.header !== undefined 
      ? student.header 
      : '';
  };

  // Handle cell click for custom data
  const handleCellClick = (student, header, index) => {
    // Only allow editing custom headers or empty standard fields
    const isCustomHeader = list.customHeaders.includes(header);
    const value = getStudentData(student, header, index);

    if (isCustomHeader || value === '') {
      setEditingCell({ studentId: student.id, header });
      setEditValue(value);
    }
  };

  // Handle save edited cell
  const handleSaveCell = (e) => {
    // Stop event propagation to prevent cell click
    if (e) e.stopPropagation();

    if (editingCell) {
      // Appeler la fonction de mise à jour avec les bonnes valeurs
      onUpdateStudentCustomData(editingCell.studentId, editingCell.header, editValue);
      
      // Fermer l'éditeur après la sauvegarde
      setEditingCell(null);
      setEditValue('');
    }
  };

  // Handle cancel editing
  const handleCancelEdit = (e) => {
    // Stop event propagation to prevent cell click
    if (e) e.stopPropagation();

    setEditingCell(null);
    setEditValue('');
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveCell();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Calculate page dimensions based on orientation
  const pageWidth = list.orientation === 'portrait' ? '210mm' : '297mm';

  // Styles based on theme
  const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const tableHeaderBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const tableRowBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const tableRowAltBgColor = theme === "dark" ? "bg-gray-750" : "bg-gray-50";
  const buttonDanger = "bg-red-600 hover:bg-red-700 text-white";

  // Sort students alphabetically by last_name then first_name
  const sortedStudents = [...list.students].sort((a, b) => {
    const lastNameA = (a.last_name || '').toLowerCase();
    const lastNameB = (b.last_name || '').toLowerCase();

    if (lastNameA !== lastNameB) {
      return lastNameA.localeCompare(lastNameB);
    }

    const firstNameA = (a.first_name || '').toLowerCase();
    const firstNameB = (b.first_name || '').toLowerCase();
    return firstNameA.localeCompare(firstNameB);
  });


  return (
    <div className="flex flex-col items-center">
      <div
        className={`mb-8 shadow-lg bg-white ${theme === "dark" ? "text-black" : ""}`}
        style={{
          width: pageWidth,
          padding: '10mm',
          position: 'relative',
          overflow: 'hidden',
          breakInside: 'avoid',
          pageBreakAfter: 'always',
        }}
      >
        {/* Title */}
        <div
          style={{
            ...list.title.style,
            marginBottom: '10mm',
          }}
        >
          {list.title.text}
        </div>

        {/* Table */}
        {list.students.length > 0 && (
          <table className={`w-full border-collapse ${tableBorderColor} border`}>
            <thead>
              <tr className={`${tableHeaderBgColor}`}>
                {allHeaders.map(header => (
                  <th
                    key={header}
                    className={`border ${tableBorderColor} p-2 text-left`}
                    style={{
                      minWidth: header === 'N°' ? '50px' : 'auto',
                      maxWidth: header === 'Prénom' || header === 'Nom' ? '150px' : 'auto'
                    }}
                  >
                    {header}
                  </th>
                ))}
                <th className={`border ${tableBorderColor} p-2 text-center w-12`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`${index % 2 === 0 ? tableRowBgColor : tableRowAltBgColor}`}
                >
                  {allHeaders.map(header => (
                    <td
                      key={`${student.id}-${header}`}
                      className={`
                        border p-2 
                        ${tableBorderColor} 
                        ${
                          header === "Sexe" || 
                          header === "Classe" ||
                          header === "Moyenne" ||
                          header === "Date de naissance" ||
                          header === "Âge" ||
                          header === "Contact" ||
                          header === "Matricule"
                          ? "text-center" : ""
                        }
                      `}
                      onClick={() => {
                        if(header === "Signature" || header === "signature") return;
                        handleCellClick(student, header, index);
                      }}
                      style={{ cursor: list.customHeaders.includes(header) || getStudentData(student, header, index) === '' ? 'pointer' : 'default' }}
                    >
                      {editingCell &&
                        editingCell.studentId === student.id &&
                        editingCell.header === header && 
                        header !== "Signature" &&
                        header !== "signature" ? (
                        <div className="flex items-center" ref={inputRef} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className={`flex-1 p-1 border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white"} rounded`}
                            autoFocus
                          />
                          <div className="flex ml-1">
                            <motion.button
                              onClick={(e) => handleSaveCell(e)}
                              className="p-1 bg-green-600 text-white rounded mr-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Check size={16} />
                            </motion.button>
                            <motion.button
                              onClick={(e) => handleCancelEdit(e)}
                              className="p-1 bg-red-600 text-white rounded"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        getStudentData(student, header, index)
                      )}
                    </td>
                  ))}
                  <td className={`border ${tableBorderColor} p-2 text-center`}>
                    <motion.button
                      onClick={() => onRemoveStudent(student.id)}
                      className={`${buttonDanger} p-1 rounded`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash size={16} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Custom message (only on the last page) */}
        <div className="mt-5 ml-20">
          <div className="text-lg font-bold mb-40">{list.customMessage.text}</div>
          <div className="mb-10">Fait, le {new Date(list.customMessage.date).toLocaleDateString()}</div>
        </div>
      </div>

      {list.students.length === 0 && (
        <div className="text-center p-8">
          <p className={`text-lg ${textClass}`}>Aucun élève dans cette liste</p>
          <p className={`${textClass} opacity-75`}>Cliquez sur le bouton "Ajouter des élèves" pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default StudentListPreview;