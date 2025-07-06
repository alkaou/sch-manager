import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gradients } from "../utils/colors";
import { getClasseName, formatDate } from "../utils/helpers";
import { useLanguage, useFlashNotification } from "../components/contexts";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  Eye,
  FileText,
  CheckSquare,
  RefreshCcw,
  Unlock,
  Lock,
} from "lucide-react";

import CreateBulletin from "../components/bulletin_components/CreateBulletin.jsx";
import GetBulletinStudents from "../components/bulletin_components/GetBulletinStudents.jsx";
import BulletinNotes from "../components/bulletin_components/BulletinNotes.jsx";
import ShowAllBulletin from "../components/bulletin_components/ShowAllBulletin.jsx";
import ActionConfirmePopup from "../components/popups/ActionConfirmePopup.jsx";
import PageLoading from "../components/partials/PageLoading.jsx";
import { translate } from "../components/bulletin_components/bulletin_translator";
import { translate as Compositiontranslate } from "../components/compositions/compositions_translator";

const BulletinsPageContent = ({
  app_bg_color,
  text_color,
  theme,
  school_name,
  school_short_name,
  school_zone_name,
  database,
}) => {
  const { language } = useLanguage();
  const [db, setDb] = useState(database);
  const [compositions, setCompositions] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedComposition, setSelectedComposition] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmPopupTitle, setConfirmPopupTitle] = useState("");
  const [confirmPopupMessage, setConfirmPopupMessage] = useState("");
  const [the_compositionId, set_the_compositionId] = useState(null);
  const [the_classId, set_the_classId] = useState(null);
  const [popup_action, set_popup_action] = useState(null);

  const { setFlashMessage } = useFlashNotification();

  // Couleurs et styles
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const inputBgColor =
    theme === "dark"
      ? "bg-gray-700"
      : app_bg_color === gradients[1] || app_bg_color === gradients[2]
      ? app_bg_color
      : "bg-green-700 bg-opacity-40";

  const search_inputBgColor =
    theme === "dark"
      ? "bg-gray-700"
      : app_bg_color === gradients[1] || app_bg_color === gradients[2]
      ? app_bg_color
      : "bg-gray-700 bg-opacity-70";

  const textClass = text_color;
  // const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonPrimary =
    app_bg_color === gradients[1]
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-blue-600 hover:bg-blue-700";
  const buttonDelete = "bg-red-600 hover:bg-red-700";
  const buttonAdd = "bg-green-600 hover:bg-green-700";
  const buttonEdit = "bg-yellow-600 hover:bg-yellow-700";
  const buttonView = "bg-purple-600 hover:bg-purple-700";
  const shinyBorderColor =
    theme === "dark" ? "border-blue-400" : "border-purple-400";
  const tableBorderColor =
    theme === "dark" ? "border-gray-700" : "border-gray-200";
  const tableHeaderBg = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const tableRowHoverBg =
    theme === "dark"
      ? "hover:bg-gray-700"
      : app_bg_color === gradients[1]
      ? "hover:bg-white"
      : app_bg_color === gradients[2]
      ? "hover:bg-gray-100"
      : "hover:bg-green-500 hover:bg-opacity-50";

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

  // Obtenir les années uniques pour le filtre
  const getUniqueYears = () => {
    const years = compositions.map((comp) => new Date(comp.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Tri décroissant
  };

  // Obtenir les types uniques de compositions pour le filtre
  const getUniqueTypes = () => {
    const types = compositions.map((comp) => comp.helper);
    return [...new Set(types)];
  };

  // Filtrer les compositions
  const filteredCompositions = compositions
    .filter((comp) => {
      // Filtre par recherche
      const searchMatch =
        searchTerm === "" ||
        comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(comp.date)
          .toLowerCase()
          .includes(searchTerm.toLowerCase(), language);

      // Filtre par année
      const yearMatch =
        filterYear === "all" ||
        new Date(comp.date).getFullYear().toString() === filterYear;

      // Filtre par type
      const typeMatch = filterType === "all" || comp.helper === filterType;

      return searchMatch && yearMatch && typeMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante

  // Vérifier si un bulletin existe pour une composition et une classe
  const bulletinExists = (compositionId, classId) => {
    return bulletins.some(
      (bulletin) =>
        bulletin.compositionId === compositionId && bulletin.classId === classId
    );
  };

  // Obtenir le bulletin pour une composition et une classe
  const getBulletin = (compositionId, classId) => {
    return bulletins.find(
      (bulletin) =>
        bulletin.compositionId === compositionId && bulletin.classId === classId
    );
  };

  // Compter les élèves d'une classe
  const getStudentCount = (classId) => {
    if (!db || !db.students) return 0;

    const classObj = db.classes.find((cls) => cls.id === classId);
    if (!classObj) return 0;

    const className = `${classObj.level} ${classObj.name}`.trim();
    return db.students.filter(
      (student) => student.classe === className && student.status === "actif"
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
  const handleDeleteBulletin = async (compositionId = "", classId = "") => {
    setConfirmPopupTitle(translate("confirm_delete_bulletin_title", language));
    setConfirmPopupMessage(
      translate("confirm_delete_bulletin_message", language)
    );
    if (showConfirmPopup === false) {
      set_the_compositionId(compositionId);
      set_the_classId(classId);
      set_popup_action(2);
      setShowConfirmPopup(true);
      return;
    }
    try {
      const updatedBulletins = bulletins.filter(
        (bulletin) =>
          !(
            bulletin.compositionId === the_compositionId &&
            bulletin.classId === the_classId
          )
      );

      const updatedDB = { ...db, bulletins: updatedBulletins };
      await window.electron.saveDatabase(updatedDB);

      setBulletins(updatedBulletins);
      refreshData();
      setFlashMessage({
        message: translate("success_bulletin_success", language),
        type: "success",
        duration: 5000,
      });
      setShowConfirmPopup(false);
      set_the_compositionId(null);
      set_the_classId(null);
      set_popup_action(null);
    } catch (error) {
      // console.error("Erreur lors de la suppression du bulletin:", error);
      // alert("Erreur lors de la suppression du bulletin.");
      setFlashMessage({
        message: translate("error_deleting_bulletin", language),
        type: "error",
        duration: 5000,
      });
      setShowConfirmPopup(false);
      set_the_compositionId(null);
      set_the_classId(null);
      set_popup_action(null);
    }
  };

  // Gérer la fermeture d'un bulletin
  const handleLokedBulletin = async (compositionId = "", classId = "") => {
    setConfirmPopupTitle(translate("confirm_close_bulletin_title", language));
    setConfirmPopupMessage(
      translate("confirm_close_bulletin_message", language)
    );
    if (showConfirmPopup === false) {
      set_the_compositionId(compositionId);
      set_the_classId(classId);
      set_popup_action(1);
      setShowConfirmPopup(true);
      return;
    }
    try {
      const updatedBulletins = bulletins.map((bulletin) => {
        if (
          bulletin.compositionId === the_compositionId &&
          bulletin.classId === the_classId
        ) {
          // On retourne une copie du bulletin avec isLocked mis à true
          return { ...bulletin, isLocked: true };
        }
        // Sinon, on retourne le bulletin tel quel
        return bulletin;
      });
      // console.log(updatedBulletins);
      const updatedDB = { ...db, bulletins: updatedBulletins };
      await window.electron.saveDatabase(updatedDB);
      setBulletins(updatedBulletins);
      refreshData();
      setFlashMessage({
        message: translate("bulletin_closed_success", language),
        type: "success",
        duration: 5000,
      });
      setShowConfirmPopup(false);
      set_the_compositionId(null);
      set_the_classId(null);
      set_popup_action(null);
    } catch (error) {
      // console.error("Erreur lors de la suppression du bulletin:", error);
      // alert("Erreur lors de la suppression du bulletin.");
      setFlashMessage({
        message: translate("error_closing_bulletin", language),
        type: "error",
        duration: 5000,
      });
      setShowConfirmPopup(false);
      set_the_compositionId(null);
      set_the_classId(null);
      set_popup_action(null);
    }
  };

  if (!db) {
    return <PageLoading />;
  }

  return (
    <div
      style={{
        marginLeft: "4%",
        height: "90vh",
        overflow: "hidden",
        marginTop: "5%",
      }}
      className={`${app_bg_color} flex flex-col sm:flex-row h-screen p-1`}
    >
      <div className="flex-1 overflow-y-auto scrollbar-custom mt-2 p-4">
        <motion.div
          className={`max-w-7xl mx-auto p-6 ${formBgColor} rounded-lg shadow-2xl border-2 ${shinyBorderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow:
              theme === "dark"
                ? "0 0 15px rgba(66, 153, 225, 0.5)"
                : "0 0 15px rgba(159, 122, 234, 0.5)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>
              {translate("bulletins_management", language)}
            </h2>
            <button
              onClick={refreshData}
              className={`p-2 rounded-full border ${tableBorderColor} bg-blue-600 hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-md`}
              title={translate("refresh_data", language)}
            >
              <RefreshCcw
                className={`text-white ${textClass} ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                size={20}
              />
            </button>
          </div>

          {/* Filtres et recherche */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 mb-4 p-2 rounded-lg shadow-sm border border-2 border-gray-300`}
          >
            <div className="flex items-center space-x-2">
              <Search size={18} className={textClass} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate("search_composition", language)}
                className={`px-2 py-1 rounded ${search_inputBgColor} ${text_color} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={18} className={textClass} />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`px-2 py-1 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="all">{translate("all_years", language)}</option>
                {getUniqueYears().map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={18} className={textClass} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-2 py-1 rounded ${inputBgColor} ${textClass} border ${tableBorderColor} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="all">{translate("all_types", language)}</option>
                {getUniqueTypes().map((type) => (
                  <option key={type} value={type}>
                    {type === "comp"
                      ? translate("composition_type", language)
                      : type === "Trim"
                      ? translate("trimester_type", language)
                      : type === "Seme"
                      ? translate("semester_type", language)
                      : type === "Def"
                      ? translate("def_blanc_type", language)
                      : type === "Bac"
                      ? translate("bac_blanc_type", language)
                      : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des compositions */}
          {filteredCompositions.length === 0 ? (
            <div
              className={`p-8 text-center ${textClass} border ${tableBorderColor} rounded-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">
                {translate("no_composition_found", language)}
              </p>
              <p className="mt-2">
                {translate("create_compositions_message", language)}
              </p>
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
                  <div
                    className={`${tableHeaderBg} ${textClass} p-4 flex justify-between items-center`}
                  >
                    <div>
                      <h3 className="text-xl font-bold">
                        {/* {composition.label} */}
                        {
                          Compositiontranslate("composition_options", language)[
                            parseInt(composition.name) - 1
                          ]["label"]
                        }
                      </h3>
                      <p className="text-sm opacity-80">
                        {formatDate(composition.date, language)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          composition.helper === "comp"
                            ? "bg-blue-100 text-blue-800"
                            : composition.helper === "Trim"
                            ? "bg-green-100 text-green-800"
                            : composition.helper === "Seme"
                            ? "bg-purple-100 text-purple-800"
                            : composition.helper === "Def"
                            ? "bg-yellow-100 text-yellow-800"
                            : composition.helper === "Bac"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {composition.helper === "comp"
                          ? translate("composition_type", language)
                          : composition.helper === "Trim"
                          ? translate("trimester_type", language)
                          : composition.helper === "Seme"
                          ? translate("semester_type", language)
                          : composition.helper === "Def"
                          ? translate("def_blanc_type", language)
                          : composition.helper === "Bac"
                          ? translate("bac_blanc_type", language)
                          : type}
                      </span>
                    </div>
                  </div>

                  {/* Classes de la composition */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {composition.classes.map((classId) => {
                        const classObj = db?.classes?.find(
                          (cls) => cls.id === classId
                        );
                        if (!classObj) return null;

                        const bulletinExistsForClass = bulletinExists(
                          composition.id,
                          classId
                        );
                        const composedStudents = getComposedStudentCount(
                          composition.id,
                          classId
                        );
                        const bullettinIsLocked = getBulletin(
                          composition.id,
                          classId
                        )?.isLocked;
                        const currentTtotalStudents = getStudentCount(classId);
                        const totalStudents = bullettinIsLocked
                          ? composedStudents
                          : currentTtotalStudents;
                        // console.log(bullettinIsLocked);

                        return (
                          <motion.div
                            key={classId}
                            className={`border ${tableBorderColor} rounded-lg p-4 ${tableRowHoverBg}`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className={`font-bold ${textClass}`}>
                                {getClasseName(
                                  `${classObj.level} ${classObj.name}`.trim(),
                                  language
                                )}
                              </h4>
                              <div className="flex space-x-1">
                                {bullettinIsLocked ? (
                                  <>
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        padding: "2px 4px",
                                        borderRadius: "5px",
                                      }}
                                      className={`text-white bg-blue-300 italic flex`}
                                    >
                                      {translate("bulletin_closed", language)}
                                      <Lock
                                        className="mt-1 ml-1 text-white"
                                        size={15}
                                      />
                                    </span>
                                    <motion.button
                                      onClick={() =>
                                        handleOpenComponent(
                                          "ShowAllBulletin",
                                          composition,
                                          classId
                                        )
                                      }
                                      className={`p-1.5 rounded ${buttonView} text-white`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      title={translate(
                                        "view_bulletins",
                                        language
                                      )}
                                    >
                                      <Eye size={16} />
                                    </motion.button>
                                  </>
                                ) : (
                                  <>
                                    {bulletinExistsForClass ? (
                                      <>
                                        {composedStudents > 1 ? (
                                          <motion.button
                                            onClick={() =>
                                              handleLokedBulletin(
                                                composition.id,
                                                classId
                                              )
                                            }
                                            className={`p-1.5 rounded ${buttonAdd} text-white`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title={translate(
                                              "close_editing",
                                              language
                                            )}
                                          >
                                            <Unlock size={16} />
                                          </motion.button>
                                        ) : null}

                                        <motion.button
                                          onClick={() =>
                                            handleOpenComponent(
                                              "BulletinNotes",
                                              composition,
                                              classId
                                            )
                                          }
                                          className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={translate(
                                            "enter_grades",
                                            language
                                          )}
                                        >
                                          <FileText size={16} />
                                        </motion.button>

                                        <motion.button
                                          onClick={() =>
                                            handleOpenComponent(
                                              "ShowAllBulletin",
                                              composition,
                                              classId
                                            )
                                          }
                                          className={`p-1.5 rounded ${buttonView} text-white`}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={translate(
                                            "view_bulletins",
                                            language
                                          )}
                                        >
                                          <Eye size={16} />
                                        </motion.button>

                                        <motion.button
                                          onClick={() =>
                                            handleOpenComponent(
                                              "CreateBulletin",
                                              composition,
                                              classId
                                            )
                                          }
                                          className={`p-1.5 rounded ${buttonEdit} text-white`}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={translate(
                                            "reconfigure_bulletin",
                                            language
                                          )}
                                        >
                                          <Edit size={16} />
                                        </motion.button>

                                        <motion.button
                                          onClick={() =>
                                            handleDeleteBulletin(
                                              composition.id,
                                              classId
                                            )
                                          }
                                          className={`p-1.5 rounded ${buttonDelete} text-white`}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={translate(
                                            "delete_bulletin",
                                            language
                                          )}
                                        >
                                          <Trash size={16} />
                                        </motion.button>
                                      </>
                                    ) : (
                                      <motion.button
                                        onClick={() =>
                                          handleOpenComponent(
                                            "CreateBulletin",
                                            composition,
                                            classId
                                          )
                                        }
                                        className={`p-1.5 rounded ${buttonAdd} text-white`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={translate(
                                          "create_bulletin",
                                          language
                                        )}
                                      >
                                        <Plus size={16} />
                                      </motion.button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <div className={textClass}>
                                <b>
                                  {translate("students", language)} :{" "}
                                  {totalStudents}
                                </b>
                              </div>
                              <div className="flex items-center">
                                {bulletinExistsForClass ? (
                                  <div className="flex items-center">
                                    {composedStudents >= totalStudents ? (
                                      <b className={`mr-2 ${textClass}`}>
                                        {translate("composed", language)} :{" "}
                                        {composedStudents}
                                      </b>
                                    ) : (
                                      <b className={`mr-2 ${textClass}`}>
                                        {translate("composed", language)}:{" "}
                                        {composedStudents}/{totalStudents}
                                      </b>
                                    )}
                                    {!bullettinIsLocked &&
                                      composedStudents < totalStudents && (
                                        <motion.button
                                          onClick={() =>
                                            handleOpenComponent(
                                              "GetBulletinStudents",
                                              composition,
                                              classId
                                            )
                                          }
                                          className={`p-1.5 rounded ${buttonPrimary} text-white`}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={translate(
                                            "add_students",
                                            language
                                          )}
                                        >
                                          <CheckSquare size={16} />
                                        </motion.button>
                                      )}
                                  </div>
                                ) : (
                                  <span className={`text-yellow-500 italic`}>
                                    {translate(
                                      "bulletin_not_configured",
                                      language
                                    )}
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

        {/* Modal components for bulletin management */}
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
                    {activeComponent === "CreateBulletin" &&
                      translate("bulletin_configuration", language)}
                    {activeComponent === "GetBulletinStudents" &&
                      translate("student_selection", language)}
                    {activeComponent === "BulletinNotes" &&
                      translate("grade_entry", language)}
                    {activeComponent === "ShowAllBulletin" &&
                      translate("bulletin_visualization", language)}
                  </h3>
                  <button
                    onClick={handleCloseComponent}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Active component content */}
                <div className="mt-4">
                  {activeComponent === "CreateBulletin" && (
                    <CreateBulletin
                      selectedComposition={selectedComposition}
                      selectedClass={selectedClass}
                      language={language}
                      db={db}
                      theme={theme}
                      app_bg_color={app_bg_color}
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
                        app_bg_color={app_bg_color}
                      />
                    </div>
                  )}

                  {activeComponent === "BulletinNotes" && (
                    <div>
                      {/* BulletinNotes placeholder */}
                      <BulletinNotes
                        selectedComposition={selectedComposition}
                        selectedClass={selectedClass}
                        db={db}
                        textClass={textClass}
                        app_bg_color={app_bg_color}
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

                  {/* ShowAllBulletin placeholder => Display all student bulletins */}
                  <AnimatePresence>
                    {activeComponent === "ShowAllBulletin" && (
                      <ShowAllBulletin
                        selectedComposition={selectedComposition}
                        selectedClass={selectedClass}
                        db={db}
                        theme={theme}
                        textClass={text_color}
                        app_bg_color={app_bg_color}
                        handleCloseComponent={handleCloseComponent}
                        school_name={school_name}
                        school_short_name={school_short_name}
                        school_zone_name={school_zone_name}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deletion confirmation popup */}
        <ActionConfirmePopup
          isOpenConfirmPopup={showConfirmPopup}
          setIsOpenConfirmPopup={() => {
            setShowConfirmPopup(false);
            set_the_compositionId(null);
            set_the_classId(null);
            set_popup_action(null);
          }}
          actionType={popup_action === 1 ? "info" : "danger"}
          handleConfirmeAction={
            popup_action === 1
              ? handleLokedBulletin
              : popup_action === 2
              ? handleDeleteBulletin
              : () => {}
          }
          title={confirmPopupTitle}
          message={confirmPopupMessage}
          // element_info={
          //   <>
          //     <span className="font-bold">{compositionToDelete?.name}</span> du <span className="font-bold">{formatDate(compositionToDelete?.date)}</span>
          //   </>
          // }
        />
      </div>
    </div>
  );
};

const BulletinsPage = () => {
  const context = useOutletContext();
  return <BulletinsPageContent {...context} />;
};

export default BulletinsPage;
