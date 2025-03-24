import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClasseName } from '../../utils/helpers';
import { useLanguage } from '../contexts';

const PayementsSidebar = ({
  db,
  theme,
  app_bg_color,
  text_color,
  selectedClass,
  setSelectedClass,
  setActiveTab
}) => {
  const { language } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [sortMethod, setSortMethod] = useState("level-asc");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (db && db.classes && db.paymentSystems) {
      // Get all class IDs that are in any payment system
      const classIdsWithPayment = new Set();
      db.paymentSystems.forEach(system => {
        if (system.classes && Array.isArray(system.classes)) {
          system.classes.forEach(classId => classIdsWithPayment.add(classId));
        }
      });
      
      // Filter classes to only include those with payment systems
      const classesWithPayment = db.classes.filter(cls => classIdsWithPayment.has(cls.id));
      setClasses(classesWithPayment);
    } else {
      setClasses([]);
    }
  }, [db]);
  
  // Fonction pour compter les élèves dans une classe
  const countStudentsInClass = (className) => {
    if (!db || !db.students) return 0;
    return db.students.filter(student => 
      student.classe === className && student.status === "actif"
    ).length;
  };
  
  // Fonction pour trier les classes
  const sortClasses = () => {
    if (!classes.length) return [];
    
    const sortedClasses = [...classes];
    
    switch (sortMethod) {
      case "level-asc":
        return sortedClasses.sort((a, b) => a.level - b.level);
      case "level-desc":
        return sortedClasses.sort((a, b) => b.level - a.level);
      case "name-asc":
        return sortedClasses.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedClasses.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedClasses;
    }
  };
  
  // Filtrer les classes par recherche
  const filteredClasses = sortClasses().filter(cls => {
    const className = `${cls.level} ${cls.name}`;
    return className.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Vérifier si des systèmes de paiement existent
  const hasPaymentSystems = db?.paymentSystems && db.paymentSystems.length > 0;
  
  // Styles en fonction du thème
  const sidebarBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const inputTextColor = theme === "dark" ? text_color : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const activeClassBgColor = theme === "dark" ? "bg-blue-700" : "bg-blue-500";
  const hoverClassBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const borderRightColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const buttonBgColor = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
  
  return (
    <div className={`h-full ${sidebarBgColor} overflow-hidden flex flex-col border-b-2 border-r-2 ${borderRightColor} shadow-md`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-xl font-bold ${text_color} mb-4`}>Classes</h2>
        
        {hasPaymentSystems && (
          <>
            {/* Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher une classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputTextColor} ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            {/* Options de tri */}
            <div className="mb-2">
              <label className={`block ${text_color} mb-1 text-sm`}>Trier par:</label>
              <select
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
                className={`w-full px-3 py-2 rounded ${inputBgColor} ${inputTextColor} ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="level-asc">Niveau (croissant)</option>
                <option value="level-desc">Niveau (décroissant)</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
              </select>
            </div>
          </>
        )}
      </div>
      
      {/* Liste des classes ou message */}
      <div className="flex-1 overflow-y-auto scrollbar-custom p-2">
        {!hasPaymentSystems ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`${text_color} font-medium mb-2`}>Aucun système de paiement configuré</p>
            <p className={`${text_color} opacity-70 mb-4 text-sm`}>
              Veuillez configurer votre système de paiement pour voir les classes.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(0)} // Rediriger vers l'onglet de configuration
              className={`px-4 py-2 rounded ${buttonBgColor} text-white`}
            >
              Configurer les paiements
            </motion.button>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className={`${text_color} font-medium mb-2`}>Aucune classe avec système de paiement</p>
            <p className={`${text_color} opacity-70 mb-4 text-sm`}>
              {searchTerm ? "Aucune classe ne correspond à votre recherche." : "Veuillez ajouter des classes à vos systèmes de paiement."}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(0)} // Rediriger vers l'onglet de configuration
                className={`px-4 py-2 rounded ${buttonBgColor} text-white`}
              >
                Configurer les classes
              </motion.button>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredClasses.map((cls) => {
              const className = `${cls.level} ${cls.name}`;
              const isActive = selectedClass && selectedClass.id === cls.id;
              const studentCount = countStudentsInClass(className);
              
              return (
                <motion.li
                  key={cls.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => {
                      setSelectedClass(isActive ? null : cls);
                      if (!isActive) setActiveTab(-1); // Désactiver les onglets quand une classe est sélectionnée
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-colors ${
                      isActive 
                        ? `${activeClassBgColor} text-white` 
                        : `${hoverClassBgColor} ${text_color}`
                    }`}
                  >
                    <div>
                      <span className="font-medium">{getClasseName(className, language)}</span>
                      <span className="block text-xs opacity-80">Niveau {cls.level}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold">{studentCount}</span>
                      <span className="text-xs opacity-80">élèves</span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Bouton pour revenir aux onglets */}
      {selectedClass && (
        <div className="p-3 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedClass(null);
              setActiveTab(0);
            }}
            className={`w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors`}
          >
            Retour aux onglets
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default PayementsSidebar;