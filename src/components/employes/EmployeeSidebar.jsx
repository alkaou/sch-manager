import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, Briefcase, Edit, Trash, Info } from 'lucide-react';
import { useTheme, useFlashNotification } from '../contexts';
import { deletePosition } from '../../utils/database_methods';

const EmployeeSidebar = ({ 
  positions, 
  selectedPosition, 
  setSelectedPosition,
  setShowAddPositionForm,
  setPositionToEdit,
  refreshData,
  database
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Toggle position description
  const toggleDescription = (positionId, e) => {
    e.stopPropagation();
    setExpandedDescriptions(prev => ({
      ...prev,
      [positionId]: !prev[positionId]
    }));
  };

  // Sort positions: Professeurs first, then by recency (newest first)
  const sortedPositions = [...positions].sort((a, b) => {
    if (a.name === 'Professeurs') return -1;
    if (b.name === 'Professeurs') return 1;
    return b.created_at - a.created_at;
  });

  // Filter positions based on search term
  const filteredPositions = sortedPositions.filter(
    position => position.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle position delete
  const handleDeletePosition = async (positionId) => {
    try {
      await deletePosition(positionId, database, setFlashMessage);
      setConfirmDelete(null);
      refreshData();
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      marginTop: 8,
      transition: { duration: 0.3 }
    }
  };

  // Get background color for sidebar
  const sidebarBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonColor = theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500';
  const _text_color = app_bg_color === gradients[1] ||
      app_bg_color === gradients[2] ||
      theme === "dark" ? text_color : "text-gray-700";
  const descriptionBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';

  // Format description for display with paragraph breaks
  const formatDescription = (description) => {
    if (!description) return null;
    return description.split('\n').map((line, index) => (
      <p key={index} className={`${_text_color} text-xs ${line.trim() ? '' : 'h-2'}`}>
        {line || ' '}
      </p>
    ));
  };

  return (
    <motion.div 
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className={`w-64 h-full ${sidebarBgColor} ${borderColor} border-r shadow-lg overflow-hidden flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className={`font-bold text-lg ${_text_color}`}>Postes</h2>
        <motion.button
          onClick={() => setShowAddPositionForm(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonColor} p-1 rounded-full`}
          title="Ajouter un poste"
        >
          <PlusCircle size={20} />
        </motion.button>
      </div>
      
      <div className="px-3 py-2">
        <div className={`flex items-center px-2 py-2 bg-gray-100 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Search size={18} className={`${_text_color} opacity-60`} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`ml-2 bg-transparent outline-none w-full ${_text_color}`}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 scrollbar-custom">
        <AnimatePresence>
          {filteredPositions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center p-4 ${_text_color} opacity-70`}
            >
              Aucun poste trouvé
            </motion.div>
          ) : (
            <ul className="space-y-1">
              {filteredPositions.map((position) => (
                <motion.li 
                  key={position.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredPosition(position.id)}
                  onMouseLeave={() => setHoveredPosition(null)}
                  className={`relative rounded-md overflow-hidden ${
                    selectedPosition === position.name 
                      ? theme === 'dark' ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100' 
                      : 'hover:bg-gray-100 hover:bg-opacity-30'
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSelectedPosition(position.name)}
                      className={`w-full p-3 text-left flex items-center justify-between ${_text_color}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Briefcase size={18} className={selectedPosition === position.name ? 'text-blue-500' : ''} />
                        <span className={selectedPosition === position.name ? 'font-semibold' : ''}>{position.name}</span>
                      </div>
                      
                      {/* Action buttons + description toggle if description exists */}
                      <div className="flex items-center">
                        
                        {/* Show actions on hover */}
                        <AnimatePresence>
                          {hoveredPosition === position.id && position.name !== 'Professeurs' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex space-x-1"
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPositionToEdit(position);
                                }}
                                className="text-blue-500 hover:text-blue-600 p-1 cursor-pointer"
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(position);
                                }}
                                className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash size={16} />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* description Shower Icon */}
                        {position.description && (
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => toggleDescription(position.id, e)}
                            className={`${buttonColor} p-1 ml-1`}
                            title={expandedDescriptions[position.id] ? "Masquer la description" : "Afficher la description"}
                          >
                            <Info size={16} />
                          </motion.button>
                        )}

                      </div>
                    </button>
                    
                    {/* Description collapsible section */}
                    <AnimatePresence>
                      {expandedDescriptions[position.id] && position.description && (
                        <motion.div
                          variants={descriptionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`mx-3 mb-2 rounded ${descriptionBgColor} border ${borderColor} text-sm`}
                        >
                          <div className={`
                            flex items-center border-b border-b-1 p-2
                            ${theme === "dark" ? "" : "bg-gray-200"}
                          `}>
                            <span className={`text-xs mb-1 font-medium ${_text_color} opacity-70`}>Description</span>
                          </div>
                          <div className="text-sm p-2">
                            {formatDescription(position.description.trim())}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
      
      {/* Confirmation dialog for deletion */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md mx-auto`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${_text_color}`}>Confirmer la suppression</h3>
              <p className={`${_text_color} mb-6`}>
                Êtes-vous sûr de vouloir supprimer le poste "{confirmDelete.name}" ?
                {confirmDelete.employeeCount > 0 && (
                  <span className="text-red-500 block mt-2 font-semibold">
                    Attention: {confirmDelete.employeeCount} employé(s) occupent ce poste.
                    <br />
                    - Les employés occupant uniquement ce poste seront supprimés
                    - Ce poste sera retiré des autres employés qui l'occupent
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmDelete(null)}
                  className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${_text_color}`}
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeletePosition(confirmDelete.id)}
                  disabled={false}
                  className={`px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600`}
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployeeSidebar; 