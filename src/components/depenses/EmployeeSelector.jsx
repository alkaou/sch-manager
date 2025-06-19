import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, CheckSquare, Square, Filter, X, UserCheck, UserX, Briefcase, GraduationCap } from "lucide-react";
import translations from "./depense_translator";
import { useLanguage } from "../contexts";
import { getPostNameTrans } from "../../utils/helpers";

const EmployeeSelector = ({
  db,
  selectedEmployees,
  onSelectEmployees,
  theme,
  text_color,
  error
}) => {
  const { language } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "active", // 'active', 'inactive', 'all'
    type: "all", // 'professors', 'other', 'all'
  });
  const [selectAll, setSelectAll] = useState(false);
  const searchInputRef = useRef(null);

  // Translation helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Load employees when component mounts
  useEffect(() => {
    if (db && db.employees) {
      setEmployees(db.employees || []);
      applyFilters(db.employees || [], searchTerm, filters);
    }
  }, [db]);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const all_employees = employees.length === 0 ? (db?.employees || []) : employees;
    applyFilters(all_employees, searchTerm, filters);
  }, [searchTerm, filters]);

  // Update selectAll state when all visible employees are selected
  useEffect(() => {
    if (filteredEmployees.length > 0) {
      const allSelected = filteredEmployees.every(employee => 
        selectedEmployees.some(selected => selected.id === employee.id)
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedEmployees, filteredEmployees]);

  const applyFilters = (employeesList, search, activeFilters) => {
    if (!Array.isArray(employeesList)) {
      employeesList = [];
    }
    let result = [...employeesList];
    
    // Apply search term filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(employee => 
        employee.name_complet.toLowerCase().includes(searchLower) ||
        (employee.matricule && employee.matricule.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (activeFilters.status === "active") {
      result = result.filter(employee => employee.status === "actif");
    } else if (activeFilters.status === "inactive") {
      result = result.filter(employee => employee.status === "inactif");
    }
    
    // Apply type filter
    if (activeFilters.type === "professors") {
      result = result.filter(employee => employee.postes.includes("Professeurs"));
    } else if (activeFilters.type === "other") {
      result = result.filter(employee => !employee.postes.includes("Professeurs"));
    }
    
    setFilteredEmployees(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      // Deselect all filtered employees
      const newSelectedEmployees = selectedEmployees.filter(selected => 
        !filteredEmployees.some(filtered => filtered.id === selected.id)
      );
      onSelectEmployees(newSelectedEmployees);
    } else {
      // Select all filtered employees
      const newSelectedEmployees = [
        ...selectedEmployees,
        ...filteredEmployees.filter(filtered => 
          !selectedEmployees.some(selected => selected.id === filtered.id)
        )
      ];
      onSelectEmployees(newSelectedEmployees);
    }
    setSelectAll(!selectAll);
  };

  const toggleEmployeeSelection = (employee) => {
    if (selectedEmployees.some(selected => selected.id === employee.id)) {
      // Remove employee
      onSelectEmployees(selectedEmployees.filter(selected => selected.id !== employee.id));
    } else {
      // Add employee
      onSelectEmployees([...selectedEmployees, employee]);
    }
  };

  const isEmployeeSelected = (employee) => {
    return selectedEmployees.some(selected => selected.id === employee.id);
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{t('select_employees_to_pay')}</h3>
        <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {t('select_employees_instruction')}
        </p>
        {error && (
          <div className="mt-2 text-red-500 text-xs sm:text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Search and filters */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center mb-3 sm:mb-4 flex-wrap gap-2">
          <div className={`flex-1 relative ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} rounded-lg overflow-hidden`}>
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <Search size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('search_employees')}
              className={`block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm ${theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-900 placeholder-gray-500"} border-none rounded-lg focus:ring-2 ${theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-500"} focus:outline-none`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X size={16} className={theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 sm:p-2 rounded-lg ${showFilters ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")} hover:opacity-90 transition-colors duration-200`}
            aria-label="Toggle filters"
            title={t('toggle_filters')}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Status filter */}
                <div>
                  <h4 className="font-medium text-xs sm:text-sm mb-2">{t('filter_by_status')}</h4>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <button
                      onClick={() => handleFilterChange("status", "all")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.status === "all" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <Users size={14} className="mr-1" />
                      {t('all_employees')}
                    </button>
                    <button
                      onClick={() => handleFilterChange("status", "active")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.status === "active" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <UserCheck size={14} className="mr-1" />
                      {t('active_employees')}
                    </button>
                    <button
                      onClick={() => handleFilterChange("status", "inactive")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.status === "inactive" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <UserX size={14} className="mr-1" />
                      {t('inactive_employees')}
                    </button>
                  </div>
                </div>

                {/* Type filter */}
                <div>
                  <h4 className="font-medium text-xs sm:text-sm mb-2">{t('filter_by_type')}</h4>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <button
                      onClick={() => handleFilterChange("type", "all")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.type === "all" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <Briefcase size={14} className="mr-1" />
                      {t('all_positions')}
                    </button>
                    <button
                      onClick={() => handleFilterChange("type", "professors")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.type === "professors" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <GraduationCap size={14} className="mr-1" />
                      {t('professors_only')}
                    </button>
                    <button
                      onClick={() => handleFilterChange("type", "other")}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm ${filters.type === "other" ? (theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-white text-gray-700 border border-gray-300")}`}
                    >
                      <Briefcase size={14} className="mr-1" />
                      {t('other_staff')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Employees list */}
      <div className={`rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} overflow-hidden shadow`}>
        {/* Header */}
        <div className={`px-3 sm:px-6 py-3 sm:py-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} border-b ${theme === "dark" ? "border-gray-600" : "border-gray-200"} flex justify-between items-center`}>
          <div className="flex items-center">
            <button
              onClick={toggleSelectAll}
              className={`mr-2 sm:mr-3 flex items-center justify-center rounded p-1 transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              title={selectAll ? t('deselect_all') : t('select_all')}
            >
              {selectAll ? (
                <CheckSquare size={16} className={theme === "dark" ? "text-blue-400" : "text-blue-500"} />
              ) : (
                <Square size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
              )}
            </button>
            <span className="font-medium text-xs sm:text-sm">
              {filteredEmployees.length} {t('employees_found')}
            </span>
          </div>
          <div className="text-xs sm:text-sm">
            {selectedEmployees.length} {t('employees_selected')}
          </div>
        </div>

        {/* List */}
        <div className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"} max-h-[300px] sm:max-h-[400px] overflow-y-auto`}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`px-3 sm:px-6 py-3 sm:py-4 flex items-center hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} cursor-pointer transition-colors duration-200`}
                onClick={() => toggleEmployeeSelection(employee)}
              >
                <div className="mr-2 sm:mr-3">
                  {isEmployeeSelected(employee) ? (
                    <CheckSquare size={16} className={`${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
                  ) : (
                    <Square size={16} className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-xs sm:text-sm">{employee.name_complet}</div>
                  <div className="text-xxs sm:text-xs mt-1 flex flex-wrap gap-1 sm:gap-2">
                    {employee.postes.map(poste => (
                      <span 
                        key={poste} 
                        className={`inline-flex items-center px-1 sm:px-2 py-0.5 rounded text-xxs sm:text-xs font-medium ${
                          poste === "Professeurs" 
                            ? `${theme === "dark" ? "bg-indigo-900 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`
                            : `${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800"}`
                        }`}
                      >
                        {getPostNameTrans(poste, language)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`text-xxs sm:text-xs ${employee.status === "actif" ? "text-green-500" : "text-red-500"}`}>
                  {employee.status === "actif" ? t('active_status') : t('inactive_status')}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 sm:p-8 text-center">
              <Users size={32} className={`mx-auto mb-2 sm:mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-400"} sm:hidden`} />
              <Users size={48} className={`mx-auto mb-2 sm:mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-400"} hidden sm:block`} />
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">{t('no_employees_found')}</h3>
              <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {t('try_different_filters')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelector; 