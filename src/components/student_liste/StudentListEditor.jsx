import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Settings, Download, Users } from 'lucide-react';
import secureLocalStorage from "react-secure-storage";
import { useFlashNotification } from "../contexts.js";
import StudentListSidebar from './StudentListSidebar.jsx';
import StudentListPreview from './StudentListPreview.jsx';
import StudentListAddStudents from './StudentListAddStudents.jsx';

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
  const [saving, setSaving] = useState(false);
  const [customHeaderInput, setCustomHeaderInput] = useState('');

  // Load custom headers from local storage
  useEffect(() => {
    const savedCustomHeaders = secureLocalStorage.getItem("customListHeaders");
    if (savedCustomHeaders && Array.isArray(savedCustomHeaders)) {
      // We don't need to set them to the list, just make them available in the sidebar
    }
  }, []);

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
      const lastNameA = (a.last_name || '').toLowerCase();
      const lastNameB = (b.last_name || '').toLowerCase();

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
        if (updatedHeaders.length + updatedCustomHeaders.length >= 6) {
          setFlashMessage({
            message: "Vous ne pouvez pas sélectionner plus de 6 en-têtes",
            type: "error",
            duration: 3000,
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

  // Handle updating student custom data
  const handleUpdateStudentCustomData = (studentId, headerName, value) => {
    const updatedStudents = currentList.students.map(student => {
      if (student.id === studentId) {
        // Créer une copie profonde pour s'assurer que React détecte le changement
        const new_header = {}
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

  // Styles based on theme
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonDanger = "bg-red-600 hover:bg-red-700 text-white";
  const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";

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

          <>
            {({ blob, url, loading, error }) =>
              loading ?
                <Download size={20} className="animate-pulse" /> :
                <Download size={20} />
            }
          </>
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
                theme={theme}
                textClass={textClass}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-4">
          <StudentListPreview
            list={currentList}
            onRemoveStudent={handleRemoveStudent}
            onUpdateStudentCustomData={handleUpdateStudentCustomData}
            theme={theme}
            textClass={textClass}
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