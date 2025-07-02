import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Search, Check, CheckSquare, Square, User } from "lucide-react";
import { translate } from "./liste_rapide_translator";
import { useLanguage } from "../contexts";
import { return_prof_trans } from "../employes/utils";

const EmployeListAddEmployees = ({
  db,
  onClose,
  onAddEmployees,
  theme,
  currentEmployees = [],
}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("actif");

  const { language } = useLanguage();

  // Load employees from database and initialize selected employees
  useEffect(() => {
    if (db && db.employees) {
      setEmployees(
        db.employees.filter((employee) => employee.status === selectedStatus)
      );

      // Pre-select employees that are already in the list
      if (currentEmployees && currentEmployees.length > 0) {
        const preSelectedEmployees = db.employees.filter((employee) =>
          currentEmployees.some((e) => e.id === employee.id)
        );
        setSelectedEmployees(preSelectedEmployees);
      }
    }
  }, [db, currentEmployees, selectedStatus]);

  // Handle select all employees
  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees);
    }
  };

  // Handle select an employee
  const handleSelectEmployee = (employee) => {
    if (selectedEmployees.find((e) => e.id === employee.id)) {
      setSelectedEmployees(
        selectedEmployees.filter((e) => e.id !== employee.id)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  // Handle add selected employees
  const handleAddEmployees = () => {
    onAddEmployees(selectedEmployees);
  };

  // Get unique positions
  const positions = db?.positions
    ? [...new Set(db.positions.map((p) => p.name))]
    : [];

  // Filter employees based on search term, position, and status
  const filteredEmployees = employees.filter((employee) => {
    // Filter by search term
    const searchMatch =
      searchTerm === "" ||
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.sure_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name_complet?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by position
    const positionMatch =
      selectedPosition === "all" || employee.postes.includes(selectedPosition);

    return searchMatch && positionMatch;
  });

  // Styles based on theme
  const textClass = theme === "dark" ? "text-white" : "text-gray-700";
  const modalBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const buttonSecondary =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${modalBgColor} rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col ${borderColor} border`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ width: "95%" }}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 border-b ${borderColor}`}
        >
          <h2 className={`text-xl font-semibold ${textClass}`}>
            {translate("add_employees_text", language)}
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={translate("close", language)}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Filters */}
        <div className={`p-4 border-b ${borderColor} flex flex-wrap gap-4`}>
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div
              className={`flex items-center border ${borderColor} rounded-lg overflow-hidden ${inputBgColor}`}
            >
              <Search size={20} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate("search_employees", language)}
                className={`flex-1 p-2 outline-none ${inputBgColor} ${textClass}`}
              />
            </div>
          </div>

          {/* Position filter */}
          <div className="w-64">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className={`w-full p-2 border ${borderColor} rounded-lg ${inputBgColor} ${textClass}`}
              title={translate("filter_by_poste", language)}
            >
              <option value="all">{translate("all_postes", language)}</option>
              {positions.sort().map((position) => (
                <option key={position} value={position}>
                  {return_prof_trans(position, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="w-64">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full p-2 border ${borderColor} rounded-lg ${inputBgColor} ${textClass}`}
              title={translate("filter_by_status", language)}
            >
              <option value="actif">
                {translate("active_employees", language)}
              </option>
              <option value="inactif">
                {translate("inactive_employees", language)}
              </option>
            </select>
          </div>
        </div>

        {/* Employees list */}
        <div className="flex-1 overflow-y-auto scrollbar-custom p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleSelectAll}
                className={`p-2 rounded-lg mr-2 ${buttonSecondary} flex items-center`}
                title={
                  selectedEmployees.length === filteredEmployees.length &&
                    filteredEmployees.length > 0
                    ? translate("deselect_all", language)
                    : translate("select_all", language)
                }
              >
                {selectedEmployees.length === filteredEmployees.length &&
                  filteredEmployees.length > 0 ? (
                  <CheckSquare size={20} className="mr-2" />
                ) : (
                  <Square size={20} className="mr-2" />
                )}
                {selectedEmployees.length === filteredEmployees.length &&
                  filteredEmployees.length > 0
                  ? translate("deselect_all", language)
                  : translate("select_all", language)}
              </button>
              <span className={`${textClass}`}>
                {selectedEmployees.length}{" "}
                {translate("employees_selected", language)}{" "}
                {filteredEmployees.length} {translate("displayed", language)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => {
              const isSelected = selectedEmployees.some(
                (e) => e.id === employee.id
              );

              return (
                <motion.div
                  key={employee.id}
                  className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } rounded-lg p-4 cursor-pointer ${isSelected
                      ? theme === "dark"
                        ? "ring-2 ring-blue-500"
                        : "ring-2 ring-blue-500"
                      : ""
                    }`}
                  onClick={() => handleSelectEmployee(employee)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-full ${isSelected
                        ? "bg-blue-500"
                        : theme === "dark"
                          ? "bg-gray-600"
                          : "bg-gray-200"
                        } mr-3`}
                    >
                      {isSelected ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <User size={20} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${textClass}`}>
                        {employee.name_complet}
                      </h3>
                      {employee.matricule && (
                        <p
                          className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"
                            }`}
                        >
                          {translate("matricule", language)}: {employee.matricule}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {employee.postes.map((poste, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {return_prof_trans(poste, language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredEmployees.length === 0 && (
              <div className={`col-span-3 text-center p-8 ${textClass}`}>
                <p className="text-lg">
                  {translate("no_employees_found", language)}
                </p>
                <p className="opacity-75">
                  {translate("try_modify_filters", language)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${borderColor} flex justify-end space-x-3`}
        >
          <motion.button
            onClick={onClose}
            className={`${buttonSecondary} px-4 py-2 rounded-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={translate("cancel_and_close", language)}
          >
            {translate("cancel", language)}
          </motion.button>
          <motion.button
            onClick={handleAddEmployees}
            disabled={selectedEmployees.length === 0}
            className={`${selectedEmployees.length > 0 ? buttonSuccess : "bg-green-400"
              } px-4 py-2 rounded-lg text-white flex items-center`}
            whileHover={selectedEmployees.length > 0 ? { scale: 1.05 } : {}}
            whileTap={selectedEmployees.length > 0 ? { scale: 0.95 } : {}}
            title={`${translate("add", language)} ${selectedEmployees.length} ${translate("employees_added_to_list", language)}`}
          >
            <Check size={20} className="mr-2" />
            {translate("add", language)} {selectedEmployees.length} {translate("employees_or_employee", language)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmployeListAddEmployees;
