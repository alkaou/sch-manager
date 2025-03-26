import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PayementsSidebar from "../components/payements/PayementsSidebar.jsx";
import PayementsTabs from "../components/payements/PayementsTabs.jsx";
import PayementsConfig from "../components/payements/PayementsConfig.jsx";
import PayementsMonthlyClass from "../components/payements/PayementsMonthlyClass.jsx";
import PayementsYearlyClass from "../components/payements/PayementsYearlyClass.jsx";
import PayementsMonthlyTotal from "../components/payements/PayementsMonthlyTotal.jsx";
import PayementsYearlyTotal from "../components/payements/PayementsYearlyTotal.jsx";
import PayementsStudentList from "../components/payements/PayementsStudentList.jsx";

const PayementsPage = () => {
  const context = useOutletContext();
  const { app_bg_color, text_color, theme } = context;

  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(null);
  const [paymentSystems, setPaymentSystems] = useState([]);

  // Largeur fixe du sidebar
  const sidebarWidth = 280;

  const refreshData = () => {
    window.electron.getDatabase().then((data) => {
      setDb(data);
    });
  };

  // Charger la base de données
  useEffect(() => {
    refreshData();
  }, []);

  // Rendu du contenu principal en fonction de l'onglet actif
  const renderContent = () => {
    if (selectedClass) {
      return <PayementsStudentList
        selectedClass={selectedClass}
        db={db}
        refreshData={refreshData}
        theme={theme}
        app_bg_color={app_bg_color}
        text_color={text_color}
        system={selectedPaymentSystem}
      />;
    }

    switch (activeTab) {
      case 0:
        return <PayementsConfig
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      case 1:
        return <PayementsMonthlyClass
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      case 2:
        return <PayementsYearlyClass
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      case 3:
        return <PayementsMonthlyTotal
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      case 4:
        return <PayementsYearlyTotal
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      default:
        return <PayementsConfig
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
    }
  };

  // Styles en fonction du thème
  const mainBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textColorClass = theme === "dark" ? text_color : "text-gray-800";

  return (
    <div
      className={`flex ${mainBgColor} ${textColorClass}`}
      style={{
        overflow: "hidden",
        marginTop: "4%",
        marginLeft: "5%",
        width: "95%",
        maxWidth: "95%",
        minWidth: "95%",
        // height: "91vh",
      }}
    >
      {/* Sidebar avec largeur fixe */}
      <div
        className="h-screen overflow-hidden"
        style={{ width: `${sidebarWidth}px` }}
      >
        <PayementsSidebar
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedPaymentSystem={selectedPaymentSystem}
          setSelectedPaymentSystem={setSelectedPaymentSystem}
          paymentSystems={paymentSystems}
          setPaymentSystems={setPaymentSystems}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Système d'onglets */}
        <PayementsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          setSelectedClass={setSelectedClass}
        />

        {/* Contenu dynamique */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedClass?.id || 'none'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PayementsPage;
