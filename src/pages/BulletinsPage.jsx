import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { gradients } from '../utils/colors';
import { getClasseName } from '../utils/helpers';
import { useLanguage } from '../components/contexts.js';
import { Search, Filter, Plus, Edit, Trash, Eye, FileText, CheckSquare, RefreshCcw, Unlock } from 'lucide-react';

import CreateBulletin from "../components/CreateBulletin.jsx";
import GetBulletinStudents from "../components/GetBulletinStudents.jsx";
import BulletinNotes from "../components/BulletinNotes.jsx";
import ShowAllBulletin from "../components/ShowAllBulletin.jsx";

const BulletinsPageContent = ({
  app_bg_color,
  text_color,
  theme,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  const { live_language, language } = useLanguage();
  const [db, setDb] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedComposition, setSelectedComposition] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Couleurs et styles
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  // const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonPrimary = app_bg_color === gradients[1] ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700";
  const buttonDelete = "bg-red-600 hover:bg-red-700";
  const buttonAdd = "bg-green-600 hover:bg-green-700";
  const buttonEdit = "bg-yellow-600 hover:bg-yellow-700";
  const buttonView = "bg-purple-600 hover:bg-purple-700";
  const shinyBorderColor = theme === "dark" ? "border-blue-400" : "border-purple-400";
  const tableBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const tableRowHoverBg = theme === "dark"
    ? "hover:bg-gray-700"
    : app_bg_color === gradients[1]
      ? "hover:bg-white"
      : app_bg_color === gradients[2]
        ? "hover:bg-gray-100"
        : "hover:bg-gray-50";
  const controlsPanelBg = theme === "dark" ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90";

  // Charger la DB et initialiser compositions et bulletins
  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
      if (!data.compositions) {
        data.compositions = [];
      }
      setCompositions(data.compositions);

      if (!data.bulletins) {
        data.bulletins = [];
      }
      setBulletins(data.bulletins);
    });
  }, []);

  // Rafraîchissement des données
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = await window.electron.getDatabase();
      setDb(data);
      setCompositions(data.compositions || []);
      setBulletins(data.bulletins || []);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
      setIsRefreshing(false);
    }
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'Français' ? 'fr-FR' : 'en-US', options);
  };

  // Obtenir les années uniques pour le filtre
  const getUniqueYears = () => {
    const years = compositions.map(comp => new Date(comp.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Tri décroissant
  };

  // Obtenir les types uniques de compositions pour le filtre
  const getUniqueTypes = () => {
    const types = compositions.map(comp => comp.helper);
    return [...new Set(types)];
  };

  // Filtrer les compositions
  const filteredCompositions = compositions.filter(comp => {
    // Filtre par recherche
    const searchMatch = searchTerm === "" ||
      comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(comp.date).toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par année
    const yearMatch = filterYear === "all" ||
      new Date(comp.date).getFullYear().toString() === filterYear;

    // Filtre par type
    const typeMatch = filterType === "all" || comp.helper === filterType;

    return searchMatch && yearMatch && typeMatch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante

  // Vérifier si un bulletin existe pour une composition et une classe
  const bulletinExists = (compositionId, classId) => {
    return bulletins.some(bulletin =>
      bulletin.compositionId === compositionId &&
      bulletin.classId === classId
    );
  };

  // Obtenir le bulletin pour une composition et une classe
  const getBulletin = (compositionId, classId) => {
    return bulletins.find(bulletin =>
      bulletin.compositionId === compositionId &&
      bulletin.classId === classId
    );
  };

  // Compter les élèves d'une classe
  const getStudentCount = (classId) => {
    if (!db || !db.students) return 0;

    const classObj = db.classes.find(cls => cls.id === classId);
    if (!classObj) return 0;

    const className = `${classObj.level} ${classObj.name}`;
    return db.students.filter(student =>
      student.classe === className &&
      student.status === "actif"
    ).length;
  };

  // Compter les élèves composés pour un bulletin
  const getComposedStudentCount = (compositionId, classId) => {
    const bulletin = getBulletin(compositionId, classId);
    if (!bulletin || !bulletin.students) return 0;
    return bulletin.students.length;
  };

  // Gérer l'ouverture des composants
  const handleOpenComponent = (component, composition, classId) => {
    setActiveComponent(component);
    setSelectedComposition(composition);
    setSelectedClass(classId);
  };

  // Gérer la fermeture des composants
  const handleCloseComponent = () => {
    refreshData();
    setActiveComponent(null);
    setSelectedComposition(null);
    setSelectedClass(null);
  };

  // Gérer la suppression d'un bulletin
  const handleDeleteBulletin = async (compositionId, classId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bulletin ?")) {
      try {
        const updatedBulletins = bulletins.filter(
          bulletin => !(bulletin.compositionId === compositionId && bulletin.classId === classId)
        );

        const updatedDB = { ...db, bulletins: updatedBulletins };
        await window.electron.saveDatabase(updatedDB);

        setBulletins(updatedBulletins);
        refreshData();
        alert("Bulletin supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression du bulletin:", error);
        alert("Erreur lors de la suppression du bulletin.");
      }
    }
  };

  return (
    <div className="p-4 mt-20 ml-20">
      <motion.div
        className={`max-w-7xl mx-auto p-6 ${formBgColor} rounded-lg shadow-2xl border-2 ${shinyBorderColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: theme === "dark" ? "0 0 15px rgba(66, 153, 225, 0.5)" : "0 0 15px rgba(159, 122, 234, 0.5)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textClass}`}>Gestion des Bulletins</h2>
          <button
            onClick={refreshData}
            className={`p-2 rounded-full border ${tableBorderColor} hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-md`}
            title="Rafraîchir les données"
          >
            <RefreshCcw className={`hover:text-white ${textClass} ${isRefreshing ? 'animate-spin' : ''}`} size={20} />
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-lg shadow-sm ${controlsPanelBg}`}>
          <div className="flex items-center space-x-2">
            <Search size={20} className={textClass} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une composition..."
              className={`px-3 py-2 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={20} className={textClass} />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className={`px-3 py-2 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">Toutes les années</option>
              {getUniqueYears().map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={20} className={textClass} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-2 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">Tous les types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>
                  {type === "comp" ? "Composition" :
                    type === "Trim" ? "Trimestre" :
                      type === "Seme" ? "Semestre" :
                        type === "Def" ? "DEF Blanc" :
                          type === "Bac" ? "BAC Blanc" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des compositions */}
        {filteredCompositions.length === 0 ? (
          <div className={`p-8 text-center ${textClass} border ${tableBorderColor} rounded-lg`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">Aucune composition trouvée</p>
            <p className="mt-2">Veuillez créer des compositions dans la section "Compositions"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCompositions.map((composition) => (
              <motion.div
                key={composition.id}
                className={`border ${tableBorderColor} rounded-lg overflow-hidden shadow-md`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* En-tête de la composition */}
                <div className={`${tableHeaderBg} ${textClass} p-4 flex justify-between items-center`}>
                  <div>
                    <h3 className="text-xl font-bold">{composition.label}</h3>
                    <p className="text-sm opacity-80">{formatDate(composition.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${composition.helper === "comp" ? "bg-blue-100 text-blue-800" :
                        composition.helper === "Trim" ? "bg-green-100 text-green-800" :
                          composition.helper === "Seme" ? "bg-purple-100 text-purple-800" :
                            composition.helper === "Def" ? "bg-yellow-100 text-yellow-800" :
                              composition.helper === "Bac" ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800"
                      }`}>
                      {composition.helper === "comp" ? "Composition" :
                        composition.helper === "Trim" ? "Trimestre" :
                          composition.helper === "Seme" ? "Semestre" :
                            composition.helper === "Def" ? "DEF Blanc" :
                              composition.helper === "Bac" ? "BAC Blanc" : type}
                    </span>
                  </div>
                </div>

                {/* Classes de la composition */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {composition.classes.map((classId) => {
                      const classObj = db?.classes?.find(cls => cls.id === classId);
                      if (!classObj) return null;

                      const bulletinExistsForClass = bulletinExists(composition.id, classId);
                      const totalStudents = getStudentCount(classId);
                      const composedStudents = getComposedStudentCount(composition.id, classId);

                      return (
                        <motion.div
                          key={classId}
                          className={`border ${tableBorderColor} rounded-lg p-4 ${tableRowHoverBg}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className={`font-bold ${textClass}`}>
                              {getClasseName(`${classObj.level} ${classObj.name}`, language)}
                            </h4>
                            <div className="flex space-x-1">
                              {bulletinExistsForClass ? (
                                <>
                                  <motion.button
                                    // onClick={() => handleOpenComponent("BulletinNotes", composition, classId)}
                                    className={`p-1.5 rounded ${buttonAdd} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Fermer l'édition"
                                  >
                                    <Unlock size={16} />
                                  </motion.button>

                                  <motion.button
                                    onClick={() => handleOpenComponent("BulletinNotes", composition, classId)}
                                    className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Saisir les notes"
                                  >
                                    <FileText size={16} />
                                  </motion.button>

                                  <motion.button
                                    onClick={() => handleOpenComponent("ShowAllBulletin", composition, classId)}
                                    className={`p-1.5 rounded ${buttonView} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Voir les bulletins"
                                  >
                                    <Eye size={16} />
                                  </motion.button>

                                  <motion.button
                                    onClick={() => handleOpenComponent("CreateBulletin", composition, classId)}
                                    className={`p-1.5 rounded ${buttonEdit} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Reconfigurer le bulletin"
                                  >
                                    <Edit size={16} />
                                  </motion.button>

                                  <motion.button
                                    onClick={() => handleDeleteBulletin(composition.id, classId)}
                                    className={`p-1.5 rounded ${buttonDelete} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Supprimer le bulletin"
                                  >
                                    <Trash size={16} />
                                  </motion.button>
                                </>
                              ) : (
                                <motion.button
                                  onClick={() => handleOpenComponent("CreateBulletin", composition, classId)}
                                  className={`p-1.5 rounded ${buttonAdd} text-white`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Créer un bulletin"
                                >
                                  <Plus size={16} />
                                </motion.button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <div className={textClass}>
                              <span>Élèves: {totalStudents}</span>
                            </div>
                            <div className="flex items-center">
                              {bulletinExistsForClass ? (
                                <div className="flex items-center">
                                  {composedStudents >= totalStudents ?
                                    <span className={`mr-2 ${textClass}`}>
                                      Composés: {composedStudents}
                                    </span>
                                    :
                                    <span className={`mr-2 ${textClass}`}>
                                      Composés: {composedStudents}/{totalStudents}
                                    </span>
                                  }
                                  {composedStudents < totalStudents && (
                                    <motion.button
                                      onClick={() => handleOpenComponent("GetBulletinStudents", composition, classId)}
                                      className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      title="Ajouter des élèves"
                                    >
                                      <CheckSquare size={16} />
                                    </motion.button>
                                  )}
                                </div>
                              ) : (
                                <span className={`text-yellow-500 italic`}>
                                  Bulletin non configuré
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Composants modaux pour la gestion des bulletins */}
      <AnimatePresence>
        {activeComponent && selectedComposition && selectedClass && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${formBgColor} p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-custom`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${textClass}`}>
                  {activeComponent === "CreateBulletin" && "Configuration du bulletin"}
                  {activeComponent === "GetBulletinStudents" && "Sélection des élèves"}
                  {activeComponent === "BulletinNotes" && "Saisie des notes"}
                  {activeComponent === "ShowAllBulletin" && "Visualisation des bulletins"}
                </h3>
                <button
                  onClick={handleCloseComponent}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu du composant actif */}
              <div className="mt-4">
                {activeComponent === "CreateBulletin" && (
                  <CreateBulletin
                    selectedComposition={selectedComposition}
                    selectedClass={selectedClass}
                    language={language}
                    db={db}
                    textClass={textClass}
                    getClasseName={getClasseName}
                    handleCloseComponent={handleCloseComponent}
                    refreshData={refreshData}
                  />
                )}

                {activeComponent === "GetBulletinStudents" && (
                  <div className={`p-4`}>
                    <GetBulletinStudents
                      selectedComposition={selectedComposition}
                      selectedClass={selectedClass}
                      db={db}
                      textClass={textClass}
                      theme={theme}
                      getClasseName={getClasseName}
                      handleCloseComponent={handleCloseComponent}
                      refreshData={refreshData}
                    />
                  </div>
                )}

                {activeComponent === "BulletinNotes" && (
                  <div>
                    {/* Placeholder pour BulletinNotes */}
                    <BulletinNotes
                      selectedComposition={selectedComposition}
                      selectedClass={selectedClass}
                      db={db}
                      textClass={textClass}
                      theme={theme}
                      getClasseName={getClasseName}
                      handleCloseComponent={handleCloseComponent}
                      refreshData={refreshData}
                      school_name={school_name}
                      school_short_name={school_short_name}
                      school_zone_name={school_zone_name}
                    />
                  </div>
                )}

                {activeComponent === "ShowAllBulletin" && (
                  <div>
                    {/* Placeholder pour ShowAllBulletin => Afficher les bulletins de tous les élèves */}
                    <ShowAllBulletin
                      selectedComposition={selectedComposition}
                      selectedClass={selectedClass}
                      db={db}
                      textClass={textClass}
                      theme={theme}
                      handleCloseComponent={handleCloseComponent}
                      refreshData={refreshData}
                      school_name={school_name}
                      school_short_name={school_short_name}
                      school_zone_name={school_zone_name}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BulletinsPage = () => {
  const context = useOutletContext();
  return <BulletinsPageContent {...context} />;
};

export default BulletinsPage;