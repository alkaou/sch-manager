import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Settings, Download, Users, Globe } from 'lucide-react';
import secureLocalStorage from "react-secure-storage";
import { useFlashNotification } from "../contexts.js";
import StudentListSidebar from './StudentListSidebar.jsx';
import StudentListPreview from './StudentListPreview.jsx';
import StudentListAddStudents from './StudentListAddStudents.jsx';
import { addPdfStyles } from './pdfStyles.js';

// Available languages
const AVAILABLE_LANGUAGES = [
  { id: "Français", label: "Français" },
  { id: "Anglais", label: "Anglais" },
  { id: "Bambara", label: "Bambara" }
];

const StudentListEditor = ({
  list,
  onUpdateList,
  onReturnToMenu,
  db,
  theme,
  textClass,
  appBgColor
}) => {
  const { setFlashMessage } = useFlashNotification();
  const [currentList, setCurrentList] = useState(list);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customHeaderInput, setCustomHeaderInput] = useState('');
  const [pdfIsGenerating, setPdfIsGenerating] = useState(false);
  const languageSelectorRef = useRef(null);

  // Load custom headers from local storage
  useEffect(() => {
    const savedCustomHeaders = secureLocalStorage.getItem("customListHeaders");
    if (savedCustomHeaders && Array.isArray(savedCustomHeaders)) {
      // We don't need to set them to the list, just make them available in the sidebar
    }

    // Add PDF styles to document
    addPdfStyles();
  }, []);

  // Handle clicking outside language selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLanguageSelector &&
        languageSelectorRef.current &&
        !languageSelectorRef.current.contains(event.target)
      ) {
        setShowLanguageSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);

  // Handle saving the list
  const handleSave = async () => {
    try {
      setSaving(true);

      // Update the list with the latest changes
      const updatedList = {
        ...currentList,
        updatedAt: new Date().toISOString()
      };

      await window.electron.saveStudentList(updatedList);
      onUpdateList(updatedList);

      setFlashMessage({
        message: "Liste sauvegardée avec succès",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving list:", error);
      setFlashMessage({
        message: "Erreur lors de la sauvegarde de la liste",
        type: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    const updatedList = {
      ...currentList,
      langue: language
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
    setShowLanguageSelector(false);

    setFlashMessage({
      message: `Langue changée en ${language}`,
      type: "success",
      duration: 3000,
    });
  };

  // Handle returning to menu (with auto-save)
  const handleReturn = async () => {
    await handleSave();
    onReturnToMenu();
  };

  // Handle adding students to the list
  const handleAddStudents = (selectedStudents) => {
    // Filter out students that are already in the list
    const existingStudentIds = currentList.students.map(s => s.id);
    const newStudents = selectedStudents.filter(s => !existingStudentIds.includes(s.id));
    const all_students = [...currentList.students, ...newStudents];
    const filter_students = all_students.sort((a, b) => {
      const lastNameA = (`${a.last_name} ${a.sure_name} ${a.first_name}` || '').toLowerCase();
      const lastNameB = (`${b.last_name} ${a.sure_name} ${b.first_name}` || '').toLowerCase();

      if (lastNameA !== lastNameB) {
        return lastNameA.localeCompare(lastNameB);
      }
    });

    if (newStudents.length > 0) {
      const updatedList = {
        ...currentList,
        students: filter_students,
      };

      setCurrentList(updatedList);
      onUpdateList(updatedList);

      setFlashMessage({
        message: `${newStudents.length} élève(s) ajouté(s) à la liste`,
        type: "success",
        duration: 3000,
      });
    } else {
      setFlashMessage({
        message: "Aucun nouvel élève ajouté à la liste",
        type: "info",
        duration: 3000,
      });
    }

    setShowAddStudents(false);
  };

  // Handle removing a student from the list
  const handleRemoveStudent = (studentId) => {
    const updatedList = {
      ...currentList,
      students: currentList.students.filter(s => s.id !== studentId)
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: "Élève retiré de la liste",
      type: "success",
      duration: 3000,
    });
  };

  // Handle adding a custom header
  const handleAddCustomHeader = (headerName) => {
    if (!headerName || headerName.trim() === '') return;

    // Check if header already exists
    if ([...currentList.headers, ...currentList.customHeaders].includes(headerName)) {
      setFlashMessage({
        message: "Cet en-tête existe déjà",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Add to list
    const updatedList = {
      ...currentList,
      customHeaders: [...currentList.customHeaders, headerName]
    };

    // Save to local storage for future use
    const savedCustomHeaders = secureLocalStorage.getItem("customListHeaders") || [];
    if (!savedCustomHeaders.includes(headerName)) {
      secureLocalStorage.setItem("customListHeaders", [...savedCustomHeaders, headerName]);
    }

    setCurrentList(updatedList);
    onUpdateList(updatedList);
    setCustomHeaderInput('');

    setFlashMessage({
      message: "En-tête personnalisé ajouté",
      type: "success",
      duration: 3000,
    });
  };

  // Handle toggling a header
  const handleToggleHeader = (header, isCustom = false) => {
    let updatedHeaders = [...currentList.headers];
    let updatedCustomHeaders = [...currentList.customHeaders];

    // Special case for required headers (Prénom, Nom)
    if (header === "Prénom" || header === "Nom") {
      setFlashMessage({
        message: "Les en-têtes Prénom et Nom sont obligatoires",
        type: "info",
        duration: 3000,
      });
      return;
    }

    // Handle standard headers
    if (!isCustom) {
      if (updatedHeaders.includes(header)) {
        // Remove header
        updatedHeaders = updatedHeaders.filter(h => h !== header);
      } else {
        // Add header, but check if we're at the limit
        if (updatedHeaders.length + updatedCustomHeaders.length >= 10) {
          setFlashMessage({
            message: "Vous ne pouvez pas sélectionner plus de 10 en-têtes",
            type: "error",
            duration: 3000,
          });
          return;
        }
        updatedHeaders.push(header);
      }
    } else {
      // Handle custom headers
      if (updatedCustomHeaders.includes(header)) {
        // Remove header
        updatedCustomHeaders = updatedCustomHeaders.filter(h => h !== header);
      } else {
        // Add header, but check if we're at the limit
        if (updatedHeaders.length + updatedCustomHeaders.length >= 10) {
          setFlashMessage({
            message: "Vous ne pouvez pas sélectionner plus de 10 en-têtes",
            type: "error",
            duration: 5000,
          });
          return;
        }
        updatedCustomHeaders.push(header);
      }
    }

    // Update the list
    const updatedList = {
      ...currentList,
      headers: updatedHeaders,
      customHeaders: updatedCustomHeaders
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating title properties
  const handleUpdateTitle = (titleProps) => {
    const updatedList = {
      ...currentList,
      title: {
        ...currentList.title,
        ...titleProps
      }
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating orientation
  const handleUpdateOrientation = (orientation) => {
    const updatedList = {
      ...currentList,
      orientation
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: `Orientation changée en ${orientation === 'portrait' ? 'portrait' : 'paysage'}`,
      type: "success",
      duration: 3000,
    });
  };

  // Handle updating custom message
  const handleUpdateCustomMessage = (customMessage) => {
    const updatedList = {
      ...currentList,
      customMessage
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating Country Info Header
  const onUpdatecountryInfosHeader = (countryInfosHeader) => {
    const updatedList = {
      ...currentList,
      countryInfosHeader
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating student custom data
  const handleUpdateStudentCustomData = (studentId, headerName, value) => {
    const updatedStudents = currentList.students.map(student => {
      if (student.id === studentId) {
        // Créer une copie profonde pour s'assurer que React détecte le changement
        // const new_header = {}
        const updatedStudent = {
          ...student,
          [headerName]: value,
          // customData: {
          //   ...(student.customData || {}),
          //   [headerName]: value
          // }
        };
        return updatedStudent;
      }
      return student;
    });
    // console.log(updatedStudents); // Commencer par ici
    const updatedList = {
      ...currentList,
      students: updatedStudents
    };

    // Mettre à jour l'état local et propager la mise à jour au parent
    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setPdfIsGenerating(true);

      // Import required libraries
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas-pro');

      // Set PDF options based on orientation
      const orientation = currentList.orientation === 'portrait' ? 'p' : 'l';
      const pdf = new jsPDF(orientation, 'mm', 'a4');

      // Get all page containers
      const pageContainers = document.querySelectorAll('.student-list-preview-container');

      if (pageContainers.length === 0) {
        throw new Error("No pages found to generate PDF");
      }

      // Process each page
      for (let i = 0; i < pageContainers.length; i++) {
        const pageContainer = pageContainers[i];

        // Create a clone to avoid modifying the original
        const clonedPage = pageContainer.cloneNode(true);

        // Remove all elements with the "no-print" class
        const noPrintElements = clonedPage.querySelectorAll('.no-print');
        noPrintElements.forEach(el => el.remove());

        // Create a temporary container for the cloned page
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.background = 'white';
        tempDiv.appendChild(clonedPage);
        document.body.appendChild(tempDiv);

        // Render the page to canvas
        const canvas = await html2canvas(clonedPage, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        // console.log(orientation);
        // Calculate dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = orientation === 'p' ? 210 : 297;
        const pdfHeight = orientation === 'p' ? 297 : 210;
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage();
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        // const margin = 10;
        const img_x = 5;
        const img_width = pageWidth - 10;
        let imagHeight;
        if (orientation !== "p") {
          imagHeight = pageContainers.length > i + 1 ? pageHeight : imgHeight * ratio;
        } else {
          imagHeight = imgHeight * ratio;
        }

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', img_x, imgY, img_width, imagHeight);

        // Clean up
        document.body.removeChild(tempDiv);
      }

      // Generate filename
      const fileName = `${currentList.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

      // Save the PDF
      pdf.save(fileName);

      setFlashMessage({
        message: "PDF généré avec succès",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setFlashMessage({
        message: "Erreur lors de la génération du PDF",
        type: "error",
        duration: 5000,
      });
    } finally {
      setPdfIsGenerating(false);
    }
  };

  // Styles based on theme
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonDanger = "bg-red-600 hover:bg-red-700 text-white";
  const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";
  const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const dropdownHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center">
          <motion.button
            onClick={handleReturn}
            className={`${buttonSecondary} p-2 rounded-lg mr-4 flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className={`text-xl font-semibold ${textClass}`}>{currentList.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language selector button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className={`${buttonSecondary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe size={20} />
              <span className="ml-2 hidden sm:inline">{currentList.langue || "Français"}</span>
            </motion.button>

            {/* Language dropdown */}
            {showLanguageSelector && (
              <div 
                ref={languageSelectorRef}
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${dropdownBgColor} ${dropdownBorderColor} border z-10`}
              >
                <div className="py-1">
                  {AVAILABLE_LANGUAGES.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => handleLanguageChange(language.id)}
                      className={`${
                        currentList.langue === language.id ? 
                        (theme === "dark" ? "bg-gray-700" : "bg-gray-100") : ""
                      } ${dropdownHoverBgColor} ${textClass} block w-full text-left px-4 py-2`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <motion.button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`${buttonSecondary} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>

          <motion.button
            onClick={() => setShowAddStudents(true)}
            className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={20} />
          </motion.button>

          <motion.button
            onClick={handleSave}
            disabled={saving}
            className={`${buttonSuccess} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={20} />
          </motion.button>

          <motion.button
            onClick={handleGeneratePDF}
            className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={pdfIsGenerating}
          >
            {pdfIsGenerating ?
              <Download size={20} className="animate-pulse" /> :
              <Download size={20} />
            }
          </motion.button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-r ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"} overflow-y-auto`}
            >
              <StudentListSidebar
                list={currentList}
                onToggleHeader={handleToggleHeader}
                onAddCustomHeader={handleAddCustomHeader}
                customHeaderInput={customHeaderInput}
                setCustomHeaderInput={setCustomHeaderInput}
                onUpdateTitle={handleUpdateTitle}
                onUpdateOrientation={handleUpdateOrientation}
                onUpdateCustomMessage={handleUpdateCustomMessage}
                onUpdatecountryInfosHeader={onUpdatecountryInfosHeader}
                theme={theme}
                textClass={textClass}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview : LIST STUDENTS */}
        <div className="flex-1 overflow-auto p-4">
          <StudentListPreview
            list={currentList}
            onRemoveStudent={handleRemoveStudent}
            onUpdateStudentCustomData={handleUpdateStudentCustomData}
            theme={theme}
            textClass={textClass}
            db={db}
          />
        </div>
      </div>

      {/* Add Students Modal */}
      <AnimatePresence>
        {showAddStudents && (
          <StudentListAddStudents
            db={db}
            onClose={() => setShowAddStudents(false)}
            onAddStudents={handleAddStudents}
            theme={theme}
            textClass={textClass}
            currentStudents={currentList.students}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentListEditor;