import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import DatabaseManager from "../components/db_manager/DatabaseManager.jsx";
import NotConnectedView from "../components/db_manager/NotConnectedView.jsx";

const DatabasePageContent = ({
  app_bg_color,
  text_color,
  theme,
  setLoginModalOpen,
}) => {
  const [networkIsAvailavle, setNetworkIsAvailavle] = useState(false);
  const { isAuthenticated, currentUser, checkInternetConnection } = useAuth();
  const [loading, setLoading] = useState(true);

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
      <div className={`p-4 mt-20 ml-20 min-h-screen ${app_bg_color}`}>
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
    <div className={`p-4 mt-20 ml-20 min-h-screen ${app_bg_color}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl text-center font-bold mb-6 ${text_color}`}>
          Gestionnaire de Base de Données
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
            textColor={text_color}
            setLoginModalOpen={setLoginModalOpen}
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
