import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Settings, Download, Users, Globe, Briefcase } from 'lucide-react';
import secureLocalStorage from "react-secure-storage";
import { useFlashNotification, useLanguage } from "../contexts.js";
import translations from './liste_rapide_translator';
import StudentListSidebar from './StudentListSidebar.jsx';
import StudentListPreview from './StudentListPreview.jsx';
import StudentListAddStudents from './StudentListAddStudents.jsx';
import EmployeListAddEmployees from './EmployeListAddEmployees.jsx';
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
  const { language } = useLanguage();
  const { setFlashMessage } = useFlashNotification();
  
  // Translation helper
  const t = (key, params = {}) => {
    if (!translations[key]) return key;
    let text = translations[key][language] || translations[key]["Français"];
    
    // Replace any parameters in the text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };
  
  const [currentList, setCurrentList] = useState(list);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [showAddEmployees, setShowAddEmployees] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customHeaderInput, setCustomHeaderInput] = useState('');
  const [pdfIsGenerating, setPdfIsGenerating] = useState(false);
  const languageSelectorRef = useRef(null);

  // Determine if this is an employee list or student list
  const isEmployeeList = currentList?.listType === 'employees';

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
        message: t("list_saved_successfully"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving list:", error);
      setFlashMessage({
        message: t("error_saving_list"),
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
      message: t("language_changed", { language }),
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
        message: t("students_added_to_list", { count: newStudents.length }),
        type: "success",
        duration: 3000,
      });
    } else {
      setFlashMessage({
        message: t("no_new_students_added"),
        type: "info",
        duration: 3000,
      });
    }

    setShowAddStudents(false);
  };

  // New function to handle adding employees to the list
  const handleAddEmployees = (selectedEmployees) => {
    // Filter out employees that are already in the list
    const existingEmployeeIds = currentList.employees?.map(e => e.id) || [];
    const newEmployees = selectedEmployees.filter(e => !existingEmployeeIds.includes(e.id));
    const allEmployees = [...(currentList.employees || []), ...newEmployees];
    const filteredEmployees = allEmployees.sort((a, b) => {
      const lastNameA = (`${a.last_name} ${a.sure_name} ${a.first_name}` || '').toLowerCase();
      const lastNameB = (`${b.last_name} ${b.sure_name} ${b.first_name}` || '').toLowerCase();

      if (lastNameA !== lastNameB) {
        return lastNameA.localeCompare(lastNameB);
      }
    });

    if (newEmployees.length > 0) {
      const updatedList = {
        ...currentList,
        employees: filteredEmployees,
      };

      setCurrentList(updatedList);
      onUpdateList(updatedList);

      setFlashMessage({
        message: t("employees_added_to_list", { count: newEmployees.length }),
        type: "success",
        duration: 3000,
      });
    } else {
      setFlashMessage({
        message: t("no_new_employees_added"),
        type: "info",
        duration: 3000,
      });
    }

    setShowAddEmployees(false);
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
      message: t("student_removed_from_list"),
      type: "success",
      duration: 3000,
    });
  };

  // Handle removing an employee from the list
  const handleRemoveEmployee = (employeeId) => {
    const updatedList = {
      ...currentList,
      employees: currentList.employees.filter(e => e.id !== employeeId)
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: t("employee_removed_from_list"),
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
        message: t("header_already_exists"),
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
      message: t("custom_header_added"),
      type: "success",
      duration: 3000,
    });
  };

  // Handle toggling a header
  const handleToggleHeader = (header, isCustom = false) => {
    let updatedHeaders = [...currentList.headers];
    let updatedCustomHeaders = [...currentList.customHeaders];

    // Special case for required headers (Prénom, Nom)
    if (header === t("first_name") || header === t("last_name")) {
      setFlashMessage({
        message: t("first_last_name_required"),
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
            message: t("max_10_headers"),
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
            message: t("max_10_headers"),
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
      message: t("orientation_changed", { orientation: t(orientation) }),
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

  // Handle updating list type (student or employee)
  const handleUpdateListType = (listType) => {
    // Only allow changing if the list is empty or already matches the type
    if (
      (listType === 'students' && currentList.employees?.length > 0) ||
      (listType === 'employees' && currentList.students?.length > 0)
    ) {
      setFlashMessage({
        message: t("cannot_change_list_type", {
          type: listType === 'students' ? t("employees") : t("students")
        }),
        type: "error",
        duration: 5000,
      });
      return;
    }

    const updatedList = {
      ...currentList,
      listType,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: t("list_type_changed", {
        type: listType === 'students' ? t("student_list") : t("employee_list")
      }),
      type: "success",
      duration: 3000,
    });
  };

  // Handle updating student custom data
  const handleUpdateStudentCustomData = (studentId, headerName, value) => {
    const updatedStudents = currentList.students.map(student => {
      if (student.id === studentId) {
        // Créer une copie profonde pour s'assurer que React détecte le changement
        const updatedStudent = {
          ...student,
          [headerName]: value,
        };
        return updatedStudent;
      }
      return student;
    });
    const updatedList = {
      ...currentList,
      students: updatedStudents
    };

    // Mettre à jour l'état local et propager la mise à jour au parent
    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating employee custom data
  const handleUpdateEmployeeCustomData = (employeeId, headerName, value) => {
    const updatedEmployees = currentList.employees.map(employee => {
      if (employee.id === employeeId) {
        const updatedEmployee = {
          ...employee,
          [headerName]: value,
        };
        return updatedEmployee;
      }
      return employee;
    });
    const updatedList = {
      ...currentList,
      employees: updatedEmployees
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setPdfIsGenerating(true);

      await window.electron.generateListPDF(currentList);
      setPdfIsGenerating(false);

      setFlashMessage({
        message: t("pdf_generated_successfully"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setFlashMessage({
        message: t("error_generating_pdf"),
        type: "error",
        duration: 5000,
      });
    }
  };

  // Styles based on theme
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";
  const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const dropdownHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between border-b ${appBgColor}`}>
        <div className="flex items-center">
          <motion.button
            onClick={handleReturn}
            className={`${buttonSecondary} p-2 rounded-lg mr-4 flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("return_to_menu")}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className={`text-xl font-semibold ${textClass}`}>{currentList.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Type switcher */}
          <div className="relative mr-2">
            <select
              value={currentList.listType || 'students'}
              onChange={(e) => handleUpdateListType(e.target.value)}
              className={`${buttonSecondary} p-2 rounded-lg`}
              title={t("change_list_type")}
            >
              <option value="students">{t("student_list")}</option>
              <option value="employees">{t("employee_list")}</option>
            </select>
          </div>

          {/* Language selector button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className={`${buttonSecondary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("change_language")}
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
            title={t("settings")}
          >
            <Settings size={20} />
          </motion.button>

          {isEmployeeList ? (
            <motion.button
              onClick={() => setShowAddEmployees(true)}
              className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("add_employees")}
            >
              <Briefcase size={20} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowAddStudents(true)}
              className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("add_students")}
            >
              <Users size={20} />
            </motion.button>
          )}

          <motion.button
            onClick={handleSave}
            disabled={saving}
            className={`${buttonSuccess} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("save_list")}
          >
            <Save size={20} />
          </motion.button>

          <motion.button
            onClick={handleGeneratePDF}
            className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={pdfIsGenerating}
            title={t("download_pdf")}
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
              className={`border-r ${theme === "dark" ? "border-gray-700 bg-gray-800" : 
                "border-gray-200 bg-gray-50"} overflow-y-auto scrollbar-custom
              `}
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
                isEmployeeList={isEmployeeList}
                theme={theme}
                textClass={textClass}
                appBgColor={appBgColor}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview */}
        <div className="flex-1 overflow-auto scrollbar-custom p-4">
          <StudentListPreview
            list={currentList}
            onRemoveStudent={isEmployeeList ? handleRemoveEmployee : handleRemoveStudent}
            onUpdateStudentCustomData={isEmployeeList ? handleUpdateEmployeeCustomData : handleUpdateStudentCustomData}
            isEmployeeList={isEmployeeList}
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
            currentStudents={currentList.students}
          />
        )}
      </AnimatePresence>

      {/* Add Employees Modal */}
      <AnimatePresence>
        {showAddEmployees && (
          <EmployeListAddEmployees
            db={db}
            onClose={() => setShowAddEmployees(false)}
            onAddEmployees={handleAddEmployees}
            theme={theme}
            currentEmployees={currentList.employees || []}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentListEditor;