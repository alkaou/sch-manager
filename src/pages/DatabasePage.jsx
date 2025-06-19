import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import DatabaseManager from "../components/db_manager/DatabaseManager.jsx";
import NotConnectedView from "../components/db_manager/NotConnectedView.jsx";
import translations from "../components/db_manager/db_manager_translator";
import { useLanguage } from "../components/contexts";

const DatabasePageContent = ({
  app_bg_color,
  text_color,
  theme,
  setLoginModalOpen,
}) => {
  const [networkIsAvailavle, setNetworkIsAvailavle] = useState(false);
  const { isAuthenticated, currentUser, checkInternetConnection } = useAuth();
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  // Translation function
  const translation = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkInternetConnection();
      if (isConnected && isAuthenticated) {
        setNetworkIsAvailavle(true);
        // console.log(currentUser);
      }
      setLoading(false);
    };
    checkConnection();
  }, [currentUser, isAuthenticated]);

  if (loading) {
    return (
      <div style={{ marginLeft: "4%" }} className={`p-4 mt-20 min-h-screen ${app_bg_color}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen ${app_bg_color} overflow-auto scrollbar-custom`}
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl text-center font-bold mb-6 mt-5 ${text_color}`}>
          {translation("database_manager_title")}
        </h1>

        {currentUser && networkIsAvailavle && isAuthenticated ? (
          <DatabaseManager
            user={currentUser}
            theme={theme}
            textColor={text_color}
            bgColor={app_bg_color}
          />
          // <div/>
        ) : (
          <NotConnectedView
            theme={theme}
            setLoginModalOpen={setLoginModalOpen}
            isAuthenticated={isAuthenticated}
          />
        )}
      </motion.div>
    </div>
  );
};

const DatabasePage = () => {
  const context = useOutletContext();
  return <DatabasePageContent {...context} />;
};

export default DatabasePage;
