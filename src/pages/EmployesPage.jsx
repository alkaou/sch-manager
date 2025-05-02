import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, useFlashNotification } from "../components/contexts";
import { initializePositions } from "../utils/database_methods";
import { sortEmployees, filterEmployees } from "../components/employes/utils";
import EmployeeSidebar from "../components/employes/EmployeeSidebar.jsx";
import PositionForm from "../components/employes/PositionForm.jsx";
import EmployeeFilters from "../components/employes/EmployeeFilters.jsx";
import EmployeesList from "../components/employes/EmployeesList.jsx";
import EmployeeForm from "../components/employes/EmployeeForm.jsx";

const EmployesPage = () => {
  // Theme and UI context
  const { app_bg_color, text_color, theme } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  
  // Database and data state
  const [database, setDatabase] = useState(null);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
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
          message: "Erreur lors du chargement des données"
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
        message: "Erreur lors du rafraîchissement des données"
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
      style={{ marginLeft: "7%" }}
      className={`flex h-screen ${app_bg_color} ${text_color} mt-20`}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Employee management sidebar */}
      <EmployeeSidebar
        positions={positionsWithCounts}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        setShowAddPositionForm={setShowAddPositionForm}
        setPositionToEdit={handleEditPosition}
        refreshData={refreshData}
        database={database}
      />
      
      {/* Main content area */}
      <motion.div 
        className="flex-1 p-6 overflow-auto scrollbar-custom"
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
              className="space-y-4"
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
              <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Gestion des employés</h2>
                <p className="mb-6">
                  Sélectionnez un poste dans le panneau de gauche pour voir les employés associés, 
                  ou ajoutez un nouveau poste en cliquant sur le bouton +.
                </p>
                <button
                  onClick={() => setShowAddPositionForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ajouter un poste
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
