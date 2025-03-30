import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Edit2, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const StudentListMenu = ({
  savedLists,
  setView,
  setCurrentList,
  deleteList,
  theme,
  app_bg_color,
  text_color,
}) => {
  // Styles based on theme
  const cardBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardHoverColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const textClass = theme === "dark" ? text_color : "text-gray-700";
  const secondaryTextClass = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${textClass}`}>Gestion des Listes d'Élèves</h1>
      </div>

      {/* Create new list button */}
      <motion.div
        className={`${cardBgColor} rounded-lg shadow-lg border ${borderColor} p-6 mb-8 cursor-pointer`}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setCurrentList(null);
          setView("create");
        }}
      >
        <div className="flex items-center justify-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <Plus className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${textClass}`}>Créer une nouvelle liste</h2>
            <p className={secondaryTextClass}>Créez une liste personnalisée avec les élèves et les informations de votre choix</p>
          </div>
        </div>
      </motion.div>

      {/* Saved lists */}
      {savedLists.length > 0 && (
        <>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Listes enregistrées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLists.map((list) => (
              <motion.div
                key={list.id}
                className={`${cardBgColor} rounded-lg shadow border ${borderColor} p-4 ${cardHoverColor}`}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <FileText className={`h-5 w-5 mr-2 mt-1 ${textClass}`} />
                    <div>
                      <h3 className={`font-medium ${textClass}`}>{list.name}</h3>
                      <p className={`text-sm ${secondaryTextClass}`}>
                        {list.students?.length || 0} élèves • {list.headers?.filter(h => h.selected).length || 0} colonnes
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {list.updatedAt ? 
                          formatDistanceToNow(new Date(list.updatedAt), { addSuffix: true, locale: fr }) : 
                          "Date inconnue"}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setCurrentList(list);
                        setView("edit");
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </motion.button>
                    <motion.button
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette liste ?")) {
                          deleteList(list.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {savedLists.length === 0 && (
        <div className={`text-center p-8 ${borderColor} border rounded-lg ${cardBgColor}`}>
          <FileText className={`h-12 w-12 mx-auto mb-4 ${secondaryTextClass}`} />
          <h3 className={`text-lg font-medium ${textClass} mb-2`}>Aucune liste enregistrée</h3>
          <p className={secondaryTextClass}>Créez votre première liste en cliquant sur le bouton ci-dessus</p>
        </div>
      )}
    </motion.div>
  );
};

export default StudentListMenu;