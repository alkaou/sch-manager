import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserDatabases } from "../../auth/firebaseFirestore";
import DatabaseList from "./DatabaseList.jsx";
import DatabaseDetails from "./DatabaseDetails.jsx";
import CreateDatabaseForm from "./CreateDatabaseForm.jsx";
import { FaPlus, FaDatabase } from "react-icons/fa";
import translations from "./db_manager_translator";
import { useLanguage } from "../contexts";

const DatabaseManager = ({ user, theme, textColor, bgColor }) => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  const { language } = useLanguage();

  // Translation function
  const translation = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  useEffect(() => {
    fetchDatabases();
  }, [user]);

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      if (!user) {
        // Handle not authenticated case
        setDatabases([]);
        return;
      }
      
      const _databases = await getUserDatabases(user.uid);
      setDatabases(_databases);
    } catch (error) {
      console.error("Error fetching databases:", error);
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseSelect = (database) => {
    setSelectedDatabase(database);
  };

  const handleCloseDetails = () => {
    setSelectedDatabase(null);
  };

  const handleDatabaseCreated = () => {
    setIsCreating(false);
    fetchDatabases();
  };

  const _textColor = theme === "dark" ? textColor : "text-gray-700";
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`p-6 rounded-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaDatabase className={`mr-3 text-2xl ${_textColor}`} />
            <h2 className={`text-2xl font-bold ${_textColor}`}>
              {translation("my_databases")}
            </h2>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium transition-colors`}
          >
            <FaPlus />
            {translation("new_database")}
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DatabaseList 
            databases={databases} 
            onSelect={handleDatabaseSelect} 
            theme={theme}
            textColor={_textColor}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {selectedDatabase && (
          <DatabaseDetails
            database={selectedDatabase}
            onClose={handleCloseDetails}
            onUpdate={fetchDatabases}
            theme={theme}
            textColor={_textColor}
            user={user}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreating && (
          <CreateDatabaseForm
            onClose={() => setIsCreating(false)}
            onDatabaseCreated={handleDatabaseCreated}
            theme={theme}
            textColor={_textColor}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;