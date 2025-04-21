import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Check, CheckSquare, Square } from 'lucide-react';
// Remove the import if it's causing issues
import { getClasseName } from '../../utils/helpers';

const StudentListAddStudents = ({
  db,
  onClose,
  onAddStudents,
  theme,
  currentStudents = [] // Add this prop to receive currently selected students
}) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  
  // Load students from database and initialize selected students
  useEffect(() => {
    if (db && db.students) {
      setStudents(db.students.filter(student => student.active !== false));
      
      // Pre-select students that are already in the list
      if (currentStudents && currentStudents.length > 0) {
        const preSelectedStudents = db.students.filter(student => 
          currentStudents.some(s => s.id === student.id)
        );
        // console.log('Pre-selected students:', currentStudents);
        setSelectedStudents(preSelectedStudents);
      }
    }
  }, [db, currentStudents]);
  
  // Handle select all students
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents);
    }
  };
  
  // Handle select a student
  const handleSelectStudent = (student) => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };
  
  // Handle add selected students
  const handleAddStudents = () => {
    onAddStudents(selectedStudents);
  };
  
  // Get unique class IDs from the classes array in the database
  const classIds = db?.classes ? [...new Set(db.classes.map(c => c.id))] : [];
  
  // Get unique levels from the classes array in the database
  const levels = db?.classes ? [...new Set(db.classes.map(c => c.level))] : [];
  
  // Filter students based on search term, class, and level
  const filteredStudents = students.filter(student => {
    // Filter by search term
    const searchMatch = 
      searchTerm === '' || 
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by class
    const classMatch = selectedClass === 'all' || (() => {
      // Find the class object that matches the student's class
      const classObj = db?.classes?.find(c => {
        // Format the class name to match the student's class format (e.g., "4 A")
        const className = `${c.level} ${c.name}`.trim();
        return student.classe === className;
      });
      return classObj ? classObj.id === selectedClass : false;
    })();
    
    // Filter by level
    const levelMatch = selectedLevel === 'all' || (() => {
      // Extract level from student's class (e.g., "4" from "4 A")
      const studentLevel = student.classe ? parseInt(student.classe.split(' ')[0]) : null;
      return studentLevel === parseInt(selectedLevel);
    })();
    
    return searchMatch && classMatch && levelMatch;
  });
  
  // Styles based on theme
  const textClass = theme === "dark" ? "text-white" : "text-gray-700";
  const modalBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const buttonSecondary = theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";
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
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textClass}`}>Ajouter des élèves à la liste</h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>
        
        {/* Filters */}
        <div className={`p-4 border-b ${borderColor} flex flex-wrap gap-4`}>
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className={`flex items-center border ${borderColor} rounded-lg overflow-hidden ${inputBgColor}`}>
              <Search size={20} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un élève..."
                className={`flex-1 p-2 outline-none ${inputBgColor} ${textClass}`}
              />
            </div>
          </div>
          
          {/* Class filter - Modified to avoid using getClasseName */}
          <div className="w-64">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full p-2 border ${borderColor} rounded-lg ${inputBgColor} ${textClass}`}
            >
              <option value="all">Toutes les classes</option>
              {db?.classes?.sort((a, b) => a.level - b.level).map(classObj => (
                <option key={classObj.id} value={classObj.id}>
                  {getClasseName(`${classObj.level} ${classObj.name}`)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Level filter */}
          <div className="w-64">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={`w-full p-2 border ${borderColor} rounded-lg ${inputBgColor} ${textClass}`}
            >
              <option value="all">Tous les niveaux</option>
              {levels.sort((a, b) => a - b).map(level => (
                <option key={level} value={level}>
                  Niveau {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Students list */}
        <div className="flex-1 overflow-y-auto scrollbar-custom p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleSelectAll}
                className={`p-2 rounded-lg mr-2 ${buttonSecondary} flex items-center`}
              >
                {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ? (
                  <CheckSquare size={20} className="mr-2" />
                ) : (
                  <Square size={20} className="mr-2" />
                )}
                {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
                  ? "Désélectionner tout"
                  : "Sélectionner tout"}
              </button>
              <span className={`${textClass}`}>
                {selectedStudents.length} élève(s) sélectionné(s) sur {filteredStudents.length} affiché(s)
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => {
              const isSelected = selectedStudents.some(s => s.id === student.id);
              
              return (
                <motion.div
                  key={student.id}
                  className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4 cursor-pointer ${
                    isSelected ? (theme === "dark" ? "ring-2 ring-blue-500" : "ring-2 ring-blue-500") : ""
                  }`}
                  onClick={() => handleSelectStudent(student)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${isSelected ? "bg-blue-500" : theme === "dark" ? "bg-gray-600" : "bg-gray-200"} mr-3`}>
                      {isSelected ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <div className="w-5 h-5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${textClass}`}>
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                        {getClasseName(student.classe) || 'Classe non assignée'}
                      </p>
                      {student.matricule && (
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                          Matricule: {student.matricule}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredStudents.length === 0 && (
              <div className={`col-span-3 text-center p-8 ${textClass}`}>
                <p className="text-lg">Aucun élève trouvé</p>
                <p className="opacity-75">Essayez de modifier vos filtres de recherche</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t ${borderColor} flex justify-end space-x-3`}>
          <motion.button
            onClick={onClose}
            className={`${buttonSecondary} px-4 py-2 rounded-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Annuler
          </motion.button>
          <motion.button
            onClick={handleAddStudents}
            disabled={selectedStudents.length === 0}
            className={`${selectedStudents.length > 0 ? buttonSuccess : "bg-green-400"} px-4 py-2 rounded-lg text-white flex items-center`}
            whileHover={selectedStudents.length > 0 ? { scale: 1.05 } : {}}
            whileTap={selectedStudents.length > 0 ? { scale: 0.95 } : {}}
          >
            <Check size={20} className="mr-2" />
            Ajouter {selectedStudents.length} élève(s)
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentListAddStudents;