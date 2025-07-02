import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, Briefcase, Edit, Trash, Info } from "lucide-react";
import { useTheme, useFlashNotification, useLanguage } from "../contexts";
import { deletePosition } from "../../utils/database_methods";
import { translate } from "./employes_translator";
import { return_prof_desc_trans, return_prof_trans } from "./utils";

const EmployeeSidebar = ({
  positions,
  selectedPosition,
  setSelectedPosition,
  setShowAddPositionForm,
  setPositionToEdit,
  refreshData,
  database,
}) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { setFlashMessage } = useFlashNotification();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Toggle position description
  const toggleDescription = (positionId, e) => {
    e.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [positionId]: !prev[positionId],
    }));
  };

  // Sort positions: Professeurs first, then by recency (newest first)
  const sortedPositions = [...positions].sort((a, b) => {
    if (a.name === "Professeurs") return -1;
    if (b.name === "Professeurs") return 1;
    return b.created_at - a.created_at;
  });

  // Filter positions based on search term
  const filteredPositions = sortedPositions.filter((position) =>
    position.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle position delete
  const handleDeletePosition = async (positionId) => {
    try {
      await deletePosition(positionId, database, setFlashMessage, language);
      setConfirmDelete(null);
      refreshData();
    } catch (error) {
      console.error("Error deleting position:", error);
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: 8,
      transition: { duration: 0.3 },
    },
  };

  // Get background color for sidebar
  const sidebarBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonColor =
    theme === "dark"
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:text-blue-500";
  const _text_color =
    app_bg_color === gradients[1] ||
    app_bg_color === gradients[2] ||
    theme === "dark"
      ? text_color
      : "text-gray-700";
  const descriptionBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";

  // Format description for display with paragraph breaks
  const formatDescription = (description) => {
    if (!description) return null;
    return description.split("\n").map((line, index) => (
      <p
        key={index}
        className={`${_text_color} text-xs ${line.trim() ? "" : "h-2"}`}
      >
        {line || " "}
      </p>
    ));
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className={`w-14 xs:w-36 sm:w-48 md:w-56 lg:w-64 h-full ${sidebarBgColor} ${borderColor} border-r shadow-lg overflow-hidden flex flex-col`}
    >
      <div className="p-2 sm:p-3 md:p-4 border-b border-gray-200 flex justify-between items-center">
        <h2
          className={`font-bold text-xs xs:text-sm md:text-lg ${_text_color} truncate`}
        >
          {translate("postes", language)}
        </h2>
        <motion.button
          onClick={() => setShowAddPositionForm(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonColor} p-1 rounded-full`}
          title={translate("add_position_button", language)}
        >
          <PlusCircle size={18} />
        </motion.button>
      </div>

      <div className="px-2 sm:px-3 py-2">
        <div
          className={`flex items-center px-1 sm:px-2 py-1.5 sm:py-2 bg-gray-100 rounded-md ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <Search size={16} className={`${_text_color} opacity-60`} />
          <input
            type="text"
            placeholder={translate("search_notify", language)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`ml-1 sm:ml-2 bg-transparent outline-none w-full text-xs sm:text-sm ${_text_color}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1 sm:p-2 scrollbar-custom">
        <AnimatePresence>
          {filteredPositions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center p-2 sm:p-4 ${_text_color} opacity-70 text-xs sm:text-sm`}
            >
              {translate("no_postes_found", language)}
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
                      ? theme === "dark"
                        ? "bg-blue-900 bg-opacity-30"
                        : "bg-blue-100"
                      : "hover:bg-gray-100 hover:bg-opacity-30"
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSelectedPosition(position.name)}
                      className={`w-full p-2 sm:p-3 text-left flex items-center justify-between ${_text_color}`}
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2 truncate">
                        <Briefcase
                          size={16}
                          className={
                            selectedPosition === position.name
                              ? "text-blue-500"
                              : ""
                          }
                        />
                        <span
                          className={`text-xs sm:text-sm ${
                            selectedPosition === position.name
                              ? "font-semibold"
                              : ""
                          } truncate`}
                        >
                          {return_prof_trans(position.name, language)}
                        </span>
                      </div>

                      {/* Action buttons + description toggle if description exists */}
                      <div className="flex items-center">
                        {/* Show actions on hover */}
                        <AnimatePresence>
                          {hoveredPosition === position.id &&
                            position.name !== "Professeurs" && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex space-x-1"
                              >
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPositionToEdit(position);
                                  }}
                                  className="text-blue-500 hover:text-blue-600 p-0.5 sm:p-1 cursor-pointer"
                                  title={translate("edit", language)}
                                >
                                  <Edit size={14} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(position);
                                  }}
                                  className="text-red-500 hover:text-red-600 p-0.5 sm:p-1 cursor-pointer"
                                  title={translate("delete", language)}
                                >
                                  <Trash size={14} />
                                </motion.button>
                              </motion.div>
                            )}
                        </AnimatePresence>

                        {/* description Shower Icon */}
                        {position.description && (
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => toggleDescription(position.id, e)}
                            className={`${buttonColor} p-0.5 sm:p-1 ml-1`}
                            title={
                              expandedDescriptions[position.id]
                                ? translate("hide_desciption", language)
                                : translate("show_desciption", language)
                            }
                          >
                            <Info size={14} />
                          </motion.button>
                        )}
                      </div>
                    </button>

                    {/* Description collapsible section */}
                    <AnimatePresence>
                      {expandedDescriptions[position.id] &&
                        position.description && (
                          <motion.div
                            variants={descriptionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={`mx-2 sm:mx-3 mb-2 rounded ${descriptionBgColor} border ${borderColor} text-sm`}
                          >
                            <div
                              className={`
                            flex items-center border-b border-b-1 p-1 sm:p-2
                            ${theme === "dark" ? "" : "bg-gray-200"}
                          `}
                            >
                              <span
                                className={`text-xs mb-0 sm:mb-1 font-medium ${_text_color} opacity-70`}
                              >
                                {translate("description", language)}
                              </span>
                            </div>
                            <div className="text-xs p-1.5 sm:p-2">
                              {formatDescription(
                                return_prof_desc_trans(
                                  position.name,
                                  position.description.trim(),
                                  language
                                )
                              )}
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
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-4 sm:p-6 rounded-lg shadow-xl max-w-md mx-auto`}
            >
              <h3
                className={`text-base sm:text-xl font-semibold mb-2 sm:mb-4 ${_text_color}`}
              >
                {translate("confirm_delete", language)}
              </h3>
              <p className={`${_text_color} mb-4 sm:mb-6 text-sm sm:text-base`}>
                {translate("delete_poste_alert_message", language)} "
                {confirmDelete.name}" ?
                {confirmDelete.employeeCount > 0 && (
                  <span className="text-red-500 block mt-2 font-semibold text-xs sm:text-sm">
                    {translate("attention", language)} :{" "}
                    {confirmDelete.employeeCount}{" "}
                    {translate("msg_occupation", language)}
                    <br />
                    {translate("msg_delete_poste_info", language)}
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmDelete(null)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } ${_text_color}`}
                >
                  {translate("cancel", language)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeletePosition(confirmDelete.id)}
                  disabled={false}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm text-white bg-red-500 hover:bg-red-600`}
                >
                  {translate("delete", language)}
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
