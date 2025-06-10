import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PayementsSidebar from "../components/payements/PayementsSidebar.jsx";
import PayementsTabs from "../components/payements/PayementsTabs.jsx";
import PayementsConfig from "../components/payements/PayementsConfig.jsx";
import PayementsMonthlyClass from "../components/payements/PayementsMonthlyClass.jsx";
import PayementsYearlyClass from "../components/payements/PayementsYearlyClass.jsx";
import PayementsMonthlyStatistique from "../components/payements/PayementsMonthlyStatistique.jsx";
import PayementsYearlyStatistique from "../components/payements/PayementsYearlyStatistique.jsx";
import PayementsStudentList from "../components/payements/PayementsStudentList.jsx";

const PayementsPage = () => {
  const context = useOutletContext();
  const { app_bg_color, text_color, theme } = context;

  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(null);
  const [paymentSystems, setPaymentSystems] = useState([]);

  // Responsive sidebar width based on screen size
  const sidebarWidth = {
    base: "240px",  // Default for small screens
    md: "260px",    // Medium screens
    lg: "280px",    // Large screens
  };

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
        return <PayementsMonthlyStatistique
          db={db}
          refreshData={refreshData}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />;
      case 4:
        return <PayementsYearlyStatistique
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


  return (
    <div
      style={{ marginLeft: "4%", height: "100vh" }}
      className={`overflow-hidden flex flex-col sm:flex-row h-screen ${app_bg_color} ${text_color}`}
    >
      {/* Sidebar with responsive width */}
      <div
        className="h-full overflow-hidden"
        style={{
          width: `clamp(${sidebarWidth.base}, 20vw, ${sidebarWidth.lg})`,
          minWidth: sidebarWidth.base,
          maxWidth: sidebarWidth.lg,
        }}
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

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginTop: "4.5%" }}
      >
        {/* Tab system */}
        <PayementsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          setSelectedClass={setSelectedClass}
        />

        {/* Dynamic content with responsive padding */}
        <div className="flex-1 overflow-auto scrollbar-custom p-2 sm:p-3 md:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedClass?.id || 'none'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full scrollbar-custom"
            >
              <div className="pb-2">
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PayementsPage;
