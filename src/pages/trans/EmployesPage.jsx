import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, useFlashNotification, useLanguage } from "../components/contexts";
import { initializePositions } from "../utils/database_methods";
import { sortEmployees, filterEmployees } from "../components/employes/utils";
import EmployeeSidebar from "../components/employes/EmployeeSidebar.jsx";
import PositionForm from "../components/employes/PositionForm.jsx";
import EmployeeFilters from "../components/employes/EmployeeFilters.jsx";
import EmployeesList from "../components/employes/EmployeesList.jsx";
import EmployeeForm from "../components/employes/EmployeeForm.jsx";
import translations from "../components/employes/employes_translator";

const EmployesPage = () => {
  // Theme and UI context
  const { app_bg_color, text_color, theme } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const { language } = useLanguage();
  
  // Translation function
  const translate = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Database and data state
  const [database, setDatabase] = useState(null);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(translate("teachers_position") || "Professeurs");
  const [loading, setLoading] = useState(true);

  // UI state
  const [showAddPositionForm, setShowAddPositionForm] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [positionToEdit, setPositionToEdit] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  // Filter and sort state
  const [filters, setFilters] = useState({
    position: null,
    status: "All",
    searchTerm: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  // Load database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const db = await window.electron.getDatabase();

        // Initialize positions with Professeurs if needed
        await initializePositions(db);

        // Get positions and employees
        setDatabase(db);
        setPositions(db.positions || []);
        setEmployees(db.employees || []);

        // Set default selected position to Professeurs if it exists
        const professeurPosition = db.positions?.find(p => p.name === "Professeurs");
        if (professeurPosition) {
          setSelectedPosition("Professeurs");
          setFilters(prev => ({ ...prev, position: "Professeurs" }));
        }
      } catch (error) {
        console.error("Error loading database:", error);
        setFlashMessage({
          type: "error",
          message: translate("error_loading_data")
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // When selected position changes, update filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, position: selectedPosition }));
  }, [selectedPosition]);

  // Refresh data from database
  const refreshData = async () => {
    try {
      setLoading(true);
      const db = await window.electron.getDatabase();
      setDatabase(db);
      setPositions(db.positions || []);
      setEmployees(db.employees || []);
      return true;
    } catch (error) {
        console.error("Error refreshing data:", error);
        setFlashMessage({
          type: "error",
          message: translate("error_refreshing_data")
        });
      return false;
    } finally {
      setTimeout(() => setLoading(false), 300); // Add a small delay before hiding loading indicator
    }
  };

  // Calculate the number of employees per position
  const positionsWithCounts = positions.map(position => ({
    ...position,
    employeeCount: employees.filter(emp => emp.postes.includes(position.name)).length
  }));

  // Filter and sort employees based on current filters
  const filteredEmployees = filterEmployees(
    sortEmployees(employees, filters.sortBy, filters.sortOrder),
    filters
  );

  // Handlers for forms
  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setShowAddEmployeeForm(true);
  };

  const handleAddNewEmployee = () => {
    setEmployeeToEdit(null);
    setShowAddEmployeeForm(true);
  };

  const handleEditPosition = (position) => {
    setPositionToEdit(position);
    setShowAddPositionForm(true);
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      style={{ marginLeft: "4%", height: "89vh", marginTop: "5.5%" }}
      className={`p-1 overflow-hidden flex flex-col sm:flex-row h-screen ${app_bg_color} ${text_color}`}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Employee management sidebar */}
      <div className="w-full sm:w-auto shrink-0">
        <EmployeeSidebar
          positions={positionsWithCounts}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          setShowAddPositionForm={setShowAddPositionForm}
          setPositionToEdit={handleEditPosition}
          refreshData={refreshData}
          database={database}
        />
      </div>

      {/* Main content area */}
      <motion.div
        className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto scrollbar-custom"
        variants={contentVariants}
      >
        <AnimatePresence mode="wait">
          {selectedPosition ? (
            <motion.div
              key="position-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EmployeeFilters
                filters={filters}
                setFilters={setFilters}
                positionName={selectedPosition}
              />

              <EmployeesList
                employees={filteredEmployees}
                position={selectedPosition}
                onEdit={handleEditEmployee}
                onAddNew={handleAddNewEmployee}
                refreshData={refreshData}
                database={database}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center max-w-md p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{translate("employee_management_title")}</h2>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                  {translate("select_position_instruction")}
                </p>
                <button
                  onClick={() => setShowAddPositionForm(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {translate("add_position_button")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Forms */}
      <PositionForm
        isOpen={showAddPositionForm}
        onClose={() => {
          setShowAddPositionForm(false);
          setPositionToEdit(null);
        }}
        position={positionToEdit}
        database={database}
        refreshData={refreshData}
      />

      <EmployeeForm
        isOpen={showAddEmployeeForm}
        onClose={() => {
          setShowAddEmployeeForm(false);
          setEmployeeToEdit(null);
        }}
        employee={employeeToEdit}
        database={database}
        positions={positions}
        refreshData={refreshData}
      />
    </motion.div>
  );
};

export default EmployesPage;
