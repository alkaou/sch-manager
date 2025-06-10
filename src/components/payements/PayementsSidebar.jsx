import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClasseName, delay } from '../../utils/helpers';
import { useLanguage } from '../contexts';
import { gradients } from '../../utils/colors';

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
  const [isYearExpired, setIsYearExpired] = useState([]);

  // Apply the color logic you provided
  const _text_color = text_color;

  // Enhanced styling variables
  const sidebarBgColor = app_bg_color;


  const inputBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputTextColor = theme === "dark" ? _text_color : "text-gray-700";
  const inputBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const expiredBadgeBgColor = theme === "dark" ? "bg-red-900" : "bg-red-100";
  const expiredBadgeTextColor = theme === "dark" ? "text-red-200" : "text-red-800";

  const isWhiteOrGray = app_bg_color === gradients[1] || app_bg_color === gradients[2] ? true : false;

  const activeClassBgColor = theme === "dark"
    ? "bg-gradient-to-r from-blue-700 to-indigo-800"
    : "bg-gradient-to-r from-blue-500 to-indigo-600";

  const borderColor = app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "border-gray-400" : "border-white";

  const buttonBgColor = theme === "dark"
    ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";

  const cardShadow = "shadow-lg hover:shadow-xl transition-shadow duration-300";

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

  // Check for expired years whenever paymentSystems changes
  useEffect(() => {
    if (paymentSystems && paymentSystems.length > 0) {
      const expiredSystems = [];
      paymentSystems.forEach(system => {
        const endDate = new Date(system.endDate);
        const currentDate = new Date();
        if (endDate < currentDate) {
          expiredSystems.push(system.id);
        }
      });
      setIsYearExpired(expiredSystems);
    }
  }, [paymentSystems]);

  // Fonction pour compter les élèves dans une classe
  const countStudentsInClass = (className, classId, systemId) => {
    const the_system = `students_${systemId}_${classId}`;
    const sys_students = db.payments[the_system] || [];
    if (sys_students && sys_students.length > 0) {
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

  return (
    <div
      className={`h-full ${sidebarBgColor} flex flex-col border-b border-r border-r-2 ${borderColor} rounded-lg`}>

      <div
        style={{ height: "100vh" }}
        className="mt-12 overflow-y-auto scrollbar-custom scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >

        {/* Header Section with Glass Effect */}
        <div className={`backdrop-filter backdrop-blur-sm bg-opacity-90 p-3 sm:p-4 md:p-5 border-b ${borderColor}`}>
          <h2 className={`text-base sm:text-lg md:text-xl font-bold ${_text_color} mb-2 sm:mb-3 md:mb-4 flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Systèmes de paiement
          </h2>

          {hasPaymentSystems && (
            <>
              {/* Search bar with enhanced design */}
              <div className="mb-3 sm:mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un système..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-7 sm:pl-9 md:pl-10 pr-2 sm:pr-3 md:pr-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                />
              </div>

              {/* Sort options with enhanced design */}
              <div className="mb-2">
                <label className={`block ${_text_color} mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium`}>Trier par:</label>
                <div className="relative">
                  <select
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value)}
                    className={`w-full pl-2 sm:pl-3 md:pl-4 pr-7 sm:pr-8 md:pr-10 py-1.5 sm:py-2 md:py-2.5 rounded-lg appearance-none text-xs sm:text-sm ${inputBgColor} ${inputTextColor} border ${inputBorderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                  >
                    <option value="date-desc">Date (récent → ancien)</option>
                    <option value="name-asc">Nom (A-Z)</option>
                    <option value="name-desc">Nom (Z-A)</option>
                    <option value="date-asc">Date (ancien → récent)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment systems list with enhanced design */}
        <div className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4">
          {!hasPaymentSystems ? (
            <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 md:p-6 text-center">
              <div className={`p-3 sm:p-4 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-blue-100"} mb-3 sm:mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={`${_text_color} font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2`}>Aucun système de paiement configuré</p>
              <p className={`${_text_color} opacity-80 mb-4 sm:mb-6 text-xs sm:text-sm max-w-xs`}>
                Veuillez configurer votre système de paiement pour voir les classes.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(0)}
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg ${buttonBgColor} text-white text-xs sm:text-sm font-medium shadow-md`}
              >
                Configurer les paiements
              </motion.button>
            </div>
          ) : filteredPaymentSystems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 md:p-6 text-center">
              <div className={`p-3 sm:p-4 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-blue-100"} mb-3 sm:mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className={`${_text_color} font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2`}>Aucun système trouvé</p>
              <p className={`${_text_color} opacity-80 mb-4 sm:mb-6 text-xs sm:text-sm max-w-xs`}>
                {searchTerm ? "Aucun système ne correspond à votre recherche." : "Veuillez ajouter des systèmes de paiement."}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(0)}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg ${buttonBgColor} text-white text-xs sm:text-sm font-medium shadow-md`}
                >
                  Configurer les paiements
                </motion.button>
              )}
            </div>
          ) : (
            <div className={`space-y-3 sm:space-y-4 md:space-y-5 ${sidebarBgColor}`}>
              {filteredPaymentSystems.map((system) => {
                // Get classes for this payment system
                const _systemClasses = db?.classes?.filter(cls =>
                  system.classes && system.classes.includes(cls.id)
                ) || [];
                const systemClasses = _systemClasses.sort((a, b) => b.level - a.level);

                return (
                  <div
                    key={system.id}
                    className={`rounded-xl overflow-hidden ${cardShadow} transition-all duration-300 ${expandedSystems[system.id]
                      ? 'border-l-4 border-blue-500'
                      : `${isWhiteOrGray || theme === "dark" ? "border-2 border-gray-300" : "border-2 border-white"}`
                      } `}
                  >
                    {/* Header section with system name as title - Glass morphism effect */}
                    <div
                      className={`
                      w-full px-2 py-1.5 sm:px-2 sm:py-2 ${sidebarBgColor} 
                      ${expandedSystems[system.id]}
                      ${isWhiteOrGray || theme === "dark" ? "border-2 border-gray-300" : "border-2 border-white"}
                      ${isWhiteOrGray ? "hover:bg-green-50" : theme === "dark" ? "hover:bg-gray-700" : ""
                        }`}
                    >

                      {isYearExpired.includes(system.id) && (
                        <span className={`px-1.5 sm:px-2 rounded-full text-2xs sm:text-xs font-medium ${expiredBadgeBgColor} ${expiredBadgeTextColor}`}>
                          Année Expirée
                        </span>
                      )}

                      <div className={`font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 ${_text_color} ${expandedSystems[system.id]}`}>
                        {system.name}
                      </div>

                      {/* Button section with details - Enhanced with better spacing and icons */}
                      <motion.button
                        onClick={() => toggleExpanded(system.id)}
                        className={`w-full text-left 
                        flex justify-between items-center transition-all duration-300
                        py-1.5 sm:py-2 md:py-2.5 rounded-lg ${expandedSystems[system.id] ? 'bg-opacity-10' : ''}
                      `}
                      >
                        <div className="flex items-center mr-1">
                          <div className={`mr-2 sm:mr-3 p-1.5 sm:p-2 md:p-2.5 rounded-full ${expandedSystems[system.id]
                            ? theme === "dark"
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : theme === "dark"
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            } transition-colors duration-300 shadow-sm`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${expandedSystems[system.id] ? 'text-white' : theme === "dark" ? 'text-gray-200' : 'text-gray-200'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-2xs sm:text-xs ${_text_color} font-medium`}>
                              {new Date(system.startDate).toLocaleDateString()} - {new Date(system.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">

                          {/* Classes count by system */}
                          <div className='px-0.5 sm:px-1'>
                            <div className={`
                            py-1 px-1 rounded-full text-center text-2xs sm:text-xs 
                            font-medium mr-2 sm:mr-3 bg-gradient-to-r from-blue-600 to-indigo-700 
                            text-white
                          `}>
                              {systemClasses.length} classes
                            </div>
                          </div>

                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{
                              rotate: expandedSystems[system.id] ? 180 : 0,
                              backgroundColor: expandedSystems[system.id]
                                ? theme === "dark" ? 'rgba(37, 99, 235, 0.3)' : 'rgba(219, 234, 254, 1)'
                                : 'rgba(0, 0, 0, 0)'
                            }}
                            transition={{ duration: 0.3 }}
                            className={`p-1 sm:p-1.5 rounded-full ${expandedSystems[system.id]
                              ? theme === "dark" ? 'bg-blue-800/30' : 'bg-blue-100'
                              : ''
                              }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${expandedSystems[system.id]
                              ? theme === "dark" ? 'text-blue-300' : 'text-blue-600'
                              : _text_color
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
                          className={`overflow-hidden ${theme === "dark" ? 'bg-gray-800/80' : 'bg-gray-50/80'}`}
                        >
                          <div className={`p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2 md:space-y-2.5 ${theme === "dark" ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                            {systemClasses.length === 0 ? (
                              <div className={`text-center ${_text_color} opacity-80 py-3 sm:py-4 md:py-5 flex flex-col items-center rounded-lg ${app_bg_color}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-400 mb-2 sm:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-xs sm:text-sm font-medium">
                                  Aucune classe associée à ce système.
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:gap-3">
                                {systemClasses.map((cls) => {
                                  const className = `${cls.level} ${cls.name}`.trim();
                                  // console.log(className);
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
                                            setSelectedClass(null);
                                            setSelectedPaymentSystem(null);
                                            delay(500).then(() => {
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
                                        className={`w-full text-left px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3.5 rounded-lg flex justify-between items-center transition-all duration-200 ${isActive
                                          ? `${activeClassBgColor} text-white shadow-md border-2 border-white`
                                          : `${isWhiteOrGray || theme === "dark" ? "border-2" : "border-2 border-white"} 
                                            ${isWhiteOrGray ? "hover:bg-green-50" : theme === "dark" ? "hover:bg-gray-700" : ""} 
                                            ${_text_color} ${app_bg_color}`
                                          }`}
                                      >
                                        <div className="flex items-center">
                                          <div className={`mr-1.5 sm:mr-2 md:mr-3 p-1 sm:p-1.5 md:p-2 rounded-full ${isActive
                                            ? 'bg-gradient-to-r from-orange-600 to-green-600'
                                            : theme === "dark" ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700'
                                            }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                          </div>
                                          <div>
                                            <span className="text-xs sm:text-sm font-medium">{getClasseName(className, language)}</span>
                                            <span className="block text-2xs sm:text-xs opacity-80">Niveau {cls.level}</span>
                                          </div>
                                        </div>
                                        <div className={`flex border border-2 items-center px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full ${isActive
                                          ? 'bg-white bg-opacity-20 text-white'
                                          : theme === "dark" ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                          }`}>
                                          <span className="text-2xs sm:text-xs md:text-sm font-semibold">{studentCount}</span>
                                          <span className="text-2xs sm:text-xs ml-0.5 sm:ml-1">élèves</span>
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

        {/* Button to return to tabs - Enhanced with gradient and better styling */}
        {selectedClass && (
          <div className="p-2 sm:p-3 md:p-4 border-t border-gray-700 bg-opacity-90">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedClass(null);
                setActiveTab(0);
              }}
              className={`w-full py-1.5 sm:py-2 md:py-2.5 rounded-lg ${buttonBgColor} text-white text-xs sm:text-sm font-medium shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour aux onglets
              </div>
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PayementsSidebar;