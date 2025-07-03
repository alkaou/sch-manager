import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Settings,
  Download,
  Users,
  Globe,
  Briefcase,
} from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import { useFlashNotification, useLanguage } from "../contexts";
import StudentListSidebar from "./StudentListSidebar.jsx";
import StudentListPreview from "./StudentListPreview.jsx";
import StudentListAddStudents from "./StudentListAddStudents.jsx";
import EmployeListAddEmployees from "./EmployeListAddEmployees.jsx";
import { addPdfStyles } from "./pdfStyles";
import { translate } from "./liste_rapide_translator";
import { return_language_name } from "./utils";

// Available languages
const AVAILABLE_LANGUAGES = [
  { id: "Français", label: "Français" },
  { id: "Anglais", label: "English" },
  { id: "Bambara", label: "Bamanakan" },
];

const StudentListEditor = ({
  list,
  onUpdateList,
  onReturnToMenu,
  db,
  theme,
  textClass,
  appBgColor,
}) => {
  const { setFlashMessage } = useFlashNotification();
  const [currentList, setCurrentList] = useState(list);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [showAddEmployees, setShowAddEmployees] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customHeaderInput, setCustomHeaderInput] = useState("");
  const [pdfIsGenerating, setPdfIsGenerating] = useState(false);
  const languageSelectorRef = useRef(null);
  const { language } = useLanguage();

  // Determine if this is an employee list or student list
  const isEmployeeList = currentList?.listType === "employees";

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguageSelector]);

  // Handle saving the list
  const handleSave = async () => {
    try {
      setSaving(true);

      // Update the list with the latest changes
      const updatedList = {
        ...currentList,
        updatedAt: new Date().toISOString(),
      };

      await window.electron.saveStudentList(updatedList);
      onUpdateList(updatedList);

      setFlashMessage({
        message: translate("list_saved_successfully", language),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving list:", error);
      setFlashMessage({
        message: translate("error_saving_list", language),
        type: "error",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (_language) => {
    const updatedList = {
      ...currentList,
      langue: _language,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
    setShowLanguageSelector(false);

    setFlashMessage({
      message: `${translate("language_changed", language)} ${_language}`,
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
    const existingStudentIds = currentList.students.map((s) => s.id);
    const newStudents = selectedStudents.filter(
      (s) => !existingStudentIds.includes(s.id)
    );
    const all_students = [...currentList.students, ...newStudents];
    const filter_students = all_students.sort((a, b) => {
      const lastNameA = (
        `${a.last_name} ${a.sure_name} ${a.first_name}` || ""
      ).toLowerCase();
      const lastNameB = (
        `${b.last_name} ${a.sure_name} ${b.first_name}` || ""
      ).toLowerCase();

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
        message: `${newStudents.length} ${translate(
          "students_added_to_list",
          language
        )}`,
        type: "success",
        duration: 3000,
      });
    } else {
      setFlashMessage({
        message: translate("no_new_students_added", language),
        type: "info",
        duration: 3000,
      });
    }

    setShowAddStudents(false);
  };

  // New function to handle adding employees to the list
  const handleAddEmployees = (selectedEmployees) => {
    // Filter out employees that are already in the list
    const existingEmployeeIds = currentList.employees?.map((e) => e.id) || [];
    const newEmployees = selectedEmployees.filter(
      (e) => !existingEmployeeIds.includes(e.id)
    );
    const allEmployees = [...(currentList.employees || []), ...newEmployees];
    const filteredEmployees = allEmployees.sort((a, b) => {
      const lastNameA = (
        `${a.last_name} ${a.sure_name} ${a.first_name}` || ""
      ).toLowerCase();
      const lastNameB = (
        `${b.last_name} ${b.sure_name} ${b.first_name}` || ""
      ).toLowerCase();

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
        message: `${newEmployees.length} ${translate(
          "employees_added_to_list",
          language
        )}`,
        type: "success",
        duration: 3000,
      });
    } else {
      setFlashMessage({
        message: translate("no_new_employees_added", language),
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
      students: currentList.students.filter((s) => s.id !== studentId),
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: translate("student_removed_from_list", language),
      type: "success",
      duration: 3000,
    });
  };

  // Handle removing an employee from the list
  const handleRemoveEmployee = (employeeId) => {
    const updatedList = {
      ...currentList,
      employees: currentList.employees.filter((e) => e.id !== employeeId),
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: translate("employee_removed_from_list", language),
      type: "success",
      duration: 3000,
    });
  };

  // Handle adding a custom header
  const handleAddCustomHeader = (headerName) => {
    if (!headerName || headerName.trim() === "") return;

    // Check if header already exists
    if (
      [...currentList.headers, ...currentList.customHeaders].includes(
        headerName
      )
    ) {
      setFlashMessage({
        message: translate("header_already_exists", language),
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Add to list
    const updatedList = {
      ...currentList,
      customHeaders: [...currentList.customHeaders, headerName],
    };

    // Save to local storage for future use
    const savedCustomHeaders =
      secureLocalStorage.getItem("customListHeaders") || [];
    if (!savedCustomHeaders.includes(headerName)) {
      secureLocalStorage.setItem("customListHeaders", [
        ...savedCustomHeaders,
        headerName,
      ]);
    }

    setCurrentList(updatedList);
    onUpdateList(updatedList);
    setCustomHeaderInput("");

    setFlashMessage({
      message: translate("custom_header_added", language),
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
        message: translate("first_last_name_required", language),
        type: "info",
        duration: 3000,
      });
      return;
    }

    // Handle standard headers
    if (!isCustom) {
      if (updatedHeaders.includes(header)) {
        // Remove header
        updatedHeaders = updatedHeaders.filter((h) => h !== header);
      } else {
        // Add header, but check if we're at the limit
        if (updatedHeaders.length + updatedCustomHeaders.length >= 10) {
          setFlashMessage({
            message: translate("max_10_headers", language),
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
        updatedCustomHeaders = updatedCustomHeaders.filter((h) => h !== header);
      } else {
        // Add header, but check if we're at the limit
        if (updatedHeaders.length + updatedCustomHeaders.length >= 10) {
          setFlashMessage({
            message: translate("max_10_headers", language),
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
      customHeaders: updatedCustomHeaders,
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
        ...titleProps,
      },
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating orientation
  const handleUpdateOrientation = (orientation) => {
    const updatedList = {
      ...currentList,
      orientation,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: `${translate("orientation_changed", language)} ${
        orientation === "portrait"
          ? translate("portrait", language)
          : translate("landscape", language)
      }`,
      type: "success",
      duration: 3000,
    });
  };

  // Handle updating custom message
  const handleUpdateCustomMessage = (customMessage) => {
    const updatedList = {
      ...currentList,
      customMessage,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating Country Info Header
  const onUpdatecountryInfosHeader = (countryInfosHeader) => {
    const updatedList = {
      ...currentList,
      countryInfosHeader,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating list type (student or employee)
  const handleUpdateListType = (listType) => {
    // Only allow changing if the list is empty or already matches the type
    if (
      (listType === "students" && currentList.employees?.length > 0) ||
      (listType === "employees" && currentList.students?.length > 0)
    ) {
      setFlashMessage({
        message: `${translate("cannot_change_list_type_1", language)} ${
          listType === "students"
            ? translate("employees_or_employee", language)
            : translate("students_or_student", language)
        }. ${translate("cannot_change_list_type_2", language)}`,
        type: "error",
        duration: 5000,
      });
      return;
    }

    const updatedList = {
      ...currentList,
      listType,
      // Initialize appropriate collection if it doesn't exist
      ...(listType === "employees" &&
        !currentList.employees && { employees: [] }),
      ...(listType === "students" && !currentList.students && { students: [] }),
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);

    setFlashMessage({
      message: `${translate("list_type_changed", language)} ${
        listType === "students"
          ? translate("students", language)
          : translate("employees", language)
      }}`,
      type: "success",
      duration: 3000,
    });
  };

  // Handle updating student custom data
  const handleUpdateStudentCustomData = (studentId, headerName, value) => {
    const updatedStudents = currentList.students.map((student) => {
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
      students: updatedStudents,
    };

    // Mettre à jour l'état local et propager la mise à jour au parent
    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle updating employee custom data
  const handleUpdateEmployeeCustomData = (employeeId, headerName, value) => {
    const updatedEmployees = currentList.employees.map((employee) => {
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
      employees: updatedEmployees,
    };

    setCurrentList(updatedList);
    onUpdateList(updatedList);
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setPdfIsGenerating(true);

      // Import required libraries
      const { jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas-pro");

      // Set PDF options based on orientation
      const orientation = currentList.orientation === "portrait" ? "p" : "l";
      const pdf = new jsPDF(orientation, "mm", "a4");

      // Get all page containers
      const pageContainers = document.querySelectorAll(
        ".student-list-preview-container"
      );

      if (pageContainers.length === 0) {
        throw new Error("No pages found to generate PDF");
      }

      // Process each page
      for (let i = 0; i < pageContainers.length; i++) {
        const pageContainer = pageContainers[i];

        // Create a clone to avoid modifying the original
        const clonedPage = pageContainer.cloneNode(true);

        // Remove all elements with the "no-print" class
        const noPrintElements = clonedPage.querySelectorAll(".no-print");
        noPrintElements.forEach((el) => el.remove());

        // Create a temporary container for the cloned page
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        tempDiv.style.background = "white";
        tempDiv.appendChild(clonedPage);
        document.body.appendChild(tempDiv);

        // Render the page to canvas
        const canvas = await html2canvas(clonedPage, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = orientation === "p" ? 210 : 297;
        const pdfHeight = orientation === "p" ? 297 : 210;
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
        const img_x = 5;
        const img_width = pageWidth - 10;
        let imagHeight;
        if (orientation !== "p") {
          imagHeight =
            pageContainers.length > i + 1 ? pageHeight : imgHeight * ratio;
        } else {
          imagHeight = imgHeight * ratio;
        }

        // Add image to PDF
        pdf.addImage(imgData, "PNG", img_x, imgY, img_width, imagHeight);

        // Clean up
        document.body.removeChild(tempDiv);
      }

      // Generate filename
      const listTypeName = isEmployeeList
        ? translate("employees", language)
        : translate("students", language);
      const fileName = `${currentList.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_${listTypeName}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Save the PDF
      pdf.save(fileName);

      setFlashMessage({
        message: translate("pdf_generated_successfully", language),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setFlashMessage({
        message: translate("error_generating_pdf", language),
        type: "error",
        duration: 5000,
      });
    } finally {
      setPdfIsGenerating(false);
    }
  };

  // Styles based on theme
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";
  const dropdownBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const dropdownBorderColor =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const dropdownHoverBgColor =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b ${appBgColor}`}
      >
        <div className="flex items-center">
          <motion.button
            onClick={handleReturn}
            className={`${buttonSecondary} p-2 rounded-lg mr-4 flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={translate("return_to_menu", language)}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className={`text-xl font-semibold ${textClass}`}>
            {currentList.name}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Type switcher */}
          <div className="relative mr-2">
            <select
              value={currentList.listType || "students"}
              onChange={(e) => handleUpdateListType(e.target.value)}
              className={`${buttonSecondary} p-2 rounded-lg`}
              title={translate("change_list_type", language)}
            >
              <option value="students">
                {translate("student_list", language)}
              </option>
              <option value="employees">
                {translate("employee_list", language)}
              </option>
            </select>
          </div>

          {/* Language selector button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className={`${buttonSecondary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={translate("change_language", language)}
            >
              <Globe size={20} />
              <span className="ml-2 hidden sm:inline">
                {return_language_name(currentList.langue) || "Français"}
              </span>
            </motion.button>

            {/* Language dropdown */}
            {showLanguageSelector && (
              <div
                ref={languageSelectorRef}
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${dropdownBgColor} ${dropdownBorderColor} border z-10`}
              >
                <div className="py-1">
                  {AVAILABLE_LANGUAGES.map((_language) => (
                    <button
                      key={_language.id}
                      onClick={() => handleLanguageChange(_language.id)}
                      className={`${
                        currentList.langue === _language.id
                          ? theme === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      } ${dropdownHoverBgColor} ${textClass} block w-full text-left px-4 py-2`}
                    >
                      {_language.label}
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
            title={translate("settings", language)}
          >
            <Settings size={20} />
          </motion.button>

          {isEmployeeList ? (
            <motion.button
              onClick={() => setShowAddEmployees(true)}
              className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={translate("add_employees", language)}
            >
              <Briefcase size={20} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowAddStudents(true)}
              className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={translate("add_students_button", language)}
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
            title={translate("save_list", language)}
          >
            <Save size={20} />
          </motion.button>

          <motion.button
            onClick={handleGeneratePDF}
            className={`${buttonPrimary} p-2 rounded-lg flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={pdfIsGenerating}
            title={translate("download_pdf", language)}
          >
            {pdfIsGenerating ? (
              <Download size={20} className="animate-pulse" />
            ) : (
              <Download size={20} />
            )}
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
              className={`border-r ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-gray-50"
              } overflow-y-auto scrollbar-custom
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
            onRemoveStudent={
              isEmployeeList ? handleRemoveEmployee : handleRemoveStudent
            }
            onUpdateStudentCustomData={
              isEmployeeList
                ? handleUpdateEmployeeCustomData
                : handleUpdateStudentCustomData
            }
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
