import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, FileText, Clock, Calendar } from 'lucide-react';
import ActionConfirmePopup from '../ActionConfirmePopup.jsx';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const StudentListMenu = ({
  studentLists,
  onCreateNew,
  onEditList,
  onDeleteList,
  theme,
  textClass,
  appBgColor
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');

  // Sort lists by updatedAt (most recent first)
  const sortedLists = [...studentLists].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

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
    if (newName.length >= 6 && newName.length <= 60) {
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

  // Styles based on theme
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700";
  const buttonDanger = "bg-red-600 hover:bg-red-700";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${textClass}`}>Listes d'élèves</h1>
        <motion.button
          className={`${buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
          onClick={onCreateNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Nouvelle liste</span>
        </motion.button>
      </div>

      {sortedLists.length === 0 ? (
        <div className={`${cardBgColor} rounded-lg p-8 text-center ${borderColor} border`}>
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className={`text-xl font-semibold mb-2 ${textClass}`}>Aucune liste d'élèves</h2>
          <p className={`${textClass} opacity-75 mb-6`}>
            Créez votre première liste d'élèves en cliquant sur le bouton "Nouvelle liste"
          </p>
          <motion.button
            className={`${buttonPrimary} text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto`}
            onClick={onCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Nouvelle liste</span>
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLists.map((list) => (
            <motion.div
              key={list.id}
              className={`${cardBgColor} ${borderColor} border rounded-lg shadow-sm overflow-hidden`}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5">
                {editingName === list.id ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className={`w-full px-3 py-2 rounded border ${borderColor} ${theme === "dark" ? "bg-gray-700" : "bg-white"} ${textClass}`}
                      placeholder="Nom de la liste (6-60 caractères)"
                      minLength={6}
                      maxLength={60}
                      autoFocus
                    />
                    {newName.length < 6 && (
                      <p className="text-red-500 text-sm mt-1">Le nom doit contenir au moins 6 caractères</p>
                    )}
                    <div className="flex space-x-2 mt-2">
                      <motion.button
                        onClick={() => handleSaveName(list)}
                        disabled={newName.length < 6}
                        className={`${newName.length >= 6 ? buttonPrimary : "bg-gray-400"} text-white px-3 py-1 rounded`}
                        whileHover={newName.length >= 6 ? { scale: 1.05 } : {}}
                        whileTap={newName.length >= 6 ? { scale: 0.95 } : {}}
                      >
                        Enregistrer
                      </motion.button>
                      <motion.button
                        onClick={() => setEditingName(null)}
                        className={`${buttonSecondary} text-gray-800 dark:text-white px-3 py-1 rounded`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <h2 className={`text-xl font-semibold mb-2 ${textClass}`}>{list.name}</h2>
                )}
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Clock size={16} className="mr-1" />
                  <span>Modifié {formatDate(list.updatedAt)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar size={16} className="mr-1" />
                  <span>Créé le {new Date(list.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <motion.button
                    onClick={() => onEditList(list)}
                    className={`${buttonPrimary} text-white px-3 py-2 rounded flex items-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileText size={16} className="mr-1" />
                    Ouvrir
                  </motion.button>
                  
                  {editingName !== list.id && (
                    <motion.button
                      onClick={() => handleEditName(list)}
                      className={`${buttonSecondary} text-gray-800 dark:text-white px-3 py-2 rounded flex items-center`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit size={16} className="mr-1" />
                      Renommer
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => {
                      setListToDelete(list);
                      setShowConfirmDelete(true);
                    }}
                    className={`${buttonDanger} text-white px-3 py-2 rounded flex items-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash size={16} className="mr-1" />
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ActionConfirmePopup
        isOpenConfirmPopup={showConfirmDelete}
        setIsOpenConfirmPopup={() => setShowConfirmDelete(false)}
        handleConfirmeAction={handleConfirmDelete}
        title="Supprimer la liste"
        message={`Êtes-vous sûr de vouloir supprimer la liste "${listToDelete?.name}" ? Cette action est irréversible.`}
        actionType="danger"
      />
    </div>
  );
};

export default StudentListMenu;