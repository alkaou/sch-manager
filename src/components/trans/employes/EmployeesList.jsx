import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit, Trash, CheckCircle, XCircle, UserPlus, RefreshCw, ChevronRight, ChevronDown, Briefcase, Users, UserCheck } from 'lucide-react';
import { useTheme, useFlashNotification, useLanguage } from '../contexts';
import { deleteEmployee, activateEmployee, deactivateEmployee } from '../../utils/database_methods';
import { formatDate, formatCurrency } from './utils';
import { getClasseName } from "../../utils/helpers";
import translations from './employes_translator';

const EmployeesList = ({
  employees,
  position,
  onEdit,
  onAddNew,
  refreshData,
  database,
  loading
}) => {
  const { text_color, theme, gradients, app_bg_color } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const { language } = useLanguage();
  
  const translate = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  const [selected, setSelected] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [expandedClassRows, setExpandedClassRows] = useState({});
  
  // Reset local loading when parent loading changes
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading]);

  // Handle selection
  const toggleSelectAll = () => {
    if (selected.length === employees.length) {
      setSelected([]);
    } else {
      setSelected(employees.map((e) => e.id));
    }
  };

  const toggleSelectEmployee = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Toggle expanded classes for a specific employee
  const toggleExpandClasses = (employeeId) => {
    setExpandedClassRows(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  // Status operations
  const handleActivateSelected = () => {
    setConfirmModal({
      type: 'activate',
      title: translate("activate_employees"),
      message: translate("confirm_activate_employees"),
      onConfirm: async () => {
        try {
          setLocalLoading(true);
          for (const id of selected) {
            await activateEmployee(id, database, setFlashMessage);
          }
          setSelected([]);
          await refreshData();
        } catch (error) {
          console.error('Error activating employees:', error);
        } finally {
          setConfirmModal(null);
          setTimeout(() => setLocalLoading(false), 300);
        }
      }
    });
  };

  const handleDeactivateSelected = () => {
    setConfirmModal({
      type: 'deactivate',
      title: translate("deactivate_employees"),
      message: translate("confirm_deactivate_employees"),
      onConfirm: async () => {
        try {
          setLocalLoading(true);
          for (const id of selected) {
            await deactivateEmployee(id, database, setFlashMessage);
          }
          setSelected([]);
          await refreshData();
        } catch (error) {
          console.error('Error deactivating employees:', error);
        } finally {
          setConfirmModal(null);
          setTimeout(() => setLocalLoading(false), 300);
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    setConfirmModal({
      type: 'delete',
      title: translate("delete_employees"),
      message: selected.length > 1 
        ? translate("confirm_delete_employees_plural") 
        : translate("confirm_delete_employees_singular"),
      onConfirm: async () => {
        try {
          setLocalLoading(true);
          for (const id of selected) {
            await deleteEmployee(id, database, setFlashMessage);
          }
          setSelected([]);
          await refreshData();
        } catch (error) {
          console.error('Error deleting employees:', error);
        } finally {
          setConfirmModal(null);
          setTimeout(() => setLocalLoading(false), 300);
        }
      }
    });
  };

  const handleEditSelected = () => {
    // Find the employee to edit
    if (selected.length === 0) return;
    const employeeToEdit = employees.find((e) => e.id === selected[0]);
    if (employeeToEdit) {
      onEdit(employeeToEdit);
    }
  };

  // Check if all selected employees are active or inactive
  const allActive = selected.length > 0 && selected.every(id =>
    employees.find(e => e.id === id)?.status === 'actif'
  );

  const allInactive = selected.length > 0 && selected.every(id =>
    employees.find(e => e.id === id)?.status === 'inactif'
  );

  // Calculate statistics
  const activeEmployeesInPosition = employees.filter(e => e.status === 'actif').length;
  const totalActiveEmployees = database?.employees?.filter(e => e.status === 'actif').length || 0;
  const totalPositions = database?.positions?.length || 0;

  // Theme styling
  const tableBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const tableBorderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const tableRowHoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';
  const buttonDeleteColor = "bg-red-600 hover:bg-red-700 text-white";
  const buttonSuccessColor = "bg-green-600 hover:bg-green-700 text-white";
  const buttonWarningColor = "bg-yellow-500 hover:bg-yellow-600 text-white";
  const buttonPrimaryColor = "bg-blue-600 hover:bg-blue-700 text-white";
  const statsBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50';
  const statsBorderColor = theme === 'dark' ? 'border-gray-600' : 'border-blue-200';
  const statsIconColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-500';
  const _text_color = app_bg_color === gradients[1] ||
      app_bg_color === gradients[2] ||
      theme === "dark" ? text_color : "text-gray-700";

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.15 }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleRefreshData = async () => {
    setLocalLoading(true);
    await refreshData();
    setTimeout(() => setLocalLoading(false), 300);
  };

  return (
    <div className={`relative ${_text_color} overflow-hidden`}>
      {/* Statistics display */}
      <motion.div 
        className={`mb-6 rounded-lg ${statsBgColor} border ${statsBorderColor} p-4 shadow-md overflow-hidden`}
        variants={statsVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-opacity-40 bg-blue-500 bg-opacity-10 rounded-lg">
            <div className={`p-3 rounded-full ${statsIconColor} bg-white bg-opacity-30 mr-4`}>
              <UserCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-medium opacity-70">{translate("active_employees")} ({position})</h4>
              <p className="text-2xl font-bold">{activeEmployeesInPosition}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-opacity-40 bg-green-500 bg-opacity-10 rounded-lg">
            <div className={`p-3 rounded-full text-green-500 bg-white bg-opacity-30 mr-4`}>
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-sm font-medium opacity-70">{translate("total_active_employees")}</h4>
              <p className="text-2xl font-bold">{totalActiveEmployees}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-opacity-70 bg-purple-500 bg-opacity-10 rounded-lg">
            <div className={`p-3 rounded-full text-purple-500 bg-white bg-opacity-30 mr-4`}>
              <Briefcase size={24} />
            </div>
            <div>
              <h4 className="text-sm font-medium opacity-70">{translate("total_positions")}</h4>
              <p className="text-2xl font-bold">{totalPositions}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action bar */}
      <div className="mb-4 flex gap-2 justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefreshData}
          className={`p-2 rounded-full ${buttonPrimaryColor} shadow-md`}
          disabled={loading || localLoading}
          title={translate("refresh_data")}
        >
          <RefreshCw size={20} className={(loading || localLoading) ? 'animate-spin' : ''} />
        </motion.button>

        {selected.length > 0 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteSelected}
              className={`p-2 rounded-full ${buttonDeleteColor} shadow-md`}
              title={translate("delete_employees")}
            >
              <Trash size={20} />
            </motion.button>

            {allActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeactivateSelected}
                className={`p-2 rounded-full ${buttonWarningColor} shadow-md`}
                title={translate("deactivate_employees")}
              >
                <XCircle size={20} />
              </motion.button>
            )}

            {allInactive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleActivateSelected}
                className={`p-2 rounded-full ${buttonSuccessColor} shadow-md`}
                title={translate("activate_employees")}
              >
                <CheckCircle size={20} />
              </motion.button>
            )}

            {!allActive && !allInactive && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleActivateSelected}
                  className={`p-2 rounded-full ${buttonSuccessColor} shadow-md`}
                  title={translate("activate_employees")}
                >
                  <CheckCircle size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeactivateSelected}
                  className={`p-2 rounded-full ${buttonWarningColor} shadow-md`}
                  title={translate("deactivate_employees")}
                >
                  <XCircle size={20} />
                </motion.button>
              </>
            )}

            {selected.length === 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditSelected}
                className={`p-2 rounded-full ${buttonPrimaryColor} shadow-md`}
                title={translate("edit_employee")}
              >
                <Edit size={20} />
              </motion.button>
            )}
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddNew}
          className={`p-2 rounded-full ${buttonSuccessColor} shadow-md`}
          title={translate("add_employee")}
        >
          <UserPlus size={20} className="mr-2" />
          {translate("add_employee")}
        </motion.button>
      </div>

      {/* Employees table */}
      <div className={`rounded-lg scrollbar-custom overflow-x-auto shadow-lg border ${tableBorderColor}`}>
        <AnimatePresence mode="wait" initial={false}>
          {loading || localLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
              <p className={`mt-4 text-lg ${_text_color}`}>{translate("loading_data")}</p>
            </motion.div>
          ) : employees.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <User size={48} className={`${_text_color} opacity-40`} />
              <p className={`mt-4 text-lg ${_text_color}`}>
                {translate("no_employees_found_for_position", { position })}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddNew}
                className={`mt-4 px-4 py-2 rounded-md ${buttonPrimaryColor} shadow-md flex items-center`}
              >
                <UserPlus size={20} className="mr-2" />
                {translate("add_employee")}
              </motion.button>
            </motion.div>
          ) : (
            <motion.table
              key="table"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className={`w-full ${tableBgColor} border-collapse`}
            >
              <thead className={`${tableHeaderBg} sticky top-0 z-10`}>
                <tr className={`border-b ${tableBorderColor}`}>
                  <th className="w-10 py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selected.length === employees.length && employees.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="w-12 py-3 px-4 text-left">{translate("photo")}</th>
                  <th className="py-3 px-4 text-left">{translate("full_name")}</th>
                  <th className="py-3 px-4 text-left">{translate("gender")}</th>
                  <th className="py-3 px-4 text-left">{translate("contact")}</th>
                  <th className="py-3 px-4 text-left">{translate("birth_date")}</th>
                  <th className="py-3 px-4 text-left">{translate("employee_id")}</th>
                  <th className="py-3 px-4 text-left">{translate("status")}</th>
                  <th className="py-3 px-4 text-left">{translate("positions")}</th>
                  <th className="py-3 px-4 text-left">{translate("service_start_date")}</th>
                  <th className="py-3 px-4 text-left">{translate("service_end_date")}</th>
                  {position === 'Professeurs' && (
                    <>
                      <th className="py-3 px-4 text-left">{translate("type")}</th>
                      <th className="py-3 px-4 text-left">{translate("specialty")}</th>
                      <th className="py-3 px-4 text-left">{translate("classes")}</th>
                      <th className="py-3 px-4 text-left">{translate("salary")}</th>
                    </>
                  )}
                  {position !== 'Professeurs' && (
                    <th className="py-3 px-4 text-left">{translate("monthly_salary")}</th>
                  )}
                  <th className="py-3 px-4 text-left">{translate("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    variants={rowVariants}
                    className={`border-b ${tableBorderColor} ${tableRowHoverBg} ${tableBgColor}`}
                    // whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(employee.id)}
                        onChange={() => toggleSelectEmployee(employee.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{employee.name_complet}</td>
                    <td className="py-3 px-4">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.sexe === 'M' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {employee.sexe === 'M' ? translate("male") : translate("female")}
                      </span>
                    </td>
                    <td className="py-3 px-4">{employee.contact}</td>
                    <td className="py-3 px-4">{formatDate(employee.birth_date)}</td>
                    <td className="py-3 px-4">{employee.matricule || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === 'actif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {employee.status === 'actif' ? translate("active") : translate("inactive")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {employee.postes.map((poste, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${poste === position
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {poste}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatDate(employee.service_started_at)}</td>
                    <td className="py-3 px-4">{employee.service_ended_at === "" ? translate("indefinite") : formatDate(employee.service_ended_at)}
                    </td>
                    {position === 'Professeurs' && (
                      <>
                        <td className="py-3 px-4">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.proffesseur_config.is_permanent 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {employee.proffesseur_config.is_permanent ? translate("permanent") : translate("part_time")}
                          </span>
                        </td>
                        <td className="py-3 px-4">{employee.proffesseur_config.speciality}</td>
                        <td className="py-3 px-4">
                          {employee.classes && employee.classes.length > 0 ? (
                            <div className="relative">
                              {!expandedClassRows[employee.id] ? (
                                <div 
                                  className="text-center flex items-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 p-1 rounded transition-colors"
                                  onClick={() => toggleExpandClasses(employee.id)}
                                >
                                  {(() => {
                                    const firstClass = database?.classes?.find(c => c.id === employee.classes[0]);
                                    if (!firstClass) return <span className="text-gray-400 text-xs">{translate("no_class")}</span>;
                                    
                                    const className = getClasseName(`${firstClass.level} ${firstClass.name}`.trim(), language);
                                    return (
                                      <>
                                        <span className="text-center inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                          {className}
                                        </span>
                                        {employee.classes.length > 1 && (
                                          <span className="text-xs font-medium text-blue-600 flex items-center">
                                            <ChevronRight size={14} className="mr-1" />
                                            +{employee.classes.length - 1} {translate("others")}
                                          </span>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div>
                                  <div 
                                    className="text-center flex items-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 p-1 rounded transition-colors mb-2"
                                    onClick={() => toggleExpandClasses(employee.id)}
                                  >
                                    <span className="text-xs font-medium text-blue-600 flex items-center">
                                      <ChevronDown size={14} className="mr-1" />
                                      {translate("classes")} ({employee.classes.length})
                                    </span>
                                  </div>
                                  <div className="text-center grid grid-cols-1 gap-1 max-w-xs p-2 bg-blue-50 rounded-md border border-blue-100 animate-fadeIn">
                                    {employee.classes.map(classId => {
                                      const classInfo = database?.classes?.find(c => c.id === classId);
                                      if (!classInfo) return null;
                                      
                                      const className = getClasseName(`${classInfo.level} ${classInfo.name}`.trim(), language);
                                      return (
                                        <span 
                                          key={classId}
                                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-blue-800 border border-blue-200"
                                        >
                                          {className}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">{translate("no_class")}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {employee.proffesseur_config.is_permanent 
                            ? `${formatCurrency(employee.proffesseur_config.salaire_monthly)}/${translate("month")}`
                            : `${formatCurrency(employee.proffesseur_config.salaire_hourly)}/${translate("hour")}`}
                        </td>
                      </>
                    )}
                    {position !== 'Professeurs' && (
                      <td className="py-3 px-4">
                        {`${formatCurrency(employee.others_employe_config.salaire_monthly)}/${translate("month")}`}
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div className="mx-auto text-center">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(employee)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>

      {/* Selection indicator */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-blue-600 px-4 py-2 rounded-lg shadow-lg text-white flex items-center">
              <span className="font-medium">
                {translate("employees_selected", { count: selected.length })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md mx-auto`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${_text_color}`}>{confirmModal.title}</h3>
              <p className={`${_text_color} mb-6`}>{confirmModal.message}</p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmModal(null)}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${_text_color}`}
                >
                  {translate("cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-md text-white ${confirmModal.type === 'delete'
                    ? buttonDeleteColor
                    : confirmModal.type === 'activate'
                      ? buttonSuccessColor
                      : buttonWarningColor
                    }`}
                >
                  {translate("confirm")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesList;