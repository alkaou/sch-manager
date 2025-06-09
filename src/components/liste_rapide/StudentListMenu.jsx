import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, FileText, Clock, Calendar, Users, Briefcase } from 'lucide-react';
import ActionConfirmePopup from '../ActionConfirmePopup.jsx';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const StudentListMenu = ({
  studentLists,
  onCreateNew,
  onEditList,
  onDeleteList,
  theme,
  textClass
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'students', 'employees'

  // Sort lists by updatedAt (most recent first)
  const sortedLists = [...studentLists].sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Filter lists by type
  const filteredLists = sortedLists.filter(list => {
    if (filterType === 'all') return true;
    return list.listType === filterType;
  });

  // Count list types
  const studentListsCount = studentLists.filter(list => list.listType === 'students' || !list.listType).length;
  const employeeListsCount = studentLists.filter(list => list.listType === 'employees').length;

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (listToDelete) {
      onDeleteList(listToDelete.id);
      setShowConfirmDelete(false);
      setListToDelete(null);
    }
  };

  // Handle edit name
  const handleEditName = (list) => {
    setEditingName(list.id);
    setNewName(list.name);
  };

  // Handle save name
  const handleSaveName = (list) => {
    if (newName.trim()) {
      const updatedList = { ...list, name: newName };
      onEditList(updatedList);
      setEditingName(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return "Date inconnue";
    }
  };

  // Get the list type icon and label
  const getListTypeInfo = (list) => {
    if (list.listType === 'employees') {
      return { 
        icon: <Briefcase size={16} className="mr-1" />, 
        label: "Liste d'employés" 
      };
    } else {
      return { 
        icon: <Users size={16} className="mr-1" />, 
        label: "Liste d'élèves" 
      };
    }
  };

  // Styles based on theme
  const cardBgColor = theme === "dark" ? `bg-gray-800 ${textClass}` : "bg-white text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700";
  const buttonDanger = "bg-red-600 hover:bg-red-700";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700";
  const filterButtonActive = "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white";
  const filterButtonInactive = "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";
  const some_text_color = theme === "dark" ? textClass : "text-gray-700";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${textClass}`}>Gestion des listes</h1>
          <p className={`${textClass} opacity-75`}>
            {studentListsCount} liste(s) d'élèves, {employeeListsCount} liste(s) d'employés
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              className={`px-3 py-2 flex items-center ${filterType === 'all' ? filterButtonActive : filterButtonInactive}`}
              onClick={() => setFilterType('all')}
              title="Afficher toutes les listes"
            >
              <FileText size={16} className="mr-1" />
              Toutes
            </button>
            <button
              className={`px-3 py-2 flex items-center ${filterType === 'students' ? filterButtonActive : filterButtonInactive}`}
              onClick={() => setFilterType('students')}
              title="Afficher les listes d'élèves"
            >
              <Users size={16} className="mr-1" />
              Élèves
            </button>
            <button
              className={`px-3 py-2 flex items-center ${filterType === 'employees' ? filterButtonActive : filterButtonInactive}`}
              onClick={() => setFilterType('employees')}
              title="Afficher les listes d'employés"
            >
              <Briefcase size={16} className="mr-1" />
              Employés
            </button>
          </div>
          
          <motion.button
            className={`${buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
            onClick={onCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Créer une nouvelle liste"
          >
            <Plus size={20} />
            <span>Nouvelle liste</span>
          </motion.button>
        </div>
      </div>

      {filteredLists.length === 0 ? (
        <div className={`${cardBgColor} rounded-lg p-8 text-center ${borderColor} border`}>
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className={`text-xl font-semibold mb-2 ${textClass}`}>
            {filterType === 'students' 
              ? "Aucune liste d'élèves"
              : filterType === 'employees'
                ? "Aucune liste d'employés"
                : "Aucune liste disponible"
            }
          </h2>
          <p className={`opacity-75 mb-6 ${textClass}`}>
            Créez une nouvelle liste en cliquant sur le bouton "Nouvelle liste"
          </p>
          <motion.button
            className={`${buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto`}
            onClick={onCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Créer une nouvelle liste"
          >
            <Plus size={20} />
            <span>Nouvelle liste</span>
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => {
            const listTypeInfo = getListTypeInfo(list);
            const itemCount = list.listType === 'employees' ? list.employees?.length || 0 : list.students?.length || 0;
            
            return (
              <motion.div
                key={list.id}
                className={`${cardBgColor} ${borderColor} border rounded-xl shadow-md overflow-hidden flex flex-col transform transition-all duration-300`}
                whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.15)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="p-6 flex flex-col h-full">
                  {editingName === list.id ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-700"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Nom de la liste"
                        autoFocus
                      />
                      {!newName.trim() && (
                        <p className="text-red-500 text-sm mt-1">Le nom ne peut pas être vide</p>
                      )}
                      <div className="flex space-x-3 mt-3">
                        <motion.button
                          onClick={() => handleSaveName(list)}
                          disabled={!newName.trim()}
                          className={`${newName.trim() ? buttonPrimary : "bg-gray-400"} text-white px-4 py-2 rounded-lg flex-1 font-medium flex justify-center items-center`}
                          whileHover={newName.trim() ? { scale: 1.03 } : {}}
                          whileTap={newName.trim() ? { scale: 0.97 } : {}}
                          title="Enregistrer le nouveau nom"
                        >
                          Enregistrer
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingName(null)}
                          className={`${buttonSecondary} px-4 py-2 rounded-lg flex-1 font-medium flex justify-center items-center`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          title="Annuler le renommage"
                        >
                          Annuler
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <h2 className={`text-xl font-bold mb-3 line-clamp-2 ${some_text_color}`}>{list.name}</h2>
                  )}

                  <div className={`inline-flex items-center text-sm ${theme === "dark" ? "text-blue-400" : "text-blue-600"} mb-3 px-2.5 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 w-fit`}>
                    {listTypeInfo.icon}
                    <span className="font-medium">{listTypeInfo.label}</span>
                  </div>

                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">Modifié {formatDate(list.updatedAt)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">Créé le {new Date(list.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className={`flex items-center text-sm font-medium ${theme === "dark" ? "bg-gray-700/70" : "bg-gray-100"} px-2.5 py-1 rounded-full w-fit`}>
                      {list.listType === 'employees' ? (
                        <>
                          <Briefcase size={14} className={`mr-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                          <span className={`${some_text_color}`}>{itemCount} employé(s)</span>
                        </>
                      ) : (
                        <>
                          <Users size={14} className={`mr-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                          <span className={`${some_text_color}`}>{itemCount} élève(s)</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => onEditList(list)}
                      className={`${buttonPrimary} text-white px-3 py-2 rounded-lg flex items-center justify-center font-medium shadow-sm`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      title="Ouvrir la liste"
                    >
                      <FileText size={16} className="mr-1.5" />
                      Ouvrir
                    </motion.button>

                    {editingName !== list.id ? (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEditName(list)}
                          className={`${buttonSecondary} px-3 py-2 rounded-lg flex items-center justify-center flex-1`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          title="Renommer la liste"
                        >
                          <Edit size={16} />
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            setListToDelete(list);
                            setShowConfirmDelete(true);
                          }}
                          className={`${buttonDanger} text-white px-3 py-2 rounded-lg flex items-center justify-center flex-1`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          title="Supprimer la liste"
                        >
                          <Trash size={16} />
                        </motion.button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <ActionConfirmePopup
          isOpenConfirmPopup={showConfirmDelete}
          setIsOpenConfirmPopup={() => {
            setShowConfirmDelete(false);
            setListToDelete(null);
          }}
          handleConfirmeAction={handleConfirmDelete}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer la liste "${listToDelete?.name}" ? Cette action est irréversible.`}
          actionType="danger"
        />
      )}
    </div>
  );
};

export default StudentListMenu;