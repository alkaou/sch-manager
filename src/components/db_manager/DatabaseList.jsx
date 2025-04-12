import React from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaCalendarAlt, FaEdit } from "react-icons/fa";

const DatabaseList = ({ databases, onSelect, theme, textColor }) => {
  const isDark = theme === "dark";

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date inconnue";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (databases.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-12 rounded-lg ${
          isDark ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <FaDatabase className={`mx-auto text-4xl mb-4 ${textColor} opacity-50`} />
        <h3 className={`text-xl font-medium ${textColor}`}>
          Aucune base de données trouvée
        </h3>
        <p className={`mt-2 ${textColor} opacity-70`}>
          Créez votre première base de données pour commencer à sauvegarder vos données.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {databases.map((database) => (
        <motion.div
          key={database.id}
          variants={item}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onClick={() => onSelect(database)}
          className={`cursor-pointer rounded-lg p-5 ${
            isDark ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-100 hover:bg-gray-200"
          } transition-all duration-200`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-3 ${
                isDark ? "bg-gray-600" : "bg-white"
              }`}>
                <FaDatabase className={`text-xl ${textColor}`} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${textColor}`}>
                  {database.name}
                </h3>
                <div className={`flex items-center mt-1 text-sm ${textColor} opacity-70`}>
                  <FaCalendarAlt className="mr-1" />
                  <span>Mis à jour: {formatDate(database.updatedAt)}</span>
                </div>
              </div>
            </div>
            <div className={`p-2 rounded-full ${
              isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-300"
            }`}>
              <FaEdit className={`text-sm ${textColor}`} />
            </div>
          </div>
          
          {database.description && (
            <p className={`mt-3 text-sm ${textColor} opacity-80 line-clamp-2`}>
              {database.description}
            </p>
          )}
          
          <div className={`mt-3 text-xs ${textColor} opacity-60`}>
            Créé le: {formatDate(database.createdAt)}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DatabaseList;