import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClasseName, delay } from '../../utils/helpers';
import { useLanguage } from '../contexts';

const PayementsSidebar = ({
  db,
  theme,
  app_bg_color,
  text_color,
  selectedClass,
  setSelectedClass,
  setActiveTab,
  setPaymentSystems,
  paymentSystems,
  selectedPaymentSystem,
  setSelectedPaymentSystem,
}) => {
  const { language } = useLanguage();
  const [expandedSystems, setExpandedSystems] = useState({});
  const [sortMethod, setSortMethod] = useState("date-desc"); // name-asc
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (db && db.paymentSystems) {
      setPaymentSystems(db.paymentSystems);

      // Initialize expanded state for each payment system
      const initialExpandedState = {};
      db.paymentSystems.forEach(system => {
        initialExpandedState[system.id] = false;
      });
      setExpandedSystems(initialExpandedState);
    } else {
      setPaymentSystems([]);
    }
  }, [db]);

  // Fonction pour compter les élèves dans une classe
  const countStudentsInClass = (className, classId, systemId) => {
    const the_system = `students_${systemId}_${classId}`;
    const sys_students = db.payments[the_system] || [];
    if(sys_students && sys_students.length > 0){
      return sys_students.length;
    }
    if (!db || !db.students) return 0;
    return db.students.filter(student =>
      student.classe === className && student.status === "actif"
    ).length;
  };

  // Toggle expanded state for a payment system
  const toggleExpanded = (systemId) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemId]: !prev[systemId]
    }));
  };

  // Fonction pour trier les systèmes de paiement
  const sortPaymentSystems = () => {
    if (!paymentSystems.length) return [];

    const sortedSystems = [...paymentSystems];

    switch (sortMethod) {
      case "name-asc":
        return sortedSystems.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedSystems.sort((a, b) => b.name.localeCompare(a.name));
      case "date-asc":
        return sortedSystems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "date-desc":
        return sortedSystems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sortedSystems;
    }
  };

  // Filtrer les systèmes de paiement par recherche
  const filteredPaymentSystems = sortPaymentSystems().filter(system => {
    return system.name.toLowerCase().includes(searchTerm.toLowerCase());
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
  const systemHeaderBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const systemHeaderHoverBgColor = theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200";
  const cardBgColor = theme === "dark" ? "bg-gray-750" : "bg-white";
  const cardBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";

  return (
    <div className={`h-full ${sidebarBgColor} overflow-hidden flex flex-col border-b-2 border-r-2 ${borderRightColor} shadow-md`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-xl mt-1 font-bold ${text_color} mb-4`}>Systèmes de paiement</h2>

        {hasPaymentSystems && (
          <>
            {/* Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un système..."
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
                <option value="date-desc">Date (récent → ancien)</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="date-asc">Date (ancien → récent)</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Liste des systèmes de paiement ou message */}
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
        ) : filteredPaymentSystems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className={`${text_color} font-medium mb-2`}>Aucun système trouvé</p>
            <p className={`${text_color} opacity-70 mb-4 text-sm`}>
              {searchTerm ? "Aucun système ne correspond à votre recherche." : "Veuillez ajouter des systèmes de paiement."}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(0)} // Rediriger vers l'onglet de configuration
                className={`px-4 py-2 rounded ${buttonBgColor} text-white`}
              >
                Configurer les paiements
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPaymentSystems.map((system) => {
              // Get classes for this payment system
              const _systemClasses = db?.classes?.filter(cls =>
                system.classes && system.classes.includes(cls.id)
              ) || [];
              const systemClasses = _systemClasses.sort((a, b) => b.level - a.level);

              return (
                <div
                  key={system.id}
                  className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 ${expandedSystems[system.id]
                    ? 'border-l-4 border-blue-500'
                    : `border ${cardBorderColor} hover:border-blue-400`
                    }`}
                  style={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff"
                  }}
                >
                  {/* Header section with system name as title */}
                  <div className={`w-full px-4 py-3 ${expandedSystems[system.id] ? 'bg-blue-50 dark:bg-gray-700' : ''}`}>
                    <div className={`font-bold text-lg mb-1 ${expandedSystems[system.id]
                      ? theme === "dark" ? 'text-blue-300' : 'text-blue-700'
                      : text_color
                      }`}>
                      {system.name}
                    </div>

                    {/* Button section with details */}
                    <motion.button
                      onClick={() => toggleExpanded(system.id)}
                      className={`w-full text-left 
                        flex justify-between items-center transition-all duration-300
                        py-2 rounded-md ${expandedSystems[system.id] ? 'bg-opacity-10' : ''}
                      `}
                      whileHover={{
                        backgroundColor: expandedSystems[system.id]
                          ? theme === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(219, 234, 254, 0.5)"
                          : theme === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.5)"
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 p-2 rounded-full ${expandedSystems[system.id]
                          ? theme === "dark" ? 'bg-blue-600' : 'bg-blue-500'
                          : theme === "dark" ? 'bg-gray-600' : 'bg-gray-200'
                          } transition-colors duration-300`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${expandedSystems[system.id] ? 'text-white' : theme === "dark" ? 'text-gray-300' : 'text-gray-600'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-80">
                            {new Date(system.startDate).toLocaleDateString()} - {new Date(system.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-full text-center text-xs font-medium mr-3 ${expandedSystems[system.id]
                          ? theme === "dark" ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                          : theme === "dark" ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700 border border-gray-300'
                          }`}>
                          {systemClasses.length} classes
                        </div>
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{
                            rotate: expandedSystems[system.id] ? 180 : 0,
                            backgroundColor: expandedSystems[system.id]
                              ? theme === "dark" ? 'rgba(37, 99, 235, 0.5)' : 'rgba(219, 234, 254, 1)'
                              : 'rgba(0, 0, 0, 0)'
                          }}
                          transition={{ duration: 0.3 }}
                          className={`p-1 rounded-full ${expandedSystems[system.id]
                            ? theme === "dark" ? 'bg-blue-800' : 'bg-blue-100'
                            : ''
                            }`}
                          style={{
                            backgroundColor: expandedSystems[system.id]
                              ? theme === "dark" ? 'rgba(37, 99, 235, 0.5)' : 'rgba(219, 234, 254, 1)'
                              : 'rgba(0, 0, 0, 0)'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${expandedSystems[system.id]
                            ? theme === "dark" ? 'text-blue-200' : 'text-blue-600'
                            : text_color
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {expandedSystems[system.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`overflow-hidden ${theme === "dark" ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        <div className={`p-3 space-y-2 ${theme === "dark" ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                          {systemClasses.length === 0 ? (
                            <div className={`text-center ${text_color} opacity-70 py-4 flex flex-col items-center`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-sm">
                                Aucune classe associée à ce système. Vous avez dû supprimer des classes.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2">
                              {systemClasses.map((cls) => {
                                const className = `${cls.level} ${cls.name}`.trim();
                                const isActive = selectedClass && selectedClass.id === cls.id
                                  && selectedPaymentSystem.id === system.id;
                                const studentCount = countStudentsInClass(className, cls.id, system.id);

                                return (
                                  <motion.div
                                    key={cls.id}
                                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="overflow-hidden rounded-lg"
                                  >
                                    <button
                                      onClick={() => {
                                        if (selectedClass?.id === cls.id && selectedPaymentSystem?.id === system.id) return;
                                        if (selectedClass?.id === cls.id) {
                                          // console.log(system);
                                          setSelectedClass(null);
                                          setSelectedPaymentSystem(null);
                                          delay(500).then(() => {
                                            // console.log("hello");
                                            setSelectedClass(cls);
                                            setSelectedPaymentSystem(system);
                                            if (!isActive) setActiveTab(-1);
                                          });
                                          return;
                                        }
                                        setSelectedClass(cls);
                                        setSelectedPaymentSystem(system);
                                        if (!isActive) setActiveTab(-1);
                                      }}
                                      className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-all duration-200 ${isActive
                                        ? `${activeClassBgColor} text-white shadow-md`
                                        : `${theme === "dark" ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} ${text_color}`
                                        }`}
                                    >
                                      <div className="flex items-center">
                                        <div className={`mr-3 p-1.5 rounded-full ${isActive
                                          ? 'bg-white bg-opacity-20'
                                          : theme === "dark" ? 'bg-gray-600' : 'bg-white'
                                          }`}>
                                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isActive ? 'text-white' : theme === "dark" ? 'text-gray-300' : 'text-gray-600'
                                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                          </svg>
                                        </div>
                                        <div>
                                          <span className="font-medium">{getClasseName(className, language)}</span>
                                          <span className="block text-xs opacity-80">Niveau {cls.level}</span>
                                        </div>
                                      </div>
                                      <div className={`flex items-center px-3 py-1 rounded-full ${isActive
                                        ? 'bg-white bg-opacity-20 text-white'
                                        : theme === "dark" ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border border-gray-300'
                                        }`}>
                                        <span className="text-sm font-semibold">{studentCount}</span>
                                        <span className="text-xs ml-1">élèves</span>
                                      </div>
                                    </button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
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