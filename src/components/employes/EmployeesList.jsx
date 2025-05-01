import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit, Trash, CheckCircle, XCircle, UserPlus, RefreshCw } from 'lucide-react';
import { useTheme, useFlashNotification } from '../contexts';
import { deleteEmployee, activateEmployee, deactivateEmployee } from '../../utils/database_methods';
import { formatDate, formatCurrency } from './utils';

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

  const [selected, setSelected] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  
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

  // Status operations
  const handleActivateSelected = () => {
    setConfirmModal({
      type: 'activate',
      title: 'Activer les employés',
      message: 'Voulez-vous activer les employés sélectionnés?',
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
      title: 'Désactiver les employés',
      message: 'Voulez-vous désactiver les employés sélectionnés?',
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
      title: 'Supprimer les employés',
      message: `Voulez-vous supprimer définitivement ${selected.length > 1 ? 'les' : 'l\''} employé${selected.length > 1 ? 's' : ''} sélectionné${selected.length > 1 ? 's' : ''}?`,
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

  // Theme styling
  const tableBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const tableBorderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const tableRowHoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const buttonDeleteColor = "bg-red-600 hover:bg-red-700 text-white";
  const buttonSuccessColor = "bg-green-600 hover:bg-green-700 text-white";
  const buttonWarningColor = "bg-yellow-500 hover:bg-yellow-600 text-white";
  const buttonPrimaryColor = "bg-blue-600 hover:bg-blue-700 text-white";
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

  const handleRefreshData = async () => {
    setLocalLoading(true);
    await refreshData();
    setTimeout(() => setLocalLoading(false), 300);
  };

  return (
    <div className={`relative ${_text_color}`}>
      {/* Action bar */}
      <div className="mb-4 flex gap-2 justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefreshData}
          className={`p-2 rounded-full ${buttonPrimaryColor} shadow-md`}
          disabled={loading || localLoading}
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
            >
              <Trash size={20} />
            </motion.button>

            {allActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeactivateSelected}
                className={`p-2 rounded-full ${buttonWarningColor} shadow-md`}
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
                >
                  <CheckCircle size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeactivateSelected}
                  className={`p-2 rounded-full ${buttonWarningColor} shadow-md`}
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
        >
          <UserPlus size={20} />
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
              <p className={`mt-4 text-lg ${_text_color}`}>Chargement des données...</p>
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
                Aucun employé trouvé pour le poste "{position}"
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddNew}
                className={`mt-4 px-4 py-2 rounded-md ${buttonPrimaryColor} shadow-md flex items-center`}
              >
                <UserPlus size={20} className="mr-2" />
                Ajouter un employé
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
                  <th className="w-12 py-3 px-4 text-left">Photo</th>
                  <th className="py-3 px-4 text-left">Nom complet</th>
                  <th className="py-3 px-4 text-left">Sexe</th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th className="py-3 px-4 text-left">Date de naissance</th>
                  <th className="py-3 px-4 text-left">Matricule</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Postes</th>
                  <th className="py-3 px-4 text-left">Début service</th>
                  <th className="py-3 px-4 text-left">Fin service</th>
                  {position === 'Professeurs' && (
                    <>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Spécialité</th>
                      <th className="py-3 px-4 text-left">Salaire</th>
                    </>
                  )}
                  {position !== 'Professeurs' && (
                    <th className="py-3 px-4 text-left">Salaire mensuel</th>
                  )}
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    variants={rowVariants}
                    className={`border-b ${tableBorderColor} ${tableRowHoverBg} ${tableBgColor}`}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
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
                    <td className="py-3 px-4">{employee.sexe}</td>
                    <td className="py-3 px-4">{employee.contact}</td>
                    <td className="py-3 px-4">{formatDate(employee.birth_date)}</td>
                    <td className="py-3 px-4">{employee.matricule || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === 'actif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {employee.status === 'actif' ? 'Actif' : 'Inactif'}
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
                    <td className="py-3 px-4">{employee.service_ended_at === "" ? "Indéfinie" : formatDate(employee.service_ended_at)}
                    </td>
                    {position === 'Professeurs' && (
                      <>
                        <td className="py-3 px-4">
                          {employee.proffesseur_config.is_permanent ? 'Permanent' : 'Vacataire'}
                        </td>
                        <td className="py-3 px-4">{employee.proffesseur_config.speciality}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {employee.proffesseur_config.is_permanent
                              ? formatCurrency(employee.proffesseur_config.salaire_monthly) + '/mois'
                              : formatCurrency(employee.proffesseur_config.salaire_hourly) + '/heure'
                            }
                          </div>
                        </td>
                      </>
                    )}
                    {position !== 'Professeurs' && (
                      <td className="py-3 px-4">
                        {formatCurrency(employee.others_employe_config.salaire_monthly)}
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
            <div className="bg-blue-600 px-4 py-2 rounded-lg shadow-lg flex items-center">
              <span className="font-medium">{selected.length} employé(s) sélectionné(s)</span>
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
                  Annuler
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
                  Confirmer
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